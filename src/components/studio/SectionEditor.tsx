"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSection } from "@/lib/studio/actions";
import { Field, TextInput, TextArea } from "@/components/studio/Field";
import { ManuscriptContent } from "@/components/reader/ManuscriptContent";
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
  const [showPreview, setShowPreview] = useState(true);

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

      {/* Live preview — renders through the real reader component so paragraph
          spacing, blank lines, and deliberate line breaks are visible while
          editing. The text is still stored exactly as typed. */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-sans text-sm text-ink">Live Reader Preview</p>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            aria-expanded={showPreview}
            aria-controls="s-content-preview"
            className="font-sans text-xs text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {showPreview ? "Hide" : "Show"}
          </button>
        </div>
        {showPreview ? (
          <>
            <p className="mt-1.5 font-sans text-xs text-ink-soft">
              How this will appear to readers — paragraph spacing and line breaks
              update as you type.
            </p>
            <div
              id="s-content-preview"
              className="mt-3 rounded-[2px] border border-line bg-paper px-5 py-6 sm:px-7 sm:py-8"
            >
              {content.trim() ? (
                <ManuscriptContent content={content} />
              ) : (
                <p className="font-sans text-sm text-ink-soft">
                  Paste or type the text above to see the reader preview here.
                </p>
              )}
            </div>
          </>
        ) : null}
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
