import { Router } from 'express';
import { postNewUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/users', postNewUser);

export default userRouter;

