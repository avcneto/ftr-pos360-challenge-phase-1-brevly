# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm or use npm
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project (optional, for TypeScript check)
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Install all dependencies (including dev for tsx)
COPY package*.json ./
RUN npm install

# Copy built files and source code from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY drizzle.config.ts ./

# Copy and configure entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Expose port
EXPOSE 3333

# Health check using the /ping endpoint with curl
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3333/ping || exit 1

# Run entrypoint script which executes migrations and starts the app
ENTRYPOINT ["./docker-entrypoint.sh"]
