//====================================================================================================
// Imports
//====================================================================================================
import mongoose from 'mongoose';
import { productModel } from "./productModel.js";

const Schema = mongoose.Schema;

//====================================================================================================
// Order model
//====================================================================================================
export const orders = [];

/**
 * Creates a new order
 *
 * @param {string} userId     - ID of the user placing the order
 * @param {Object} orderData  - Order data from request body
 * @returns {Object} Newly created order
 */
export const createOrder = (userId, orderData) => {
    const newOrder = {
        userId: userId, // Who placed the order
        restaurantId: orderData.restaurantId, // Which restaurant
        products: orderData.products || [], // Array of product IDs ordered
        status: orderData.status || 'pending', // "pending" | "confirmed" | "delivered" | "cancelled"
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    return newOrder;
};

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    restaurantId: {
        type: String,
        required: true,
    },
    //By reference so updates do not make us update each product individually.
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
    }],
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    }
});


export const User = mongoose.model('Order', orderSchema);

