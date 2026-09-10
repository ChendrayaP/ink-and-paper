/*
  Lightweight, dependency-free rate limiter (fixed window, per IP).

  This is intentionally in-memory: it needs no infrastructure and adds no
  dependency. Its limitation is that state is per server instance and resets on
  redeploy, so across many serverless instances it is best-effort rather than a
  hard global guarantee. Combined with the honeypot and request-size limits it
  is enough to deter obvious automated abuse. If a hard distributed limit is
  ever needed, this one function can be swapped for a Redis/Upstash-backed check
  without touching the route's logic.
*/
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

type Entry = { count: number; resetAt: number };
const hits = new Map<string, Entry>();

export function checkRateLimit(ip: string): {
  ok: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { ok: true };
}
