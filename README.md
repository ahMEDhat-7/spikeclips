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
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
         ┌──────────▼──────┐  ┌─────────▼────────┐  ┌───────▼────────┐
         │ NestJS API :3001│  │  PostgreSQL 18    │  │  Redis 8       │
         │  (internal only)│  │  (internal only)  │  │ (internal only)│
         └────────┬────────┘  └──────────────────┘  └────────────────┘
                  │
         ┌────────▼────────┐
         │    MinIO         │
         │ (internal only)  │
         └─────────────────┘
```

- **nginx** is the only entry point. It proxies to the web server only.
- **API** is not exposed to the internet. The Next.js app proxies `/api/*` requests internally.
- **PostgreSQL, Redis, MinIO** are internal containers — no host ports exposed.

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
docker compose -f docker-compose.yml up -d
```

This starts Postgres, Redis, MinIO, and nginx (port 80). All data services are internal — only nginx is accessible from outside.

### 3. Configure environment

```bash
cp .env.example apps/api/.env
```

Set `JWT_SECRET` and your Google OAuth credentials at minimum.

### 4. Migrate & run

```bash
pnpm --filter @spikeclips/api prisma:migrate
pnpm dev
```

- **Frontend:** http://localhost:3000 (via nginx on port 80)
- **Swagger:** http://localhost:3001/api/docs (local dev only)

---

## Project Structure

```
SpikeClip/
├── apps/
│   ├── api/            # NestJS 11 backend (internal)
│   └── web/            # Next.js 16 frontend (public)
├── packages/
│   └── shared/         # shared types + spike algorithm
├── deploy/             # VPS deployment (compose + nginx)
├── docker/             # local dev compose + nginx config
├── docs/               # PRD, plan, tasks
└── turbo.json          # Turborepo pipeline
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

| Document | Description |
|----------|-------------|
| [API Reference](API.md) | Endpoints, request/response examples |
| [Database Schema](SCHEMA.md) | User, Job, Clip tables |
| [Algorithm](ALGORITHM.md) | Spike detection pipeline |
| [Deployment](DEPLOYMENT.md) | Local dev + VPS production |
| [Contributing](CONTRIBUTING.md) | Style, git + PR conventions |
| [Security](SECURITY.md) | Practices + vulnerability reporting |

---

## License

[MIT](LICENSE)
