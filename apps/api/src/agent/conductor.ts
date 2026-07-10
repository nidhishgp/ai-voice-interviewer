import type { Question, SessionTemplate } from "@aivi/types";

import { FOLLOW_UP_DEPTH_LIMIT } from "./constants";

export type ConductorState = {
  currentQuestionIndex: number;
  followUpCounts: Record<number, number>;
};

export type FollowUpStatus = {
  count: number;
  limit: number;
  reached: boolean;
};

export function getFollowUpStatus(state: ConductorState, template: SessionTemplate): FollowUpStatus {
  const count = state.followUpCounts[state.currentQuestionIndex] ?? 0;
  const limit: number | undefined = FOLLOW_UP_DEPTH_LIMIT[template.follow_up_depth];
  if (limit === undefined) {
    throw new Error(`Unknown follow_up_depth value on template: ${template.follow_up_depth}`);
  }
  return { count, limit, reached: count >= limit };
}

export function hasNextQuestion(state: ConductorState, template: SessionTemplate): boolean {
  return state.currentQuestionIndex < template.questions.length - 1;
}

export function markQuestionComplete(
  state: ConductorState,
  template: SessionTemplate
): ConductorState {
  if (!hasNextQuestion(state, template)) {
    throw new Error("Cannot mark question complete — already at the last question.");
  }

  return {
    currentQuestionIndex: state.currentQuestionIndex + 1,
    followUpCounts: { ...state.followUpCounts },
  };
}

export function getCurrentQuestion(state: ConductorState, template: SessionTemplate): Question {
  const question = template.questions[state.currentQuestionIndex];
  if (!question) {
    throw new Error(
      `No question at index ${state.currentQuestionIndex} — interview may already be complete.`
    );
  }
  return question;
}

export type FollowUpGuidance =
  | { kind: "exhausted" }
  | { kind: "available"; followUpCount: number; followUpLimit: number };

export function getFollowUpGuidance(
  state: ConductorState,
  template: SessionTemplate
): FollowUpGuidance {
  const { count, limit, reached } = getFollowUpStatus(state, template);
  return reached
    ? { kind: "exhausted" }
    : { kind: "available", followUpCount: count, followUpLimit: limit };
}
