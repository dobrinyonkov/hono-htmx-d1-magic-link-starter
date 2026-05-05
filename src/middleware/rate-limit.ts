import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../types";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(options: { windowMs: number; max: number }): MiddlewareHandler<AppEnv> {
  const { windowMs, max } = options;

  return async (c, next) => {
    const key = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();

    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.text("Too many requests", 429);
    }

    return next();
  };
}
