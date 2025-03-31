import express from "express";
import {
  getGroupedProducts,
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController";

const router = express.Router();

// Get all products (paginated)
router.get("/", getProducts);

// Get product categories and aggregated data
router.get("/grouped", getGroupedProducts);

// Search products
router.get("/search", searchProducts);

// Get products by category
router.get("/category/:category", getProductsByCategory);

// Get a single product by ID
router.get("/:id", getProductById);

export default router;
