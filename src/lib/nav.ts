export type NavItem = { label: string; href: string; external?: boolean };

/** Internal public navigation. Instagram is external and handled separately. */
export const PUBLIC_NAV: readonly NavItem[] = [
  { label: "Library", href: "/library" },
  { label: "About the Author", href: "/about" },
  { label: "My Books", href: "https://www.amazon.in/stores/author/B0FTZDX4X4?ingress=0&visitId=756eabe4-6f4b-44be-ba86-a14d3d76779e", external: true },
  { label: "Testimonials", href: "/testimonials" },
] as const;

/** Where "Start Reading" leads for now — the Library, to discover a book.
 *  The per-book reader arrives in Phase 4. */
export const START_READING_HREF = "/library";
