/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { env } from "cloudflare:workers";
import { applyD1Migrations, reset, type D1Migration } from "cloudflare:test";
import { beforeEach } from "vitest";

type TestEnv = Cloudflare.Env & {
  TEST_MIGRATIONS: D1Migration[];
};

beforeEach(async () => {
  await reset();
  const testEnv = env as TestEnv;
  await applyD1Migrations(testEnv.DB, testEnv.TEST_MIGRATIONS);
});
