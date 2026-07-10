import type { SessionTemplate, CandidateSession } from "@aivi/types";

import type { ConductorState } from "../conductor";

export function makeTemplate(overrides: Partial<SessionTemplate> = {}): SessionTemplate {
  return {
    id: "template-1",
    creator_id: "creator-1",
    title: "Backend Engineer Interview",
    description: "Focus on distributed systems experience.",
    candidate_instructions: null,
    system_prompt: "Be encouraging but rigorous.",
    questions: [
      { id: 1, text: "Tell me about a production incident you debugged." },
      { id: 2, text: "How would you design a rate limiter?" },
    ],
    follow_up_depth: "light",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeState(overrides: Partial<ConductorState> = {}): ConductorState {
  return {
    currentQuestionIndex: 0,
    followUpCounts: {},
    ...overrides,
  };
}

export function makeSession(overrides: Partial<CandidateSession> = {}): CandidateSession {
  return {
    id: "session-1",
    template_id: "template-1",
    share_token: "00000000-0000-0000-0000-000000000000",
    candidate_name: "Jordan Rivera",
    candidate_email: "jordan@example.com",
    status: "completed",
    transcript: [
      {
        role: "ai",
        text: "Tell me about a production incident you debugged.",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
      {
        role: "candidate",
        text: "Sure — we had a database connection leak...",
        timestamp: "2026-01-01T00:01:00.000Z",
      },
    ],
    evaluation: null,
    started_at: "2026-01-01T00:00:00.000Z",
    completed_at: "2026-01-01T00:10:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:10:00.000Z",
    ...overrides,
  };
}
