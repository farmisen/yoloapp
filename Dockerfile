FROM node:20-bookworm AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

## Install necessary system dependencies
RUN apt-get update && \
    apt-get install -y libssl3 libc6 supervisor procps jq wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy necessary file to install dependencies
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Extract pnpm version and install it
RUN PNPM_VERSION=$(jq -r '.packageManager | split("@")[1]' package.json) && wget --max-redirect=0 -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

RUN  pnpm install
  
# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.production.sample .env.production
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

## Install pdftocairo
RUN apt-get update && \
    apt-get install -y poppler-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


ENV NODE_ENV=production

RUN groupadd --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid 1001 nextjs


COPY --from=builder /app/public ./public
COPY --chown=nextjs:nodejs docker ./docker
COPY --chown=nextjs:nodejs prisma ./prisma
COPY --chown=nextjs:nodejs --from=deps /app/node_modules ./node_modules
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV DATABASE_URL="file:./db.sqlite"
ENV HOSTNAME=0.0.0.0
RUN chmod +x ./docker/start.sh
CMD ["./docker/start.sh"]






