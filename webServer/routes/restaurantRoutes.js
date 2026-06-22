import express from "express";
import * as restaurantController from '../controllers/restaurantController.js';
import productRoutes from './productRoutes.js';
import { isLoggedIn } from "../middleware/validationMiddleware.js";
import { upload } from '../controllers/multerImageController.js';

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);

router.post('/', upload.single('image'), restaurantController.createRestaurant);

router.route('/:id')
    .get(isLoggedIn, restaurantController.getRestaurantById)
    .patch(isLoggedIn, upload.single('image'), restaurantController.editRestaurantInfo)
    .delete(isLoggedIn, restaurantController.DeleteRestaurant);

router.use('/:id/products', productRoutes);

export default router;