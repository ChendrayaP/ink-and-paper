"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setBookStatus } from "@/lib/studio/actions";
import { StatusBadge } from "@/components/studio/ui";

export function PublishPanel({
  id,
  status,
}: {
  id: string;
  status: "published" | "draft";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function act() {
    setError(null);
    const publishing = status !== "published";
    const msg = publishing
      ? "Publish this book? It will become visible to readers immediately."
      : "Unpublish this book? Readers will no longer be able to access it.";
    if (!window.confirm(msg)) return;
    start(async () => {
      const res = await setBookStatus(id, publishing ? "published" : "draft");
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-ink-soft">Current status:</span>
        <StatusBadge status={status} />
      </div>
      {error ? (
        <p role="alert" className="mt-4 border-l-2 border-accent pl-4 font-sans text-sm text-ink">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={act}
        disabled={pending}
        className="mt-5 inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {pending
          ? "Working…"
          : status === "published"
            ? "Unpublish"
            : "Publish"}
      </button>
      <p className="mt-3 font-sans text-xs text-ink-soft">
        Publishing requires a title, a cover, and at least one chapter.
      </p>
    </div>
  );
}
