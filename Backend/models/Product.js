import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true
}
,
    stock: { type: Number, required: true },
    images: [{ type: String }]
  },
  { timestamps: true }
);

productSchema.index({ name: "text" });

export default mongoose.model("Product", productSchema);
