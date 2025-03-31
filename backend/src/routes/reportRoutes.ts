import express from "express";
import {
  getDailyRevenueReport,
  getCategorySummary,
  getTopSpendersReport,
  getAllReports,
} from "../controllers/reportController";
import authenticateJWT from "../middlewares/auth";

const router = express.Router();

// Protect all report routes with authentication
router.use(authenticateJWT);

// Get all reports in one call
router.get("/", getAllReports);

// Get daily revenue report
router.get("/daily-revenue", getDailyRevenueReport);

// Get product category summary
router.get("/category-summary", getCategorySummary);

// Get top spenders
router.get("/top-spenders", getTopSpendersReport);

export default router;
