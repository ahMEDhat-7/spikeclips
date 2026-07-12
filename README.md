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

- **Node.js** ≥ 24
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

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](API.md) | All endpoints, request/response examples |
| [Database Schema](SCHEMA.md) | User, Job, Clip tables with field definitions |
| [Algorithm](ALGORITHM.md) | Spike detection pipeline and parameters |
| [Deployment](DEPLOYMENT.md) | Local dev + VPS production setup |
| [Contributing](CONTRIBUTING.md) | Code style, git conventions, PR workflow |
| [Security](SECURITY.md) | Security practices and vulnerability reporting |
| [PRD](docs/PRD.md) | Product Requirements Document |
| [Plan](docs/plan.md) | Master plan with validation phases |
| [Tasks](docs/TASKS.md) | Detailed task breakdown by phase |

---

## Testing

```bash
pnpm test                                    # All packages (90 tests)
pnpm --filter @spikeclips/shared test        # Algorithm (49 tests)
pnpm --filter @spikeclips/api test           # API (27 tests)
pnpm --filter @spikeclips/web test           # Frontend (14 tests)
```

### CI Pipeline

GitHub Actions runs on push to `main`/`develop` and PRs to `main`:
1. **Lint** — TypeScript type checking
2. **Test** — All packages
3. **Build** — Full build verification

---

## Scripts Reference

### Root

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps (TypeScript type check) |
| `pnpm test` | Run all tests |

### API

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/api dev` | Start API in watch mode |
| `pnpm --filter @spikeclips/api build` | Build API |
| `pnpm --filter @spikeclips/api start` | Start production API |
| `pnpm --filter @spikeclips/api test` | Run unit tests |
| `pnpm --filter @spikeclips/api test:e2e` | Run E2E tests |
| `pnpm --filter @spikeclips/api prisma:migrate` | Run database migrations |
| `pnpm --filter @spikeclips/api prisma:studio` | Open Prisma Studio |

### Web

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/web dev` | Start Next.js dev server (Turbopack) |
| `pnpm --filter @spikeclips/web build` | Build Next.js |
| `pnpm --filter @spikeclips/web start` | Start production server |
| `pnpm --filter @spikeclips/web test` | Run tests |

---

## Environment Variables

See [.env.example](.env.example) for a complete template. Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6380` |
| `REDIS_PASSWORD` | Redis password | — |
| `JWT_SECRET` | JWT signing secret | — |
| `STORAGE_DRIVER` | `local` or `minio` | `local` |

Full reference in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## License

MIT
