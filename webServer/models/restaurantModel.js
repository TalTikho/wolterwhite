import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    addressX: { type: Number, required: true },
    addressY: { type: Number, required: true },
    hours: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    // References to the Product collection — populated on every read
    // so callers always receive full product objects, not bare IDs.
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    toJSON: { virtuals: true },
  },
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;