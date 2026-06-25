import jwt from 'jsonwebtoken';
import { getProductById } from '../services/productService.js';
import { getRestaurantById } from '../services/restaurantService.js';
// for safety reasons the env files are in .gitignore so hardcoded 5000 is a fallback
const key = process.env.JWT_SECRET || "BlueStuff@"
export const isLoggedIn = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
            console.log('The logged in user is: ' + data.displayName);
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
export const verifyRestaurant = async (req, res, next) => {
    // Use the restaurant object obtainted by id from the url to get its products.
    // getRestaurantById is async now (Mongoose), so this middleware needs
    // to be async too — without the await, `restaurant` would be a pending
    // Promise (always truthy) instead of the actual document or null.
    const restaurant = await getRestaurantById(req.params.id);
    // No restaurant so the request is logical but the parameter (id) is wrong.
    if (!restaurant)
        return res.status(404).json({ error: 'Restaurant not found' });
    // Attach restaurant to the request for the methods to take.
    req.currentRestaurant = restaurant;
    // Move to the actual logic after verification is good.
    next()
}

// Check if a product exists for delete, patch and getById.
// Stays synchronous — getProductById in productService.js doesn't touch
// the DB, it just reads restaurant.products, which is already in memory.
// Now async — getProductById queries the Product collection directly
// by _id instead of searching the in-memory embedded array.
export const verifyProduct = async (req, res, next) => {
  const product = await getProductById(req.params.pId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  req.currentProduct = product;
  next();
};