# ARTEFATO 09-08 — VERSIONAMENTO, RASTREABILIDADE GITHUB E CHECKLIST DE CONSISTÊNCIA

## 1. Relatório Consolidado dos 21 Itens da Unidade

| # | Tópico | Síntese Técnica e Evidência Comprovada |
| :---: | :--- | :--- |
| **1** | **Projeto** | **CeliLac** — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare`, repositório [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests)). |
| **2** | **Caso de uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`, [`EPIC-UC12` — Issue #1](https://github.com/evertonfoz/dsc-tests/issues/1)). |
| **3** | **Issue** | [`SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` (Issue #7)](https://github.com/evertonfoz/dsc-tests/issues/7), em coordenação com [`SUB-07` (Issue #10)](https://github.com/evertonfoz/dsc-tests/issues/10) para os testes PostgreSQL. |
| **4** | **Diagnóstico** | Recuperados os 8 artefatos do Material 08 (`prompts/08/artefatos/08-01` a `08-08`), confirmada a linha de base (`5 passed files`, `12 passed tests`), verificado o atendimento de `DoR-01` a `DoR-07` (`#issuecomment-6750384276`) e regularizado o WIP no GitHub Project #6 (`SUB-06` #9 → `In Review`, `SUB-04` #7 → `In Progress`, mantendo `WIP global = 3`). |
| **5** | **Contratos** | Preservados integralmente sem alterações: `Product(productId: string, name: string)`, `ProductsRepository.save(product: Product): Promise<Product>`, token `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`, `ProductsService.createProduct(name: string): Promise<Product>`, `CreateProductDto` e `ProductsController`. |
| **6** | **Ambiente** | Preservado `celilac-postgres` (`544f5f92d334`, porta `5432:5432`, `celilac_db`, `celilac_user`) e criado o serviço isolado `postgres_test` (`celilac-postgres-test`, `77e722626685`, porta `5435:5432`, `celilac_test`, `celilac_test`), evitando colisão com `classhero-postgres` na porta `5434`. |
| **7** | **Entidade ORM** | Implementada `ProductOrmEntity` em `src/infrastructure/persistence/products/product.orm-entity.ts` (`@Entity({ name: 'products', schema: 'products' })`, `@PrimaryColumn({ type: 'uuid', name: 'productId' })`, `@Column({ type: 'varchar', length: 120, nullable: false })`). |
| **8** | **Mapper** | Implementado `ProductMapper` em `src/infrastructure/persistence/products/product.mapper.ts` com `ProductMapper.toPersistence(product: Product): ProductOrmEntity` e `ProductMapper.toDomain(entity: ProductOrmEntity): Product`. |
| **9** | **Migration** | Implementada `CreateProductsTable1794255600000` em `src/database/migrations/1794255600000-CreateProductsTable.ts` (`CREATE SCHEMA IF NOT EXISTS products` e `CREATE TABLE "products"."products"`), registrada em `src/database/data-source.ts` (`synchronize: false`) e aplicada em `celilac_db` via `pnpm typeorm migration:run`. |
| **10** | **Adaptador** | Implementado `TypeOrmProductsRepository` em `src/infrastructure/persistence/products/typeorm-products.repository.ts`, injetando `@InjectRepository(ProductOrmEntity) private readonly ormRepository: Repository<ProductOrmEntity>` e implementando `async save(product: Product): Promise<Product>`. |
| **11** | **Provider** | Atualizado `ProductsModule` (`src/modules/products/products.module.ts`) com `imports: [TypeOrmModule.forFeature([ProductOrmEntity])]` e `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`, preservando `InMemoryProductsRepository` nos testes em memória via override explícito em `products.integration.spec.ts`. |
| **12** | **Testes** | Implementados `src/database/test-data-source.ts`, `vitest.integration.config.ts` e `src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts`. Resultado: `pnpm test:integration` → `1 passed (1)`; `pnpm test --run` → `5 passed (5)` arquivos / `12 passed (12)` testes (zero regressões). |
| **13** | **Evidências de persistência** | `POST /products` (`{"name": "Produto de exemplo"}`) → `201 Created` (`productId: "256824a7-a374-4baf-8c95-492e870ee999"`). Registro confirmado por `SELECT * FROM products.products WHERE "productId" = '256824a7-a374-4baf-8c95-492e870ee999'` antes (`PID 41187`) e depois do reinício completo do backend (`PID 41334`). |
| **14** | **Segurança** | Nenhum arquivo `.env` ou senha real versionado ou exposto; nenhum volume Docker removido; verificação de identidade SQL (`current_database()`, `current_user`, `inet_server_port()`) e de porta no cliente antes de `runMigrations()` e `TRUNCATE TABLE "products"."products"` no banco exclusivo `celilac_test`. |
| **15** | **Branch** | `feature/uc12-04-products-persistence` (derivada de `feature/uc12-06-products-http` e publicada em `origin`). |
| **16** | **Commits** | `1b9de743f43a8480996e982d2a77a2c139de8f2d` (`1b9de74`) — `feat(products): add PostgreSQL persistence adapter (refs #7, refs #10)`. |
| **17** | **Pull Request** | [Draft PR #15 (`https://github.com/evertonfoz/dsc-tests/pull/15`)](https://github.com/evertonfoz/dsc-tests/pull/15) (`feature/uc12-04-products-persistence` → `feature/uc12-06-products-http`, `OPEN`, `isDraft: true`). Preservados intactos os Draft PRs [#12](https://github.com/evertonfoz/dsc-tests/pull/12), [#13](https://github.com/evertonfoz/dsc-tests/pull/13) e [#14](https://github.com/evertonfoz/dsc-tests/pull/14). |
| **18** | **GitHub Project** | [Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6): `Backlog` (`#1`, `#11`); `Ready` (`#4`, `#5`, `#6`); `In Progress` (`#7` `SUB-04`, `#8` `SUB-05`, `#10` `SUB-07` — $WIP = 3$); `In Review` (`#9` `SUB-06`). Comentários publicados em `#7` ([`#issuecomment-6750384276`](https://github.com/evertonfoz/dsc-tests/issues/7#issuecomment-6750384276) e [`#issuecomment-6750821818`](https://github.com/evertonfoz/dsc-tests/issues/7#issuecomment-6750821818)) e em `#10` ([`#issuecomment-6750822995`](https://github.com/evertonfoz/dsc-tests/issues/10#issuecomment-6750822995)). |
| **19** | **Checklist** | Detalhado integralmente na Seção 3 deste artefato. |
| **20** | **Pendências** | 1. Implementar validação de domínio/aplicação `CA02` (`RN01` — nome obrigatório em `ProductsService`/`Product`, `SUB-03` #6).<br>2. Cobrir tratamento específico de falhas de persistência (`FE01`) na camada de aplicação.<br>3. Atualizar documentação técnica final (`SUB-08` #11) e realizar revisão humana dos PRs #12 a #15. |
| **21** | **Próximas ações** | 1. Conduzir o ciclo TDD da regra `CA02` (`SUB-03` #6 / `SUB-05` #8).<br>2. Submeter o Draft PR #15 (`SUB-04`) à revisão técnica por pares (`In Review`).<br>3. Concluir `SUB-08` (#11) e realizar o merge ordenado após aprovação humana. |

---

## 2. Detalhamento do Versionamento Git e Cadeia de Branches

### 2.1 Topologia Completa das Branches e Pull Requests
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 — SUB-07]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 — SUB-05]
              └── feature/uc12-06-products-http (ee76412) [Draft PR #14 — SUB-06 / SUB-07]
                    └── feature/uc12-04-products-persistence (1b9de74) [Draft PR #15 — SUB-04 / SUB-07] (HEAD atual)
```

### 2.2 Seleção Controlada de Arquivos (`git diff --staged --stat`)
Foram adicionados ao stage **exclusivamente** os 14 arquivos pertinentes à `SUB-04` e aos testes PostgreSQL, deixando de fora `.env`, `tsconfig.build.tsbuildinfo`, `prompts/` e arquivos com diferenças acidentais de fim de linha:

```text
 celillac-backend-prepare/.env.example              |   9 +-
 celillac-backend-prepare/compose.yaml              |  21 +++-
 celillac-backend-prepare/package.json              |   1 +
 .../src/database/data-source.ts                    |   5 +-
 .../1794255600000-CreateProductsTable.ts           |  20 ++++
 .../src/database/test-data-source.ts               |  41 +++++++
 .../persistence/products/product.mapper.ts         |  17 +++
 .../persistence/products/product.orm-entity.ts     |  17 +++
 .../typeorm-products.repository.postgres.spec.ts   | 129 +++++++++++++++++++++
 .../products/typeorm-products.repository.ts        |  22 ++++
 .../modules/products/products.integration.spec.ts  |  10 +-
 .../src/modules/products/products.module.ts        |   7 +-
 celillac-backend-prepare/vitest.config.ts          |   1 +
 .../vitest.integration.config.ts                   |  11 ++
 14 files changed, 304 insertions(+), 7 deletions(-)
```

---

## 3. Checklist Consolidado de Verificação (Fase 12)

### 3.1 Planejamento
- [x] **Oito Markdown do Material 08 recuperados** — **Confirmado** (`prompts/08/artefatos/08-01` a `08-08` lidos e verificados).
- [x] **Contratos existentes preservados** — **Confirmado** (`Product`, `ProductsRepository`, `PRODUCTS_REPOSITORY`, `ProductsService`, `ProductsController`, `CreateProductDto` inalterados).
- [x] **SUB-04 identificada** — **Confirmado** (`Issue #7` no repositório `evertonfoz/dsc-tests`).
- [x] **Definition of Ready verificada** — **Confirmado** (`DoR-01` a `DoR-07` avaliadas no Artefato `09-01` e formalizadas em `#issuecomment-6750384276`).
- [x] **Dependências analisadas** — **Confirmado** (`SUB-01` #4 e componentes HTTP de `SUB-06` #9 mapeados).
- [x] **Política de WIP considerada** — **Confirmado** (`SUB-06` #9 movida legitimamente para `In Review`, mantendo `WIP global = 3` e `WIP individual = 1` com `SUB-04` #7 em `In Progress`).
- [x] **Branch-base definida** — **Confirmado** (`feature/uc12-04-products-persistence` criada a partir de `feature/uc12-06-products-http`).

### 3.2 Ambiente
- [x] **Infraestrutura existente inspecionada** — **Confirmado** (`compose.yaml`, `docker ps -a`, `docker volume ls` e `.env` verificados no Artefato `09-02`).
- [x] **Banco de desenvolvimento identificado** — **Confirmado** (`celilac-postgres`, porta `5432`, banco `celilac_db`, usuário `celilac_user`).
- [x] **Banco de testes isolado** — **Confirmado** (`celilac-postgres-test`, porta `5435`, banco `celilac_test`, usuário `celilac_test`, volume `celilac_postgres_test_data`).
- [x] **Portas verificadas** — **Confirmado** (identificada ocupação da porta `5434` por `classhero-postgres` e alocada a porta livre `5435:5432` para `postgres_test`).
- [x] **Mapeamento Docker compreendido** — **Confirmado** (distinguida a porta publicada no host `5435` da porta interna `5432` retornada por `inet_server_port()`).
- [x] **Credenciais protegidas** — **Confirmado** (nenhuma senha real exposta nos artefatos ou versionada no Git).
- [x] **Conexão PostgreSQL comprovada** — **Confirmado** (`SELECT current_database(), current_user, inet_server_port()` executado em ambos os contêineres).

### 3.3 TypeORM e Migrations
- [x] **Configuração existente preservada** — **Confirmado** (`AppModule` e pacotes NPM preservados).
- [x] **DataSource verificado** — **Confirmado** (`src/database/data-source.ts` atualizado com `ProductOrmEntity`).
- [x] **`synchronize: false` preservado** — **Confirmado** (em `AppModule`, `src/database/data-source.ts` e `src/database/test-data-source.ts`).
- [x] **Entidade ORM implementada** — **Confirmado** (`src/infrastructure/persistence/products/product.orm-entity.ts`).
- [x] **Mapper implementado** — **Confirmado** (`src/infrastructure/persistence/products/product.mapper.ts`).
- [x] **Migration implementada** — **Confirmado** (`src/database/migrations/1794255600000-CreateProductsTable.ts`).
- [x] **Esquema coerente** — **Confirmado** (`\d products.products` concorda com `ProductOrmEntity` e `CreateProductsTable1794255600000`).
- [x] **Migration aplicada no banco correto** — **Confirmado** (`pnpm typeorm migration:run` executado em `celilac_db` e `dataSource.runMigrations()` em `celilac_test`).
- [x] **Histórico verificado** — **Confirmado** (`SELECT * FROM public.migrations` verificado em `celilac_db` e `celilac_test`).

### 3.4 Adaptador
- [x] **`TypeOrmProductsRepository` implementado** — **Confirmado** (`src/infrastructure/persistence/products/typeorm-products.repository.ts`).
- [x] **Assinatura `save(product: Product): Promise<Product>` preservada** — **Confirmado**.
- [x] **Imports corretos** — **Confirmado** (compatíveis com TypeScript `nodenext` / ESM `.js`).
- [x] **Compilação verificada** — **Confirmado** (`pnpm build` executado com código de saída `0`).
- [x] **Provider atualizado** — **Confirmado** (`{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }` em `ProductsModule`).
- [x] **Dependências resolvidas** — **Confirmado** (`[InstanceLoader] ProductsModule dependencies initialized +0ms`).
- [x] **Aplicação inicializada** — **Confirmado** (`node dist/main.js` nas instâncias `PID 41187` e `PID 41334`).
- [x] **Testes em memória preservados** — **Confirmado** (`products.integration.spec.ts` preservado com override explícito de `PRODUCTS_REPOSITORY` e `getRepositoryToken(ProductOrmEntity)`).

### 3.5 Persistência
- [x] **Cadastro HTTP executado** — **Confirmado** (`POST /products` com `{"name": "Produto de exemplo"}` → `201 Created`).
- [x] **Registro consultado no PostgreSQL** — **Confirmado** (`SELECT * FROM products.products WHERE "productId" = '256824a7-a374-4baf-8c95-492e870ee999'`).
- [x] **`productId` confirmado** — **Confirmado** (`256824a7-a374-4baf-8c95-492e870ee999`).
- [x] **Backend reiniciado** — **Confirmado** (`PID 41187` encerrado e `PID 41334` iniciado).
- [x] **Registro novamente consultado** — **Confirmado** (`1 row` idêntica retornada após o reinício).
- [x] **Durabilidade comprovada** — **Confirmado** (Artefato `09-06`).

### 3.6 Testes
- [x] **Banco exclusivo confirmado** — **Confirmado** (`celilac_test` em `celilac-postgres-test`, porta `5435`).
- [x] **Configurações verificadas** — **Confirmado** (`vitest.integration.config.ts` e `package.json`).
- [x] **Segurança validada antes das migrations e limpezas** — **Confirmado** (`createTestDataSource()` + consulta de identidade SQL + validação de `isSafeTestEnvironment`).
- [x] **Teste PostgreSQL implementado** — **Confirmado** (`src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts`).
- [x] **Imports completos** — **Confirmado** (`randomUUID`, `DataSource`, `Repository`, hooks/asserções Vitest, `createTestDataSource`, `Product`, `ProductOrmEntity`, `TypeOrmProductsRepository`).
- [x] **DataSource configurado** — **Confirmado** (`src/database/test-data-source.ts`).
- [x] **Teste executado** — **Confirmado** (`pnpm test:integration` → `1 passed (1)`).
- [x] **Resultados documentados** — **Confirmado** (Artefato `09-07`).
- [x] **Suíte anterior reexecutada** — **Confirmado** (`pnpm test --run` → `5 passed (5)` arquivos, `12 passed (12)` testes).
- [x] **Regressões investigadas** — **Confirmado** (diagnosticada e corrigida a resolução de `ProductOrmEntityRepository` no teste integrado em memória; zero regressões finais).

### 3.7 GitHub
- [x] **Alterações inspecionadas** — **Confirmado** (`git status`, `git diff`, `git diff --staged --stat`).
- [x] **Arquivos pertinentes selecionados** — **Confirmado** (14 arquivos selecionados individualmente via `git add`).
- [x] **Credenciais não versionadas** — **Confirmado** (`.env` não versionado; `.env.example` sem segredos).
- [x] **Commits realizados** — **Confirmado** (`1b9de743f43a8480996e982d2a77a2c139de8f2d`).
- [x] **Branch publicada** — **Confirmado** (`origin/feature/uc12-04-products-persistence`).
- [x] **PR criado ou atualizado** — **Confirmado** ([Draft PR #15](https://github.com/evertonfoz/dsc-tests/pull/15) criado; Draft PRs #12, #13 e #14 preservados).
- [x] **GitHub Project atualizado** — **Confirmado** (Project #6 atualizado e comentários publicados nas Issues #7 e #10).
- [x] **Revisão considerada** — **Confirmado** (PR #15 mantido em Draft para revisão cruzada por Ana Clara Souza).
- [x] **Nenhum merge prematuro realizado** — **Confirmado** (PRs #12, #13, #14 e #15 permanecem `OPEN`).
- [x] **Pendências registradas** — **Confirmado** (Seção 1, item 20).

