import { Hono } from "hono";
import type { Context } from "hono";
import type { HtmlEscapedString } from "hono/utils/html";
import { rateLimit } from "../middleware/rate-limit";
import {
  consumeMagicLink,
  createMagicLink,
  getCurrentUser,
  isDevelopment,
  normalizeEmail,
  setSessionCookie,
  signOut
} from "../services/auth";
import { sendMagicLinkEmail } from "../services/email";
import type { AppEnv } from "../types";
import { dashboardPage } from "../views/dashboard";
import { layout } from "../views/layout";
import { loginPage, loginResult } from "../views/login";

const auth = new Hono<AppEnv>();

auth.get("/", async (c) => {
  const user = await getCurrentUser(c);
  return c.html(layout({ user, children: user ? dashboardPage(user) : loginPage() }));
});

auth.post("/login", rateLimit({ windowMs: 60_000, max: 10 }), async (c) => {
  const form = await c.req.formData();
  const email = normalizeEmail(form.get("email"));

  if (!email.ok) {
    return respondToLogin(c, loginResult({ kind: "error", message: email.message }));
  }

  const link = await createMagicLink(c, email.email);

  if (isDevelopment(c)) {
    return respondToLogin(c, loginResult({ kind: "dev", email: email.email, link }));
  }

  try {
    await sendMagicLinkEmail(c.env, email.email, link);
  } catch (error) {
    console.error("magic_link_email_failed", { email: email.email, error: getErrorMessage(error) });
    return respondToLogin(
      c,
      loginResult({ kind: "error", message: "The email could not be sent. Check the Email Routing binding." })
    );
  }

  return respondToLogin(c, loginResult({ kind: "sent", email: email.email }));
});

auth.get("/auth/verify", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.html(layout({ children: loginPage(loginResult({ kind: "error", message: "This sign-in link is missing a token." })) }));
  }

  const session = await consumeMagicLink(c, token);
  if (!session) {
    return c.html(
      layout({
        children: loginPage(loginResult({ kind: "error", message: "This sign-in link is invalid or expired." }))
      })
    );
  }

  await setSessionCookie(c, session.sessionToken, session.expiresAt);
  return c.redirect("/");
});

auth.post("/logout", async (c) => {
  await signOut(c);
  if (c.req.header("HX-Request") === "true") {
    c.header("HX-Redirect", "/");
    return c.body(null, 200);
  }
  return c.redirect("/");
});

function respondToLogin(c: Context<AppEnv>, content: HtmlEscapedString) {
  if (c.req.header("HX-Request") === "true") {
    return c.html(content);
  }

  return c.html(layout({ children: loginPage(content) }));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default auth;
