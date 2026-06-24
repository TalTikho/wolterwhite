import Restaurant from "../models/restaurantModel.js";

// Escapes regex-special characters so a name like "Mom & Pop's" can't break
// the case-insensitive duplicate check below.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllRestaurants = async () => {
  return Restaurant.find();
};

export const createRestaurant = async (restaurantInfo) => {
  // Case-insensitive duplicate-name check — mirrors the original
  // .toLowerCase() comparison rather than relying on a unique index,
  // since Mongo's default unique index is case-sensitive.
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
    return await Restaurant.findById(id);
  } catch (error) {
    // Malformed id (not a valid ObjectId) — treat as "not found"
    // rather than letting Mongoose throw a CastError.
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
  const result = await Restaurant.findByIdAndDelete(restaurantId);
  return result ? 0 : -1;
};
