#!/bin/bash
set -e

echo "=== Starting Medusa Server ==="
echo "PORT: $PORT"
echo "HOST: $HOST"
echo "NODE_ENV: $NODE_ENV"

cd .medusa/server

echo "=== Running database migrations ==="
npm run predeploy

echo "=== Starting server ==="
npm run start
