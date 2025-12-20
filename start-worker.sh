#!/bin/bash
set -e

echo "=== Starting Medusa Worker ==="
echo "MEDUSA_WORKER_MODE: $MEDUSA_WORKER_MODE"
echo "NODE_ENV: $NODE_ENV"

cd .medusa/server

echo "=== Installing server dependencies ==="
npm install --omit=dev

echo "=== Starting worker ==="
npm run start
