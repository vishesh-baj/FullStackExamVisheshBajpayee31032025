import { Request, Response } from "express";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import Order from "../models/orders";
import OrderItem from "../models/order_item";
import Product from "../models/product";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../services/orderService";
import supabase from "../config/sqldb";

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { items, totalAmount } = req.body;

    console.log("Checkout request received:");
    console.log("User ID:", userId);
    console.log("Items:", JSON.stringify(items, null, 2));
    console.log("Total amount:", totalAmount);

    // Validate the request
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Validation failed: No items in cart");
      res.status(400).json({ message: "No items in cart" });
      return;
    }

    if (!totalAmount || isNaN(parseFloat(totalAmount))) {
      console.log("Validation failed: Invalid total amount");
      res.status(400).json({ message: "Invalid total amount" });
      return;
    }

    try {
      //  create the order using the service
      const order = await createOrder(userId, items, parseFloat(totalAmount));

      console.log("Order created successfully:", order.id);
      res.status(201).json({
        message: "Order created successfully",
        orderId: order.id,
      });
    } catch (serviceError) {
      console.error("Service error:", serviceError);

      //  direct method if service fails
      console.log("Attempting direct order creation as fallback");

      // the order directly created in the database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total_amount: parseFloat(totalAmount),
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Direct order creation failed:", orderError);
        throw orderError;
      }

      console.log("Direct order created successfully:", orderData.id);

      // Insert items one by one with text product_id
      let insertError = null;
      for (const item of items) {
        // Generate UUID for order item
        const { data: uuidData } = await supabase.rpc("generate_uuid");
        const newId = uuidData;

        // Insert using raw SQL via RPC to bypass type constraints
        const { error } = await supabase.rpc("execute_sql", {
          sql: `INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, created_at, updated_at) 
                VALUES ('${newId}', '${orderData.id}', '${
            item.id
          }', '${item.name.replace(/'/g, "''")}', ${item.price}, ${
            item.quantity
          }, NOW(), NOW())`,
        });

        if (error) {
          console.error(`Error inserting item ${item.name}:`, error);
          insertError = error;
          break;
        }
      }

      // Handle insertion errors
      if (insertError) {
        // Clean up the order
        await supabase.from("orders").delete().eq("id", orderData.id);
        throw insertError;
      }

      res.status(201).json({
        message: "Order created successfully (direct method)",
        orderId: orderData.id,
      });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Failed to process order", error });
  }
};

export const getOrderHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // From JWT auth middleware
    const orders = await getUserOrders(userId);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order history", error });
  }
};

export const getOrderDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // From JWT auth middleware
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    // Get order details from the service
    const order = await getOrderById(orderId, userId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Failed to get order details:", error);
    res.status(500).json({ message: "Failed to get order details", error });
  }
};

export const getDailyRevenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Advanced SQL query using Sequelize
    const dailyRevenue = await Order.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("sum", Sequelize.col("totalAmount")), "revenue"],
      ],
      where: {
        status: "completed",
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("date", Sequelize.col("createdAt")), "DESC"]],
    });

    res.status(200).json(dailyRevenue);
  } catch (error) {
    console.error("Error in getDailyRevenue:", error);
    res.status(500).json({ message: "Failed to get daily revenue", error });
  }
};

export const getTopSpenders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get top 5 customers by total spending
    const topSpenders = await Order.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("sum", Sequelize.col("totalAmount")), "totalSpent"],
      ],
      include: [
        {
          model: OrderItem,
          attributes: [],
        },
      ],
      where: {
        status: "completed",
      },
      group: ["userId"],
      order: [[Sequelize.fn("sum", Sequelize.col("totalAmount")), "DESC"]],
      limit: 5,
    });

    res.status(200).json(topSpenders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get top spenders", error });
  }
};
