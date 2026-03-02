#!/bin/sh

echo "🔄 Running database migrations..."
npm run db:migrate

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

echo "✅ Migrations completed!"
echo "🚀 Starting application..."

npm run dev
