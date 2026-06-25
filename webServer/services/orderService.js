import { userDataRegistration } from '../middleware/userRegistration.js';
import { Order } from '../models/orderModel.js';

export const createOrder = async (userId, orderData) => {
    //status and id are already set by default
    const newOrder = new Order({
        userId: userId,
        restaurantId: orderData.restaurantId,
        products: orderData.products || []
    });
    return await newOrder.save();
}

//Returns all orders belonging to a specific user
export const getOrdersByUser = async (userId) => { return await Order.find({ userId: userId }) };
//Finds a single order by its ID
export const findOrderById = async (id) => { return await Order.findById(id); };

//Updates an existing order
export const updateOrder = async (orderId, updateData) => {
    //The controller checks for the null case (not found) so we immediately try to update.
    
    // Protecting these fields
    const { _id, userId, createdAt, ...safeData} = updateData;
    return await Order.findByIdAndUpdate(
        orderId,
        safeData, //removed protected fields
        {new : true} //return new order.
    );


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
