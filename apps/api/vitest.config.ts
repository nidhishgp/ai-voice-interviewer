import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    env: {
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SERVICE_ROLE_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
      INTERNAL_SECRET: "a".repeat(32),
      CORS_ORIGIN: "http://localhost:3000",
      LIVEKIT_URL: "ws://localhost:7880",
      LIVEKIT_API_KEY: "test-api-key",
      LIVEKIT_API_SECRET: "test-api-secret",
    },
  },
});
