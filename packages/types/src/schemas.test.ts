import { describe, it, expect } from "vitest";

import {
  QuestionSchema,
  SessionTemplateSchema,
  CandidateSessionSchema,
  EvaluationSchema,
  TranscriptEntrySchema,
} from "./schemas";

describe("QuestionSchema", () => {
  it("accepts a valid question", () => {
    const result = QuestionSchema.safeParse({
      id: 1,
      text: "Tell me about yourself",
      duration_seconds: 120,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a question without duration_seconds", () => {
    const result = QuestionSchema.safeParse({
      id: 0,
      text: "Tell me about yourself",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty text", () => {
    const result = QuestionSchema.safeParse({ id: 1, text: "" });
    expect(result.success).toBe(false);
  });
});

describe("SessionTemplateSchema", () => {
  const validQuestion = { id: 1, text: "Tell me about yourself.", duration_seconds: 120 };

  it("accepts a valid template", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      creator_id: "323e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: [validQuestion],
      is_active: true,
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty questions array", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      creator_id: "323e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: [],
      is_active: true,
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing creator_id", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: [],
      is_active: true,
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("CandidateSessionSchema", () => {
  it("rejects invalid status enum", () => {
    const result = CandidateSessionSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      template_id: "223e4567-e89b-12d3-a456-426614174000",
      share_token: "323e4567-e89b-12d3-a456-426614174000",
      candidate_name: "Jane Doe",
      candidate_email: null,
      status: "scheduled",
      transcript: [],
      evaluation: null,
      started_at: null,
      completed_at: null,
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid session with pending status", () => {
    const result = CandidateSessionSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      template_id: "223e4567-e89b-12d3-a456-426614174000",
      share_token: "323e4567-e89b-12d3-a456-426614174000",
      candidate_name: "Jane Doe",
      candidate_email: null,
      status: "pending",
      transcript: [],
      evaluation: null,
      started_at: null,
      completed_at: null,
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});

describe("EvaluationSchema", () => {
  it("validates per_question_feedback shape", () => {
    const result = EvaluationSchema.safeParse({
      overall_score: 85,
      summary: "Strong candidate with good communication skills",
      strengths: ["Clear communication", "Strong problem solving"],
      improvements: ["Could improve system design depth"],
      per_question_feedback: [
        {
          question_id: 1,
          score: 8,
          feedback: "Answered clearly with good examples",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid per_question_feedback shape", () => {
    const result = EvaluationSchema.safeParse({
      overall_score: 85,
      summary: "Strong candidate",
      strengths: [],
      improvements: [],
      per_question_feedback: [
        {
          question_id: "not-a-number",
          score: 8,
          feedback: "Good answer",
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("TranscriptEntrySchema", () => {
  it("accepts valid ai role", () => {
    const result = TranscriptEntrySchema.safeParse({
      role: "ai",
      text: "Tell me about yourself",
      timestamp: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid role enum", () => {
    const result = TranscriptEntrySchema.safeParse({
      role: "interviewer",
      text: "Tell me about yourself",
      timestamp: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
