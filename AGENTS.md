# AGENTS.md

Instructions for AI coding agents working in this repository.

**Do not trust static lists in this file.** Always explore the codebase to find current file paths and patterns.

---

## How to Approach Coding Tasks

### Phase 0: Think About Intent

Before doing anything, ask yourself: **what is the human actually trying to accomplish?**

- The user's words describe a task. The task exists in a context. Understand the context — the product, the users, the business goal — and reason about whether the literal request achieves the actual intent.
- If the request is ambiguous, generate 2-3 plausible interpretations and pick the most likely one based on context. If genuinely unclear, note your assumption.
- If the request seems wrong (contradicts existing code, would break something, solves the wrong problem), flag it. Polite pushback is better than silent compliance.
- Think about second-order effects: if I make this change, what else is affected? What will break? What assumption am I making?
- **Separate "what" from "how."** Understand the "what" (desired outcome) fully before jumping to "how" (implementation). Most bad implementations come from starting to code before the goal is clear.

### Phase 1: Understand Before Acting

**Most bad output comes from skipping this phase.**

1. **Read before you write.** Read the files you'll modify, the files adjacent to them, and at least one similar feature that already exists. You need to understand the local conventions, not just the language syntax.
2. **Trace the data flow.** Before changing anything, understand how data arrives (API, loader, props, store) and where it goes (render, action, redirect, external service).
3. **Find prior art.** Search the codebase for something similar to what you're about to build. If it exists, reuse it. If something close exists, follow its patterns. Don't invent new patterns when the codebase already has established ones.
4. **Read the tests.** Tests reveal the intended behavior, the edge cases the author cared about, and the mocking/testing style you should match.
5. **Identify constraints.** Check for: build systems, linters, formatters, type checkers, coverage requirements, CI pipelines. Know what "done" means before starting.

### Phase 2: Implement Incrementally

1. **Smallest change first.** Get something working end-to-end, then iterate. A 10-line change that works beats a 200-line change with a bug somewhere in the middle.
2. **One concern per change.** Don't mix a bug fix with a refactor with a new feature. If you notice something unrelated that needs fixing, note it — don't fix it in the same diff.
3. **Match existing style exactly.** Naming, spacing, file organization, import order, error handling patterns — copy what's already there. Consistency beats your preference.
4. **Write tests alongside code.** Not after. The test immediately validates your understanding. If you can't write a test for it, you probably don't understand it well enough yet.
5. **Run the test suite after every meaningful change.** Don't accumulate a large diff and pray. Finding a failure after 1 change is easy; after 10 changes it's archaeology.
6. **Don't guess at library APIs.** Read how the library is already used in the codebase. The existing usage is more reliable than your training data, which may be outdated.

### Phase 3: Verify

1. **Run the full test suite.** Not just "your" tests — you might have broken something else.
2. **Run the build.** Type checking, linting, coverage gates, and bundling all catch different classes of errors.
3. **Test in the browser if it's UI.** Type-checking and test suites verify code correctness, not feature correctness. If the task has visual output, look at it.
4. **Check edge cases.** Empty states, error states, loading states, long text, missing data. The happy path is never enough.

### What Separates Good From Bad Agent Output

**Good agents:**
- Read 5 files before writing 1
- Produce diffs of 20-50 lines for most tasks
- Follow existing patterns even when they'd do it differently
- Run tests and fix failures before reporting done
- Ask clarifying questions rather than guessing at ambiguous requirements

**Bad agents:**
- Start writing immediately without reading context
- Generate 300+ lines of new code with new abstractions and new patterns
- Invent their own conventions instead of matching the codebase
- Report "done" without running tests or the build
- Add unnecessary error handling, comments, type annotations, and wrapper functions
- Create new files when they should be editing existing ones
- Add features that weren't requested ("while I'm here, I also...")

### Anti-Patterns to Avoid

- **Over-engineering** — no abstractions until there are 3+ concrete uses. No helper functions for one-off logic. No "just in case" error handling for impossible states.
- **Premature commenting** — if the code needs a comment to explain WHAT it does, rename the variables instead. Only comment the WHY when it's genuinely non-obvious (workarounds, hidden constraints, surprising behavior).
- **Speculative generalization** — don't design for hypothetical future requirements. Build for the task at hand.
- **Fabricating APIs or options** — if you're not sure a function, method, flag, or config option exists, verify it by reading the source. Don't invent plausible-sounding APIs from memory. Wrong guesses waste more time than admitting uncertainty.
- **Cosmetic cleanup** — don't reformat, rename, or reorganize code that's unrelated to your task. Every line you touch is a line that could introduce a bug.
- **Ignoring test failures** — a failing test is a signal that your mental model is wrong. Don't "fix the test" without understanding why it failed. The test might be right and your code might be wrong.

### Workflow Checklist

```
1. Read the task — what exactly is being asked?
2. Explore the codebase — find relevant files and similar features
3. Identify patterns — how does this codebase do things?
4. Plan the change — what's the smallest diff that achieves the goal?
5. Implement — match existing style, write tests alongside
6. Test — run the full suite, fix failures
7. Build — verify types, lint, coverage all pass
8. Review your own diff — would you approve this PR?
```

---

## Project Overview

