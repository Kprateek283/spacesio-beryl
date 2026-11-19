import { createHash } from "crypto";

/**
 * Fixed-window rate limiter.
 *
 * Production: uses Upstash Redis over its REST API (works on serverless /
 * edge, shared across all instances) when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set.
 *
 * Development / not configured: falls back to an in-memory store, which only
 * protects a single long-running process.
 */

export interface RateLimitRule {
  /** Short name used in the storage key, e.g. "burst" or "daily". */
  name: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window that blocked the request resets. */
  retryAfter: number;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

let warnedNoRedis = false;

// ---- In-memory fallback ---------------------------------------------------
const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowSeconds: number) {
  const now = Date.now();
  if (memory.size > 5000) {
    memory.forEach((v, k) => {
      if (v.resetAt <= now) memory.delete(k);
    });
  }
  let entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowSeconds * 1000 };
    memory.set(key, entry);
  }
  entry.count += 1;
  return { count: entry.count, ttlMs: entry.resetAt - now };
}

// ---- Upstash Redis --------------------------------------------------------
async function redisHit(key: string, windowSeconds: number) {
  // SET NX EX starts the window (with expiry) only if it doesn't exist yet;
  // INCR then counts the request without touching the expiry.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["SET", key, "0", "EX", String(windowSeconds), "NX"],
      ["INCR", key],
      ["PTTL", key],
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(2000),
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const [, incr, pttl] = (await res.json()) as { result?: number; error?: string }[];
  if (incr?.error || typeof incr?.result !== "number") throw new Error(incr?.error || "Bad Upstash response");
  const ttl = typeof pttl?.result === "number" && pttl.result > 0 ? pttl.result : windowSeconds * 1000;
  return { count: incr.result, ttlMs: ttl };
}

/** Hash identifiers so raw IPs / emails are never stored. */
export function hashIdentifier(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/**
 * Checks every rule for the identifier and fails if any one is exceeded.
 * If Redis is unreachable, it fails open (allows the request) so a storage
 * outage never blocks genuine enquiries; the error is logged.
 */
export async function rateLimit(
  scope: string,
  identifier: string,
  rules: RateLimitRule[]
): Promise<RateLimitResult> {
  if (!useRedis && process.env.NODE_ENV === "production" && !warnedNoRedis) {
    warnedNoRedis = true;
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set; using in-memory limits, which are not shared between server instances."
    );
  }

  const id = hashIdentifier(identifier);
  let tightest: RateLimitResult = { success: true, limit: Infinity, remaining: Infinity, retryAfter: 0 };

  for (const rule of rules) {
    const key = `rl:${scope}:${rule.name}:${id}`;
    let hit: { count: number; ttlMs: number };
    try {
      hit = useRedis ? await redisHit(key, rule.windowSeconds) : memoryHit(key, rule.windowSeconds);
    } catch (err) {
      console.error("[rate-limit] store error, allowing request", err);
      continue;
    }

    const remaining = Math.max(0, rule.limit - hit.count);
    const retryAfter = Math.ceil(hit.ttlMs / 1000);
    if (hit.count > rule.limit) {
      return { success: false, limit: rule.limit, remaining: 0, retryAfter };
    }
    if (remaining < tightest.remaining) {
      tightest = { success: true, limit: rule.limit, remaining, retryAfter };
    }
  }

  return tightest;
}

/**
 * Best-effort client IP. These headers are set by the hosting platform
 * (Cloudflare, Vercel, Netlify, most reverse proxies) and overwrite any
 * value the client sends. If self-hosting, make sure your proxy sets
 * X-Real-IP or overwrites X-Forwarded-For.
 */
export function getClientIp(headers: Headers): string {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",")[0],
  ];
  for (const ip of candidates) {
    const value = ip?.trim();
    if (value) return value;
  }
  return "unknown";
}
