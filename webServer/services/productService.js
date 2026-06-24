import crypto from "crypto";

// Pure reads — no DB call needed, the restaurant document is already
// in memory by the time these are called, so these stay synchronous.

export const getRestaurantProds = (restaurant) => {
  return restaurant.products;
};

export const getProductById = (productID, restaurant) => {
  return restaurant.products.find((product) => product.pId === productID);
};

// Anything that mutates restaurant.products needs an explicit save() —
// pushing/splicing the embedded array only changes it in memory until the
// parent restaurant document is persisted. This is the one behavior change
// from the in-memory version: there, mutating the array *was* the
// persistence step, since it was the same object reference in RAM.

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

  // Fixes a pre-existing bug carried over from the in-memory version:
  // if productpId doesn't match anything, editedProduct is undefined,
  // and Object.assign(undefined, ...) throws rather than failing
  // gracefully. Returning null here matches the "not found" convention
  // used elsewhere (e.g. createRestaurant on a duplicate name).
  if (!editedProduct) {
    return null;
  }

  if (productInfo.pname) {
    const isDouble = restaurant.products.some(
      (product) =>
        product.pname.toLowerCase() === productInfo.pname.toLowerCase() &&
        product.pId !== productpId,
    );

    if (isDouble) {
      return null;
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
