/*
  Pure, dependency-free validation for reader notes. No I/O here, so it is
  trivially unit-testable and identical whether called from the route handler
  or a test. The route enforces the protected values (source/published/featured
  and the book) itself; this module only validates reader-supplied fields.
*/

export const NOTE_LIMITS = {
  name: 100,
  note: 5000,
  place: 120,
  photoBytes: 5 * 1024 * 1024, // 5 MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ValidatedText = {
  name: string;
  message: string;
  place: string | null;
};

export type TextResult =
  | { ok: true; data: ValidatedText }
  | { ok: false; field: "name" | "note" | "place"; message: string };

/** Trim only the ends; internal line breaks (e.g. in poetry) are preserved. */
function trimEnds(input: string): string {
  return input.replace(/\r\n/g, "\n").replace(/^\s+|\s+$/g, "");
}

export function validateNoteText(input: {
  name: string;
  note: string;
  place?: string;
}): TextResult {
  const name = trimEnds(input.name ?? "");
  if (name.length === 0) {
    return { ok: false, field: "name", message: "Please add your name." };
  }
  if (name.length > NOTE_LIMITS.name) {
    return {
      ok: false,
      field: "name",
      message: `Please keep your name under ${NOTE_LIMITS.name} characters.`,
    };
  }

  const message = trimEnds(input.note ?? "");
  if (message.length === 0) {
    return { ok: false, field: "note", message: "Please write a short note." };
  }
  if (message.length > NOTE_LIMITS.note) {
    return {
      ok: false,
      field: "note",
      message: `Please keep your note under ${NOTE_LIMITS.note} characters.`,
    };
  }

  const placeRaw = trimEnds(input.place ?? "");
  if (placeRaw.length > NOTE_LIMITS.place) {
    return {
      ok: false,
      field: "place",
      message: `Please keep the place under ${NOTE_LIMITS.place} characters.`,
    };
  }
  const place = placeRaw.length > 0 ? placeRaw : null;

  return { ok: true, data: { name, message, place } };
}

/** A filled honeypot means a bot; genuine readers never see this field. */
export function isHoneypotTripped(website: string | null | undefined): boolean {
  return typeof website === "string" && website.trim().length > 0;
}

export type PhotoResult =
  | { ok: true; ext: "jpg" | "png" | "webp"; contentType: string }
  | { ok: false; message: string };

/** Validates size, declared type, AND magic bytes — never trusting the client's
    declared MIME alone. `header` should be at least the first 12 bytes. */
export function validatePhoto(input: {
  size: number;
  type: string;
  header: Uint8Array;
}): PhotoResult {
  if (input.size <= 0) {
    return { ok: false, message: "That photo appears to be empty." };
  }
  if (input.size > NOTE_LIMITS.photoBytes) {
    return { ok: false, message: "Photos must be 5 MB or smaller." };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(input.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { ok: false, message: "Photos must be a JPEG, PNG, or WebP image." };
  }

  const b = input.header;
  const isJpeg = b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isPng =
    b.length >= 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a;
  const isWebp =
    b.length >= 12 &&
    b[0] === 0x52 && // R
    b[1] === 0x49 && // I
    b[2] === 0x46 && // F
    b[3] === 0x46 && // F
    b[8] === 0x57 && // W
    b[9] === 0x45 && // E
    b[10] === 0x42 && // B
    b[11] === 0x50; // P

  if (isJpeg && input.type === "image/jpeg")
    return { ok: true, ext: "jpg", contentType: "image/jpeg" };
  if (isPng && input.type === "image/png")
    return { ok: true, ext: "png", contentType: "image/png" };
  if (isWebp && input.type === "image/webp")
    return { ok: true, ext: "webp", contentType: "image/webp" };

  return { ok: false, message: "That file doesn’t look like a valid image." };
}
