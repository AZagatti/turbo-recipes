FROM node:22-slim AS deps
WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@10

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["pnpm", "start"]
