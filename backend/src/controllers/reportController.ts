import { Request, Response } from "express";
import { getDailyRevenue } from "../services/orderService";
import { getProductsGroupedByCategory } from "../services/productService";
import { getTopSpenders } from "../services/reportService";

export const getDailyRevenueReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dailyRevenue = await getDailyRevenue();
    res.json({
      title: "Daily Revenue (Last 7 Days)",
      data: dailyRevenue,
    });
  } catch (error) {
    console.error("Error getting daily revenue:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch daily revenue report", error });
  }
};

export const getCategorySummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categorySummary = await getProductsGroupedByCategory();

    // Transform data for better readability
    const formattedData = categorySummary.map((category) => ({
      category: category.category,
      productCount: category.count,
      totalValue: parseFloat(category.totalValue.toFixed(2)),
      averagePrice: parseFloat(category.avgPrice.toFixed(2)),
    }));

    res.json({
      title: "Category Summary Report",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getting category summary:", error);
    res.status(500).json({ message: "Failed to fetch category report", error });
  }
};

export const getTopSpendersReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const topSpenders = await getTopSpenders(limit);

    res.json({
      title: `Top ${limit} Spenders`,
      data: topSpenders,
    });
  } catch (error) {
    console.error("Error getting top spenders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch top spenders report", error });
  }
};

export const getAllReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all reports in parallel for efficiency
    const [dailyRevenue, categorySummary, topSpenders] = await Promise.all([
      getDailyRevenue(),
      getProductsGroupedByCategory(),
      getTopSpenders(5),
    ]);

    // Format the category summary
    const formattedCategorySummary = categorySummary.map((category) => ({
      category: category.category,
      productCount: category.count,
      totalValue: parseFloat(category.totalValue.toFixed(2)),
      averagePrice: parseFloat(category.avgPrice.toFixed(2)),
    }));

    res.json({
      dailyRevenue: {
        title: "Daily Revenue (Last 7 Days)",
        data: dailyRevenue,
      },
      categorySummary: {
        title: "Category Summary Report",
        data: formattedCategorySummary,
      },
      topSpenders: {
        title: "Top 5 Spenders",
        data: topSpenders,
      },
    });
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
};
