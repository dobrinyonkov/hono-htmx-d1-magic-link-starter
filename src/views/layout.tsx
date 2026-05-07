import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { HtmlEscapedString } from "hono/utils/html";
import type { User } from "../db/schema";

const htmxVersion = "2.0.10";
const alpineVersion = "3.15.11";
const shadcxBase = "https://dobrinyonkov.github.io/shadcx/assets";

const styles = `
* {
  box-sizing: border-box;
}

[x-cloak] {
  display: none !important;
}

body {
  margin: 0;
  min-height: 100svh;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
}

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

/* Header */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
}

.brand {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: hsl(var(--foreground));
  text-decoration: none;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font: inherit;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem;
}

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 2rem;
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  flex: 1;
  width: 100%;
}

/* Sidebar / Tabs */
.sidebar {
  display: flex;
  flex-direction: column;
  align-self: start;
  gap: 0.125rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font: inherit;
}

.sidebar-item:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.sidebar-item.active {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  font-weight: 500;
}

/* Main */
.main h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.main p {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.5;
  margin-bottom: 1rem;
}

/* Form */
.field {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
}

input {
  width: 100%;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font: inherit;
  font-size: 0.875rem;
}

button {
  font: inherit;
  cursor: pointer;
}

button[type="submit"] {
  height: 2.25rem;
  padding: 0 1rem;
  border: 1px solid hsl(var(--primary));
  border-radius: calc(var(--radius) - 2px);
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 0.875rem;
  font-weight: 500;
}

button[type="submit"]:hover {
  opacity: 0.92;
}

/* Notices */
.notice {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  background: hsl(var(--muted) / 0.4);
  font-size: 0.875rem;
}

.notice a {
  color: hsl(var(--foreground));
}

/* Details */
.details {
  display: grid;
  gap: 0.75rem;
}

.details dt {
  font-weight: 600;
  font-size: 0.875rem;
}

.details dd {
  margin: 0;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
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

/* Tab content - visibility handled by Alpine x-show */
.tab-content[x-cloak] {
  display: none !important;
}

/* Mobile */
@media (max-width: 640px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 1rem;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    margin-inline: -1rem;
    padding-inline: 1rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .sidebar-item {
    width: auto;
    min-height: 2rem;
    padding-block: 0.375rem;
    flex: 0 0 auto;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  .sidebar-item.active {
    border-color: hsl(var(--border));
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
          <link rel="stylesheet" href={`${shadcxBase}/theme.css`} />
          <script type="module" src={`${shadcxBase}/button.js`}></script>
          <script type="module" src={`${shadcxBase}/badge.js`}></script>
          <script type="module" src={`${shadcxBase}/dropdown-menu.js`}></script>
          <style>{raw(styles)}</style>
        </head>
        <body>
          <div class="app-shell">
            <header class="topbar">
              <a class="brand" href="/">
                Hono D1 Starter
              </a>
              <div class="topbar-actions">
                {props.user ? (
                  <shadcx-dropdown-menu>
                    <shadcx-dropdown-menu-trigger>
                      <button class="user-dropdown-toggle">
                        {props.user.email}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </button>
                    </shadcx-dropdown-menu-trigger>
                    <shadcx-dropdown-menu-content align="end">
                      <shadcx-dropdown-menu-item>Profile</shadcx-dropdown-menu-item>
                      <shadcx-dropdown-menu-item>Settings</shadcx-dropdown-menu-item>
                      <shadcx-dropdown-menu-separator></shadcx-dropdown-menu-separator>
                      <shadcx-dropdown-menu-item>
                        <form method="post" action="/logout" hx-post="/logout" style="display: contents;">
                          <button type="submit" style="all: unset; cursor: pointer; width: 100%; text-align: left;">Sign out</button>
                        </form>
                      </shadcx-dropdown-menu-item>
                    </shadcx-dropdown-menu-content>
                  </shadcx-dropdown-menu>
                ) : null}
              </div>
            </header>
            <main class="layout">
              {props.children}
            </main>
          </div>
        </body>
      </html>
    </>
  ) as HtmlEscapedString;
}
