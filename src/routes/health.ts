import { Hono } from "hono";
import type { AppEnv } from "../types";

const health = new Hono<AppEnv>();

health.get("/health", (c) => c.json({ ok: true }));

export default health;
