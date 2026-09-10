import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Author sign in — INK & PAPER" },
  robots: { index: false, follow: false },
};

export default async function AuthPage() {
  // If an author is already signed in, send them to the Studio.
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: isAuthor } = await supabase.rpc("is_author");
        if (isAuthor) redirect("/studio");
      }
    } catch {
      // fall through to the login form
    }
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-paper py-16">
      <Container className="max-w-md">
        <p className="font-sans text-xs tracking-[0.28em] text-ink-soft">
          INK &amp; PAPER
        </p>
        <h1 className="mt-6 font-serif text-3xl leading-tight text-ink">
          The Studio
        </h1>
        <p className="mt-3 font-sans text-sm text-ink-soft">
          A private area for the author. Sign in to manage the books.
        </p>

        <LoginForm />

        <div className="mt-10 border-t border-line pt-6">
          <Link
            href="/"
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
          >
            ← Back to INK &amp; PAPER
          </Link>
        </div>
      </Container>
    </main>
  );
}
