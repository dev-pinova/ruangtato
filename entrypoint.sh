#!/bin/sh
set -e

echo "Running database migrations..."
node --import tsx /app/scripts/migrate.ts

echo "Starting Next.js..."
exec node /app/server.js
