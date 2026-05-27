import express from "express";
import * as restaurantController from '../controllers/restaurantController.js'
import productRoutes from './productRoutes.js'
// Router variable to make routing possible.
const router = express.Router();

// Methods for address http://foo.com/api/restaurants

// Use controller func to get a list of all retaurants.
router.get('/', restaurantController.getAllRestaurants);

// Use controller func to create a new restaurant.
router.post('/', restaurantController.createRestaurant);

// Methods for address http://foo.com/api/restaurants/:id
router.route('/:id')
    .get(restaurantController.getRestaurantById)
    .patch(restaurantController.editRestaurantInfo)
    .delete(restaurantController.DeleteRestaurant)

// I am handing off the product routes to the new file
router.use('/:id/products', productRoutes);

// export router so app.js can use it for routing.
export default router;