/*
  Lightweight, dependency-free rate limiter for the tracking endpoint (fixed
  window, per IP). In-memory and best-effort — same trade-offs as the notes
  limiter: per-instance, resets on redeploy. The IP is used ONLY transiently for
  this check and is never stored. This exists to deter obvious flooding, not as a
  hard global guarantee.
*/
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 60; // generous: normal reading generates far fewer

type Entry = { count: number; resetAt: number };
const hits = new Map<string, Entry>();

export function checkTrackRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}
