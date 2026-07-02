import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../middleware/auth";
import { createSupabaseClient } from "../lib/supabase";
import { getSession } from "../services/sessions.service";

const SessionParams = z.object({
  id: z.string().uuid(),
});

export default async function sessionsPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const supabase = createSupabaseClient();

  app.addHook("preHandler", authMiddleware);

  app.get("/sessions/:id", { schema: { params: SessionParams } }, async (request, reply) => {
    const session = await getSession(supabase, request.params.id, request.user.id);
    if (!session) return reply.status(404).send({ error: "Session not found" });
    return { data: session };
  });
}
