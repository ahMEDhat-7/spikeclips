# SpikeClip

> Find what viewers actually rewatch — then make it beautiful.

[![CI](https://github.com/ahMEDhat-7/SpikeClip/actions/workflows/ci.yml/badge.svg)](https://github.com/ahMEDhat-7/SpikeClip/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-24-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SpikeClip** turns YouTube videos into vertical shorts using **real viewer
heatmap data** — not AI guesses. It detects spikes in audience replay behavior
and reformats those moments into clips ready for TikTok, YouTube Shorts, and
Instagram Reels.

---

## Table of Contents

- [How it works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Storage & Clip Delivery](#storage--clip-delivery)
- [Testing & CI](#testing--ci)
- [Scripts](#scripts)
- [Environment](#environment)
- [Documentation](#documentation)
- [License](#license)

---

## How it works

```
YouTube URL
    │
    ▼
yt-dlp extracts the viewer heatmap (replay intensity over time)
    │
    ▼
Algorithm merges nearby spikes → scores scenes → ranks by replay value
    │
    ▼
User picks the moments they want
    │
    ▼
FFmpeg trims, reframes to vertical (9:16), adds caption/music
    │
    ▼
Clips delivered (local disk or MinIO object storage)
```

The spike-merging algorithm (gap tolerance 5s, intensity delta 0.25, floor 0.40,
min clip 3s, max clip 60s) lives in `packages/shared/algorithm/` and is the
TypeScript port of the canonical `CreateYTShorts.py`.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 · React 19 · Tailwind 4 | Analysis UI, heatmap visualization, clip library |
| **Backend** | NestJS 11 · Prisma 6 · BullMQ | REST API, job queues, video processing workers |
| **Algorithm** | TypeScript (ported from Python) | Spike detection, scene scoring, clip selection |
| **Storage** | PostgreSQL 18 · Redis 8 · MinIO | Database, queues/cache, clip object storage |
| **Media** | yt-dlp · FFmpeg | YouTube metadata + heatmap, transcoding |

Everything runs as a single Docker Compose stack on your VPS: Postgres, Redis,
nginx, and MinIO are all containers; the app images are built from the included
multi-stage Dockerfiles.

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 24
- **pnpm** 9.x
- **Docker** + Docker Compose v2
- **yt-dlp** — `pip install yt-dlp`
- **FFmpeg** — `apt install ffmpeg` (Linux) / `brew install ffmpeg` (macOS)

### 1. Clone & install

```bash
git clone git@github.com:ahMEDhat-7/SpikeClip.git
cd SpikeClip
pnpm install
```

### 2. Start infrastructure

```bash
docker compose -f docker-compose.yml up -d
```

Brings up:

| Service | Port (host) | Notes |
|---------|-------------|-------|
| PostgreSQL | `5433` → `5432` | user `spikeclips` / db `spikeclips` |
| Redis | `6380` → `6379` | password `spikeclips_dev_redis` |
| MinIO API | `9000` (loopback) | `minioadmin` / `minioadmin` |
| MinIO Console | `9001` (loopback) | |
| nginx | `80` | reverse proxy → api + web |

> **Note:** MinIO is bound to `127.0.0.1` by default so only the API container
> can reach it. To serve clips to browsers you must expose MinIO (bind `0.0.0.0`,
> set `MINIO_USE_SSL=true` with a real cert, or proxy it through nginx) and set
> `MINIO_ENDPOINT` to the publicly reachable host. See
> [Storage & Clip Delivery](#storage--clip-delivery).

### 3. Configure environment

```bash
cp .env.example apps/api/.env
```

The defaults match the Docker services above. At minimum set `JWT_SECRET` and
your Google OAuth credentials.

### 4. Migrate & run

```bash
pnpm --filter @spikeclips/api prisma:migrate   # apply schema
pnpm dev                                        # api :3001 · web :3000
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Swagger:** http://localhost:3001/api/docs

### Production

```bash
pnpm build      # build all apps + docker images
pnpm start      # run all apps in production mode
```

---

## Project Structure

```
SpikeClip/
├── apps/
│   ├── api/            # NestJS 11 backend
│   └── web/            # Next.js 16 frontend
├── packages/
│   └── shared/         # shared types + spike algorithm
├── deploy/             # VPS deployment (compose + nginx)
├── docker/             # Docker Compose + nginx config
├── docs/               # PRD, plan, tasks
└── turbo.json          # Turborepo pipeline
```

Both apps follow **Clean Architecture**:

```
domain/         → entities, value objects, repository interfaces
application/    → use cases, DTOs, mappers
infrastructure/ → database, storage, external services, workers
presentation/   → controllers (API) / components (Web)
```

---

## Authentication

SpikeClip uses **Google OAuth 2.0 only** — there is no email/password or GitHub
login. Sessions are cookie-based JWTs (`httpOnly`, signed with `JWT_SECRET`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Redirect to Google consent |
| `/api/auth/google/callback` | GET | Google callback; sets the session cookie |
| `/api/auth/logout` | POST | Clears the cookie (public) |
| `/api/auth/me` | GET | Current user from cookie |
| `/api/auth/me` | PATCH | Update profile |

**Tiers:** Free — 3 analyses/month, 3 scenes max. Pro / Team — unlimited.

---

## Storage & Clip Delivery

Clips are stored via the `STORAGE_DRIVER` setting:

- **`local`** — written to disk; served from the API (`CLIPS_BASE_URL`).
- **`minio`** — uploaded to a MinIO bucket; the API returns **presigned URLs**
  generated from `MINIO_ENDPOINT` / `MINIO_PORT`.

### Making clips load in the browser (MinIO)

The presigned URLs point at whatever `MINIO_ENDPOINT` is configured. For the
browser to actually fetch them, **one** of these must be true:

1. **Public MinIO** — bind `9000:9000` (not `127.0.0.1`), set
   `MINIO_ENDPOINT` to your public host, `MINIO_USE_SSL=true`, and serve a TLS
   cert (or front MinIO with nginx). Then add that host to the nginx
   `Content-Security-Policy` `img-src` / `media-src` directives.
2. **Proxy through nginx** — add a `location /storage/` that proxies
   `http://minio:9000` and generate path-based URLs (`<site>/storage/<key>`)
   instead of raw MinIO host URLs.

The shipped `deploy/nginx/spikeclips.conf` does **not** yet proxy MinIO — add the
`location` block above and whitelist the host in CSP before going live with
MinIO storage.

---

## Testing & CI

```bash
pnpm test                                     # all packages (unit)
pnpm --filter @spikeclips/shared test         # algorithm (57 tests)
pnpm --filter @spikeclips/api test            # API unit (27 tests)
pnpm --filter @spikeclips/web test            # frontend (14 tests)
pnpm --filter @spikeclips/api test:e2e        # API end-to-end (needs Postgres + Redis + MinIO)
```

### CI Pipeline

GitHub Actions runs on push/PR to `main` (Node 24, pnpm 9):

| # | Job | What it verifies |
|---|-----|------------------|
| 1 | **Lint** | TypeScript type-check across apps |
| 2 | **Security Audit** | `pnpm audit` |
| 3 | **Test** | Unit tests for all packages |
| 4 | **API E2E** | Boots real Postgres + Redis + MinIO via `docker compose`, runs `prisma migrate deploy`, then the e2e suite |
| 5 | **Build** | Full build of all apps |
| 6 | **Docker Build** | Builds the `api` + `web` images (VPS deploy path) |

> The E2E job intentionally mirrors the compose-defined infrastructure so CI
> validates the same stack that runs in production.

---

## Scripts

### Root

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps |
| `pnpm start` | Start all apps in production |
| `pnpm lint` | Type-check all apps |
| `pnpm test` | Run all tests |
| `pnpm dev:api` / `pnpm dev:web` | Run a single app |
| `pnpm build:shared` | Build the shared package |
| `pnpm start:api` / `pnpm start:web` | Run a single app (production) |

### API

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/api dev` | Watch mode |
| `pnpm --filter @spikeclips/api build` | Build |
| `pnpm --filter @spikeclips/api start` | Production server |
| `pnpm --filter @spikeclips/api test` | Unit tests |
| `pnpm --filter @spikeclips/api test:e2e` | End-to-end tests |
| `pnpm --filter @spikeclips/api prisma:migrate` | Apply migrations |
| `pnpm --filter @spikeclips/api prisma:studio` | Open Prisma Studio |

### Web

| Command | Description |
|---------|-------------|
| `pnpm --filter @spikeclips/web dev` | Next.js dev (Turbopack) |
| `pnpm --filter @spikeclips/web build` | Build |
| `pnpm --filter @spikeclips/web start` | Production server |
| `pnpm --filter @spikeclips/web test` | Tests |

---

## Environment

Start from [.env.example](.env.example). Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis connection | `localhost` / `6380` / — |
| `JWT_SECRET` | JWT signing secret | — |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth | — |
| `STORAGE_DRIVER` | `local` or `minio` | `local` |
| `MINIO_ENDPOINT` / `MINIO_PORT` / `MINIO_BUCKET` | MinIO connection | `localhost` / `9000` / `spikeclips` |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` / `MINIO_USE_SSL` | MinIO credentials | — |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_*_PRICE_ID` | Payments | — |

Full reference in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](API.md) | Endpoints, request/response examples |
| [Database Schema](SCHEMA.md) | User, Job, Clip tables |
| [Algorithm](ALGORITHM.md) | Spike detection pipeline + parameters |
| [Deployment](DEPLOYMENT.md) | Local dev + VPS production |
| [Contributing](CONTRIBUTING.md) | Style, git + PR conventions |
| [Security](SECURITY.md) | Practices + vulnerability reporting |
| [PRD](docs/PRD.md) | Product Requirements |
| [Plan](docs/plan.md) | Master plan & validation phases |
| [Tasks](docs/TASKS.md) | Phase-by-phase task breakdown |

---

## License

[MIT](LICENSE)
