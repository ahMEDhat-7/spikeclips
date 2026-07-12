#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma 2>/dev/null || echo "Skipping migrations (Prisma not found)"

echo "Starting API server..."
exec node dist/main
