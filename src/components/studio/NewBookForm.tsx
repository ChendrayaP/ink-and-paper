"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/lib/studio/actions";
import { Field, TextInput, TextArea } from "@/components/studio/Field";

export function NewBookForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    start(async () => {
      const res = await createBook({ title, subtitle, genre, description });
      if (!res.ok) setError(res.error);
      else if (res.data?.id) router.push(`/studio/books/${res.data.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      {error ? (
        <p role="alert" className="mb-6 border-l-2 border-accent pl-4 font-sans text-sm text-ink">
          {error}
        </p>
      ) : null}
      <div className="space-y-6">
        <Field label="Title" required htmlFor="title">
          <TextInput id="title" value={title} onChange={setTitle} required />
        </Field>
        <Field label="Subtitle" htmlFor="subtitle">
          <TextInput id="subtitle" value={subtitle} onChange={setSubtitle} />
        </Field>
        <Field label="Genre" htmlFor="genre">
          <TextInput id="genre" value={genre} onChange={setGenre} />
        </Field>
        <Field label="Description" htmlFor="description">
          <TextArea id="description" value={description} onChange={setDescription} rows={4} />
        </Field>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create draft"}
      </button>
    </form>
  );
}
