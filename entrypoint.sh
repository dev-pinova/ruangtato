#!/bin/sh
set -e

echo "Starting application..."
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  echo "Please configure DATABASE_URL in your Coolify environment variables."
  exit 1
fi

# Wait for database to be ready (max 60 seconds)
echo "Waiting for database to be ready..."
for i in $(seq 1 60); do
  if echo > /dev/tcp/$(echo $DATABASE_URL | cut -d'/' -f3 | cut -d':' -f1)/$(echo $DATABASE_URL | cut -d'/' -f3 | cut -d':' -f2) 2>/dev/null; then
    echo "Database connection accepted."
    break
  fi
  if [ $i -eq 60 ]; then
    echo "ERROR: Database not reachable after 60 seconds."
    exit 1
  fi
  sleep 1
done

# Run database migrations with retry
echo "Running database migrations..."
MAX_RETRIES=3
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if node --import tsx /app/scripts/migrate.ts; then
    echo "Migrations applied successfully."
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "Migration failed (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    sleep 5
  else
    echo "WARNING: Migration failed after $MAX_RETRIES attempts. Proceeding anyway..."
  fi
done

echo "Starting Next.js server..."
exec node /app/server.js
