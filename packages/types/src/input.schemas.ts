import { z } from "zod";

import { FOLLOW_UP_DEPTH_VALUES } from "./constants";
import { QuestionSchema } from "./entity.schemas";

// Template input schemas

export const CreateTemplateInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  candidate_instructions: z.string().nullable().optional(),
  system_prompt: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).min(1).max(20),
  follow_up_depth: z.enum(FOLLOW_UP_DEPTH_VALUES).optional(),
});

export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;

export const UpdateTemplateInputSchema = CreateTemplateInputSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;

// Session input schemas

export const StartSessionInputSchema = z.object({
  candidateName: z.string().min(1).max(200),
  candidateEmail: z.email(),
});

export type StartSessionInput = z.infer<typeof StartSessionInputSchema>;
