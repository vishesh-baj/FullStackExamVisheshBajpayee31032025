import dotenv from "dotenv";
import { hash } from "bcrypt";
import connectMongoDB from "../config/mongodb";
import supabase from "../config/sqldb";
import Product from "../models/product";

dotenv.config();

const SALT_ROUNDS = 10;

// Sample product data for MongoDB
const sampleProducts = [
  { name: "Laptop", category: "Electronics", price: 999.99 },
  { name: "Smartphone", category: "Electronics", price: 699.99 },
  { name: "Bluetooth Headphones", category: "Electronics", price: 149.99 },
  { name: "Tablet", category: "Electronics", price: 349.99 },
  { name: "Smart Watch", category: "Electronics", price: 249.99 },
  { name: "T-shirt", category: "Clothing", price: 19.99 },
  { name: "Jeans", category: "Clothing", price: 49.99 },
  { name: "Sneakers", category: "Footwear", price: 79.99 },
  { name: "Backpack", category: "Accessories", price: 39.99 },
  { name: "Water Bottle", category: "Accessories", price: 14.99 },
  { name: "Yoga Mat", category: "Fitness", price: 24.99 },
  { name: "Dumbbells Set", category: "Fitness", price: 99.99 },
  { name: "Coffee Maker", category: "Home", price: 89.99 },
  { name: "Blender", category: "Home", price: 59.99 },
  { name: "Desk Lamp", category: "Home", price: 29.99 },
];

// Sample user data for Supabase
const sampleUsers = [
  { username: "admin", email: "admin@example.com", password: "admin123" },
  { username: "john_doe", email: "john@example.com", password: "password123" },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
  },
];

