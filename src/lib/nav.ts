export type NavItem = { label: string; href: string };

/** Internal public navigation. Instagram is external and handled separately. */
export const PUBLIC_NAV: readonly NavItem[] = [
  { label: "Library", href: "/library" },
  { label: "About the Author", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
] as const;

/** Where "Start Reading" leads for now — the Library, to discover a book.
    The per-book reader arrives in Phase 4. */
export const START_READING_HREF = "/library";
