import express from "express";
import * as productController from '../controllers/productController.js'

// Router variable to make routing possible.
// mergeParams: true lets us take the parent's id from the url.
const router = express.Router({ mergeParams: true });

// Methods for address http://foo.com/api/restaurants/:id/products
router.route('/')
    .get(productController.getRestaurantProds)
    //.post(productController.addProdToRest)
export default router;