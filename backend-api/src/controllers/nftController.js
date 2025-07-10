import { pinMetadataToIPFS } from '../utils/ipfsUtils.js';
import { mintOnBlockchain } from '../utils/contractUtils.js';
import NFT from '../models/NFT.js';
import { validateMetadata } from '../utils/validation.js';
import redisClient from '../config/redis.js';

export const mintNFT = async (req, res) => {
  try {
    const { walletAddress, ...metadata } = req.body;

    const validationError = validateMetadata(metadata);
    if (!walletAddress) return res.status(400).json({ error: 'Wallet address required' });
    if (validationError) return res.status(400).json({ error: validationError });

    /* Check Redis cache */
    const cacheKey = `mint:${walletAddress}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(429).json({ error: 'Minting too frequently. Please wait...' });

    /* Save cache entry for 30 sec. to prevent spam */
    await redisClient.set(cacheKey, 'true', 30);

    /* 1. Pin metadata to IPFS */
    const metadataCID = await pinMetadataToIPFS(metadata);

    /* 2. Interact with smart contract to mint */
    const { tokenId, expirationDate, receipt } = await mintOnBlockchain(walletAddress, metadataCID, metadata);

    /* 3. Save to DB */
    const nft = await NFT.create({
      tokenId,
      metadataCID,
      owner: walletAddress,
      leaseDuration: metadata.durationOfLease,
      expirationDate
    });

    res.status(201).json({ nft, receipt });
  } 
  catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Minting failed' });
  }
};

export const getAllNFTs = async (req, res) => {
  const nfts = await NFT.find();
  if (!nfts || nfts.length === 0) return res.status(404).json({ error: 'No NFTs found' });
  res.status(200).json(nfts);
};

export const getNFTByTokenId = async (req, res) => {
  console.log(req.params.tokenId);
  const nft = await NFT.findOne({ tokenId: req.params.tokenId });
  if (!nft) return res.status(404).json({ error: 'NFT not found' });
  res.status(200).json(nft);
};

export const transferNFTOwnership = async (req, res) => {
  const { tokenId } = req.params;
  const { newWalletAddress } = req.body;

  if(!newWalletAddress) {
    return res.status(404).json({ error: 'New wallet address is required' });
  }
  
  try {
    // Find the NFT by tokenId
    const nft = await NFT.findOne({ tokenId })
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }


    //Update the owner
    nft.owner = newWalletAddress;
    
    await nft.save();

    res.status(200).json({ message: 'Ownership transferred successfully', nft });
  } catch (error) {
    console.error("Error transferring NFT ownership:", error);
  }
}
