import mongoose from "mongoose";

// Products live embedded inside each restaurant's `products` array (no
// separate top-level collection) — this just defines the shape of each
// embedded item. `_id: false` avoids Mongoose auto-generating a second id
// field on top of the existing pId.
export const productModel = new mongoose.Schema(
  {
    pId: { type: String, required: true },
    pname: { type: String, required: true },
    pdescription: { type: String },
    price: { type: Number },
    image: { type: String, default: "" },
  },
  { _id: false },
);
