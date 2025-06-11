import type { SupabaseClient } from "src/db/supabase.client.ts";
import type { Database } from "../db/database.types";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      session: {
        user: {
          id: string;
          email: string;
        } | null;
      };
    }
  }
}
