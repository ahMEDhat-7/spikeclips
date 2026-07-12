# SpikeClip

> Find what viewers actually rewatch — then make it beautiful.

[![CI](https://github.com/ahMEDhat-7/spikeclips/actions/workflows/ci.yml/badge.svg)](https://github.com/ahMEDhat-7/spikeclips/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SpikeClip extracts the most-replayed moments from YouTube videos using **actual viewer heatmap data** — not AI guesses. It identifies spikes in audience replay behavior and reformats those moments into vertical shorts ready for TikTok, YouTube Shorts, and Instagram Reels.

---

## Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, Tailwind 4 | UI for analysis, visualization, and clip download |
| **Backend** | NestJS 11, Prisma 6, BullMQ | API, job queues, video processing |
| **Algorithm** | TypeScript (ported from Python) | Spike detection, scene scoring, clip selection |
| **Storage** | PostgreSQL 18, Redis 8, MinIO | Database, queues, file storage |
| **External** | yt-dlp, FFmpeg | YouTube data extraction, video processing |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** 9.x
- **Docker** + Docker Compose
- **yt-dlp** — `pip install yt-dlp`
- **FFmpeg** — `apt install ffmpeg` (Linux) / `brew install ffmpeg` (macOS)

### 1. Clone & Install

```bash
git clone git@github.com:ahMEDhat-7/spikeclips.git
cd spikeclips
pnpm install
```

### 2. Start Docker Services

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts:
- **PostgreSQL** on port `5433`
- **Redis** on port `6380`
- **MinIO** on ports `9000` (API) and `9001` (Console)

### 3. Set Up Environment

```bash
cp .env.example apps/api/.env
```

Edit `apps/api/.env` if needed (defaults work with Docker services above).

### 4. Run Database Migrations

```bash
pnpm --filter @spikeclips/api prisma:migrate
```

### 5. Start Development Servers

```bash
pnpm dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api/docs

---

## Architecture

### Monorepo Structure

```
spikeclips/
├── apps/
│   ├── api/          # NestJS 11 backend
│   └── web/          # Next.js 16 frontend
├── packages/
│   └── shared/       # Shared types + algorithm
├── deploy/           # VPS deployment scripts
├── docker/           # Docker Compose + Nginx
├── docs/             # PRD, plan, tasks
└── turbo.json        # Turborepo config
```

### Clean Architecture

Both API and Web follow Clean Architecture principles:

```
domain/        → Entities, value objects, repository interfaces
application/   → Use cases, DTOs, mappers
infrastructure/ → Database, storage, external services, workers
presentation/  → Controllers (API), components (Web)
```

### Data Flow

```
YouTube URL
    ↓
yt-dlp extracts heatmap data
    ↓
Algorithm merges spikes → scores scenes
    ↓
User selects scenes
    ↓
FFmpeg trims + reformats to vertical
    ↓
Clips stored (local/MinIO)
```

---

## Project Structure

```
spikeclips/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma           # Database schema
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── main.ts                 # Bootstrap, CORS, Swagger
│   │   │   ├── app.module.ts           # Root module
│   │   │   ├── application/            # Use cases, DTOs
│   │   │   ├── domain/                 # Entities, interfaces
│   │   │   ├── infrastructure/         # Prisma, auth, workers, storage
│   │   │   ├── presentation/           # Controllers, filters
│   │   │   └── health/                 # Health check endpoint
│   │   └── test/                       # E2E tests
│   │
│   └── web/
│       ├── public/                     # Static assets (favicon, logo)
│       └── src/
│           ├── app/                    # App Router pages
│           ├── application/            # Hooks, providers
│           ├── components/             # Shared UI components
│           ├── domain/                 # Entities, ports
│           ├── infrastructure/         # API clients
│           └── presentation/           # Feature components
│
├── packages/
│   └── shared/
│       └── src/
│           ├── types.ts                # Shared type definitions
│           └── algorithm/
│               └── merge.ts            # Spike detection algorithm
│
├── deploy/                             # Production deployment
├── docker/                             # Docker Compose
└── docs/                               # Documentation
```

---

## Packages

### @spikeclips/shared

Shared types and algorithm used by both API and Web.

**Types:**

| Type | Description |
|------|-------------|
| `HeatmapSpike` | Raw heatmap data point (start_time, end_time, value) |
| `MergedBlock` | Merged contiguous spikes |
| `ScoredBlock` | Scored scene with duration, intensity, and composite score |
| `AlgorithmConfig` | Algorithm parameters |
| `Job` | Analysis job with status, scenes, heatmap data |
| `Clip` | Exported video clip |
| `User` | User account with plan and usage limits |

**Algorithm Pipeline:**

1. `normalizeHeatmapValues()` — Normalizes intensity to 0–1 range
2. `mergeHeatmapSpikes()` — Merges contiguous spikes with gap tolerance
3. `capAndScoreBlocks()` — Applies duration limits and computes composite score
4. `selectTopScenes()` — Greedy selection with non-overlap constraints

**Default Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `gap_tolerance` | 5.0s | Max gap between spikes to merge |
| `intensity_tolerance` | 0.25 | Max intensity delta to merge |
| `min_intensity_cutoff` | 0.40 | Floor override threshold |
| `min_clip_duration` | 3.0s | Minimum clip length |
| `max_clip_duration` | 60.0s | Maximum clip length |
| `target_duration_range` | [15.0, 60.0] | Ideal clip duration |
| `top_n` | 3 | Number of scenes to select |
| `min_spacing` | 5.0s | Minimum gap between selected scenes |
| `weight_peak` | 0.4 | Peak intensity score weight |
| `weight_avg` | 0.4 | Average intensity score weight |
| `weight_duration_fit` | 0.2 | Duration fitness score weight |

**Tests:** 49 test cases covering merge, scoring, selection, normalization, and edge cases.

---

### @spikeclips/api (NestJS Backend)

**Module Structure:**

| Module | Purpose |
|--------|---------|
| `AppModule` | Root module, ThrottlerModule, global guards |
| `AuthModule` | JWT authentication, login/register |
| `PrismaModule` | Database connection |
| `StorageModule` | Local/MinIO file storage (configurable) |
| `SentryModule` | Error tracking |
| `LoggingModule` | Structured logging (pino) |

**Workers (BullMQ):**

| Worker | Queue | Purpose |
|--------|-------|---------|
| `HeatmapWorker` | `analysis` | Extracts heatmap, runs algorithm |
| `ClipWorker` | `export` | Downloads, trims, uploads clips |

---

### @spikeclips/web (Next.js Frontend)

**Pages:**

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing |
| `/dashboard` | Main analysis interface |
| `/login` | Email/password login |
| `/register` | Account registration |
| `/features` | Feature showcase |
| `/pricing` | Pricing tiers |
| `/about` | About page |

**Design System:**

- **Primary:** Red (`#E63946`) — intensity, urgency
- **Secondary:** Orange (`#FF6B35`) — heat, energy
- **Fonts:** Inter (body), JetBrains Mono (data/code)
- **Dark/Light:** Theme via `next-themes`

---

## Database Schema

### User

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `email` | String | Unique identifier |
| `passwordHash` | String | bcrypt hashed password |
| `name` | String? | Display name |
| `plan` | String | `free` / `pro` / `team` |
| `stripeCustomerId` | String? | Stripe integration |
| `analysesUsed` | Int | Current period usage |
| `analysesLimit` | Int | Monthly limit (default: 3) |
| `createdAt` | DateTime | Account creation |
| `updatedAt` | DateTime | Last update |

### Job

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | String | FK → User |
| `url` | String | YouTube URL |
| `videoTitle` | String? | Extracted metadata |
| `videoThumbnail` | String? | Thumbnail URL |
| `videoDuration` | Float? | Duration in seconds |
| `status` | String | `pending` / `processing` / `completed` / `failed` |
| `scenes` | Json? | `ScoredBlock[]` from algorithm |
| `heatmapData` | Json? | `HeatmapSpike[]` from yt-dlp |
| `errorMessage` | String? | Error details |
| `createdAt` | DateTime | Job creation |
| `completedAt` | DateTime? | Completion timestamp |

### Clip

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `jobId` | String | FK → Job |
| `sceneIndex` | Int | Scene index in job |
| `startTime` | Float | Start time (seconds) |
| `endTime` | Float | End time (seconds) |
| `peakIntensity` | Float? | Peak heatmap intensity |
| `status` | String | `pending` / `processing` / `completed` / `failed` |
| `fileUrl` | String? | Storage path/URL |
| `fileSize` | Int? | File size in bytes |
| `duration` | Float? | Clip duration |
| `errorMessage` | String? | Error details |
| `createdAt` | DateTime | Clip creation |
| `completedAt` | DateTime? | Completion timestamp |

**Relations:**
- User → Job: One-to-many
- Job → Clip: One-to-many

---

## API Reference

All endpoints prefixed with `/api`. Swagger docs at `/api/docs`.

### Health

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/health` | Public | Global | Health check (status, timestamp, uptime) |

### Auth

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/auth/register` | Public | 5/min | Create account, returns JWT |
| `POST` | `/api/auth/login` | Public | 5/min | Login, returns JWT |
| `GET` | `/api/auth/me` | Bearer | Global | Get current user profile |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Auth Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "free"
  }
}
```

### Jobs

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/jobs` | Bearer | 5/min | Create analysis job |
| `GET` | `/api/jobs` | Bearer | Global | List user's jobs |
| `GET` | `/api/jobs/:id` | Bearer | Global | Get job by ID |
| `POST` | `/api/jobs/:id/process` | Bearer | 5/min | Run algorithm on heatmap |
| `POST` | `/api/jobs/:id/export` | Bearer | 3/min | Export clips for scenes |
| `GET` | `/api/jobs/:id/clips` | Bearer | Global | Get clips for job |

