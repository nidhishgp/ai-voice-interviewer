import { z } from "zod";

// Question

export const QuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  text: z.string().min(1).max(1000),
  duration_seconds: z.number().int().positive().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// SessionTemplate

export const SessionTemplateSchema = z.object({
  id: z.uuid(),
  creator_id: z.uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  questions: z.array(QuestionSchema).min(1).max(20),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type SessionTemplate = z.infer<typeof SessionTemplateSchema>;

// TranscriptEntry

export const TranscriptEntrySchema = z.object({
  role: z.enum(["ai", "candidate"]),
  text: z.string().min(1),
  timestamp: z.iso.datetime(),
});

export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;

// Evaluation

export const EvaluationSchema = z.object({
  overall_score: z.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  per_question_feedback: z.array(
    z.object({
      question_id: z.number().int().nonnegative(),
      score: z.number().min(0).max(10),
      feedback: z.string(),
    })
  ),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;

// CandidateSession

export const CandidateSessionSchema = z.object({
  id: z.uuid(),
  template_id: z.uuid(),
  share_token: z.uuid(),
  candidate_name: z.string().min(1).max(200).nullable(),
  candidate_email: z.email().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "evaluated", "expired"]),
  transcript: z.array(TranscriptEntrySchema),
  evaluation: EvaluationSchema.nullable(),
  started_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type CandidateSession = z.infer<typeof CandidateSessionSchema>;
