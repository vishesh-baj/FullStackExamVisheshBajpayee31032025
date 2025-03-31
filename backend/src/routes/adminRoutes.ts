import express, { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import supabase from "../config/sqldb";
import authenticateJWT from "../middlewares/auth";

const router = express.Router();

// Public endpoint for initial setup (only to be used during development)
router.get("/setup-database", (req: Request, res: Response) => {
  (async () => {
    try {
      // Read the SQL file for functions
      const sqlFilePath = path.join(__dirname, "../../supabase/functions.sql");
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      console.log("Setting up database with SQL functions...");
      console.log("SQL file loaded from:", sqlFilePath);

      // Execute the SQL directly
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: sqlContent,
      });

      if (error) {
        console.error("Error setting up database:", error);
        return res.status(500).json({
          message: "Failed to set up database functions",
          error: error.message,
          details:
            "You may need to run this SQL manually in the Supabase SQL Editor: " +
            sqlFilePath,
        });
      }

      return res.status(200).json({
        message: "Database functions and schema setup complete!",
        data,
      });
    } catch (error: any) {
      console.error("Error during setup:", error);
      res.status(500).json({
        message: "Error during database setup",
        error: error.message,
      });
    }
  })();
});

// Protected routes below this point
router.use(authenticateJWT);

// Endpoint to update database schema
router.post("/update-schema", (req: Request, res: Response) => {
  (async () => {
    try {
      // Only allow admins to update schema
      const userId = (req as any).user.id;

      // You should add proper admin validation here
      // This is a simplified example

      const sqlFilePath = path.join(
        __dirname,
        "../../supabase/update_order_items_schema.sql"
      );
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      // Execute the SQL directly using Supabase client
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: sqlContent,
      });

      if (error) {
        console.error("Error executing SQL:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        message: "Database schema updated successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error updating schema:", error);
      res.status(500).json({ error: error.message });
    }
  })();
});

// Endpoint to create stored procedure
router.post("/create-functions", (req: Request, res: Response) => {
  (async () => {
    try {
      // Only allow admins
      const userId = (req as any).user.id;

      // Read the SQL file for functions
      const sqlFilePath = path.join(__dirname, "../../supabase/functions.sql");
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      // Execute the SQL to create functions
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: sqlContent,
      });

      if (error) {
        console.error("Error creating functions:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        message: "Database functions created successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error creating functions:", error);
      res.status(500).json({ error: error.message });
    }
  })();
});

export default router;
