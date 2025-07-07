import { Router } from 'express';
<<<<<<< HEAD
import { postNewUser,
            getUsers,
            getUserById } from '../controllers/userController.js';
=======
import { postNewUser, getAllUsers, getUserById } from '../controllers/userController.js';
>>>>>>> master

const userRouter = Router();

<<<<<<< HEAD
router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.post('/users', postNewUser);

export default router;
=======
userRouter.post('/users', postNewUser);
userRouter.get('/users', getAllUsers);
userRouter.get('/user/:id', getUserById);

export default userRouter;

>>>>>>> master
