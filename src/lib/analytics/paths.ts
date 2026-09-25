/*
  Pure, dependency-free path classification for analytics. Shared by the tracking
  endpoint (to validate + parse before recording) and the Studio dashboard.

  Only the six PUBLIC route shapes are trackable. Anything else — /studio, /auth,
  /api, static assets, or malformed input — is rejected, so private routes and
  junk are never recorded. No PII is involved; a path is not personal data.
*/

export type PageKind =
  | "home"
  | "library"
  | "about"
  | "testimonials"
  | "book"
  | "reader";

export type ClassifiedPath = {
  path: string; // normalized pathname (no query/hash), what gets stored
  kind: PageKind;
  bookSlug: string | null;
  sectionPathSegment: string | null;
};

// A slug/segment is a conservative URL-safe token (lowercase letters, digits, hyphens).
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Normalize an incoming path: strip origin, query, and hash; collapse a
    trailing slash (except root). Returns null if it isn't a clean pathname. */
export function normalizePath(input: string): string | null {
  if (typeof input !== "string") return null;
  let p = input.trim();
  if (!p) return null;
  // Reject absolute URLs and protocol-relative inputs; we only accept pathnames.
  if (/^[a-z]+:\/\//i.test(p) || p.startsWith("//")) return null;
  if (!p.startsWith("/")) return null;
  // Drop query string and hash.
  p = p.split("#")[0].split("?")[0];
  // Disallow traversal or backslashes.
  if (p.includes("..") || p.includes("\\")) return null;
  // Collapse a single trailing slash (keep root "/").
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  // Only printable ASCII path characters.
  if (!/^\/[A-Za-z0-9\-/_]*$/.test(p)) return null;
  return p;
}

/** Classify a normalized public path, or return null if it isn't a trackable
    public page (which excludes /studio, /auth, /api, assets, and anything else). */
export function classifyPath(input: string): ClassifiedPath | null {
  const path = normalizePath(input);
  if (path === null) return null;

  if (path === "/") return { path, kind: "home", bookSlug: null, sectionPathSegment: null };
  if (path === "/library") return { path, kind: "library", bookSlug: null, sectionPathSegment: null };
  if (path === "/about") return { path, kind: "about", bookSlug: null, sectionPathSegment: null };
  if (path === "/testimonials")
    return { path, kind: "testimonials", bookSlug: null, sectionPathSegment: null };

  const parts = path.split("/").filter(Boolean); // e.g. ["books","<slug>","<section>"]
  if (parts[0] === "books" && parts.length >= 2 && parts.length <= 3) {
    const slug = parts[1];
    if (!SLUG.test(slug)) return null;
    if (parts.length === 2) {
      return { path, kind: "book", bookSlug: slug, sectionPathSegment: null };
    }
    const section = parts[2];
    if (!SLUG.test(section)) return null;
    return { path, kind: "reader", bookSlug: slug, sectionPathSegment: section };
  }

  return null; // not a trackable public route
}
