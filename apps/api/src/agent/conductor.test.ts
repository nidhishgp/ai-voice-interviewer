import { describe, it, expect } from "vitest";

import {
  getFollowUpStatus,
  getCurrentQuestion,
  getFollowUpGuidance,
  hasNextQuestion,
  markQuestionComplete,
} from "./conductor";
import { makeTemplate, makeState } from "./test-utils/fixtures";

describe("getFollowUpStatus", () => {
  it("returns count, limit, and reached together", () => {
    const template = makeTemplate({ follow_up_depth: "deep" });
    const state = makeState({ followUpCounts: { 0: 2 } });
    expect(getFollowUpStatus(state, template)).toEqual({ count: 2, limit: 3, reached: false });
  });

  it("reached is true when followUpCount reaches followUpDepth limit", () => {
    const template = makeTemplate({ follow_up_depth: "light" });
    const state = makeState({ followUpCounts: { 0: 1 } });
    expect(getFollowUpStatus(state, template).reached).toBe(true);
  });

  it("reached is false on first encounter with a question", () => {
    const template = makeTemplate({ follow_up_depth: "light" });
    const state = makeState();
    expect(getFollowUpStatus(state, template).reached).toBe(false);
  });

  it("throws if the template's follow_up_depth isn't a known value", () => {
    const template = makeTemplate({ follow_up_depth: "invalid" as never });
    const state = makeState();
    expect(() => getFollowUpStatus(state, template)).toThrow();
  });
});

describe("getCurrentQuestion", () => {
  it("returns the question at the current index", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 1 });
    expect(getCurrentQuestion(state, template).text).toBe("How would you design a rate limiter?");
  });

  it("throws when the index is out of range", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 5 });
    expect(() => getCurrentQuestion(state, template)).toThrow();
  });
});

describe("getFollowUpGuidance", () => {
  it("returns kind: exhausted with no extra fields when the budget is reached", () => {
    const template = makeTemplate({ follow_up_depth: "light" });
    const state = makeState({ followUpCounts: { 0: 1 } });
    expect(getFollowUpGuidance(state, template)).toEqual({ kind: "exhausted" });
  });

  it("returns kind: available with the count and limit when budget remains", () => {
    const template = makeTemplate({ follow_up_depth: "deep" });
    const state = makeState({ followUpCounts: { 0: 2 } });
    expect(getFollowUpGuidance(state, template)).toEqual({
      kind: "available",
      followUpCount: 2,
      followUpLimit: 3,
    });
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
