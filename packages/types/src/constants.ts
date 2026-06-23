// Session status

export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// LiveKit / WebRTC events

export const LIVEKIT_EVENTS = {
  INTERVIEW_START: "interview.start",
  INTERVIEW_END: "interview.end",
  QUESTION_NEXT: "question.next",
  TRANSCRIPT_UPDATE: "transcript.update",
  EVALUATION_READY: "evaluation.ready",
} as const;

// Internal API routes

export const ROUTES = {
  API_SESSION_JOIN: "/api/sessions/[id]/join",
  API_SESSION_END: "/api/sessions/[id]/end",
  API_LIVEKIT_TOKEN: "/api/livekit/token",
  API_AGENT_WEBHOOK: "/api/agent/webhook",
} as const;

// LLM providers

export const LLM_PROVIDER = {
  ANTHROPIC: "anthropic",
  OPENAI: "openai",
  OLLAMA: "ollama",
} as const;
