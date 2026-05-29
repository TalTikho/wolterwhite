import crypto from 'crypto';

// Return the array of products of a restaurant object reached using mergeParams to get the restaurant's id from the parent router
// and restaurantModel.getRestaurantById for the object itself.
export const getRestaurantProds = (restaurant) => { return restaurant.products };

export const addProdToRest = (restaurant, productInfo) => {
    // Same check as in restaurantModel. We need to make sure we do not create duplicates by name.
    if (restaurant.products.some(product => product.pname.toLowerCase() === productInfo.pname.toLowerCase())) {
        return null;
    }
    const pId = crypto.randomUUID().toString();
    const newProduct = {
        pId: pId,
        pname: productInfo.pname,
        pdescription: productInfo.pdescription,
        price: productInfo.price
    }

    restaurant.products.push(newProduct);
    return newProduct;

}

export const getProductById = (productID, restaurant) => {
    return restaurant.products.find(product => product.pId === productID);
}

// Edit a product using productID + restaurant (from url) and (recieved through controller's req.param) productInfo.
export const editProduct = (productpId, productInfo, restaurant) => {
    const editedProduct = getProductById(productpId, restaurant);
    // getProductById utilizes array.find().
    // find returns a pointer to undefined if nothing is found. 
    // Due to verifyProduct we know that we get the product here, o.w we would have already returned with a 404.

    // Check for duplicates like in restaurantModel
    if (productInfo.pname) {
        const isDouble = restaurant.products.some(product => product.pname.toLowerCase() === productInfo.pname.toLowerCase()
            && product.pId !== productpId);

        if (isDouble) {
            return null;
        }
    }
    // Update is done using Object.assign to avoid multi-conditional code as not all parameters need to be changed.
    Object.assign(editedProduct, productInfo);
    return editedProduct;

}

export const deleteProduct = (restaurant, productPId) => {
    // Find index of product with matching pId. We do not return the object but -1 if it is not found.
    const index = restaurant.products.findIndex(product => product.pId === productPId);
    // Use splice to delete 1 restaurant with the provided id. If findIndex fails to find
    // target it returns -1. splice(-1, 1) deletes from start to finish so we need the condition below.
    if (index !== -1) {
        restaurant.products.splice(index, 1);
        return 0; // 0 means everything is ok.
    }
    return -1;
}