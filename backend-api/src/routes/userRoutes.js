import { Router } from 'express';
import { postNewUser,
            getUsers,
            getUserById } from '../controllers/userController.js';

const router = Router();

router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.post('/users', postNewUser);

export default router;
