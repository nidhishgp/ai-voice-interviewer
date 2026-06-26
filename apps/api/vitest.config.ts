import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
      INTERNAL_SECRET: "a".repeat(32),
      CORS_ORIGIN: "http://localhost:3000",
    },
  },
});
