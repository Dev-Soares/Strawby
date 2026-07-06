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

</div>

> **TL;DR for reviewers** — A production-shaped full-stack monorepo (NestJS + React 19) implementing a real product: role-based auth (patient / nutritionist), a weighted daily-score algorithm, cron-driven streak processing, a multi-source food database, PDF export, and a PWA frontend. Built on a strict, documented architecture (see [`.claude/rules/`](.claude/rules)).

---

## Table of contents

- [What is Strawby](#what-is-strawby)
- [Highlights](#highlights)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [The daily score algorithm](#the-daily-score-algorithm)
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

- **Patients** register meals from a shared food catalog (or their own private foods), follow a macro plan defined by their nutritionist, and earn a **daily score** based on how close their intake matched the plan. Hitting the target builds a **streak**.
- **Nutritionists** generate a connection code, accept patients, set each patient's macro plan, export it as PDF, and track adherence through scores and weekly reports.

The app is a **PWA** — installable, offline-capable shell, with an interactive onboarding tour and Google sign-in.

---

## Highlights

| | |
|---|---|
| **Weighted scoring engine** | Daily score from a calories/protein/carbs/fat ratio table — not a naive sum. See [the algorithm](#the-daily-score-algorithm). |
| **Cron jobs** | Nightly job (`0 2 * * *`, São Paulo TZ) closes the previous day's scores and processes streaks; hourly job purges expired tokens. |
| **Role-based access** | `user → patient \| nutritionist` roles, guards, and a `PatientAccessService` that authorizes every patient-scoped resource. |
| **Connection requests** | Patients request a nutritionist by code; nutritionist accepts/rejects — a full request lifecycle. |
| **Multi-source food DB** | Foods sourced from TACO, USDA, CNF, LIVS, OFF, plus per-patient private foods. Trigram (`pg_trgm`) index for fuzzy search. |
| **PDF export** | Nutrition plans rendered to PDF via headless Chromium (Puppeteer + `@sparticuz/chromium`, serverless-ready). |
| **Hardened auth** | JWT in HTTP-only cookies, bcrypt, Helmet, per-route rate limiting, email verification, password reset, Google OAuth. |
| **PWA frontend** | React 19 (with React Compiler), Tailwind v4, TanStack Query, offline shell, Lottie animations, Shepherd onboarding tour. |
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
└─────────────────────────────┘         └──────────────┬───────────────┘
                                                        │
                                                        ▼
                                              ┌───────────────────┐
                                              │   PostgreSQL 16   │
                                              │   (Prisma + pg)   │
                                              └───────────────────┘
```

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
| **framer-motion** + **lottie-react** | Animations |
| **shepherd.js** | Guided onboarding tour |
| **react-hot-toast** | Notifications |

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

**Streaks** — the nightly cron closes each patient's score for the previous day, then the streak processor runs: a day scoring **≥ 8** extends `currentStreak` (and updates `bestStreak`); a lower day resets it. The "close day" step **must** run before the streak step — the jobs service enforces that ordering.

A **live score** endpoint computes the same value on demand from the current day's meals, so the UI shows progress before the day is closed.

Source: [`daily-score.service.ts`](server/src/modules/daily-score/daily-score.service.ts) · [`ratio-table.ts`](server/src/modules/daily-score/utils/ratio-table.ts) · [`jobs.service.ts`](server/src/modules/jobs/jobs.service.ts)

---

## Domain model

```
User ──1:1── Patient ──┬── Plan (1:1)          macro targets
  │  (role)            ├── Meal[] ── FoodItem[] ── Food | PrivateFood
  │                    ├── Recipe[] ── FoodItem[]
  │                    ├── DailyScore[]          one per day (@@unique patient+date)
  │                    └── currentStreak / bestStreak
  │
  └──1:1── Nutritionist ──┬── Patient[]          via connection code
                          └── ConnectionRequest[] (PENDING/ACCEPTED/REJECTED)
```

- **Meals** are typed `DAILY` (logged intake) or `PLAN` (template meals), and carry pre-computed macro totals on each `FoodItem` so scoring stays cheap.
- **Foods** come from external nutrition databases (`FoodSource` enum: TACO, USDA, CNF, LIVS, OFF, MANUAL); **PrivateFood** is per-patient.
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
echo 'VITE_API_URL=http://localhost:3000' > client/.env
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
| Frontend | http://localhost:5173 |
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

# bcrypt cost
SALT_ROUNDS=10

# Optional: cookie parent domain in prod (e.g. .strawby.com)
COOKIE_DOMAIN=

# Swagger Basic-Auth (dev only — disabled when NODE_ENV=production)
SWAGGER_USER=
SWAGGER_PASSWORD=
```

> The API **fails fast on boot** if `CORS_ORIGIN`, `JWT_SECRET`, or `DATABASE_URL` is missing.

`client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

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
| `POST` | `/auth/refresh` | yes | Rotate token |
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
| `GET` | `/user/me` | optional | Current user or `null` |
| `GET` | `/user/:id` | owner | Get user by id |
| `PATCH` | `/user/:id` | owner | Update own user |
| `DELETE` | `/user/:id` | owner | Hard-delete own account |

</details>

<details>
<summary><strong>Nutritionist & Connection</strong> — <code>/nutritionist</code>, <code>/connection-request</code></summary>

| Method | Route | Role | Description |
|---|---|---|---|
| `GET` | `/nutritionist/me` | nutritionist | Own profile |
| `GET` | `/nutritionist/me/patients` | nutritionist | List patients |
| `POST` | `/nutritionist/me/code` | nutritionist | Set/update connection code |
| `DELETE` | `/nutritionist/me` | patient | Disconnect from nutritionist |
| `POST` | `/connection-request` | patient | Request a nutritionist by code |
| `GET` | `/connection-request/nutritionist` | nutritionist | Pending requests |
| `PATCH` | `/connection-request/:id/accept` | nutritionist | Accept request |
| `PATCH` | `/connection-request/:id/reject` | nutritionist | Reject request |

</details>

<details>
<summary><strong>Food & Private food</strong> — <code>/food</code>, <code>/private-food</code></summary>

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/food/search` | — | Fuzzy search public catalog |
| `GET` | `/food/:id` | — | Food details |
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
| **bcrypt** | Passwords hashed with configurable salt rounds |
| **Helmet** | Security headers on every response |
| **CORS** | Locked to `CORS_ORIGIN` (supports multiple origins) |
| **Rate limiting** | Global 100 req/min; tighter on login (5/min) and password reset (3/min) |
| **ValidationPipe** | `whitelist` + `forbidNonWhitelisted` reject unknown fields |
| **Guards** | `AuthGuard`, `OptionalAuthGuard`, `OwnershipGuard`, role guard, `PatientAccessService` |
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

# Server
pnpm --filter server start:dev    # hot reload
pnpm --filter server start:prod   # production
pnpm --filter server test         # Jest
pnpm --filter server seed         # demo data
pnpm --filter server import:off   # food catalog

# Client
pnpm --filter client dev          # Vite dev server
pnpm --filter client build        # production build (PWA)

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
│   │   ├── common/               # guards, filters, hash, config, patient-access, utils
│   │   └── modules/
│   │       ├── auth/             # login, logout, refresh, Google, verify, reset
│   │       ├── user/             # accounts + onboarding
│   │       ├── patient/          # patient profile + streaks
│   │       ├── nutritionist/     # nutritionist profile + patients
│   │       ├── connection-request/  # patient <-> nutritionist linking
│   │       ├── plan/             # macro plans (+ PDF export)
│   │       ├── meal/             # daily & plan meals
│   │       ├── recipe/           # reusable food groupings
│   │       ├── food/             # public catalog (multi-source)
│   │       ├── private-food/     # per-patient foods
│   │       ├── daily-score/      # scoring engine
│   │       ├── jobs/             # cron (score close, streak, token cleanup)
│   │       ├── email/            # Resend transactional email
│   │       ├── pdf/              # headless-Chromium rendering
│   │       ├── database/         # PrismaService
│   │       └── health/
│   ├── prisma/                   # schema, migrations, seeds
│   └── Dockerfile
│
├── client/                       # React 19 PWA
│   └── src/
│       ├── api/                  # axios instance + interceptors
│       ├── modules/              # feature modules (components/hooks/service/types/skeletons)
│       ├── shared/               # reusable UI, contexts, layouts
│       └── pages/                # route-level screens
│
├── .claude/rules/                # documented architecture rules (server + client)
├── docker-compose.yml            # Postgres + API
├── pnpm-workspace.yaml
└── package.json                  # workspace root
```
