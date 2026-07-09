import { describe, it, expect } from "vitest";

import {
  getFollowUpStatus,
  hasReachedFollowUpLimit,
  hasNextQuestion,
  markQuestionComplete,
} from "./conductor";
import { makeTemplate, makeState } from "./test-utils/fixtures";

describe("getFollowUpStatus", () => {
  it("returns count, limit, and reached together, derived from the same lookup hasReachedFollowUpLimit uses", () => {
    const template = makeTemplate({ follow_up_depth: "deep" });
    const state = makeState({ followUpCounts: { 0: 2 } });
    expect(getFollowUpStatus(state, template)).toEqual({ count: 2, limit: 3, reached: false });
  });

  it("throws if the template's follow_up_depth isn't a known value", () => {
    const template = makeTemplate({ follow_up_depth: "invalid" as never });
    const state = makeState();
    expect(() => getFollowUpStatus(state, template)).toThrow();
  });
});

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
