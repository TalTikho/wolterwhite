import * as restaurantModel from '../models/restaurantModel.js';


export const getAllRestaurants = (req, res) =>{
    try{
        const restaurants = restaurantModel.getAllRestaurants()
        res.status(200).json(restaurants);
    }
    catch (error){
        res.status(500).json({ error: 'Bad Request', message: 'Failed to fetch restaurants' });
    }
    
}

export const createRestaurant = (req, res) => {
    const restaurantInfo = req.body;
    if (
        !restaurantInfo.name?.trim() ||
        !restaurantInfo.phone?.trim() ||
        !restaurantInfo.email?.trim() ||
        !restaurantInfo.address?.trim() ||
        !restaurantInfo.hours?.trim() 
    )
        return res.status(400).json({
            error: "All fields must be filled"
        });
    const newRestaurant = restaurantModel.createRestaurant(restaurantInfo);
    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
}


