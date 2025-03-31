import supabase from "../config/supabase";
import { User } from "../models/types";

// Repository for User operations
export const userRepository = {
  // Find a user by ID
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }

    return data;
  },

  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        // PGRST116 is "not found" error
        console.error("Error fetching user by email:", error);
      }
      return null;
    }

    return data;
  },

  // Create a new user
  async create(
    user: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data;
  },

  // Update a user
  async update(
    id: string,
    userData: Partial<Omit<User, "id">>
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  },

  // Delete a user
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  },
};
