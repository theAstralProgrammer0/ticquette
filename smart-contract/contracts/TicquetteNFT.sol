// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Ensure this import is present

contract TicquetteNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => uint256[]) public ownerTokens;

    event TicquetteMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI,
        uint256 expirationDate // Event declaration expects this
    );

    event LeaseTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address initialOwner) ERC721("TicquetteNFT", "TICQ") {
        // Correct way to transfer ownership after ERC721 initialization
        _transferOwnership(initialOwner);
    }

    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Add to owner's token list
        ownerTokens[to].push(tokenId);

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Calculate a default expiration date for the event, e.g., 1 year from now
        uint256 defaultExpirationDate = block.timestamp + (365 * 24 * 60 * 60); // 1 year in seconds

        // Emit the event with all declared arguments
        emit TicquetteMinted(tokenId, to, uri, defaultExpirationDate);
        return tokenId;
    }

    function getOwnerTokens(address owner) public view returns (uint256[] memory) {
        return ownerTokens[owner];
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        _removeTokenFromOwnerList(from, tokenId);
        ownerTokens[to].push(tokenId);
        super.transferFrom(from, to, tokenId);
        emit LeaseTransferred(tokenId, from, to);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721, IERC721) {
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

