import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { HtmlEscapedString } from "hono/utils/html";
import type { User } from "./db/schema";

const htmxVersion = "2.0.10";
const alpineVersion = "3.15.11";

const styles = `
* {
  box-sizing: border-box;
}

[x-cloak] {
  display: none !important;
}

body {
  margin: 0;
}

.app-shell {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.brand {
  font-weight: 600;
  text-decoration: none;
}

.stack {
  display: grid;
  gap: 1.25rem;
}

.login-form {
  display: grid;
  gap: 0.75rem;
  max-width: 28rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

input {
  width: 100%;
}

button,
input {
  font: inherit;
}

.hint,
.notice {
  max-width: 32rem;
}

.notice {
  margin-top: 1rem;
}

.details {
  display: grid;
  gap: 0.75rem;
}

.details dt {
  font-weight: 600;
}

.details dd {
  margin: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 520px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

export function layout(props: {
  title?: string;
  user?: User | null;
  children: Child | HtmlEscapedString;
}): HtmlEscapedString {
  const appTitle = props.title ?? "Hono D1 Starter";

  return (
    <>
      {raw("<!doctype html>")}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{appTitle}</title>
          <script src={`https://unpkg.com/htmx.org@${htmxVersion}`} defer></script>
          <script src={`https://unpkg.com/alpinejs@${alpineVersion}/dist/cdn.min.js`} defer></script>
          <style>{raw(styles)}</style>
        </head>
        <body>
          <main class="app-shell">
            <header class="topbar">
              <a class="brand" href="/">
                Hono D1 Starter
              </a>
              {props.user ? (
                <form method="post" action="/logout">
                  <button type="submit">Sign out</button>
                </form>
              ) : null}
            </header>
            {props.children}
          </main>
        </body>
      </html>
    </>
  ) as HtmlEscapedString;
}

export function loginPage(result?: HtmlEscapedString | string): HtmlEscapedString {
  return (
    <section class="stack" x-data="{ email: '' }">
      <header>
        <h1>Sign in</h1>
        <p>Enter your email and use the magic link to continue.</p>
      </header>

      <form class="login-form" method="post" action="/login" hx-post="/login" hx-target="#login-response" hx-swap="innerHTML">
        <label class="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autocomplete="email"
            inputmode="email"
            required
            x-model="email"
            placeholder="you@example.com"
          />
        </label>
        <p class="hint" x-show="email.includes('@')" x-cloak>
          Link for <strong x-text="email.trim().toLowerCase()"></strong>
        </p>
        <button type="submit">Send magic link</button>
      </form>

      <div id="login-response">{result ?? null}</div>
    </section>
  ) as HtmlEscapedString;
}

export function dashboardPage(user: User): HtmlEscapedString {
  return (
    <section class="stack">
      <header>
        <h1>Dashboard</h1>
        <p>You are signed in.</p>
      </header>

      <dl class="details">
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>User ID</dt>
          <dd>{user.id}</dd>
        </div>
      </dl>

      <section>
        <h2>Auth notes</h2>
        <ul>
          <li>Session cookie is HTTP-only and backed by D1.</li>
          <li>Magic link tokens are hashed before they touch the database.</li>
          <li>Production email uses the Cloudflare Email binding.</li>
        </ul>
      </section>
    </section>
  ) as HtmlEscapedString;
}

export function loginResult(
  props:
    | { kind: "dev"; email: string; link: string }
    | { kind: "sent"; email: string }
    | { kind: "error"; message: string }
): HtmlEscapedString {
  if (props.kind === "dev") {
    return (
      <div class="notice" role="status">
        <p>
          <strong>Dev login link ready.</strong>
        </p>
        <p>The link for {props.email} is available in this UI.</p>
        <p>
          <a href={props.link}>Open magic link</a>
        </p>
      </div>
    ) as HtmlEscapedString;
  }

  if (props.kind === "sent") {
    return (
      <div class="notice" role="status">
        <p>
          <strong>Check your inbox.</strong>
        </p>
        <p>A sign-in link was sent to {props.email}.</p>
      </div>
    ) as HtmlEscapedString;
  }

  return (
    <div class="notice" role="alert">
      <p>
        <strong>Could not continue.</strong>
      </p>
      <p>{props.message}</p>
    </div>
  ) as HtmlEscapedString;
}
