# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install Python and build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ py3-pip

# Copy package files
COPY VinylFloorMarket/package*.json ./
COPY VinylFloorMarket/tsconfig*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY VinylFloorMarket/ ./

# Build both frontend and server
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install Python and runtime dependencies
RUN apk add --no-cache python3

# Copy package files
COPY VinylFloorMarket/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built server from builder stage
COPY --from=builder /app/dist ./dist

# Copy shared folder (might be needed at runtime)
COPY VinylFloorMarket/shared ./shared

# Copy any necessary config files
COPY VinylFloorMarket/.env* ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start server with compiled JavaScript
CMD ["node", "dist/server/index.js"]