# Component Inventory

Component reference for the frontend implementation. Every UI component listed before implementation begins.

**Columns:**
- **S/C** — Server Component or Client Component (`"use client"`)
- **Props** — TypeScript interface summary
- **Hook** — co-located hook if any (lives next to the component file)
- **Special files** — `loading.tsx`, `error.tsx`, `not-found.tsx` required for this route

---

## Route: Auth — `app/(auth)/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| LoginPage | `(auth)/login/page.tsx` | S | — | — | — |
| SignupPage | `(auth)/signup/page.tsx` | S | — | — | — |

> Auth form interactivity is handled by Supabase Auth UI or a Client Component form. Pages themselves are Server Components.

---

## Route: Dashboard shell — `app/(dashboard)/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| DashboardLayout | `(dashboard)/layout.tsx` | S | `{ children: ReactNode }` | — | `loading.tsx`, `error.tsx` |

---

## Route: Templates list — `app/(dashboard)/templates/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| TemplatesPage | `templates/page.tsx` | S | — | — | `loading.tsx`, `error.tsx` |
| TemplateCard | `components/templates/TemplateCard.tsx` | S | `{ id: string; title: string; questionCount: number; createdAt: string }` | — | — |
| NewTemplatePage | `templates/new/page.tsx` | S | — | — | — |
| TemplateForm | `components/templates/TemplateForm.tsx` | C | `{ template?: Template; onSubmit: (data: TemplateFormData) => Promise<void> }` | `useTemplateForm.ts` | — |
| QuestionList | `components/templates/QuestionList.tsx` | C | `{ questions: Question[]; onChange: (questions: Question[]) => void }` | — | — |

---

## Route: Template detail — `app/(dashboard)/templates/[id]/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| TemplateDetailPage | `templates/[id]/page.tsx` | S | `{ params: { id: string } }` | — | `loading.tsx`, `error.tsx` |
| SessionList | `components/templates/SessionList.tsx` | S | `{ templateId: string; sessions: Session[] }` | — | — |

---

## Route: Pre-join — `app/join/[token]/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| PreJoinPage | `join/[token]/page.tsx` | S | `{ params: { token: string } }` | — | `loading.tsx`, `error.tsx`, `not-found.tsx` |
| PreJoinForm | `components/join/PreJoinForm.tsx` | C | `{ token: string; interviewTitle: string; questionCount: number }` | — | — |

> `not-found.tsx` required — invalid/expired share tokens call `notFound()`.

---

## Route: Voice Room — `app/join/[token]/room/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| VoiceRoomPage | `join/[token]/room/page.tsx` | S | `{ params: { token: string } }` | — | — |
| VoiceRoom | `components/room/VoiceRoom.tsx` | C | `{ sessionId: string; livekitToken: string }` | `useAudioSession.ts`, `useSessionTimer.ts` | — |
| WaveformVisualizer | `components/room/WaveformVisualizer.tsx` | C | `{ audioTrack?: LocalAudioTrack }` | — | — |
| QuestionProgress | `components/room/QuestionProgress.tsx` | C | `{ current: number; total: number; questionText: string }` | — | — |
| ThankYouPage | `join/[token]/room/thank-you/page.tsx` | S | — | — | — |

---

## Route: Session detail — `app/(dashboard)/templates/[id]/sessions/[sessionId]/`

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| SessionDetailPage | `sessions/[sessionId]/page.tsx` | S | `{ params: { id: string; sessionId: string } }` | — | `loading.tsx`, `error.tsx` |
| TranscriptViewer | `components/session/TranscriptViewer.tsx` | C | `{ turns: TranscriptTurn[] }` | — | — |
| EvaluationSummary | `components/session/EvaluationSummary.tsx` | S | `{ evaluation: Evaluation }` | — | — |

---

## Shared / Layout Components

| Component | File | S/C | Props | Hook | Special files |
|-----------|------|-----|-------|------|---------------|
| ThemeToggle | `components/ThemeToggle.tsx` | C | — | — | — |
| NavBar | `components/NavBar.tsx` | S | `{ user: User \| null }` | — | — |
| Avatar | `components/Avatar.tsx` | S | `{ name: string; imageUrl?: string }` | — | — |
| LoadingSpinner | `components/LoadingSpinner.tsx` | C | `{ size?: 'sm' \| 'md' \| 'lg' }` | — | — |
| EmptyState | `components/EmptyState.tsx` | S | `{ title: string; description: string; action?: ReactNode }` | — | — |

---

## shadcn/ui Components Required

Run `npx shadcn add <name>` in `apps/web/` for each:

| Component | Used by |
|-----------|---------|
| `button` | TemplateForm, PreJoinForm, NavBar |
| `input` | TemplateForm, PreJoinForm |
| `textarea` | TemplateForm (question text) |
| `card` | TemplateCard, SessionList |
| `badge` | SessionList (status), QuestionProgress |
| `separator` | TranscriptViewer |
| `scroll-area` | TranscriptViewer, QuestionList |
| `toast` | TemplateForm (save confirmation), VoiceRoom (errors) |
| `dialog` | TemplateDetail (delete confirmation) |
| `label` | All forms |
| `skeleton` | loading.tsx fallbacks |
| `avatar` | NavBar user menu |
| `dropdown-menu` | NavBar user menu |

---

## Co-located Hooks

| Hook | File | Owns |
|------|------|------|
| `useTemplateForm` | `components/templates/useTemplateForm.ts` | Form state, validation, Server Action dispatch |
| `useAudioSession` | `components/room/useAudioSession.ts` | LiveKit room connection, mic track, disconnect |
| `useSessionTimer` | `components/room/useSessionTimer.ts` | Elapsed time display, auto-end at time limit |
| `useSession` | `hooks/useSession.ts` | Session detail polling / real-time subscription |

---

## Server vs Client Decision Summary

**Server Components** — anything that only renders data:
- All `page.tsx` files (fetch data, pass as props)
- `layout.tsx` (renders chrome, reads user from server session)
- `EvaluationSummary` (pure display, no interactivity)
- `TemplateCard`, `SessionList`, `NavBar`, `Avatar`, `EmptyState`

**Client Components** — anything with interactivity, state, or browser APIs:
- All forms (`TemplateForm`, `PreJoinForm`)
- `VoiceRoom` and its sub-components (LiveKit SDK, Web Audio API)
- `ThemeToggle` (calls `setTheme` from next-themes)
- `TranscriptViewer` (scroll behavior)
- `LoadingSpinner` (animation)
- All hooks (hooks only run in Client Components)
