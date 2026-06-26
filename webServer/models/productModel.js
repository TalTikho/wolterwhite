import mongoose from "mongoose";

// Products now live in their own top-level collection so they can be
// updated independently via findByIdAndUpdate without needing to pull
// and re-save the entire parent restaurant document.
const productSchema = new mongoose.Schema(
  {
    pname: { type: String, required: true },
    pdescription: { type: String },
    price: { type: Number },
    image: { type: String, default: "" },
  },
  {
    // Makes the `.id` virtual (string version of `_id`) appear in
    // res.json(...) output, matching what controllers expect.
    toJSON: { virtuals: true },
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;