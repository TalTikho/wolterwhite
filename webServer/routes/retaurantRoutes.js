import express from ('express');
import retaurantController from '../controllers/restaurantController.js'

// Router variable to make routing possible.
const router = express.Router();

// Use controller func to get a list of all retaurants.
router.get('/', retaurantController.getAllRestaurants);