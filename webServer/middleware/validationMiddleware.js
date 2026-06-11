import jwt from 'jsonwebtoken';
import { getProductById } from '../models/productModel.js';
import { getRestaurantById } from '../models/restaurantModel.js';
// for safety reasons the env files are in .gitignore so hardcoded 5000 is a fallback
const key = process.env.JWT_SECRET || "BlueStuff@"
export const isLoggedIn = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
            console.log('The logged in user is: ' + data.username);
            req.userId = data.id;
            return next()
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}


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

// Check if a product exists for delete, patch and getById.
export const verifyProduct = (req, res, next) => {
    const restaurant = req.currentRestaurant;
    const product = getProductById(req.params.pId, restaurant);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    req.currentProduct = product;

    next()

}