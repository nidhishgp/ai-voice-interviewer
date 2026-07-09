// Session status

export const SESSION_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  EVALUATED: "evaluated",
  EXPIRED: "expired",
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
  GEMINI: "gemini",
  OLLAMA: "ollama",
} as const;

// Follow-up depth

export const FOLLOW_UP_DEPTH = {
  NONE: "none",
  LIGHT: "light",
  DEEP: "deep",
} as const;

export const FOLLOW_UP_DEPTH_VALUES = [
  FOLLOW_UP_DEPTH.NONE,
  FOLLOW_UP_DEPTH.LIGHT,
  FOLLOW_UP_DEPTH.DEEP,
] as const;
