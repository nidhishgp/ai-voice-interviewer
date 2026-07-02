import Fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { env } from "./env";
import templatesPlugin from "./routes/templates";
import joinPlugin from "./routes/join";
import sessionsPlugin from "./routes/sessions";
import internalPlugin from "./routes/internal";

export async function createApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "test" ? "silent" : "info",
      redact: {
        paths: ["req.headers.authorization", "SUPABASE_SERVICE_ROLE_KEY", "INTERNAL_SECRET"],
        censor: "[Redacted]",
      },
    },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(sensible);
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });
  if (env.NODE_ENV !== "test") {
    await app.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });
  }

  app.get("/health", async () => {
    return { status: "ok" };
  });

  await app.register(templatesPlugin);
  await app.register(joinPlugin);
  await app.register(sessionsPlugin);
  await app.register(internalPlugin, { prefix: "/internal" });

  return app;
}
