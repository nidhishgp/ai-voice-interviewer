import { z } from "zod";

// Question

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(1000),
  order: z.number().int().nonnegative(),
  follow_up_prompt: z.string().max(500).nullable(),
});

export type Question = z.infer<typeof QuestionSchema>;

// SessiontTemplate

export const SessionTemplateSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  questions: z.array(QuestionSchema).min(1).max(20),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type SessionTemplate = z.infer<typeof SessionTemplateSchema>;

// CandidateSession

export const TranscriptEntrySchema = z.object({
  id: z.string().uuid(),
  speaker: z.enum(["agent", "candidate"]),
  text: z.string().min(1),
  timestamp_ms: z.number().int().nonnegative(),
});

export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;

export const EvaluationSchema = z.object({
  overall_score: z.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  per_question_feedback: z.array(
    z.object({
      question_id: z.string().uuid(),
      score: z.number().min(0).max(10),
      feedback: z.string(),
    })
  ),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;

export const CandidateSessionSchema = z.object({
  id: z.string().uuid(),
  template_id: z.string().uuid(),
  candidate_name: z.string().min(1).max(200),
  candidate_email: z.string().email().nullable(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  transcript: z.array(TranscriptEntrySchema),
  evaluation: EvaluationSchema.nullable(),
  share_token: z.string().uuid(),
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type CandidateSession = z.infer<typeof CandidateSessionSchema>;
