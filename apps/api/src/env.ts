import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  INTERNAL_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url(),
});

export const env = schema.parse(process.env);
