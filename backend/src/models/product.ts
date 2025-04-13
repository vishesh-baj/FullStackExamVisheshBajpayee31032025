import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", category: "text" }); // Full-text search

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
