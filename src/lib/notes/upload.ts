import "server-only";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "testimonial-photos";

/*
  The ONLY privileged operation in the Leave-a-Note flow. Uses the service-role
  client purely to write one validated image to the testimonial-photos bucket
  (anonymous clients have no write access to Storage). Never imported by client
  code — the "server-only" guard above fails the build if attempted.
*/
export async function uploadReaderPhoto(
  bytes: Uint8Array,
  contentType: string,
  ext: string,
): Promise<{ path: string; publicUrl: string }> {
  const admin = createAdminClient();
  const path = `${randomUUID()}.${ext}`;

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType, upsert: false });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/** Best-effort cleanup if the row insert fails after an upload. */
export async function deleteReaderPhoto(path: string): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.storage.from(BUCKET).remove([path]);
  } catch {
    // best-effort only
  }
}
