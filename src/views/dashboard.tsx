import type { HtmlEscapedString } from "hono/utils/html";
import type { User } from "../db/schema";

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
