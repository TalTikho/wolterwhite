import * as productModel from '../models/productModel.js';
import { getAllusers, getUserById } from '../models/userModel.js'

// We only need this function from restaurantModel because products are dependant on a restaurant.
// WIthout a database the products need to be in the restaurant's json.
import { getRestaurantById } from '../models/restaurantModel.js';
import { sendAndReceive } from '../cppClient.js'

import crypto from 'crypto';


const users = getAllusers();


export const getRestaurantProds = async (req, res) => {

    const restaurant = req.currentRestaurant;
    const products = productModel.getRestaurantProds(restaurant);
    // isLoggedIn middleware installed the userid if successful, guest if no user is connected and we had no bouncer
    const userID = req.userId || 'guest_' + crypto.randomUUID().toString();

    // For each product in the restaurant (if its product array isn't empty) add a view in the user id's list using the cpp server.
    // The list could be empty and then the run just continues.
    for (const product of products) {
        // We need await to not mess multiple requests to the views server.
        const serverReply = await sendAndReceive(`patch ${userID} ${product.pId}`)
        console.log("Reply:", serverReply);
        // User is not yet in the views file. The views server is blind to the js server's data.
        if (serverReply.includes("400") || serverReply.includes("404")) {
            await sendAndReceive(`post ${userID} ${product.pId}`).then(reply => console.log("Reply:", reply));
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
        !productInfo.pdescription?.trim() ||
        productInfo.price === undefined || productInfo.price === null
    )
        return res.status(400).json({
            error: "All fields must be filled"
        });
    const newProd = productModel.addProdToRest(restaurant, productInfo);

    // 409 conflict - the request is valid, but the name is conflicting.
    if (!newProd) {
        return res.status(409).json({ error: 'Product already exists' });
    }
    // succesful post is 201 Created
    res.status(201).location(`/api/restaurants/${restaurant.id}/products/${newProd.pId}`).json(newProd);
}

export const getProductById = async (req, res) => {
    const product = req.currentProduct;
    // isLoggedIn middleware installed the userid if successful, guest if no user is connected and we had no bouncer
    const userID = req.userId || 'guest_' + crypto.randomUUID().toString();
    const restaurant = req.currentRestaurant;
    // We need await to not mess multiple requests to the views server.
    const serverReply = await sendAndReceive(`patch ${userID} ${product.pId}`)
    console.log("Reply:", serverReply);
    // User is not yet in the views file. The views server is blind to the js server's data.
    if (serverReply.includes("400") || serverReply.includes("404")) {
        await sendAndReceive(`post ${userID} ${product.pId}`).then(reply => console.log("Reply:", reply));
    }
    // verifyProduct already checks if the id is good so we return the product.
    res.status(200).location(`/api/restaurants/${restaurant.id}/products/${product.pId}`).json(product);
}

export const editProduct = (req, res) => {
    // verifyRestaurant and verifyProduct give us the restaurant and product in the request.
    // productInfo is in the request's body
    const userID = req.userId
    const restaurant = req.currentRestaurant;
    const product = req.currentProduct;
    const productInfo = req.body;
    if (
        !productInfo.pname?.trim() &&
        !productInfo.pdescription?.trim() &&
        productInfo.price === undefined && productInfo.price === null
    ) {
        return res.status(400).json({
            error: "At least one field must be filled"
        });
    }
    const Editedproduct = productModel.editProduct(product.pId, productInfo, restaurant);

    // The id is good as verified in verifyProduct so the error is not in the request but in the server.
    // Those are returned automatically.

    // 409 conflict - the request is valid, but the name is conflicting.
    if (!Editedproduct) {
        return res.status(409).json({ error: 'Product already exists' });
    }
    // verifyProduct already checks if the id is good so we return a no content approval.
    res.status(204).end();
}

export const deleteProduct = async (req, res) => {
    // I am using the validations for restaurant and product to fetch them easily.
    const userID = req.userId
    const restaurant = req.currentRestaurant;
    const productPId = req.currentProduct.pId;
    const deletedProduct = productModel.deleteProduct(restaurant, productPId);
    if (deletedProduct == -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Product should not stay in a users' views after deletion
    // as the recommendation alg could in some case recommend it although it is none existent product (!) afterwards.
    // Hence it will be deleted for all of the users in the users array.
    for (const user of users) {
        // We need await to not mess multiple requests to the views server.
        const serverReply = await sendAndReceive(`delete ${user.id} ${productPId}`)
        console.log("Reply:", serverReply);
        // If a user did not view the product it's ok, just an error message 
        // from the cpp client and the code continues running afterwards.

    }

    // We do not need location as after deletion it will be undefined. And no content anyways does not usually have a body.
    res.status(204).end();
}

