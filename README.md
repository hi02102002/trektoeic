# TrekToeic

A full-stack TOEIC English test preparation platform. Study vocabulary with spaced repetition, drill individual test parts, and take full ETS-style mock tests — all tracked with detailed history.

## Features

- **Mock Tests** — Full 7-part TOEIC mock tests sourced from ToeicMax, with per-question history review
- **Part Practice** — Drill individual TOEIC parts (1–7) in isolated sessions
- **Vocabulary System** — Hierarchical vocabulary categories with UK/US audio, images, and meanings
- **Grammar (DB)** — Topics, sections, and exercises seeded from `packages/scripts/data/grammar-courses.json` or from the ToeicMax crawl (`toiecmax-courses.json` via `seed:grammar:toeicmax`); served via oRPC
- **Spaced Repetition** — SM-2-based flashcard review (`new → learning → review → relearning`)
- **Authentication** — Email/password, Magic Link, and Google OAuth via `better-auth`
- **Type-safe API** — End-to-end oRPC with OpenAPI spec generation and rate limiting
- **SSR + Streaming** — TanStack Start on Nitro for fast first loads
- **OG Image & Sitemap** — Dynamically generated per-route

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TanStack |
| Styling | Tailwind CSS v4, shadcn/ui |
| API | oRPC |
| Auth | better-auth (Drizzle adapter, Google OAuth, Magic Link) |
| Database | PostgreSQL 16, Drizzle ORM, Kysely |
| Storage | Cloudflare R2, Backblaze B2 |
| Email | Unosend (React Email templates) |
| Build | Turborepo, pnpm workspaces |
| Linting | Biome v2 |

## Monorepo Structure

```
apps/
  web/          # Full-stack web app (TanStack Start + Nitro)
packages/
  api/          # oRPC routers
  auth/         # better-auth configuration
  db/           # Drizzle schema, migrations, Kysely queries
  env/          # Type-safe env validation (@t3-oss/env-core)
  schemas/      # Shared Zod schemas for API validation
  crawler/      # Web crawlers for ToeicMax and Study4 data
  scripts/      # One-off seed scripts and data JSON files
  mailer/       # Transactional email (Magic Link, etc.)
  uploads/      # File upload helpers (R2/B2)
  logger/       # Pino-based shared logger
  utils/        # Shared utility functions
  config/       # Base TypeScript config
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm 9.15.2
- Docker (for local PostgreSQL)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy and fill in the variables in `apps/web/.env.local`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on port `5432` (user: `trektoeic`, password: `vohoanghuy`, db: `trektoeic`).

### 4. Push the schema

```bash
pnpm db:push
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
# Development
pnpm dev              # Start all apps (Turborepo)
pnpm dev:web          # Start web app only

# Build
pnpm build            # Build all packages and apps
pnpm check-types      # TypeScript type-check all packages

# Code quality
pnpm check            # Biome lint + format

# Database
pnpm db:push          # Push schema to dev DB
pnpm db:push:prod     # Push schema to prod DB
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run migrations (dev)
pnpm db:migrate:prod  # Run migrations (prod)
pnpm db:studio        # Open Drizzle Studio
pnpm db:pull          # Introspect schema from DB

# Data seed (run from repo root; uses apps/web/.env.local)
pnpm --filter @trektoeic/scripts seed:grammar   # grammar_courses / grammar_topics / … from grammar-courses.json
pnpm --filter @trektoeic/scripts seed:grammar:toeicmax   # map ToeicMax dump (default: data/toiecmax-courses.json)
# Optional: GRAMMAR_TOEICMAX_COURSE_IDS=1,2  GRAMMAR_TOEICMAX_FILE=other.json

# Email
pnpm dev:mailer       # Preview React Email templates

# Maintenance
pnpm clean            # Remove all node_modules and dist
pnpm reset            # clean + prune pnpm store + reinstall
```

## Environment Variables

All variables are validated at startup by `@t3-oss/env-core`. Create `apps/web/.env.local` for local development.

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for signing auth sessions |
| `BETTER_AUTH_URL` | Base URL for auth callbacks (e.g. `http://localhost:3000`) |
| `VITE_BASE_URL` | Frontend base URL (e.g. `http://localhost:3000`) |

### Google OAuth

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### Email

| Variable | Description |
|---|---|
| `UNOSEND_API_KEY` | Unosend API key for transactional email |

### Storage

| Variable | Description |
|---|---|
| `CLOUDFLARE_BUCKET_NAME` | R2 bucket name |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_ACCESS_KEY_ID` | R2 access key |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | R2 secret key |
| `BACKBLAZE_BUCKET_NAME` | B2 bucket name |
| `BACKBLAZE_APPLICATION_KEY_ID` | B2 application key ID |
| `BACKBLAZE_APPLICATION_KEY` | B2 application key |
| `BACKBLAZE_REGION` | B2 region |

### Cache

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `CLOUDFLARE_API_TOKEN_KV` | Cloudflare API token for KV |
| `CLOUDFLARE_KV_NAMESPACE_ID` | Cloudflare KV namespace ID |

### Other

| Variable | Description |
|---|---|
| `CORS_ORIGIN` | Comma-separated allowed CORS origins |
| `PORT` | Server port (default `3000`) |
| `TOIECMAX_API_URL` | ToeicMax external API base URL |
| `TOIECMAX_APP_MIX` | ToeicMax app mix token |
| `DEBUG_STORAGE` | Enable storage debug logging (`true`/`false`) |

## Deployment

The project is deployed to **Vercel** (main branch only). Branch deployments for `dev` are disabled via `vercel.json`.

```bash
pnpm build
```

The Nitro output is in `apps/web/.output/`.





## Project Structure

```
trektoeic/
├── apps/
│   └── web/         # Fullstack application (React + TanStack Start)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting
