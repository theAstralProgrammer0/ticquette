<<<<<<< HEAD
import { Router } from "express";
import userController from "../controllers/userController.js"

const router = Router();

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);

export default router;
=======
import { Router } from 'express';
import { postNewUser } from '../controllers/userController';

const router = Router();

router.post('/users', postNewUser);

export default router;

>>>>>>> master
