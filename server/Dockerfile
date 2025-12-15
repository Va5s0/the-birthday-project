FROM node:20-alpine

# Install dependencies for SQLite and Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for building)
RUN npm install

# Copy Prisma schema first
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create directories for data and uploads
RUN mkdir -p /app/data /app/uploads

# Expose port
EXPOSE 5001

# Run migrations and start server
CMD npx prisma migrate deploy && node dist/index.js
