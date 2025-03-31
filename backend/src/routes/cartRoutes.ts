import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";
import authenticateJWT from "../middlewares/auth";

const router = express.Router();

// All cart routes are protected with JWT authentication
// router.use(authenticateJWT); // This line is causing the TypeScript error

// Get cart items
router.get("/", authenticateJWT, getCart);

// Add item to cart
router.post("/add", authenticateJWT, addToCart);

// Update cart item quantity
router.put("/update", authenticateJWT, updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", authenticateJWT, removeFromCart);

// Clear the entire cart
router.delete("/clear", authenticateJWT, clearCart);

export default router;
