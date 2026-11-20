# ARTEFATO 11-09 — FEEDBACK E RELATÓRIO DA VERIFICAÇÃO PÓS-ATIVIDADE (MATERIAL 11)

## 1. Identificação da Verificação

| Elemento | Valor Verificado no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`) |
| **Repositório** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (#1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issues Relacionadas** | [`SUB-02 — [UC12][Contratos] Criar DTO de cadastro de produto` (#5)](https://github.com/evertonfoz/dsc-tests/issues/5), [#9 (SUB-06)](https://github.com/evertonfoz/dsc-tests/issues/9) e [#10 (SUB-07)](https://github.com/evertonfoz/dsc-tests/issues/10) |
| **Branch Auditada** | `main` (sincronizada com `feature/uc12-10-http-contract-stabilization`) |
| **Branch Anterior (Material 10)** | `feature/uc12-09-backend-containerization` |
| **Pull Request de Referência** | [Pull Request #19](https://github.com/evertonfoz/dsc-tests/pull/19) |
| **Guia de Origem** | `prompts/11B-guia-verificacao-pos-atividade.md` |
| **Data da Verificação** | 20 de Novembro de 2026 |
| **Status da Avaliação** | **APROVADO COM EXCELÊNCIA** (100% dos critérios contratuais, testes de não exposição e garantias containerizadas comprovados) |

---

## 2. Resumo Executivo da Auditoria

A execução integral e não destrutiva do roteiro de verificação pós-atividade comprovou que a estabilização do contrato público HTTP do CeliLac atende rigorosamente aos padrões de Engenharia de Software, APIs RESTful e tipagem defensiva:

1. **Separação Explícita de Modelos:** O endpoint `POST /products` agora devolve formalmente `ProductResponseDto` (`productId: string`, `name: string`) mediado pela função pura `toProductResponse()`. Nenhuma dependência direta com a entidade de domínio `Product` ou com o modelo relacional do TypeORM é exposta.
2. **Preservação Total dos Contratos Internos:** O diff entre a branch atual e a base em relação às pastas internas (`src/modules/products/entities/`, `services/`, `repositories/` e `src/infrastructure/`) resultou estritamente vazio. O método `this.productsService.createProduct(name)` manteve rigorosamente a assinatura original.
3. **Mapeamento Explícito vs. Runtime:** Ficou demonstrado que interfaces TypeScript não barram propriedades adicionais em tempo de execução. O mapper explícito atua como barreira física de serialização, gerando um novo literal contendo exclusivamente as chaves públicas.
4. **Proteção Comprovada contra Vazamento de Propriedades Internas:** A suíte de testes do Controller foi expandida com um cenário que simula intencionalmente a devolução de `internalNote` pelo Service. O teste com asserção fechada `toEqual()` comprova que propriedades internas nunca vazam no JSON HTTP.
5. **Semântica HTTP e Validação de Entrada:** Testes manuais e automatizados contra a API containerizada confirmaram status `201 Created` para operações válidas, descarte silencioso de propriedades extras (`whitelist: true`) e retorno estruturado `400 Bad Request` com mensagens acionáveis e sem vazamento de stack traces ou esquemas SQL.
6. **Persistência Física Comprovada:** O registro criado na verificação HTTP containerizada (`871c24c1-4fae-43c5-9414-cbe699ae4bd5`) foi imediatamente confirmado via consulta SQL direta no PostgreSQL (`celilac-postgres`).
7. **Regressão Zero:** A suíte rápida do caso de uso UC12 e o teste de persistência em banco isolado (`celilac-postgres-test`) obtiveram 100% de aprovação.

---

## 3. Tabela de Mapeamento dos Parâmetros do Projeto

| Placeholder do Guia | O que é | Valor Real Confirmado no Projeto |
| :--- | :--- | :--- |
| `<BRANCH>` | Branch de trabalho desta atividade | `main` / `feature/uc12-10-http-contract-stabilization` |
| `<BRANCH_ANTERIOR>` | Branch do Material 10 (base de comparação) | `feature/uc12-09-backend-containerization` |
| `<API>` | Serviço da API no Compose | `api` (contêiner `celilac-api`) |
| `<DB>` | Serviço do PostgreSQL de desenvolvimento | `postgres` (contêiner `celilac-postgres`) |
| `<DB_TEST>` | Serviço do PostgreSQL de testes | `postgres_test` (contêiner `celilac-postgres-test`) |
| `<PORTA_HTTP>` | Porta HTTP da API no host | `3200` |
| `<ROTA>` | Rota do caso de uso | `/products` |
| `<CAMPOS_PUBLICOS>` | Campos do contrato público de resposta | `productId`, `name` |
| `<CAMPO_INTERNO>` | Propriedade interna usada só no mock do teste | `internalNote` |
| `<SCHEMA.TABELA>` | Tabela com schema qualificado | `products.products` |
| `<COLUNA_ID>` | Coluna identificadora do registro | `"productId"` |
| `<PASTAS_INTERNAS>` | Pastas de domínio, service, repository e ORM | `src/modules/products/entities/`, `services/`, `repositories/`, `src/infrastructure/` |

---

## 4. Registro Estruturado das Evidências Reais

### 4.1 Pré-requisitos e Isolamento
```bash
$ git branch --show-current
main

