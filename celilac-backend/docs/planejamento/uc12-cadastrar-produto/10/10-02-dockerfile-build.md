# ARTEFATO 10-02 — DOCKERFILE, MULTI-STAGE BUILD E COMPILAÇÃO TYPESCRIPT

## 1. Contexto e Objetivos

O objetivo desta fase é estabelecer um `Dockerfile` multi-stage determinístico, seguro e eficiente para a API NestJS, assegurando que o artefato final em contêiner contenha exclusivamente os binários compilados (`dist/`) e as dependências de produção necessárias em tempo de execução, sem levar ferramentas de desenvolvimento, arquivos de teste ou credenciais.

---

## 2. Versões e Compatibilidade Técnicas Verificadas

A inspeção do ambiente de desenvolvimento confirmou as versões do runtime e gerenciador de pacotes:

| Componente | Versão Declarada / Detectada | Base de Imagem Docker | Justificativa Técnica |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v24.21.0` | `node:24.21.0-bookworm-slim` | Alinhamento estrito com o Node.js em execução na máquina do desenvolvedor (Debian Bookworm slim para menor superfície de ataque e tamanho reduzido). |
| **pnpm** | `12.8.1` | Instalado via `npm install -g pnpm@12.8.1` | Compatibilidade com `pnpm-lock.yaml` (lockfile version 9.0) e flags `--frozen-lockfile`. |
| **TypeScript** | `^6.0.2` | Compilador de desenvolvimento | Utilizado no estágio `build` para gerar artefatos em `dist/`. |
| **Módulo ESM** | `"type": "module"` (`package.json`) | Node ESM nativo | Exige imports com extensão `.js` e compilação do DataSource compatível. |

---

## 3. Conteúdo do `Dockerfile` Multi-Stage Criado

O `Dockerfile` foi construído com separação clara de responsabilidades:

```dockerfile
# Estágio 1 — Build (instalação completa e compilação TypeScript)
FROM node:24.21.0-bookworm-slim AS build

WORKDIR /app

RUN npm install -g pnpm@12.8.1

COPY package.json pnpm-lock.yaml ./
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

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3200

CMD ["node", "dist/main.js"]
```

### Análise das Etapas:
1. **Estágio `build`:**
   - Instalação das dependências completas com `pnpm install --frozen-lockfile`.
   - Cópia dos arquivos de configuração do compilador NestJS (`tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`) e diretório `src/`.
   - Execução de `pnpm build` gerando os arquivos compilados em `/app/dist`.
2. **Estágio `runtime`:**
   - Define `NODE_ENV=production` e `PORT=3200`.
   - Instala exclusivamente dependências de produção com `pnpm install --prod --frozen-lockfile`.
   - Copia somente o diretório `/app/dist` do estágio de build via `COPY --from=build`.
   - Expõe a porta 3200 e define como ponto de entrada `CMD ["node", "dist/main.js"]`.

---

## 4. Validação da Compilação Local e Estrutura em `dist/`

A compilação do TypeScript no host foi validada com sucesso via `pnpm build`:

```bash
$ nest build
$ find dist -name "main.js"
dist/main.js

$ find dist -name "data-source.js"
dist/database/data-source.js

$ find dist/database/migrations -name "*.js"
dist/database/migrations/1792519198708-CreateOrders.js
dist/database/migrations/1794255600000-CreateProductsTable.js
```

### Comprovação dos Artefatos Compilados:
- O arquivo principal `dist/main.js` foi localizado com sucesso.
- O DataSource compilado `dist/database/data-source.js` está presente para inicialização da conexão ORM e execução de scripts de migration sem necessidade de `ts-node`.
- A migration compilada `dist/database/migrations/1794255600000-CreateProductsTable.js` está pronta para execução no ambiente containerizado.
