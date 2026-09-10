"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookCover } from "@/components/books/BookCover";
import { uploadCover } from "@/lib/studio/actions";

const MAX = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

export function CoverManager({
  bookId,
  initialCoverUrl,
}: {
  bookId: string;
  initialCoverUrl: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [currentUrl, setCurrentUrl] = useState(initialCoverUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setMsg(null);
    const f = e.target.files?.[0];
    if (!f) {
      setPreview(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      setPreview(null);
      return;
    }
    if (f.size > MAX) {
      setError("Photos must be 5 MB or smaller.");
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(f));
  }

  function upload() {
    const f = fileRef.current?.files?.[0];
    if (!f) {
      setError("Please choose an image first.");
      return;
    }
    setError(null);
    setMsg(null);
    const data = new FormData();
    data.set("bookId", bookId);
    data.set("file", f);
    start(async () => {
      const res = await uploadCover(data);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.data?.coverUrl) setCurrentUrl(String(res.data.coverUrl));
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setMsg(res.message ?? "Cover updated.");
      router.refresh();
    });
  }

  return (
    <div className="max-w-xl">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex h-64 w-44 shrink-0 items-start justify-start border border-line bg-paper p-2">
          {preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={preview} alt="New cover preview" className="max-h-full w-auto max-w-full object-contain" />
          ) : currentUrl ? (
            <BookCover src={currentUrl} alt="Current cover" className="h-full" />
          ) : (
            <span className="m-auto px-3 text-center font-serif text-sm italic text-ink-soft">
              No cover yet
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="cover-file" className="block font-sans text-sm text-ink">
            {currentUrl ? "Replace cover" : "Upload cover"}
          </label>
          <input
            ref={fileRef}
            id="cover-file"
            type="file"
            accept={ACCEPT}
            onChange={onSelect}
            className="mt-2 block w-full font-sans text-sm text-ink-soft file:mr-3 file:rounded-[2px] file:border file:border-line file:bg-paper-raised file:px-3 file:py-2 file:font-sans file:text-sm file:text-ink"
          />
          <p className="mt-1.5 font-sans text-xs text-ink-soft">
            JPEG, PNG, or WebP, up to 5 MB. The whole cover is always shown —
            never cropped.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={upload}
              disabled={pending || !preview}
              className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Uploading…" : "Upload cover"}
            </button>
            {msg ? <span role="status" className="font-sans text-sm text-ink-soft">{msg}</span> : null}
            {error ? <span role="alert" className="font-sans text-sm text-accent">{error}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
