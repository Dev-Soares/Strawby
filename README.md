<div align="center">

# Strawby

**Nutrition tracking platform connecting patients and nutritionists**

Patients log meals and follow a macro plan; an automated daily score and streak system keeps them engaged. Nutritionists manage their patients, set plans, and follow progress — all in one app.

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![AI](https://img.shields.io/badge/AI-OpenAI%20%7C%20Gemini-412991?logo=openai&logoColor=white)](https://sdk.vercel.ai)

</div>

> **TL;DR for reviewers** — A production-shaped full-stack monorepo (NestJS + React 19) implementing a real product: role-based auth (patient / nutritionist), a weighted daily-score algorithm, cron-driven streaks and push notifications, an LLM assistant that logs meals from plain text and generates macro plans, a multi-source food database, PDF export, and a prerendered landing page + PWA app. Built on a strict, documented architecture (see [`.claude/rules/`](.claude/rules)).

---

## Table of contents

- [What is Strawby](#what-is-strawby)
- [Highlights](#highlights)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [The daily score algorithm](#the-daily-score-algorithm)
- [The Strawby assistant (AI)](#the-strawby-assistant-ai)
- [Scheduled jobs & notifications](#scheduled-jobs--notifications)
- [Domain model](#domain-model)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API reference](#api-reference)
- [Security](#security)
- [Scripts](#scripts)
- [Project structure](#project-structure)

---

## What is Strawby

Strawby is a two-sided nutrition app:

- **Patients** register meals from a shared food catalog (or their own private foods) — by hand or by describing them to the **Strawby assistant** — follow a macro plan, track weight over time, and earn a **daily score** based on how close their intake matched the plan. Hitting the target builds a **streak**.
- **Nutritionists** generate a connection code, accept patients, set each patient's macro plan, export it as PDF, and track adherence through scores and reports.

Patients without a nutritionist are not stuck: the assistant can calculate a macro plan from their profile, flagged as an **estimate** (`PlanSource.ASSISTANT`) that does not replace a professional consultation.

The product ships as two surfaces from the same client build: a **prerendered marketing landing page** (`/`, `/faq`, `/privacy`, `/terms`) and the **PWA app** (`/app/*`) — installable, offline-capable shell, push notifications, a mascot-guided onboarding tour, and Google sign-in.

---

## Highlights

| | |
|---|---|
| **Weighted scoring engine** | Daily score from a calories/protein/carbs/fat ratio table — not a naive sum. See [the algorithm](#the-daily-score-algorithm). |
| **LLM assistant** | Describe a meal in plain Portuguese → the assistant extracts items, matches them against the food catalog, and returns a **draft** the user confirms. Also suggests snacks for the remaining macros and generates macro plans. See [the assistant](#the-strawby-assistant-ai). |
| **Provider-agnostic AI layer** | `AiService` behind an `LlmProvider` interface; OpenAI or Gemini chosen by `AI_PROVIDER` env var. Failures map to `503`, never `500`. |
| **Two-layer AI quota** | Per-IP `@Throttle` as an abuse ceiling **plus** a fair per-user daily cap (`ASSISTANT_DAILY_LIMIT`, counted in `User.assistantUsageCount` and reset at app midnight). |
| **Cron jobs & push** | Six scheduled jobs (São Paulo TZ): close scores, process streaks, purge tokens, prune dead device tokens, and two reminder jobs that fan out Firebase push notifications. See [jobs](#scheduled-jobs--notifications). |
| **Role-based access** | `user → patient \| nutritionist` roles, a `RolesGuard` with `@Roles()`, and a `PatientAccessService` that authorizes every patient-scoped resource. |
| **Connection requests** | Patients request a nutritionist by code; nutritionist accepts/rejects — a full request lifecycle, with history on both sides. |
| **Multi-source food DB** | Foods sourced from TACO, USDA, CNF, LIVS, OFF, plus per-patient private foods. Trigram (`pg_trgm`) index for fuzzy search, plus import/clean/audit scripts. |
| **PDF export** | Nutrition plans rendered to PDF via headless Chromium (Puppeteer + `@sparticuz/chromium`, serverless-ready). |
| **Hardened auth** | JWT in HTTP-only cookies with a separately-signed refresh token, bcrypt, Helmet, per-route rate limiting, email verification, password reset, Google OAuth. |
| **PWA frontend** | React 19 (with React Compiler), Tailwind v4, TanStack Query, offline shell, Lottie mascot animations, Recharts, and a custom mascot-guided tour (replaced Shepherd). |
| **Prerendered landing** | Public pages are prerendered at build time with a generated sitemap (`prerender.mjs` + `generate-sitemap.mjs`), so marketing routes are crawlable while the app stays an SPA. |
| **Documented architecture** | Strict layering rules for both client and server, enforced through [`.claude/rules/`](.claude/rules). |

---

## Architecture

pnpm-workspaces monorepo, two independently deployable packages:

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│         client/             │         │           server/            │
│  React 19 · Vite · PWA      │  HTTP   │  NestJS 11 · Prisma 7        │
│  TanStack Query · Tailwind  │ ──────► │  JWT cookie · Throttler      │
│  React Router · RHF + Zod   │ cookie  │  Pino · Swagger · Cron       │
└─────────────────────────────┘         └──┬──────────┬──────────┬─────┘
          ▲                                │          │          │
          │  Firebase push                 ▼          ▼          ▼
          └───────────────────────┌──────────────┐ ┌────────┐ ┌─────────┐
                                  │ PostgreSQL16 │ │  LLM   │ │ Resend  │
                                  │ (Prisma + pg)│ │ OpenAI │ │  email  │
                                  └──────────────┘ │ Gemini │ └─────────┘
                                                   └────────┘
```

External dependencies are each isolated in their own module (`ai/`, `email/`, `notification/firebase/`, `pdf/`), so a missing API key degrades one feature instead of breaking boot.

### Layered request flow (server)

```
Controller  →  Service  →  PrismaService  →  PostgreSQL
(transport)   (business)   (data access)
```

Controllers are thin (1–5 lines), all business logic lives in services, Prisma is isolated in a `DatabaseModule`, and DTOs validate every input. The same discipline applies on the frontend:

```
Page  →  Hook (TanStack Query)  →  Service  →  axios
```

Both rule sets are written down in [`.claude/rules/server/`](.claude/rules/server) and [`.claude/rules/client/`](.claude/rules/client).

---

## Tech stack

### Backend — `server/`

| Tech | Role |
|---|---|
| **NestJS 11** | Application framework |
| **Prisma 7** + `@prisma/adapter-pg` | ORM, migrations, driver adapter |
| **PostgreSQL 16** | Database (`pg_trgm` for fuzzy food search) |
| **@nestjs/jwt** | Auth via HTTP-only cookie (no Passport strategy) |
| **bcrypt** | Password hashing |
| **@nestjs/schedule** | Cron jobs (score close, streak, token cleanup) |
| **@nestjs/throttler** | Rate limiting (global + per-route) |
| **Helmet** | HTTP security headers |
| **nestjs-pino** | Structured logging with secret redaction |
| **@nestjs/swagger** | OpenAPI docs (Basic-Auth protected) |
| **class-validator** | DTO validation (`whitelist` + `forbidNonWhitelisted`) |
| **Vercel AI SDK** (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`) | LLM text + structured-object generation |
| **Zod** (server-side) | Schema for LLM structured output (`generateObject`) |
| **firebase-admin** | Push notifications (FCM) |
| **Puppeteer + @sparticuz/chromium** | Server-side PDF rendering |
| **Resend** | Transactional email (verification, reset) |
| **google-auth-library** | Google OAuth token verification |

### Frontend — `client/`

| Tech | Role |
|---|---|
| **React 19** (+ React Compiler) | UI |
| **Vite 7** + `vite-plugin-pwa` | Build tooling, installable PWA |
| **TypeScript 5.9** | Type safety |
| **Tailwind CSS v4** | Styling (only method) |
| **TanStack Query v5** | Server state (cache / fetch / mutations) |
| **React Router v7** | Routing |
| **React Hook Form v7 + Zod v4** | Typed, validated forms |
| **@react-oauth/google** | Google sign-in |
| **firebase** | Push notification registration (FCM web) |
| **framer-motion** + **lottie-react** | Animations (incl. the mascot) |
| **recharts** | Score / weight charts and reports |
| **@base-ui/react** + **shadcn** + **lucide-react** | Headless primitives, component scaffolding, icons |
| **react-helmet-async** | Per-route meta tags for the public pages |
| **react-hot-toast** | Notifications |

Custom tour: the onboarding walkthrough is implemented in `modules/onboarding/` (`TourProvider`, spotlight, mascot callouts) — Shepherd was removed. The tour is replayable from Settings.

---

## The daily score algorithm

The score is the feature that makes Strawby more than a CRUD app. Each day, a patient's total intake is compared against their plan **per macro**, and each macro contributes a weighted share of the final score (0–10).

**Weights** — calories matter most, fat least:

| Macro | Weight |
|---|---|
| Calories | 40% |
| Protein | 30% |
| Carbs | 20% |
| Fat | 10% |

**Per-macro scoring** — the ratio `intake / target` is graded by a tolerance band, so being slightly over or under still scores well, and being wildly off scores zero:

| `intake / target` ratio | Macro score |
|---|---|
| 0.80 – 1.20 | 10 |
| 0.70 – 1.30 | 8 |
| 0.55 – 1.45 | 6 |
| 0.40 – 1.60 | 4 |
| 0.25 – 1.75 | 2 |
| < 0.25 or > 1.75 | 0 |

```
score = ratio(cal)·0.4 + ratio(protein)·0.3 + ratio(carbs)·0.2 + ratio(fat)·0.1
```

**Streaks** — at 02:00 the cron closes each patient's score for the previous day; at 03:00 the streak processor runs: a day scoring **≥ 7** extends `currentStreak` (and raises `bestStreak` when it beats it), a lower day resets it to `0`. The two jobs are deliberately an hour apart so "close day" always precedes "process streak". Both outcomes trigger a push notification ("Mais um dia!" / "Sequência Perdida").

A **live score** endpoint computes the same value on demand from the current day's meals, so the UI shows progress before the day is closed.

Source: [`daily-score.service.ts`](server/src/modules/daily-score/daily-score.service.ts) · [`ratio-table.ts`](server/src/modules/daily-score/utils/ratio-table.ts) · [`patient.service.ts`](server/src/modules/patient/patient.service.ts) · [`cron.service.ts`](server/src/modules/cron/cron.service.ts)

---

## The Strawby assistant (AI)

The assistant is a mascot-voiced chat that turns plain Portuguese into real records. Every AI feature follows the same **preview → confirm** contract: the LLM never writes to the database directly, it produces a draft the user approves.

### Meal logging from text

```
"comi 2 ovos e um pão francês no café"
        ↓
AiService.generateObject (Zod-validated structured output)
        ↓
findPublicFoodMatch — resolve each extracted item against the food catalog
        ↓
MealDraft (items + pre-computed macro totals)  ──► user confirms ──► MealService.create
```

- `POST /strawby-assistant/preview-meal` is the **only** endpoint that calls the LLM, so it is the only one that spends quota — including the "didn't understand" and "food not found" paths, because the paid call already happened.
- `POST /strawby-assistant/confirm-meal` persists the draft. No LLM call.

### Snack suggestions and plan generation

- **Suggest snack** — reads the day's remaining macros and returns options from a curated dataset (`data/suggested-meals.data.ts`), then `add-suggested-meal` logs the chosen one.
- **Preview / confirm plan** — computes macro targets from the patient's profile (last weight, height, birth date, gender, movement level) and saves with `source: ASSISTANT`. An incomplete profile is answered in the mascot's voice listing what's missing, not as an error toast. Confirming when a plan already exists replaces it — the draft flags this with `replacesExisting`.

### Provider abstraction and quota

| Concern | Implementation |
|---|---|
| Provider choice | `AI_PROVIDER=openai\|gemini` selects `OpenAiProvider` or `GeminiProvider` behind the `LLM_PROVIDER` token |
| Failure semantics | Any provider error → `503` + `AI_UNAVAILABLE_MESSAGE` (it's unavailability, not a server bug), which the client renders in the mascot's voice |
| Abuse ceiling | Per-IP `@Throttle` (20/min on previews, 10/min on `confirm-plan`) |
| Fair per-user cap | `ASSISTANT_DAILY_LIMIT = 15` calls/day, counted in `User.assistantUsageCount`, reset at app midnight. Exhaustion returns `429` carrying `ASSISTANT_QUOTA_EXCEEDED` in the body so the client can tell it apart from a throttle burst |

The limit lives in code (`common/config/assistant-quota.config.ts`), not the database — changing it takes effect immediately for everyone, with no migration.

Source: [`strawby-assistant/`](server/src/modules/strawby-assistant) · [`ai/`](server/src/modules/ai) · [`assistant-quota.config.ts`](server/src/common/config/assistant-quota.config.ts)

---

## Scheduled jobs & notifications

All cron jobs live in [`cron.service.ts`](server/src/modules/cron/cron.service.ts) and run in `America/Sao_Paulo`. Each is individually wrapped in try/catch so one failure never blocks the others.

| Schedule | Job | What it does |
|---|---|---|
| `02:00` daily | `closeDayScores` | Computes and persists yesterday's `DailyScore` for every patient |
| `03:00` daily | `updateStreaks` | Extends or resets streaks from yesterday's score, then pushes the result |
| `04:00` daily | `clearStaleNotificationTokens` | Prunes device tokens that stopped re-registering |
| hourly | `clearExpiredVerificationTokens` | Purges expired email-verification / reset tokens |
| `18:00` daily | `notifyPatientsWithoutDailyMeal` | Reminds patients who logged nothing today |
| every 10 min | `notifyPatientsWithPlannedMeal` | Finds plan meals due in the current 10-minute window and pushes a per-meal-type reminder (breakfast / lunch / snack / dinner / supper) |

Push delivery goes through `NotificationService` → `FirebaseService` (FCM). Device tokens are keyed by `userId + deviceId` (the device id is a UUID in `localStorage`) — FCM rotates tokens, and without that key each rotation created a new row and the same phone received the notification several times.

---

## Domain model

```
User ──1:1── Patient ──┬── Plan (1:1)          macro targets + PlanSource
  │  (role)            ├── Meal[] ── FoodItem[] ── Food | PrivateFood
  │  assistantUsage*   ├── Recipe[] ── FoodItem[]
  │                    ├── DailyScore[]          one per day (@@unique patient+date)
  │                    ├── PatientWeight[]       weight history (@@index patient+date)
  │                    └── currentStreak / bestStreak
  │
  ├── NotificationToken[]                        FCM device tokens (@@unique user+device)
  │
  └──1:1── Nutritionist ──┬── Patient[]          via connection code
                          └── ConnectionRequest[] (PENDING/ACCEPTED/REJECTED)
```

- **Meals** are typed `DAILY` (logged intake) or `PLAN` (template meals), and carry pre-computed macro totals on each `FoodItem` so scoring stays cheap.
- **Plans** record who set the targets — `PlanSource` is `NUTRITIONIST`, `MANUAL`, or `ASSISTANT`. An app-calculated plan is an estimate and the UI labels it as such.
- **PatientWeight** is a time series, not a column: the latest record feeds the automatic macro calculation, and the history drives the weight chart.
- **Foods** come from external nutrition databases (`FoodSource` enum: TACO, USDA, CNF, LIVS, OFF, MANUAL); **PrivateFood** is per-patient.
- `User.assistantUsageCount` / `assistantUsageResetAt` hold the AI daily quota counter.
- Hard cascade deletes from `User` down keep the privacy policy (immediate hard delete) consistent.

Full schema: [`prisma/schema.prisma`](server/prisma/schema.prisma)

---

## Getting started

### Prerequisites

- **Node.js ≥ 20** and **pnpm**
- **Docker Desktop** (recommended — runs Postgres + API) *or* a local/cloud PostgreSQL

### 1. Install

```bash
git clone <repo-url>
cd Strawby
pnpm install
```

### 2. Configure env

```bash
cp server/.env.example server/.env   # then fill JWT_SECRET etc. (see below)
cp client/.env.example client/.env   # then fill VITE_API_URL / VITE_SITE_URL
```

### 3a. Run with Docker (recommended)

`docker-compose.yml` brings up **PostgreSQL + API** together, with a healthcheck so the API only boots once Postgres is ready.

```bash
docker compose up -d        # Postgres + API in the background
docker compose logs -f      # follow logs
docker compose down         # stop everything
```

The frontend is **not** containerized — run it separately:

```bash
pnpm --filter client dev
```

### 3b. Run locally (no Docker)

```bash
pnpm dev                          # server + client in parallel
# or individually:
pnpm --filter server start:dev
pnpm --filter client dev
```

| Service | URL |
|---|---|
| API | http://localhost:3000 |
| Landing page | http://localhost:5173 |
| App (PWA) | http://localhost:5173/app/home |
| Swagger | http://localhost:3000/api-docs |
| Prisma Studio | http://localhost:5555 |

### Demo accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Patient | `usuario@teste.com` | `Teste123!` |
| Nutritionist | `nutricionista@teste.com` | `Teste123!` |

Nutritionist connection code: **`ANALIMA`**

---

## Environment variables

`server/.env` (see [`.env.example`](server/.env.example)):

```env
NODE_ENV=development
PORT=3000

# PostgreSQL — docker compose default below
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/appdb"

# Frontend origin allowed by CORS (comma-separate for multiple)
CORS_ORIGIN="http://localhost:5173"

# JWT — generate with: openssl rand -hex 64
JWT_SECRET=""
JWT_REFRESH_SECRET=""      # must differ from JWT_SECRET

# bcrypt cost
SALT_ROUNDS=10

# Optional: cookie parent domain in prod (e.g. .strawby.com)
COOKIE_DOMAIN=

# Swagger Basic-Auth (dev only — disabled when NODE_ENV=production)
SWAGGER_USER=
SWAGGER_PASSWORD=

# Email (Resend) — verification + password reset
RESEND_API_KEY=
EMAIL_FROM=                # e.g. "Strawby <no-reply@strawby.com>"

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI / LLM — provider: "openai" | "gemini" (default: openai)
AI_PROVIDER=gemini
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash

# Firebase Admin (push notifications)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=""    # full PEM on one line, literal \n for line breaks
```

> The API **fails fast on boot** if `CORS_ORIGIN`, `JWT_SECRET`, or `DATABASE_URL` is missing. The optional integrations (AI, email, Google, Firebase) degrade on their own: a missing AI key makes assistant routes answer `503`, not break startup.

`client/.env` (see [`client/.env.example`](client/.env.example)):

```env
# Backend API base URL
VITE_API_URL=http://localhost:3000

# Public site URL, no trailing slash — feeds canonical, og:url, JSON-LD and the sitemap
VITE_SITE_URL=http://localhost:5173

# Google OAuth client id (same GCP project as the server's GOOGLE_CLIENT_ID)
VITE_GOOGLE_CLIENT_ID=

# FCM Web Push certificate key pair (Firebase → Cloud Messaging → Web Push certificates)
VITE_FIREBASE_VAPID_KEY=
```

> `VITE_SITE_URL` must be the real domain in production — a wrong canonical makes search engines treat the live site as a duplicate.

---

## Database

```bash
# Apply migrations
pnpm --filter server exec prisma migrate deploy

# Generate Prisma Client
pnpm --filter server exec prisma generate

# Seed demo data (patient + nutritionist + plan + 7 days of meals/scores)
pnpm --filter server seed

# Import public food catalog from external sources
pnpm --filter server import:off         # Open Food Facts Brazil
pnpm --filter server import:ibge        # IBGE POF 2008-2009
pnpm --filter server clean:foods        # clean low-quality records
pnpm --filter server reprioritize:foods # re-run food ranking

# Inspect
pnpm --filter server exec prisma studio
```

---

## API reference

Base URL `http://localhost:3000`. Auth is a JWT in an HTTP-only `access_token` cookie.
Patient-scoped routes take a `:patientId` and are authorized through `PatientAccessService` (the patient themselves **or** their nutritionist).

<details open>
<summary><strong>Auth</strong> — <code>/auth</code></summary>

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | — | Log in, set cookie (5 req/min) |
| `POST` | `/auth/logout` | — | Clear cookie |
| `POST` | `/auth/refresh` | cookie | Rotate token (10 req/min) |
| `POST` | `/auth/google` | — | Sign in with Google credential |
| `GET` | `/auth/verify-email` | — | Verify email via token, log in |
| `POST` | `/auth/resend-verification` | — | Resend verification email |
| `POST` | `/auth/forgot-password` | — | Send reset email (3 req/min) |
| `POST` | `/auth/reset-password` | — | Reset password, log in (3 req/min) |

</details>

<details>
<summary><strong>User</strong> — <code>/user</code></summary>

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user` | — | Create account (3 req/min) |
| `POST` | `/user/onboarding` | yes | Complete onboarding (set role/body data) |
| `GET` | `/user/me` | yes | Current user |
| `GET` | `/user/:id` | owner | Get user by id |
| `PATCH` | `/user/:id` | owner | Update own user |
| `DELETE` | `/user/:id` | owner | Hard-delete own account |

</details>

<details>
<summary><strong>Patient & Weight</strong> — <code>/patient</code>, <code>/patient-weight</code> (all auth)</summary>

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/patient/:id` | owner | Patient profile |
| `GET` | `/patient/:id/streak` | yes | Current / best streak |
| `PATCH` | `/patient/:id` | owner | Update patient profile |
| `DELETE` | `/patient/:id/nutritionist` | owner | Disconnect from nutritionist |
| `POST` | `/patient-weight/:patientId` | yes | Record a weight |
| `GET` | `/patient-weight/:patientId` | yes | Weight history |
| `GET` | `/patient-weight/:patientId/last` | yes | Latest weight |
| `PATCH` | `/patient-weight/:patientId/:id` | yes | Update a record |
| `DELETE` | `/patient-weight/:patientId/:id` | yes | Delete a record |

</details>

<details>
<summary><strong>Nutritionist & Connection</strong> — <code>/nutritionist</code>, <code>/connection-request</code></summary>

| Method | Route | Role | Description |
|---|---|---|---|
| `GET` | `/nutritionist/me` | nutritionist | Own profile |
| `GET` | `/nutritionist/me/patients` | nutritionist | List patients |
| `POST` | `/nutritionist/me/code` | nutritionist | Set/update connection code |
| `DELETE` | `/nutritionist/me/patients/:patientId` | nutritionist | Remove a patient |
| `POST` | `/connection-request` | patient | Request a nutritionist by code (5 req/min) |
| `GET` | `/connection-request/patient` | patient | Own requests |
| `DELETE` | `/connection-request/:id` | patient | Cancel own request |
| `GET` | `/connection-request/nutritionist` | nutritionist | Pending requests |
| `GET` | `/connection-request/nutritionist/history` | nutritionist | Decided requests |
| `PATCH` | `/connection-request/:id/accept` | nutritionist | Accept request |
| `PATCH` | `/connection-request/:id/reject` | nutritionist | Reject request |

</details>

<details>
<summary><strong>Food & Private food</strong> — <code>/food</code>, <code>/private-food</code> (all auth)</summary>

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/food/search` | yes | Fuzzy search public catalog |
| `GET` | `/food/:id` | yes | Food details |
| `POST` | `/private-food/:patientId` | yes | Create private food |
| `GET` | `/private-food/:patientId` | yes | List private foods |
| `PATCH` | `/private-food/:patientId/:id` | yes | Update private food |
| `DELETE` | `/private-food/:patientId/:id` | yes | Delete private food |

</details>

<details>
<summary><strong>Meal</strong> — <code>/meal</code> (all auth)</summary>

| Method | Route | Description |
|---|---|---|
| `POST` | `/meal/:patientId` | Create meal |
| `GET` | `/meal/:patientId` | List meals |
| `GET` | `/meal/:patientId/day/:day` | Meals for a day |
| `GET` | `/meal/:patientId/:id` | Meal details |
| `PATCH` | `/meal/:patientId/:id` | Update meal |
| `DELETE` | `/meal/:patientId/:id` | Delete meal |
| `POST` | `/meal/:patientId/:id/items` | Add catalog food |
| `POST` | `/meal/:patientId/:id/private-items` | Add private food |
| `PATCH` | `/meal/:patientId/:id/items/:itemId` | Update item quantity |
| `DELETE` | `/meal/:patientId/:id/items/:itemId` | Remove item |
| `POST` | `/meal/:patientId/:id/recipes` | Add recipe |
| `DELETE` | `/meal/:patientId/:id/recipes/:recipeId` | Remove recipe |

</details>

<details>
<summary><strong>Recipe</strong> — <code>/recipe</code> (all auth)</summary>

| Method | Route | Description |
|---|---|---|
| `POST` | `/recipe/:patientId` | Create recipe |
| `GET` | `/recipe/:patientId` | List recipes |
| `GET` | `/recipe/:patientId/:id` | Recipe details |
| `PATCH` | `/recipe/:patientId/:id` | Update recipe |
| `DELETE` | `/recipe/:patientId/:id` | Delete recipe |
| `POST` | `/recipe/:patientId/:id/items` | Add catalog food |
| `POST` | `/recipe/:patientId/:id/private-items` | Add private food |
| `DELETE` | `/recipe/:patientId/:id/items/:itemId` | Remove item |

</details>

<details>
<summary><strong>Plan & Daily score</strong> — <code>/plan</code>, <code>/daily-score</code> (all auth)</summary>

| Method | Route | Description |
|---|---|---|
| `POST` | `/plan/:patientId` | Create macro plan |
| `GET` | `/plan/:patientId` | Get plan |
| `PATCH` | `/plan/:patientId` | Update plan |
| `DELETE` | `/plan/:patientId` | Delete plan |
| `GET` | `/plan/:patientId/pdf` | Export plan as PDF |
| `GET` | `/daily-score/:patientId` | Scores (optional date range) |
| `GET` | `/daily-score/:patientId/day/:day` | Score for a day |
| `GET` | `/daily-score/:patientId/live/:day` | Live (uncommitted) score |
| `GET` | `/daily-score/:patientId/average` | Average score |

</details>

<details>
<summary><strong>Strawby assistant</strong> — <code>/strawby-assistant</code> (all auth)</summary>

| Method | Route | Rate limit | Description |
|---|---|---|---|
| `POST` | `/strawby-assistant/preview-meal` | 20/min | **Calls the LLM.** Extracts a meal draft from a free-text message (spends daily quota) |
| `POST` | `/strawby-assistant/confirm-meal` | 30/min | Persists a previously previewed meal |
| `POST` | `/strawby-assistant/suggest-snack` | 30/min | Snack options for the remaining macros |
| `POST` | `/strawby-assistant/add-suggested-meal` | 30/min | Log a suggested snack |
| `POST` | `/strawby-assistant/preview-plan` | 20/min | Calculate macro targets from the profile (not saved) |
| `POST` | `/strawby-assistant/confirm-plan` | 10/min | Save the calculated plan with `source: ASSISTANT` |

Quota exhaustion returns `429` with `ASSISTANT_QUOTA_EXCEEDED` in the body; provider failure returns `503`.

</details>

<details>
<summary><strong>Notifications</strong> — <code>/notification/token</code> (all auth)</summary>

| Method | Route | Description |
|---|---|---|
| `POST` | `/notification/token` | Register / refresh this device's FCM token |
| `DELETE` | `/notification/token` | Unregister this device |

</details>

<details>
<summary><strong>Health</strong> — <code>/health</code></summary>

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |

</details>

> Full request/response shapes are documented in **Swagger** at `/api-docs`.

---

## Security

| Mechanism | Detail |
|---|---|
| **HTTP-only cookie JWT** | Token never exposed to JavaScript; not stored in `localStorage` |
| **Separate refresh secret** | Refresh tokens signed with `JWT_REFRESH_SECRET`, distinct from the access secret |
| **bcrypt** | Passwords hashed with configurable salt rounds |
| **Helmet** | Security headers on every response |
| **CORS** | Locked to `CORS_ORIGIN` (supports multiple origins) |
| **Rate limiting** | Global 100 req/min; tighter on login (5/min), password reset (3/min), signup (3/min), connection requests (5/min) and every AI route (10–30/min) |
| **AI cost control** | Per-user daily LLM quota on top of per-IP throttling, so a shared IP can't starve other users and one user can't run up the bill |
| **ValidationPipe** | `whitelist` + `forbidNonWhitelisted` reject unknown fields |
| **Guards** | `AuthGuard`, `OptionalAuthGuard`, `OwnershipGuard`, `RolesGuard` (`@Roles()`), `PatientAccessService` |
| **Email verification** | Accounts confirm via emailed token; expired tokens purged hourly |
| **Log redaction** | Pino redacts auth headers, cookies, passwords, tokens |
| **Fail-fast boot** | Missing critical env vars stop the server from starting |
| **Swagger lockdown** | Basic-Auth protected and disabled entirely in production |

---

## Scripts

```bash
# Root
pnpm dev                          # server + client in parallel
pnpm build                        # build both
pnpm lint                         # lint all packages
pnpm format                       # Prettier across the monorepo
pnpm docker:up                    # docker compose up --build -d
pnpm docker:logs                  # follow container logs
pnpm docker:down                  # stop containers
pnpm docker:clean                 # down -v --remove-orphans (drops volumes)

# Server
pnpm --filter server start:dev    # hot reload
pnpm --filter server start:prod   # production
pnpm --filter server test         # Jest
pnpm --filter server seed         # demo data

# Server — food catalog pipeline (every script also has a :dry / :fix variant)
pnpm --filter server import:off        # Open Food Facts Brazil
pnpm --filter server import:ibge       # IBGE POF 2008-2009
pnpm --filter server normalize:off     # normalize OFF product names
pnpm --filter server clean:foods       # drop low-quality records
pnpm --filter server clean:foreign     # drop non-Brazilian products
pnpm --filter server reprioritize:foods  # re-run search ranking
pnpm --filter server audit:foods       # catalog quality report
pnpm --filter server audit:brands      # brand coverage report

# Client
pnpm --filter client dev          # Vite dev server
pnpm --filter client build        # tsc + vite build + sitemap + prerender

# Prisma (always via --filter server)
pnpm --filter server exec prisma migrate dev --name <name>
pnpm --filter server exec prisma migrate deploy
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma studio
```

---

## Project structure

```
Strawby/
├── server/                       # NestJS API
│   ├── src/
│   │   ├── common/               # guards, filters, hash, config, utils
│   │   └── modules/
│   │       ├── auth/             # login, logout, refresh, Google, verify, reset
│   │       ├── user/             # accounts + onboarding + AI quota counter
│   │       ├── patient/          # patient profile + streaks
│   │       ├── patient-weight/   # weight history
│   │       ├── patient-access/   # authorizes every patient-scoped resource
│   │       ├── nutritionist/     # nutritionist profile + patients
│   │       ├── connection-request/  # patient <-> nutritionist linking
│   │       ├── plan/             # macro plans (+ PDF export, auto-calculated macros)
│   │       ├── meal/             # daily & plan meals
│   │       ├── recipe/           # reusable food groupings
│   │       ├── food/             # public catalog (multi-source)
│   │       ├── private-food/     # per-patient foods
│   │       ├── daily-score/      # scoring engine
│   │       ├── ai/               # LLM abstraction (OpenAI | Gemini providers)
│   │       ├── strawby-assistant/   # meal extraction, snack suggestion, plan generation
│   │       ├── notification/     # firebase/ + notification-token/ + send-notification/
│   │       ├── cron/             # scheduled jobs (scores, streaks, reminders, cleanup)
│   │       ├── email/            # Resend transactional email
│   │       ├── pdf/              # headless-Chromium rendering
│   │       ├── database/         # PrismaService
│   │       └── health/
│   ├── prisma/                   # schema, migrations, seed, food import/audit scripts
│   └── Dockerfile
│
├── client/                       # React 19 PWA + prerendered landing
│   ├── src/
│   │   ├── api/                  # axios instance + interceptors
│   │   ├── routes/               # route groups (public, auth, app features)
│   │   ├── modules/              # feature modules (components/hooks/service/types/skeletons)
│   │   │   ├── landing/          # marketing page sections
│   │   │   ├── onboarding/       # mascot-guided tour (replaced Shepherd)
│   │   │   ├── strawby-assistant/   # assistant chat UI
│   │   │   └── ...
│   │   ├── lib/firebase/         # FCM client setup
│   │   ├── shared/               # reusable UI, contexts, layouts, hooks
│   │   └── pages/                # route-level screens
│   ├── public/                   # PWA assets + firebase-messaging-sw.js
│   └── scripts/                  # sitemap generation + static prerender
│
├── .claude/rules/                # documented architecture rules (server + client)
├── docs/                         # mascot prompt notes
├── docker-compose.yml            # Postgres + API
├── pnpm-workspace.yaml
└── package.json                  # workspace root
```
