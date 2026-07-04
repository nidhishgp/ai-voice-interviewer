import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { StartSessionInputSchema } from "@aivi/types";

import { createSupabaseClient } from "../lib/supabase";
import { getJoinMetadata, startSession } from "../services/sessions.service";

const ShareTokenParams = z.object({
  shareToken: z.string().uuid(),
});

export default async function joinPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const supabase = createSupabaseClient();

  app.get("/join/:shareToken", { schema: { params: ShareTokenParams } }, async (request, reply) => {
    const metadata = await getJoinMetadata(supabase, request.params.shareToken);
    if (!metadata) return reply.status(404).send({ error: "Interview not found" });
    return { data: metadata };
  });

  app.post(
    "/join/:shareToken/start",
    { schema: { params: ShareTokenParams, body: StartSessionInputSchema } },
    async (request, reply) => {
      try {
        const result = await startSession(supabase, request.params.shareToken, {
          candidateName: request.body.candidateName,
          candidateEmail: request.body.candidateEmail,
        });
        return reply.status(201).send({ data: result });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        if (message === "SESSION_NOT_FOUND")
          return reply.status(404).send({ error: "Interview not found" });
        if (message === "SESSION_ALREADY_STARTED")
          return reply.status(409).send({ error: "Session already started" });
        throw err;
      }
    }
  );
}
