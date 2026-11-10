# ARTEFATO 10-02 — CONSTRUÇÃO DO DOCKERFILE MULTI-STAGE E COMPILAÇÃO

## 1. Diagnóstico e Inspeção Prévia Obrigatória

Antes de definir o `Dockerfile`, os 12 itens obrigatórios do projeto real foram inspecionados e validados:

| # | Item Inspecionado | Valor / Estado Real no Projeto | Decisão Técnica Adotada no `Dockerfile` |
| :---: | :--- | :--- | :--- |
| **1** | **Versão do Node.js** | Host em `v24.21.0`; `package.json` define `"@types/node": "^24.0.0"`; `pnpm-lock.yaml` resolve `@types/node@24.19.0`. Não há `.nvmrc`. | Adotada a imagem determinística `node:24.21.0-bookworm-slim` em ambos os estágios (`build` e `runtime`), evitando tags flutuantes (`latest`, `24`). |
| **2** | **Versão do `pnpm`** | Host utiliza `pnpm 12.8.1`. | Fixada explicitamente a versão `pnpm@12.8.1` via `RUN npm install -g pnpm@12.8.1` e declarada em `package.json`. |
| **3** | **Campo `packageManager`** | Não estava declarado originalmente em `package.json`. | Adicionado `"packageManager": "pnpm@12.8.1"` em `package.json` para explicitar a ferramenta e versão oficial. |
| **4** | **Lockfile (`pnpm-lock.yaml`)** | Presente na raiz (`lockfileVersion: '9.0'`, 151.899 bytes). | Utilizado `pnpm install --frozen-lockfile` no estágio `build` e `pnpm install --prod --frozen-lockfile` no estágio `runtime`. |
| **5** | **`pnpm-workspace.yaml`** | **Existe** na raiz com `allowBuilds: { '@parcel/watcher': true, 'unrs-resolver': true }`. | Incluído legitimamente em `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./`. |
| **6** | **`tsconfig.json`, `tsconfig.build.json` e `nest-cli.json`** | **Todos os três arquivos existem** na raiz do repositório. | Incluídos legitimamente em `COPY tsconfig.json tsconfig.build.json nest-cli.json ./` no estágio `build`. |
| **7** | **Script de build** | `"build": "nest build"` em `package.json`. | Executado via `RUN pnpm build` no estágio `build`. |
| **8** | **Diretório de saída** | `outDir: "./dist"` (`tsconfig.json`) combinado com `rootDir: "./src"` (`tsconfig.build.json`). | O compilador gera os artefatos JS diretamente sob `/app/dist`, copiados para o estágio `runtime` com `COPY --from=build /app/dist ./dist`. |
| **9** | **Entry point compilado** | `dist/main.js` (confirmado via `find dist -name "main.js"`). | Definido `CMD ["node", "dist/main.js"]` com `PORT=3200` e `EXPOSE 3200`. |
| **10** | **DataSource compilado** | `dist/database/data-source.js` (confirmado via `find dist -name "data-source.js"`). | `src/database/data-source.ts` ajustado para resolver `dist/database/migrations/*.js` quando executado a partir do artefato compilado `.js`. |
| **11** | **Migrations compiladas** | `dist/database/migrations/*.js` (5 arquivos compilados, incluindo `1794255600000-CreateProductsTable.js`). | Disponíveis em `/app/dist/database/migrations/*.js` na imagem `runtime`. |
| **12** | **Dependências exigidas no runtime** | `@nestjs/*`, `typeorm` (`^1.1.2`), `pg` (`^8.23.1`), `dotenv` (`^18.0.7`), `reflect-metadata`, `rxjs`, `class-validator`, `class-transformer` estão em `dependencies`. | Instaladas no estágio `runtime` via `pnpm install --prod --frozen-lockfile`, permitindo tanto a execução da API quanto a verificação/execução de migrations compiladas sem `ts-node`. |

---

## 2. Adequação Prévia do `DataSource` e dos Scripts para Produção

### 2.1 Diagnóstico do Problema de Caminho em `src/database/data-source.ts`
Originalmente, `src/database/data-source.ts` continha `migrations: ['src/database/migrations/*.ts']`. Quando compilado para `dist/database/data-source.js` e copiado para o estágio `runtime` (onde o diretório `src/` e o pacote `ts-node` não existem), o TypeORM procuraria arquivos `.ts` inexistentes e deixaria de localizar as migrations compiladas em `dist/database/migrations/*.js`.

### 2.2 Solução Implementada em `src/database/data-source.ts`
```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OrderEntity } from '../infrastructure/persistence/orders/order.orm-entity.js';
import { PaymentEntity } from '../infrastructure/persistence/payments/payment.orm-entity.js';
import { ProductOrmEntity } from '../infrastructure/persistence/products/product.orm-entity.js';

const isTsRuntime = import.meta.url.endsWith('.ts');

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [OrderEntity, PaymentEntity, ProductOrmEntity],
  migrations: [
    isTsRuntime
      ? 'src/database/migrations/*.ts'
      : 'dist/database/migrations/*.js',
  ],
  synchronize: false,
});
```

