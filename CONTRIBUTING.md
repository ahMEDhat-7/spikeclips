# Contributing to SpikeClip

Thanks for your interest in contributing! This guide covers code style, conventions, and workflow.

## Code Style

- **TypeScript strict mode** — No `any` types allowed. Every value must have an explicit type.
- **Clean Architecture** — Follow the layer order: `domain/` → `application/` → `infrastructure/` → `presentation/`
- **Import from `@spikeclips/shared`** — Use path aliases, never relative imports across packages.
- **Functional code** — Prefer pure functions. Use classes only when framework requires it (NestJS controllers, services).
- **No comments** — Code should be self-documenting. Comments are only added when explicitly requested.

## Git Conventions

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance, config, dependencies |
| `docs:` | Documentation changes |
| `refactor:` | Code restructuring without behavior change |
| `test:` | Adding or updating tests |
| `style:` | Formatting, no code change |
| `ci:` | CI/CD changes |

Examples:
```
feat: add clip export endpoint
fix: resolve Redis password authentication
chore: update dependencies
docs: add API reference
```

## PR Workflow

1. Create feature branch from `develop`
2. Make changes following code style
3. Run `pnpm lint` and `pnpm test`
4. Commit with conventional format
5. Open PR to `develop`

## Development Setup

```bash
git clone git@github.com:ahMEDhat-7/spikeclips.git
cd spikeclips
pnpm install
docker compose -f docker/docker-compose.yml up -d
cp .env.example apps/api/.env
pnpm --filter @spikeclips/api prisma:migrate
pnpm dev
```

## Running Tests

```bash
pnpm test                                    # All packages
pnpm --filter @spikeclips/shared test        # Algorithm only
pnpm --filter @spikeclips/api test           # API unit tests
pnpm --filter @spikeclips/api test:e2e       # API E2E tests
pnpm --filter @spikeclips/web test           # Frontend tests
```

## Project Structure

```
spikeclips/
├── apps/
│   ├── api/          # NestJS 11 backend
│   └── web/          # Next.js 16 frontend
├── packages/
│   └── shared/       # Shared types + algorithm
├── deploy/           # VPS deployment scripts
├── docker/           # Docker Compose + Nginx
└── docs/             # PRD, plan, tasks
```
