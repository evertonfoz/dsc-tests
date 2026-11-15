# ARTEFATO 12-06 — VERIFICAÇÃO DE REGRESSÕES E SEGURANÇA DOS AMBIENTES

## 1. Linha de Base Histórica vs. Verificação Atual

O Material 11 registrou historicamente 16 testes aprovados (13 na suíte rápida, 1 na suíte de integração PostgreSQL e 2 na suíte E2E), além de build e lint sem erros. Conforme as diretrizes do Material 12, **resultados históricos não substituem a verificação real**: todas as suítes e ferramentas de verificação foram inspecionadas e reexecutadas nesta auditoria.

---

## 2. Suítes Existentes e Matriz de Referência por Área Auditada

A tabela abaixo relaciona cada área auditada no fluxo `UC12 — Cadastrar Produto` com os scripts confirmados em `package.json` e os arquivos de teste correspondentes:

| Área Auditada | Verificações Pertinentes | Arquivos / Scripts Correspondentes |
| :--- | :--- | :--- |
| **Service (`ProductsService`)** | Testes unitários e de aplicação | `src/modules/products/services/products.service.spec.ts` (`pnpm test`) |
| **Controller (`ProductsController`)** | Testes HTTP de fronteira (`201` e `400`) | `src/modules/products/controllers/products.controller.spec.ts` (`pnpm test`) |
| **DTO de Resposta (`ProductResponseDto` / `toProductResponse`)** | Testes de contrato público fechado e não exposição (`internalNote`) | `src/modules/products/controllers/products.controller.spec.ts` — 3.º teste com `toEqual()` (`pnpm test`) |
| **Repository em Memória e Providers (`ProductsModule`)** | Inicialização do módulo e teste integrado `Controller -> Service -> Repository` | `src/modules/products/products.integration.spec.ts` (`pnpm test`) |
| **TypeORM, `TypeOrmProductsRepository`, `ProductMapper`, `ProductOrmEntity` e Migrations** | Testes de persistência real no PostgreSQL com verificação direta via SQL | `src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts` (`pnpm test:integration`) |
| **Docker Compose (`api`, `postgres`, `postgres_test`)** | Verificação de estado e saúde dos contêineres | `docker compose ps` |
| **Tipagem Estática e Qualidade de Código** | Compilação TypeScript/NestJS e análise estática com `oxlint` | `pnpm build` e `pnpm lint` |

### Confirmação dos Scripts em `package.json`
Inspeção de `package.json` (linhas 10–29) confirmou os comandos exatos:
- `"build": "nest build"`
- `"lint": "oxlint --type-aware src/ test/"`
- `"test": "vitest run"` (usa `vitest.config.ts`, incluindo `**/*.spec.ts` e excluindo `**/*.postgres.spec.ts`)
- `"test:integration": "vitest run --config ./vitest.integration.config.ts"` (inclui exclusivamente `**/*.postgres.spec.ts`)
- `"test:e2e": "vitest run --config ./vitest.config.e2e.ts"` (inclui `**/*.e2e-spec.ts`)

---

## 3. Análise de Segurança dos Ambientes PostgreSQL (Obrigação Especial)

Antes de executar qualquer teste que acesse banco de dados, os dois ambientes PostgreSQL foram auditados:

### 3.1. Ambiente de Testes de Persistência do UC12 (`pnpm test:integration`)
- **Arquivo de configuração:** `src/database/test-data-source.ts` e `.env`.
- **Banco e conexão confirmados:**
  - `TEST_DB_HOST=127.0.0.1`
  - `TEST_DB_PORT=5435` (contêiner `celilac-postgres-test`)
  - `TEST_DB_NAME=celilac_test`
  - `TEST_DB_USERNAME=celilac_test`
  - `TEST_DB_ALLOW_DESTRUCTIVE=true`
