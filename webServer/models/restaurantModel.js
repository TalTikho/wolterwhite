import crypto from 'crypto';
// Temporary retaurants array.
export const restaurants = [];

export const getAllRestaurants = () => restaurants;

export const createRestaurant = (restaurantInfo) =>{
    const restId = crypto.randomUUID().toString();
    const newRestaurant = {
        id : restId,
        name: restaurantInfo.name,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        hours: restaurantInfo.hours
    }
    restaurants.push(newRestaurant);

    return newRestaurant;

};


