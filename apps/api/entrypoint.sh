#!/bin/sh
set -e

echo "Generating Prisma client..."
pnpm exec prisma generate --schema=./prisma/schema.prisma

echo "Running Prisma migrations..."
pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma || echo "Migrations failed or already applied"

echo "Starting API server..."
exec node dist/main
