/*
  Friendly domain aliases derived from the generated Database type.
  Import these throughout the app rather than reaching into Database directly.
*/
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Views,
  Enums,
} from "./database.types";

export type Book = Tables<"books">;
export type BookInsert = TablesInsert<"books">;
export type BookUpdate = TablesUpdate<"books">;

export type Chapter = Tables<"chapters">;
export type ChapterInsert = TablesInsert<"chapters">;
export type ChapterUpdate = TablesUpdate<"chapters">;

export type Testimonial = Tables<"testimonials">;
export type TestimonialInsert = TablesInsert<"testimonials">;
export type TestimonialUpdate = TablesUpdate<"testimonials">;

export type Profile = Tables<"profiles">;
export type SiteSettings = Tables<"site_settings">;

/** A row of the reading_sequence view — one section in reading order. */
export type ReadingSequenceItem = Views<"reading_sequence">;

export type BookStatus = Enums<"book_status">;
export type ChapterKind = Enums<"chapter_kind">;
export type TestimonialSource = Enums<"testimonial_source">;
export type AppRole = Enums<"app_role">;
