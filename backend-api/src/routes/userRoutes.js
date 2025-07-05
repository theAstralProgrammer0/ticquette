import { Router } from "express";
import userController from "../controllers/userController.js"

const router = Router();

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);

export default router;