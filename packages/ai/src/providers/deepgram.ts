import { createClient } from "@deepgram/sdk";

import type { STTProvider, TTSProvider } from "../types";

export class DeepgramSTTProvider implements STTProvider {
  private readonly client;

  constructor(apiKey: string) {
    this.client = createClient(apiKey);
  }

  async transcribe(audio: Buffer, mimeType: string): Promise<string> {
    const response = await this.client.listen.prerecorded.transcribeFile(
      audio as unknown as Parameters<typeof this.client.listen.prerecorded.transcribeFile>[0],
      {
        model: "nova-3",
        mimeType,
        smart_format: true,
      }
    );

    const transcript = response.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (transcript === undefined) {
      throw new Error("Deepgram returned no transcript");
    }

    return transcript;
  }

  async streamTranscribe(
    onTranscript: (text: string, isFinal: boolean) => void
  ): Promise<{ sendAudio: (chunk: Buffer) => void; close: () => void }> {
    const connection = await this.client.listen.live({
      model: "nova-3",
      smart_format: true,
      interim_results: true,
    });

    connection.on("transcript", (data) => {
      const alt = data.channel?.alternatives?.[0];
      if (!alt) return;
      onTranscript(alt.transcript, data.is_final ?? false);
    });

    return {
      sendAudio: (chunk: Buffer) => {
        const ab = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
        connection.send(ab);
      },
      close: () => connection.disconnect(),
    };
  }
}

export class DeepgramTTSProvider implements TTSProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesize(text: string): Promise<Buffer> {
    const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-2-thalia-en", {
      method: "POST",
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Deepgram TTS failed: ${response.status} ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }
}
