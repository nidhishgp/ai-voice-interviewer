import { timingSafeEqual } from "node:crypto";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { TranscriptEntrySchema } from "@aivi/types";

import { createSupabaseClient } from "../lib/supabase";
import { completeSession, appendTranscript } from "../services/sessions.service";
import { env } from "../env";

const SessionParams = z.object({
  id: z.string().uuid(),
});

const TranscriptBody = z.object({
  entries: z.array(TranscriptEntrySchema).min(1),
});

async function verifyInternalSecret(request: FastifyRequest, reply: FastifyReply) {
  const provided = request.headers["x-internal-secret"];
  const expected = env.INTERNAL_SECRET;

  if (typeof provided !== "string") {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export default async function internalPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const supabase = createSupabaseClient();

  app.addHook("preHandler", verifyInternalSecret);

  app.post(
    "/sessions/:id/complete",
    { schema: { params: SessionParams } },
    async (request, reply) => {
      await completeSession(supabase, request.params.id);
      return reply.status(204).send();
    }
  );

  app.post(
    "/sessions/:id/transcript",
    { schema: { params: SessionParams, body: TranscriptBody } },
    async (request, reply) => {
      await appendTranscript(supabase, request.params.id, request.body.entries);
      return reply.status(204).send();
    }
  );
}
