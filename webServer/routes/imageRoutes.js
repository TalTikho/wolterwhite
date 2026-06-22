import { Router } from 'express';
import { getImage } from '../controllers/userController.js';

const router = Router();

// Removed isLoggedIn so HTML <img> tags can fetch images freely
router.get('/:filename', getImage);

export default router;