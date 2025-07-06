import { Router } from 'express';
import { mintNFT, getAllNFTs, getNFTByTokenId } from '../controllers/nftController.js';

const router = Router();

router.post('/mint', mintNFT);
router.get('/nfts', getAllNFTs);
router.get('/nft/:tokenId', getNFTByTokenId);

export default router;

