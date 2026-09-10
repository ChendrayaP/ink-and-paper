"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/lib/studio/actions";
import { Field, TextInput, TextArea } from "@/components/studio/Field";

export function SettingsForm({
  initial,
}: {
  initial: {
    siteName: string;
    authorName: string;
    siteDescription: string;
    instagramUrl: string;
    contactEmail: string;
  };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [siteName, setSiteName] = useState(initial.siteName);
  const [authorName, setAuthorName] = useState(initial.authorName);
  const [siteDescription, setSiteDescription] = useState(initial.siteDescription);
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl);
  const [contactEmail, setContactEmail] = useState(initial.contactEmail);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await updateSiteSettings({
        siteName,
        authorName,
        siteDescription,
        instagramUrl,
        contactEmail,
      });
      setMsg({ ok: res.ok, text: res.ok ? (res.message ?? "Saved.") : res.error });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <div className="space-y-6">
        <Field label="Site name" htmlFor="site-name" required>
          <TextInput id="site-name" value={siteName} onChange={setSiteName} required />
        </Field>
        <Field label="Author name" htmlFor="author-name" required>
          <TextInput id="author-name" value={authorName} onChange={setAuthorName} required />
        </Field>
        <Field label="Site description" htmlFor="site-desc" required>
          <TextArea id="site-desc" value={siteDescription} onChange={setSiteDescription} rows={3} />
        </Field>
        <Field label="Instagram URL" htmlFor="instagram" hint="Must start with https://">
          <TextInput id="instagram" value={instagramUrl} onChange={setInstagramUrl} type="url" />
        </Field>
        <Field label="Contact email" htmlFor="contact">
          <TextInput id="contact" value={contactEmail} onChange={setContactEmail} type="email" />
        </Field>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
        {msg ? (
          <span role="status" className={`font-sans text-sm ${msg.ok ? "text-ink-soft" : "text-accent"}`}>
            {msg.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}
