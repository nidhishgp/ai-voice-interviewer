import type { ModelMessage } from "ai";

export type { ModelMessage };

export interface STTProvider {
  transcribe(audio: Buffer, mimeType: string): Promise<string>;
  streamTranscribe(onTranscript: (text: string, isFinal: boolean) => void): Promise<{
    sendAudio: (chunk: Buffer) => void;
    close: () => void;
  }>;
}

export interface TTSProvider {
  synthesize(text: string): Promise<Buffer>;
}
