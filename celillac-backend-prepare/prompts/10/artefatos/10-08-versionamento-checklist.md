# ARTEFATO 10-08 — VERSIONAMENTO, RASTREABILIDADE GITHUB E CHECKLIST DE CONSISTÊNCIA

## 1. Relatório Consolidado dos 24 Itens da Unidade (Material 10)

| # | Tópico | Síntese Técnica e Evidência Comprovada |
| :---: | :--- | :--- |
| **1** | **Projeto** | **CeliLac** — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare`, repositório [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests)). |
| **2** | **Caso de uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`, [`EPIC-UC12` — Issue #1](https://github.com/evertonfoz/dsc-tests/issues/1)). |
| **3** | **Issue** | [`SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` (Issue #16)](https://github.com/evertonfoz/dsc-tests/issues/16), criada após diagnóstico e aprovação do refinamento do planejamento (sem atribuir automaticamente à `SUB-04` #7). |
| **4** | **Estado inicial** | Recuperados integralmente os 8 artefatos do Material 09 (`prompts/09/artefatos/09-01` a `09-08`) e comprovada a linha de base de testes (`pnpm test --run` → `12 passed`; `pnpm test:integration` → `1 passed`; total: `13 passed`). |
| **5** | **Dockerfile** | Implementado `Dockerfile` multi-stage (`build` e `runtime`) na raiz, usando `node:24.21.0-bookworm-slim`, `pnpm@12.8.1` (`--frozen-lockfile`), compilação `pnpm build`, dependências de produção (`--prod --frozen-lockfile`) e `CMD ["node", "dist/main.js"]`. |
| **6** | **Imagem** | Construída a imagem `celilac-api:dev` (`ID: 7e2f32857fb7` / reconstruída após ajuste de schema com cache em `5.2s`), verificada com `docker image ls celilac-api` e `docker run --rm celilac-api:dev ls -la /app /app/dist`. |
| **7** | **`.dockerignore`** | Configurado `.dockerignore` excluindo `node_modules`, `dist`, `coverage`, `.git`, `.env`, `.env.*` (preservando `!.env.example`), reduzindo o contexto de build para `224,47 kB` e impedindo inclusão de segredos na imagem. |
| **8** | **Compose** | Evoluído `compose.yaml` adicionando o serviço `api` (`celilac-api`, porta `${PORT:-3200}:3200`, `depends_on: postgres: condition: service_healthy`) e preservando intactos os serviços `postgres` (`5432:5432`), `postgres_test` (`5435:5432`) e os volumes `celilac_postgres_data` e `celilac_postgres_test_data`. Validado com `docker compose config --quiet` (saída `0`). |
| **9** | **Rede** | Contêineres `celilac-api` e `celilac-postgres` integrados na rede bridge `celilac-backend_default`, onde o DNS interno resolve `DB_HOST=postgres` para `172.24.0.2:5432` (confirmado via `node:dns/promises`). |
| **10** | **Variáveis** | Configuradas no serviço `api`: `PORT: 3200`, `DB_HOST: postgres`, `DB_PORT: 5432`, `DB_USERNAME: ${DB_USERNAME}`, `DB_PASSWORD: ${DB_PASSWORD}`, `DB_NAME: ${DB_NAME}`, alinhadas com `src/main.ts`, `AppModule` e `src/database/data-source.ts`. |
| **11** | **Migrations** | `src/database/data-source.ts` ajustado para resolver `dist/database/migrations/*.js` quando executado em `.js`, com scripts `migration:show:prod` e `migration:run:prod` em `package.json`. Verificado `docker compose run --rm api pnpm exec typeorm migration:show -d dist/database/data-source.js` → todas as 5 migrations aplicadas (`[X] 6 CreateProductsTable1794255600000`). |
| **12** | **Inicialização** | `docker compose up -d --build api` inicializou `celilac-api` sem recriar `celilac-postgres` (`Up 2 weeks (healthy)`). Logs de `celilac-api` confirmaram inicialização do `TypeOrmCoreModule`, `ProductsModule`, rota `{/products, POST}` e escuta na porta `3200`. |
| **13** | **Requisições** | Executado `curl -i -s -X POST http://localhost:3200/products -H "Content-Type: application/json" -d '{"name":"Produto de exemplo"}'` → resposta **`HTTP/1.1 201 Created`** com `{"productId":"3c44cbe6-1d9b-4ee1-9087-c1a555820093","name":"Produto de exemplo"}`. |
| **14** | **PostgreSQL** | Consulta `SELECT * FROM products.products WHERE "productId" = '3c44cbe6-1d9b-4ee1-9087-c1a555820093';` em `celilac-postgres` (`celilac_db`) confirmou o registro gravado (`1 row`), além da preservação do registro anterior (`256824a7-a374-4baf-8c95-492e870ee999`). |
| **15** | **Durabilidade** | Executado `docker compose restart api` (reiniciando apenas o contêiner `celilac-api`). Nova consulta SQL após o reinício (`17:02:34 UTC`) comprovou a permanência exata do registro `3c44cbe6-1d9b-4ee1-9087-c1a555820093` (`"Produto de exemplo"`). |
| **16** | **Testes** | Reexecutadas ambas as suítes: `pnpm test --run` (`5 passed files`, `12 passed tests`) e `pnpm test:integration` (`1 passed file`, `1 passed test`). Total: **`13 passed (13)`**, zero regressões. |
| **17** | **Diagnósticos** | Diagnosticados e resolvidos dois pontos reais: (a) alinhamento de projeto Compose (`COMPOSE_PROJECT_NAME=celilac-backend`) para reutilizar `celilac-postgres` e sua rede/volume sem recriá-lo; (b) erro inicial `42P01: relation "products" does not exist` corrigido com `schema: 'products'` em `ProductOrmEntity`. |
| **18** | **Branch** | `feature/uc12-09-backend-containerization` (criada a partir de `feature/uc12-04-products-persistence` e publicada em `origin`). |
| **19** | **Commits** | `8f83f6b631938a5245d16056d9e77dfe34ea7996` (`8f83f6b`) — `build(docker): containerize NestJS backend and integrate with Compose (refs #16, refs #1)`. |
| **20** | **Pull Request** | [Draft PR #17 (`https://github.com/evertonfoz/dsc-tests/pull/17`)](https://github.com/evertonfoz/dsc-tests/pull/17) (`feature/uc12-09-backend-containerization` → `feature/uc12-04-products-persistence`, `OPEN`, `isDraft: true`). Preservados intactos os Draft PRs [#12](https://github.com/evertonfoz/dsc-tests/pull/12), [#13](https://github.com/evertonfoz/dsc-tests/pull/13), [#14](https://github.com/evertonfoz/dsc-tests/pull/14) e [#15](https://github.com/evertonfoz/dsc-tests/pull/15). |
| **21** | **GitHub Project** | [Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6): `Backlog` (`#1`, `#11`); `Ready` (`#4`, `#5`, `#6`); `In Progress` (`#8` `SUB-05`, `#10` `SUB-07`, `#16` `SUB-09` — $WIP = 3$); `In Review` (`#7` `SUB-04`, `#9` `SUB-06` — $2/2$). Comentários publicados na Issue #16 ([`#issuecomment-6772951249`](https://github.com/evertonfoz/dsc-tests/issues/16#issuecomment-6772951249) e [`#issuecomment-6774001895`](https://github.com/evertonfoz/dsc-tests/issues/16#issuecomment-6774001895)). |
| **22** | **Checklist** | Detalhado integralmente na Seção 3 deste artefato. |
| **23** | **Pendências** | 1. Implementar validação de domínio/aplicação `CA02` (`RN01` — nome obrigatório em `ProductsService`/`Product`, `SUB-03` #6).<br>2. Cobrir tratamento específico de falhas de persistência (`FE01`) na camada de aplicação.<br>3. Atualizar documentação técnica final (`SUB-08` #11) e realizar revisão humana dos PRs #12 a #17. |
| **24** | **Próximas ações** | 1. Submeter o Draft PR #17 (`SUB-09`) à revisão técnica cruzada por Ana Clara Souza.<br>2. Concluir `SUB-03` (#6) e `SUB-08` (#11).<br>3. Realizar o merge sequencial dos PRs (`#12 → #13 → #14 → #15 → #17`) somente após aprovação humana. |

---

## 2. Topologia Completa de Branches e Arquivos Versionados

### 2.1 Cadeia de Branches e Pull Requests
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 — SUB-07]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 — SUB-05]
              └── feature/uc12-06-products-http (ee76412) [Draft PR #14 — SUB-06 / SUB-07]
                    └── feature/uc12-04-products-persistence (1b9de74) [Draft PR #15 — SUB-04 / SUB-07]
                          └── feature/uc12-09-backend-containerization (8f83f6b) [Draft PR #17 — SUB-09] (HEAD atual)
```

### 2.2 Arquivos Selecionados no Commit `8f83f6b` (`git diff --staged --stat`)
```text
 celillac-backend-prepare/.dockerignore             | 12 ++++++++
 celillac-backend-prepare/.env.example              |  1 +
 celillac-backend-prepare/Dockerfile                | 33 ++++++++++++++++++++++
 celillac-backend-prepare/compose.yaml              | 20 +++++++++++++
 celillac-backend-prepare/package.json              |  3 ++
 .../src/database/data-source.ts                    |  8 +++++-
 .../1794255600000-CreateProductsTable.ts           |  6 ++--
 .../persistence/products/product.orm-entity.ts     |  2 +-
 .../typeorm-products.repository.postgres.spec.ts   |  4 +--
 9 files changed, 83 insertions(+), 6 deletions(-)
```

---

## 3. Checklist Consolidado de Verificação (Fase 13)

### 3.1 Diagnóstico
- [x] **Oito Markdown do Material 09 recuperados** — **Confirmado** (`prompts/09/artefatos/09-01` a `09-08` lidos e verificados).
- [x] **Arquitetura existente identificada** — **Confirmado** (Artefato `10-01`).
- [x] **Contratos preservados** — **Confirmado** (`Product`, `ProductsRepository`, `PRODUCTS_REPOSITORY`, `ProductsService`, `ProductsController`, `CreateProductDto` intocados).
- [x] **Serviços Docker identificados** — **Confirmado** (`postgres` na porta `5432` e `postgres_test` na porta `5435`).
- [x] **Issue responsável definida** — **Confirmado** (`SUB-09` — Issue #16 criada com autorização).
- [x] **Definition of Ready verificada** — **Confirmado** (`DoR-01` a `DoR-07` registradas em `#issuecomment-6772951249`).
- [x] **Política de WIP considerada** — **Confirmado** (`SUB-04` #7 movida para `In Review` e `SUB-09` #16 para `In Progress`, mantendo `WIP global = 3` e `WIP individual = 1`).
- [x] **Linha de base recuperada** — **Confirmado** (`12 passed` na suíte rápida + `1 passed` na suíte PostgreSQL = `13 passed`).

### 3.2 Dockerfile
- [x] **Versão do Node.js verificada** — **Confirmado** (`node:24.21.0-bookworm-slim`).
- [x] **Versão do pnpm fixada** — **Confirmado** (`pnpm@12.8.1` em `Dockerfile` e `"packageManager": "pnpm@12.8.1"` em `package.json`).
- [x] **Lockfile respeitado** — **Confirmado** (`pnpm install --frozen-lockfile` e `pnpm install --prod --frozen-lockfile`).
- [x] **Corepack ou alternativa validada** — **Confirmado** (`RUN npm install -g pnpm@12.8.1`).
- [x] **Arquivos existentes confirmados** — **Confirmado** (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json` verificados antes do `COPY`).
- [x] **Dockerfile multi-stage implementado** — **Confirmado** (estágios `build` e `runtime`).
- [x] **Build TypeScript executado** — **Confirmado** (`pnpm build`).
- [x] **Entry point localizado** — **Confirmado** (`dist/main.js`).
- [x] **DataSource compilado localizado** — **Confirmado** (`dist/database/data-source.js`).
- [x] **Migrations compiladas disponíveis** — **Confirmado** (`dist/database/migrations/*.js`).
- [x] **Dependências runtime verificadas** — **Confirmado** (`@nestjs/*`, `typeorm`, `pg`, `dotenv` presentes em `dependencies`).

### 3.3 Imagem
- [x] **`.dockerignore` configurado** — **Confirmado** (Artefato `10-03`).
- [x] **Segredos não incorporados** — **Confirmado** (`.env` e `.env.*` excluídos; verificado via `ls -la /app` no contêiner runtime).
- [x] **Imagem construída** — **Confirmado** (`docker build -t celilac-api:dev .`).
- [x] **Imagem identificada** — **Confirmado** (`docker image ls celilac-api` → `celilac-api:dev`).
- [x] **Erros de build tratados** — **Confirmado** (zero erros de build; ajuste de `schema: 'products'` reconstruído em `5.2s`).

### 3.4 Docker Compose
- [x] **Compose anterior preservado** — **Confirmado** (Artefato `10-04`).
- [x] **Serviço `postgres` preservado** — **Confirmado** (`celilac-postgres`, `5432:5432`).
- [x] **Serviço `postgres_test` preservado** — **Confirmado** (`celilac-postgres-test`, `5435:5432`).
- [x] **Volumes preservados** — **Confirmado** (`celilac_postgres_data` e `celilac_postgres_test_data` intocados).
- [x] **Healthchecks preservados** — **Confirmado** (`pg_isready` em ambos os serviços PostgreSQL).
- [x] **Serviço `api` adicionado** — **Confirmado** (`celilac-api`, porta `3200:3200`, `depends_on: postgres: condition: service_healthy`).
- [x] **Portas coerentes** — **Confirmado** (`3200:3200` para API, `5432:5432` para PostgreSQL dev, `5435:5432` para PostgreSQL test).
- [x] **Variáveis fornecidas** — **Confirmado** (`PORT`, `DB_HOST=postgres`, `DB_PORT=5432`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
- [x] **Rede configurada** — **Confirmado** (`celilac-backend_default`).
- [x] **`docker compose config` validado** — **Confirmado** (`docker compose config --quiet` → código `0`).

### 3.5 Migrations
- [x] **Banco de destino confirmado** — **Confirmado** (`celilac_db` em `postgres:5432`).
- [x] **Histórico verificado** — **Confirmado** (`docker compose run --rm api pnpm exec typeorm migration:show -d dist/database/data-source.js`).
- [x] **DataSource compilado confirmado** — **Confirmado** (`dist/database/data-source.js`).
- [x] **Script validado** — **Confirmado** (`migration:show:prod` e `migration:run:prod`).
- [x] **Migrations pendentes identificadas** — **Confirmado** (nenhuma pendente; todas as 5 migrations marcadas com `[X]`).
- [x] **Migrations aplicadas somente quando necessárias** — **Confirmado** (não reexecutadas por já estarem aplicadas).
- [x] **Nenhuma operação destrutiva indevida realizada** — **Confirmado**.

### 3.6 Execução
- [x] **API inicializada** — **Confirmado** (`docker compose up -d --build api`).
- [x] **PostgreSQL acessível** — **Confirmado** (`celilac-postgres` `Healthy`).
- [x] **Comunicação entre contêineres confirmada** — **Confirmado** (`postgres` → `172.24.0.2:5432`).
- [x] **Logs verificados** — **Confirmado** (`docker compose logs api` e `docker compose logs postgres`).
- [x] **Endpoint executado** — **Confirmado** (`POST http://localhost:3200/products`).
- [x] **Resposta HTTP registrada** — **Confirmado** (`201 Created`, `productId: "3c44cbe6-1d9b-4ee1-9087-c1a555820093"`).
- [x] **Registro consultado no PostgreSQL** — **Confirmado** (`SELECT * FROM products.products WHERE "productId" = '3c44cbe6-1d9b-4ee1-9087-c1a555820093'`).
- [x] **API reiniciada** — **Confirmado** (`docker compose restart api`).
- [x] **Registro consultado novamente** — **Confirmado** (`1 row` idêntica retornada após o reinício).
- [x] **Durabilidade comprovada** — **Confirmado** (Artefato `10-07`).

### 3.7 Testes
- [x] **Suíte rápida executada** — **Confirmado** (`pnpm test --run` → `5 passed files`, `12 passed tests`).
- [x] **Suíte PostgreSQL executada** — **Confirmado** (`pnpm test:integration` → `1 passed file`, `1 passed test`).
- [x] **Banco de testes preservado** — **Confirmado** (`celilac_test` na porta `5435`).
- [x] **Resultados registrados** — **Confirmado** (Artefato `10-07`).
- [x] **Regressões analisadas** — **Confirmado** (zero regressões).

### 3.8 GitHub
- [x] **Alterações inspecionadas** — **Confirmado** (`git status`, `git diff`, `git diff --staged --stat`).
- [x] **Arquivos pertinentes selecionados** — **Confirmado** (9 arquivos selecionados via `git add`).
- [x] **Segredos não versionados** — **Confirmado** (`.env` não versionado).
- [x] **Commits registrados** — **Confirmado** (`8f83f6b631938a5245d16056d9e77dfe34ea7996`).
- [x] **Branch publicada** — **Confirmado** (`origin/feature/uc12-09-backend-containerization`).
- [x] **PR criado ou atualizado** — **Confirmado** ([Draft PR #17](https://github.com/evertonfoz/dsc-tests/pull/17)).
- [x] **Evidências incluídas** — **Confirmado** (corpo do PR #17 e comentário `#issuecomment-6774001895` na Issue #16).
- [x] **GitHub Project atualizado** — **Confirmado** (Project #6 atualizado).
- [x] **Revisão técnica considerada** — **Confirmado** (PR #17 mantido em Draft para revisão por pares).
- [x] **Nenhum merge prematuro realizado** — **Confirmado** (PRs #12, #13, #14, #15 e #17 permanecem `OPEN`).

