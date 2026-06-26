import { DeepgramSTTProvider, DeepgramTTSProvider } from "./providers/deepgram";
import { KokoroLocalTTSProvider } from "./providers/kokoro";
import type { STTProvider, TTSProvider } from "./types";

export function createSTTProvider(): STTProvider {
  const provider = process.env["STT_PROVIDER"];

  switch (provider) {
    case "deepgram": {
      const apiKey = process.env["DEEPGRAM_API_KEY"];
      if (!apiKey) throw new Error("DEEPGRAM_API_KEY is required when STT_PROVIDER=deepgram");
      return new DeepgramSTTProvider(apiKey);
    }
    default:
      throw new Error(`Unknown STT_PROVIDER: "${provider}". Must be one of: deepgram`);
  }
}

export function createTTSProvider(): TTSProvider {
  const provider = process.env["TTS_PROVIDER"];

  switch (provider) {
    case "kokoro-local": {
      const baseURL = process.env["KOKORO_BASE_URL"] ?? "http://localhost:8880";
      return new KokoroLocalTTSProvider(baseURL);
    }
    case "deepgram-aura": {
      const apiKey = process.env["DEEPGRAM_API_KEY"];
      if (!apiKey) throw new Error("DEEPGRAM_API_KEY is required when TTS_PROVIDER=deepgram-aura");
      return new DeepgramTTSProvider(apiKey);
    }
    default:
      throw new Error(
        `Unknown TTS_PROVIDER: "${provider}". Must be one of: kokoro-local, deepgram-aura`
      );
  }
}
