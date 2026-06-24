import { userDataRegistration } from '../middleware/userRegistration.js';
import { createOrder, Order } from '../models/orderModel.js';

export const createOrder = async (userId, orderData) => {
    //status and id are already set by default
    const newOrder = {
        userId: userId, // Who placed the order
        restaurantId: orderData.restaurantId, // Which restaurant
        //products, status and date already have defaults.
    };

    return await newOrder.save();
}

//Returns all orders belonging to a specific user
export const getOrdersByUser = async (userId) => { return await Order.find({ userId: userId }) };
//Finds a single order by its ID
export const findOrderById = async (id) => { return await Order.findById(id); };

//Updates an existing order
export const updateOrder = async (orderId, updateData) => {
    const order = await findOrderById(orderId);
    if (!order) {
        return null;
    }
    order = {
        ...order,
        ...updateData,
        // Protecting these fields
        id: order.id,
        userId: order.userId,
        createdAt: order.createdAt
    };

    await order.save();
    return order;


}

//delete order
export const deleteOrder = async (orderId) => {
    const order = await findOrderById(orderId);

    if (!order) {
        return null;
    }
    await order.remove();
    return true;
};
