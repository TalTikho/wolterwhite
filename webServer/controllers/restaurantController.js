import * as restaurantModel from '../models/restaurantModel.js';
import { sendAndReceive } from '../cppClient.js'

// Import a getter instead of the users array for encapsulation.
import { getAllusers } from '../models/userModel.js'
const users = getAllusers();
// Use restaurantModel to get the entire restaurants array in json format, return get (200 OK).
export const getAllRestaurants = (req, res) => {
    const restaurants = restaurantModel.getAllRestaurants()
    res.status(200).json(restaurants);
    // No restaurants is not an error and will just return an empty array in a json.

}

// Need to fill all of the neccessary fields in order to create a restaurant.
// trim() trims ws at the front and end so we do not consider ws as valid input.

export const createRestaurant = (req, res) => {
    const restaurantInfo = req.body;
    if (
        !restaurantInfo.name?.trim() ||
        !restaurantInfo.phone?.trim() ||
        !restaurantInfo.email?.trim() ||
        !restaurantInfo.address?.trim() ||
        !restaurantInfo.hours?.trim() ||
        !restaurantInfo.description?.trim()
    )
        return res.status(400).json({
            error: "All fields must be filled"
        });

    const newRestaurant = restaurantModel.createRestaurant(restaurantInfo);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant already exists' });
    }
    // succesful post is 201 Created
    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
}

export const getRestaurantById = (req, res) => {
    const restaurant = restaurantModel.getRestaurantById(req.params.id)
    res.status(200).location(`/api/restaurants/${restaurant.id}`).json(restaurant);
};


export const editRestaurantInfo = (req, res) => {
    // In the request json body we put all of the required fields.
    const restaurantNew = req.body;
    // Must change at least one field.
    // '?' operates only if the field is found so we do not try to handle null/undifined objects.
    // This prevents crashes.
    if (
        !restaurantNew.name?.trim() &&
        !restaurantNew.phone?.trim() &&
        !restaurantNew.email?.trim() &&
        !restaurantNew.address?.trim() &&
        !restaurantNew.hours?.trim() &&
        !restaurantNew.description?.trim()
    )
        return res.status(400).json({
            error: "There must be at least one proper field entry changed"
        });
    // 204 No content for PATCH
    const restaurantId = req.params.id;
    const editedRestaurant = restaurantModel.editRestaurantInfo(restaurantId, restaurantNew);
    if (editedRestaurant === null) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    // 409 conflict - the id is valid, but the name creates a conflict.
    if (editedRestaurant === undefined) {
        return res.status(409).json({ error: 'Restaurant with the same name already exists' });
    }
    res.status(204).end();

};

export const DeleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    const products = restaurantModel.getRestaurantById(restaurantId).products;
    // For each product in the restaurant (if its product array isn't empty) delete the view in the user id's list using the cpp server.
    // The recommendation system cannot recommend a deleted product.
    // The list could be empty and then the run just continues.
    for (const user of users) {
        for (const product of products) {
            // We need await to not mess multiple requests to the views server.
            const serverReply = await sendAndReceive(`delete ${user.id} ${product.pId}`)
            console.log("Reply:", serverReply);
            // If a user did not view the product it's ok, just an error message 
            // from the cpp client and the code continues running afterwards.
        };
    }

    const deletedRestaurant = restaurantModel.DeleteRestaurant(restaurantId);
    if (deletedRestaurant == -1) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    // We do not need location as after deletion it will be undefined.
    res.status(204).end();

};