**Create Job Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Job Response:**
```json
{
  "id": "uuid",
  "url": "https://www.youtube.com/watch?v=...",
  "videoTitle": "Video Title",
  "videoThumbnail": "https://...",
  "videoDuration": 360.5,
  "status": "completed",
  "scenes": [
    {
      "start_time": 45.2,
      "end_time": 78.4,
      "duration": 33.2,
      "peak_intensity": 0.92,
      "avg_intensity": 0.78,
      "score": 0.85,
      "confidence": "high",
      "capped": false
    }
  ],
  "heatmapData": [...],
  "createdAt": "2026-07-12T12:00:00.000Z"
}
```

**Export Request:**
```json
{
  "sceneIndices": [0, 2]
}
```

### Clips

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/clips/job/:jobId` | Bearer | Global | List clips by job ID |
| `GET` | `/api/clips/:id/download` | Bearer | Global | Download clip (redirect to signed URL) |

---

## Environment Variables

### Required

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | — |
| `PORT` | API server port | `3001` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |

### Storage

| Variable | Description | Default |
|----------|-------------|---------|
| `STORAGE_DRIVER` | `local` or `minio` | `local` |
| `CLIPS_DIR` | Local clips storage path | `/tmp/spikeclips-clips` |
| `CLIPS_BASE_URL` | Base URL for clip downloads | `http://localhost:3001/api` |

