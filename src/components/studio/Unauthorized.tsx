import Link from "next/link";
import { SignOutButton } from "@/components/studio/SignOutButton";

export function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-2xl leading-tight text-ink">
          This area is for the author.
        </h1>
        <p className="mt-3 font-sans text-sm text-ink-soft">
          Your account doesn’t have access to the Studio.
        </p>
        <div className="mt-8 flex items-center gap-5">
          <SignOutButton />
          <Link
            href="/"
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
          >
            Return to the site
          </Link>
        </div>
      </div>
    </div>
  );
}
