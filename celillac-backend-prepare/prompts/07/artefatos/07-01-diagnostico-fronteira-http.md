# ARTEFATO 07-01 — DIAGNÓSTICO DA FRONTEIRA HTTP E VERIFICAÇÃO DE PRONTIDÃO (DoR)

## 1. Identificação do Projeto e Caso de Uso

| Elemento | Valor Verificado nos Artefatos e no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue HTTP (Foco Principal)** | [`SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (Issue #9)](https://github.com/evertonfoz/dsc-tests/issues/9) |
| **Responsável Técnico (Assignee)** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel didático na equipe simulada: Carla Mendes Ferreira — `@carlamendes`)* |
| **Revisor Designado da Issue** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel didático na equipe simulada: Diego Costa Almeida — `@diego-almeida`)* |

---

## 2. Mapeamento das Issues Relacionadas e Estado no GitHub Project (#6)

A inspeção direta no repositório [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) e no [GitHub Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6) confirmou a situação atual de todas as Issues do caso de uso:

| Issue | Identificador | Título | Camada / Responsabilidade | Responsável (Papel Simulado) | Revisor (Papel Simulado) | Estado na Issue | Status no Project #6 |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| [#1](https://github.com/evertonfoz/dsc-tests/issues/1) | `EPIC-UC12` | `[UC12] Cadastrar Produto` | Épico / Caso de uso completo | `@evertonfoz` (Carla / Ana Clara) | Equipe | `OPEN` | **`Backlog`** |
| [#4](https://github.com/evertonfoz/dsc-tests/issues/4) | `SUB-01` | `[UC12][Domínio] Modelar entidade Product` | Entidade de domínio `Product` | `@evertonfoz` (Ana Clara Souza) | Bruno Oliveira Santos | `OPEN` | **`Ready`** |
| [#5](https://github.com/evertonfoz/dsc-tests/issues/5) | `SUB-02` | `[UC12][Contratos] Criar DTO de cadastro de produto` | Contrato de entrada (`CreateProductDto`) e saída | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`Ready`** |
| [#6](https://github.com/evertonfoz/dsc-tests/issues/6) | `SUB-03` | `[UC12][Validação] Implementar validações de dados e regras de negócio do produto` | Validações e regras de negócio (`RN01`, `CA02`) | `@evertonfoz` (Bruno Oliveira Santos) | Ana Clara Souza | `OPEN` | **`Ready`** |
| [#7](https://github.com/evertonfoz/dsc-tests/issues/7) | `SUB-04` | `[UC12][Persistência] Configurar persistência e implementar repositório de produtos` | Contrato `ProductsRepository` e persistência | `@evertonfoz` (Bruno Oliveira Santos) | Ana Clara Souza | `OPEN` | **`Ready`** |
| [#8](https://github.com/evertonfoz/dsc-tests/issues/8) | `SUB-05` | `[UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` | `ProductsService.createProduct` | `@evertonfoz` (Ana Clara Souza) | Carla Mendes Ferreira | `OPEN` | **`In Progress`** |
| [#9](https://github.com/evertonfoz/dsc-tests/issues/9) | `SUB-06` | `[UC12][HTTP] Criar endpoint POST /products` | Fronteira HTTP (`ProductsController`, rota `POST /products`) | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`Backlog`** |
| [#10](https://github.com/evertonfoz/dsc-tests/issues/10) | `SUB-07` | `[UC12][Testes] Implementar testes automatizados para o cadastro de produto` | Testes automatizados (unitários e fronteira HTTP) | `@evertonfoz` (Diego Costa Almeida) | Bruno Oliveira Santos | `OPEN` | **`In Progress`** |
| [#11](https://github.com/evertonfoz/dsc-tests/issues/11) | `SUB-08` | `[UC12][Documentação] Atualizar documentação técnica do cadastro de produtos` | Documentação técnica da API | `@evertonfoz` (Diego Costa Almeida) | Carla Mendes Ferreira | `OPEN` | **`Backlog`** |

---

## 3. Código Recuperado, Contratos Existentes e Diagnóstico Estrutural

A verificação do código-fonte real na branch ativa `feature/uc12-05-products-service` (commit `facb3ca`) revelou:

### 3.1 Contratos e Implementações Existentes em `src/modules/products/`

1. **Entidade de Domínio (`src/modules/products/entities/product.entity.ts`):**
   ```typescript
   export class Product {
     constructor(
       public readonly productId: string,
       public readonly name: string,
     ) {}
   }
   ```
   - **Verificação:** Preserva estritamente `productId: string` e `name: string` imutáveis (`readonly`). Não possui `price`.

2. **Contrato de Persistência (`src/modules/products/repositories/products.repository.interface.ts`):**
   ```typescript
   import { Product } from '../entities/product.entity.js';

   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```
   - **Verificação:** Utiliza interface TypeScript `ProductsRepository` com método `save(product: Product): Promise<Product>` e token de injeção `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`.

3. **Serviço de Aplicação GREEN (`src/modules/products/services/products.service.ts`):**
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
   - **Verificação:** Assinatura pública `ProductsService.createProduct(name: string): Promise<Product>`.

### 3.2 Diagnóstico da Infraestrutura HTTP, Módulos e Dependências (`package.json`)

| Componente / Configuração | Situação Atual Verificada no Repositório | Diagnóstico para a Fronteira HTTP (`SUB-06`) |
| :--- | :--- | :--- |
| **`src/main.ts`** | Inicializa `NestFactory.create(AppModule)` na porta `process.env.PORT \|\| 3200`. Não configura `ValidationPipe`. | Necessita configurar `ValidationPipe({ whitelist: true, transform: true })` (global ou na aplicação) para validação automática do DTO na fronteira HTTP. |
| **`src/app.module.ts`** | Importa `ConfigModule`, `TypeOrmModule` e `OrdersModule` (duplicado nas linhas 15 e 29). Não importa `ProductsModule`. | Necessita registrar `ProductsModule` em `imports` (e remover a duplicata de `OrdersModule`, se pertinente). |
| **Módulo `ProductsModule`** | **Inexistente** em `src/modules/products/`. | Necessita ser criado (`src/modules/products/products.module.ts`) compondo `ProductsController`, `ProductsService` e o provider para `PRODUCTS_REPOSITORY`. |
| **Controller `ProductsController`** | **Inexistente** em `src/modules/products/`. | Necessita ser criado (`src/modules/products/controllers/products.controller.ts`) expondo `@Post()` sob `@Controller('products')` e delegando para `this.productsService.createProduct(dto.name)`. |
| **DTO `CreateProductDto`** | **Inexistente** em `src/modules/products/`. | Previsto na `SUB-02` (#5). Necessita ser criado (`src/modules/products/dtos/create-product.dto.ts`) com `@IsString()` e `@IsNotEmpty()` sobre `name!: string`. |
| **Provider de `PRODUCTS_REPOSITORY`** | Existe apenas a interface `ProductsRepository` (sem implementação concreta). | Como a persistência real em banco (`SUB-04`) está fora do escopo desta unidade, é necessário prover uma implementação didática em memória (`InMemoryProductsRepository`) associada ao token `PRODUCTS_REPOSITORY` para permitir a inicialização do módulo e execução de requisições HTTP. |
| **Pacotes `vitest` e `supertest`** | Instalados em `devDependencies`: `vitest` (`^4.1.2`), `supertest` (`^7.0.0`), `@types/supertest` (`^7.0.0`). | Prontos e compatíveis para os testes automatizados da fronteira HTTP. |
| **Pacotes `class-validator` e `class-transformer`** | **NÃO instalados** em `package.json` nem presentes em `node_modules/`. | **Pendência técnica obrigatória:** O `ValidationPipe` do `@nestjs/common` e os decoradores `@IsString()` / `@IsNotEmpty()` exigem a instalação de `class-validator` e `class-transformer` no projeto. |

---

## 4. Situação Atual dos Testes, Branches e Pull Requests

### 4.1 Verificação Empírica dos Testes Existentes
Executou-se a suíte completa no ambiente atual (`pnpm test --run`):
- `src/app.controller.spec.ts`: `1 passed` (122ms)
- `src/modules/products/services/products.service.spec.ts`: `1 passed` (121ms) — Teste unitário de `CA01`
- `src/modules/orders/services/orders.service.spec.ts`: `6 passed` (114ms)
- **Total:** `Test Files 3 passed (3)` / `Tests 8 passed (8)` em `548ms`. O estado GREEN herdado do Material 06 encontra-se **100% preservado**.

### 4.2 Estrutura Atual de Branches e Pull Requests
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 -> main | OPEN]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 -> feature/uc12-07-product-registration-test | OPEN] (HEAD atual)
```
- **Draft PR #12 (`SUB-07`):** Aberto, em modo Draft (`feature/uc12-07-product-registration-test` → `main`).
- **Draft PR #13 (`SUB-05`):** Aberto, em modo Draft (`feature/uc12-05-products-service` → `feature/uc12-07-product-registration-test`).

---

## 5. Verificação da Definition of Ready (DoR) — `SUB-06` (Issue #9)

A Issue [`SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (#9)](https://github.com/evertonfoz/dsc-tests/issues/9) encontra-se em **`Backlog`** no GitHub Project #6. A tabela abaixo avalia cada condição obrigatória da DoR:

| Código | Condição da DoR | Classificação Atual | Evidência Verificada na Issue #9 e no Projeto |
| :--- | :--- | :---: | :--- |
| **DoR-01** | **Objetivo claramente definido** | **Atende** | Seção `1. Objetivo` da Issue #9 define claramente a exposição do endpoint HTTP `POST /products` para solicitar o cadastro de produto e retornar resposta compatível. |
| **DoR-02** | **Escopo delimitado** | **Atende** | Seções `2. Descrição Detalhada` e `4. Escopo e Responsabilidades` delimitam a configuração da rota `POST /products`, binding para DTO, delegação a `ProductsService` e retorno HTTP (`201 Created` no sucesso; `400 Bad Request` na falha de validação de entrada). |
| **DoR-03** | **Critérios de aceite verificáveis** | **Atende** | Seção `5. Critérios de Aceite Verificáveis` lista critérios objetivos e testáveis para registro da rota, sucesso (`201 Created` — `CA01`/`RF05`) e rejeição de entradas sem nome obrigatório (`CA02`/`CA03`/`RF04`/`RF05`). |
| **DoR-04** | **Dependências identificadas** | **Atende** | Seção `6. Dependências` identifica `#5 (SUB-02 — DTO de cadastro)` e `#8 (SUB-05 — Serviço de aplicação)`, além do vínculo com `#1 (EPIC-UC12)`. |
| **DoR-05** | **Informações necessárias disponíveis** | **Atende** | Contratos confirmados: rota `POST /products`, entrada JSON `{ "name": string }`, método `ProductsService.createProduct(name: string): Promise<Product>`, retorno `Product { productId, name }`, status `201 Created` e rejeição HTTP `400 Bad Request` via `ValidationPipe`. |
| **DoR-06** | **Responsável definido** | **Atende** | Assignee `@evertonfoz` (papel simulado: Carla Mendes Ferreira) atribuído na Issue #9; revisor designado Diego Costa Almeida (`@evertonfoz`). |
| **DoR-07** | **Revisão de planejamento concluída** | **Atende (Regularizada)** | Inicialmente pendente (`0 comments` e status `Backlog`); regularizada com o registro formal da revisão de planejamento na [Issue #9 (comentário #6723400094)](https://github.com/evertonfoz/dsc-tests/issues/9#issuecomment-6723400094) e transição do item `PVTI_lAHOAJgJDc4Bp2afzhFacyo` no GitHub Project #6 para `Ready` → `In Progress`. |

### Análise Complementar de Prontidão e Política de WIP
1. **Disponibilidade da Implementação GREEN (`SUB-05`):** O serviço `ProductsService.createProduct(name)` já está implementado e aprovado em GREEN na branch `feature/uc12-05-products-service` (commit `facb3ca`).
2. **Política de WIP:**
   - No GitHub Project #6, existem atualmente **2 itens** em `In Progress`: `SUB-07` (#10, papel: Diego Costa Almeida) e `SUB-05` (#8, papel: Ana Clara Souza).
   - O limite global da equipe em `In Progress` é de **no máximo 3 atividades simultâneas**, e o limite individual é de **1 atividade por papel técnico** ($WIP = 1$).
   - A `SUB-06` (#9) é de responsabilidade do papel **Carla Mendes Ferreira**, que atualmente possui **0 itens** em `In Progress`. Portanto, ao mover `SUB-06` para `In Progress` (ou ao avançar `SUB-05` para `In Review` enquanto `SUB-06` entra em `In Progress`), o teto global de 3 itens e o limite individual $WIP = 1$ por papel são integralmente respeitados.

---

## 6. Refinamento 1 — Coordenação de Responsabilidades entre Sub-Issues

Antes de modificar qualquer arquivo, estabelece-se a diferenciação rigorosa de escopo e a proposta de coordenação entre as Sub-Issues:

| Sub-Issue | Escopo Original | Situação Atual | Proposta de Coordenação e Rastreabilidade |
| :--- | :--- | :--- | :--- |
| **`SUB-02` (Issue #5)**<br>*Criar DTO de cadastro de produto* | Definir `CreateProductDto` (`name: string`) e contrato de saída. | Em `Ready` no Project #6; arquivo `create-product.dto.ts` ainda não criado no repositório. Mesma responsável da `SUB-06` (Carla Mendes Ferreira / `@evertonfoz`). | Criar `src/modules/products/dtos/create-product.dto.ts` de forma coordenada para viabilizar o contrato de entrada de `POST /products`, referenciando explicitamente `refs #5, refs #9` nos registros técnicos, **sem encerrar silenciosamente a Issue #5** (que também prevê a revisão isolada de contratos de saída). |
| **`SUB-03` (Issue #6)**<br>*Validações e regras de negócio* | Validar regras de domínio (`RN01` — `ProductNameRequiredException` na camada de domínio/aplicação). | Em `Ready` no Project #6. `CA02` continua pendente na camada de aplicação/domínio. | Na `SUB-06`, configurar **exclusivamente a validação de fronteira HTTP** (`@IsString()`, `@IsNotEmpty()` no DTO + `ValidationPipe`). **Não alterar `ProductsService.createProduct()`** nem a entidade `Product` nesta etapa. A rejeição HTTP 400 protege a fronteira REST, mas não substitui o futuro ciclo TDD de `CA02` na camada de aplicação/domínio (`SUB-03`/`SUB-05`). |
| **`SUB-05` (Issue #8)**<br>*Serviço de aplicação* | `ProductsService.createProduct(name: string): Promise<Product>` | Em `In Progress` (GREEN para `CA01` no commit `facb3ca`, Draft PR #13). | **Reutilizar integralmente** `ProductsService.createProduct(dto.name)` sem reimplementar ou modificar sua assinatura. |
| **`SUB-06` (Issue #9)**<br>*Endpoint POST /products* | `ProductsController`, rota `POST /products`, composição do `ProductsModule` e `ValidationPipe`. | Em `Backlog` (aguardando registro de `DoR-07` para transitar a `Ready` → `In Progress`). | Implementar `ProductsController`, `ProductsModule`, provider em memória para `PRODUCTS_REPOSITORY` e configuração do `ValidationPipe`. |
| **`SUB-07` (Issue #10)**<br>*Testes automatizados* | Testes unitários e de integração/HTTP para `UC12` (`CA01` a `CA04`). | Em `In Progress` (Draft PR #12 com teste unitário de `CA01`). A própria Issue #9 também exige em suas evidências (item 10) testes HTTP para payloads válidos e inválidos. | Implementar os dois testes automatizados da fronteira HTTP (Vitest + Supertest) em `src/modules/products/controllers/products.controller.spec.ts`, mantendo rastreabilidade conjunta (`refs #9, refs #10`). |

---

## 7. Regularização de Pendências e Condições Atendidas para Prosseguir

Todas as pendências identificadas no diagnóstico inicial foram regularizadas antes da codificação:

1. **Regularização da `DoR-07` da Issue #9 (`SUB-06`) no GitHub (Concluída):**
   - Publicado o comentário formal de revisão de planejamento e verificação da DoR (`DoR-01` a `DoR-07` = `Atende`) na [Issue #9 (`#issuecomment-6723400094`)](https://github.com/evertonfoz/dsc-tests/issues/9#issuecomment-6723400094).
   - Atualizado o status da `SUB-06` (#9) no GitHub Project #6 (`PVT_kwHOAJgJDc4Bp2af`) de `Backlog` para **`In Progress`**.
2. **Aprovação da Proposta de Coordenação entre Sub-Issues (`SUB-02`, `SUB-06`, `SUB-07`) (Concluída):**
   - Confirmada a criação coordenada de `CreateProductDto` (`refs #5, refs #9`) e dos testes HTTP (`refs #9, refs #10`), preservando `ProductsService` intacto.
3. **Instalação das Dependências de Validação HTTP (Concluída):**
   - Instalados os pacotes `class-validator` (`0.15.1`) e `class-transformer` (`0.5.1`) via `pnpm add class-validator class-transformer`.

