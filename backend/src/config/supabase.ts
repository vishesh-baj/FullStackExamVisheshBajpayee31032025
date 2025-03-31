import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Database } from "../models/types";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: Supabase URL and key must be provided in environment variables"
  );
  console.error("SUPABASE_URL:", supabaseUrl ? "Set" : "Not Set");
  console.error("SUPABASE_ANON_KEY:", supabaseKey ? "Set" : "Not Set");
  process.exit(1);
}

console.log("Initializing Supabase client with URL:", supabaseUrl);
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
