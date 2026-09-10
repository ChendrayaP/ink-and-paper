"use client";

import { useRef, useState } from "react";

type FieldErrors = Partial<Record<"name" | "note" | "photo" | "form", string>>;

const MAX = { name: 100, note: 5000, place: 120, photoBytes: 5 * 1024 * 1024 };
const ACCEPT = "image/jpeg,image/png,image/webp";

/*
  Reader note experience. The prompt + button open a compact, accessible form.
  Submission posts a plain multipart form to the server route, which does all
  validation, the (optional) photo upload, and the insert. The browser never
  touches Storage or privileged credentials.
*/
export function LeaveANote({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  function openForm() {
    setOpen(true);
    // move focus into the form for keyboard users
    requestAnimationFrame(() => nameRef.current?.focus());
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);

    // Light client-side checks for instant feedback (server re-validates).
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    if (!name) next.name = "Please add your name.";
    if (!note) next.note = "Please write a short note.";
    const photo = data.get("photo");
    if (photo && typeof photo === "object" && "size" in photo) {
      const f = photo as File;
      if (f.size > 0 && f.size > MAX.photoBytes)
        next.photo = "Photos must be 5 MB or smaller.";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${slug}/notes`, {
        method: "POST",
        body: data,
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        field?: string;
      };
      if (res.ok && json.ok) {
        setDone(true);
        return;
      }
      const field = json.field as keyof FieldErrors | undefined;
      setErrors(
        field
          ? { [field]: json.message ?? "Please check this field." }
          : { form: json.message ?? "Something went wrong. Please try again." },
      );
    } catch {
      setErrors({ form: "We couldn’t reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-8 border-t border-line pt-8"
      >
        <p className="max-w-prose font-serif text-xl leading-relaxed text-ink">
          Thank you for leaving a note.
        </p>
        <p className="mt-4 max-w-prose font-serif text-lg italic leading-relaxed text-ink-soft">
          Your words mean more than you know. I’ll read it personally before it
          appears on the site.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Leave a Note for the Author
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl">
      {errors.form ? (
        <p
          role="alert"
          className="mb-6 border-l-2 border-accent pl-4 font-sans text-sm text-ink"
        >
          {errors.form}
        </p>
      ) : null}

      {/* Honeypot — visually hidden, off-screen; bots fill it, people don't. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        <label htmlFor="ln-website">Leave this field empty</label>
        <input id="ln-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="ln-name" className="block font-sans text-sm text-ink">
            Your name
          </label>
          <input
            ref={nameRef}
            id="ln-name"
            name="name"
            type="text"
            required
            maxLength={MAX.name}
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "ln-name-err" : undefined}
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          {errors.name ? (
            <p id="ln-name-err" className="mt-1.5 font-sans text-sm text-accent">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ln-note" className="block font-sans text-sm text-ink">
            Your note
          </label>
          <textarea
            id="ln-note"
            name="note"
            required
            rows={5}
            maxLength={MAX.note}
            aria-required="true"
            aria-invalid={errors.note ? "true" : undefined}
            aria-describedby={errors.note ? "ln-note-err" : undefined}
            className="mt-2 block w-full resize-y rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-serif text-base leading-relaxed text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          {errors.note ? (
            <p id="ln-note-err" className="mt-1.5 font-sans text-sm text-accent">
              {errors.note}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ln-photo" className="block font-sans text-sm text-ink">
            Photo <span className="text-ink-soft">(optional)</span>
          </label>
          <input
            id="ln-photo"
            name="photo"
            type="file"
            accept={ACCEPT}
            aria-invalid={errors.photo ? "true" : undefined}
            aria-describedby={errors.photo ? "ln-photo-err" : "ln-photo-hint"}
            className="mt-2 block w-full font-sans text-sm text-ink-soft file:mr-3 file:rounded-[2px] file:border file:border-line file:bg-paper file:px-3 file:py-2 file:font-sans file:text-sm file:text-ink"
          />
          {errors.photo ? (
            <p id="ln-photo-err" className="mt-1.5 font-sans text-sm text-accent">
              {errors.photo}
            </p>
          ) : (
            <p id="ln-photo-hint" className="mt-1.5 font-sans text-xs text-ink-soft">
              JPEG, PNG, or WebP, up to 5 MB.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="ln-place" className="block font-sans text-sm text-ink">
            Where you’re reading from <span className="text-ink-soft">(optional)</span>
          </label>
          <input
            id="ln-place"
            name="place"
            type="text"
            maxLength={MAX.place}
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send your note"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
