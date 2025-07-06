import { Router } from 'express';
import { postNewUser } from '../controllers/userController';

const router = Router();

router.post('/users', postNewUser);

export default router;

