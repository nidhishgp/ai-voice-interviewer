# Local Development Setup

## Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker Desktop (running)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (`brew install supabase/tap/supabase`)
- [Ollama Desktop](https://ollama.com) — pull your model after installing: `ollama pull llama3.2`
- Deepgram account — [free tier](https://deepgram.com), no card required

---

## 1. Clone and install

```bash
git clone https://github.com/<your-handle>/ai-voice-interviewer.git
cd ai-voice-interviewer
pnpm install
```

---

## 2. Configure environment

```bash
cp .env.example .env.local
```

Leave `.env.local` open — you'll fill in the Supabase keys in the next step.

---

## 3. Start local Supabase

```bash
supabase start
```

This spins up a local Supabase stack (Postgres, Auth, Storage, Studio) on `127.0.0.1:54321`.
When it finishes it prints your local credentials:

```
API URL: http://127.0.0.1:54321
anon key: eyJ...
service_role key: eyJ...
```

Copy those values into `.env.local`:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<anon key from above>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from above>
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from above>
```

> **Important:** these are local-only keys. Prod keys live in your hosting platform's
> environment config only.

---

## 4. Start LiveKit

```bash
docker compose up -d
```

Verify LiveKit is healthy:

```bash
curl http://localhost:7881/healthz
# → OK
```

The compose file uses `devkey`/`devsecret` — these already match `.env.example`.

---

## 5. Start Ollama (if using local LLM)

Open Ollama Desktop, or if you prefer CLI:

```bash
ollama serve
```

If you haven't pulled the model yet:

```bash
ollama pull llama3.2
```

`.env.local` defaults to `LLM_PROVIDER=ollama` and `LLM_BASE_URL=http://localhost:11434`.

---

## 6. Add remaining API keys

Fill in `.env.local` for the services you're using:

| Variable            | Where to get it                                         |
| ------------------- | ------------------------------------------------------- |
| `DEEPGRAM_API_KEY`  | [deepgram.com](https://deepgram.com) — free $200 credit |
| `OPENAI_API_KEY`    | Required only if `LLM_PROVIDER=openai`                  |
| `ANTHROPIC_API_KEY` | Required only if `LLM_PROVIDER=anthropic`               |
| `CARTESIA_API_KEY`  | Required only if `TTS_PROVIDER=cartesia`                |
| `SENTRY_DSN`        | Optional — leave empty to disable locally               |

---

## 7. Run the app

```bash
pnpm dev
```

This starts all apps via Turborepo. Next.js uses Turbopack by default in dev mode.

- Web: http://localhost:3000
- API: http://localhost:3001
- Supabase Studio: http://127.0.0.1:54323

---

## Useful commands

| Command                         | What it does                                       |
| ------------------------------- | -------------------------------------------------- |
| `supabase stop`                 | Stop the local Supabase stack                      |
| `supabase db reset`             | Wipe and re-run all migrations (safe — local only) |
| `supabase migration new <name>` | Create a new migration file                        |
| `docker compose down`           | Stop LiveKit                                       |
| `docker compose up -d`          | Start LiveKit in background                        |
| `ollama pull llama3.2`          | Download/update the local LLM model                |

---

## Environment separation

| Environment | Supabase                | LLM                         | LiveKit           |
| ----------- | ----------------------- | --------------------------- | ----------------- |
| Local dev   | `127.0.0.1:54321` (CLI) | Ollama Desktop              | Docker (`devkey`) |
| Production  | Supabase Cloud          | Gemini / OpenAI / Anthropic | LiveKit Cloud     |

`.env.local` is in `.gitignore` and is never committed. Production secrets are set
directly in the hosting platform (Vercel, Fly.io) — they never touch the repository.
