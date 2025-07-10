/**
 * Import required modules
 */
import { Router } from 'express';
import userRouter from './userRoutes.js';
import nftRouter from './nftRoutes.js';
import { getStatus, getStats } from '../controllers/appController.js';

/**
 * Create a new Express router instance
 */
const router = Router();

/**
 * Define routes for the application
 */
router.get('/status', getStatus); // Get the status of the application
router.get('/stats', getStats); // Get statistics about the application

/**
 * Mount user and NFT routes
 */
router.use(userRouter); // Handle user-related routes
router.use(nftRouter); // Handle NFT-related routes

/**
 * Export the router instance
 */
export default router;