import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { devFixturesEnabled, devTestimonials } from "@/lib/data/fixtures";

/** A published testimonial prepared for display. */
export type TestimonialView = {
  id: string;
  name: string;
  message: string;
  location: string | null;
  photoUrl: string | null;
  featured: boolean;
  bookTitle: string | null;
};

/** Published testimonials only, featured first, newest first. Each carries the
    associated book's title (when the note is attached to a published book). */
export async function getPublishedTestimonials(): Promise<TestimonialView[]> {
  if (devFixturesEnabled()) return devTestimonials;
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select(
        "id, name, message, designation_or_location, photo_url, featured, books(title)",
      )
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((t) => {
      const book = t.books as { title: string } | null;
      return {
        id: t.id,
        name: t.name,
        message: t.message,
        location: t.designation_or_location,
        photoUrl: t.photo_url,
        featured: t.featured,
        bookTitle: book?.title ?? null,
      };
    });
  } catch (err) {
    console.error("getPublishedTestimonials failed:", err);
    return [];
  }
}
