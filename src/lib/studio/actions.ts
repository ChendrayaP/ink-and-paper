"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/studio/guard";
import { validatePhoto } from "@/lib/notes/validation";
import { slugify } from "@/lib/utils";
import { devFixturesEnabled } from "@/lib/data/fixtures";
import type { ChapterKind } from "@/lib/types";

export type ActionResult =
  | { ok: true; message?: string; data?: Record<string, unknown> }
  | { ok: false; error: string; fields?: Record<string, string> };

const PREVIEW_MSG = "Preview mode — changes are not saved.";
const PREVIEW: ActionResult = { ok: true, message: PREVIEW_MSG };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath("/testimonials");
  revalidatePath("/books/[slug]", "page");
  revalidatePath("/books/[slug]/[section]", "page");
}

/** Extract the storage object path (within a bucket) from a public URL. */
function storagePathFromUrl(url: string | null, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

async function readImage(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return {
    bytes,
    check: validatePhoto({
      size: file.size,
      type: file.type,
      header: bytes.subarray(0, 12),
    }),
  };
}

// ─────────────────────────── Books ───────────────────────────

export async function createBook(input: {
  title: string;
  subtitle?: string;
  genre?: string;
  description?: string;
}): Promise<ActionResult> {
  if (devFixturesEnabled()) return { ok: true, message: PREVIEW_MSG, data: { id: "preview" } };
  const title = input.title?.trim() ?? "";
  if (!title) return { ok: false, error: "A title is required.", fields: { title: "Required" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  const base = slugify(title) || "book";
  let slug = base;
  for (let n = 2; n < 50; n++) {
    const { data: existing } = await supabase
      .from("books")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${n}`;
  }

  const { data, error } = await supabase
    .from("books")
    .insert({
      title,
      slug,
      subtitle: input.subtitle?.trim() || null,
      genre: input.genre?.trim() || null,
      description: input.description?.trim() || null,
      status: "draft",
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: "Couldn’t create the book. Please try again." };
  revalidatePublic();
  return { ok: true, data: { id: data.id } };
}

export async function updateBookDetails(
  id: string,
  input: { title: string; subtitle?: string; genre?: string; description?: string },
  expectedUpdatedAt?: string,
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const title = input.title?.trim() ?? "";
  if (!title) return { ok: false, error: "A title is required.", fields: { title: "Required" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  let q = supabase
    .from("books")
    .update({
      title,
      subtitle: input.subtitle?.trim() || null,
      genre: input.genre?.trim() || null,
      description: input.description?.trim() || null,
    })
    .eq("id", id);
  if (expectedUpdatedAt) q = q.eq("updated_at", expectedUpdatedAt);
  const { data, error } = await q.select("id");
  if (error) return { ok: false, error: "Couldn’t save changes. Please try again." };
  if (expectedUpdatedAt && (!data || data.length === 0))
    return { ok: false, error: "This book was changed elsewhere. Please reload before saving." };
  revalidatePublic();
  return { ok: true, message: "Saved." };
}

export async function setBookStatus(
  id: string,
  status: "published" | "draft",
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  if (status === "published") {
    const { data: book } = await supabase
      .from("books")
      .select("title, cover_url")
      .eq("id", id)
      .maybeSingle();
    if (!book) return { ok: false, error: "Book not found." };
    const { count } = await supabase
      .from("chapters")
      .select("id", { count: "exact", head: true })
      .eq("book_id", id)
      .eq("kind", "chapter");
    const missing: string[] = [];
    if (!book.title?.trim()) missing.push("a title");
    if (!book.cover_url) missing.push("a cover");
    if (!count || count < 1) missing.push("at least one chapter");
    if (missing.length > 0)
      return { ok: false, error: `This book needs ${missing.join(", ")} before it can be published.` };
  }

  const { error } = await supabase.from("books").update({ status }).eq("id", id);
  if (error) return { ok: false, error: "Couldn’t update the book. Please try again." };
  revalidatePublic();
  return { ok: true, message: status === "published" ? "Published." : "Unpublished." };
}

export async function deleteBook(id: string): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  // Remove cover files for this book (best-effort), then delete the row
  // (chapters cascade via the FK).
  const { data: files } = await supabase.storage.from("book-covers").list(id);
  if (files && files.length > 0) {
    await supabase.storage
      .from("book-covers")
      .remove(files.map((f) => `${id}/${f.name}`));
  }
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn’t delete the book. Please try again." };
  revalidatePublic();
  return { ok: true, message: "Book deleted." };
}

export async function uploadCover(formData: FormData): Promise<ActionResult> {
  const bookId = String(formData.get("bookId") ?? "");
  const file = formData.get("file");
  if (!bookId || !(file instanceof File) || file.size === 0)
    return { ok: false, error: "Please choose an image." };

  const { check, bytes } = await readImage(file);
  if (!check.ok) return { ok: false, error: check.message };

  if (devFixturesEnabled()) return { ok: true, message: PREVIEW_MSG, data: { coverUrl: "/dev-covers/tall.svg" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  const { data: current } = await supabase
    .from("books")
    .select("cover_url")
    .eq("id", bookId)
    .maybeSingle();

  const path = `${bookId}/${randomUUID()}.${check.ext}`;
  const { error: upErr } = await supabase.storage
    .from("book-covers")
    .upload(path, bytes, { contentType: check.contentType, upsert: false });
  if (upErr) return { ok: false, error: "Couldn’t upload the cover. Please try again." };

  const { data: pub } = supabase.storage.from("book-covers").getPublicUrl(path);
  const { error: updErr } = await supabase
    .from("books")
    .update({ cover_url: pub.publicUrl })
    .eq("id", bookId);
  if (updErr) {
    await supabase.storage.from("book-covers").remove([path]); // roll back new file
    return { ok: false, error: "Couldn’t save the cover. Please try again." };
  }

  // Only now remove the previous file.
  const oldPath = storagePathFromUrl(current?.cover_url ?? null, "book-covers");
  if (oldPath && oldPath !== path)
    await supabase.storage.from("book-covers").remove([oldPath]);

  revalidatePublic();
  return { ok: true, message: "Cover updated.", data: { coverUrl: pub.publicUrl } };
}

// ─────────────────────── Sections (front matter + chapters) ───────────────────────

export async function addSection(
  bookId: string,
  kind: Extract<ChapterKind, "chapter" | "introduction">,
): Promise<ActionResult> {
  if (devFixturesEnabled()) return { ok: true, message: PREVIEW_MSG, data: { id: "preview" } };
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  if (kind === "introduction") {
    const { data: existing } = await supabase
      .from("chapters")
      .select("id")
      .eq("book_id", bookId)
      .eq("kind", "introduction")
      .maybeSingle();
    if (existing)
      return { ok: false, error: "This book already has an Introduction." };
  }

  let displayOrder = 0;
  let title = "Introduction";
  if (kind === "chapter") {
    const { data: rows } = await supabase
      .from("chapters")
      .select("display_order")
      .eq("book_id", bookId)
      .eq("kind", "chapter")
      .order("display_order", { ascending: false })
      .limit(1);
    displayOrder = (rows?.[0]?.display_order ?? 0) + 1;
    title = "Untitled chapter";
  }

  const { data, error } = await supabase
    .from("chapters")
    .insert({ book_id: bookId, kind, title, content: "", display_order: displayOrder })
    .select("id")
    .single();
  if (error) return { ok: false, error: "Couldn’t add the section. Please try again." };
  revalidatePublic();
  return { ok: true, data: { id: data.id } };
}

export async function updateSection(
  id: string,
  input: { title: string; content: string },
  expectedUpdatedAt?: string,
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const title = input.title?.trim() ?? "";
  if (!title) return { ok: false, error: "A title is required.", fields: { title: "Required" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  let q = supabase.from("chapters").update({ title, content: input.content }).eq("id", id);
  if (expectedUpdatedAt) q = q.eq("updated_at", expectedUpdatedAt);
  const { data, error } = await q.select("id");
  if (error) return { ok: false, error: "Couldn’t save. Please try again." };
  if (expectedUpdatedAt && (!data || data.length === 0))
    return { ok: false, error: "This section was changed elsewhere. Please reload before saving." };
  revalidatePublic();
  return { ok: true, message: "Saved." };
}

export async function deleteSection(id: string): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase.from("chapters").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn’t delete. Please try again." };
  revalidatePublic();
  return { ok: true, message: "Deleted." };
}

/** Assign display_order = position for the given chapter ids (chapters only). */
export async function saveChapterOrder(
  bookId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("chapters")
      .update({ display_order: i + 1 })
      .eq("id", orderedIds[i])
      .eq("book_id", bookId)
      .eq("kind", "chapter");
    if (error) return { ok: false, error: "Couldn’t save the new order. Please try again." };
  }
  revalidatePublic();
  return { ok: true, message: "Order saved." };
}

// ─────────────────────────── Testimonials ───────────────────────────

export async function updateTestimonial(
  id: string,
  input: {
    name: string;
    message: string;
    place?: string;
    bookId?: string | null;
    published: boolean;
    featured: boolean;
  },
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const name = input.name?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  if (!name) return { ok: false, error: "A name is required.", fields: { name: "Required" } };
  if (!message) return { ok: false, error: "A message is required.", fields: { message: "Required" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase
    .from("testimonials")
    .update({
      name,
      message,
      designation_or_location: input.place?.trim() || null,
      book_id: input.bookId || null,
      published: input.published,
      featured: input.featured,
    })
    .eq("id", id);
  if (error) return { ok: false, error: "Couldn’t save. Please try again." };
  revalidatePublic();
  return { ok: true, message: "Saved." };
}

export async function setTestimonialFlag(
  id: string,
  flag: "published" | "featured",
  value: boolean,
): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const patch = flag === "published" ? { published: value } : { featured: value };
  const { error } = await auth.ctx.supabase
    .from("testimonials")
    .update(patch)
    .eq("id", id);
  if (error) return { ok: false, error: "Couldn’t update. Please try again." };
  revalidatePublic();
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;
  const { data: t } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const oldPath = storagePathFromUrl(t?.photo_url ?? null, "testimonial-photos");
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: "Couldn’t delete. Please try again." };
  if (oldPath) await supabase.storage.from("testimonial-photos").remove([oldPath]);
  revalidatePublic();
  return { ok: true, message: "Deleted." };
}

export async function uploadTestimonialPhoto(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");
  if (!id || !(file instanceof File) || file.size === 0)
    return { ok: false, error: "Please choose an image." };
  const { check, bytes } = await readImage(file);
  if (!check.ok) return { ok: false, error: check.message };
  if (devFixturesEnabled()) return PREVIEW;

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;

  const { data: current } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const path = `${randomUUID()}.${check.ext}`;
  const { error: upErr } = await supabase.storage
    .from("testimonial-photos")
    .upload(path, bytes, { contentType: check.contentType, upsert: false });
  if (upErr) return { ok: false, error: "Couldn’t upload the photo. Please try again." };
  const { data: pub } = supabase.storage.from("testimonial-photos").getPublicUrl(path);
  const { error: updErr } = await supabase
    .from("testimonials")
    .update({ photo_url: pub.publicUrl })
    .eq("id", id);
  if (updErr) {
    await supabase.storage.from("testimonial-photos").remove([path]);
    return { ok: false, error: "Couldn’t save the photo. Please try again." };
  }
  const oldPath = storagePathFromUrl(current?.photo_url ?? null, "testimonial-photos");
  if (oldPath && oldPath !== path)
    await supabase.storage.from("testimonial-photos").remove([oldPath]);
  revalidatePublic();
  return { ok: true, message: "Photo updated.", data: { photoUrl: pub.publicUrl } };
}

export async function removeTestimonialPhoto(id: string): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth.ctx;
  const { data: t } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const oldPath = storagePathFromUrl(t?.photo_url ?? null, "testimonial-photos");
  const { error } = await supabase
    .from("testimonials")
    .update({ photo_url: null })
    .eq("id", id);
  if (error) return { ok: false, error: "Couldn’t update. Please try again." };
  if (oldPath) await supabase.storage.from("testimonial-photos").remove([oldPath]);
  revalidatePublic();
  return { ok: true, message: "Photo removed." };
}

// ─────────────────────────── Site settings ───────────────────────────

export async function updateSiteSettings(input: {
  siteName: string;
  authorName: string;
  siteDescription: string;
  instagramUrl?: string;
  contactEmail?: string;
}): Promise<ActionResult> {
  if (devFixturesEnabled()) return PREVIEW;
  const siteName = input.siteName?.trim() ?? "";
  const authorName = input.authorName?.trim() ?? "";
  const siteDescription = input.siteDescription?.trim() ?? "";
  if (!siteName || !authorName || !siteDescription)
    return { ok: false, error: "Site name, author name, and description are all required." };
  const instagram = input.instagramUrl?.trim() || null;
  if (instagram && !/^https:\/\//i.test(instagram))
    return { ok: false, error: "The Instagram URL must start with https://.", fields: { instagramUrl: "Must be https://" } };

  const auth = await requireAuthor();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { error } = await auth.ctx.supabase
    .from("site_settings")
    .update({
      site_name: siteName,
      author_name: authorName,
      site_description: siteDescription,
      instagram_url: instagram,
      contact_email: input.contactEmail?.trim() || null,
    })
    .eq("id", 1);
  if (error) return { ok: false, error: "Couldn’t save settings. Please try again." };
  revalidatePublic();
  return { ok: true, message: "Settings saved." };
}
