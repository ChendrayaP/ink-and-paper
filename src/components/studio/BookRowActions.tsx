"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setBookStatus, deleteBook } from "@/lib/studio/actions";

export function BookRowActions({
  id,
  status,
  title,
}: {
  id: string;
  status: "published" | "draft";
  title: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    if (status === "published") {
      if (!window.confirm("Unpublish this book? Readers will no longer be able to access it.")) return;
    } else {
      if (!window.confirm("Publish this book? It will become visible to readers immediately.")) return;
    }
    start(async () => {
      const res = await setBookStatus(id, status === "published" ? "draft" : "published");
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function remove() {
    setError(null);
    if (!window.confirm(`Delete “${title}”? Its chapters and content will also be permanently removed. This cannot be undone.`)) return;
    start(async () => {
      const res = await deleteBook(id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-60"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="rounded-[2px] px-3 py-1.5 font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60"
      >
        Delete
      </button>
      {error ? (
        <span role="alert" className="font-sans text-sm text-accent">
          {error}
        </span>
      ) : null}
    </div>
  );
}