- **Salvaguardas verificadas no código (`test-data-source.ts` e `typeorm-products.repository.postgres.spec.ts`):**
  1. `createTestDataSource()` bloqueia a criação do `DataSource` caso `TEST_DB_NAME` não termine com `_test` ou caso banco, usuário ou porta coincidam com `DB_NAME` (`celilac_db`), `DB_USERNAME` (`celilac_user`) ou `DB_PORT` (`5432`).
  2. No `beforeAll`, o teste executa `SELECT current_database() AS name, current_user AS usuario, inet_server_port() AS porta` e confirma que está conectado a `celilac_test` na porta configurada `5435` antes de rodar `dataSource.runMigrations()`.
  3. No `beforeEach`, a limpeza `TRUNCATE TABLE "products"."products"` só é executada se `isSafeTestEnvironment === true` e `process.env.TEST_DB_ALLOW_DESTRUCTIVE === 'true'`.
- **Conclusão de segurança:** **100% seguro e isolado** do banco de desenvolvimento `celilac_db`.

### 3.2. Ambiente de Testes E2E Legados (`pnpm test:e2e`)
Conforme determinado na Fase 7 do Material 12, os 7 passos de verificação prévia foram executados antes de rodar `pnpm test:e2e`:
1. **Inspeção do script:** `vitest run --config ./vitest.config.e2e.ts` executa arquivos `**/*.e2e-spec.ts`.
2. **Leitura dos testes E2E correspondentes:**
   - `test/app.e2e-spec.ts`: executa apenas `GET /` esperando `200 Hello World!`.
   - `test/orders/confirm-order.e2e-spec.ts`: testa `POST /orders/:id/confirm` (caso de uso legado `UC07 — Orders`).
3. **Confirmação do banco de destino:** Ambos importam `AppModule` (`src/app.module.ts`), que lê `DB_HOST=127.0.0.1`, `DB_PORT=5432`, `DB_NAME=celilac_db`, `DB_USERNAME=celilac_user` do arquivo `.env`. Portanto, **`pnpm test:e2e` conecta-se ao banco de desenvolvimento `celilac_db`**, e não a `celilac_test`.
4. **Identificação de gravação/alteração/remoção de dados:**
   - `app.e2e-spec.ts` não grava nem remove registros no banco.
   - `confirm-order.e2e-spec.ts` insere 1 pedido (`OrderEntity`) com UUID gerado na hora (`createdOrderIds.push(order.orderId)`) e 1 pagamento (`PaymentEntity`), atualiza o status desse pedido para `CONFIRMED` e, no bloco `afterAll` (linhas 38–46), executa `DELETE` cirúrgico filtrando exclusivamente pelos UUIDs armazenados em `createdOrderIds` (`paymentsRepository.delete(...)` e `ordersRepository.delete(createdOrderIds)`).
5. **Avaliação dos riscos para `celilac_db`:** Não há uso de `TRUNCATE`, `DROP` ou deleção sem cláusula `WHERE` em `confirm-order.e2e-spec.ts`, e a tabela `products.products` do UC12 sequer é acessada por essa suíte.
6. **Necessidade de isolamento adicional:** Para o escopo atual de verificação não destrutiva, o teardown cirúrgico por UUID em `afterAll` preserva os dados existentes em `celilac_db`.
7. **Execução autorizada e compreendida:** Com o impacto integralmente mapeado e seguro para `products.products` e `celilac_db`, a suíte foi executada para comprovar ausência de regressão global em `AppModule`.

---

## 4. Comandos Executados e Resultados Reais Observados

| Ordem | Comando Executado | Código de Saída | Arquivos Verificados | Testes Executados | Resultado Observado | Tempo de Execução |
| :---: | :--- | :---: | :---: | :---: | :--- | :---: |
| **1** | `./node_modules/.bin/vitest run` (`pnpm test`) | `0` | `5 passed (5)` | `13 passed (13)` | **Aprovado (0 falhas)** | `601ms` |
| **2** | `./node_modules/.bin/vitest run --config ./vitest.integration.config.ts` (`pnpm test:integration`) | `0` | `1 passed (1)` | `1 passed (1)` | **Aprovado (0 falhas)** | `506ms` |
| **3** | `./node_modules/.bin/vitest run --config ./vitest.config.e2e.ts` (`pnpm test:e2e`) | `0` | `2 passed (2)` | `2 passed (2)` | **Aprovado (0 falhas)** | `578ms` |
| **4** | `./node_modules/.bin/nest build` (`pnpm build`) | `0` | Projeto completo | — | **Compilado sem erros (`0 errors`)** | ~`2.0s` |
| **5** | `./node_modules/.bin/oxlint --type-aware src/ test/` (`pnpm lint`) | `0` | `54 files` (111 regras) | — | **`0 errors`, `3 warnings` preexistentes** | `163ms` |
| **6** | `docker compose ps` | `0` | 3 serviços Docker | — | `celilac-api` (`Up`), `celilac-postgres` (`Up healthy`), `celilac-postgres-test` (`Up healthy`) | `< 1s` |

