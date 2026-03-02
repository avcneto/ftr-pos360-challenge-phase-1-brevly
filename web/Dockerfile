# Development stage using Vite dev server
FROM node:current-alpine3.23

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start Vite dev server with host 0.0.0.0 to accept external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
