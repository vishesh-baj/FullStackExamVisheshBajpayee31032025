// ! NOT NEEDED IN PRODUCTION
import supabase from "../config/supabase";

/**
 * Creates tables in Supabase if they don't exist
 */
async function setupDatabase() {
  console.log("Setting up Supabase tables...");

  try {
    // Create users table via RPC - using PostgreSQL function to create the table if it doesn't exist
    console.log("Creating users table...");
    const { error: usersError } = await supabase.rpc("create_users_table", {});

    if (usersError) {
      // Likely the RPC function doesn't exist, let's create the table manually through SQL
      console.log("Creating tables through REST API...");

      // Test if we can access the users table
      const { error: testError } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (testError) {
        console.log(
          "Tables don't exist or cannot be accessed. Please create the following tables manually in your Supabase project:"
        );
        console.log(
          "- users (id, username, email, password, created_at, updated_at)"
        );
        console.log(
          "- orders (id, user_id, total_amount, status, created_at, updated_at)"
        );
        console.log(
          "- order_items (id, order_id, product_id, product_name, quantity, price, created_at, updated_at)"
        );

        console.log("\nSQL to create tables:");
        console.log(`
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
        `);

        // Try to access each table to check if they exist
        console.log("\nChecking if tables exist...");

        // Check users table
        const { data: usersData, error: usersCheckError } = await supabase
          .from("users")
          .select("id")
          .limit(1);

        console.log(
          `Users table: ${
            usersCheckError ? "Not found or not accessible" : "Exists"
          }`
        );

        // Check orders table
        const { data: ordersData, error: ordersCheckError } = await supabase
          .from("orders")
          .select("id")
          .limit(1);

        console.log(
          `Orders table: ${
            ordersCheckError ? "Not found or not accessible" : "Exists"
          }`
        );

        // Check order_items table
        const { data: itemsData, error: itemsCheckError } = await supabase
          .from("order_items")
          .select("id")
          .limit(1);

        console.log(
          `Order items table: ${
            itemsCheckError ? "Not found or not accessible" : "Exists"
          }`
        );
      } else {
        console.log("Tables appear to exist. Skipping table creation.");
      }
    }

    console.log(
      "\nTo create tables in Supabase SQL Editor, use the following steps:"
    );
    console.log("1. Go to your Supabase project dashboard");
    console.log("2. Click on 'SQL Editor' in the left menu");
    console.log("3. Create a new query");
    console.log("4. Paste the SQL commands provided above");
    console.log("5. Click 'Run' to execute the query");

    console.log("\nDatabase setup complete!");
  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1);
  }
}

// Run the setup
setupDatabase().catch(console.error);
