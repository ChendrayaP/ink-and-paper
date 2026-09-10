import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireSupabasePublicEnv, serviceRoleKey } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Service-role Supabase client. SERVER-ONLY and RLS-BYPASSING.
 *
 * Use only in trusted server code for privileged, validated operations
 * (e.g. writing a moderated reader-photo upload). Never import this into a
 * Client Component — the "server-only" guard above will fail the build if you
 * try. The service-role key is never sent to the browser.
 */
export function createAdminClient() {
  const { url } = requireSupabasePublicEnv();
  return createSupabaseClient<Database>(url, serviceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
