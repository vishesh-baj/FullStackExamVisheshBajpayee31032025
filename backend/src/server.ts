import dotenv from "dotenv";
import app from "./app";
import "./config/supabase"; // Import to initialize Supabase
import connectMongoDB from "./config/mongodb";

dotenv.config();
const PORT = process.env.PORT || 5000;

(async () => {
  // Connect to MongoDB for any collections still using it
  await connectMongoDB();

  // Start the server
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