// Function to seed MongoDB (Products)
async function seedMongoDB() {
  try {
    console.log("Seeding MongoDB Products...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("✅ Deleted existing products");

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${sampleProducts.length} products to MongoDB`);
  } catch (error) {
    console.error("❌ Error seeding MongoDB:", error);
    throw error;
  }
}

// Function to check if a table exists in Supabase
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    console.log(`Checking if table '${tableName}' exists...`);
    // Instead of using pg_tables which requires higher privileges,
    // we'll just try to select from the table
    const { error } = await supabase.from(tableName).select("id").limit(1);

    if (error) {
      if (error.code === "42P01") {
        // Relation doesn't exist
        console.error(`Table '${tableName}' does not exist:`, error.message);
        return false;
      }

      // Other error but table might exist
      console.error(`Error checking table '${tableName}':`, error);
      // We'll assume it might exist
      return true;
    }

    return true;
  } catch (error) {
    console.error(`Exception checking table '${tableName}':`, error);
    return false;
  }
}

// Function to seed Supabase (Users, Orders, Order Items)
async function seedSupabase() {
  try {
    console.log("Seeding Supabase Database...");

    // Check if required tables exist
    const userTableExists = await checkTableExists("users");
    const ordersTableExists = await checkTableExists("orders");
    const orderItemsTableExists = await checkTableExists("order_items");

    console.log(
      `Tables exist check - users: ${userTableExists}, orders: ${ordersTableExists}, order_items: ${orderItemsTableExists}`
    );

    if (!userTableExists || !ordersTableExists || !orderItemsTableExists) {
      console.error(
        "❌ Required tables do not exist in Supabase. Please run the setup-db.ts script first and create the tables manually in the Supabase dashboard."
      );
      console.log("\nRun: node dist/scripts/setup-db.js");
      console.log(
        "Then follow the instructions to create the tables in the Supabase dashboard."
      );
      return;
    }

    // Clear existing data
    console.log("Deleting existing data...");
    try {
      // Delete in the correct order to maintain referential integrity
      const { error: deleteItemsError } = await supabase
        .from("order_items")
        .delete()
        .not("id", "is", null);

      if (deleteItemsError) {
        console.error("Error deleting order items:", deleteItemsError);
      } else {
        console.log("✅ Deleted existing order items");
      }

      const { error: deleteOrdersError } = await supabase
        .from("orders")
        .delete()
        .not("id", "is", null);

      if (deleteOrdersError) {
        console.error("Error deleting orders:", deleteOrdersError);
      } else {
        console.log("✅ Deleted existing orders");
      }

      const { error: deleteUsersError } = await supabase
        .from("users")
        .delete()
        .not("id", "is", null);

      if (deleteUsersError) {
        console.error("Error deleting users:", deleteUsersError);
      } else {
        console.log("✅ Deleted existing users");
      }
    } catch (e) {
      console.error("Error during data deletion:", e);
    }

    // Create users with hashed passwords
    const createdUsers = [];
    for (const user of sampleUsers) {
      console.log(`Creating user: ${user.username}...`);
      try {
        const hashedPassword = await hash(user.password, SALT_ROUNDS);

        const { data: createdUser, error } = await supabase
          .from("users")
          .insert({
            username: user.username,
            email: user.email,
            password: hashedPassword,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating user ${user.username}:`, error);
          continue; // Skip this user but continue with others
        }

        if (!createdUser) {
          console.error(
            `Failed to create user ${user.username}, no data returned`
          );
          continue;
        }

        console.log(
          `✅ Created user: ${user.username} with ID: ${createdUser.id}`
        );
        createdUsers.push(createdUser);
      } catch (err) {
        console.error(`Exception while creating user ${user.username}:`, err);
      }
    }
    console.log(`✅ Added ${createdUsers.length} users`);

    // If no users were created, we can't continue
    if (createdUsers.length === 0) {
      console.error("❌ No users were created. Cannot continue with orders.");
      return;
    }

    // Create sample orders and order items for users
    for (const user of createdUsers) {
      console.log(`Creating orders for user ID: ${user.id}...`);
      // Create 1-3 orders per user
      const numOrders = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numOrders; i++) {
        // Randomly select 1-4 products for this order
        const orderItems = [];
        const numItems = Math.floor(Math.random() * 4) + 1;
        let totalAmount = 0;

        for (let j = 0; j < numItems; j++) {
          const randomProduct =
            sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = randomProduct.price;

          orderItems.push({
            product_name: randomProduct.name,
            quantity,
            price,
          });

          totalAmount += price * quantity;
        }

        try {
          // Create the order
          console.log(`Creating order with total amount: ${totalAmount}...`);
          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
              user_id: user.id,
              total_amount: totalAmount,
              status: ["pending", "completed"][Math.floor(Math.random() * 2)],
            })
            .select()
            .single();

          if (orderError) {
            console.error("Error creating order:", orderError);
            console.error("Order data:", {
              user_id: user.id,
              total_amount: totalAmount,
              status: ["pending", "completed"][Math.floor(Math.random() * 2)],
            });
            continue;
          }

          if (!order) {
            console.error("Failed to create order, no data returned");
            continue;
          }

          console.log(`✅ Created order with ID: ${order.id}`);

          // Create the order items
          console.log(`Creating ${orderItems.length} order items...`);
          const orderItemsToInsert = orderItems.map((item) => ({
            order_id: order.id,
            product_id: "00000000-0000-0000-0000-000000000000", // Placeholder ID
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsToInsert);

          if (itemsError) {
            console.error("Error creating order items:", itemsError);
            console.error("First order item data:", orderItemsToInsert[0]);
            continue;
          }

          console.log(
            `✅ Created ${orderItems.length} order items for order ID: ${order.id}`
          );
        } catch (err) {
          console.error("Exception while creating order:", err);
        }
      }
    }

    console.log("✅ Created sample orders and order items");
  } catch (error) {
    console.error("❌ Error seeding Supabase database:", error);
    console.dir(error, { depth: null }); // Print the full error object
    throw error;
  }
}

// Main seed function
async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    await connectMongoDB();
    console.log("✅ Connected to MongoDB");

    // Test Supabase connection
    console.log("Testing Supabase connection...");
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Failed to connect to Supabase:", error);
        throw error;
      }
      console.log("✅ Connected to Supabase");
    } catch (error) {
      console.error("❌ Failed to connect to Supabase:", error);
      throw error;
    }

    // Seed MongoDB
    await seedMongoDB();

    // Seed Supabase Database
    await seedSupabase();

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding process:", error);
    console.dir(error, { depth: null }); // Print the full error object
    process.exit(1);
  }
}

// Run the seed function
seed();
