import crypto from 'crypto';
// Temporary retaurants array.
const restaurants = [];

// Return the array for controllers to parse into json.
export const getAllRestaurants = () => restaurants;

// Create a unique id using node.js built in crypto lib and enter all restaurant's details from restaurantInfo.
export const createRestaurant = (restaurantInfo) => {
    // Do not add if there already exists a restaurant with the same name. 
    // Using some which returns false if a value is not in an array and true o.w.
    // Comparision by name and not id because a unique id is generated above randomly anyway.
    // some() compared to find() returns a boolean instead of the searched object which is cheaper in terms of RAM.
    if (restaurants.some(restaurant => restaurant.name.toLowerCase() === restaurantInfo.name.toLowerCase())) {
        return null;
    }
    const restId = crypto.randomUUID().toString();
    // No Object.assign here so the added elements are clear.
    const newRestaurant = {
        id: restId,
        name: restaurantInfo.name,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        hours: restaurantInfo.hours,
        description: restaurantInfo.description,
        products: []
    }
    // Add the new restaurant to the temp array and return it for controller to check and show.
    restaurants.push(newRestaurant);
    return newRestaurant;


};


// Find returns a pointer to the searched by id restaurant.
export const getRestaurantById = (id) => restaurants.find(a => a.id === id);

// Edit a restaurant using getRestaurantById and (recieved through controller's req.param) restaurantNew.
export const editRestaurantInfo = (restaurantId, restaurantNew) => {
    // Check if the restaurant id is valid. Meaning, we want to edit a restaurant that was already posted, o.w it is quite impossible.
    const editedRestaurant = getRestaurantById(restaurantId);
    if (!editedRestaurant) {
        return null;
    }
    // Check if the name we want to change to is a name of another restaurant with a different id
    // (entering the same name of our restaurant to edit by accident is ok). This is a way to prevent duplicates
    // as the ids themselves are unique due to crypto random.UUID's nature.
    // undefined == null but undefined !== null because null's type is object and undefined is undefined.
    // returning null for one case and undefined for the other lets us throw different messages in the controller.
    if (restaurantNew.name) {
        const isDouble = restaurants.some(restaurant => restaurant.name.toLowerCase() === restaurantNew.name.toLowerCase()
            && restaurant.id !== restaurantId);

        if (isDouble) {
            return undefined;
        }
    }
    // Update is done only after the checks. In case a check fails resources are saved this way.
    // Update is done using Object.assign to avoid multi-conditional code as not all parameters need to be changed.
    Object.assign(editedRestaurant, restaurantNew);
    return editedRestaurant;

}

export const DeleteRestaurant = (restaurantId) => {
    // Find index of resaturant with matching id. We do not return the object but -1 if it is not found.
    const index = restaurants.findIndex(restaurants => restaurants.id === restaurantId);
    // Use splice to delete 1 restaurant with the provided id. If findIndex fails to find
    // target it returns -1. splice(-1, 1) deletes from start to finish so we need the condition below.
    if (index !== -1) {
        restaurants.splice(index, 1);
        return 0; // 0 means everything is ok.
    }
    return -1;
}


