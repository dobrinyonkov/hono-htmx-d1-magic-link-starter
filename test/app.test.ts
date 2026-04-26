/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { env } from "cloudflare:workers";
import { createExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import app from "../src/index";
import { hashToken } from "../src/security";

function fetchApp(path: string, init?: RequestInit) {
  const request = new Request(new URL(path, "http://localhost").toString(), init);
  const ctx = createExecutionContext();
  return app.fetch(request, env, ctx);
}

async function requestMagicLink(email: string) {
  const body = new URLSearchParams({ email });
  const response = await fetchApp("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "HX-Request": "true"
    },
    body
  });
  const text = await response.text();
  const href = text.match(/href="([^"]*\/auth\/verify\?token=[^"]+)"/)?.[1];
  if (!href) {
    throw new Error(`Could not find magic link in response: ${text}`);
  }

  return { response, text, href };
}

describe("worker routes", () => {
  it("serves health checks", async () => {
    const response = await fetchApp("/health");

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("renders the login page", async () => {
    const response = await fetchApp("/");
    const page = await response.text();

    expect(response.status).toBe(200);
    expect(page).toContain("<h1>Sign in</h1>");
    expect(page).toContain("htmx.org@2.0.10");
    expect(page).toContain("alpinejs@3.15.11");
  });

  it("shows a clickable magic link during local development", async () => {
    const { response, text, href } = await requestMagicLink("Test@Example.com");

    expect(response.status).toBe(200);
    expect(text).toContain("Dev login link ready.");
    expect(text).toContain("test@example.com");
    expect(href).toMatch(/^http:\/\/localhost\/auth\/verify\?token=/);
  });

  it("signs in with a magic link and then signs out", async () => {
    const { href } = await requestMagicLink("person@example.com");
    const verifyUrl = new URL(href);
    const verify = await fetchApp(`${verifyUrl.pathname}${verifyUrl.search}`);
    const cookie = verify.headers.get("Set-Cookie") ?? "";

    expect(verify.status).toBe(302);
    expect(verify.headers.get("Location")).toBe("/");
    expect(cookie).toContain("starter_session=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).not.toContain("Secure");

    const cookieHeader = cookie.split(";")[0];
    const dashboard = await fetchApp("/", {
      headers: {
        Cookie: cookieHeader
      }
    });
    const dashboardPage = await dashboard.text();

    expect(dashboard.status).toBe(200);
    expect(dashboardPage).toContain("<h1>Dashboard</h1>");
    expect(dashboardPage).toContain("person@example.com");

    const logout = await fetchApp("/logout", {
      method: "POST",
      headers: {
        Cookie: cookieHeader
      }
    });

    expect(logout.status).toBe(302);
    expect(logout.headers.get("Location")).toBe("/");
    expect(logout.headers.get("Set-Cookie")).toContain("starter_session=");
  });

  it("rejects invalid and already-consumed magic links", async () => {
    const invalid = await fetchApp("/auth/verify?token=not-real");
    expect(await invalid.text()).toContain("This sign-in link is invalid or expired.");

    const { href } = await requestMagicLink("single-use@example.com");
    const verifyUrl = new URL(href);
    const path = `${verifyUrl.pathname}${verifyUrl.search}`;
    const firstUse = await fetchApp(path);
    const secondUse = await fetchApp(path);

    expect(firstUse.status).toBe(302);
    expect(await secondUse.text()).toContain("This sign-in link is invalid or expired.");
  });
});

describe("security helpers", () => {
  it("hashes tokens deterministically without returning the raw token", async () => {
    const first = await hashToken("sample-token");
    const second = await hashToken("sample-token");

    expect(first).toBe(second);
    expect(first).not.toBe("sample-token");
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });
});
