import crypto from 'crypto';
// Temporary retaurants array.
export const restaurants = [];

// Return the array for controllers to parse into json.
export const getAllRestaurants = () => restaurants;

// Create a unique id using node.js built in crypto lib and enter all restaurant's details from restaurantInfo.
export const createRestaurant = (restaurantInfo) =>{
    const restId = crypto.randomUUID().toString();
    const newRestaurant = {
        id : restId,
        name: restaurantInfo.name,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        hours: restaurantInfo.hours,
        products: []
    }
    // Add the new restaurant to the temp array and return it for controller to check and show.
    restaurants.push(newRestaurant);

    return newRestaurant;

};


// Find returns a pointer to the searched by id restaurant.
export const getRestaurantById = (id) => restaurants.find(a => a.id === id);

// Edit a restaurant using getRestaurantById and (recieved through controller's req.param) restaurantInfo.
export const editRestaurantInfo = (restaurantId, restaurantNew) => {
    const editedRestaurant = getRestaurantById(restaurantId);
    if (!editedRestaurant){
        return null;
    } 
    // Update is done using Object.assign to avoid multi-conditional code as not all parameters need to be changed.
    Object.assign(editedRestaurant, restaurantNew);
    return editedRestaurant;

}

export const DeleteRestaurant = (restaurantId) => {
    // Find index of resaturant with matching id. We do not return the object but -1 if it is not found.
    const index = restaurants.findIndex(restaurants => restaurants.id === restaurantId);
    // Use splice to delete 1 restaurant with the provided id.
    restaurants.splice(index, 1);
    return index;
}


