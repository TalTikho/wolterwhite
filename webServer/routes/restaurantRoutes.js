import express from "express";
import * as restaurantController from '../controllers/restaurantController.js'

// Router variable to make routing possible.
const router = express.Router();

// Methods for address http://foo.com/api/restaurants

// Use controller func to get a list of all retaurants.
router.get('/', restaurantController.getAllRestaurants);

// Use controller func to create a new restaurant.
router.post('/', restaurantController.createRestaurant);

// export router so app.js can use it for routing.
export default router;