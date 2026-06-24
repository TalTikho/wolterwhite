import mongoose from "mongoose";
import { productModel } from "./productModel.js";

const restaurantModel = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    // Stored as strings to match the existing "(x,y)"-validated input.
    addressX: { type: Number, required: true },
    addressY: { type: Number, required: true },
    hours: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    products: { type: [productModel], default: [] },
  },
  {
    // Makes the `.id` virtual (string version of `_id`) appear in
    // res.json(...) output, matching what controllers expect.
    toJSON: { virtuals: true },
  },
);

const Restaurant = mongoose.model("Restaurant", restaurantModel);

export default Restaurant;
