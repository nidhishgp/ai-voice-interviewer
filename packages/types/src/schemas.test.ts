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
      id: "123e4567-e89b-12d3-a456-426614174000",
      text: "Tell me about yourself",
      order: 0,
      follow_up_prompt: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty text", () => {
    const result = QuestionSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      text: "",
      order: 0,
      follow_up_prompt: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("SessionTemplateSchema", () => {
  const validQuestion = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    text: "Tell me about yourself",
    order: 0,
    follow_up_prompt: null,
  };

  it("accepts a valid template", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      owner_id: "323e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: [validQuestion],
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty questions array", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      owner_id: "323e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: [],
      created_at: "2026-06-23T00:00:00.000Z",
      updated_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects questions array longer than 20", () => {
    const result = SessionTemplateSchema.safeParse({
      id: "223e4567-e89b-12d3-a456-426614174000",
      owner_id: "323e4567-e89b-12d3-a456-426614174000",
      title: "Frontend Engineer Interview",
      description: null,
      questions: Array.from({ length: 21 }, (_, i) => ({ ...validQuestion, order: i })),
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
      candidate_name: "Jane Doe",
      candidate_email: null,
      status: "pending",
      transcript: [],
      evaluation: null,
      share_token: "323e4567-e89b-12d3-a456-426614174000",
      started_at: null,
      completed_at: null,
      created_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid session with null evaluation", () => {
    const result = CandidateSessionSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      template_id: "223e4567-e89b-12d3-a456-426614174000",
      candidate_name: "Jane Doe",
      candidate_email: null,
      status: "scheduled",
      transcript: [],
      evaluation: null,
      share_token: "323e4567-e89b-12d3-a456-426614174000",
      started_at: null,
      completed_at: null,
      created_at: "2026-06-23T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});

describe("EvaluationSchema", () => {
  it("validates perQuestionFeedback shape", () => {
    const result = EvaluationSchema.safeParse({
      overall_score: 85,
      summary: "Strong candidate with good communication skills",
      strengths: ["Clear communication", "Strong problem solving"],
      improvements: ["Could improve system design depth"],
      per_question_feedback: [
        {
          question_id: "123e4567-e89b-12d3-a456-426614174000",
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
          question_id: "not-a-uuid",
          score: 8,
          feedback: "Good answer",
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("TranscriptEntrySchema", () => {
  it("accepts valid agent speaker", () => {
    const result = TranscriptEntrySchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      speaker: "agent",
      text: "Tell me about yourself",
      timestamp_ms: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid speaker enum", () => {
    const result = TranscriptEntrySchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      speaker: "interviewer",
      text: "Tell me about yourself",
      timestamp_ms: 0,
    });
    expect(result.success).toBe(false);
  });
});
