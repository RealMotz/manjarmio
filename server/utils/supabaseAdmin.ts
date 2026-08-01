import { createClient } from "@supabase/supabase-js";
import type { Database } from "~~/database.types.ts";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function useSupabaseAdmin() {
  if (!client) {
    const config = useRuntimeConfig();
    client = createClient<Database>(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }

  return client;
}
