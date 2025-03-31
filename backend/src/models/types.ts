// Type definitions for our database models using Supabase

// User model
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

// Order model
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

// Order Item model
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string; // This is a MongoDB-style ID, not a UUID
  product_name: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

// Database schema type
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
    };
  };
};
