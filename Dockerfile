FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production
RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

EXPOSE 3333

CMD ["sh", "-c", "pnpm exec drizzle-kit migrate && pnpm start:prod"]
