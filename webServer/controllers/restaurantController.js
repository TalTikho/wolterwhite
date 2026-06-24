import * as restaurantModel from "../services/restaurantService.js";
import { sendAndReceive } from "../cppClient.js";
import { getAllusers } from "../services/userModel.js";

const users = getAllusers();

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.getAllRestaurants();
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error in getAllRestaurants controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const restaurantInfo = req.body;

    if (req.file) {
      restaurantInfo.image = req.file.filename;
    }

    const isValidNumber = (val) =>
      val !== undefined && val !== null && val !== "" && !isNaN(Number(val));

    if (
      !restaurantInfo.name?.trim() ||
      !restaurantInfo.phone?.trim() ||
      !restaurantInfo.email?.trim() ||
      !restaurantInfo.address?.trim() ||
      !isValidNumber(restaurantInfo.addressX) ||
      !isValidNumber(restaurantInfo.addressY) ||
      !restaurantInfo.hours?.trim() ||
      !restaurantInfo.description?.trim()
    ) {
      return res.status(400).json({
        error: "All fields must be filled properly, and coordinates must be valid numbers.",
      });
    }

    restaurantInfo.addressX = Number(restaurantInfo.addressX);
    restaurantInfo.addressY = Number(restaurantInfo.addressY);

    const newRestaurant = await restaurantModel.createRestaurant(restaurantInfo);
    if (!newRestaurant) {
      return res.status(409).json({ error: "Restaurant already exists" });
    }

    return res
      .status(201)
      .location(`/api/restaurants/${newRestaurant.id}`)
      .json(newRestaurant);
  } catch (error) {
    console.error("Error in createRestaurant controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantModel.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return res
      .status(200)
      .location(`/api/restaurants/${restaurant.id}`)
      .json(restaurant);
  } catch (error) {
    console.error("Error in getRestaurantById controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const editRestaurantInfo = async (req, res) => {
  try {
    const restaurantNew = req.body;

    if (req.file) {
      restaurantNew.image = req.file.filename;
    }

    const hasValidX =
      restaurantNew.addressX !== undefined &&
      restaurantNew.addressX !== null &&
      restaurantNew.addressX !== "" &&
      !isNaN(Number(restaurantNew.addressX));
    const hasValidY =
      restaurantNew.addressY !== undefined &&
      restaurantNew.addressY !== null &&
      restaurantNew.addressY !== "" &&
      !isNaN(Number(restaurantNew.addressY));

    if (
      !restaurantNew.name?.trim() &&
      !restaurantNew.phone?.trim() &&
      !restaurantNew.email?.trim() &&
      !restaurantNew.address?.trim() &&
      !restaurantNew.hours?.trim() &&
      !restaurantNew.description?.trim() &&
      !restaurantNew.image &&
      !hasValidX &&
      !hasValidY
    ) {
      return res.status(400).json({
        error: "There must be at least one proper field entry changed",
      });
    }

    if (hasValidX) restaurantNew.addressX = Number(restaurantNew.addressX);
    if (hasValidY) restaurantNew.addressY = Number(restaurantNew.addressY);

    const restaurantId = req.params.id;
    const editedRestaurant = await restaurantModel.editRestaurantInfo(
      restaurantId,
      restaurantNew,
    );

    if (editedRestaurant === null) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    if (editedRestaurant === undefined) {
      return res
        .status(409)
        .json({ error: "Restaurant with the same name already exists" });
    }
    return res.status(204).end();
  } catch (error) {
    console.error("Error in editRestaurantInfo controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const DeleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const targetRestaurant = await restaurantModel.getRestaurantById(restaurantId);

    if (!targetRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const products = targetRestaurant.products || [];

    for (const user of users) {
      for (const product of products) {
        const serverReply = await sendAndReceive(`delete ${user.id} ${product.pId}`);
        console.log("Reply:", serverReply);
      }
    }

    await restaurantModel.DeleteRestaurant(restaurantId);
    return res.status(204).end();
  } catch (error) {
    console.error("Error in DeleteRestaurant controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};