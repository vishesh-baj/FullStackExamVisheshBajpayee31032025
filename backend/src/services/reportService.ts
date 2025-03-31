import supabase from "../config/sqldb";
import { Order, User } from "../models/types";

/**
 * Get top spenders (customers who have spent the most)
 */
export const getTopSpenders = async (limit: number = 5) => {
  // We need to get all completed orders and then aggregate them by user
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      user_id,
      total_amount,
      users (
        username,
        email
      )
    `
    )
    .eq("status", "completed");

  if (error) {
    console.error("Error fetching top spenders:", error);
    throw error;
  }

  // Group and aggregate orders by user
  const userTotals: Record<
    string,
    {
      userId: string;
      username: string;
      email: string;
      totalSpent: number;
    }
  > = {};

  orders?.forEach((order) => {
    const userId = order.user_id;
    const user = order.users as any;

    if (!userTotals[userId]) {
      userTotals[userId] = {
        userId,
        username: user?.username || "Unknown",
        email: user?.email || "Unknown",
        totalSpent: 0,
      };
    }

    userTotals[userId].totalSpent += Number(order.total_amount);
  });

  // Convert to array, sort by total spent, and limit results
  return Object.values(userTotals)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map((user) => ({
      ...user,
      totalSpent: user.totalSpent.toFixed(2),
    }));
};

/**
 * Get sales by month
 */
export const getSalesByMonth = async (
  year: number = new Date().getFullYear()
) => {
  // Get all completed orders for the specified year
  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("status", "completed")
    .gte("created_at", `${year}-01-01`)
    .lt("created_at", `${year + 1}-01-01`);

  if (error) {
    console.error("Error fetching sales by month:", error);
    throw error;
  }

  // Group by month and aggregate
  const monthlyData: Record<number, { revenue: number; orderCount: number }> =
    {};

  // Initialize all months
  for (let i = 1; i <= 12; i++) {
    monthlyData[i] = { revenue: 0, orderCount: 0 };
  }

  // Aggregate data
  data?.forEach((order) => {
    const date = new Date(order.created_at as string);
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed

    monthlyData[month].revenue += Number(order.total_amount);
    monthlyData[month].orderCount += 1;
  });

  // Map month numbers to names for better readability
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return Object.entries(monthlyData).map(([month, data]) => ({
    month: monthNames[parseInt(month) - 1],
    revenue: data.revenue.toFixed(2),
    orderCount: data.orderCount,
  }));
};

/**
 * Get revenue comparison year over year
 */
export const getYearOverYearComparison = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Get current year revenue
  const { data: currentYearData, error: currentYearError } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", "completed")
    .gte("created_at", `${currentYear}-01-01`)
    .lt("created_at", `${currentYear + 1}-01-01`);

  if (currentYearError) {
    console.error("Error fetching current year revenue:", currentYearError);
    throw currentYearError;
  }

  // Get previous year revenue
  const { data: previousYearData, error: previousYearError } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", "completed")
    .gte("created_at", `${previousYear}-01-01`)
    .lt("created_at", `${previousYear + 1}-01-01`);

  if (previousYearError) {
    console.error("Error fetching previous year revenue:", previousYearError);
    throw previousYearError;
  }

  // Calculate totals
  const currentYearRevenue =
    currentYearData?.reduce(
      (total, order) => total + Number(order.total_amount),
      0
    ) || 0;

  const previousYearRevenue =
    previousYearData?.reduce(
      (total, order) => total + Number(order.total_amount),
      0
    ) || 0;

  // Calculate growth percentage
  const growth = previousYearRevenue
    ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100
    : 100; // If no previous year data, growth is 100%

  return {
    currentYear,
    previousYear,
    currentYearRevenue: currentYearRevenue.toFixed(2),
    previousYearRevenue: previousYearRevenue.toFixed(2),
    growthPercentage: growth.toFixed(2),
  };
};
