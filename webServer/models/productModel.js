import crypto from 'crypto'; 

// Return the array of products of a restaurant object reached using mergeParams to get the restaurant's id from the parent router
// and restaurantModel.getRestaurantById for the object itself.
export const getRestaurantProds = (restaurant) => {return restaurant.products};

export const addProdToRest = (restaurant, productInfo) => {
    const pid = crypto.randomUUID().toString();
    const newProduct = {
        pid : pid,
        pname : productInfo.pname,
        pdescription: productInfo.pdescription,
        price: productInfo.price
    }  
    restaurant.products.push(newProduct);
    return newProduct;
}