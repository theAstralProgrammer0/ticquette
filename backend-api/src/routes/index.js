import { Router } from 'express';
import userRoutes from './userRoutes';
import nftRoutes from './nftRoutes';
import { getStatus, getStats } from '../controllers/appController.js';

const router = Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.use(userRoutes);
router.use(nftRoutes);

export default router;

