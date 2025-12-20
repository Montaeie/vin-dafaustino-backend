#!/bin/bash
set -e

echo "=== Installing dependencies ==="
yarn install

echo "=== Building Medusa ==="
yarn build

echo "=== Build completed ==="
ls -la .medusa/server/
