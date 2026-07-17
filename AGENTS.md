# AGENTS.md

## Project

SpikeClip — YouTube heatmap-driven clip extraction tool. Extracts most-replayed moments using actual viewer heatmap data, reformats into vertical shorts.

## Architecture

Turborepo monorepo with pnpm workspaces:

- `apps/web/` — Next.js 16 frontend (App Router, Tailwind 4, React 19)
- `apps/api/` — NestJS 11 backend (health check endpoint, ready for services)
- `packages/shared/` — Shared types (HeatmapSpike, Job, Clip, User, AlgorithmConfig)
- `docker/` — Postgres 18 + Redis 8 + MinIO for local dev

## Commands

```bash
# Root (via turbo)
pnpm dev          # Start all apps in parallel
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Test all apps

# Single app
pnpm --filter @spikeclips/web dev
pnpm --filter @spikeclips/api dev

# Docker services
docker compose -f docker/docker-compose.yml up -d
```

## Key Conventions

- **Package manager:** pnpm (do not use npm or yarn)
- **TypeScript:** v7.0.2, strict mode in all packages
- **Node:** Next.js uses Turbopack (`next dev --turbopack`)
- **API prefix:** NestJS backend uses `/api` global prefix
- **CORS:** Backend allows `http://localhost:3000` by default
- **Shared code:** Import from `@spikeclips/shared` (path alias configured in both apps)

## Algorithm Reference

The spike merging algorithm has been ported to TypeScript at `packages/shared/src/algorithm/merge.ts`. Canonical defaults in `packages/shared/src/types.ts` (`DEFAULT_ALGORITHM_CONFIG`). Key parameters: gap tolerance 5s, intensity delta 0.25, floor 0.40, min clip 3s, max clip 60s.

## Git Conventions

- Commits: `feat:`, `fix:`, `chore:`, `docs:` prefixes
- Review required after each change before proceeding
