import { describe, it, expect } from "vitest";

import { buildSystemPrompt, buildConductorPrompt, buildEvaluatorPrompt } from "./prompts";
import { makeTemplate, makeState, makeSession } from "./test-utils/fixtures";

describe("buildSystemPrompt", () => {
  it("includes roleContext and customInstructions", () => {
    const template = makeTemplate({
      description: "Focus on distributed systems experience.",
      system_prompt: "Be encouraging but rigorous.",
    });

    const prompt = buildSystemPrompt(template);

    expect(prompt).toContain("Focus on distributed systems experience.");
    expect(prompt).toContain("Be encouraging but rigorous.");
  });
});

describe("buildConductorPrompt", () => {
  it("includes current question text and followUpCount", () => {
    const template = makeTemplate({ follow_up_depth: "deep" });
    const state = makeState({ currentQuestionIndex: 0, followUpCounts: { 0: 2 } });

    const prompt = buildConductorPrompt(state, template);

    expect(prompt).toContain("Tell me about a production incident you debugged.");
    expect(prompt).toContain("2 of up to 3");
  });

  it("does not include questions beyond the current one", () => {
    const template = makeTemplate();
    const state = makeState({ currentQuestionIndex: 0 });

    const prompt = buildConductorPrompt(state, template);

    expect(prompt).not.toContain("How would you design a rate limiter?");
  });

  it("does not invite another follow-up once the budget is exhausted", () => {
    const template = makeTemplate({ follow_up_depth: "light" }); // limit 1
    const state = makeState({ currentQuestionIndex: 0, followUpCounts: { 0: 1 } });

    const prompt = buildConductorPrompt(state, template);

    expect(prompt).not.toContain("you may ask one brief");
    expect(prompt).toContain("move on immediately");
  });
});

describe("buildEvaluatorPrompt", () => {
  it("includes full transcript and all question texts", () => {
    const template = makeTemplate();
    const session = makeSession();

    const result = buildEvaluatorPrompt(session, template);
    const fullText = result.system + result.messages.map((m) => m.content).join("\n");

    expect(fullText).toContain("Tell me about a production incident you debugged.");
    expect(fullText).toContain("How would you design a rate limiter?");
    expect(fullText).toContain("Sure — we had a database connection leak...");
  });

  it("returns a structured { system, messages } shape with the transcript isolated in a user-role message", () => {
    const template = makeTemplate();
    const session = makeSession();

    const result = buildEvaluatorPrompt(session, template);
    const [message] = result.messages;
    if (!message) throw new Error("expected exactly one message");

    expect(typeof result.system).toBe("string");
    expect(result.messages).toHaveLength(1);
    expect(message.role).toBe("user");
    expect(message.content).toContain("Sure — we had a database connection leak...");
    expect(result.system).not.toContain("Sure — we had a database connection leak...");
  });
});
