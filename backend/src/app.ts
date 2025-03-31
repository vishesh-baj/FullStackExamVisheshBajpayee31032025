import express from "express";
import securityConfig from "./middlewares/security";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import reportRoutes from "./routes/reportRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
securityConfig(app);

app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

export default app;
