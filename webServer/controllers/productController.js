import * as productModel from '../models/productModel.js';

import crypto from 'crypto'; 
const is_user_connected = false;
// guest does not need an id. It is just default for a state without connected users.
const guest_user_id = 'guest' +  crypto.randomUUID().toString();



// We only need this function from restaurantModel because products are dependant on a restaurant.
// WIthout a database the products need to be in the restaurant's json.
import { getRestaurantById } from '../models/restaurantModel.js';
import { sendAndReceive } from './cppClient.js'

// This check if a restaurant is "real" is relevant for each of the product methods
// as products are a restaurant's products and not standalone objects.
// It is a middleware function saving us from redundant code checking validity in each method in this file.
export const verifyRestaurant = (req, res, next) => {
    // Use the restaurant object obtainted by id from the url to get its products.
    const restaurant = getRestaurantById(req.params.id);
    // No restaurant so the request is logical but the parameter (id) is wrong.
    if (!restaurant)
        return res.status(404).json({ error: 'Restaurant not found' });
    // Attach restaurant to the request for the methods to take.
    req.currentRestaurant = restaurant;
    // Move to the actual logic after verification is good.
    next()
}

export const getRestaurantProds = async (req, res) => {

    const restaurant = req.currentRestaurant;
    const products = productModel.getRestaurantProds(restaurant);

    // For each product in the restaurant (if its product array isn't empty) add a view in the user id's list using the cpp server.
    for (const product of products) {
        if (!is_user_connected) {
            const serverReply  = await sendAndReceive(`patch ${guest_user_id} ${product.pid}`)
            console.log("Reply:", serverReply);
            if (serverReply.includes("400") || serverReply.includes("404")){
                await sendAndReceive(`post ${guest_user_id} ${product.pid}`).then(reply => console.log("Reply:", reply));
            }
        }
    };
    // An empty list is still valid and every restaurant starts with an empty products array. 
    res.status(200).location(`/api/restaurants/${req.params.id}/products`).json(products);

};

export const addProdToRest = (req, res) => {
    const restaurant = req.currentRestaurant;
    const productInfo = req.body;
    if (
        !productInfo.pname?.trim() ||
        !productInfo.pdescription.trim() ||
        !productInfo.price.trim()
    )
        return res.status(400).json({
            error: "All fields must be filled"
        });
    // succesful post is 201 Created
    const newProd = productModel.addProdToRest(restaurant, productInfo);
    res.status(201).location(`/api/restaurants/${restaurant.id}/products/${newProd.pid}`).json(newProd);
}

