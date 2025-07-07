import { Router } from 'express';
import { mintNFT, getAllNFTs, getNFTByTokenId } from '../controllers/nftController.js';

const nftRouter = Router();

nftRouter.post('/mint', mintNFT);
nftRouter.get('/nfts', getAllNFTs);
nftRouter.get('/nft/:tokenId', getNFTByTokenId);

export default nftRouter;

