import express from 'express';
import { Router } from 'express';
import { mintNFT } from '../controllers/nftController';

const router = Router();

router.post('/mint', mintNFT);

export default router;

