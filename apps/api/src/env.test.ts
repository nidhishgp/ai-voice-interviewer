import { describe, it, expect } from "vitest";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  INTERNAL_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url(),
});

const validEnv = {
  SUPABASE_URL: "http://localhost:54321",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  INTERNAL_SECRET: "a".repeat(32),
  CORS_ORIGIN: "http://localhost:3000",
};

describe("env schema", () => {
  it("throws with missing SUPABASE_URL", () => {
    const rest = { ...validEnv, SUPABASE_URL: undefined };
    expect(() => schema.parse(rest)).toThrow();
  });

  it("throws with missing INTERNAL_SECRET", () => {
    const rest = { ...validEnv, INTERNAL_SECRET: undefined };
    expect(() => schema.parse(rest)).toThrow();
  });
});
