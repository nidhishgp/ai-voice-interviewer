import { describe, it, expect, beforeEach, vi } from "vitest";

import { getLLMModel } from "./llm";
import { createSTTProvider, createTTSProvider } from "./factory";

describe("getLLMModel", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns anthropic provider when LLM_PROVIDER=anthropic", () => {
    vi.stubEnv("LLM_PROVIDER", "anthropic");
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    const model = getLLMModel();
    expect(model).toBeDefined();
  });

  it("returns openai provider when LLM_PROVIDER=openai", () => {
    vi.stubEnv("LLM_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const model = getLLMModel();
    expect(model).toBeDefined();
  });

  it("returns google provider when LLM_PROVIDER=gemini", () => {
    vi.stubEnv("LLM_PROVIDER", "gemini");
    vi.stubEnv("GOOGLE_GENERATIVE_AI_API_KEY", "test-key");
    const model = getLLMModel();
    expect(model).toBeDefined();
  });

  it("returns ollama provider when LLM_PROVIDER=ollama", () => {
    vi.stubEnv("LLM_PROVIDER", "ollama");
    const model = getLLMModel();
    expect(model).toBeDefined();
  });

  it("throws on unknown LLM_PROVIDER value", () => {
    vi.stubEnv("LLM_PROVIDER", "unknown-provider");
    expect(() => getLLMModel()).toThrow('Unknown LLM_PROVIDER: "unknown-provider"');
  });
});

describe("createSTTProvider", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns DeepgramSTTProvider when STT_PROVIDER=deepgram", () => {
    vi.stubEnv("STT_PROVIDER", "deepgram");
    vi.stubEnv("DEEPGRAM_API_KEY", "test-key");
    const provider = createSTTProvider();
    expect(provider).toBeDefined();
  });

  it("throws on unknown STT_PROVIDER value", () => {
    vi.stubEnv("STT_PROVIDER", "unknown");
    expect(() => createSTTProvider()).toThrow('Unknown STT_PROVIDER: "unknown"');
  });
});

describe("createTTSProvider", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns KokoroLocalTTSProvider when TTS_PROVIDER=kokoro-local", () => {
    vi.stubEnv("TTS_PROVIDER", "kokoro-local");
    const provider = createTTSProvider();
    expect(provider).toBeDefined();
  });

  it("returns DeepgramTTSProvider when TTS_PROVIDER=deepgram-aura", () => {
    vi.stubEnv("TTS_PROVIDER", "deepgram-aura");
    vi.stubEnv("DEEPGRAM_API_KEY", "test-key");
    const provider = createTTSProvider();
    expect(provider).toBeDefined();
  });

  it("throws on unknown TTS_PROVIDER value", () => {
    vi.stubEnv("TTS_PROVIDER", "unknown");
    expect(() => createTTSProvider()).toThrow('Unknown TTS_PROVIDER: "unknown"');
  });
});
