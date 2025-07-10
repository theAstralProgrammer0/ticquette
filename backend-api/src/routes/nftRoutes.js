/**
 * Import required modules
 */
import { Router } from 'express';
import { 
  mintNFT, 
  getAllNFTs, 
  getNFTByTokenId, 
  transferNFTOwnership 
} from '../controllers/nftController.js';

/**
 * Create a new Express router instance for NFT-related routes
 */
const nftRouter = Router();

/**
 * Define NFT-related routes
 */
nftRouter.post('/mint', mintNFT); // Mint a new NFT
nftRouter.get('/nfts', getAllNFTs); // Get all NFTs
nftRouter.get('/nft/:tokenId', getNFTByTokenId); // Get an NFT by token ID
nftRouter.put('/nft/:tokenId/transferOwnership', transferNFTOwnership); // Transfer ownership of an NFT

/**
 * Export the NFT router instance
 */
export default nftRouter;