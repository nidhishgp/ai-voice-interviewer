import type { SessionTemplate } from "@aivi/types";

import { FOLLOW_UP_DEPTH_LIMIT } from "./constants";

export type ConductorState = {
  currentQuestionIndex: number;
  followUpCounts: Record<number, number>;
};

export function hasReachedFollowUpLimit(state: ConductorState, template: SessionTemplate): boolean {
  const followUpCount = state.followUpCounts[state.currentQuestionIndex] ?? 0;
  const limit = FOLLOW_UP_DEPTH_LIMIT[template.follow_up_depth];
  return followUpCount >= limit;
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
