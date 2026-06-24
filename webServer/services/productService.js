import Product from "../models/productModel.js";

// All reads now go directly to the Product collection via its _id.
// The restaurant document is only touched when adding/removing the
// ObjectId reference in its products array.

export const getRestaurantProds = (restaurant) => {
  // restaurant.products is already populated by the restaurant service
  // before this is called, so no extra DB hit needed here.
  return restaurant.products;
};

export const getProductById = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch {
    // Malformed ObjectId — treat as not found
    return null;
  }
};

export const addProdToRest = async (restaurant, productInfo) => {
  // Duplicate-name check across the already-populated products array
  const isDuplicate = restaurant.products.some(
    (product) =>
      product.pname.toLowerCase() === productInfo.pname.toLowerCase(),
  );
  if (isDuplicate) {
    return null;
  }

  const newProduct = await Product.create({
    pname: productInfo.pname,
    pdescription: productInfo.pdescription,
    price: productInfo.price,
    image: productInfo.image || "",
  });

  restaurant.products.push(newProduct._id);
  await restaurant.save();

  return newProduct;
};

export const editProduct = async (productId, productInfo, restaurant) => {
  const existing = await getProductById(productId);
  if (!existing) {
    return null; // not found
  }

  if (productInfo.pname) {
    const isDouble = restaurant.products.some(
      (product) =>
        product.pname.toLowerCase() === productInfo.pname.toLowerCase() &&
        product._id.toString() !== productId,
    );
    if (isDouble) {
      return undefined; // duplicate name
    }
  }

  // findByIdAndUpdate hits the Product document directly — no need to
  // touch the restaurant document at all.
  const updated = await Product.findByIdAndUpdate(
    productId,
    { $set: productInfo },
    { new: true },
  );

  return updated;
};

export const deleteProduct = async (restaurant, productId) => {
  const product = await getProductById(productId);
  if (!product) {
    return -1;
  }

  await Product.findByIdAndDelete(productId);

  // Remove the ObjectId reference from the restaurant's products array
  restaurant.products.pull(productId);
  await restaurant.save();

  return 0;
};