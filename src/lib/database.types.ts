/**
 * Database types for the INK & PAPER schema.
 *
 * These are written to match exactly what the Supabase CLI produces, so that
 * once the project exists they can be regenerated in place with no code churn:
 *
 *   npx supabase gen types typescript --project-id <ref> --schema public \
 *     > src/lib/database.types.ts
 *
 * Note on the `reading_sequence` view: regenerating may widen some computed
 * columns to nullable. The hand-typed shape below reflects the values the view
 * actually produces (see the SQL migration for the guarantees).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          slug: string;
          subtitle: string | null;
          genre: string | null;
          description: string | null;
          cover_url: string | null;
          status: Database["public"]["Enums"]["book_status"];
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          subtitle?: string | null;
          genre?: string | null;
          description?: string | null;
          cover_url?: string | null;
          status?: Database["public"]["Enums"]["book_status"];
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          subtitle?: string | null;
          genre?: string | null;
          description?: string | null;
          cover_url?: string | null;
          status?: Database["public"]["Enums"]["book_status"];
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          book_id: string;
          title: string;
          content: string | null;
          kind: Database["public"]["Enums"]["chapter_kind"];
          display_order: number;
          audio_url: string | null;
          audio_duration: number | null;
          audio_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          title: string;
          content?: string | null;
          kind?: Database["public"]["Enums"]["chapter_kind"];
          display_order?: number;
          audio_url?: string | null;
          audio_duration?: number | null;
          audio_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          title?: string;
          content?: string | null;
          kind?: Database["public"]["Enums"]["chapter_kind"];
          display_order?: number;
          audio_url?: string | null;
          audio_duration?: number | null;
          audio_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          message: string;
          designation_or_location: string | null;
          photo_url: string | null;
          book_id: string | null;
          published: boolean;
          featured: boolean;
          source: Database["public"]["Enums"]["testimonial_source"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          message: string;
          designation_or_location?: string | null;
          photo_url?: string | null;
          book_id?: string | null;
          published?: boolean;
          featured?: boolean;
          source?: Database["public"]["Enums"]["testimonial_source"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          message?: string;
          designation_or_location?: string | null;
          photo_url?: string | null;
          book_id?: string | null;
          published?: boolean;
          featured?: boolean;
          source?: Database["public"]["Enums"]["testimonial_source"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_book_id_fkey";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"] | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["app_role"] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          site_name: string;
          author_name: string;
          site_description: string;
          instagram_url: string | null;
          contact_email: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          site_name?: string;
          author_name?: string;
          site_description?: string;
          instagram_url?: string | null;
          contact_email?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          site_name?: string;
          author_name?: string;
          site_description?: string;
          instagram_url?: string | null;
          contact_email?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: number;
          path: string;
          kind: string;
          book_slug: string | null;
          section_path_segment: string | null;
          viewed_at: string;
          day: string;
        };
        Insert: {
          id?: number;
          path: string;
          kind: string;
          book_slug?: string | null;
          section_path_segment?: string | null;
          viewed_at?: string;
          day?: string;
        };
        Update: {
          id?: number;
          path?: string;
          kind?: string;
          book_slug?: string | null;
          section_path_segment?: string | null;
          viewed_at?: string;
          day?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      reading_sequence: {
        Row: {
          id: string;
          book_id: string;
          title: string;
          content: string | null;
          kind: Database["public"]["Enums"]["chapter_kind"];
          display_order: number;
          audio_url: string | null;
          audio_duration: number | null;
          audio_status: string | null;
          created_at: string;
          updated_at: string;
          /** 1..M across the whole book, in reading order. */
          sequence_position: number;
          /** 1..N for kind='chapter' only; null for front matter. */
          chapter_number: number | null;
          /** count of kind='chapter' in the book (front matter excluded). */
          total_chapters: number;
          /** 'introduction' | 'contents' | 'chapter-<n>' */
          path_segment: string;
          /** 'Introduction' | 'Contents' | 'Chapter <n>' */
          label: string;
          /** neighbour in reading order; null = cover/root. */
          prev_path_segment: string | null;
          prev_label: string | null;
          /** neighbour in reading order; null = end-of-book completion. */
          next_path_segment: string | null;
          next_label: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_daily: {
        Row: {
          day: string | null;
          views: number | null;
        };
        Relationships: [];
      };
      analytics_top_paths: {
        Row: {
          path: string | null;
          kind: string | null;
          views: number | null;
        };
        Relationships: [];
      };
      analytics_book_views: {
        Row: {
          book_slug: string | null;
          views: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_author: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      book_status: "draft" | "published";
      chapter_kind:
        | "acknowledgments"
        | "introduction"
        | "contents"
        | "chapter"
        | "epilogue";
      testimonial_source: "author" | "reader_submission";
      app_role: "author";
    };
    CompositeTypes: Record<PropertyKey, never>;
  };
};

// ── Convenience helpers (same shape the Supabase CLI appends) ────────────────

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Views<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