Hono web app on Cloudflare Workers with HTMX + Alpine.js frontend and magic link authentication:
- **Framework**: Hono (edge-native, type-safe)
- **Frontend**: HTMX for server-driven interactions, Alpine.js for local state
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Email**: Cloudflare Email Routing + mimetext
- **Auth**: Magic link (token hashed with SHA-256, single-use, TTL-based)
- **Testing**: Vitest with `@cloudflare/vitest-pool-workers`
- **CI**: GitHub Actions (typecheck + dry-run deploy + tests + npm audit)

---

## Discovery

**Read these sources of truth — do not rely on memorized paths:**

| What you need | Where to look |
|---------------|---------------|
| All routes | Read `src/routes/` directory |
| Database schema | Read `src/db/schema.ts` |
| Available scripts | Read `package.json` `scripts` field |
| Environment variables | Read `wrangler.jsonc` |
| Middleware stack | Read `src/index.ts` (mounts middleware + routes) |
| Auth logic | Read `src/services/auth.ts` |
| Views/templates | Read `src/views/` directory |
| Tests | Read `test/app.test.ts` |
| Migrations | Read `migrations/` directory |

---

## Architecture (non-obvious patterns)

### Runtime Environment

Code runs on **Cloudflare Workers** (workerd), NOT Node.js:
- No `fs`, `path`, or Node.js built-ins
- `crypto.subtle` and `crypto.getRandomValues` are available globally
- Cloudflare bindings (D1, Email) accessed via `env` parameter in Hono context
- Worker is stateless between requests (in-memory rate limit store resets on cold start)

### File Organization

The codebase separates concerns into layers:
- **`src/index.ts`** — app assembly only (middleware + routes + error handlers)
- **`src/routes/`** — HTTP request handling (parse input, call services, return responses)
- **`src/services/`** — business logic (auth, email, crypto) with no HTTP awareness
- **`src/views/`** — JSX templates that return `HtmlEscapedString`
- **`src/middleware/`** — reusable Hono middleware (security, CSRF, rate limiting)
- **`src/db/`** — schema definitions and Drizzle client factory

### HTMX Integration Pattern

Routes detect HTMX requests via `c.req.header("HX-Request") === "true"`:
- **HTMX request** → return a partial HTML fragment (just the updated part)
- **Non-HTMX request** → return full page wrapped in `layout()`

This allows progressive enhancement: forms work without JavaScript, HTMX makes them smoother.

### Authentication Flow

1. User submits email → POST `/login` (rate-limited)
2. Token generated (32 bytes, base64url), **hash** stored in D1 (never the raw token)
3. Email sent with magic link (or link shown inline in dev mode)
4. User clicks link → GET `/auth/verify?token=...`
5. Token hash matched, marked consumed (atomic UPDATE+RETURNING prevents races)
6. User upserted, session created (hashed session ID stored in D1)
7. HTTP-only cookie set (`starter_session`), redirect to `/`

### Security Layers

- **CSRF**: Origin header validation on all non-GET/HEAD/OPTIONS requests
- **Rate limiting**: In-memory per-IP counter on `/login` (10 req/min)
- **Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Cookies**: HTTP-only, SameSite=Lax, Secure in production
- **Tokens**: Never stored raw — always SHA-256 hashed before DB

---

## Conventions

### Package Manager

**Use `npm`.** This project uses `package-lock.json`.

### Database Schema

- Primary keys: `text("id").primaryKey()` with prefixed UUIDs (`usr_`, `ml_`)
- Timestamps: ISO strings stored as `text`
- Unique constraints on lookup fields (`email`, `tokenHash`)
- Indexes on fields used in WHERE clauses
- Foreign keys with `onDelete: "cascade"`

### Testing

- Tests run in Cloudflare Workers environment (not jsdom)
- Integration tests hit the full Hono app via `app.fetch()`
- Test helper `fetchApp()` creates requests against `http://localhost`
- Magic links extracted from HTML responses via regex in tests

### Views (HTMX)

- Views are `.tsx` files using Hono's JSX (`hono/jsx`)
- Return `HtmlEscapedString` type (auto-escapes interpolated values)
- Use `raw()` from `hono/html` only for trusted content (doctype, CSS)
- HTMX attributes go directly on form/button elements
- Alpine.js `x-data` for local UI state (email preview, etc.)

### Adding New Routes

1. Create a new file in `src/routes/`
2. Export a `Hono<AppEnv>` instance with the routes
3. Mount it in `src/index.ts` via `app.route("/", newRoutes)`
4. Add tests in `test/`

### Adding New Middleware

1. Create a file in `src/middleware/`
2. Export a `MiddlewareHandler<AppEnv>` function
3. Apply in `src/index.ts` via `app.use("*", middleware)` or on specific routes

---

## Gotchas

1. **Workers are stateless** — the in-memory rate limit store resets on each cold start. This is acceptable for a starter but won't work at scale.
2. **HTMX partial vs full page** — forgetting to check `HX-Request` header means HTMX gets a full HTML document instead of a fragment, breaking swap.
3. **JSX auto-escaping** — Hono's JSX escapes interpolated values by default. Use `raw()` sparingly and only for trusted content.
4. **D1 is SQLite** — no native UUID type, no JSONB, no concurrent writes. Design accordingly.
5. **Email binding requires setup** — `EMAIL` binding only works with Cloudflare Email Routing configured. Tests mock it via the Cloudflare test pool.
6. **Dev mode detection** — `isDevelopment()` checks hostname OR `DEV_LOGIN_LINKS` env var. Magic links display inline in dev instead of sending email.
