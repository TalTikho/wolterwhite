import crypto from 'crypto';

const restaurants = [];

export const getAllRestaurants = () => restaurants;

export const createRestaurant = (restaurantInfo) => {
    if (restaurants.some(restaurant => restaurant.name.toLowerCase() === restaurantInfo.name.toLowerCase())) {
        return null;
    }
    const restId = crypto.randomUUID().toString();
    const newRestaurant = {
        id: restId,
        name: restaurantInfo.name,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        addressX: restaurantInfo.addressX,
        addressY: restaurantInfo.addressY,
        hours: restaurantInfo.hours,
        description: restaurantInfo.description,
        image: restaurantInfo.image || "",
        products: []
    };
    
    restaurants.push(newRestaurant);
    return newRestaurant;
};

export const getRestaurantById = (id) => restaurants.find(a => a.id === id);

export const editRestaurantInfo = (restaurantId, restaurantNew) => {
    const editedRestaurant = getRestaurantById(restaurantId);
    if (!editedRestaurant) {
        return null;
    }
    
    if (restaurantNew.name) {
        const isDouble = restaurants.some(restaurant => restaurant.name.toLowerCase() === restaurantNew.name.toLowerCase()
            && restaurant.id !== restaurantId);

        if (isDouble) {
            return undefined;
        }
    }
    
    Object.assign(editedRestaurant, restaurantNew);
    return editedRestaurant;
};

export const DeleteRestaurant = (restaurantId) => {
    const index = restaurants.findIndex(restaurants => restaurants.id === restaurantId);
    if (index !== -1) {
        restaurants.splice(index, 1);
        return 0;
    }
    return -1;
};