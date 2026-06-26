import type { TTSProvider } from "../types";

export class KokoroLocalTTSProvider implements TTSProvider {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async synthesize(text: string): Promise<Buffer> {
    const response = await fetch(`${this.baseURL}/v1/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "kokoro",
        input: text,
        voice: "af_heart",
        response_format: "wav",
      }),
    });

    if (!response.ok) {
      throw new Error(`Kokoro TTS failed: ${response.status} ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }
}
