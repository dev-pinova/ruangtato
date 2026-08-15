#!/bin/sh
set -e

echo "Starting application..."
echo "NODE_ENV: $NODE_ENV"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
fi

echo "DATABASE_URL: ${DATABASE_URL:0:40}..."

# Parse DATABASE_URL to extract host and port
# Format: postgres://user:pass@host:port/db
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:[^@]*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:[^@]*@[^\:]*:\([0-9]*\)/.*|\1|p')

echo "Connecting to database: $DB_HOST:$DB_PORT"

# Wait for database to be ready using pg_isready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U postgres >/dev/null 2>&1; then
    echo "Database is ready!"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "ERROR: Database not reachable after ${MAX_RETRIES} attempts."
    exit 1
  fi
  echo "Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

# Run database migrations
echo "Running database migrations..."
MAX_MIGRATE_RETRIES=3
MIGRATE_RETRY_COUNT=0
while [ $MIGRATE_RETRY_COUNT -lt $MAX_MIGRATE_RETRIES ]; do
  if node --import tsx /app/scripts/migrate.ts; then
    echo "Migrations applied successfully."
    break
  fi
  MIGRATE_RETRY_COUNT=$((MIGRATE_RETRY_COUNT + 1))
  if [ $MIGRATE_RETRY_COUNT -lt $MAX_MIGRATE_RETRIES ]; then
    echo "Migration failed (attempt $MIGRATE_RETRY_COUNT/$MAX_MIGRATE_RETRIES). Retrying..."
    sleep 5
  else
    echo "WARNING: Migration failed after $MAX_MIGRATE_RETRIES attempts. Proceeding anyway..."
  fi
done

echo "Starting Next.js server..."
exec node /app/server.js
