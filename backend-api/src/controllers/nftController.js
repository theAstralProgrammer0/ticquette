/**
 * Import required modules
 */
import { pinMetadataToIPFS } from '../utils/ipfsUtils.js';
import { mintOnBlockchain } from '../utils/contractUtils.js';
import NFT from '../models/NFT.js';
import { validateMetadata } from '../utils/validation.js';
import redisClient from '../config/redis.js';

/**
 * Mint a new NFT
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the minted NFT
 */
export const mintNFT = async (req, res) => {
  try {
    // Extract wallet address and metadata from request body
    const { walletAddress, ...metadata } = req.body;

    // Validate metadata
    const validationError = validateMetadata(metadata);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if wallet address is provided
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Check Redis cache to prevent spam
    const cacheKey = `mint:${walletAddress}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(429).json({ error: 'Minting too frequently. Please wait...' });
    }

    // Save cache entry for 30 seconds to prevent spam
    await redisClient.set(cacheKey, 'true', 30);

    // Pin metadata to IPFS
    const metadataCID = await pinMetadataToIPFS(metadata);

    // Interact with smart contract to mint NFT
    const { tokenId, expirationDate, receipt } = await mintOnBlockchain(walletAddress, metadataCID, metadata);

    // Save NFT to database
    const nft = await NFT.create({
      tokenId,
      metadataCID,
      owner: walletAddress,
      leaseDuration: metadata.durationOfLease,
      expirationDate
    });

    // Return minted NFT
    res.status(201).json({ nft, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Minting failed' });
  }
};

/**
 * Get all NFTs
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to an array of NFTs
 */
export const getAllNFTs = async (req, res) => {
  try {
    // Find all NFTs in database
    const nfts = await NFT.find();

    // If no NFTs are found, return not found error
    if (!nfts || nfts.length === 0) {
      return res.status(404).json({ error: 'No NFTs found' });
    }

    // Return all NFTs
    res.status(200).json(nfts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve NFTs' });
  }
};


/**
 * Get NFT by token ID
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the NFT
 */
export const getNFTByTokenId = async (req, res) => {
  // Log token ID for debugging purposes
  console.log(req.params.tokenId);

  // Find NFT by token ID in database
  const nft = await NFT.findOne({ tokenId: req.params.tokenId });

  // If NFT is not found, return not found error
  if (!nft) {
    return res.status(404).json({ error: 'NFT not found' });
  }

  // Return NFT
  res.status(200).json(nft);
};

/**
 * Transfer NFT ownership
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the updated NFT
 */
export const transferNFTOwnership = async (req, res) => {
  // Extract token ID and new wallet address from request parameters and body
  const { tokenId } = req.params;
  const { newWalletAddress } = req.body;

  // Check if new wallet address is provided
  if (!newWalletAddress) {
    return res.status(400).json({ error: 'New wallet address is required' });
  }

  try {
    // Find the NFT by token ID
    const nft = await NFT.findOne({ tokenId });

    // If NFT is not found, return not found error
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Update the owner of the NFT
    nft.owner = newWalletAddress;
    await nft.save();

    // Return updated NFT
    res.status(200).json({ message: 'Ownership transferred successfully', nft });
  } catch (error) {
    // Log error and return internal server error
    console.error("Error transferring NFT ownership:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}