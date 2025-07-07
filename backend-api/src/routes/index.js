import { Router } from 'express';
import userRouter from './userRoutes.js';
import nftRouter from './nftRoutes.js';
import { getStatus, getStats } from '../controllers/appController.js';

const router = Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.use(userRouter);
router.use(nftRouter);

export default router;

