import crypto from 'crypto';

export const getRestaurantProds = (restaurant) => { 
    return restaurant.products; 
};

export const addProdToRest = (restaurant, productInfo) => {
    if (restaurant.products.some(product => product.pname.toLowerCase() === productInfo.pname.toLowerCase())) {
        return null;
    }
    const pId = crypto.randomUUID().toString();
    const newProduct = {
        pId: pId,
        pname: productInfo.pname,
        pdescription: productInfo.pdescription,
        price: productInfo.price,
        image: productInfo.image || ""
    };

    restaurant.products.push(newProduct);
    return newProduct;
};

export const getProductById = (productID, restaurant) => {
    return restaurant.products.find(product => product.pId === productID);
};

export const editProduct = (productpId, productInfo, restaurant) => {
    const editedProduct = getProductById(productpId, restaurant);

    if (productInfo.pname) {
        const isDouble = restaurant.products.some(product => product.pname.toLowerCase() === productInfo.pname.toLowerCase()
            && product.pId !== productpId);

        if (isDouble) {
            return null;
        }
    }
    
    Object.assign(editedProduct, productInfo);
    return editedProduct;
};

export const deleteProduct = (restaurant, productPId) => {
    const index = restaurant.products.findIndex(product => product.pId === productPId);
    if (index !== -1) {
        restaurant.products.splice(index, 1);
        return 0;
    }
    return -1;
};