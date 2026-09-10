import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, requireSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/*
  Refreshes the Supabase auth session on the request/response cookies and
  reports the current user. Follows the @supabase/ssr middleware pattern: the
  returned response carries any refreshed cookies and must be used as-is (or
  have its cookies copied onto a redirect). Uses the anon key only.
*/
export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: { id: string } | null }> {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return { response, user: null };
  }

  const { url, anonKey } = requireSupabasePublicEnv();
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user ? { id: data.user.id } : null;
  } catch {
    user = null;
  }

  return { response, user };
}
