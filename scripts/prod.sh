#!/usr/bin/env bash
set -euo pipefail

echo "=== SpikeClip Production Start ==="
echo ""

echo "Starting infrastructure containers (Postgres, Redis, MinIO)..."
docker compose up -d postgres redis minio

echo "Waiting for services to be healthy..."
sleep 5

echo "Starting API server..."
sudo systemctl start spikeclips-api

echo "Starting web server..."
sudo systemctl start spikeclips-web

echo "Starting Nginx..."
sudo systemctl start nginx

echo ""
echo "=== All services started ==="
echo "  API:   https://spikeclips.com/api"
echo "  Web:   https://spikeclips.com"
echo "  MinIO: http://localhost:9001 (console)"
