import { and, eq, gt, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { getDb } from "./db/client";
import { magicLinks, sessions, users, type User } from "./db/schema";
import { createId, createToken, daysFromNow, hashToken, minutesFromNow, nowIso } from "./security";
import type { AppEnv } from "./types";

const SESSION_COOKIE = "starter_session";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AppContext = Context<AppEnv>;

export type EmailResult =
  | { ok: true; email: string }
  | { ok: false; message: string };

export function normalizeEmail(value: unknown): EmailResult {
  if (typeof value !== "string") {
    return { ok: false, message: "Enter an email address." };
  }

  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  return { ok: true, email };
}

export function isDevelopment(c: AppContext) {
  const hostname = new URL(c.req.url).hostname;
  return (
    String(c.env.DEV_LOGIN_LINKS) === "true" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

export async function createMagicLink(c: AppContext, email: string) {
  const db = getDb(c.env);
  const ttlMinutes = parsePositiveInt(c.env.MAGIC_LINK_TTL_MINUTES, 10);
  const token = createToken();
  const tokenHash = await hashToken(token);

  await db.insert(magicLinks).values({
    id: createId("ml"),
    email,
    tokenHash,
    expiresAt: minutesFromNow(ttlMinutes)
  });

  const url = new URL(c.req.url);
  url.pathname = "/auth/verify";
  url.search = new URLSearchParams({ token }).toString();
  return url.toString();
}

export async function consumeMagicLink(c: AppContext, token: string) {
  const db = getDb(c.env);
  const tokenHash = await hashToken(token);
  const now = nowIso();

  const [link] = await db
    .update(magicLinks)
    .set({ consumedAt: now })
    .where(and(eq(magicLinks.tokenHash, tokenHash), isNull(magicLinks.consumedAt), gt(magicLinks.expiresAt, now)))
    .returning();

  if (!link) {
    return null;
  }

  await db
    .insert(users)
    .values({
      id: createId("usr"),
      email: link.email,
      updatedAt: now,
      lastLoginAt: now
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        updatedAt: now,
        lastLoginAt: now
      }
    });

  const [user] = await db.select().from(users).where(eq(users.email, link.email)).limit(1);
  if (!user) {
    return null;
  }

  const sessionToken = createToken();
  const sessionId = await hashToken(sessionToken);
  const expiresAt = daysFromNow(parsePositiveInt(c.env.SESSION_TTL_DAYS, 30));

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt
  });

  return { user, sessionToken, expiresAt };
}

export async function getCurrentUser(c: AppContext): Promise<User | null> {
  const sessionToken = getCookie(c, SESSION_COOKIE);
  if (!sessionToken) {
    return null;
  }

  const db = getDb(c.env);
  const sessionId = await hashToken(sessionToken);
  const now = nowIso();

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))
    .limit(1);

  if (!session) {
    deleteCookie(c, SESSION_COOKIE, cookieBase(c));
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user ?? null;
}

export async function setSessionCookie(c: AppContext, sessionToken: string, expiresAt: string) {
  setCookie(c, SESSION_COOKIE, sessionToken, {
    ...cookieBase(c),
    httpOnly: true,
    expires: new Date(expiresAt)
  });
}

export async function signOut(c: AppContext) {
  const sessionToken = getCookie(c, SESSION_COOKIE);
  if (sessionToken) {
    const db = getDb(c.env);
    await db.delete(sessions).where(eq(sessions.id, await hashToken(sessionToken)));
  }

  deleteCookie(c, SESSION_COOKIE, cookieBase(c));
}

function cookieBase(c: AppContext) {
  return {
    path: "/",
    sameSite: "Lax" as const,
    secure: !isDevelopment(c)
  };
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
