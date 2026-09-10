"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SectionRow } from "@/lib/studio/queries";
import {
  addSection,
  deleteSection,
  saveChapterOrder,
} from "@/lib/studio/actions";

export function ChapterManager({
  bookId,
  acknowledgments,
  intro,
  hasContents,
  chapters: initialChapters,
  epilogue,
}: {
  bookId: string;
  acknowledgments: SectionRow | null;
  intro: SectionRow | null;
  hasContents: boolean;
  chapters: SectionRow[];
  epilogue: SectionRow | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [chapters, setChapters] = useState(initialChapters);
  const [error, setError] = useState<string | null>(null);

  function persist(next: SectionRow[]) {
    setChapters(next);
    start(async () => {
      const res = await saveChapterOrder(bookId, next.map((c) => c.id));
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= chapters.length) return;
    const next = [...chapters];
    [next[index], next[target]] = [next[target], next[index]];
    setError(null);
    persist(next);
  }

  function addChapter() {
    setError(null);
    start(async () => {
      const res = await addSection(bookId, "chapter");
      if (!res.ok) setError(res.error);
      else if (res.data?.id && res.data.id !== "preview")
        router.push(`/studio/books/${bookId}/sections/${res.data.id}`);
      else router.refresh();
    });
  }

  function addIntro() {
    setError(null);
    start(async () => {
      const res = await addSection(bookId, "introduction");
      if (!res.ok) setError(res.error);
      else if (res.data?.id && res.data.id !== "preview")
        router.push(`/studio/books/${bookId}/sections/${res.data.id}`);
      else router.refresh();
    });
  }

  function del(id: string, label: string) {
    if (!window.confirm(`Delete “${label}”? This cannot be undone. Remaining chapters renumber automatically.`)) return;
    setError(null);
    start(async () => {
      const res = await deleteSection(id);
      if (!res.ok) setError(res.error);
      else {
        setChapters((cs) => cs.filter((c) => c.id !== id));
        router.refresh();
      }
    });
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-5 border-l-2 border-accent pl-4 font-sans text-sm text-ink">
          {error}
        </p>
      ) : null}

      {/* Front matter */}
      <h3 className="font-sans text-sm font-semibold tracking-wide text-ink">
        Front matter
      </h3>
      <p className="mt-1 font-sans text-xs text-ink-soft">
        Front matter is never numbered as a chapter.
      </p>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3 border border-line bg-paper-raised px-4 py-3">
          <span className="font-serif text-base text-ink">Acknowledgments</span>
          {acknowledgments ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/studio/books/${bookId}/sections/${acknowledgments.id}`}
                className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => del(acknowledgments.id, "Acknowledgments")}
                disabled={pending}
                className="font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ) : (
            <span className="font-sans text-xs text-ink-soft">Not present</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border border-line bg-paper-raised px-4 py-3">
          <span className="font-serif text-base text-ink">Introduction</span>
          {intro ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/studio/books/${bookId}/sections/${intro.id}`}
                className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => del(intro.id, "Introduction")}
                disabled={pending}
                className="font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={addIntro}
              disabled={pending}
              className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-60"
            >
              Add introduction
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border border-line bg-paper-raised px-4 py-3">
          <span className="font-serif text-base text-ink">Contents</span>
          <span className="font-sans text-xs text-ink-soft">
            {hasContents || chapters.length > 0
              ? "Generated automatically from your chapters"
              : "Appears automatically once you add chapters"}
          </span>
        </div>
      </div>

      {/* Chapters */}
      <div className="mt-10 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide text-ink">
            Chapters
          </h3>
          <p className="mt-1 font-sans text-xs text-ink-soft">
            Numbers are set by order — reordering renumbers automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={addChapter}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
        >
          Add chapter
        </button>
      </div>

      {chapters.length === 0 ? (
        <p className="mt-4 border-t border-line pt-6 font-serif text-base italic text-ink-soft">
          No chapters yet.
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {chapters.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 py-3">
              <span className="w-10 shrink-0 font-sans text-sm text-ink-soft">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate font-serif text-base text-ink">
                {c.title}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(i, -1)}
                  disabled={pending || i === 0}
                  className="rounded-[2px] border border-line px-2 py-1 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(i, 1)}
                  disabled={pending || i === chapters.length - 1}
                  className="rounded-[2px] border border-line px-2 py-1 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <Link
                href={`/studio/books/${bookId}/sections/${c.id}`}
                className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => del(c.id, c.title)}
                disabled={pending}
                className="font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60"
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      )}

      {/* Back matter */}
      <h3 className="mt-10 font-sans text-sm font-semibold tracking-wide text-ink">
        Back matter
      </h3>
      <p className="mt-1 font-sans text-xs text-ink-soft">
        The Epilogue follows the final chapter and is never numbered.
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 border border-line bg-paper-raised px-4 py-3">
          <span className="font-serif text-base text-ink">Epilogue</span>
          {epilogue ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/studio/books/${bookId}/sections/${epilogue.id}`}
                className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => del(epilogue.id, "Epilogue")}
                disabled={pending}
                className="font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ) : (
            <span className="font-sans text-xs text-ink-soft">Not present</span>
          )}
        </div>
      </div>
    </div>
  );
}
