# AGENTS.md

## Project

SpikeClip — YouTube heatmap-driven clip extraction tool. Extracts most-replayed moments using actual viewer heatmap data, reformats into vertical shorts.

## Architecture

Turborepo monorepo with pnpm workspaces:

- `apps/web/` — Next.js 16 frontend (App Router, Tailwind 4, React 19)
- `apps/api/` — NestJS 11 backend (health check endpoint, ready for services)
- `packages/shared/` — Shared types (HeatmapSpike, Job, Clip, User, AlgorithmConfig)
- `docker/` — Postgres 16 + Redis 7 for local dev

## Commands

```bash
# Root (via turbo)
pnpm dev          # Start all apps in parallel
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Test all apps

# Single app
pnpm --filter @spikeclip/web dev
pnpm --filter @spikeclip/api dev

# Docker services
docker compose -f docker/docker-compose.yml up -d
```

## Key Conventions

- **Package manager:** pnpm (do not use npm or yarn)
- **TypeScript:** v7.0.2, strict mode in all packages
- **Node:** Next.js uses Turbopack (`next dev --turbopack`)
- **API prefix:** NestJS backend uses `/api` global prefix
- **CORS:** Backend allows `http://localhost:3000` by default
- **Shared code:** Import from `@spikeclip/shared` (path alias configured in both apps)

## Algorithm Reference

`CreateYTShorts.py` contains the canonical spike merging algorithm (v2). This is the source of truth for the algorithm that will be ported to `packages/shared/algorithm/`. Key parameters: gap tolerance 5s, intensity delta 0.25, floor 0.40, min clip 3s, max clip 60s.

## Git Conventions

- Commits: `feat:`, `fix:`, `chore:`, `docs:` prefixes
- Review required after each change before proceeding
