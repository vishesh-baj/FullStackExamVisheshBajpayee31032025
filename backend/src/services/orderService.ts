import supabase from "../config/sqldb";
import { Order, OrderItem } from "../models/types";
import { PostgrestError } from "@supabase/supabase-js";

export const getDailyRevenue = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("status", "completed");

  if (error) {
    console.error("Error fetching daily revenue:", error);
    throw error;
  }

  // Process data to get daily revenue
  const dailyRevenue = data.reduce((acc: Record<string, number>, order) => {
    const date = new Date(order.created_at as string)
      .toISOString()
      .split("T")[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.total_amount;
    return acc;
  }, {});

  // Convert to array format
  return Object.keys(dailyRevenue)
    .map((date) => ({
      date,
      revenue: dailyRevenue[date],
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface InsertionError {
  item: CartItem;
  error: PostgrestError;
}

/**
 * Creates a new order using Supabase
 */
export const createOrder = async (
  userId: string,
  items: CartItem[],
  totalAmount: number
): Promise<Order> => {
  try {
    console.log("Creating order with userId:", userId);
    console.log("Items:", JSON.stringify(items, null, 2));
    console.log("Total amount:", totalAmount);

    // Step 1: Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    console.log("Order created:", order.id);

    // Step 2: Insert items one by one, bypassing the RLS policy
    let insertSuccess = true;
    let insertionErrors: InsertionError[] = [];

    for (const item of items) {
      // Try direct SQL execution since the ORM is having issues with the data types
      const { error } = await supabase.rpc("insert_order_item_raw", {
        p_order_id: order.id,
        p_product_id: item.id,
        p_product_name: item.name,
        p_price: item.price,
        p_quantity: item.quantity,
      });

      if (error) {
        console.error(`Error inserting item ${item.name}:`, error);
        insertSuccess = false;
        insertionErrors.push({ item, error });
        break;
      }
    }

    // If any insertion failed, clean up and throw error
    if (!insertSuccess) {
      console.error("Failed to insert all items, cleaning up order");
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(
        `Failed to insert order items: ${JSON.stringify(insertionErrors)}`
      );
    }

    console.log("All items inserted successfully");
    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

/**
 * Get all orders for a specific user with their items
 */
export const getUserOrders = async (userId: string) => {
  // First get all orders for the user
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching user orders:", ordersError);
    throw ordersError;
  }

  // Then get all order items for these orders
  if (orders && orders.length > 0) {
    const orderIds = orders.map((order) => order.id);

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      throw itemsError;
    }

    // Attach items to their respective orders
    return orders.map((order) => ({
      ...order,
      orderItems: items?.filter((item) => item.order_id === order.id) || [],
    }));
  }

  return orders || [];
};

/**
 * Get detailed order information by order ID
 */
export const getOrderById = async (orderId: string, userId: string) => {
  // Get the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (orderError) {
    console.error("Error fetching order:", orderError);
    return null;
  }

  if (!order) return null;

  // Get the order items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    throw itemsError;
  }

  // Combine order with its items
  return {
    ...order,
    orderItems: items || [],
  };
};
