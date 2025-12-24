# Copilot / AI Agent Instructions

This file contains concise, actionable guidance to help AI coding agents be immediately productive in this repository.

## Big picture (what to know first)
- Stack: **Next.js 15 (App Router)** + **TypeScript** frontend & serverless API routes; **Prisma** (SQLite dev, Postgres prod); separate **AI Voice Service** (Node + Express + Socket.io) in `mini-services/voice-service`.
- Runtime pattern: frontend and API run on **localhost:3000** (Next dev), voice service on **localhost:3003** (env: `VOICE_SERVICE_PORT`). The main app notifies the voice service via `process.env.AI_VOICE_SERVICE_URL`.
- Tenancy: Multi-tenant data model (see `prisma/schema.prisma`), prompts are tenant-specific (`AiPrompt` model / `ai_prompts` table).

## Developer workflows (how to run & test)
- Start main app: `npm install` then `npm run dev` (port 3000).
- Start voice service: `cd mini-services/voice-service && npm install && npm run dev` (uses `tsx watch index.ts`).
- Database: `npx prisma generate` then `npm run db:push` (scripts in root `package.json`).
- Build for deployment: `npm run build` produces `.next/standalone` (see `postbuild`).

⚠️ Note: README lists test scripts (unit, e2e, load) but `package.json` currently does NOT define `test`, `test:e2e`, or `test:load`; verify before adding tests.

## Important files & examples (patterns to follow)
- API routes: `src/app/api/*/route.ts` — export `GET` / `POST` handlers that return `NextResponse.json(...)` and use try/catch for errors. Example: `src/app/api/calls/route.ts`.
- Voice service endpoints & WebSocket: `mini-services/voice-service/index.ts` exposes `/calls/incoming`, `/calls/transcript`, `/calls/status` and uses Socket.io for `speech-input` / `ai-response`. Business logic lives in `mini-services/voice-service/src/handlers/callHandler.ts`.
- Prompts: UI reads prompts via `/api/prompts/:tenantId/:promptType` (e.g. used by `src/components/dashboard/configuration-panel.tsx`). There is **no** `api/prompts` implementation yet — this is a concrete gap.
- Database: schema is at `prisma/schema.prisma`. Key model: `AiPrompt` (fields: `promptType`, `templateContent`, `variables`, `version`). Current migrations include `init_rls` folder; however the SQL uses SQLite and does not contain explicit RLS policies — double-check when targeting Postgres.

## Integration points & env vars
- LLM SDK: `z-ai-web-dev-sdk` used in voice flow (`callHandler`) and components. Calls: `zai.chat.completions.create({ messages: [...] })`. Many handlers expect the model to return JSON strings that are parsed (wrap parsing in try/catch).
- External services toggled by env vars: `AI_VOICE_SERVICE_URL`, `GOOGLE_CALENDAR_ENABLED`, `SMS_ENABLED`, `VOICE_SERVICE_PORT`, `NEXT_PUBLIC_APP_URL`. Also `DATABASE_URL`, `NEXTAUTH_SECRET`, `ZAI_API_KEY` for production.
- Twilio / voice provider: API routes accept webhooks with fields like `CallSid`, `CallStatus`, `From`, `To`.

## Project-specific conventions
- Many API routes are scaffolded with **mock** data in development (look for arrays of mock objects in `src/app/api/*`), and logs often include emojis (📞, ✅, ❌). Keep this logging style consistent when adding non-noisy debug logs.
- Prompt templates are stored and versioned per-tenant (`AiPrompt`). Frontend expects `template_content` in the API response.
- Next.js App Router API handlers return `NextResponse` directly (not `res.json`) — match that style.
- The voice-service uses `Socket.io` rooms named `call-<CallSid>` for per-call streaming.

## High-value, immediately-actionable tasks for an AI agent
- Implement `/api/prompts/[tenantId]/[promptType]/route.ts` to read/write `AiPrompt` using Prisma and return `{ template_content, variables }` as used by the dashboard.
- Add a small `src/lib/db.ts` wrapper that exports a Prisma client (singleton) and replace mocks in `src/app/api/*` to use Prisma where possible.
- Add `.env.example` documenting the keys used by the repo (`DATABASE_URL`, `AI_VOICE_SERVICE_URL`, `VOICE_SERVICE_PORT`, `NEXT_PUBLIC_APP_URL`, `GOOGLE_CALENDAR_ENABLED`, `SMS_ENABLED`, `NEXTAUTH_SECRET`, `ZAI_API_KEY`).
- Add test scripts to `package.json` (or remove from README) so docs and scripts remain consistent.
- Harden parsing of LLM outputs: wrap JSON.parse of LLM responses and add a fallback that logs the raw content and returns a safe default.

## Safety & assumptions
- Many areas are intentionally mocked for demonstration (DB queries, calendar, email/SMS). Before implementing real integrations, check for feature flags (`*_ENABLED`) and add small, well-tested feature toggles.
- When targeting Postgres/production, validate RLS policies and migrations; the current migration is SQLite-first and may need policy SQL for Postgres.

## Helpful search hints and starting points
- Look for examples: `src/app/api/calls/route.ts`, `src/app/api/appointments/route.ts`, `mini-services/voice-service/index.ts`, `mini-services/voice-service/src/handlers/callHandler.ts`, `prisma/schema.prisma`.
- Use `npx prisma generate` and `npm run db:push` to sync DB changes locally.

## Recent changes (automated)
- Added `src/lib/db.ts` — a singleton Prisma client export `db` for use in API routes.
- Implemented `/api/prompts/[tenantId]/[promptType]/route.ts` (GET returns `{ template_content, variables }`, POST creates a new versioned prompt). This implements the `/api/prompts` endpoint used by the dashboard configuration.
- Added `.env.example` documenting expected environment variables and recommended local SQLite usage.
- Added `prisma/seed.ts` and `npm run db:seed` to create a demo tenant, sample prompts, a patient, appointment and a demo call for local development.- Added simple test & admin helpers: `scripts/test-seed.ts` (`npm run test:seed`) verifies seed created demo tenant & prompts; `scripts/print-demo.ts` (`npm run print-demo`) prints the demo tenant and prompt list.
If you'd like, I can now (pick one): (1) wire a few API routes to use Prisma where they still use mock data, (2) add `.env.example` documenting expected env vars, or (3) add simple tests for the prompts API — tell me which to start with.

---
Please tell me which of the suggested tasks to implement first or if you'd like me to iterate on the instructions themselves (clarify anything that seems missing).