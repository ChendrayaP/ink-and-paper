import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Reset password — INK & PAPER" },
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-paper py-16">
      <Container className="max-w-md">
        <p className="font-sans text-xs tracking-[0.28em] text-ink-soft">
          INK &amp; PAPER
        </p>

        <UpdatePasswordForm />

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
