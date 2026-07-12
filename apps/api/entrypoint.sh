#!/bin/sh
set -e

echo "Running Prisma migrations..."
node ../../node_modules/.pnpm/prisma@6.19.3_typescript@6.0.3/node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma 2>/dev/null || node ../../node_modules/.pnpm/prisma@6.19.3_typescript@6.0.3__typescript@6.0.3/node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma || echo "Skipping migrations (Prisma not found)"

echo "Starting API server..."
exec node dist/main
