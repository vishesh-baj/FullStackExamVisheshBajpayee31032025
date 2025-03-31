import dotenv from "dotenv";
import { hash } from "bcrypt";
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

// Sample user data for SQL
const sampleUsers = [
  { username: "admin", email: "admin@example.com", password: "admin123" },
  { username: "john_doe", email: "john@example.com", password: "password123" },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
  },
];

// Function to simulate seeding MongoDB (Products)
async function simulateMongoDB() {
  try {
    console.log("Simulating MongoDB Products Seeding...");
    console.log("✅ Would delete existing products");

    // Display sample products data
    console.log("\n📄 Sample Products Data:");
    console.table(sampleProducts);
    console.log(`✅ Would add ${sampleProducts.length} products to MongoDB`);
  } catch (error) {
    console.error("❌ Error in simulation:", error);
  }
}

// Function to simulate seeding SQL (Users, Orders, Order Items)
async function simulateSQL() {
  try {
    console.log("\nSimulating SQL Database Seeding...");
    console.log("✅ Would sync database schema");

    // Simulate creating users with hashed passwords
    const simulatedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await hash(user.password, SALT_ROUNDS);
        return {
          id: `user-${Math.random().toString(36).substring(7)}`,
          ...user,
          password: hashedPassword,
        };
      })
    );

    console.log("\n📄 Sample Users Data (with hashed passwords):");
    console.table(
      simulatedUsers.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        password: u.password.substring(0, 20) + "...", // Show truncated hash for display
      }))
    );

    // Simulate creating orders and order items
    const orders = [];
    const orderItems = [];

    for (const user of simulatedUsers) {
      // Create 1-3 orders per user
      const numOrders = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numOrders; i++) {
        // Generate unique order ID
        const orderId = `order-${Math.random().toString(36).substring(7)}`;

        // Randomly select 1-4 products for this order
        const numItems = Math.floor(Math.random() * 4) + 1;
        let totalAmount = 0;

        for (let j = 0; j < numItems; j++) {
          const randomProduct =
            sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = randomProduct.price;

          // Generate unique order item ID
          const orderItemId = `item-${Math.random().toString(36).substring(7)}`;

          orderItems.push({
            id: orderItemId,
            orderId: orderId,
            productName: randomProduct.name,
            quantity,
            price,
          });

          totalAmount += price * quantity;
        }

        // Create the order
        orders.push({
          id: orderId,
          userId: user.id,
          totalAmount,
          status: ["pending", "completed"][Math.floor(Math.random() * 2)],
        });
      }
    }

    console.log(`\n📄 Sample Orders Data (${orders.length} orders):`);
    console.table(orders);

    console.log(`\n📄 Sample Order Items Data (${orderItems.length} items):`);
    console.table(orderItems);
  } catch (error) {
    console.error("❌ Error in simulation:", error);
  }
}

// Main simulation function
async function simulate() {
  try {
    console.log("🌱 Starting Database Seeding Simulation...");

    // Simulate MongoDB seeding
    await simulateMongoDB();

    // Simulate SQL seeding
    await simulateSQL();

    console.log("\n✅ Database seeding simulation completed successfully!");
  } catch (error) {
    console.error("❌ Error during simulation:", error);
  }
}

// Run the simulation
simulate();