### Detalhamento dos 16 Testes Executados e Aprovados
1. **`src/modules/products/services/products.service.spec.ts` (1 teste):**
   - `should register and save a product when valid data is provided (CA01)` — **PASS**
2. **`src/modules/products/controllers/products.controller.spec.ts` (3 testes):**
   - `should create a product when valid data is provided (POST /products -> 201)` — **PASS**
   - `should reject an empty product name at the HTTP boundary (POST /products -> 400)` — **PASS**
   - `should expose only public contract fields and filter simulated internal properties (POST /products -> 201)` — **PASS**
3. **`src/modules/products/products.integration.spec.ts` (2 testes):**
   - `deve criar um produto com dados válidos` — **PASS**
   - `deve rejeitar nome vazio na fronteira HTTP` — **PASS**
4. **`src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts` (1 teste):**
   - `deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco` — **PASS**
5. **Suítes de outros módulos / raiz (9 testes):**
   - `src/app.controller.spec.ts` (1 teste unitário) — **PASS**
   - `src/modules/orders/services/orders.service.spec.ts` (6 testes unitários) — **PASS**
   - `test/app.e2e-spec.ts` (1 teste E2E) — **PASS**
   - `test/orders/confirm-order.e2e-spec.ts` (1 teste E2E) — **PASS**

---

## 5. Comparação com a Linha de Base, Falhas e Regressões

| Métrica | Linha de Base Histórica (Material 11) | Resultado Atual Verificado (Material 12) | Comparação / Diagnóstico |
| :--- | :--- | :--- | :--- |
| **Suíte rápida (`pnpm test`)** | 5 arquivos / 13 testes aprovados | 5 arquivos / 13 testes aprovados | **Idêntico (0 regressões)** |
| **Suíte PostgreSQL (`pnpm test:integration`)** | 1 arquivo / 1 teste aprovado | 1 arquivo / 1 teste aprovado | **Idêntico (0 regressões)** |
| **Suíte E2E (`pnpm test:e2e`)** | 2 arquivos / 2 testes aprovados | 2 arquivos / 2 testes aprovados | **Idêntico (0 regressões)** |
| **Compilação (`pnpm build`)** | Sem erros | Sem erros (código `0`) | **Idêntico (0 regressões)** |
| **Análise estática (`pnpm lint`)** | 0 erros, 3 avisos preexistentes | 0 erros, 3 avisos preexistentes | **Idêntico (0 regressões)** |

- **Falhas observadas:** Nenhuma (`0 failed`).
- **Regressões detectadas:** Nenhuma.
- **Testes não executados e justificativas:** Todas as suítes automatizadas do repositório (`test`, `test:integration`, `test:e2e`, `build` e `lint`) foram executadas. Apenas testes destrutivos contra o banco de desenvolvimento `celilac_db` não foram realizados, por serem expressamente vedados pelas regras de segurança.

---

## 6. Limitações das Verificações e Conclusão

A aprovação dos 16 testes automatizados, do build e do linter oferece forte evidência de que os contratos HTTP, de aplicação e de persistência do `UC12 — Cadastrar Produto` permanecem íntegros. Contudo, **testes automatizados reduzem riscos específicos, mas não constituem prova absoluta de ausência de defeitos**:

- Os testes atuais de `Products` cobrem os critérios `CA01` a `CA05` para criação válida (`201`), rejeição de nome vazio (`400`), não exposição de propriedades internas (`internalNote`) e persistência no PostgreSQL (`varchar(120)`), mas não exercitam cenários de carga/concorrência, indisponibilidade de rede com o PostgreSQL ou limites de tamanho máximo de string (`> 120` caracteres na camada HTTP).
- Dentro dos limites do escopo contratado para o UC12, a verificação confirma **zero regressões** e sustenta com segurança a decisão de preservação arquitetural.
