// models/orderModel.js
//====================================================================================================
// Imports
//====================================================================================================
import { randomUUID } from 'crypto';

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
        id:           randomUUID(), // Unique identifier
        userId:       userId, // Who placed the order
        restaurantId: orderData.restaurantId, // Which restaurant
        products:     orderData.products || [], // Array of product IDs ordered
        status:       orderData.status || 'pending', // "pending" | "confirmed" | "delivered" | "cancelled"
        createdAt:    new Date().toISOString()
    };

    orders.push(newOrder);
    return newOrder;
};

//====================================================================================================
// Methods
//====================================================================================================
/**
 * Returns all orders belonging to a specific user
 *
 * @param {string} userId - ID of the user
 * @returns {Array} List of orders for that user
 */
export const getOrdersByUser = (userId) => {
    return orders.filter(order => order.userId === userId);
};

/**
 * Finds a single order by its ID
 *
 * @param {string} orderId - ID of the order
 * @returns {Object|undefined} The order or undefined if not found
 */
export const findOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
};

/**
 * Updates an existing order
 * Only updates fields that are provided — leaves others unchanged
 *
 * @param {string} orderId    - ID of the order to update
 * @param {Object} updateData - Fields to update
 * @returns {Object|null} Updated order or null if not found
 */
export const updateOrder = (orderId, updateData) => {
    const index = orders.findIndex(order => order.id === orderId);

    if (index === -1) return null;

    // Merging existing order with new data (Only provided fields are updated)
    orders[index] = {
        ...orders[index],
        ...updateData,
        // Protecting these fields
        id:        orders[index].id,
        userId:    orders[index].userId,
        createdAt: orders[index].createdAt
    };

    return orders[index];
};

/**
 * Deletes an order by ID
 *
 * @param {string} orderId - ID of the order to delete
 * @returns {boolean} true if deleted, false if not found
 */
export const deleteOrder = (orderId) => {
    const index = orders.findIndex(order => order.id === orderId);

    if (index === -1) return false;

    orders.splice(index, 1);
    return true;
};