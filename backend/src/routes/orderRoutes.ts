import express, { Request, Response } from "express";
import {
  checkout,
  getOrderHistory,
  getOrderDetails,
  getDailyRevenue,
  getTopSpenders,
} from "../controllers/orderController";
import authenticateJWT from "../middlewares/auth";
import supabase from "../config/sqldb";

const router = express.Router();

// All order routes are protected with JWT authentication
router.use(authenticateJWT);

// Diagnostic route to check column type (temporary)
router.get("/check-schema", (req: Request, res: Response) => {
  (async () => {
    try {
      // Check the schema of order_items table
      const { data, error } = await supabase
        .from("information_schema.columns")
        .select("data_type")
        .eq("table_name", "order_items")
        .eq("column_name", "product_id")
        .single();

      if (error) {
        return res.status(500).json({ error });
      }

      return res.status(200).json({ column_type: data?.data_type });
    } catch (error) {
      return res.status(500).json({ error });
    }
  })();
});

// Process checkout
router.post("/checkout", checkout);

// Get user's order history
router.get("/history", getOrderHistory);

// Get specific order details
router.get("/:orderId", getOrderDetails);

// Get daily revenue report (admin only)
router.get("/reports/daily-revenue", getDailyRevenue);

// Get top spenders report (admin only)
router.get("/reports/top-spenders", getTopSpenders);

export default router;
