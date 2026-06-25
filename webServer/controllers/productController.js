import * as productModel from '../models/productModel.js';
import { sendAndReceive } from '../cppClient.js';
import crypto from 'crypto';
import { getAllusers } from '../services/userService.js';


const users = getAllusers();


export const getRestaurantProds = async (req, res) => {
    const restaurant = req.currentRestaurant;
    const products = productModel.getRestaurantProds(restaurant);
    const userID = req.userId || 'guest_' + crypto.randomUUID().toString();

    for (const product of products) {
        const serverReply = await sendAndReceive(`patch ${userID} ${product.pId}`);
        console.log("Reply:", serverReply);
        if (serverReply.includes("400") || serverReply.includes("404")) {
            await sendAndReceive(`post ${userID} ${product.pId}`).then(reply => console.log("Reply:", reply));
        }
    }
    res.status(200).location(`/api/restaurants/${req.params.id}/products`).json(products);
};

export const addProdToRest = (req, res) => {
    const restaurant = req.currentRestaurant;
    const productInfo = req.body;

    if (req.file) {
        productInfo.image = req.file.filename;
    }

    if (
        !productInfo.pname?.trim() ||
        !productInfo.pdescription?.trim() ||
        productInfo.price === undefined || productInfo.price === null
    ) {
        return res.status(400).json({
            error: "All fields must be filled"
        });
    }
        
    const newProd = productModel.addProdToRest(restaurant, productInfo);

    if (!newProd) {
        return res.status(409).json({ error: 'Product already exists' });
    }
    res.status(201).location(`/api/restaurants/${restaurant.id}/products/${newProd.pId}`).json(newProd);
};

export const getProductById = async (req, res) => {
    const product = req.currentProduct;
    const userID = req.userId || 'guest_' + crypto.randomUUID().toString();
    const restaurant = req.currentRestaurant;
    
    const serverReply = await sendAndReceive(`patch ${userID} ${product.pId}`);
    console.log("Reply:", serverReply);
    
    if (serverReply.includes("400") || serverReply.includes("404")) {
        await sendAndReceive(`post ${userID} ${product.pId}`).then(reply => console.log("Reply:", reply));
    }
    res.status(200).location(`/api/restaurants/${restaurant.id}/products/${product.pId}`).json(product);
};

export const editProduct = (req, res) => {
    const restaurant = req.currentRestaurant;
    const product = req.currentProduct;
    const productInfo = req.body;

    if (req.file) {
        productInfo.image = req.file.filename;
    }

    if (
        !productInfo.pname?.trim() &&
        !productInfo.pdescription?.trim() &&
        (productInfo.price === undefined || productInfo.price === null) &&
        !productInfo.image
    ) {
        return res.status(400).json({
            error: "At least one field must be filled"
        });
    }
    
    const Editedproduct = productModel.editProduct(product.pId, productInfo, restaurant);

    if (!Editedproduct) {
        return res.status(409).json({ error: 'Product already exists' });
    }
    res.status(204).end();
};

export const deleteProduct = async (req, res) => {
    const restaurant = req.currentRestaurant;
    const productPId = req.currentProduct.pId;
    const deletedProduct = productModel.deleteProduct(restaurant, productPId);
    if (deletedProduct == -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    for (const user of users) {
        const serverReply = await sendAndReceive(`delete ${user.id} ${productPId}`);
        console.log("Reply:", serverReply);
    }

    res.status(204).end();
};