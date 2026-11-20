# ARTEFATO 08-02 — COMPARAÇÃO DOS NÍVEIS DE TESTE

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Contexto e Fundamentação Técnica

Na evolução do desenvolvimento de software orientado a testes (TDD) e arquitetura em camadas, diferentes níveis de teste desempenham papéis complementares e possuem limites de cobertura estritamente definidos.

Nesta etapa, o projeto CeliLac atinge um ponto de maturidade em que três níveis distintos de testes automatizados coexistem no módulo de produtos (`src/modules/products/`):

1. **Nível A — Teste Unitário do Serviço de Aplicação** (`products.service.spec.ts`);
2. **Nível B — Teste da Fronteira HTTP com Serviço Simulado** (`products.controller.spec.ts`);
3. **Nível C — Teste Integrado do Backend em Memória** (`products.integration.spec.ts`).

---

## 2. Caracterização Detalhada dos Três Níveis de Teste

### 2.1 Nível A — Teste Unitário do Service (Materiais 04 a 06)
- **Arquivo Real:** `src/modules/products/services/products.service.spec.ts`
- **Componentes Reais:** `ProductsService` e a entidade de domínio `Product`.
- **Componentes Simulados (Dublês/Mocks):** `productsRepositoryMock` criado com `save: vi.fn()`.
- **Objetivo Arquitetural:** Verificar o comportamento isolado da regra de aplicação no método `createProduct(name)`. Comprova que o serviço gera um identificador único, instancia a entidade `Product` e delega a gravação para o contrato `ProductsRepository.save`.
- **Limitação Intrínseca:** Não instancia o `ProductsController`, não aciona o transporte HTTP (Fastify/Express), não executa a serialização JSON, não aciona o `ValidationPipe` do NestJS e não valida a resolução de providers no container de injeção de dependência.

### 2.2 Nível B — Teste HTTP com Service Simulado (Material 07)
- **Arquivo Real:** `src/modules/products/controllers/products.controller.spec.ts`
- **Componentes Reais:** `ProductsController`, `CreateProductDto`, `ValidationPipe` e o pipeline HTTP do Express gerenciado pelo NestJS (`createNestApplication()`).
- **Componentes Simulados (Dublês/Mocks):** `ProductsService` simulado com `{ createProduct: vi.fn() }`.
- **Objetivo Arquitetural:** Testar exclusivamente a **fronteira HTTP**: recebimento da requisição na rota `POST /products`, conversão e sanitização de payload via DTO (`@IsString()`, `@IsNotEmpty()`), devolução dos códigos de status apropriados (`201 Created` e `400 Bad Request`) e a delegação do controller para o método `createProduct` do serviço.
- **Limitação Intrínseca:** O serviço de aplicação real **nunca é executado**. Não há instanciação real da entidade de domínio, nem geração do UUID pelo serviço, nem resolução do token `PRODUCTS_REPOSITORY`, nem acionamento da classe concreta de repositório.

### 2.3 Nível C — Teste Integrado do Backend (Material 08)
- **Arquivo Real:** `src/modules/products/products.integration.spec.ts`
- **Componentes Reais:** `ProductsModule` completo, `ProductsController`, `ProductsService`, `Product`, `CreateProductDto`, `ValidationPipe`, token `PRODUCTS_REPOSITORY` e a implementação concreta `InMemoryProductsRepository`.
- **Componentes Simulados (Dublês/Mocks):** **Nenhum**. Todo o fluxo é executado com as classes concretas de produção. O container de IoC do NestJS compila o módulo real e resolve todas as dependências em tempo de execução.
- **Objetivo Arquitetural:** Comprovar a orquestração e interoperabilidade conjunta entre todas as camadas da aplicação (Transporte HTTP ➔ Controller ➔ Service ➔ Contrato ➔ Repositório Concreto em Memória). Comprova que a injeção via token funciona, que os dados transitam íntegros através das fronteiras e que o repositório em memória persiste a entidade.
- **Limitação Intrínseca:** Não verifica persistência em banco de dados relacional (ex.: PostgreSQL), transações ACID de banco, chaves estrangeiras ou migrações SQL (escopo que será planejado no Material 08 e implementado no Material 09).

---

## 3. Matriz Comparativa Obrigatória dos Níveis de Teste

| Critério de Comparação | Nível A — Unitário do Service | Nível B — HTTP com Service Simulado | Nível C — Integrado do Backend |
| :--- | :--- | :--- | :--- |
| **Componentes Reais** | `ProductsService`, `Product` | `ProductsController`, `CreateProductDto`, `ValidationPipe`, Express Server | `ProductsModule`, `ProductsController`, `ProductsService`, `Product`, `CreateProductDto`, `ValidationPipe`, `InMemoryProductsRepository` |
| **Componentes Simulados (Mocks)** | `ProductsRepository` (`vi.fn()`) | `ProductsService` (`vi.fn()`) | **Nenhum** (fluxo 100% real em memória) |
| **Dependências Exercitadas** | Contrato `ProductsRepository.save` | `ValidationPipe`, Roteamento HTTP, `supertest` | Container de DI NestJS, Token `PRODUCTS_REPOSITORY`, Roteamento HTTP, Serialização |
| **Comportamento Verificado** | Lógica de aplicação, instanciação da entidade e chamada ao repositório | Validação de borda (DTO), formato JSON, status HTTP 201 e 400 | Fluxo ponta a ponta: HTTP ➔ Controller ➔ Service ➔ Repositório em Memória |
| **Evidência Produzida** | Retorno da Promise do serviço e assert no spy do repositório | Resposta HTTP serializada e assert no spy do mock do serviço | Resposta HTTP com UUID real gerado pelo serviço e gravação física no array em memória |
| **Limitações Técnicas** | Não testa transporte de rede, serialização, validação de DTO ou injeção NestJS | Não testa o serviço real, nem o domínio, nem o repositório | Não testa persistência relacional em PostgreSQL, concorrência real ou transações ACID |
| **Requisitos / CAs Não Cobertos** | `CA01` na camada HTTP (códigos 201/400) | `CA01` na camada de persistência e geração real de identidade | Persistência durável em SGBD e restrições relacionais de unicidade/integridade |

---

## 4. Conclusão Técnica e Pedagógica Central

> ⚠️ **PRINCÍPIO FUNDAMENTAL:**  
> **O teste HTTP com Service simulado (Nível B), produzido no Material 07, não substitui e nem comprova o funcionamento integrado do backend com Service e Repository reais (Nível C).**

1. O Nível B garante que a "porta de entrada" (HTTP e validação sintática) funciona de forma isolada, mas não atesta que o container do NestJS sabe resolver o token `PRODUCTS_REPOSITORY` nem que o `ProductsService` consegue se comunicar com o repositório.
2. O Nível A garante a lógica do serviço, mas assume a premissa hipotética de que os dados chegam corretos da web e que o repositório responderá conforme o mock.
3. Somente o **Nível C (Teste Integrado)** conecta as pontas, exercitando a cadeia completa com o container de IoC real, demonstrando que o sistema é funcionalmente coeso desde a porta de rede até o armazenamento de dados.
