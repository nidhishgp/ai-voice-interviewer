import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider";
import type { LanguageModel } from "ai";
import { LLM_PROVIDER } from "@aivi/types";

export function getLLMModel(model?: string): LanguageModel {
  const provider = process.env["LLM_PROVIDER"];

  switch (provider) {
    case LLM_PROVIDER.ANTHROPIC: {
      const apiKey = process.env["ANTHROPIC_API_KEY"];
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic");
      return createAnthropic({ apiKey })(model ?? "claude-haiku-4-5");
    }
    case LLM_PROVIDER.OPENAI: {
      const apiKey = process.env["OPENAI_API_KEY"];
      if (!apiKey) throw new Error("OPENAI_API_KEY is required when LLM_PROVIDER=openai");
      return createOpenAI({ apiKey })(model ?? "gpt-4o-mini");
    }
    case LLM_PROVIDER.GEMINI: {
      const apiKey = process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
      if (!apiKey)
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required when LLM_PROVIDER=gemini");
      return createGoogleGenerativeAI({ apiKey })(model ?? "gemini-2.0-flash");
    }
    case LLM_PROVIDER.OLLAMA: {
      const baseURL = process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";
      // ollama-ai-provider types lag behind AI SDK v7 — safe at runtime
      return createOllama({ baseURL })(model ?? "gemma3:4b") as unknown as LanguageModel;
    }
    default:
      throw new Error(
        `Unknown LLM_PROVIDER: "${provider}". Must be one of: anthropic, openai, gemini, ollama`
      );
  }
}
