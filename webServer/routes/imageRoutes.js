import { Router } from 'express';
import { isLoggedIn } from '../middleware/validationMiddleware.js';
import  { getImage }  from '../controllers/userController.js';

const router = Router();

router.get('/:filename', isLoggedIn, getImage);

export default router;
