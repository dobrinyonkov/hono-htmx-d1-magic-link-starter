# Hono + htmx + Alpine + Drizzle + D1 Starter

A small Cloudflare Worker starter with Hono routes, server-rendered HTML, htmx form swaps, Alpine.js UI state, Drizzle schema, D1 persistence, and Cloudflare Email magic links.

## Quick Start

```bash
npm install
npm run cf-typegen
npm run db:generate
npm run db:migrate:local
npm run dev
```

Open the local Wrangler URL. In development, submitting the login form renders a clickable magic link directly in the UI instead of sending email.

## Login Flow

- `/login` creates a single-use magic link token.
- The raw token is sent by email in production and shown in the UI during local development.
- Only the SHA-256 token hash is stored in D1.
- `/auth/verify` consumes the token, upserts the user, creates a D1-backed session, and sets an HTTP-only cookie.
- `/logout` deletes the session and clears the cookie.

## Cloudflare Setup

For production email, enable Cloudflare Email Routing for your domain, then set `FROM_EMAIL` in `wrangler.jsonc` to an address on that domain. The starter uses this binding:

```jsonc
"send_email": [
  {
    "name": "EMAIL"
  }
]
```

For a production D1 database, create one and paste the returned `database_id` into `wrangler.jsonc`:

```bash
npx wrangler d1 create hono_htmx_starter
npm run db:migrate:remote
npm run deploy
```

## Drizzle

Schema lives in `src/db/schema.ts`.

```bash
npm run db:generate        # create SQL migrations from Drizzle schema
npm run db:migrate:local   # apply migrations to local D1
npm run db:migrate:remote  # apply migrations to remote D1
```

## Environment Values

`wrangler.jsonc` contains non-secret defaults:

- `APP_NAME`
- `FROM_EMAIL`
- `MAGIC_LINK_TTL_MINUTES`
- `SESSION_TTL_DAYS`
- `DEV_LOGIN_LINKS`

Copy `.dev.vars.example` to `.dev.vars` if you want local overrides.
