import type { HtmlEscapedString } from "hono/utils/html";

export function loginPage(result?: HtmlEscapedString | string): HtmlEscapedString {
  return (
    <section class="stack" x-data="{ email: '' }">
      <header>
        <h1>Sign in</h1>
        <p>Enter your email and use the magic link to continue.</p>
      </header>

      <form
        class="login-form"
        method="post"
        action="/login"
        hx-post="/login"
        hx-target="#login-response"
        hx-swap="innerHTML"
        hx-indicator="#login-spinner"
      >
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
        <button type="submit">
          Send magic link
          <span id="login-spinner" class="htmx-indicator"> …</span>
        </button>
      </form>

      <div id="login-response">{result ?? null}</div>
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
