# ARTEFATO 10-07 — VERIFICAÇÃO FUNCIONAL, DURABILIDADE E REEXECUÇÃO DAS SUÍTES DE TESTES

## 1. Ambiente Containerizado em Execução

| Parâmetro | Valor Real Verificado |
| :--- | :--- |
| **Contêiner da API** | `celilac-api` (`celilac-api:dev`, porta `0.0.0.0:3200->3200/tcp`) |
| **Contêiner do PostgreSQL (Dev)** | `celilac-postgres` (`postgres:17`, porta `0.0.0.0:5432->5432/tcp`, banco `celilac_db`, volume `celilac-backend_celilac_postgres_data`) |
| **Contêiner do PostgreSQL (Testes)** | `celilac-postgres-test` (`postgres:17`, porta `0.0.0.0:5435->5432/tcp`, banco `celilac_test`, volume `celillac-backend-prepare_celilac_postgres_test_data`) |
| **Rede Docker** | `celilac-backend_default` (`DB_HOST=postgres` resolvendo para `172.24.0.2:5432`) |
| **Fluxo Exercitado** | `Cliente HTTP (curl) → API NestJS em contêiner (celilac-api:3200) → PostgreSQL em contêiner (celilac-postgres:5432) → Volume persistente` |

---

## 2. Diagnóstico Real de Falha e Correção Antes da Verificação Final (Fase 11)

Durante a primeira tentativa de `POST /products` após o checkout limpo da branch, ocorreu uma falha real de mapeamento de schema do TypeORM, diagnosticada e corrigida conforme o protocolo da Fase 11:

| Etapa do Diagnóstico | Registro Real |
| :--- | :--- |
| **1. Sintoma** | `POST http://localhost:3200/products` retornou `HTTP/1.1 500 Internal Server Error` (`{"statusCode":500,"message":"Internal server error"}`). |
| **2. Comando de Diagnóstico** | `docker compose logs api` |
| **3. Mensagem Real Observada** | `ERROR [ExceptionsHandler] QueryFailedError: relation "products" does not exist` (`code: '42P01'`, `query: 'SELECT "ProductOrmEntity"."productId" ... FROM "products" "ProductOrmEntity" WHERE "ProductOrmEntity"."productId" = $1'`). |
| **4. Componente Identificado** | `ProductOrmEntity` (`src/infrastructure/persistence/products/product.orm-entity.ts`). |
| **5. Investigação da Causa** | No commit `1b9de74` da branch-base, o decorador `@Entity({ name: 'products' })` não continha a propriedade `schema: 'products'` (que estava apenas na working tree não comitada antes de `git checkout --`), fazendo o TypeORM consultar `"public"."products"` em vez de `"products"."products"`. |
| **6. Correção Aplicada** | 1. Restaurado `@Entity({ name: 'products', schema: 'products' })` em `src/infrastructure/persistence/products/product.orm-entity.ts`.<br>2. Alinhados `src/database/migrations/1794255600000-CreateProductsTable.ts` e `src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts` com `"products"."products"`.<br>3. Reconstruída e reiniciada a imagem da API com `docker compose up -d --build api` (`5.2s`, aproveitando cache das camadas de dependências). |
| **7. Resultado Pós-Correção** | `POST /products` passou a retornar `HTTP/1.1 201 Created` e gravar diretamente em `products.products`. |

---

## 3. Verificação Funcional e Comprovação de Durabilidade (Fase 9)

### 3.1 Etapa 1 — Cadastro HTTP (`POST /products`) contra o Contêiner `celilac-api`
- **Comando executado:**
  ```bash
  curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Produto de exemplo"}'
  ```
- **Resposta HTTP real observada:**
  ```http
  HTTP/1.1 201 Created
  X-Powered-By: Express
  Content-Type: application/json; charset=utf-8
  Content-Length: 80
  ETag: W/"50-tNVND7fiBWXevKQNACE3HpiFx90"
  Date: Tue, 10 Nov 2026 16:53:37 GMT
  Connection: keep-alive
  Keep-Alive: timeout=5

  {"productId":"3c44cbe6-1d9b-4ee1-9087-c1a555820093","name":"Produto de exemplo"}
  ```

| Atributo | Valor Obtido |
| :--- | :--- |
| **Endpoint** | `POST http://localhost:3200/products` |
| **Status HTTP** | `201 Created` |
| **`productId` Retornado** | `3c44cbe6-1d9b-4ee1-9087-c1a555820093` |
| **`name` Retornado** | `Produto de exemplo` |

### 3.2 Etapa 2 — Consulta Inicial ao PostgreSQL (Antes do Reinício do Contêiner `api`)
1. **Consulta geral da tabela `products.products`:**
   - **Comando:**
     ```bash
     docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products;"
     ```
   - **Resultado real observado:**
     ```text
                   productId               |        name        
     --------------------------------------+--------------------
      256824a7-a374-4baf-8c95-492e870ee999 | Produto de exemplo
      3c44cbe6-1d9b-4ee1-9087-c1a555820093 | Produto de exemplo
     (2 rows)
     ```
     *(Nota: O registro `256824a7-...` do Material 09 permaneceu preservado no volume, e o novo registro `3c44cbe6-...` criado pelo contêiner `celilac-api` foi gravado com sucesso).*

