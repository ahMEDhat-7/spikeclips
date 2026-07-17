# SpikeClip

> Find what viewers actually rewatch — then make it beautiful.

[![CI](https://github.com/ahMEDhat-7/SpikeClip/actions/workflows/ci.yml/badge.svg)](https://github.com/ahMEDhat-7/SpikeClip/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-24-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SpikeClip extracts the most-replayed moments from YouTube videos using **actual viewer heatmap data** — not AI guesses. It detects spikes in audience replay behavior and reformats those moments into vertical shorts ready for TikTok, YouTube Shorts, and Instagram Reels.

---

## Architecture

```
                          ┌─────────────────────────────────┐
                          │         nginx (port 80)         │
                          │      reverse proxy → web        │
                          └──────────────┬──────────────────┘
                                         │
                          ┌──────────────▼──────────────────┐
                          │      Next.js web (port 3000)    │
                          │  /api/* → proxy to API (intern) │
                          └──────────────┬──────────────────┘
                                         │ Docker network
                          ┌──────────────▼───────────────────┐
                          │      NestJS API :3001            │
                          │         (internal only)          │
                          └──────────┬───────────────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │               │               │
         ┌───────────▼─────┐ ┌───────▼──────┐ ┌──────▼─────────┐
         │  PostgreSQL 18  │ │   Redis 8    │ │    MinIO       │
         │ (localhost:5432)│ │ (localhost:  │ │ (localhost:    │
         └─────────────────┘ │     6379)    │ │  9000/9001)    │
                             └──────────────┘ └────────────────┘
```

- **nginx** is the only public entry point. It proxies to the web server only.
- **Next.js** handles user-facing concerns and proxies `/api/*` internally. It never connects to Postgres, Redis, or MinIO directly.
- **NestJS API** is the single backend gateway — all data access flows through it.
- **PostgreSQL, Redis, MinIO** are only reachable from the API layer.

---

## Quick Start

### Prerequisites

- **Node.js** >= 24
- **pnpm** 9.x
- **Docker** + Docker Compose v2
- **yt-dlp** — `pip install yt-dlp`
- **FFmpeg** — `apt install ffmpeg` / `brew install ffmpeg`

### 1. Clone & install

```bash
git clone git@github.com:ahMEDhat-7/SpikeClip.git
cd SpikeClip
pnpm install
```

### 2. Start infrastructure

```bash
./scripts/dev.sh
```

This starts Postgres (5432), Redis (6379), and MinIO (9000/9001) in Docker.

### 3. Configure environment

```bash
cp .env.example apps/api/.env
```

Set your Google OAuth credentials at minimum.

### 4. Migrate & run

```bash
pnpm --filter @spikeclips/api prisma:migrate
pnpm dev
```

- **Frontend:** http://localhost:3000
- **Swagger:** http://localhost:3001/api/docs

---

## Project Structure

```
SpikeClip/
├── apps/
│   ├── api/            # NestJS 11 backend (internal)
│   └── web/            # Next.js 16 frontend (public)
├── packages/
│   └── shared/         # shared types + spike algorithm
├── deploy/             # VPS deployment (systemd, nginx, scripts)
├── docker/             # Nginx config for Docker
├── scripts/            # dev.sh, prod.sh
├── docs/               # PRD, plan, tasks
└── docker-compose.yml  # Full stack (all services)
```

---

## Authentication

**Google OAuth 2.0 only.** Sessions are cookie-based JWTs (`httpOnly`).

- `GET /api/auth/google` — redirect to Google consent
- `GET /api/auth/google/callback` — sets session cookie
- `POST /api/auth/logout` — clears cookie
- `GET /api/auth/me` — current user

**Tiers:** Free (3 analyses/month, 3 scenes). Pro / Team (unlimited).

---

## Testing & CI

```bash
pnpm test                              # all unit tests
pnpm --filter @spikeclips/api test:e2e # e2e (needs docker compose up)
```

CI runs 6 jobs: Lint, Security Audit, Test, API E2E (compose infra), Build, Docker Build.

---

## Documentation

| Document                        | Description                          |
| ------------------------------- | ------------------------------------ |
| [API Reference](API.md)         | Endpoints, request/response examples |
| [Database Schema](SCHEMA.md)    | User, Job, Clip tables               |
| [Algorithm](ALGORITHM.md)       | Spike detection pipeline             |
| [Deployment](DEPLOYMENT.md)     | Local dev + VPS production           |
| [Contributing](CONTRIBUTING.md) | Style, git + PR conventions          |
| [Security](SECURITY.md)         | Practices + vulnerability reporting  |

---

## License

[MIT](LICENSE)
