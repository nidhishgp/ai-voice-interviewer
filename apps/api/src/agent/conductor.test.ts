import { describe, it, expect } from "vitest";

import { hasReachedFollowUpLimit, hasNextQuestion, markQuestionComplete } from "./conductor";
import { makeTemplate, makeState } from "./test-utils/fixtures";

describe("hasReachedFollowUpLimit", () => {
  it("returns true when followUpCount reaches followUpDepth limit", () => {
    const template = makeTemplate({ follow_up_depth: "light" });
    const state = makeState({ followUpCounts: { 0: 1 } });
    expect(hasReachedFollowUpLimit(state, template)).toBe(true);
  });

  it("returns false on first encounter with a question", () => {
    const template = makeTemplate({ follow_up_depth: "light" });
    const state = makeState();
    expect(hasReachedFollowUpLimit(state, template)).toBe(false);
  });
});

describe("hasNextQuestion", () => {
  it("returns true when the current index is before the last question", () => {
    const template = makeTemplate(); // 2 questions, indices 0 and 1
    const state = makeState({ currentQuestionIndex: 0 });
    expect(hasNextQuestion(state, template)).toBe(true);
  });

  it("returns false at the last question", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 1 });
    expect(hasNextQuestion(state, template)).toBe(false);
  });
});

describe("markQuestionComplete", () => {
  it("increments currentQuestionIndex", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 0 });
    const next = markQuestionComplete(state, template);
    expect(next.currentQuestionIndex).toBe(1);
  });

  it("throws when already at the last question", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 1 });
    expect(() => markQuestionComplete(state, template)).toThrow();
  });
});
