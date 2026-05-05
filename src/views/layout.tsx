import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { HtmlEscapedString } from "hono/utils/html";
import type { User } from "../db/schema";

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

.htmx-indicator {
  display: none;
}

.htmx-request .htmx-indicator {
  display: inline;
}

.htmx-request button[type="submit"] {
  opacity: 0.6;
  pointer-events: none;
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
                <form method="post" action="/logout" hx-post="/logout">
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
