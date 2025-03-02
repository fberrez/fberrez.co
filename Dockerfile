FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Install dependencies required for sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
# Set the store directory to avoid conflicts
RUN pnpm config set store-dir /pnpm/store/v10
WORKDIR /app
# Copy only package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
# Add sharp as a direct dependency
RUN pnpm install sharp

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Add sharp for the build process
RUN pnpm install sharp
# Now copy the rest of the application code
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

FROM base
ENV NODE_ENV=production
ENV PORT=8000
ENV NEXT_TELEMETRY_DISABLED=1
# Copy only package files for the final stage
COPY package.json pnpm-lock.yaml ./
# Copy node_modules from prod-deps
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy build output from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Copy any other necessary files for production
COPY next.config.js ./
EXPOSE 8000
CMD [ "pnpm", "start" ]