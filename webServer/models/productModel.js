import crypto from 'crypto';

// Return the array of products of a restaurant object reached using mergeParams to get the restaurant's id from the parent router
// and restaurantModel.getRestaurantById for the object itself.
export const getRestaurantProds = (restaurant) => { return restaurant.products };

export const addProdToRest = (restaurant, productInfo) => {
    const pId = crypto.randomUUID().toString();
    const newProduct = {
        pId: pId,
        pname: productInfo.pname,
        pdescription: productInfo.pdescription,
        price: productInfo.price
    }
    // Same check as in restaurantModel. We need to make sure we do not create duplicates by name.
    if (restaurant.products.find(product => product.pname === productInfo.pname)) {
        return null;
    }
    restaurant.products.push(newProduct);
    return newProduct;

}

export const getProductId = (productID, restaurant) => {
    return restaurant.products.find(product => product.pId === productID);
}

// Edit a product using productID + restaurant (from url) and (recieved through controller's req.param) productInfo.
export const editProduct = (productpId, productInfo, restaurant) => {
    const editedProduct = getProductById(productpId, restaurant);
    // find returns a pointer to undefined if nothing is found. undefined == null => true, undefined === null => false.
    if (!editedProduct) {
        return null;
    }
    // Update is done using Object.assign to avoid multi-conditional code as not all parameters need to be changed.
    Object.assign(editedProduct, productInfo);
    return editedProduct;

}