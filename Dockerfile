FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Build the application
RUN npm run build

FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --ignore-scripts --omit=dev

# Use CMD instead of ENTRYPOINT to allow smithery.yaml to control execution
CMD ["node", "dist/index.js"]
