#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Stopping SpikeClip ==="

echo "Stopping Nginx..."
sudo systemctl stop nginx || true

echo "Stopping web server..."
sudo systemctl stop spikeclips-web || true

echo "Stopping API server..."
sudo systemctl stop spikeclips-api || true

echo "Stopping infrastructure services..."
docker compose -f "$SCRIPT_DIR/docker-compose.services.yml" down

echo "=== All services stopped ==="
