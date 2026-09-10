"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StudioTestimonialRow } from "@/lib/studio/queries";
import {
  setTestimonialFlag,
  deleteTestimonial,
  updateTestimonial,
  uploadTestimonialPhoto,
  removeTestimonialPhoto,
} from "@/lib/studio/actions";
import { SourceBadge } from "@/components/studio/ui";
import { Field, TextInput, TextArea } from "@/components/studio/Field";

function Row({
  t,
  books,
}: {
  t: StudioTestimonialRow;
  books: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // edit fields
  const [name, setName] = useState(t.name);
  const [message, setMessage] = useState(t.message);
  const [place, setPlace] = useState(t.designation_or_location ?? "");
  const [bookId, setBookId] = useState(t.book_id ?? "");
  const [published, setPublished] = useState(t.published);
  const [featured, setFeatured] = useState(t.featured);

  function flag(which: "published" | "featured", value: boolean) {
    setError(null);
    start(async () => {
      const res = await setTestimonialFlag(t.id, which, value);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function save() {
    setError(null);
    start(async () => {
      const res = await updateTestimonial(t.id, {
        name,
        message,
        place,
        bookId: bookId || null,
        published,
        featured,
      });
      if (!res.ok) setError(res.error);
      else {
        setEditing(false);
        router.refresh();
      }
    });
  }

  function del() {
    if (!window.confirm(`Delete this note from ${t.name}? This cannot be undone.`)) return;
    setError(null);
    start(async () => {
      const res = await deleteTestimonial(t.id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    const data = new FormData();
    data.set("id", t.id);
    data.set("file", f);
    start(async () => {
      const res = await uploadTestimonialPhoto(data);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function clearPhoto() {
    start(async () => {
      const res = await removeTestimonialPhoto(t.id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <li className="py-6">
      <div className="flex flex-wrap items-center gap-3">
        <SourceBadge source={t.source} />
        {!t.published ? (
          <span className="font-sans text-xs font-medium tracking-wide text-accent">
            PENDING
          </span>
        ) : null}
        {t.featured ? (
          <span className="font-sans text-xs font-medium tracking-wide text-ink-soft">
            FEATURED
          </span>
        ) : null}
      </div>

      {!editing ? (
        <>
          <blockquote className="mt-3 max-w-prose font-serif text-lg leading-relaxed text-ink">
            {t.message}
          </blockquote>
          <p className="mt-2 font-sans text-sm text-ink-soft">
            {[t.name, t.book_title ? `A reader of ${t.book_title}` : null, t.designation_or_location]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
          {t.photo_url ? (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.photo_url} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              <button type="button" onClick={clearPhoto} disabled={pending} className="font-sans text-sm text-ink-soft hover:text-accent">
                Remove photo
              </button>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => flag("published", !t.published)} disabled={pending}
              className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-60">
              {t.published ? "Unpublish" : "Publish"}
            </button>
            <button type="button" onClick={() => flag("featured", !t.featured)} disabled={pending}
              className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-60">
              {t.featured ? "Unfeature" : "Feature"}
            </button>
            <button type="button" onClick={() => setEditing(true)} disabled={pending}
              className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink disabled:opacity-60">
              Edit
            </button>
            <label className="cursor-pointer rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink">
              {t.photo_url ? "Replace photo" : "Add photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} className="sr-only" />
            </label>
            <button type="button" onClick={del} disabled={pending}
              className="font-sans text-sm text-ink-soft transition-colors hover:text-accent disabled:opacity-60">
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 max-w-xl space-y-5 border-l-2 border-line pl-5">
          <Field label="Name" htmlFor={`n-${t.id}`} required>
            <TextInput id={`n-${t.id}`} value={name} onChange={setName} required />
          </Field>
          <Field label="Message" htmlFor={`m-${t.id}`} required>
            <TextArea id={`m-${t.id}`} value={message} onChange={setMessage} rows={4} serif />
          </Field>
          <Field label="Place / location" htmlFor={`p-${t.id}`}>
            <TextInput id={`p-${t.id}`} value={place} onChange={setPlace} />
          </Field>
          <div>
            <label htmlFor={`b-${t.id}`} className="block font-sans text-sm text-ink">
              Book association <span className="text-ink-soft">(optional)</span>
            </label>
            <select
              id={`b-${t.id}`}
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink"
            >
              <option value="">No book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={save} disabled={pending}
              className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60">
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="font-sans text-sm text-ink-soft hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}
      {error ? <p role="alert" className="mt-3 font-sans text-sm text-accent">{error}</p> : null}
    </li>
  );
}

export function TestimonialManager({
  testimonials,
  books,
}: {
  testimonials: StudioTestimonialRow[];
  books: { id: string; title: string }[];
}) {
  const pending = testimonials.filter((t) => t.source === "reader_submission" && !t.published);
  const rest = testimonials.filter((t) => !(t.source === "reader_submission" && !t.published));

  return (
    <div>
      {pending.length > 0 ? (
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-ink">
            Awaiting review ({pending.length})
          </h2>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {pending.map((t) => (
              <Row key={t.id} t={t} books={books} />
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-serif text-2xl text-ink">All testimonials</h2>
        {rest.length === 0 && pending.length === 0 ? (
          <p className="mt-4 border-t border-line pt-6 font-serif text-base italic text-ink-soft">
            No testimonials yet.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {rest.map((t) => (
              <Row key={t.id} t={t} books={books} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
