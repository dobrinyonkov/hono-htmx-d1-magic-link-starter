import type { HtmlEscapedString } from "hono/utils/html";

export function loginPage(result?: HtmlEscapedString | string): HtmlEscapedString {
  return (
    <div x-data="{ activeTab: 'signin' }" style="display: contents;">
      <nav class="sidebar">
        <button
          class="sidebar-item"
          x-bind:class="activeTab === 'signin' ? 'active' : ''"
          x-on:click="activeTab = 'signin'"
        >
          Sign in
        </button>
        <button
          class="sidebar-item"
          x-bind:class="activeTab === 'about' ? 'active' : ''"
          x-on:click="activeTab = 'about'"
        >
          About
        </button>
      </nav>

      <div class="main">
        <section class="tab-content" x-show="activeTab === 'signin'" x-cloak>
          <h2>Sign in</h2>
          <p>Enter your email and use the magic link to continue.</p>

          <form
            method="post"
            action="/login"
            hx-post="/login"
            hx-target="#login-response"
            hx-swap="innerHTML"
            hx-indicator="#login-spinner"
          >
            <div class="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                autocomplete="email"
                inputmode="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <button type="submit">
              Send magic link
              <span id="login-spinner" class="htmx-indicator"> …</span>
            </button>
          </form>

          <div id="login-response">{result ?? null}</div>
        </section>

        <section class="tab-content" x-show="activeTab === 'about'" x-cloak>
          <h2>About</h2>
          <p>A small Cloudflare Worker starter with Hono routes, htmx, Alpine, Drizzle, D1, and magic link auth.</p>
          <ul>
            <li>HTTP-only D1-backed sessions</li>
            <li>Hashed single-use magic link tokens</li>
            <li>Cloudflare Email binding support</li>
          </ul>
        </section>
      </div>
    </div>
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
