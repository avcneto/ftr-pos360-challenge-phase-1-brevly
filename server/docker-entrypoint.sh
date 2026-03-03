#!/bin/sh

echo "🔄 Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

# Wait for database to be ready
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if nc -z postgres 5432 2>/dev/null; then
    echo "✅ Database is ready!"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "⏳ Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Database connection timeout!"
  exit 1
fi

# Wait additional time for PostgreSQL to fully initialize
sleep 3

echo "🔄 Running database migrations..."
npm run db:migrate

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

echo "✅ Migrations completed!"
echo "🚀 Starting application..."

npm run dev
