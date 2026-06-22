import express from "express";
import * as productController from '../controllers/productController.js';
import { verifyRestaurant, verifyProduct, isLoggedIn } from '../middleware/validationMiddleware.js';
import { upload } from '../controllers/multerImageController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(verifyRestaurant, isLoggedIn, productController.getRestaurantProds)
    .post(verifyRestaurant, isLoggedIn, upload.single('image'), productController.addProdToRest);

router.route('/:pId')
    .get(verifyRestaurant, verifyProduct, isLoggedIn, productController.getProductById)
    .patch(verifyRestaurant, verifyProduct, isLoggedIn, upload.single('image'), productController.editProduct)
    .delete(verifyRestaurant, verifyProduct, isLoggedIn, productController.deleteProduct);

export default router;