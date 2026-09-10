import { NextResponse } from "next/server";
import {
  validateNoteText,
  validatePhoto,
  isHoneypotTripped,
} from "@/lib/notes/validation";
import { checkRateLimit } from "@/lib/notes/rate-limit";
import { uploadReaderPhoto, deleteReaderPhoto } from "@/lib/notes/upload";
import { getReaderBook } from "@/lib/data/reader";
import { createPublicClient } from "@/lib/supabase/public";
import { devFixturesEnabled } from "@/lib/data/fixtures";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 6 * 1024 * 1024; // headroom over the 5 MB photo cap

const CONFIRMATION =
  "Thank you for leaving a note. Your words mean more than you know. I’ll read it personally before it appears on the site.";

function bad(message: string, status = 400, field?: string) {
  return NextResponse.json({ ok: false, message, field }, { status });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Rate limit (best-effort, per IP).
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, message: "You’ve sent a few notes already. Please try again a little later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } },
    );
  }

  // Request size guard (before reading the body fully where possible).
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return bad("That submission is too large. Photos must be 5 MB or smaller.", 413);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("We couldn’t read that submission. Please try again.");
  }

  // Honeypot — genuine readers never fill this.
  if (isHoneypotTripped(form.get("website") as string | null)) {
    return bad("We couldn’t accept this submission.");
  }

  // Text validation.
  const textResult = validateNoteText({
    name: String(form.get("name") ?? ""),
    note: String(form.get("note") ?? ""),
    place: String(form.get("place") ?? ""),
  });
  if (!textResult.ok) {
    return bad(textResult.message, 400, textResult.field);
  }
  const { name, message, place } = textResult.data;

  // Book must be a real, PUBLISHED book — derived from the route, not trusted
  // from any client field. Drafts/unknown slugs are invisible here.
  const book = await getReaderBook(slug);
  if (!book) {
    return bad("We couldn’t find that book. Please try again from the book’s page.", 404);
  }

  // Optional photo: validate on the server (size, declared type, magic bytes).
  let uploadedPath: string | null = null;
  let photoUrl: string | null = null;
  const photo = form.get("photo");
  const hasPhoto =
    photo && typeof photo === "object" && "arrayBuffer" in photo && (photo as File).size > 0;

  if (hasPhoto) {
    const file = photo as File;
    const buffer = new Uint8Array(await file.arrayBuffer());
    const photoResult = validatePhoto({
      size: file.size,
      type: file.type,
      header: buffer.subarray(0, 12),
    });
    if (!photoResult.ok) {
      return bad(photoResult.message, 400, "photo");
    }

    // Dev-fixtures mode never writes to Storage or the DB.
    if (!devFixturesEnabled()) {
      try {
        const up = await uploadReaderPhoto(buffer, photoResult.contentType, photoResult.ext);
        uploadedPath = up.path;
        photoUrl = up.publicUrl;
      } catch (err) {
        console.error("reader photo upload failed:", err);
        return bad("We couldn’t save your photo. Please try again, or send your note without one.", 500);
      }
    }
  }

  // Development preview: everything above ran for real; skip persistence.
  if (devFixturesEnabled()) {
    return NextResponse.json({ ok: true, message: CONFIRMATION });
  }

  // Insert through the ANON client so RLS is the backstop. The server sets the
  // protected values; RLS independently enforces them and that the book is
  // published. The client cannot influence source/published/featured/book_id.
  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from("testimonials").insert({
      name,
      message,
      designation_or_location: place,
      photo_url: photoUrl,
      book_id: book.id,
      source: "reader_submission",
      published: false,
      featured: false,
    });
    if (error) throw error;
  } catch (err) {
    console.error("reader note insert failed:", err);
    if (uploadedPath) await deleteReaderPhoto(uploadedPath);
    return bad("Something went wrong saving your note. Please try again.", 500);
  }

  return NextResponse.json({ ok: true, message: CONFIRMATION });
}
