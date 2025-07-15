/**
 * Import required modules
 */
import { Router } from 'express';
import { 
  postNewUser, 
  getAllUsers, 
  getUserById 
} from '../controllers/userController.js';

/**
 * Create a new Express router instance for user-related routes
 */
const userRouter = Router();

/**
 * Define user-related routes
 */
userRouter.post('/users', postNewUser); // Create a new user
userRouter.get('/users', getAllUsers); // Get all users
userRouter.get('/user/:id', getUserById); // Get a user by ID

/**
 * Export the user router instance
 */
export default userRouter;