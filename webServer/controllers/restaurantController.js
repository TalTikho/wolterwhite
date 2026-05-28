import * as restaurantModel from '../models/restaurantModel.js';

// Use restaurantModel to get the entire restaurants array in json format. 500 means the server failed, o.w get (200 OK).
export const getAllRestaurants = (req, res) => {
    try {
        const restaurants = restaurantModel.getAllRestaurants()
        res.json(restaurants);
    }
    // No restaurants is not an error and will just return an empty array in a json.
    // So an error would be a (500) server error.
    catch (error) {
        res.status(500).json({ error: 'Bad Request', message: 'Failed to fetch restaurants' });
    }

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
    // succesful post is 201 Created
    const newRestaurant = restaurantModel.createRestaurant(restaurantInfo);
    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
}

export const getRestaurantById = (req, res) => {
    const restaurant = restaurantModel.getRestaurantById(req.params.id)
    if (!restaurant)
        return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).location(`/api/restaurants/${restaurant.id}`).json(restaurant);
};


export const editRestaurantInfo = (req, res) => {
    // In the request json body we put all of the required fields.
    const restaurantNew = req.body;
    // Must change at least one field.
    if (
        !restaurantNew.name?.trim() &&
        !restaurantNew.phone?.trim() &&
        !restaurantNew.email?.trim() &&
        !restaurantNew.address?.trim() &&
        !restaurantNew.hours?.trim() &&
        !restaurantNew.description.trim()
    )
        return res.status(400).json({
            error: "There must be at least one proper field entry changed"
        });
    // 204 No content for PATCH
    const restaurantId = req.params.id;
    const editedRestaurant = restaurantModel.editRestaurantInfo(restaurantId, restaurantNew);
    if (!editedRestaurant)
        return res.status(404).json({ error: 'Restaurant not found' });
    res.status(204).location(`/api/restaurants/${editedRestaurant.id}`).end();

};

export const DeleteRestaurant = (req, res) => {
    const restaurantId = req.params.id;
    const deletedRestaurant = restaurantModel.DeleteRestaurant(restaurantId);
    if (deletedRestaurant == -1) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    // We do not need location as after deletion it will be undefined.
    res.status(204).end();

};



