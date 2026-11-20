# ARTEFATO 10-01 — DIAGNÓSTICO DA CONTAINERIZAÇÃO, PRONTIDÃO DA SUB-09 E LINHA DE BASE

## 1. Identificação do Projeto, Caso de Uso e Atividade

| Elemento | Valor Verificado no Repositório e Artefatos |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue da Atividade Atual** | [`SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` (Issue #16)](https://github.com/evertonfoz/dsc-tests/issues/16) |
| **Branch de Trabalho** | `feature/uc12-09-backend-containerization` |
| **Convenção de Commit de Referência** | `build(docker): containerize NestJS backend and integrate with Compose (refs #16, refs #1)` |
| **Artefatos Anteriores Recuperados** | `docs/planejamento/uc12-cadastrar-produto/09/09-01-diagnostico-persistencia.md` a `09-08-versionamento-checklist.md` (lidos e verificados integralmente) |
| **Diretório de Destino desta Atividade** | `docs/planejamento/uc12-cadastrar-produto/10/` (conforme convenção estabelecida no projeto) |

---

## 2. Contratos Existentes e Preservados

A inspeção direta do código-fonte em `src/modules/products/` e `src/infrastructure/persistence/products/` comprovou a integridade dos contratos implementados nos Materiais 04 a 09, os quais permanecem intocados:

1. **Entidade de Domínio (`Product`):**
   - Arquivo: `src/modules/products/entities/product.entity.ts`
   - Invariante: classe pura de domínio com `productId: string` e `name: string`, sem decoradores de ORM.
2. **Interface do Repositório (`ProductsRepository`):**
   - Arquivo: `src/modules/products/repositories/products.repository.interface.ts`
   - Invariante: token `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`, método `save(product: Product): Promise<Product>`.
3. **Serviço de Aplicação (`ProductsService`):**
   - Arquivo: `src/modules/products/services/products.service.ts`
   - Invariante: método `createProduct(name: string): Promise<Product>` gerando `productId` via `randomUUID()`.
4. **Fronteira HTTP (`ProductsController` e `CreateProductDto`):**
   - Arquivos: `src/modules/products/controllers/products.controller.ts`, `src/modules/products/dtos/create-product.dto.ts`
   - Invariante: `POST /products` recebendo `CreateProductDto` validado por `ValidationPipe` (`whitelist: true`).
5. **Persistência Real TypeORM + PostgreSQL:**
   - Entidade ORM: `src/infrastructure/persistence/products/product.orm-entity.ts` (`@Entity({ name: 'products', schema: 'products' })`).
   - Mapper: `src/infrastructure/persistence/products/product.mapper.ts` (`toPersistence` e `toDomain`).
   - Adaptador: `src/infrastructure/persistence/products/typeorm-products.repository.ts`.
   - Migration: `src/database/migrations/1794255600000-CreateProductsTable.ts` (`CREATE SCHEMA IF NOT EXISTS products` e `CREATE TABLE "products"."products"`).

---

## 3. Inspeção da Infraestrutura Existente (Docker, Compose, PostgreSQL)

A inspeção realizada diretamente no host e daemon Docker revelou o estado dos recursos:

| Recurso | Configuração Encontrada | Diagnóstico Técnico |
| :--- | :--- | :--- |
| **Serviço PostgreSQL (Dev)** | Contêiner `celilac-postgres` (`postgres:17`), porta `5432:5432`, banco `celilac_db`, usuário `celilac_user`, volume `celilac-backend_celilac_postgres_data`. Status: `healthy`. | Preservado intacto sem alterações. Não reiniciado nem removido. |
| **Serviço PostgreSQL (Testes)** | Contêiner `celilac-postgres-test` (`postgres:17`), porta `5435:5432`, banco `celilac_test`, usuário `celilac_test`, volume `celilac-backend_celilac_postgres_test_data`. Status: `healthy`. | Preservado intacto para execução das suítes de teste de integração sem risco ao banco dev. |
| **Compose (`compose.yaml`)** | Continha originalmente apenas os serviços `postgres` e `postgres_test`. O serviço `api` necessitava de incorporação segura. | Adicionado serviço `api` apontando para o Dockerfile multi-stage, porta 3200, variáveis de conexão interna e dependência de saúde (`depends_on: postgres: condition: service_healthy`). |
| **Dockerfile e `.dockerignore`** | Inexistentes na raiz de `celilac-backend`. | Criados de forma determinística com Node.js `24.21.0-bookworm-slim`, pnpm `12.8.1`, compilação TypeScript e imagem runtime mínima. |
| **DataSource Compilado** | `src/database/data-source.ts` possui seleção dinâmica: `isTsRuntime ? 'src/database/migrations/*.ts' : 'dist/database/migrations/*.js'`. | Totalmente compatível com execução em contêiner (`node dist/main.js` e scripts de migration compilados). |
| **Nome do Projeto Compose** | Volume e contêineres usam o prefixo `celilac-backend`. | Definido `COMPOSE_PROJECT_NAME=celilac-backend` no `.env` e registrado no `.env.example`. |

---

## 4. Linha de Base dos Testes Existentes (Execução Real Nesta Atividade)

Antes de qualquer alteração estrutural no ambiente, foram executadas as suítes de testes automatizados presentes no projeto:

### 4.1 Suíte de Integração PostgreSQL (`pnpm test:integration`)
Executada contra o contêiner isolado `celilac-postgres-test` (porta host `5435`):

```bash
$ vitest run --config ./vitest.integration.config.ts

 ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 67ms
   ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
     ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 18ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  529ms
```

### 4.2 Suíte de Testes do Caso de Uso UC12 (Unidade e Integração em Memória)
Executada para comprovar os contratos de `Product`, `ProductsService`, `ProductsController` e `ProductsModule`:

```bash
$ vitest run src/modules/products/ src/app.controller.spec.ts

 ✓ src/app.controller.spec.ts (1 test) 84ms
 ✓ src/modules/products/services/products.service.spec.ts (1 test) 82ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 62ms
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 56ms

 Test Files  4 passed (4)
      Tests  6 passed (6)
   Duration  483ms
```

*Diagnóstico das suítes:* Todos os testes pertinentes ao caso de uso `UC12` (`6` em memória/unidade + `1` PostgreSQL real) estão **100% aprovados**. A suíte legada `orders.services.spec.ts` (módulo anterior) apresenta falhas pré-existentes relativas a chamadas de pagamento comentadas na implementação original, sem relação com o caso de uso `UC12`.

---

## 5. Plano de Validação da Containerização

1. Implementar e auditar `Dockerfile` multi-stage com `node:24.21.0-bookworm-slim` e `pnpm@12.8.1`.
2. Configurar `.dockerignore` protegendo credenciais e isolando o contexto.
3. Construir e registrar a imagem `celilac-api:dev`.
4. Evoluir `compose.yaml` com o serviço `api`, preservando os bancos de dados.
5. Inspecionar histórico de migrations no contêiner com `migration:show:prod`.
6. Inicializar contêineres e comprovar logs de inicialização e rotas registradas.
7. Realizar requisição real `POST /products`, verificar persistência SQL, reiniciar o contêiner `api` e comprovar durabilidade dos dados.
8. Reexecutar os testes automatizados para garantir ausência de regressões.
