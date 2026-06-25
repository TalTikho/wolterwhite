// controllers/orderController.js
//====================================================================================================
// Imports
//====================================================================================================
import * as orderService from '../services/orderService.js';


//====================================================================================================
// Methods
//====================================================================================================
/**
 * Creates a new order for the authenticated user
 *
 * Required body:   { restaurantId, products }
 * Returns:         201 Created + Location header
 */
export const createOrder = async (req, res) => {
    // req.userId already set by auth middleware func if succeful login was made — no extra check needed
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
    try {

        const newOrder = await orderService.createOrder(req.userId, orderData);
        return res
            .status(201)
            .location(`/api/orders/${newOrder.id}`)
            .json(newOrder);

    }
    catch (err) {
    return res.status(500).json({ error: err.message });
};


};

/**
 * Returns all orders belonging to the authenticated user
 *
 * Returns:         200 OK + array of orders
 */
export const getOrders = async (req, res) => {
    // req.userId already set by auth middleware func if succeful login was made — no extra check needed
    const userOrders = await orderService.getOrdersByUser(req.userId);
    return res.status(200).json(userOrders);
};

/**
 * Returns details of a specific order
 *
 * Returns:         200 OK + order object
 *                  404 if order not found
 *                  403 if order belongs to different user
 */
export const getOrderById = async (req, res) => {
    // req.userId already set by auth middleware func if succeful login was made — no extra check needed
    const order = await orderService.findOrderById(req.params.id);

    // Order not found
    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
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
export const updateOrder = async (req, res) => {
    // req.userId already set by auth middleware func if succeful login was made — no extra check needed
    const order = await orderService.findOrderById(req.params.id);

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

    orderService.updateOrder(req.params.id, req.body);
    return res.status(204).send();
};

/**
 * Deletes an existing order
 *
 * Returns:         204 No Content on success
 *                  404 if order not found
 *                  403 if order belongs to different user
 */
export const deleteOrder = async (req, res) => {
    // req.userId already set by auth middleware func if succeful login was made — no extra check needed
    const order = await orderService.findOrderById(req.params.id);

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

    orderService.deleteOrder(req.params.id);
    return res.status(204).send();
};