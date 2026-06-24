import crypto from "crypto";

// Pure reads — no DB call needed, the restaurant document is already
// in memory by the time these are called, so these stay synchronous.

export const getRestaurantProds = (restaurant) => {
  return restaurant.products;
};

export const getProductById = (productID, restaurant) => {
  return restaurant.products.find((product) => product.pId === productID);
};

export const addProdToRest = async (restaurant, productInfo) => {
  if (
    restaurant.products.some(
      (product) =>
        product.pname.toLowerCase() === productInfo.pname.toLowerCase(),
    )
  ) {
    return null;
  }
  const pId = crypto.randomUUID().toString();
  const newProduct = {
    pId: pId,
    pname: productInfo.pname,
    pdescription: productInfo.pdescription,
    price: productInfo.price,
    image: productInfo.image || "",
  };

  restaurant.products.push(newProduct);
  await restaurant.save();
  return newProduct;
};

export const editProduct = async (productpId, productInfo, restaurant) => {
  const editedProduct = getProductById(productpId, restaurant);

  if (!editedProduct) {
    return null; // not found
  }

  if (productInfo.pname) {
    const isDouble = restaurant.products.some(
      (product) =>
        product.pname.toLowerCase() === productInfo.pname.toLowerCase() &&
        product.pId !== productpId,
    );

    if (isDouble) {
      return undefined; // duplicate name — distinct from null (not found)
    }
  }

  Object.assign(editedProduct, productInfo);
  await restaurant.save();
  return editedProduct;
};

export const deleteProduct = async (restaurant, productPId) => {
  const index = restaurant.products.findIndex(
    (product) => product.pId === productPId,
  );
  if (index !== -1) {
    restaurant.products.splice(index, 1);
    await restaurant.save();
    return 0;
  }
  return -1;
};