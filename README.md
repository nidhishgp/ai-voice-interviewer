# VoiceScreen

> AI-powered voice interview platform — candidates complete structured interviews by voice, creators review AI-generated evaluations.

**[Live demo →](https://voicescreen.app)** &nbsp;|&nbsp; **[Spec →](docs/SPEC.md)**

---

## What it does

A creator configures a voice interview template (questions, role context, time limit) and generates a shareable link. Candidates open the link, enter their name, and complete the interview entirely by voice with an AI interviewer. After the session, an AI evaluator reviews the transcript and produces a structured summary — visible only to the creator.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | [Next.js 15](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs), [TanStack Query](https://tanstack.com/query) |
| Backend | [Fastify](https://fastify.dev), [Supabase](https://supabase.com) (Postgres + Auth) |
| Voice | [LiveKit](https://livekit.io) (WebRTC), LiveKit Agents SDK |
| AI | STT: [Deepgram](https://deepgram.com) · LLM: OpenAI / Anthropic / Ollama · TTS: [Cartesia](https://cartesia.ai) |
| Monorepo | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) |
| Observability | [Sentry](https://sentry.io), [Pino](https://getpino.io) |

---

## Architecture

See [docs/SPEC.md](docs/SPEC.md) for the full product and technical specification.

---

## Local dev setup

**Prerequisites:** Node 22+, pnpm 9+, Docker

```bash
# 1. Clone and install
git clone https://github.com/nidhishpkl/voicescreen.git
cd voicescreen
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your values — see .env.example for instructions

# 3. Start local services
# LiveKit (WebRTC server)
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: devsecret" \
  livekit/livekit-server:latest --dev

# Supabase (database + auth)
supabase start

# 4. Run database migrations
supabase db push

# 5. Start all services
pnpm dev          # web (Next.js) + api (Fastify)
pnpm dev:agent    # LiveKit agent worker (separate terminal)
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

See [.env.example](.env.example) — every variable is documented with setup instructions.

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| `apps/web` | [Vercel](https://vercel.com) | Auto-deploys from `main` |
| `apps/api` | [Render](https://render.com) | Auto-deploys from `main` |
| LiveKit agent | [LiveKit Cloud](https://cloud.livekit.io) | Manual deploy via CLI |
| Database + Auth | [Supabase](https://supabase.com) | Free tier |

---

## License

MIT — see [LICENSE](LICENSE).
