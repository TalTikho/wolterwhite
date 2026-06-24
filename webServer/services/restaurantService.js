import Restaurant from "../models/restaurantModel.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// All restaurant reads populate products so callers always receive
// full product objects rather than bare ObjectIds.

export const getAllRestaurants = async () => {
  return Restaurant.find().populate("products");
};

export const createRestaurant = async (restaurantInfo) => {
  const existing = await Restaurant.findOne({
    name: { $regex: `^${escapeRegex(restaurantInfo.name)}$`, $options: "i" },
  });
  if (existing) {
    return null;
  }

  const newRestaurant = await Restaurant.create({
    name: restaurantInfo.name,
    phone: restaurantInfo.phone,
    email: restaurantInfo.email,
    address: restaurantInfo.address,
    addressX: restaurantInfo.addressX,
    addressY: restaurantInfo.addressY,
    hours: restaurantInfo.hours,
    description: restaurantInfo.description,
    image: restaurantInfo.image || "",
    products: [],
  });

  return newRestaurant;
};

export const getRestaurantById = async (id) => {
  try {
    return await Restaurant.findById(id).populate("products");
  } catch {
    // Malformed ObjectId — treat as not found
    return null;
  }
};

export const editRestaurantInfo = async (restaurantId, restaurantNew) => {
  const editedRestaurant = await getRestaurantById(restaurantId);
  if (!editedRestaurant) {
    return null;
  }

  if (restaurantNew.name) {
    const isDouble = await Restaurant.findOne({
      _id: { $ne: restaurantId },
      name: { $regex: `^${escapeRegex(restaurantNew.name)}$`, $options: "i" },
    });
    if (isDouble) {
      return undefined;
    }
  }

  Object.assign(editedRestaurant, restaurantNew);
  await editedRestaurant.save();
  return editedRestaurant;
};

export const DeleteRestaurant = async (restaurantId) => {
  // Products are left in the Product collection (orphaned) per spec —
  // only the restaurant document and its references are removed.
  const result = await Restaurant.findByIdAndDelete(restaurantId);
  return result ? 0 : -1;
};