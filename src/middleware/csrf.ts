import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../types";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrf: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (SAFE_METHODS.has(c.req.method)) {
    return next();
  }

  const origin = c.req.header("Origin");
  if (!origin) {
    return next();
  }

  const requestHost = new URL(c.req.url).host;
  const originHost = new URL(origin).host;

  if (originHost !== requestHost) {
    return c.text("Forbidden", 403);
  }

  return next();
};
