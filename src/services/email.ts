import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export async function sendMagicLinkEmail(env: Cloudflare.Env, recipient: string, link: string) {
  const appName = env.APP_NAME || "Hono D1 Starter";
  const sender = env.FROM_EMAIL;

  const msg = createMimeMessage();
  msg.setSender({ name: appName, addr: sender });
  msg.setRecipient(recipient);
  msg.setSubject(`Sign in to ${appName}`);
  msg.addMessage({
    contentType: "text/plain",
    data: [
      `Sign in to ${appName}`,
      "",
      "Use this magic link to finish signing in:",
      link,
      "",
      "This link expires soon. If you did not ask for it, you can ignore this email."
    ].join("\n")
  });
  msg.addMessage({
    contentType: "text/html",
    data: renderEmailHtml(appName, link)
  });

  await env.EMAIL.send(new EmailMessage(sender, recipient, msg.asRaw()));
}

function renderEmailHtml(appName: string, link: string) {
  const safeAppName = escapeHtml(appName);
  const safeLink = escapeHtml(link);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px;background:#f7f4ec;color:#1e2421;font-family:Georgia,serif;">
    <main style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d9d2c2;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:28px;">Sign in to ${safeAppName}</h1>
      <p style="font-size:16px;line-height:1.5;">Use this magic link to finish signing in.</p>
      <p style="margin:28px 0;">
        <a href="${safeLink}" style="display:inline-block;background:#1e2421;color:#ffffff;padding:14px 18px;text-decoration:none;font-weight:700;">Open magic link</a>
      </p>
      <p style="font-size:14px;line-height:1.5;color:#5b625e;">This link expires soon. If you did not ask for it, you can ignore this email.</p>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
