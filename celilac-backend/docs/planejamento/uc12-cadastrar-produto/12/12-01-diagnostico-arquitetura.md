# ARTEFATO 12-01 — DIAGNÓSTICO DO ESTADO ATUAL DA ARQUITETURA

## 1. Identificação do Projeto e Contexto
* **Projeto:** CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`)
* **Repositório:** [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests)
* **Caso de Uso:** `UC12 — Cadastrar Produto` (`prompts/uc-12.md`)
* **Epic Principal:** [Issue #1 — `EPIC-UC12 — [UC12] Cadastrar Produto`](https://github.com/evertonfoz/dsc-tests/issues/1)
* **Branch Atual de Trabalho:** `main` (integrada após conclusão e merge do [PR #19](https://github.com/evertonfoz/dsc-tests/pull/19) da branch `feature/uc12-10-http-contract-stabilization`)
* **Data da Auditoria:** 20 de Novembro de 2026

---

## 2. Recuperação da Documentação Anterior (Materiais 01 a 11)
A equipe concluiu progressivamente as onze etapas anteriores do ciclo de vida da funcionalidade `UC12`, cujos artefatos estão preservados no diretório `docs/planejamento/uc12-cadastrar-produto/`:
* **Materiais 01–03:** Planejamento inicial, backlog, decomposição em Sub-Issues (#4 a #11), definição de DoR/DoD, estimativas e limites de WIP (`docs/planejamento/uc12-cadastrar-produto/01/` a `03/`).
* **Materiais 04–05:** Primeiro teste unitário da entidade/serviço (**RED**) e implementação mínima necessária (**GREEN**) para atender ao critério CA01 (`04/` e `05/`).
* **Material 06:** Refatoração localizada de código, eliminação de warnings e revisão técnica colaborativa (`06/`).
* **Material 07:** Introdução da fronteira HTTP com NestJS (`ProductsController` e `CreateProductDto`) expondo `POST /products` (`07/`).
* **Material 08:** Integração desacoplada entre Controller, Service e repositório em memória (`InMemoryProductsRepository`), viabilizando testes de integração rápidos (`08/`).
* **Material 09:** Persistência real em banco relacional PostgreSQL 17 utilizando TypeORM, migrations versionadas (`1794255600000-CreateProductsTable.ts`), adaptador `TypeOrmProductsRepository` e testes integrados em banco isolado (`09/`).
* **Material 10:** Containerização do backend com Docker e Docker Compose (`api`, `postgres`, `postgres_test`), padronização de imagens multi-stage e comprovação de inicialização (`10/`).
* **Material 11:** Estabilização formal do contrato HTTP público com DTO de resposta fechado (`ProductResponseDto`), mapper puro de saída (`toProductResponse`) e testes de rejeição a vazamento de dados internos (`11/`).

---

## 3. Inventário dos Componentes do Caso de Uso (UC12)
Os arquivos e componentes do caso de uso inspecionados no repositório são:

| Camada / Papel | Arquivo | Responsabilidade Principal |
|---|---|---|
| **Domínio** | `src/modules/products/entities/product.entity.ts` | Entidade pura `Product(productId, name)` sem decorators de ORM ou framework |
| **Contrato de Repositório** | `src/modules/products/repositories/products.repository.interface.ts` | Interface `ProductsRepository` e token de injeção `PRODUCTS_REPOSITORY` |
| **Repositório em Memória** | `src/modules/products/repositories/in-memory-products.repository.ts` | Dublê em memória para testes integrados rápidos |
| **Serviço de Aplicação** | `src/modules/products/services/products.service.ts` | Coordenação do caso de uso: geração de ID (`randomUUID`) e salvamento via repositório |
| **Fronteira HTTP (Controller)** | `src/modules/products/controllers/products.controller.ts` | Recebe requisições `POST /products`, delega ao serviço e transforma resposta via mapper |
| **DTO de Entrada** | `src/modules/products/dtos/create-product.dto.ts` | Validação de payload de entrada via `class-validator` (`@IsString()`, `@IsNotEmpty()`) |
| **Mapper HTTP** | `src/modules/products/mappers/product-response.mapper.ts` | Função pura `toProductResponse` e interface `ProductResponseDto` |
| **Módulo da Funcionalidade** | `src/modules/products/products.module.ts` | Composição de providers e injeção do repositório concreto TypeORM |
| **Entidade ORM** | `src/infrastructure/persistence/products/product.orm-entity.ts` | Mapeamento relacional na tabela `products.products` |
| **Mapper de Persistência** | `src/infrastructure/persistence/products/product.mapper.ts` | Mapeamento bidirecional `Product ↔ ProductOrmEntity` |
| **Adaptador TypeORM** | `src/infrastructure/persistence/products/typeorm-products.repository.ts` | Implementação concreta de `ProductsRepository` usando TypeORM |
| **Migration** | `src/database/migrations/1794255600000-CreateProductsTable.ts` | DDL versionada do schema e tabela de produtos |

---

## 4. Contratos Estabilizados
1. **Contrato de Aplicação (Service):**
   ```typescript
   ProductsService.createProduct(name: string): Promise<Product>
   ```
2. **Contrato de Persistência (Repository Interface):**
   ```typescript
   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';
   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```
3. **Contrato Público HTTP:**
   - **Endpoint:** `POST /products`
   - **Payload de Entrada:** `{ "name": "string (não vazio)" }`
   - **Código de Sucesso:** `201 Created`
   - **Corpo da Resposta:** `{ "productId": "<uuid>", "name": "<string>" }`
   - **Código de Erro:** `400 Bad Request` quando o nome é ausente, vazio ou de tipo incorreto.

---

## 5. Infraestrutura Operacional e Salvaguardas
* **API Containerizada:** Serviço `api` em execução na porta `3200` (`celilac-api:dev`).
* **Banco de Desenvolvimento:** Contêiner `celilac-postgres` (PostgreSQL 17, porta `5432`, banco `celilac_db`, usuário `celilac_user`).
* **Banco de Testes Isolado:** Contêiner `celilac-postgres-test` (PostgreSQL 17, porta `5435`, banco `celilac_test`, usuário `celilac_test`).
* **Salvaguardas de Testes:** Flag `TEST_DB_ALLOW_DESTRUCTIVE=true` exigida exclusivamente na porta 5435, protegendo o banco de desenvolvimento contra operações de `TRUNCATE`.

---

## 6. Linha de Base das Verificações Atuais (Executadas Agora)
Todas as verificações foram executadas na íntegra no ambiente local no início desta auditoria:

1. **Testes Rápidos do Caso de Uso (`pnpm vitest run src/modules/products/`):**
   - 3 arquivos de teste executados (`products.service.spec.ts`, `products.controller.spec.ts`, `products.integration.spec.ts`).
   - **Resultado:** 6 testes aprovados de 6 (100% de sucesso em 554ms).
2. **Testes de Persistência Real PostgreSQL (`pnpm test:integration`):**
   - 1 arquivo de teste (`typeorm-products.repository.postgres.spec.ts`) executado contra o banco isolado `celilac-postgres-test` (porta 5435).
   - **Resultado:** 1 teste aprovado de 1 (100% de sucesso em 453ms).
3. **Compilação TypeScript (`pnpm build`):**
   - Execução do Nest CLI (`nest build`).
   - **Resultado:** Código de saída 0 (sucesso absoluto na compilação do TypeScript para `dist/`).
4. **Análise Estática e Linter (`pnpm lint`):**
   - Execução do linter sobre `src/` e `test/`.
   - **Resultado:** 0 erros encontrados. (12 avisos pré-existentes identificados fora do escopo auditado de produtos, devidamente mapeados).
5. **Chamada HTTP Real à API Containerizada (`curl`):**
   - Requisição `POST /products` com payload válido retornou `201 Created` e `{ "productId": "...", "name": "..." }`.
   - Consulta direta via SQL comprovou persistência na tabela `products.products` do PostgreSQL.

---

## 7. Rastreabilidade com o Planejamento no GitHub
* Todas as Sub-Issues planejadas da Epic #1 ([#4](https://github.com/evertonfoz/dsc-tests/issues/4) a [#11](https://github.com/evertonfoz/dsc-tests/issues/11) e [#16](https://github.com/evertonfoz/dsc-tests/issues/16)) encontram-se concluídas e fechadas.
* Os Pull Requests correspondentes ([#12](https://github.com/evertonfoz/dsc-tests/pull/12) a [#19](https://github.com/evertonfoz/dsc-tests/pull/19)) foram revisados e integrados à branch principal `main`.
* O quadro de projetos [Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6) reflete as tarefas em estado concluído.

---

## 8. Riscos Mapeados e Plano de Auditoria
* **Riscos Arquiteturais a Investigar:**
  - Acoplamento indevido entre camadas (ex.: Service importando ORM ou DTOs HTTP).
  - Variação ou vazamento de tipos de infraestrutura na interface de repositório de domínio.
  - Duplicação de lógica de mapeamento ou bypass do mapper HTTP.
  - Dependência do ciclo de vida do NestJS em relação a classes de infraestrutura não registradas.
* **Plano de Auditoria:**
  1. Reconstruir formalmente o fluxo de execução vs. mapa de dependências arquiteturais (Artefato 12-02).
  2. Auditar cada um dos 8 critérios de qualidade com evidências estritas de código (Artefato 12-03).
  3. Diferenciar hipóteses teóricas de problemas reais e priorizar decisões técnicas (Artefato 12-04).
  4. Executar refatorações controladas somente se justificadas, ou documentar a preservação arquitetural (Artefato 12-05).
  5. Validar todas as suítes de regressão e documentar a política de segurança de bancos (Artefato 12-06).
  6. Formalizar as decisões arquiteturais (ADRs) no Artefato 12-07.
  7. Elaborar o parecer técnico de revisão e checklist final de governança (Artefato 12-08).
