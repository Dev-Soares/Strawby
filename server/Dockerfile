# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN npm install -g pnpm@latest
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY server/package.json ./server/
# Install only server deps (and root devDeps for pnpm scripts)
RUN pnpm install --frozen-lockfile --filter server...

# ─── Build ────────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY . .
RUN pnpm --filter server exec prisma generate
RUN pnpm --filter server build

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY server/package.json ./server/

# Install production deps only
RUN pnpm install --frozen-lockfile --filter server... --prod

# Copy built output and prisma generated client
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma

EXPOSE 3000
CMD ["node", "server/dist/src/main.js"]
