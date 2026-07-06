# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile --filter strawby-api...

# ─── Build ────────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY . .
RUN pnpm --filter strawby-api exec prisma generate
RUN pnpm --filter strawby-api build

# ─── Production ───────────────────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

COPY --chown=node:node package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=node:node server/package.json ./server/
COPY --chown=node:node server/prisma ./server/prisma

# Production dependencies only; Prisma CLI is installed globally using the same
# version declared in server/package.json to regenerate the client against the
# target architecture without pulling all devDependencies.
RUN pnpm install --frozen-lockfile --filter strawby-api... --prod
RUN PRISMA_VERSION=$(npm view prisma@"$(node -p "require('./server/package.json').devDependencies.prisma")" version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | tail -n 1) && \
    npm install -g prisma@$PRISMA_VERSION && \
    npm cache clean --force
RUN prisma generate --schema=server/prisma/schema.prisma

COPY --from=build --chown=node:node /app/server/dist ./server/dist

USER node

EXPOSE 3000
CMD ["sh", "-c", "pnpm --filter strawby-api exec prisma migrate deploy && node server/dist/src/main.js"]
