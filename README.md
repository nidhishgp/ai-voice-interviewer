# AI Voice Interviewer

> **Work in progress.** Setup and deployment docs will be added as the project is completed.

AI-powered voice interview platform. Creators configure interview templates and share a link. Candidates complete the interview by voice with an AI interviewer. Creators review the AI-generated transcript and evaluation summary.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | [Next.js 15](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs), [TanStack Query](https://tanstack.com/query) |
| Backend | [Fastify](https://fastify.dev), [Supabase](https://supabase.com) (Postgres + Auth + RLS) |
| Voice | [LiveKit](https://livekit.io) (WebRTC), LiveKit Agents SDK |
| AI | STT: [Deepgram](https://deepgram.com) · LLM: OpenAI / Anthropic / Ollama · TTS: [Cartesia](https://cartesia.ai) |
| Monorepo | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) |
| Observability | [Sentry](https://sentry.io), [Pino](https://getpino.io) |

---

## License

MIT — see [LICENSE](LICENSE).