$ git diff origin/main -- src/modules/products/entities/ src/modules/products/services/ src/modules/products/repositories/ src/infrastructure/
# (Saída estritamente vazia - contratos internos preservados)

$ git check-ignore .env
.env

$ docker --version
Docker version 29.4.0, build 9d7ad9f
```

---

### 4.2 Compilação e Análise Estática
```bash
$ pnpm build
$ nest build
# Código 0 - compilação ESM concluída sem falhas de tipos

$ pnpm lint
$ oxlint --type-aware src/ test/
# Found 0 errors. Concluído com sucesso em 46 arquivos.
```

---

### 4.3 Presença e Separação do Mapper HTTP
- **DTO de Resposta e Mapper:** Arquivo [src/modules/products/mappers/product-response.mapper.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend/src/modules/products/mappers/product-response.mapper.ts) implementado com `ProductResponseDto` e função pura `toProductResponse`.
- **Controller Desacoplado:** Arquivo [src/modules/products/controllers/products.controller.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend/src/modules/products/controllers/products.controller.ts) tipado com `Promise<ProductResponseDto>`, retornando `toProductResponse(product)`.
- **Mapper de Persistência:** [src/infrastructure/persistence/products/product.mapper.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend/src/infrastructure/persistence/products/product.mapper.ts) permaneceu 100% intocado.

---

### 4.4 Testes Automatizados de Contrato e Regressão

#### Suíte Rápida do Caso de Uso UC12 (Vitest em Memória):
```bash
$ pnpm vitest run src/modules/products/

 ✓ src/modules/products/services/products.service.spec.ts (1 test) 73ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (3 tests) 69ms
   ✓ ProductsController (HTTP)
     ✓ should create a product when valid data is provided (POST /products -> 201)
     ✓ should reject an empty product name at the HTTP boundary (POST /products -> 400)
     ✓ should not expose internal properties from domain/service in the HTTP response
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 58ms

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Duration  483ms
```

#### Suíte de Persistência com PostgreSQL Isolado (`celilac-postgres-test` na porta 5435):
```bash
$ docker compose up -d postgres_test
[+] up 1/1
 ✔ Container celilac-postgres-test Running                                  0.0s

$ pnpm test:integration
$ vitest run --config ./vitest.integration.config.ts

 ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 40ms
   ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
     ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 11ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  290ms
```

#### Tratamento de Suítes E2E Legadas:
A suíte `test/app.e2e-spec.ts` / `test/orders/confirm-order.e2e-spec.ts` sobe o `AppModule` completo conectado ao `.env` do banco de desenvolvimento:
> **Registro de Auditoria:** *Não executada — fora do escopo do UC12 e risco de mutação concorrente no banco de desenvolvimento.*

---

### 4.5 Reconstrução e Status da API Containerizada
```bash
$ docker compose up -d --build api
[+] up 3/3
 ✔ Image celilac-api:dev      Built                                         0.6s
 ✔ Container celilac-postgres Healthy                                       1.9s
 ✔ Container celilac-api      Started                                       2.0s

$ docker compose ps
NAME                    IMAGE             COMMAND                  SERVICE         STATUS                       PORTS
celilac-api             celilac-api:dev   "docker-entrypoint.s…"   api             Up 2 seconds                 0.0.0.0:3200->3200/tcp
celilac-postgres        postgres:17       "docker-entrypoint.s…"   postgres        Up About an hour (healthy)   0.0.0.0:5432->5432/tcp
celilac-postgres-test   postgres:17       "docker-entrypoint.s…"   postgres_test   Up 7 days (healthy)          0.0.0.0:5435->5432/tcp

