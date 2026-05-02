import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gvhsxrqgvvqhxjwfnzgj.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_TsUtJweF32h3Bdve280csg_GXWTeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aHN4cnFndnZxaHhqd2ZuemdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDgzOTIsImV4cCI6MjA5MzIyNDM5Mn0.5e5FVf27vJ9tzcZXwhbfTeq93BKG2DA1S9tncFr-lq8l"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
