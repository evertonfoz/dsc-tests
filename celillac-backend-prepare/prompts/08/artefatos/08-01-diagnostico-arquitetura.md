# ARTEFATO 08-01 — DIAGNÓSTICO DA ARQUITETURA E LINHA DE BASE DOS TESTES

## 1. Identificação do Projeto e Caso de Uso

| Elemento | Valor Verificado nos Artefatos (Material 07) e no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue de Testes (Foco Principal de Implementação)** | [`SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (Issue #10)](https://github.com/evertonfoz/dsc-tests/issues/10) |
| **Issue da Fronteira HTTP (Integrada)** | [`SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (Issue #9)](https://github.com/evertonfoz/dsc-tests/issues/9) |
| **Issue de Persistência (Planejamento Conceitual)** | [`SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` (Issue #7)](https://github.com/evertonfoz/dsc-tests/issues/7) |

---

## 2. Mapeamento das Issues Relacionadas, Responsáveis, Revisores e GitHub Project (#6)

A inspeção dos 8 artefatos do Material 07 (`prompts/07/artefatos/07-01` a `07-08`) e a consulta direta via GitHub CLI (`gh issue list` e `gh project item-list 6 --owner evertonfoz`) confirmaram o estado atual:

| Issue | Identificador | Responsabilidade | Responsável (Assignee Real / Papel Simulado) | Revisor (Papel Simulado) | Estado na Issue | Status no Project #6 |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| [#1](https://github.com/evertonfoz/dsc-tests/issues/1) | `EPIC-UC12` | Caso de uso completo (`[UC12] Cadastrar Produto`) | `@evertonfoz` (Coordenação / Ana Clara e Carla) | Equipe | `OPEN` | **`Backlog`** |
| [#4](https://github.com/evertonfoz/dsc-tests/issues/4) | `SUB-01` | Entidade de domínio `Product` | `@evertonfoz` (Ana Clara Souza) | Bruno Oliveira Santos | `OPEN` | **`Ready`** |
| [#5](https://github.com/evertonfoz/dsc-tests/issues/5) | `SUB-02` | DTO de cadastro (`CreateProductDto`) e contrato de saída | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`Ready`** |
| [#6](https://github.com/evertonfoz/dsc-tests/issues/6) | `SUB-03` | Validações e regras de negócio (`RN01`, `CA02`) | `@evertonfoz` (Bruno Oliveira Santos) | Ana Clara Souza | `OPEN` | **`Ready`** |
| [#7](https://github.com/evertonfoz/dsc-tests/issues/7) | `SUB-04` | Persistência e repositório de produtos | `@evertonfoz` (Bruno Oliveira Santos) | Ana Clara Souza | `OPEN` | **`Ready`** |
| [#8](https://github.com/evertonfoz/dsc-tests/issues/8) | `SUB-05` | Serviço de aplicação (`ProductsService.createProduct`) | `@evertonfoz` (Ana Clara Souza) | Carla Mendes Ferreira | `OPEN` | **`In Progress`** |
| [#9](https://github.com/evertonfoz/dsc-tests/issues/9) | `SUB-06` | Endpoint HTTP (`POST /products`) | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`In Progress`** |
| [#10](https://github.com/evertonfoz/dsc-tests/issues/10) | `SUB-07` | Testes automatizados (unitários, HTTP e integrados) | `@evertonfoz` (Diego Costa Almeida) | Bruno Oliveira Santos | `OPEN` | **`In Progress`** |
| [#11](https://github.com/evertonfoz/dsc-tests/issues/11) | `SUB-08` | Documentação técnica | `@evertonfoz` (Diego Costa Almeida) | Carla Mendes Ferreira | `OPEN` | **`Backlog`** |

### Critérios de Aceite do Caso de Uso (`EPIC-UC12`) e da `SUB-07` (#10)
- **`CA01`:** Uma solicitação contendo dados válidos deve resultar no cadastro de um produto.
- **`CA02`:** Uma solicitação sem o nome obrigatório deve ser rejeitada *(atualmente validada apenas na fronteira HTTP via `CreateProductDto` + `ValidationPipe`; pendente na camada de aplicação/domínio)*.
- **`CA03`:** Uma solicitação rejeitada não deve produzir o armazenamento de um produto inválido.
- **`CA04`:** Os comportamentos implementados devem possuir verificação automatizada correspondente.

### Política de WIP
- **Limite individual:** 1 atividade em `In Progress` por papel técnico simulado ($WIP = 1$).
- **Limite global da equipe:** Máximo de 3 atividades simultâneas em `In Progress`.
- **Situação atual:** 3 itens em `In Progress` (`#8` com Ana Clara Souza, `#9` com Carla Mendes Ferreira e `#10` com Diego Costa Almeida), respeitando o limite individual e o teto global. O teste integrado desta unidade vincula-se à **`SUB-07` (Issue #10)** em coordenação com a **`SUB-06` (Issue #9)**, sem necessidade de abrir nova Issue ou violar o WIP.

---

## 3. Arquitetura, Componentes e Contratos Verificados no Código-Fonte

A inspeção direta dos arquivos reais na branch atual `feature/uc12-06-products-http` confirmou a presença e integridade de todos os componentes:

### 3.1 Fluxo Arquitetural em Camadas (Estado Atual)
```text
Requisição HTTP (POST /products)
        │
        ▼
ValidationPipe ({ whitelist: true, transform: true }) + CreateProductDto
        │
        ▼
ProductsController.create(dto)
        │  delega dto.name
        ▼
ProductsService.createProduct(name)
        │  instancia new Product(randomUUID(), name)
        ▼
ProductsRepository (Token: PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY')
        │  resolvido via DI pelo ProductsModule
        ▼
InMemoryProductsRepository.save(product)
```

### 3.2 Contratos Verificados em `src/modules/products/`

1. **Entidade `Product` (`src/modules/products/entities/product.entity.ts`):**
   ```typescript
   export class Product {
     constructor(
       public readonly productId: string,
       public readonly name: string,
     ) {}
   }
   ```
   - **Status:** Preservada integralmente (`productId: string`, `name: string`, sem `price`).

2. **Interface `ProductsRepository` e Token `PRODUCTS_REPOSITORY` (`src/modules/products/repositories/products.repository.interface.ts`):**
   ```typescript
   import { Product } from '../entities/product.entity.js';

   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```
   - **Status:** Preservados integralmente.

3. **Repositório em Memória `InMemoryProductsRepository` (`src/modules/products/repositories/in-memory-products.repository.ts`):**
   ```typescript
   @Injectable()
   export class InMemoryProductsRepository implements ProductsRepository {
     private readonly products: Product[] = [];

     async save(product: Product): Promise<Product> {
       this.products.push(product);
       return product;
     }
   }
   ```
   - **Status:** Implementa `ProductsRepository` e armazena em `private readonly products: Product[] = []`.

4. **Serviço de Aplicação `ProductsService` (`src/modules/products/services/products.service.ts`):**
   ```typescript
   @Injectable()
   export class ProductsService {
     constructor(
       @Inject(PRODUCTS_REPOSITORY)
       private readonly productsRepository: ProductsRepository,
     ) {}

     async createProduct(name: string): Promise<Product> {
       const product = new Product(randomUUID(), name);
       return this.productsRepository.save(product);
     }
   }
   ```
   - **Status:** Injeta `PRODUCTS_REPOSITORY` e expõe `createProduct(name: string): Promise<Product>`.

5. **Controller HTTP `ProductsController` (`src/modules/products/controllers/products.controller.ts`):**
   ```typescript
   @Controller('products')
   export class ProductsController {
     constructor(private readonly productsService: ProductsService) {}

     @Post()
     async create(@Body() dto: CreateProductDto): Promise<Product> {
       return this.productsService.createProduct(dto.name);
     }
   }
   ```
   - **Status:** Expõe `POST /products` e delega `this.productsService.createProduct(dto.name)`.

6. **DTO de Entrada `CreateProductDto` (`src/modules/products/dtos/create-product.dto.ts`):**
   ```typescript
   import { IsNotEmpty, IsString } from 'class-validator';

   export class CreateProductDto {
     @IsString()
     @IsNotEmpty()
     name!: string;
   }
   ```
   - **Status:** Valida `name` com `@IsString()` e `@IsNotEmpty()`.

7. **Configuração do `ValidationPipe` (`src/main.ts`):**
   - Configurado globalmente via `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`, escutando em `process.env.PORT || 3200`.

8. **Módulo de Produtos `ProductsModule` (`src/modules/products/products.module.ts`):**
   ```typescript
   @Module({
     controllers: [ProductsController],
     providers: [
       ProductsService,
       {
         provide: PRODUCTS_REPOSITORY,
         useClass: InMemoryProductsRepository,
       },
     ],
     exports: [ProductsService],
   })
   export class ProductsModule {}
   ```

9. **Módulo Raiz `AppModule` (`src/app.module.ts`):**
   - Importa `ConfigModule.forRoot({ isGlobal: true })`, `OrdersModule`, `ProductsModule` e `TypeOrmModule.forRootAsync(...)`.

---

## 4. Dependências, Framework de Testes e Comandos de Execução

Verificados em `package.json`, `tsconfig.json` e `vitest.config.ts`:
- **Runtime / Compilação:** Node.js com ESM (`"type": "module"`, `"module": "nodenext"`, `"target": "ES2023"`), TypeScript `^6.0.2`, NestJS `^12.1.2`.
- **Validação:** `class-validator` (`^0.15.1`), `class-transformer` (`^0.5.1`).
- **Framework de Testes:** **Vitest** (`^4.1.2`, executando `v4.1.11`), configurado em `vitest.config.ts` com `globals: true` e `include: ['**/*.spec.ts']`.
- **Testes HTTP:** `@nestjs/testing` (`^12.1.2`), `supertest` (`^7.0.0`), `@types/supertest` (`^7.0.0`).
- **Comandos de Execução (`package.json`):**
  - Suíte de testes: `pnpm test` (`vitest run`) ou `pnpm test --run`
  - Build: `pnpm build` (`nest build`)
  - Inicialização: `pnpm start` (`nest start`) ou `pnpm start:prod` (`node dist/main`)

---

## 5. Situação das Branches e Pull Requests

A verificação via `git branch -vv`, `git log --oneline --graph` e `gh pr list --state all` confirmou a topologia em cadeia (*stacked branches*):

```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 -> main | OPEN]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 -> feature/uc12-07-product-registration-test | OPEN]
              └── feature/uc12-06-products-http (fd00b5a) [Draft PR #14 -> feature/uc12-05-products-service | OPEN] (HEAD atual)
```

| Pull Request | Issue | Branch de Origem (`head`) | Branch de Destino (`base`) | Estado | Modo Draft |
| :---: | :---: | :--- | :--- | :---: | :---: |
| [#12](https://github.com/evertonfoz/dsc-tests/pull/12) | `SUB-07` (#10) | `feature/uc12-07-product-registration-test` | `main` | `OPEN` | `true` |
| [#13](https://github.com/evertonfoz/dsc-tests/pull/13) | `SUB-05` (#8) | `feature/uc12-05-products-service` | `feature/uc12-07-product-registration-test` | `OPEN` | `true` |
| [#14](https://github.com/evertonfoz/dsc-tests/pull/14) | `SUB-06` (#9) | `feature/uc12-06-products-http` | `feature/uc12-05-products-service` | `OPEN` | `true` |

---

## 6. Recuperação da Linha de Base dos Testes (Fase 3)

Antes de qualquer alteração para o Material 08, foi executada a suíte de testes atual para confirmar empiricamente a linha de base herdada do Material 07.

### 6.1 Registro da Execução Real
- **Comando executado:** `pnpm test --run`
- **Branch utilizada:** `feature/uc12-06-products-http` (commit `fd00b5a`)
- **Saída real do terminal:**
  ```text
  $ vitest run --run

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/app.controller.spec.ts (1 test) 91ms
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 89ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 79ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 68ms

   Test Files  4 passed (4)
        Tests  10 passed (10)
     Start at  18:38:39
     Duration  564ms (transform 127ms, setup 0ms, import 1.11s, tests 327ms, environment 0ms)
  ```

### 6.2 Resumo das Evidências da Linha de Base

| Métrica | Valor Confirmado |
| :--- | :--- |
| **Comando executado** | `pnpm test --run` |
| **Branch utilizada** | `feature/uc12-06-products-http` |
| **Quantidade de arquivos de teste** | `4` (`app.controller.spec.ts`, `orders.service.spec.ts`, `products.service.spec.ts`, `products.controller.spec.ts`) |
| **Quantidade de testes executados** | `10` (`1` em `AppController`, `6` em `OrdersService`, `1` unitário em `ProductsService`, `2` HTTP simulados em `ProductsController`) |
| **Quantidade de testes aprovados** | `10 passed (10)` |
| **Quantidade de falhas** | `0` |
| **Erros identificados** | Nenhum erro de compilação ou execução. |
| **Situação da linha de base** | **Confirmada e íntegra (100% GREEN).** Coincide exatamente com o resultado histórico documentado ao final do Material 07. |

---

## 7. Pendências Técnicas e Condições para Prosseguir

### 7.1 Pendências Técnicas Identificadas
1. **Ausência de teste automatizado integrado do módulo `ProductsModule`:** O teste `products.controller.spec.ts` utiliza um mock de `ProductsService` (`serviceMock`), e `products.service.spec.ts` utiliza um mock de `ProductsRepository` (`productsRepositoryMock`). Ainda não há um teste automatizado que exercite conjuntamente `ProductsModule` + `ProductsController` + `ProductsService` + `InMemoryProductsRepository` reais via Supertest.
2. **Regra `CA02` na camada de aplicação/domínio:** A validação de nome vazio ocorre apenas na fronteira HTTP (`CreateProductDto` + `ValidationPipe`), permanecendo pendente para ciclo TDD próprio em `ProductsService`/`Product` (`SUB-03`/`SUB-05`).
3. **Persistência definitiva em banco de dados (`SUB-04` — Issue #7):** Atualmente o módulo utiliza `InMemoryProductsRepository`. A implementação com PostgreSQL e TypeORM deverá ser apenas planejada conceitualmente nesta unidade.
4. **Higiene da working tree Git:** Verificou-se com `git status` / `git diff` que 7 arquivos versionados na branch `feature/uc12-06-products-http` receberam apenas uma quebra de linha final em branco no editor, além do arquivo temporário `tsconfig.build.tsbuildinfo`. Na etapa de versionamento (Fase 11), apenas os arquivos efetivamente pertinentes ao Material 08 serão selecionados para commit.

### 7.2 Condições para Prosseguir
- [x] Oito artefatos do Material 07 lidos e verificados.
- [x] Código-fonte real inspecionado e contratos confirmados sem desvios.
- [x] Linha de base dos testes (`4 files`, `10 tests passed`) comprovada empiricamente.
- [x] Ambiente apto para avançar às Fases 4 e 5 (Comparação dos Níveis de Teste e Verificação de Módulos e Providers).

