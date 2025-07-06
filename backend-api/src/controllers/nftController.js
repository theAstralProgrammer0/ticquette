import { pinMetadataToIPFS } from '../utils/ipfsUtils.js';
import { mintOnBlockchain } from '../utils/contractUtils.js';
import NFT from '../models/NFT.js';
import { validateMetadata } from '../utils/validation.js';

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
  res.status(200).json(nfts);
};

export const getNFTByTokenId = async (req, res) => {
  const nft = await NFT.findOne({ tokenId: req.params.tokenId });
  if (!nft) return res.status(404).json({ error: 'NFT not found' });
  res.status(200).json(nft);
};

