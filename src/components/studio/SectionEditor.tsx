"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSection } from "@/lib/studio/actions";
import { Field, TextInput, TextArea } from "@/components/studio/Field";
import type { ChapterKind } from "@/lib/types";

export function SectionEditor({
  bookId,
  section,
}: {
  bookId: string;
  section: {
    id: string;
    kind: ChapterKind;
    title: string;
    content: string;
    updatedAt: string;
  };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [baseUpdatedAt, setBaseUpdatedAt] = useState(section.updatedAt);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = title !== section.title || content !== section.content;

  // Warn before leaving (refresh/close/external nav) with unsaved changes.
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  function save() {
    setMsg(null);
    start(async () => {
      const res = await updateSection(section.id, { title, content }, baseUpdatedAt);
      if (res.ok) {
        // reset the baseline so the dirty check clears
        section.title = title;
        section.content = content;
        setBaseUpdatedAt(new Date().toISOString());
        setMsg({ ok: true, text: res.message ?? "Saved." });
        router.refresh();
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  const isChapter = section.kind === "chapter";

  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        <Field
          label={isChapter ? "Chapter title" : "Title"}
          htmlFor="s-title"
          required
        >
          <TextInput id="s-title" value={title} onChange={setTitle} required />
        </Field>
        <Field
          label={isChapter ? "Chapter text" : "Text"}
          htmlFor="s-content"
          hint="Your text is stored exactly as written. Paragraphs and line breaks are preserved."
        >
          <TextArea id="s-content" value={content} onChange={setContent} rows={20} serif />
        </Field>
      </div>
      <div className="sticky bottom-0 mt-6 flex items-center gap-4 bg-paper py-4">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : dirty ? "Save" : "Saved"}
        </button>
        {msg ? (
          <span
            role="status"
            className={`font-sans text-sm ${msg.ok ? "text-ink-soft" : "text-accent"}`}
          >
            {msg.text}
          </span>
        ) : null}
        {dirty && !msg ? (
          <span className="font-sans text-sm text-ink-soft">Unsaved changes</span>
        ) : null}
      </div>
    </div>
  );
}
