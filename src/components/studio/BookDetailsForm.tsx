"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBookDetails } from "@/lib/studio/actions";
import { Field, TextInput, TextArea } from "@/components/studio/Field";

export function BookDetailsForm({
  id,
  initial,
}: {
  id: string;
  initial: {
    title: string;
    subtitle: string;
    genre: string;
    description: string;
    updatedAt: string;
  };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [genre, setGenre] = useState(initial.genre);
  const [description, setDescription] = useState(initial.description);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await updateBookDetails(
        id,
        { title, subtitle, genre, description },
        initial.updatedAt,
      );
      setMsg({ ok: res.ok, text: res.ok ? (res.message ?? "Saved.") : res.error });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <div className="space-y-6">
        <Field label="Title" htmlFor="d-title" required>
          <TextInput id="d-title" value={title} onChange={setTitle} required />
        </Field>
        <Field label="Subtitle" htmlFor="d-subtitle">
          <TextInput id="d-subtitle" value={subtitle} onChange={setSubtitle} />
        </Field>
        <Field label="Genre" htmlFor="d-genre">
          <TextInput id="d-genre" value={genre} onChange={setGenre} />
        </Field>
        <Field label="Description" htmlFor="d-description">
          <TextArea id="d-description" value={description} onChange={setDescription} rows={4} />
        </Field>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
        {msg ? (
          <span
            role="status"
            className={`font-sans text-sm ${msg.ok ? "text-ink-soft" : "text-accent"}`}
          >
            {msg.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}
