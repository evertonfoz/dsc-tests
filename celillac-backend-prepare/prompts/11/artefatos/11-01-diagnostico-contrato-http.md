# ARTEFATO 11-01 — DIAGNÓSTICO E INSPEÇÃO DO CONTRATO HTTP EXISTENTE

## 1. Projeto e Caso de Uso

| Elemento | Valor Verificado no Repositório e nos Artefatos do Material 10 |
| :--- | :--- |
| **Projeto** | **CeliLac** — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare` / `celillac-backend`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Epic** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Artefatos do Material 10 Recuperados** | `prompts/10/artefatos/10-01` a `10-08` |
| **Branch-base da Análise** | `feature/uc12-09-backend-containerization` (Draft PR #17) |
| **Branch de Trabalho (Material 11)** | `feature/uc12-10-http-contract-stabilization` |

---

## 2. Arquitetura e Código Existente Inspecionados

A inspeção direta do código-fonte em `src/` confirmou a arquitetura em camadas:

1. **Entidade de Domínio (`src/modules/products/entities/product.entity.ts`):**
   - `Product(public readonly productId: string, public readonly name: string)`
2. **Contrato de Repositório (`src/modules/products/repositories/products.repository.interface.ts`):**
   - `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`
   - `ProductsRepository.save(product: Product): Promise<Product>`
3. **Serviço de Aplicação (`src/modules/products/services/products.service.ts`):**
   - `createProduct(name: string): Promise<Product>` (gera `randomUUID()` e invoca `productsRepository.save(product)`).
4. **DTO de Entrada (`src/modules/products/dtos/create-product.dto.ts`):**
   - `CreateProductDto` com `@IsString()`, `@IsNotEmpty()`, `name!: string`.
5. **Controller Anterior (`src/modules/products/controllers/products.controller.ts`):**
   - Rota `@Controller('products')` com `@Post() create(@Body() dto: CreateProductDto): Promise<Product>`.
   - Retornava diretamente a entidade de domínio `Product`, sem DTO de resposta explícito nem mapper HTTP.
6. **Persistência (`src/infrastructure/persistence/products/`):**
   - `ProductOrmEntity` (`schema: 'products'`, `name: 'products'`, colunas `productId` uuid PK e `name` varchar(120)).
   - `ProductMapper` (`toPersistence` e `toDomain`).
7. **Validação Global (`src/main.ts`):**
   - `new ValidationPipe({ whitelist: true, transform: true })`.
   - Porta HTTP: `process.env.PORT || 3200`.
8. **Infraestrutura Docker (`compose.yaml`):**
   - `postgres` (`celilac-postgres`, porta `5432`, banco `celilac_db`), `postgres_test` (`celilac-postgres-test`, porta `5435`, banco `celilac_test`), `api` (`celilac-api:dev`, porta `3200:3200`).

---

## 3. Contrato HTTP Observado Antes da Refatoração

Antes de qualquer alteração no código, a API containerizada (Material 10) foi consultada:

```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto de exemplo"}'
```

| Aspecto | Observado |
| :--- | :--- |
| **Método e Rota** | `POST /products` |
| **Content-Type (Requisição)** | `application/json` |
| **Payload** | `{"name":"Produto de exemplo"}` |
| **Status HTTP** | `HTTP/1.1 201 Created` |
| **Content-Type (Resposta)** | `application/json; charset=utf-8` |
| **Body JSON** | `{"productId":"48a5b986-996f-48f8-a55f-dcbb86317d0c","name":"Produto de exemplo"}` |
| **Propriedades e Tipos** | `productId` (`string` UUID v4) e `name` (`string`) |

### Investigação do Contrato Existente
1. **Campos previstos:** Sim (`productId` e `name`).
2. **Campos adicionais:** Nenhum observado atualmente, pois `Product` possui apenas `productId` e `name`.
3. **Status HTTP:** `201 Created` corresponde ao comportamento esperado para criação de recurso.
4. **Dependência da entidade interna:** **Sim.** O Controller retornava `Promise<Product>` diretamente. Caso a entidade `Product` receba propriedades internas no futuro, o contrato HTTP as exporia automaticamente.
5. **Estrutura pública documentada:** Parcialmente (apenas via exemplo histórico e testes anteriores, sem `ProductResponseDto` dedicado).
6. **Necessidade de modificar a serialização:** **Sim**, para desacoplar o contrato público (`ProductResponseDto`) da entidade de domínio (`Product`) por meio de `toProductResponse()`.

---

## 4. Linha de Base dos Testes (Antes das Alterações)

- **Framework:** Vitest `4.1.2` + Supertest `7.0.0` + `@nestjs/testing` `12.1.2`.
- **`pnpm test` (suíte rápida):** `5 passed (5)` arquivos, `12 passed (12)` testes (`products.controller.spec.ts` com 2 testes: `201` e `400`).
- **`pnpm test:integration` (PostgreSQL real em `celilac_test:5435`):** `1 passed (1)` arquivo, `1 passed (1)` teste.
- **Total da linha de base:** `13 passed (13)`.

---

## 5. GitHub, Planejamento, Divergências e Plano de Execução

- **Issues e Board (Project #6):**
  - `EPIC-UC12` (#1) `[Backlog]`
  - `SUB-06` (#9 — HTTP `POST /products`) `[In Review]` (Draft PR #14)
  - `SUB-07` (#10 — Testes automatizados) `[In Progress]`
  - `SUB-09` (#16 — Containerização) `[In Progress]` (Draft PR #17)
  - `SUB-05` (#8 — Serviço) `[In Progress]` (Draft PR #13)
  - **WIP atual em `In Progress`:** 3 itens (`#8`, `#10`, `#16`), no limite da política de WIP (3).
- **Divergência identificada no planejamento:** Os identificadores `UC12-09` / `UC12-10` do material didático não possuem Sub-Issues exclusivas de estabilização de contrato HTTP no GitHub. A Issue `#16` (`SUB-09`) refere-se exclusivamente à containerização (Material 10) e não deve ser reutilizada. O trabalho de estabilização e testes de contrato alinha-se à `SUB-07` (#10, testes) e `SUB-06` (#9, fronteira HTTP), propondo-se refinamento caso se deseje uma `SUB-10` dedicada (sem criação unilateral).
- **Decisão e Plano de Execução:**
  1. Definir `ProductResponseDto` e implementar `toProductResponse()` em `src/modules/products/mappers/product-response.mapper.ts`.
  2. Refatorar `ProductsController` preservando `this.productsService.createProduct(dto.name)`.
  3. Verificar semântica HTTP (`201`, `400`, `whitelist: true`).
  4. Ampliar `products.controller.spec.ts` com o cenário de não exposição (`internalNote`).
  5. Analisar compatibilidade com consumidores (7 cenários hipotéticos).
  6. Reconstruir contêiner `api` e validar `POST /products` + persistência PostgreSQL.
  7. Executar regressão e registrar evidências no GitHub.

