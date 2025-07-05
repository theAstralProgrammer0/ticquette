import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';

/* create router */
const router = Router();

/* map all controllers to their routes */

router.get('/status', AppController.getStatus);
router.get('

