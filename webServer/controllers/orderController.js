// controllers/orderController.js
//====================================================================================================
// Imports
//====================================================================================================
import * as orderModel from '../models/orderModel.js';
import { is_user_connected } from './userController.js'
//====================================================================================================
// Methods
//====================================================================================================
/**
 * Creates a new order for the authenticated user
 *
 * Required body:   { restaurantId, products }
 * Returns:         201 Created + Location header
 */
export const createOrder = (req, res) => {
    const userID = is_user_connected(req, res);

    if (userID.includes('guest')) {
        return res.status(400).json({ error: 'User must login' })
    }
    // req.userId already set by auth middleware — no check needed
    const orderData = req.body;
    // Validate required fields
    if (!orderData.restaurantId?.trim()) {
        return res.status(400).json({
            error: 'restaurantId is required'
        });
    }

    if (
        !orderData.products ||
        !Array.isArray(orderData.products) ||
        orderData.products.length === 0
    ) {
        return res.status(400).json({
            error: 'products must be a non-empty array'
        });
    }

    const newOrder = orderModel.createOrder(req.userId, orderData);

    return res
        .status(201)
        .location(`/api/orders/${newOrder.id}`)
        .json(newOrder);
};

/**
 * Returns all orders belonging to the authenticated user
 *
 * Returns:         200 OK + array of orders
 */
export const getOrders = (req, res) => {
    const userID = is_user_connected(req, res);

    if (userID.includes('guest')) {
        return res.status(400).json({ error: 'User must login' })
    }
    const userOrders = orderModel.getOrdersByUser(req.userId);
    return res.status(200).json(userOrders);
};

/**
 * Returns details of a specific order
 *
 * Returns:         200 OK + order object
 *                  404 if order not found
 *                  403 if order belongs to different user
 */
export const getOrderById = (req, res) => {
    const userID = is_user_connected(req, res);

    if (userID.includes('guest')) {
        return res.status(400).json({ error: 'User must login' })
    }
    const order = orderModel.findOrderById(req.params.id);

    // Order not found
    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
        });
    }

    // Order belongs to different user
    if (order.userId !== req.userId) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    return res.status(200).json(order);
};

/**
 * Updates an existing order
 *
 * Returns:         204 No Content on success
 *                  404 if order not found
 *                  403 if order belongs to different user
 */
export const updateOrder = (req, res) => {
    const userID = is_user_connected(req, res);

    if (userID.includes('guest')) {
        return res.status(400).json({ error: 'User must login' })
    }
    const order = orderModel.findOrderById(req.params.id);

    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
        });
    }

    if (order.userId !== req.userId) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    orderModel.updateOrder(req.params.id, req.body);
    return res.status(204).send();
};

/**
 * Deletes an existing order
 *
 * Returns:         204 No Content on success
 *                  404 if order not found
 *                  403 if order belongs to different user
 */
export const deleteOrder = (req, res) => {
    const userID = is_user_connected(req, res);

    if (userID.includes('guest')) {
        return res.status(400).json({ error: 'User must login' })
    }
    const order = orderModel.findOrderById(req.params.id);

    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
        });
    }

    if (order.userId !== req.userId) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    orderModel.deleteOrder(req.params.id);
    return res.status(204).send();
};