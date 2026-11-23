# syntax=docker/dockerfile:1
# Imagem da aplicação do curso (plano do M0, seção 5).
# Contexto de construção: a RAIZ do dsc-tests. Use curso-app/scripts/construir.sh.
# O que entra no contexto está em curso-app/Dockerfile.dockerignore (lista de permissão).

# ---------- Estágio 1: gerar o site estático ----------
FROM node:24.21.0-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS gerar
# A telemetria do Astro enviaria dados pela rede durante a construção.
ENV ASTRO_TELEMETRY_DISABLED=1 \
    CI=true
RUN npm install --global pnpm@12.8.1
WORKDIR /repo/curso-app
COPY curso-app/package.json curso-app/pnpm-lock.yaml curso-app/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY celilac-backend/method/didatico/curso/ /repo/celilac-backend/method/didatico/curso/
COPY mascotes/web/ /repo/curso-app/public/mascotes/
COPY celilac-backend/docs/ /repo/celilac-backend/docs/
COPY curso-app/ ./

# Commit e data de origem do conteúdo: obrigatórios; o rodapé nunca fica sem origem.
ARG ORIGEM_COMMIT
ARG ORIGEM_DATA
RUN if [ -z "$ORIGEM_COMMIT" ] || [ -z "$ORIGEM_DATA" ]; then \
      echo "ORIGEM_COMMIT e ORIGEM_DATA são obrigatórios; use curso-app/scripts/construir.sh" >&2; exit 1; \
    fi
# A construção valida o front matter do curso e falha se ele não estiver conforme.
RUN pnpm build

# ---------- Estágio 2: servir (sem Node, sem código-fonte) ----------
FROM nginxinc/nginx-unprivileged:1.31-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e AS servir
USER root
RUN rm -rf /usr/share/nginx/html/*
USER 101
COPY curso-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=gerar /repo/curso-app/dist/ /usr/share/nginx/html/
ARG ORIGEM_COMMIT
LABEL org.opencontainers.image.title="curso-app" \
      org.opencontainers.image.revision="${ORIGEM_COMMIT}"
EXPOSE 8080
