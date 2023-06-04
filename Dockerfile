# Step 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

COPY ./client/package*.json ./
RUN npm install
COPY ./client ./
RUN npm run build

# Step 2: Set up the server
FROM node:18-alpine

WORKDIR /app

COPY ./server/package*.json ./
RUN npm install
COPY ./server ./

# Copy static files from build stage
COPY --from=builder /app/build ./client/build

# Set environment variable
ENV NODE_ENV=production

# Expose the port server is running on
EXPOSE 9001

# Start the application
CMD [ "npm", "start" ]