import express from "express";
import * as productController from '../controllers/productController.js'
import { verifyRestaurant, verifyProduct, isLoggedIn } from '../middleware/validationMiddleware.js';

// Router variable to make routing possible.
// mergeParams: true lets us take the parent's id from the url.
const router = express.Router({ mergeParams: true });

// Methods for address http://foo.com/api/restaurants/:id/products
router.route('/')
    .get(verifyRestaurant, isLoggedIn, productController.getRestaurantProds)
    .post(verifyRestaurant, isLoggedIn, productController.addProdToRest)

// Methods for address http://foo.com/api/restaurants/:id/products/:pId
router.route('/:pId')
    //Double log in protection on products.
    .get(verifyRestaurant, verifyProduct, isLoggedIn, productController.getProductById)
    .patch(verifyRestaurant,verifyProduct, isLoggedIn, productController.editProduct)
    .delete(verifyRestaurant, verifyProduct, isLoggedIn, productController.deleteProduct)

export default router;