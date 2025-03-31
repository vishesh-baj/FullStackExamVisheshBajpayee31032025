import { Request, Response } from "express";
import Product from "../models/product";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //the frontend handles cart storage for simplicity
    res.status(200).json({
      message: "Cart should be managed client-side for this demo",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      res.status(400).json({ message: "Invalid product ID or quantity" });
      return;
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    //  return success to handle in frontend
    res.status(200).json({
      message: "Product added to cart",
      product,
      quantity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 0) {
      res.status(400).json({ message: "Invalid product ID or quantity" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // for this demo just return success
    res.status(200).json({
      message: "Cart updated successfully",
      product,
      quantity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error });
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    // Validate input
    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    res.status(200).json({
      message: "Item removed from cart",
      productId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", error });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};
