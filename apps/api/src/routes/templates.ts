import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { QuestionSchema } from "@aivi/types";

import { authMiddleware } from "../middleware/auth";
import { createSupabaseClient } from "../lib/supabase";
import {
  listTemplates,
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  listSessionsForTemplate,
} from "../services/templates.service";

const CreateTemplateBody = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  candidate_instructions: z.string().nullable().optional(),
  system_prompt: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).optional(),
});

const UpdateTemplateBody = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  candidate_instructions: z.string().nullable().optional(),
  system_prompt: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).optional(),
  is_active: z.boolean().optional(),
});

const TemplateParams = z.object({ id: z.string().uuid() });

export default async function templatesPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const supabase = createSupabaseClient();

  app.addHook("preHandler", authMiddleware);

  app.get("/templates", async (request) => {
    const templates = await listTemplates(supabase, request.user.id);
    return { data: templates };
  });

  app.post("/templates", { schema: { body: CreateTemplateBody } }, async (request, reply) => {
    const template = await createTemplate(supabase, {
      ...request.body,
      creator_id: request.user.id,
    });
    return reply.status(201).send({ data: template });
  });

  app.get("/templates/:id", { schema: { params: TemplateParams } }, async (request, reply) => {
    const template = await getTemplate(supabase, request.params.id, request.user.id);
    if (!template) return reply.status(404).send({ error: "Template not found" });
    return { data: template };
  });

  app.patch(
    "/templates/:id",
    { schema: { params: TemplateParams, body: UpdateTemplateBody } },
    async (request, reply) => {
      const template = await updateTemplate(
        supabase,
        request.params.id,
        request.body,
        request.user.id
      );
      if (!template) return reply.status(404).send({ error: "Template not found" });
      return { data: template };
    }
  );

  app.delete("/templates/:id", { schema: { params: TemplateParams } }, async (request, reply) => {
    const deleted = await deleteTemplate(supabase, request.params.id, request.user.id);
    if (!deleted) return reply.status(404).send({ error: "Template not found" });
    return reply.status(204).send();
  });

  app.get(
    "/templates/:id/sessions",
    { schema: { params: TemplateParams } },
    async (request, reply) => {
      const sessions = await listSessionsForTemplate(supabase, request.params.id, request.user.id);
      if (sessions === null) return reply.status(404).send({ error: "Template not found" });
      return { data: sessions };
    }
  );
}
