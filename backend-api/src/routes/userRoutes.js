import { Router } from 'express';
import { postNewUser, getAllUsers, getUserById } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/users', postNewUser);
userRouter.get('/users', getAllUsers);
userRouter.get('/user/:id', getUserById);

export default userRouter;

