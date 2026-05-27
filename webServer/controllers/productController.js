import * as productModel from '../models/productModel.js';

// We only need this function from restaurantModel because products are dependant on a restaurant.
// WIthout a database the products need to be in the restaurant's json.
import { getRestaurantById } from '../models/restaurantModel.js';

export const getRestaurantProds = (req, res) => {
    const restaurant = getRestaurantById(req.params.id);
    // No restaurant so the request is logical but the parameter (id) is wrong.
    if (!restaurant)
        return res.status(404).json({ error: 'Restaurant not found' });
    // Use the restaurant object obtainted by id from the url to get its products.
    const products = productModel.getRestaurantProds(restaurant);

    // An empty list is still valid and every restaurant starts with an empty products array.
    res.status(200).location(`/api/restaurants/${req.params.id}/products`).json(products);

}