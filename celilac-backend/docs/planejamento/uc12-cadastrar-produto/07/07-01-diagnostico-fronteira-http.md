# ARTEFATO 07-01 — DIAGNÓSTICO DA FRONTEIRA HTTP E VERIFICAÇÃO DE PRONTIDÃO

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Identificação Geral da Demanda e Rastreabilidade

- **Projeto:** CeliLac Backend API.
- **Caso de Uso:** `UC12 — Cadastrar Produto`.
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Sub-Issue Focal da Etapa (Fronteira HTTP):** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (GitHub Issue [#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Sub-Issues Interdependentes:**
  - `SUB-02 — [UC12][DTO] Criar DTO para cadastro de produto` (GitHub Issue [#5](https://github.com/evertonfoz/dsc-tests/issues/5)).
  - `SUB-03 — [UC12][Regras] Implementar validações e regras de negócio para cadastro` (GitHub Issue [#6](https://github.com/evertonfoz/dsc-tests/issues/6)).
  - `SUB-05 — [UC12][Serviço de Aplicação] Implementar serviço de aplicação para cadastro de produto` (GitHub Issue [#8](https://github.com/evertonfoz/dsc-tests/issues/8)).
  - `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Critério de Aceite Focal:** `CA01 — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto`.
- **Responsável Técnico pela Atividade:** Everton Coimbra de Araújo (`@evertonfoz`).
- **Revisor Técnico / Governança:** Revisão cruzada da equipe e aprovação técnica documentada.

---

## 2. 🌟 Refinamento 1 (Obrigatório) — Delimitação Rigorosa de Responsabilidades entre Sub-Issues

A Engenharia de Software exige distinção inequívoca de responsabilidades entre as unidades de trabalho planejadas no Material 01:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEIRA HTTP (SUB-06)                         │
│  - Recebe requisição POST /products                                    │
│  - Extrai payload JSON via @Body()                                     │
│  - Valida formato e obrigatoriedade sintática via DTO (SUB-02)         │
│  - Devolve status HTTP 201 Created ou 400 Bad Request                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ delega dto.name
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVIÇO DE APLICAÇÃO (SUB-05)                        │
│  - ProductsService.createProduct(name: string): Promise<Product>       │
│  - Orquestra identidade da entidade Product                            │
│  - Invoca repositório sem conhecer transporte HTTP                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  REGRAS DE DOMÍNIO (SUB-03)  │        │   PERSISTÊNCIA (SUB-04)      │
│  - Invariantes de negócio    │        │  - ProductsRepository.save   │
│  - Ciclo TDD próprio futuro  │        │  - In-Memory / PostgreSQL    │
└──────────────────────────────┘        └──────────────────────────────┘
```

1. **Sub-Issue de DTO de Entrada (`SUB-02` / Issue #5):**
   - Responsável por definir o contrato plano dos dados recebidos via rede (`CreateProductDto`).
   - Não implementa regras de negócio do domínio; valida a higidez sintática dos dados recebidos no corpo da requisição.
2. **Sub-Issue de Validações e Regras de Negócio (`SUB-03` / Issue #6):**
   - Trata de regras e invariantes de aplicação/domínio (como rejeitar strings compostas exclusivamente por espaços ou regras de unicidade).
   - Pertence ao ciclo de domínio. A rejeição de campos vazios pelo `ValidationPipe` na borda HTTP **não substitui** o TDD próprio desta Sub-Issue.
3. **Sub-Issue do Serviço de Aplicação (`SUB-05` / Issue #8):**
   - Concluída na etapa GREEN (Material 05/06).
   - O Controller **apenas consome** o método `createProduct(name: string)` sem alterar sua assinatura ou duplicar sua lógica.
4. **Sub-Issue do Endpoint HTTP (`SUB-06` / Issue #9):**
   - Escopo estrito desta etapa: Controller, DTO com decoradores, `ValidationPipe`, composição de módulo e injeção de dependência.
5. **Sub-Issue de Testes Automatizados (`SUB-07` / Issue #10):**
   - Abrange os testes unitários do serviço e agora os testes automatizados da fronteira HTTP com Supertest e Vitest.

---

## 3. Contratos Arquiteturais Recuperados

Todos os contratos estabelecidos nas etapas anteriores foram integralmente identificados e preservados:

- **Entidade de Domínio (`Product`):**
  - Arquivo: `src/modules/products/entities/product.entity.ts`
  - Construtor: `new Product(productId: string, name: string)`
- **Contrato de Persistência (`ProductsRepository`):**
  - Arquivo: `src/modules/products/repositories/products.repository.interface.ts`
  - Token de Injeção: `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`
  - Método: `save(product: Product): Promise<Product>`
- **Serviço de Aplicação (`ProductsService`):**
  - Arquivo: `src/modules/products/services/products.service.ts`
  - Assinatura: `createProduct(name: string): Promise<Product>`
  - Dependência Injetada: `@Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository`

---

## 4. Dependências de Pacotes e Infraestrutura (`package.json`)

Verificou-se a prontidão das bibliotecas necessárias no ambiente do projeto:

- `TypeScript`: `^6.0.3` (suporte a decorators experimentais e type checking estrito).
- `NestJS`: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` (`^12.1.1`).
- `Validação de Entrada`: `class-validator` (`^0.15.1`) e `class-transformer` (`^0.5.1`) instalados e funcionais.
- `Testes Automatizados`: `vitest` (`^4.1.11`), `@nestjs/testing` (`^12.1.1`), `supertest` (`^7.3.0`) e `@types/supertest` (`^7.2.1`).

---

## 5. Matriz de Avaliação da Definition of Ready (DoR)

Avaliação sistemática dos critérios de prontidão para a Sub-Issue `SUB-06`:

| Item DoR | Descrição do Critério | Situação | Evidência Comprobatória |
| :---: | :--- | :---: | :--- |
| **DoR-01** | Objetivo claramente definido | **Atende** | Disponibilizar o cadastro de produto através da rota `POST /products`. |
| **DoR-02** | Escopo delimitado | **Atende** | Restrito a Controller, DTO, validação HTTP, módulo NestJS e testes de borda. |
| **DoR-03** | Critérios de aceite verificáveis | **Atende** | Retorno 201 com JSON do produto em dados válidos; retorno 400 em entrada inválida. |
| **DoR-04** | Dependências identificadas | **Atende** | Depende de `SUB-05` (serviço GREEN disponível) e `SUB-02` (DTO). |
| **DoR-05** | Informações e contratos disponíveis | **Atende** | Assinatura `createProduct(name: string)` e entidade `Product` consolidadas. |
| **DoR-06** | Responsável técnico definido | **Atende** | Atividade atribuída a `@evertonfoz`. |
| **DoR-07** | Revisão de planejamento concluída | **Atende** | Planejamento de branches dependentes e DoR aprovada formalmente. |

---

## 6. Diagnóstico da Linha de Base dos Testes Existentes

Antes de qualquer alteração na fronteira HTTP, a suíte de testes unitários do serviço de aplicação (`products.service.spec.ts`) foi executada no ambiente real:

```text
 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/modules/products/services/products.service.spec.ts (1 test) 87ms
   ✓ ProductsService (1)
     ✓ should register and save a product when valid data is provided (CA01) 87ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  453ms
```

**Diagnóstico:** A linha de base da aplicação está 100% verde e apta para receber a fronteira HTTP.
