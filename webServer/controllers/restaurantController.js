import * as restaurantModel from '../models/restaurantModel.js';
import { sendAndReceive } from '../cppClient.js'
import { getAllusers } from '../models/userModel.js'

const users = getAllusers();

export const getAllRestaurants = (req, res) => {
    const restaurants = restaurantModel.getAllRestaurants()
    res.status(200).json(restaurants);
}

export const createRestaurant = (req, res) => {
    const restaurantInfo = req.body;

    const isValidNumber = (val) => val !== undefined && val !== null && val !== '' && !isNaN(Number(val));

    if (
        !restaurantInfo.name?.trim() ||
        !restaurantInfo.phone?.trim() ||
        !restaurantInfo.email?.trim() ||
        !restaurantInfo.address?.trim() ||
        !isValidNumber(restaurantInfo.addressX) ||
        !isValidNumber(restaurantInfo.addressY) ||
        !restaurantInfo.hours?.trim() ||
        !restaurantInfo.description?.trim()
    ) {
        return res.status(400).json({
            error: "All fields must be filled properly, and coordinates must be valid numbers."
        });
    }

    restaurantInfo.addressX = Number(restaurantInfo.addressX);
    restaurantInfo.addressY = Number(restaurantInfo.addressY);

    const newRestaurant = restaurantModel.createRestaurant(restaurantInfo);
    if (!newRestaurant) {
        return res.status(409).json({ error: 'Restaurant already exists' });
    }
    
    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
}

export const getRestaurantById = (req, res) => {
    const restaurant = restaurantModel.getRestaurantById(req.params.id)
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).location(`/api/restaurants/${restaurant.id}`).json(restaurant);
};

export const editRestaurantInfo = (req, res) => {
    const restaurantNew = req.body;

    const hasValidX = restaurantNew.addressX !== undefined && restaurantNew.addressX !== null && restaurantNew.addressX !== '' && !isNaN(Number(restaurantNew.addressX));
    const hasValidY = restaurantNew.addressY !== undefined && restaurantNew.addressY !== null && restaurantNew.addressY !== '' && !isNaN(Number(restaurantNew.addressY));

    if (
        !restaurantNew.name?.trim() &&
        !restaurantNew.phone?.trim() &&
        !restaurantNew.email?.trim() &&
        !restaurantNew.address?.trim() &&
        !restaurantNew.hours?.trim() &&
        !restaurantNew.description?.trim() &&
        !hasValidX &&
        !hasValidY
    ) {
        return res.status(400).json({
            error: "There must be at least one proper field entry changed"
        });
    }

    if (hasValidX) restaurantNew.addressX = Number(restaurantNew.addressX);
    if (hasValidY) restaurantNew.addressY = Number(restaurantNew.addressY);

    const restaurantId = req.params.id;
    const editedRestaurant = restaurantModel.editRestaurantInfo(restaurantId, restaurantNew);
    
    if (editedRestaurant === null) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    if (editedRestaurant === undefined) {
        return res.status(409).json({ error: 'Restaurant with the same name already exists' });
    }
    res.status(204).end();
};

export const DeleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    const targetRestaurant = restaurantModel.getRestaurantById(restaurantId);
    
    if (!targetRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const products = targetRestaurant.products || [];

    for (const user of users) {
        for (const product of products) {
            const serverReply = await sendAndReceive(`delete ${user.id} ${product.pId}`)
            console.log("Reply:", serverReply);
        };
    }

    restaurantModel.DeleteRestaurant(restaurantId);
    res.status(204).end();
};