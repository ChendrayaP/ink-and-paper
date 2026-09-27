import { NextResponse } from "next/server";
import sharp from "sharp";
import { getReaderBook } from "@/lib/data/reader";
import { isSupabaseConfigured } from "@/lib/env";

// sharp requires the Node.js runtime (not Edge).
export const runtime = "nodejs";

const W = 1200;
const H = 630;
const PAPER = { r: 245, g: 240, b: 230 }; // #f5f0e6

// Only ever fetch covers from our own Supabase Storage public bucket. This
// prevents the route from being turned into an open proxy / SSRF vector even if
// a stored cover_url were somehow tampered with.
const ALLOWED_COVER =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/book-covers\//i;

const CACHE = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

/** A neutral paper card used only when no cover is available (rare: publishing
    requires a cover). Pure fill — no fonts, so it renders identically on Vercel. */
async function paperCard(): Promise<Buffer> {
  return sharp({
    create: { width: W, height: H, channels: 3, background: PAPER },
  })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

/** 1200x630 card: the cover, undistorted, centered over a soft blurred,
    slightly darkened backdrop derived from the same cover. No text → no font
    dependency, so output is identical locally and on Vercel. */
async function coverCard(coverBuf: Buffer): Promise<Buffer> {
  // Backdrop: cover-fill the frame, blur, so the sides are filled tastefully.
  const backdrop = await sharp(coverBuf)
    .resize(W, H, { fit: "cover", position: "centre" })
    .blur(28)
    .toBuffer();

  // Translucent dark layer to unify the backdrop and make the crisp cover pop.
  const darken = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 20, g: 18, b: 15, alpha: 0.42 } },
  })
    .png()
    .toBuffer();

  // Foreground: the actual cover, contained (no distortion), prominent.
  const fg = await sharp(coverBuf)
    .resize({ height: 534, fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const fgMeta = await sharp(fg).metadata();
  const fgW = fgMeta.width ?? 356;
  const fgH = fgMeta.height ?? 534;

  // A thin light frame just behind the cover (pure rectangle, no fonts).
  const frame = await sharp({
    create: {
      width: fgW + 4,
      height: fgH + 4,
      channels: 4,
      background: { r: 245, g: 240, b: 230, alpha: 0.9 },
    },
  })
    .png()
    .toBuffer();

  const frameLeft = Math.round((W - (fgW + 4)) / 2);
  const frameTop = Math.round((H - (fgH + 4)) / 2);
  const fgLeft = Math.round((W - fgW) / 2);
  const fgTop = Math.round((H - fgH) / 2);

  return sharp(backdrop)
    .composite([
      { input: darken, left: 0, top: 0 },
      { input: frame, left: frameLeft, top: frameTop },
      { input: fg, left: fgLeft, top: fgTop },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const headers = { "Content-Type": "image/jpeg", "Cache-Control": CACHE };

  try {
    if (!isSupabaseConfigured()) {
      return new NextResponse(new Uint8Array(await paperCard()), { status: 200, headers });
    }

    // Only PUBLISHED books resolve here (RLS + status filter inside getReaderBook).
    const book = await getReaderBook(slug);
    if (!book) {
      return new NextResponse(new Uint8Array(await paperCard()), { status: 404, headers });
    }

    let coverBuf: Buffer | null = null;
    if (book.cover_url && ALLOWED_COVER.test(book.cover_url)) {
      const res = await fetch(book.cover_url, { cache: "no-store" });
      if (res.ok) coverBuf = Buffer.from(await res.arrayBuffer());
    }

    const jpeg = coverBuf ? await coverCard(coverBuf) : await paperCard();
    return new NextResponse(new Uint8Array(jpeg), { status: 200, headers });
  } catch {
    // Never break social crawlers — return a valid neutral card.
    try {
      return new NextResponse(new Uint8Array(await paperCard()), { status: 200, headers });
    } catch {
      return new NextResponse(null, { status: 500 });
    }
  }
}
