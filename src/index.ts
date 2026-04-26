import { Hono } from "hono";
import type { Context } from "hono";
import type { HtmlEscapedString } from "hono/utils/html";
import {
  consumeMagicLink,
  createMagicLink,
  getCurrentUser,
  isDevelopment,
  normalizeEmail,
  setSessionCookie,
  signOut
} from "./auth";
import { sendMagicLinkEmail } from "./email";
import { dashboardPage, layout, loginPage, loginResult } from "./render";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  await next();
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("X-Content-Type-Options", "nosniff");
});

app.get("/", async (c) => {
  const user = await getCurrentUser(c);
  return c.html(layout({ user, children: user ? dashboardPage(user) : loginPage() }));
});

app.post("/login", async (c) => {
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

app.get("/auth/verify", async (c) => {
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

app.post("/logout", async (c) => {
  await signOut(c);
  return c.redirect("/");
});

app.get("/health", (c) => c.json({ ok: true }));

app.notFound((c) =>
  c.html(
    layout({
      children: loginPage(loginResult({ kind: "error", message: "That route does not exist yet." }))
    }),
    404
  )
);

app.onError((error, c) => {
  console.error("unhandled_error", { error: getErrorMessage(error) });
  return c.html(
    layout({
      children: loginPage(loginResult({ kind: "error", message: "Something went wrong." }))
    }),
    500
  );
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

export default app;