### MinIO (when `STORAGE_DRIVER=minio`)

| Variable | Description | Default |
|----------|-------------|---------|
| `MINIO_ENDPOINT` | MinIO host | `localhost` |
| `MINIO_PORT` | MinIO port | `9000` |
| `MINIO_ACCESS_KEY` | Access key | `minioadmin` |
| `MINIO_SECRET_KEY` | Secret key | `minioadmin` |
| `MINIO_BUCKET` | Bucket name | `spikeclips-clips` |
| `MINIO_USE_SSL` | Use SSL | `false` |

### Workers

| Variable | Description | Default |
|----------|-------------|---------|
| `HEATMAP_WORKER_CONCURRENCY` | Heatmap worker threads | `5` |
| `CLIP_WORKER_CONCURRENCY` | Clip worker threads | `3` |
| `UV_THREADPOOL_SIZE` | libuv thread pool | `4` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `http://localhost:3000` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry error tracking | `""` |
| `SENTRY_ENVIRONMENT` | Sentry environment tag | `development` |

See `.env.example` for a complete template.

---

## Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests by Package

```bash
# Shared (algorithm)
pnpm --filter @spikeclips/shared test

# API
pnpm --filter @spikeclips/api test
pnpm --filter @spikeclips/api test:e2e

# Web
pnpm --filter @spikeclips/web test
```

### Test Coverage

| Package | Tests | Focus |
|---------|-------|-------|
| `@spikeclips/shared` | 49 | Algorithm: merge, scoring, selection, normalization |
| `@spikeclips/api` | 27 | Unit + E2E: health, jobs, clips endpoints |
| `@spikeclips/web` | 14 | Component tests: ClipCard, SceneCard, validation |
| **Total** | **90** | |

