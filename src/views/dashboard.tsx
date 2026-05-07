import type { HtmlEscapedString } from "hono/utils/html";
import type { User } from "../db/schema";

export function dashboardPage(user: User): HtmlEscapedString {
  return (
    <div x-data="{ activeTab: 'account' }" style="display: contents;">
      <nav class="sidebar">
        <button
          class="sidebar-item"
          x-bind:class="activeTab === 'account' ? 'active' : ''"
          x-on:click="activeTab = 'account'"
        >
          Account
        </button>
        <button
          class="sidebar-item"
          x-bind:class="activeTab === 'security' ? 'active' : ''"
          x-on:click="activeTab = 'security'"
        >
          Security
        </button>
      </nav>

      <div class="main">
        <section class="tab-content" x-show="activeTab === 'account'" x-cloak>
          <h2>Account</h2>
          <p>Your account details.</p>

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
        </section>

        <section class="tab-content" x-show="activeTab === 'security'" x-cloak>
          <h2>Security</h2>
          <p>How this starter keeps sessions safe.</p>
          <ul>
            <li>Session cookie is HTTP-only and backed by D1.</li>
            <li>Magic link tokens are hashed before they touch the database.</li>
            <li>Production email uses the Cloudflare Email binding.</li>
          </ul>
        </section>
      </div>
    </div>
  ) as HtmlEscapedString;
}
