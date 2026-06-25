import * as productService from "../services/productService.js";
import { getAllusers } from "../services/userService.js";
import { sendAndReceive } from "../cppClient.js";
import crypto from "crypto";

export const getRestaurantProds = async (req, res) => {
  try {
    const restaurant = req.currentRestaurant;
    const products = productService.getRestaurantProds(restaurant);
    const userID = req.userId || "guest_" + crypto.randomUUID().toString();

    for (const product of products) {
      const serverReply = await sendAndReceive(`patch ${userID} ${product._id}`);
      console.log("Reply:", serverReply);
      if (serverReply.includes("400") || serverReply.includes("404")) {
        await sendAndReceive(`post ${userID} ${product._id}`).then((reply) =>
          console.log("Reply:", reply),
        );
      }
    }
    return res
      .status(200)
      .location(`/api/restaurants/${req.params.id}/products`)
      .json(products);
  } catch (error) {
    console.error("Error in getRestaurantProds controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const addProdToRest = async (req, res) => {
  try {
    const restaurant = req.currentRestaurant;
    const productInfo = req.body;

    if (req.file) {
      productInfo.image = req.file.filename;
    }

    if (
      !productInfo.pname?.trim() ||
      !productInfo.pdescription?.trim() ||
      productInfo.price === undefined ||
      productInfo.price === null
    ) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    const newProd = await productService.addProdToRest(restaurant, productInfo);

    if (!newProd) {
      return res.status(409).json({ error: "Product already exists" });
    }
    return res
      .status(201)
      .location(`/api/restaurants/${restaurant.id}/products/${newProd._id}`)
      .json(newProd);
  } catch (error) {
    console.error("Error in addProdToRest controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = req.currentProduct;
    const userID = req.userId || "guest_" + crypto.randomUUID().toString();
    const restaurant = req.currentRestaurant;

    const serverReply = await sendAndReceive(`patch ${userID} ${product._id}`);
    console.log("Reply:", serverReply);

    if (serverReply.includes("400") || serverReply.includes("404")) {
      await sendAndReceive(`post ${userID} ${product._id}`).then((reply) =>
        console.log("Reply:", reply),
      );
    }
    return res
      .status(200)
      .location(`/api/restaurants/${restaurant.id}/products/${product._id}`)
      .json(product);
  } catch (error) {
    console.error("Error in getProductById controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const editProduct = async (req, res) => {
  try {
    const restaurant = req.currentRestaurant;
    const product = req.currentProduct;
    const productInfo = req.body;

    if (req.file) {
      productInfo.image = req.file.filename;
    }

    if (
      !productInfo.pname?.trim() &&
      !productInfo.pdescription?.trim() &&
      (productInfo.price === undefined || productInfo.price === null) &&
      !productInfo.image
    ) {
      return res.status(400).json({ error: "At least one field must be filled" });
    }

    const editedProduct = await productService.editProduct(
      product._id.toString(),
      productInfo,
      restaurant,
    );

    if (editedProduct === null) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (editedProduct === undefined) {
      return res.status(409).json({ error: "Product already exists" });
    }
    return res.status(204).end();
  } catch (error) {
    console.error("Error in editProduct controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const restaurant = req.currentRestaurant;
    const productId = req.currentProduct._id.toString();

    const result = await productService.deleteProduct(restaurant, productId);
    if (result === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const users = await getAllusers();
    for (const user of users) {
      const serverReply = await sendAndReceive(`delete ${user.id} ${productId}`);
      console.log("Reply:", serverReply);
    }

    return res.status(204).end();
  } catch (error) {
    console.error("Error in deleteProduct controller:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};
