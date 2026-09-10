import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudioChrome } from "@/components/studio/StudioChrome";
import { Unauthorized } from "@/components/studio/Unauthorized";
import { devFixturesEnabled } from "@/lib/data/fixtures";

export const dynamic = "force-dynamic";

/*
  Authoritative server-side gate for the Studio.
  - Production: no session -> /auth; authed non-author -> Unauthorized; author -> Studio.
  - Dev preview ONLY (NEXT_PUBLIC_USE_DEV_FIXTURES): renders the chrome without a
    real session so the UI can be reviewed locally. The flag is never set in
    production, so this branch never runs there. RLS remains the ultimate gate.
*/
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (devFixturesEnabled()) {
    return <StudioChrome email="preview (dev fixtures)">{children}</StudioChrome>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  let isAuthor = false;
  try {
    const { data } = await supabase.rpc("is_author");
    isAuthor = data === true;
  } catch {
    isAuthor = false;
  }
  if (!isAuthor) return <Unauthorized />;

  return <StudioChrome email={user.email ?? null}>{children}</StudioChrome>;
}