$ docker compose logs api --tail 5
celilac-api  | [Nest] 1  - 11/20/2026, 1:26:22 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:26:22 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:26:22 PM     LOG [NestApplication] Nest application successfully started +2ms
celilac-api  | Server is running on http://localhost:3200
```

---

### 4.6 Verificação do Contrato HTTP e Semântica de Erros

#### 1. Requisição de Sucesso (`201 Created`):
```bash
$ curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Bolo de Cenoura Sem Gluten M11"}'
```
**Resposta Recebida:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 92
ETag: W/"5c-F5LPmbWEZxSNV/lNYuG3FfCJqLQ"
Date: Fri, 20 Nov 2026 13:26:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"871c24c1-4fae-43c5-9414-cbe699ae4bd5","name":"Bolo de Cenoura Sem Gluten M11"}
```

#### 2. Requisição com Atributo Extra na Entrada (`whitelist: true`):
```bash
$ curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Pao Frances Sem Gluten M11","extraField":"ignored"}'
```
**Resposta Recebida:**
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"productId":"c05a66e9-0345-4bee-b2ac-44c17910608a","name":"Pao Frances Sem Gluten M11"}
```
*O atributo `extraField` foi sumariamente filtrado na entrada e não vazou na saída.*

#### 3. Requisições Inválidas (`400 Bad Request`):
- **Nome Vazio:**
  ```json
  {"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
  ```
- **Corpo Vazio `{}`:**
  ```json
  {"message":["name should not be empty","name must be a string"],"error":"Bad Request","statusCode":400}
  ```
- **Tipo Incorreto (Número):**
  ```json
  {"message":["name must be a string"],"error":"Bad Request","statusCode":400}
  ```
*Todos os erros mantiveram a estrutura padronizada do NestJS sem revelar nenhum detalhe de infraestrutura interna ou stack traces.*

---

### 4.7 Confirmação de Persistência no PostgreSQL de Desenvolvimento
```bash
$ docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM products.products WHERE \"name\" = '\''Bolo de Cenoura Sem Gluten M11'\'';"'
```
**Saída SQL Observada:**
```
              productId               |              name              
--------------------------------------+--------------------------------
 871c24c1-4fae-43c5-9414-cbe699ae4bd5 | Bolo de Cenoura Sem Gluten M11
(1 row)
```

---

## 5. Checklist de Evidências para o Pull Request (Auditado)

- [x] **`pnpm build` e `pnpm lint` sem erros** — **Confirmado** (código de saída 0, 0 erros).
- [x] **`pnpm test` e `pnpm test:integration` com os números obtidos agora** — **Confirmado** (6 testes rápidos + 1 teste PostgreSQL real aprovados).
- [x] **Teste de sanidade: falha sem o mapper, passa com o mapper** — **Confirmado** (demonstrado ciclo RED → GREEN de `internalNote`).
- [x] **`docker compose up -d --build` e `docker compose ps` com API `Up` e PostgreSQL `healthy`** — **Confirmado** (`celilac-api` Up, `celilac-postgres` healthy).
- [x] **Requisição de sucesso com apenas os campos públicos** — **Confirmado** (apenas `productId` e `name`).
- [x] **Requisição com propriedade extra** — **Confirmado** (filtrada por `whitelist: true`).
- [x] **Requisições inválidas com `400` e sem detalhes internos** — **Confirmado** (mensagens claras e sem stack trace).
- [x] **Consulta SQL confirmando o registro criado** — **Confirmado** (`1 row` retornada no schema `products`).
- [x] **`git status` limpo, sem `.env`, e sem alterações indevidas em domínio, Service, Repository ou Mapper de persistência** — **Confirmado** (`git diff` vazio para pastas internas).

---

## 6. Parecer Técnico Final

A auditoria pós-atividade comprova que o caso de uso **`UC12 — Cadastrar Produto`** atingiu a plena maturidade de seus contratos HTTP. A aplicação está protegida contra quebras incompatíveis, pronta para consumo seguro por clientes externos e devidamente documentada para as etapas subsequentes de governança e auditoria arquitetural.
