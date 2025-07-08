import { Router } from 'express';
import { mintNFT, getAllNFTs, getNFTByTokenId, transferNFTOwnership } from '../controllers/nftController.js';

const nftRouter = Router();

nftRouter.post('/mint', mintNFT);
nftRouter.get('/nfts', getAllNFTs);
nftRouter.get('/nft/:tokenId', getNFTByTokenId);
nftRouter.put('/nft/:tokenId/transferOwnership', transferNFTOwnership);

export default nftRouter;

