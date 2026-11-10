# ARTEFATO 08-02 — COMPARAÇÃO DOS NÍVEIS DE TESTE

## 1. Objetivo da Análise Comparativa

Distinguir rigorosamente os diferentes níveis de testes automatizados aplicáveis ao fluxo de cadastro de produtos (`UC12 — Cadastrar Produto`), evidenciando o que cada nível comprova, quais componentes são reais ou simulados (*mocks/stubs*) e por que **o teste HTTP com `ProductsService` simulado (produzido no Material 07) não substitui o teste integrado com `ProductsService` e `InMemoryProductsRepository` reais**.

---

## 2. Análise Individual dos Três Níveis de Teste no CeliLac

### 2.1 Nível A — Teste Unitário do Serviço (`products.service.spec.ts`)
- **Arquivo existente:** `src/modules/products/services/products.service.spec.ts`
- **Configuração no `TestingModule`:**
  ```typescript
  const productsRepositoryMock: Mocked<ProductsRepository> = {
    save: vi.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ProductsService,
      { provide: PRODUCTS_REPOSITORY, useValue: productsRepositoryMock },
    ],
  }).compile();
  ```
- **O que utiliza:**
  - **Componentes reais:** `ProductsService` e entidade `Product`.
  - **Componentes simulados:** `ProductsRepository` (substituído por `productsRepositoryMock` associado ao token `PRODUCTS_REPOSITORY`).
- **O que comprova:** Comprova que `ProductsService.createProduct('Celular XYZ')` instancia um `Product` com `productId` gerado (`randomUUID()`) e invoca `productsRepository.save(product)` uma única vez, retornando o produto salvo (`CA01` isolado na camada de aplicação).
- **O que NÃO comprova:** Não verifica se existe uma rota HTTP `POST /products`, não exercita `ProductsController`, não valida `CreateProductDto` / `ValidationPipe`, não verifica se `ProductsModule` registra corretamente o token `PRODUCTS_REPOSITORY` e não executa `InMemoryProductsRepository`.

### 2.2 Nível B — Teste HTTP com Service Simulado (`products.controller.spec.ts`)
- **Arquivo existente:** `src/modules/products/controllers/products.controller.spec.ts`
- **Configuração no `TestingModule`:**
  ```typescript
  const serviceMock = {
    createProduct: vi.fn(),
  };

  const moduleFixture: TestingModule = await Test.createTestingModule({
    controllers: [ProductsController],
    providers: [
      {
        provide: ProductsService,
        useValue: serviceMock,
      },
    ],
  }).compile();
  ```
- **O que utiliza:**
  - **Componentes reais:** `ProductsController`, `CreateProductDto`, `ValidationPipe({ whitelist: true, transform: true })`, pipeline HTTP NestJS (`INestApplication`) e `Supertest`.
  - **Componentes simulados:** `ProductsService` (substituído por `serviceMock`).
- **O que comprova:** Comprova que a fronteira HTTP mapeia `POST /products`, valida o payload de entrada via `CreateProductDto` + `ValidationPipe` (rejeitando `{"name": ""}` com `400 Bad Request` sem chamar o serviço) e, para entradas válidas (`{"name": "Celular XYZ"}`), delega para `productsService.createProduct('Celular XYZ')` retornando `201 Created`.
- **O que NÃO comprova:** **Não executa o `ProductsService` real**, não gera `randomUUID()` real do serviço, não resolve o token `PRODUCTS_REPOSITORY`, não instancia `InMemoryProductsRepository` e não valida a composição real definida em `ProductsModule`. Se `ProductsModule` estivesse com o provider `PRODUCTS_REPOSITORY` ausente ou quebrado, este teste continuaria passando!

### 2.3 Nível C — Teste Integrado do Backend (Escopo do Material 08)
- **Arquivo previsto:** `src/modules/products/products.integration.spec.ts`
- **Configuração no `TestingModule`:**
  ```typescript
  const moduleRef = await Test.createTestingModule({
    imports: [ProductsModule],
  }).compile();
  ```
- **O que utiliza:**
  - **Componentes reais:** `ProductsModule`, `ProductsController`, `CreateProductDto`, `ValidationPipe`, `ProductsService`, token `PRODUCTS_REPOSITORY`, `InMemoryProductsRepository`, entidade `Product`, `Supertest` e `Vitest`.
  - **Componentes simulados:** **Nenhum** no fluxo do módulo de produtos (sem mocks de `ProductsService` ou de `ProductsRepository`).
- **O que comprova:** Comprova o funcionamento integrado de ponta a ponta em memória:
  `Requisição HTTP → ValidationPipe / CreateProductDto → ProductsController → ProductsService → PRODUCTS_REPOSITORY → InMemoryProductsRepository`, incluindo a resolução real da árvore de injeção de dependências configurada no `ProductsModule`.
