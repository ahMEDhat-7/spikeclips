#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Starting SpikeClip ==="

echo "Starting infrastructure services..."
docker compose -f "$SCRIPT_DIR/docker-compose.services.yml" up -d

echo "Waiting for services to be healthy..."
sleep 5

echo "Starting API server..."
sudo systemctl start spikeclips-api

echo "Starting web server..."
sudo systemctl start spikeclips-web

echo "Starting Nginx..."
sudo systemctl start nginx

echo "=== All services started ==="
echo "  API:   https://spikeclips.com/api"
echo "  Web:   https://spikeclips.com"
echo "  MinIO: http://localhost:9001 (console)"