2. **Consulta específica pelo `productId` recém-criado (`3c44cbe6-1d9b-4ee1-9087-c1a555820093`):**
   - **Comando:**
     ```bash
     docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products WHERE \"productId\" = '3c44cbe6-1d9b-4ee1-9087-c1a555820093';"
     ```
   - **Resultado real observado (Antes do Reinício):**
     ```text
                   productId               |        name        
     --------------------------------------+--------------------
      3c44cbe6-1d9b-4ee1-9087-c1a555820093 | Produto de exemplo
     (1 row)
     ```

### 3.3 Etapa 3 — Reinicialização Exclusiva do Contêiner `api` (`docker compose restart api`)
Sem remover volumes e sem reiniciar o contêiner `celilac-postgres`, reiniciou-se apenas o serviço `api`:
- **Comando executado:**
  ```bash
  docker compose restart api
  ```
- **Log real de reinicialização do contêiner `celilac-api` (`docker compose logs api`):**
  ```text
  celilac-api  | [Nest] 1  - 11/10/2026, 4:48:16 PM     LOG [NestApplication] Nest application successfully started +1ms
  celilac-api  | Server is running on http://localhost:3200
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [NestFactory] Starting Nest application...
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +6ms
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +20ms
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +1ms
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 5:02:34 PM     LOG [NestApplication] Nest application successfully started +1ms
  celilac-api  | Server is running on http://localhost:3200
  ```

### 3.4 Etapa 4 — Nova Consulta ao PostgreSQL (Após o Reinício do Contêiner `api`)
- **Comando executado:**
  ```bash
  docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products WHERE \"productId\" = '3c44cbe6-1d9b-4ee1-9087-c1a555820093';"
  ```
- **Resultado real observado (Após o Reinício):**
  ```text
                productId               |        name        
  --------------------------------------+--------------------
   3c44cbe6-1d9b-4ee1-9087-c1a555820093 | Produto de exemplo
  (1 row)
  ```

### 3.5 Comparação Antes vs. Depois da Reinicialização do Contêiner `api`

| Momento da Verificação | Instância do Contêiner `celilac-api` | `productId` no PostgreSQL | `name` no PostgreSQL | Status de Durabilidade |
| :--- | :---: | :--- | :--- | :---: |
| **Antes de `docker compose restart api`** | Inicializada às `16:48:16 UTC` | `3c44cbe6-1d9b-4ee1-9087-c1a555820093` | `Produto de exemplo` | Persistido (`1 row`) |
| **Após `docker compose restart api`** | Reinicializada às `17:02:34 UTC` | `3c44cbe6-1d9b-4ee1-9087-c1a555820093` | `Produto de exemplo` | **Preservado (`1 row` idêntica)** |

---

## 4. Reexecução das Suítes de Testes Automatizados e Análise de Regressões (Fase 10)

### 4.1 Suíte Rápida (`pnpm test --run`)
- **Comando executado:**
  ```bash
  pnpm test --run
  ```
- **Saída real observada:**
  ```text
  $ vitest run --run
   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/app.controller.spec.ts (1 test) 94ms
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 94ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 86ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 65ms
   ✓ src/modules/products/products.integration.spec.ts (2 tests) 59ms

   Test Files  5 passed (5)
        Tests  12 passed (12)
     Start at  14:03:27
     Duration  593ms (transform 143ms, setup 0ms, import 1.52s, tests 398ms, environment 0ms)
  ```

### 4.2 Suíte de Integração com PostgreSQL Real (`pnpm test:integration`)
- **Comando executado:**
  ```bash
  pnpm test:integration
  ```
- **Saída real observada:**
  ```text
  $ vitest run --config ./vitest.integration.config.ts
   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 68ms
     ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
       ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 20ms

   Test Files  1 passed (1)
        Tests  1 passed (1)
     Start at  14:03:28
     Duration  294ms (transform 23ms, setup 0ms, import 165ms, tests 68ms, environment 0ms)
  ```

### 4.3 Comparação com a Linha de Base

| Nível / Suíte de Verificação | Linha de Base (Início do Material 10) | Resultado Final Após Containerização | Regressões |
| :--- | :---: | :---: | :---: |
| **Suíte Rápida (`pnpm test --run`)** | `5 passed files` / `12 passed tests` | `5 passed files` / `12 passed tests` | **Zero** |
| **Suíte PostgreSQL (`pnpm test:integration`, porta `5435`)** | `1 passed file` / `1 passed test` | `1 passed file` / `1 passed test` | **Zero** |
| **Verificação Containerizada (`celilac-api` + `celilac-postgres`)** | Não existia | `POST /products` (`201 Created`) + durabilidade comprovada após `docker compose restart api` | **N/A (Novo nível validado)** |

---

## 5. Limitações e Pendências

1. **Limitações conhecidas do escopo atual do UC12:**
   - A validação de `name` vazio na camada de domínio/aplicação (`CA02` / `SUB-03` #6) e o tratamento customizado de falhas de persistência (`FE01`) permanecem planejados nas respectivas Sub-Issues.
2. **Próximo passo (Fases 12 e 13 — Artefato `10-08`):**
   - Inspecionar `git status` e `git diff`, criar o commit rastreável na branch `feature/uc12-09-backend-containerization`, publicar a branch, abrir o Pull Request associado à `SUB-09` (#16) e consolidar o checklist final.

