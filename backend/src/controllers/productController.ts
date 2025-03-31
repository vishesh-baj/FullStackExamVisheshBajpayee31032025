import { Request, Response } from "express";
import {
  getPaginatedProducts,
  getProductsGroupedByCategory,
  getProductsByCategory as getProductsByCategoryService,
  searchProducts as searchProductsService,
  getProductById as getProductByIdService,
} from "../services/productService";

export const getGroupedProducts = async (req: Request, res: Response) => {
  try {
    const data = await getProductsGroupedByCategory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  // usage: /products?page=2&limit=10
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await getPaginatedProducts(page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const product = await getProductByIdService(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!category) {
      res.status(400).json({ message: "Category is required" });
      return;
    }

    const data = await getProductsByCategoryService(category, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!q) {
      // If no search term, return all products
      const data = await getPaginatedProducts(page, limit);
      res.json(data);
      return;
    }

    const data = await searchProductsService(q as string, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
