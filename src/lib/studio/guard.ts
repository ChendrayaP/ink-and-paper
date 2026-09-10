import "server-only";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export type AuthorContext = {
  supabase: ServerClient;
  userId: string;
  email: string | null;
};

export type GuardResult =
  | { ok: true; ctx: AuthorContext }
  | { ok: false; error: string };

/*
  Resolves the author's session-bound Supabase client. Writes made with it run
  as the authenticated author, so Phase 2 RLS (is_author()) authorizes them —
  RLS remains the ultimate gate even if this guard were somehow bypassed.
*/
export async function requireAuthor(): Promise<GuardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You’re not signed in." };
  try {
    const { data: isAuthor } = await supabase.rpc("is_author");
    if (isAuthor !== true) return { ok: false, error: "You’re not authorized." };
  } catch {
    return { ok: false, error: "You’re not authorized." };
  }
  return {
    ok: true,
    ctx: { supabase, userId: user.id, email: user.email ?? null },
  };
}

// re-export for callers that need the Database type
export type { Database };
