#!/usr/bin/env bash
set -euo pipefail

echo "=== SpikeClip Local Dev ==="
echo ""

echo "Starting infrastructure containers (Postgres, Redis, MinIO)..."
docker compose up -d postgres redis minio

echo "Waiting for Postgres to be ready..."
docker compose exec -T postgres sh -c 'until pg_isready -U spikeclips; do sleep 1; done'

echo "Waiting for Redis to be ready..."
docker compose exec -T redis sh -c 'until redis-cli ping; do sleep 1; done'

echo ""
echo "Infrastructure is ready."
echo ""
echo "Run in another terminal:"
echo "  cp .env.example apps/api/.env   # if not done"
echo "  pnpm --filter @spikeclips/api prisma:migrate"
echo "  pnpm dev"
echo ""
echo "  Web:  http://localhost:3000"
echo "  API:  http://localhost:3001"
echo "  MinIO Console: http://localhost:9001"
echo ""
echo "To stop: docker compose down"
