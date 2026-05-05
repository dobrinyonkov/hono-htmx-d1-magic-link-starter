import { Hono } from "hono";
import { csrf } from "./middleware/csrf";
import { securityHeaders } from "./middleware/security";
import authRoutes from "./routes/auth";
import healthRoutes from "./routes/health";
import type { AppEnv } from "./types";
import { layout } from "./views/layout";
import { loginPage, loginResult } from "./views/login";

const app = new Hono<AppEnv>();

app.use("*", securityHeaders);
app.use("*", csrf);

app.route("/", authRoutes);
app.route("/", healthRoutes);

app.notFound((c) =>
  c.html(
    layout({
      children: loginPage(loginResult({ kind: "error", message: "That route does not exist yet." }))
    }),
    404
  )
);

app.onError((error, c) => {
  console.error("unhandled_error", { error: error instanceof Error ? error.message : String(error) });
  return c.html(
    layout({
      children: loginPage(loginResult({ kind: "error", message: "Something went wrong." }))
    }),
    500
  );
});

export default app;
