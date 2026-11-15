# ARTEFATO 12-01 — DIAGNÓSTICO DO ESTADO ATUAL DA ARQUITETURA

## 1. Projeto

| Atributo | Valor Confirmado |
| :--- | :--- |
| **Nome do Projeto** | **CeliLac** — Plataforma para Celíacos e Intolerantes a Lactose |
| **Diretório de Trabalho** | `celillac-backend-prepare` (pacote `celillac-backend` em `package.json`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Stack Principal** | TypeScript `6.0.2`, NestJS `12.1.2`, TypeORM `1.1.2`, PostgreSQL `17`, Vitest `4.1.2`, Supertest `7.0.0`, Docker Compose |

---

## 2. Caso de Uso

| Atributo | Valor Confirmado |
| :--- | :--- |
| **Código e Título** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Epic no GitHub** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Operação Auditada** | Recebimento de requisição HTTP `POST /products`, validação de entrada, criação da entidade de domínio `Product`, persistência relacional via `ProductsRepository` / TypeORM no PostgreSQL e serialização controlada via `ProductResponseDto` |

---

## 3. Documentação Recuperada (Material 11)

Os oito artefatos produzidos no Material 11 foram integralmente lidos e analisados a partir de `prompts/11/artefatos/`:

1. `11-01-diagnostico-contrato-http.md` — Diagnóstico do contrato anterior (`ProductsController` retornava `Promise<Product>` diretamente) e linha de base inicial.
2. `11-02-definicao-contrato-publico.md` — Especificação de `ProductResponseDto` (`{ productId: string, name: string }`) e separação entre os quatro modelos (`CreateProductDto`, `Product`, `ProductOrmEntity`, `ProductResponseDto`).
3. `11-03-dto-resposta-serializacao.md` — Implementação de `toProductResponse(product: Product): ProductResponseDto` em `src/modules/products/mappers/product-response.mapper.ts` e atualização de `ProductsController`.
4. `11-04-semantica-http-erros.md` — Verificação de `201 Created`, `400 Bad Request` e preservação de `ValidationPipe({ whitelist: true, transform: true })`.
5. `11-05-testes-automatizados-contrato.md` — Ampliação de `products.controller.spec.ts` com o 3.º teste (filtragem da propriedade simulada `internalNote` e asserção de contrato fechado com `toEqual()`).
6. `11-06-compatibilidade-consumidores.md` — Análise de 7 cenários hipotéticos de quebra de contrato (*breaking changes*).
7. `11-07-verificacao-api-containerizada.md` — Reconstrução da imagem `celilac-api:dev` e validação fim a fim com `curl` (`POST /products`) e `psql` (`celilac_db`).
8. `11-08-versionamento-checklist.md` — Registro do commit `e4e3e12`, abertura do Draft PR #19 e checklist de governança no GitHub.

---

## 4. Componentes Inspecionados no Código Real

Todos os arquivos do fluxo UC12 e da configuração global foram localizados e inspecionados diretamente no repositório:

| Camada / Papel | Componente | Caminho Verificado no Repositório | Status |
| :--- | :--- | :--- | :--- |
| **Apresentação (HTTP)** | `ProductsController` | `src/modules/products/controllers/products.controller.ts` | Existente e íntegro |
| **Apresentação (Entrada)** | `CreateProductDto` | `src/modules/products/dtos/create-product.dto.ts` | Existente e íntegro |
| **Apresentação (Saída)** | `ProductResponseDto` / `toProductResponse` | `src/modules/products/mappers/product-response.mapper.ts` | Existente e íntegro |
| **Aplicação (Caso de Uso)** | `ProductsService` | `src/modules/products/services/products.service.ts` | Existente e íntegro |
| **Domínio (Entidade)** | `Product` | `src/modules/products/entities/product.entity.ts` | Existente e íntegro |
| **Domínio/Aplicação (Porta)** | `ProductsRepository` / `PRODUCTS_REPOSITORY` | `src/modules/products/repositories/products.repository.interface.ts` | Existente e íntegro |
| **Persistência em Memória (Teste)** | `InMemoryProductsRepository` | `src/modules/products/repositories/in-memory-products.repository.ts` | Existente e íntegro |
| **Infraestrutura (Adaptador ORM)** | `TypeOrmProductsRepository` | `src/infrastructure/persistence/products/typeorm-products.repository.ts` | Existente e íntegro |
| **Infraestrutura (Mapper ORM)** | `ProductMapper` | `src/infrastructure/persistence/products/product.mapper.ts` | Existente e íntegro |
| **Infraestrutura (Entidade ORM)** | `ProductOrmEntity` | `src/infrastructure/persistence/products/product.orm-entity.ts` | Existente e íntegro |
| **Infraestrutura (Migration)** | `CreateProductsTable1794255600000` | `src/database/migrations/1794255600000-CreateProductsTable.ts` | Existente e íntegro |
| **Composição do Módulo** | `ProductsModule` | `src/modules/products/products.module.ts` | Existente e íntegro |
| **Composição Raiz / Bootstrap** | `AppModule` / `bootstrap` | `src/app.module.ts` / `src/main.ts` | Existentes e íntegros |

---

## 5. Contratos Verificados

1. **Entidade de Domínio (`Product`):**
   ```typescript
   export class Product {
     constructor(
       public readonly productId: string,
       public readonly name: string,
     ) {}
   }
   ```
2. **Serviço de Aplicação (`ProductsService`):**
   ```typescript
   createProduct(name: string): Promise<Product>
   ```
3. **Contrato de Persistência (`ProductsRepository`):**
   ```typescript
   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```
4. **DTO de Entrada (`CreateProductDto`):**
   - Classe com `@IsString()`, `@IsNotEmpty()`, `name!: string`.
5. **Contrato Público de Saída (`ProductResponseDto` e `toProductResponse`):**
   ```typescript
   export interface ProductResponseDto {
     productId: string;
     name: string;
   }

   export function toProductResponse(product: Product): ProductResponseDto
   ```
6. **Contrato HTTP (`POST /products`):**
   - Sucesso: `201 Created` com corpo `{"productId": "UUID_GERADO", "name": "Produto de exemplo"}`.
   - Erro de validação: `400 Bad Request` via `ValidationPipe({ whitelist: true, transform: true })`.

---

## 6. Infraestrutura

Inspeção de `compose.yaml`, `Dockerfile`, `.env`, `src/database/data-source.ts` e `src/database/test-data-source.ts`:

- **Serviço `api` (`celilac-api`):** Imagem `celilac-api:dev`, porta publicada `3200:3200`, dependente de `postgres` (`service_healthy`), status atual `Up`.
- **Serviço `postgres` (`celilac-postgres`):** PostgreSQL 17, porta `5432:5432`, banco de desenvolvimento `celilac_db`, usuário `celilac_user`, volume `celilac_postgres_data`, status atual `Up (healthy)`.
- **Serviço `postgres_test` (`celilac-postgres-test`):** PostgreSQL 17, porta publicada `5435:5432`, banco exclusivo de testes `celilac_test`, usuário `celilac_test`, volume `celilac_postgres_test_data`, status atual `Up (healthy)`.
- **Esquema e Tabela:** Schema `products`, tabela `products.products` (`productId` UUID PK, `name` VARCHAR(120) NOT NULL).

---

## 7. Testes Anteriores (Histórico do Material 11)

Conforme documentado no Material 11 (`11-05` e `11-08`), os resultados históricos eram:

| Verificação | Resultado Histórico (Material 11) |
| :--- | :--- |
| `pnpm test` | 13 testes aprovados em 5 arquivos |
| `pnpm test:integration` | 1 teste PostgreSQL aprovado em 1 arquivo |
| `pnpm test:e2e` | 2 testes E2E aprovados em 2 arquivos |
| `pnpm build` | Sem erros (`0 errors`) |
| `pnpm lint` | Sem erros (`0 errors`), com 3 avisos preexistentes |

---

## 8. Verificações Atuais (Linha de Base Reexecutada no Material 12)

Os scripts reais definidos em `package.json` foram reexecutados neste diagnóstico para estabelecer a linha de base real antes de qualquer decisão:

| Script / Comando Executado | Resultado Observado Agora (Material 12) | Detalhamento |
| :--- | :--- | :--- |
| `pnpm test` (`vitest run`) | **5 passed (5) arquivos, 13 passed (13) testes** | `products.controller.spec.ts` (3), `products.integration.spec.ts` (2), `products.service.spec.ts` (1), `app.controller.spec.ts` (1), `orders.service.spec.ts` (6) |
| `pnpm test:integration` (`vitest.integration.config.ts`) | **1 passed (1) arquivo, 1 passed (1) teste** | `typeorm-products.repository.postgres.spec.ts` (1) no banco isolado `celilac_test` (porta `5435`) |
| `pnpm test:e2e` (`vitest.config.e2e.ts`) | **2 passed (2) arquivos, 2 passed (2) testes** | `app.e2e-spec.ts` (1) e `confirm-order.e2e-spec.ts` (1) — executado após inspeção prévia de segurança |
| `pnpm build` (`nest build`) | **Código de saída `0` (sem erros)** | Compilação limpa com TypeScript `6.0.2` |
| `pnpm lint` (`oxlint --type-aware src/ test/`) | **0 errors, 3 warnings** (em 54 arquivos) | 1 aviso `unbound-method` em `products.service.spec.ts` e 2 avisos em `orders.service.spec.ts` |
| `docker compose ps` | **3 contêineres ativos** | `celilac-api` (`Up`), `celilac-postgres` (`Up healthy`), `celilac-postgres-test` (`Up healthy`) |

---

## 9. GitHub e Governança do Planejamento

- **Branch atual:** `feature/uc12-10-http-contract-stabilization` (no commit `e4e3e12`, sincronizada com `origin/feature/uc12-10-http-contract-stabilization`).
- **Epic e Issues verificadas (`gh issue list`):**
  - `EPIC-UC12` — Issue `#1` (`[UC12] Cadastrar Produto`) — aberta (`Backlog`).
  - `SUB-01` (`#4`), `SUB-02` (`#5`), `SUB-03` (`#6`), `SUB-04` (`#7`), `SUB-05` (`#8`), `SUB-06` (`#9`), `SUB-07` (`#10`), `SUB-08` (`#11` — Documentação), `SUB-09` (`#16` — Containerização).
- **Verificação sobre `UC12-11`:** O identificador histórico `UC12-11 — Refatorar fluxo completo do cadastro de produto` mencionado no PDF **não possui Issue correspondente criada no repositório GitHub** (`evertonfoz/dsc-tests` possui apenas as Issues `#1` a `#11` e `#16`).
  - Conforme as restrições do projeto, **não** reutilizamos a Issue `#16` (exclusiva de containerização) e **não** criamos Issue duplicada unilateralmente. A auditoria arquitetural e a documentação técnica associam-se diretamente ao escopo de qualidade/testes (`SUB-07` `#10`), documentação técnica (`SUB-08` `#11`) e `EPIC-UC12` (`#1`), mantendo o Draft PR `#19` aberto na branch atual.
- **Pull Requests abertos (`gh pr list`):** Draft PRs `#12`, `#13`, `#14`, `#15`, `#17`, `#18` e `#19` (nenhum integrado prematuramente à `main`).
- **Política de WIP e Definition of Ready (DoR):** Respeitadas integralmente (limite de 3 itens simultâneos em `In Progress` no GitHub Project #6; responsável e revisor preservados).

---

## 10. Riscos Identificados

1. **Risco de refatoração desnecessária (cosmética):** Alterar assinaturas consolidadas (`createProduct(name)`, `save(product)`, `toProductResponse(product)`) apenas para gerar diff quebraria a rastreabilidade dos Materiais 04 a 11 e os testes existentes.
2. **Risco de acoplamento acidental entre mappers:** Confundir `toProductResponse` (fronteira HTTP) com `ProductMapper` (persistência TypeORM) violaria a separação entre apresentação e infraestrutura.
3. **Risco de execução em banco não isolado:** O script `pnpm test:e2e` inicializa `AppModule` conectado a `celilac_db` (`5432`), exigindo inspeção prévia do código dos testes antes de qualquer execução.

---

## 11. Pendências

1. Revisão técnica humana dos Draft PRs acumulados (`#12` a `#19`).
2. Consolidação da documentação técnica prevista na `SUB-08` (Issue `#11`) e decisão da equipe sobre eventual criação formal de Sub-Issue para `UC12-10` / `UC12-11` ou manutenção do vínculo com `#10` e `#11`.

---

## 12. Plano de Auditoria

1. **Fase 3 (`12-02`):** Reconstruir e separar formalmente o fluxo de execução em tempo de execução e o grafo de dependências estáticas de código, além de mapear os providers do `ProductsModule` e os dois mappers.
2. **Fase 4 (`12-03`):** Auditar os 10 componentes frente aos 8 critérios arquiteturais, confrontando cada hipótese do material didático com o código real.
3. **Fase 5 (`12-04`):** Avaliar e priorizar achados/observações na matriz de decisão sem atribuir pontuações artificiais.
4. **Fase 6 (`12-05`):** Documentar a decisão fundamentada de preservação arquitetural (ou refatoração controlada, se e somente se houver problema comprovado).
5. **Fase 7 (`12-06`):** Executar e documentar a verificação completa de regressões com análise explícita de segurança dos bancos `celilac_test` e `celilac_db`.
6. **Fase 8 (`12-07`):** Registrar as decisões arquiteturais (ADRs proporcionais ao escopo).
7. **Fase 9 (`12-08`):** Elaborar o parecer técnico para revisão humana, verificar rastreabilidade no GitHub e preencher o checklist final de 49 itens.
