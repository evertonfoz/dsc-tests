# Estágio 1 — Build (instalação completa e compilação TypeScript)
FROM node:24.21.0-bookworm-slim AS build

WORKDIR /app

RUN npm install -g pnpm@12.8.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN pnpm build

# Estágio 2 — Runtime (dependências de produção e código compilado)
FROM node:24.21.0-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3200

RUN npm install -g pnpm@12.8.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3200

CMD ["node", "dist/main.js"]

