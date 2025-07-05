// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Import IERC721 explicitly

contract TicquetteNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct TicquetteMetadata {
        string useOfSpace;
        string description;
        string dimensionOfSpace;
        string lga;
        string state;
        string country;
        uint256 durationOfLease; // in seconds
        uint256 createdAt;
        uint256 expirationDate;
        bool isActive;
    }

    mapping(uint256 => TicquetteMetadata) public ticquetteData;
    mapping(address => uint256[]) public ownerTokens;
    
    event TicquetteMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI,
        uint256 expirationDate
    );
    
    event LeaseExpired(uint256 indexed tokenId);
    event LeaseTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address initialOwner) 
        ERC721("TicquetteNFT", "TICQ") 
    {
        // Initialize Ownable with the initialOwner after ERC721
        _transferOwnership(initialOwner);
    }

    function safeMint(
        address to,
        string memory uri,
        string memory _useOfSpace,
        string memory _description,
        string memory _dimensionOfSpace,
        string memory _lga,
        string memory _state,
        string memory _country,
        uint256 _durationOfLease
    ) public onlyOwner returns (uint256) {
        require(_durationOfLease <= 2 * 365 * 24 * 60 * 60, "Lease duration cannot exceed 2 years");
        require(bytes(_useOfSpace).length > 0, "Use of space is required");
        require(bytes(_description).length > 0, "Description is required");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        uint256 currentTime = block.timestamp;
        uint256 expirationDate = currentTime + _durationOfLease;
        
        // Store Ticquette metadata
        ticquetteData[tokenId] = TicquetteMetadata({
            useOfSpace: _useOfSpace,
            description: _description,
            dimensionOfSpace: _dimensionOfSpace,
            lga: _lga,
            state: _state,
            country: _country,
            durationOfLease: _durationOfLease,
            createdAt: currentTime,
            expirationDate: expirationDate,
            isActive: true
        });
        
        // Add to owner's token list
        ownerTokens[to].push(tokenId);
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit TicquetteMinted(tokenId, to, uri, expirationDate);
        
        return tokenId;
    }

    function checkLeaseExpiry(uint256 tokenId) public returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        
        TicquetteMetadata storage metadata = ticquetteData[tokenId];
        
        if (block.timestamp >= metadata.expirationDate && metadata.isActive) {
            metadata.isActive = false;
            emit LeaseExpired(tokenId);
            return true;
        }
        
        return false;
    }

    function isLeaseActive(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        
        TicquetteMetadata memory metadata = ticquetteData[tokenId];
        return metadata.isActive && block.timestamp < metadata.expirationDate;
    }

    function getTicquetteMetadata(uint256 tokenId) public view returns (TicquetteMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return ticquetteData[tokenId];
    }

    function getOwnerTokens(address owner) public view returns (uint256[] memory) {
        return ownerTokens[owner];
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        require(isLeaseActive(tokenId), "Cannot transfer expired lease");
        
        // Update owner token lists
        _removeTokenFromOwnerList(from, tokenId);
        ownerTokens[to].push(tokenId);
        
        super.transferFrom(from, to, tokenId);
        
        emit LeaseTransferred(tokenId, from, to);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721, IERC721) {
        require(isLeaseActive(tokenId), "Cannot transfer expired lease");
        
        // Update owner token lists
        _removeTokenFromOwnerList(from, tokenId);
        ownerTokens[to].push(tokenId);
        
        super.safeTransferFrom(from, to, tokenId, data);
        
        emit LeaseTransferred(tokenId, from, to);
    }

    function _removeTokenFromOwnerList(address owner, uint256 tokenId) private {
        uint256[] storage tokens = ownerTokens[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