### 2.3 Scripts de Produção Adicionados ao `package.json`
```json
"packageManager": "pnpm@12.8.1",
"scripts": {
  "typeorm": "typeorm-ts-node-esm -d src/database/data-source.ts",
  "migration:show:prod": "typeorm migration:show -d dist/database/data-source.js",
  "migration:run:prod": "typeorm migration:run -d dist/database/data-source.js"
}
```

---

## 3. Verificação da Compilação e dos Caminhos em `dist/`

### 3.1 Compilação Local (`pnpm build`)
- **Comando executado:**
  ```bash
  pnpm build
  ```
- **Resultado real observado:**
  ```text
  $ nest build
  ```
  (Código de saída `0`, sem erros TypeScript).

### 3.2 Inspeção dos Artefatos Gerados em `dist/`
- **Comandos executados:**
  ```bash
  find dist -name "main.js"
  find dist -name "data-source.js"
  find dist/database/migrations -name "*.js"
  ```
- **Saída real observada:**
  ```text
  dist/main.js
  dist/database/data-source.js
  dist/database/migrations/1791815040413-AddUpdatedAtTriggers.js
  dist/database/migrations/1791814929531-UseDatabaseTimestamps.js
  dist/database/migrations/1791814820800-AddDomainFieldsToOrdersAndPayments.js
  dist/database/migrations/1794255600000-CreateProductsTable.js
  dist/database/migrations/1791738728692-CreateOrdersAndPayments.js
  ```

### 3.3 Teste do `DataSource` Compilado (`dist/database/data-source.js`)
- **Comando executado:**
  ```bash
  pnpm exec typeorm migration:show -d dist/database/data-source.js
  ```
- **Saída real observada:**
  ```text
  [X] 2 CreateOrdersAndPayments1791738728692
  [X] 3 AddDomainFieldsToOrdersAndPayments1791814820800
  [X] 4 UseDatabaseTimestamps1791814929531
  [X] 5 AddUpdatedAtTriggers1791815040413
  [X] 6 CreateProductsTable1794255600000
  ```

---

## 4. `Dockerfile` Multi-Stage Implementado

Arquivo criado na raiz do projeto: `Dockerfile`

```dockerfile
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
```

### Justificativas Técnicas da Estrutura Multi-Stage:
1. **Isolamento entre Build e Runtime:** O estágio `build` instala todas as `devDependencies` (`typescript`, `@nestjs/cli`, `vitest`, `oxlint`, etc.) e compila `src/` para `/app/dist`. O estágio `runtime` parte de uma imagem limpa `node:24.21.0-bookworm-slim`, instala apenas `dependencies` (`--prod --frozen-lockfile`) e copia unicamente `/app/dist`.
2. **Instalação determinística do `pnpm` (`pnpm@12.8.1`):** Utiliza `RUN npm install -g pnpm@12.8.1` em vez de depender de `pnpm@latest` ou da presença implícita do Corepack na imagem Node 24 slim, garantindo reprodutibilidade exata com `lockfileVersion: '9.0'`.
3. **Aproveitamento de cache de camadas Docker:** Os manifestos (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) são copiados antes de `COPY src ./src`, evitando reinstalar pacotes quando apenas arquivos de código-fonte forem alterados.
4. **Segurança:** Nenhum arquivo `.env` é copiado para dentro da imagem em nenhum dos estágios.

---

## 5. Resultados Reais do Build Multi-Stage e Falhas/Correções

1. **Execução do Build (`docker build -t celilac-api:dev .`):**
   - Estágio `build` (`[build 1/8]` a `[build 8/8]`): instalou `pnpm@12.8.1`, executou `pnpm install --frozen-lockfile` (`9.7s`) e compilou com `pnpm build` (`1.4s`).
   - Estágio `runtime` (`[runtime 1/6]` a `[runtime 6/6]`): instalou apenas dependências de produção (`pnpm install --prod --frozen-lockfile`, `9.9s`) e copiou `/app/dist` (`0.1s`).
   - Tempo total de construção: `41.8s` (`17/17 FINISHED`), gerando a imagem `celilac-api:dev` (`ID: 7e2f32857fb7`).
2. **Falhas e Correções Preventivas Aplicadas:**
   - **Problema prevenido 1 (`migrations` apontando para `.ts`):** Corrigido em `src/database/data-source.ts` antes do build para selecionar `dist/database/migrations/*.js` quando executado a partir do arquivo compilado `.js`.
   - **Problema prevenido 2 (Versão determinística do `pnpm` no Node 24):** Fixado `npm install -g pnpm@12.8.1` e `"packageManager": "pnpm@12.8.1"` sem usar `pnpm@latest`.
3. **Pendências:** Nenhuma pendência no `Dockerfile` ou na compilação. A verificação detalhada do `.dockerignore` e da imagem gerada está documentada no Artefato `10-03`.
