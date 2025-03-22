FROM node:22.12-alpine AS builder

# Copy only necessary files for the build
COPY package*.json /app/
COPY tsconfig.json /app/
COPY src/ /app/src/

WORKDIR /app

# Install dependencies and build
RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM node:22-alpine AS release

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Set up production environment
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --ignore-scripts --omit=dev

# Set the entry point
ENTRYPOINT ["node", "dist/index.js"]
