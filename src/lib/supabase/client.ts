"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Browser Supabase client (anon key). Use in Client Components.
 * Subject to Row Level Security — safe to expose.
 */
export function createClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
