#!/bin/bash
set -e

echo "=== Installing dependencies ==="
yarn install

echo "=== Building Medusa ==="
yarn build

echo "=== Installing server dependencies ==="
cd .medusa/server
npm install --omit=dev
cd ../..

echo "=== Build completed ==="
ls -la .medusa/server/