- **O que NÃO comprova:** Não comprova a persistência definitiva em banco de dados relacional PostgreSQL/TypeORM (`SUB-04`), nem comprova que `ProductsService.createProduct("")` rejeitaria um nome vazio se fosse chamado diretamente fora da fronteira HTTP (`CA02` na camada de aplicação/domínio).

---

## 3. Matriz Comparativa dos Níveis de Teste

| Critério | Nível A — Teste Unitário do Service (`products.service.spec.ts`) | Nível B — Teste HTTP com Service Simulado (`products.controller.spec.ts`) | Nível C — Teste Integrado do Backend (`products.integration.spec.ts`) |
| :--- | :--- | :--- | :--- |
| **Componentes Reais** | `ProductsService`, `Product` | `ProductsController`, `CreateProductDto`, `ValidationPipe`, `INestApplication` | `ProductsModule`, `ProductsController`, `CreateProductDto`, `ValidationPipe`, `ProductsService`, `InMemoryProductsRepository`, `Product`, `INestApplication` |
| **Componentes Simulados** | `ProductsRepository` (`productsRepositoryMock` com `vi.fn()`) | `ProductsService` (`serviceMock` com `vi.fn()`) | **Nenhum** (zero mocks para Service e Repository) |
| **Dependências de Teste** | `vitest`, `@nestjs/testing` | `vitest`, `@nestjs/testing`, `supertest`, `class-validator`, `class-transformer` | `vitest`, `@nestjs/testing`, `supertest`, `class-validator`, `class-transformer` |
| **Comportamento Verificado** | Lógica interna de `createProduct(name)`: instanciação de `Product(randomUUID(), name)` e chamada a `repository.save(product)`. | Roteamento `POST /products`, validação do DTO via `ValidationPipe` (`400`) e delegação `controller -> serviceMock.createProduct(dto.name)` (`201`). | Integração real entre `ProductsModule`, `ProductsController`, `ProductsService` e `InMemoryProductsRepository` diante de requisições HTTP válidas (`201`) e inválidas (`400`). |
| **Evidência Produzida** | Asserções sobre o retorno de `service.createProduct()` e spy `toHaveBeenCalledTimes(1)` no mock do repositório. | Respostas HTTP (`201` com ID fixo `'product-1'` do mock; `400` para nome vazio) e spies sobre `serviceMock.createProduct`. | Respostas HTTP reais (`201` com UUID dinâmico gerado por `ProductsService` e salvo por `InMemoryProductsRepository`; `400` na rejeição HTTP) e verificação opcional da instância real no container IoC. |
| **Limitações** | Não exercita a camada HTTP, nem a serialização JSON, nem o `ProductsModule`. | Não executa `ProductsService` nem `InMemoryProductsRepository`; não detecta falhas de injeção de `PRODUCTS_REPOSITORY` no `ProductsModule`. | Utiliza armazenamento volátil em memória (`InMemoryProductsRepository`); a resposta HTTP sozinha não inspeciona diretamente o array interno sem consulta ao container. |
| **Requisitos Não Cobertos** | Fronteira HTTP (`SUB-06`), composição do `ProductsModule`, regra `CA02` no domínio e persistência PostgreSQL (`SUB-04`). | Execução integrada de `ProductsService` + `ProductsRepository`, composição de `ProductsModule`, `CA02` no serviço e persistência PostgreSQL (`SUB-04`). | Persistência relacional real em PostgreSQL/TypeORM (`SUB-04`), transações/constraints SQL e validação `CA02` invocada diretamente em `ProductsService`. |

---

## 4. Conclusão Fundamentada

> [!IMPORTANT]
> **O teste HTTP com Service simulado (`products.controller.spec.ts`), produzido no Material 07, não substitui o teste integrado com `ProductsService` e `InMemoryProductsRepository` reais.**

### Justificativa Técnica:
1. **Isolamento vs. Composição:** No Nível A testa-se o `ProductsService` isolado (simulando o repositório) e no Nível B testa-se o `ProductsController` isolado (simulando o serviço). Nenhum dos dois importa `ProductsModule` nem verifica se o container de Injeção de Dependências do NestJS consegue conectar `ProductsController → ProductsService → PRODUCTS_REPOSITORY → InMemoryProductsRepository`.
2. **Detecção de Falhas de Integração:** Caso `ProductsModule` omitisse o provider `{ provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }` ou utilizasse um token divergente, **tanto o Nível A quanto o Nível B continuariam 100% aprovados**, mas a aplicação real falharia ao inicializar (`UnknownDependenciesException`).
3. **Complementaridade na Pirâmide de Testes:** O Nível C fecha a lacuna entre a fronteira HTTP e a camada de aplicação/persistência em memória, garantindo que os contratos reais funcionem em conjunto antes de evoluir a infraestrutura para PostgreSQL/TypeORM na futura `SUB-04`.

