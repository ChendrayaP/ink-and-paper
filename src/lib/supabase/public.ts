import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Cookieless anon client for reading PUBLIC content in Server Components.
 * It carries no session, so pages that use it can be statically cached and
 * revalidated. Row Level Security (as the `anon` role) still applies, so this
 * can only ever see published books and published testimonials — it does not
 * bypass RLS.
 */
export function createPublicClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
