import type { CoreMessage } from "ai";

export type { CoreMessage };

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
