# ARTEFATO 10-01 — DIAGNÓSTICO DA ARQUITETURA, INFRAESTRUTURA E PLANEJAMENTO DA CONTAINERIZAÇÃO

## 1. Identificação do Projeto e Caso de Uso

| Elemento | Valor Verificado nos Artefatos (Material 09) e no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare` / `celillac-backend`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Oito Artefatos do Material 09 Recuperados** | `prompts/09/artefatos/09-01-diagnostico-persistencia.md` a `09-08-versionamento-checklist.md` (lidos e verificados integralmente) |
| **Branch Ativa Atual** | `feature/uc12-04-products-persistence` (commit `1b9de743f43a8480996e982d2a77a2c139de8f2d`) |

---

## 2. Arquitetura Existente e Contratos Preservados

A inspeção direta dos arquivos em `src/` confirma que o backend NestJS implementa a separação em camadas (Interface HTTP → Aplicação → Domínio → Infraestrutura/Persistência):

### 2.1 Contratos de Domínio, Aplicação e HTTP (`src/modules/products/`)
1. **Entidade de Domínio — `Product` (`src/modules/products/entities/product.entity.ts`):**
   ```typescript
   export class Product {
     constructor(
       public readonly productId: string,
       public readonly name: string,
     ) {}
   }
   ```
2. **Contrato de Repositório — `ProductsRepository` (`src/modules/products/repositories/products.repository.interface.ts`):**
   ```typescript
   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```
3. **Serviço de Aplicação — `ProductsService` (`src/modules/products/services/products.service.ts`):**
   ```typescript
   async createProduct(name: string): Promise<Product> {
     const product = new Product(randomUUID(), name);
     return this.productsRepository.save(product);
   }
   ```
4. **Fronteira HTTP — `ProductsController` e `CreateProductDto`:**
   - `POST /products` recebe `CreateProductDto` (`@IsString() @IsNotEmpty() name!: string`) validado globalmente por `ValidationPipe({ whitelist: true, transform: true })` em `src/main.ts`.
5. **Infraestrutura de Persistência (`src/infrastructure/persistence/products/`):**
   - `ProductOrmEntity`: mapeada para `@Entity({ name: 'products', schema: 'products' })`, `@PrimaryColumn({ type: 'uuid', name: 'productId' })` e `@Column({ type: 'varchar', length: 120, nullable: false })`.
   - `ProductMapper`: métodos estáticos `toPersistence(product: Product): ProductOrmEntity` e `toDomain(entity: ProductOrmEntity): Product`.
   - `TypeOrmProductsRepository`: implementa `ProductsRepository` usando `Repository<ProductOrmEntity>`.
   - `ProductsModule`: importa `TypeOrmModule.forFeature([ProductOrmEntity])` e registra `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`.

---

## 3. Inspeção de Ambiente, Versões, Arquivos de Build e Scripts

| Item Inspecionado | Estado Real Verificado no Repositório | Observação para a Containerização |
| :--- | :--- | :--- |
| **Versão do Node.js no Host** | `v24.21.0` (`@types/node`: `^24.0.0` em `package.json`; `@types/node@24.19.0` no `pnpm-lock.yaml`). Não existe arquivo `.nvmrc`. | Utilizar imagem oficial Node.js 24 LTS determinística (ex.: `node:24.11.0-bookworm-slim` ou `node:24.21.0-bookworm-slim`, sem tags flutuantes como `latest`). |
| **Versão do `pnpm` e Lockfile** | `pnpm` no host: `12.8.1`. `pnpm-lock.yaml` presente com `lockfileVersion: '9.0'`. O campo `"packageManager"` **não** está declarado em `package.json`. | Definir versão explícita e determinística do `pnpm` compatível com `lockfileVersion: '9.0'` no Dockerfile (ou via `packageManager` / Corepack / instalação fixada) e usar `pnpm install --frozen-lockfile`. |
| **`pnpm-workspace.yaml`** | **Existe** na raiz com `allowBuilds: { '@parcel/watcher': true, 'unrs-resolver': true }`. | Pode ser copiado no estágio de build/runtime junto com `package.json` e `pnpm-lock.yaml`. |
| **`tsconfig.json`, `tsconfig.build.json` e `nest-cli.json`** | **Todos os três arquivos existem** na raiz. `tsconfig.json` define `"module": "nodenext"`, `"moduleResolution": "nodenext"`, `"target": "ES2023"`, `"outDir": "./dist"`. `tsconfig.build.json` define `"rootDir": "./src"`, `"include": ["src"]` e exclui `**/*spec.ts`. | Como `"rootDir": "./src"` está em `tsconfig.build.json`, a compilação `pnpm build` gera arquivos diretamente sob `dist/` (ex.: `dist/main.js`, `dist/database/data-source.js`, `dist/database/migrations/*.js`). |
| **Entry Point e Porta HTTP (`src/main.ts`)** | `const port = process.env.PORT || 3200; await app.listen(port);` → compilado em `dist/main.js`. | Porta HTTP padrão `3200` (parametrizável via `PORT`). Entry point real compilado confirmado em `dist/main.js`. |
| **Dependências de Produção vs. Desenvolvimento (`package.json`)** | `dependencies` contém `@nestjs/*`, `typeorm` (`^1.1.2`), `pg` (`^8.23.1`), `dotenv` (`^18.0.7`), `reflect-metadata`, `rxjs`, `class-validator`, `class-transformer`. `devDependencies` contém `@nestjs/cli`, `typescript`, `ts-node`, `vitest`, etc. | Todas as dependências necessárias para executar a API compilada e o CLI JS do TypeORM (`typeorm`, `pg`, `dotenv`) já estão em `dependencies`. |
| **DataSource e Migrations (`src/database/data-source.ts`)** | Compilado em `dist/database/data-source.js`. Porém, a propriedade `migrations` está atualmente configurada como `migrations: ['src/database/migrations/*.ts']`, e o `package.json` possui apenas `"typeorm": "typeorm-ts-node-esm -d src/database/data-source.ts"`. | **Ponto Crítico Identificado:** No contêiner runtime (que conterá apenas `dist/**/*.js` e não terá `src/` nem `ts-node`), `migrations: ['src/database/migrations/*.ts']` não localizará as migrations compiladas em `dist/database/migrations/*.js`, e `typeorm-ts-node-esm` falhará por exigir `ts-node`. Será necessário ajustar o DataSource/scripts para suportar a execução compilada em `dist/database/data-source.js` e `dist/database/migrations/*.js`. |
| **`Dockerfile` e `.dockerignore`** | **Não existem** atualmente na raiz do projeto. | Serão criados nas Fases 3 e 4. |

---

## 4. Infraestrutura Docker, Serviços, Portas, Volumes e Redes

A inspeção de `compose.yaml` e `docker ps -a` confirma a infraestrutura ativa no host:

| Serviço no `compose.yaml` | Contêiner | Imagem | Status Atual (`docker ps -a`) | Portas (`host:container`) | Banco / Usuário | Volume |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`postgres`** | `celilac-postgres` (`544f5f92d334`) | `postgres:17` | `Up 13 days (healthy)` | `5432:5432` | `celilac_db` / `celilac_user` | `celilac_postgres_data` |
| **`postgres_test`** | `celilac-postgres-test` (`77e722626685`) | `postgres:17` | `Up 20 hours (healthy)` | `5435:5432` (`${TEST_DB_PORT:-5435}:5432`) | `celilac_test` / `celilac_test` | `celilac_postgres_test_data` |

- **Contêineres de outros projetos no host:** `classhero-postgres` (`5434:5432`), `classhero-api` (`3333:3000`), `classhero_backend` (`3000:3000`), `classhero-web` (`3013:3000`), etc. A porta **`3200`** está **livre** no host para publicação do serviço `api` (`3200:3200`).
- **Esquema e Migration no banco `celilac_db`:** O schema `products` e a tabela `products.products` já possuem a migration `CreateProductsTable1794255600000` aplicada (`id = 6` em `public.migrations`) e 1 registro persistido (`256824a7-a374-4baf-8c95-492e870ee999` — `"Produto de exemplo"`).

---

## 5. Recuperação da Linha de Base dos Testes

Antes de qualquer alteração para o Material 10, ambas as suítes existentes foram executadas e verificadas:

### 5.1 Suíte Rápida — Unitários, HTTP Simulado e Integrados em Memória (`pnpm test --run`)
- **Comando executado:** `pnpm test --run`
- **Resultado real observado:**
  ```text
  $ vitest run --run
   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/app.controller.spec.ts (1 test) 91ms
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 85ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 85ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 76ms
   ✓ src/modules/products/products.integration.spec.ts (2 tests) 52ms

   Test Files  5 passed (5)
        Tests  12 passed (12)
     Start at  13:21:35
     Duration  565ms
  ```

### 5.2 Suíte de Integração com PostgreSQL Real (`pnpm test:integration`)
- **Comando executado:** `pnpm test:integration`
- **Resultado real observado:**
  ```text
  $ vitest run --config ./vitest.integration.config.ts
   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 112ms
     ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
       ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 32ms

   Test Files  1 passed (1)
        Tests  1 passed (1)
     Start at  13:22:42
     Duration  475ms
  ```
- **Total da Linha de Base:** **6 arquivos / 13 testes aprovados (`13 passed`, `0 failed`)**.

---

## 6. Diagnóstico do Planejamento no GitHub (Issues, DoR, WIP, Branches e PRs)

### 6.1 Estado Atual das Issues e do GitHub Project #6
A inspeção via `gh issue list --repo evertonfoz/dsc-tests` e `gh project item-list 6 --owner evertonfoz` mostra as 9 Issues existentes:

| Issue | Identificador | Título / Escopo | Papel Responsável | Status Atual no Project #6 |
| :---: | :---: | :--- | :--- | :---: |
| [#1](https://github.com/evertonfoz/dsc-tests/issues/1) | `EPIC-UC12` | `[UC12] Cadastrar Produto` | Coordenação (`@evertonfoz`) | `Backlog` |
| [#4](https://github.com/evertonfoz/dsc-tests/issues/4) | `SUB-01` | `[UC12][Domínio] Modelar entidade Product` | Ana Clara Souza | `Ready` |
| [#5](https://github.com/evertonfoz/dsc-tests/issues/5) | `SUB-02` | `[UC12][Contratos] Definir DTO para cadastro de produto` | Carla Mendes Ferreira | `Ready` |
| [#6](https://github.com/evertonfoz/dsc-tests/issues/6) | `SUB-03` | `[UC12][Validação] Implementar validações de cadastro de produto` | Bruno Oliveira Santos | `Ready` |
| [#7](https://github.com/evertonfoz/dsc-tests/issues/7) | `SUB-04` | `[UC12][Persistência] Configurar persistência e implementar repositório de produtos` | Bruno Oliveira Santos | `In Review` *(atualizado de `In Progress`)* |
| [#8](https://github.com/evertonfoz/dsc-tests/issues/8) | `SUB-05` | `[UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` | Ana Clara Souza | `In Progress` |
| [#9](https://github.com/evertonfoz/dsc-tests/issues/9) | `SUB-06` | `[UC12][HTTP] Criar endpoint POST /products` | Carla Mendes Ferreira | `In Review` |
| [#10](https://github.com/evertonfoz/dsc-tests/issues/10) | `SUB-07` | `[UC12][Testes] Implementar testes automatizados para o cadastro de produto` | Diego Costa Almeida | `In Progress` |
| [#11](https://github.com/evertonfoz/dsc-tests/issues/11) | `SUB-08` | `[UC12][Documentação] Atualizar documentação técnica do cadastro de produtos` | Diego Costa Almeida | `Backlog` |
| [#16](https://github.com/evertonfoz/dsc-tests/issues/16) | **`SUB-09`** | **`[UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose`** | **Bruno Oliveira Santos** | **`In Progress`** *(criada e iniciada)* |

### 6.2 Topologia Atual de Branches e Pull Requests
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 — SUB-07 | OPEN]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 — SUB-05 | OPEN]
              └── feature/uc12-06-products-http (ee76412) [Draft PR #14 — SUB-06 / SUB-07 | OPEN]
                    └── feature/uc12-04-products-persistence (1b9de74) [Draft PR #15 — SUB-04 / SUB-07 | OPEN]
                          └── feature/uc12-09-backend-containerization (1b9de74) [Branch da SUB-09 — HEAD atual]
```

### 6.3 Lacuna Identificada no Planejamento e Refinamento Executado com Autorização
1. **Constatacão:** Nenhuma das Sub-Issues originais (`SUB-01` a `SUB-08`) contemplava no seu escopo ou nos seus critérios de aceite a **containerização do backend NestJS (`Dockerfile` multi-stage, `.dockerignore`, serviço `api` no `compose.yaml`, rede Docker e execução de migrations compiladas)**.
   - A `SUB-04` (Issue #7) tinha como escopo estrito a persistência PostgreSQL/TypeORM e o repositório `TypeOrmProductsRepository` (já implementados e submetidos no Draft PR #15). Conforme a diretriz do Material 10, a containerização não foi atribuída automaticamente à `SUB-04`.
2. **Decisão Aprovada e Executada:**
   - Criada a nova Sub-Issue dedicada [**`SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` (Issue #16)**](https://github.com/evertonfoz/dsc-tests/issues/16) vinculada à `EPIC-UC12` (#1), adicionada ao GitHub Project #6 (`PVTI_lAHOAJgJDc4Bp2afzhHkB68`).
   - Verificada e registrada a Definition of Ready completa (`DoR-01` a `DoR-07`) no comentário [`#issuecomment-6772951249`](https://github.com/evertonfoz/dsc-tests/issues/16#issuecomment-6772951249).
   - Regularizado o WIP no GitHub Project #6: a `SUB-04` (Issue #7, com Draft PR #15 aberto) foi movida para `In Review` (`2/2` na coluna `In Review` junto com `SUB-06` #9), e a `SUB-09` (Issue #16) foi movida para `In Progress`, mantendo rigorosamente **`WIP individual = 1`** (Bruno Oliveira Santos) e **`WIP global = 3`** (`#8`, `#10` e `#16`).
   - Criada a branch dedicada `feature/uc12-09-backend-containerization` a partir de `feature/uc12-04-products-persistence`.

---

## 7. Riscos, Pendências e Plano de Execução

### 7.1 Riscos Técnicos Identificados
1. **Caminho das migrations e execução CLI na imagem de produção:** `src/database/data-source.ts` aponta para `migrations: ['src/database/migrations/*.ts']`. No estágio runtime do Dockerfile, existirão apenas os arquivos compilados em `dist/database/migrations/*.js` e não haverá `ts-node`. Portanto, `src/database/data-source.ts` deve suportar o carregamento dos arquivos `.js` quando executado a partir de `dist/database/data-source.js`, e `package.json` deve oferecer script compatível com Node/ESM em produção (ex.: `migration:show:prod` / `migration:run:prod` usando `./node_modules/typeorm/cli.js -d dist/database/data-source.js`).
2. **Comunicação entre contêineres (`DB_HOST`):** O `.env` local define `DB_HOST=127.0.0.1` (para execução no host). Dentro do contêiner `api`, `127.0.0.1`/`localhost` refere-se ao próprio contêiner da API. No `compose.yaml`, o serviço `api` deve sobrescrever explicitamente `DB_HOST: postgres` e `DB_PORT: 5432`.
3. **Working Tree com alterações residuais não adicionadas ao stage:** `git status` aponta modificações de formatação/linha final herdadas em arquivos de `src/` e `http-rest-client/`. Antes de criar commits na nova etapa, devemos higienizar/selecionar apenas os arquivos pertinentes.

### 7.2 Plano de Execução (Fases 2 a 13)
1. **Decisão de Governança (Fase 2):** Aprovar o refinamento do planejamento no GitHub (criação da `SUB-09` + transição de `SUB-04` #7 para `In Review` e `SUB-09` para `In Progress`, ou alternativa escolhida) e definição da branch de trabalho.
2. **Fase 3 (`10-02-dockerfile-build.md`):** Ajustar `src/database/data-source.ts` e scripts do `package.json` para suportar migrations compiladas em `dist/`, construir o `Dockerfile` multi-stage (`build` e `runtime`) com Node 24 e `pnpm` fixados, e inspecionar `dist/`.
3. **Fase 4 (`10-03-dockerignore-imagem.md`):** Configurar `.dockerignore`, executar `docker build -t celilac-api:dev .` e inspecionar `docker image ls`.
4. **Fase 5 (`10-04-evolucao-compose.md`) e Fase 6 (`10-05-rede-variaveis-ambiente.md`):** Adicionar o serviço `api` ao `compose.yaml` preservando `postgres` e `postgres_test`, validar `docker compose config --quiet` e documentar rede e variáveis.
5. **Fase 7 (`10-06-migrations-inicializacao.md`) e Fase 8:** Verificar o histórico de migrations compiladas via `docker compose run --rm api ...`, inicializar o contêiner `api` (`docker compose up -d --build api`) e inspecionar `docker compose ps` e `docker compose logs`.
6. **Fase 9 e Fase 10 (`10-07-execucao-testes-persistencia.md`):** Executar `POST http://localhost:3200/products`, consultar `SELECT * FROM products.products`, reiniciar apenas o contêiner `api` (`docker compose restart api`), comprovar a permanência do registro e reexecutar `pnpm test --run` e `pnpm test:integration`.
7. **Fase 12 e Fase 13 (`10-08-versionamento-checklist.md`):** Versionar as alterações, abrir/atualizar o Pull Request rastreável, atualizar o GitHub Project #6 e consolidar os 8 artefatos Markdown.
