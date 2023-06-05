# --- Build stage ---
FROM node:18-alpine AS builder

# Install build dependencies for native Node modules
RUN apk add --no-cache python make g++

# Set working directory
WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

# Build server
COPY server/ ./server/
RUN cd server && npm run build

# Install client dependencies
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci

# Build client
COPY client/ ./client/
RUN cd client && npm run build

# --- Run stage ---
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server build from previous stage
COPY --from=builder /app/server/dist ./server/dist

# Copy client build from previous stage
COPY --from=builder /app/client/build ./client/build

# Set NODE_ENV to production
ENV NODE_ENV production

# Expose the server port
EXPOSE 9001

# Run the server
CMD ["node", "server/dist/index.js"]