### CI Pipeline

GitHub Actions runs on push to `main`/`develop` and PRs to `main`:
1. **Lint** — TypeScript type checking
2. **Test** — All packages
3. **Build** — Full build verification

---

## Deployment

### Local Development

```bash
# Start all services (Docker + both apps)
pnpm dev

# Or start individually
docker compose -f docker/docker-compose.yml up -d  # Postgres, Redis, MinIO
pnpm --filter @spikeclips/api dev                   # API on :3001
pnpm --filter @spikeclips/web dev                   # Web on :3000
```

### Production (VPS)

**Target Specs:** AMD Ryzen 7 7700X, 6GB DDR5, 120GB NVMe, 1Gbps, Ubuntu 24.04

**Quick Setup:**

```bash
# 1. Upload deploy/ to VPS
scp -r deploy/ root@your-vps:/opt/spikeclips/

# 2. Run setup script
ssh root@your-vps
cd /opt/spikeclips
chmod +x deploy/setup.sh
./deploy/setup.sh
```

**What setup.sh does:**
- Installs Docker, Node.js 20, pnpm 9, yt-dlp, FFmpeg
- Creates `spikeclips` system user
- Clones repo, installs dependencies, builds
- Installs systemd services
- Configures UFW firewall (ports 22, 80, 443)
- Configures Nginx reverse proxy

**Security Hardening:**

```bash
chmod +x deploy/harden.sh
./deploy/harden.sh
```

- Changes SSH port to 2222
- Disables root login
- Enforces SSH key authentication
- Installs Fail2Ban (5 retries → 1hr ban)
- Enables unattended security updates

**Service Management:**

```bash
./deploy/start.sh   # Start all services
./deploy/stop.sh    # Stop all services
```

**Systemd Services:**

| Service | Memory Limit | CPU Limit |
|---------|--------------|-----------|
| `spikeclips-api` | 1.5GB | 80% |
| `spikeclips-web` | 1GB | 60% |

**Nginx Configuration:**
- HTTP → HTTPS redirect
- SSL via Let's Encrypt / Certbot
- Rate limiting: 30 req/min (API), 5 req/min (auth)
- Security headers (CSP, HSTS, X-Frame-Options)
- Proxy to API (127.0.0.1:3001) and Web (127.0.0.1:3000)

---

## Scripts Reference

### Root Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps (TypeScript type check) |
| `pnpm test` | Run all tests |

### API Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/api dev` | Start API in watch mode |
| `pnpm --filter @spikeclips/api build` | Build API |
| `pnpm --filter @spikeclips/api start` | Start production API |
| `pnpm --filter @spikeclips/api test` | Run unit tests |
| `pnpm --filter @spikeclips/api test:e2e` | Run E2E tests |
| `pnpm --filter @spikeclips/api prisma:migrate` | Run database migrations |
| `pnpm --filter @spikeclips/api prisma:studio` | Open Prisma Studio |

### Web Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/web dev` | Start Next.js dev server (Turbopack) |
| `pnpm --filter @spikeclips/web build` | Build Next.js |
| `pnpm --filter @spikeclips/web start` | Start production server |
| `pnpm --filter @spikeclips/web test` | Run tests |

---

## Contributing

### Code Style

- **TypeScript strict mode** — No `any` types allowed
- **Clean Architecture** — Follow domain → application → infrastructure → presentation
- **Import from `@spikeclips/shared`** — Use path aliases, not relative imports
- **Functional code** — Prefer pure functions, avoid classes where possible

### Git Conventions

- `feat:` — New feature
- `fix:` — Bug fix
- `chore:` — Maintenance, config, dependencies
- `docs:` — Documentation changes
- `refactor:` — Code restructuring without behavior change
- `test:` — Adding or updating tests

### PR Workflow

1. Create feature branch from `develop`
2. Make changes following code style
3. Run `pnpm lint` and `pnpm test`
4. Commit with conventional format
5. Open PR to `develop`

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document (537 lines) |
| [plan.md](docs/plan.md) | Master plan with validation phases |
| [TASKS.md](docs/TASKS.md) | Detailed task breakdown by phase |
| [AGENTS.md](AGENTS.md) | Agent instructions and project overview |
| [CreateYTShorts.py](CreateYTShorts.py) | Python reference algorithm (v2) |

---

## License

MIT
