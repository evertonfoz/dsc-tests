# ARTEFATO 09-01 — DIAGNÓSTICO DA ARQUITETURA, PRONTIDÃO DA SUB-04 E LINHA DE BASE

## 1. Identificação do Projeto e Caso de Uso

| Elemento | Valor Verificado nos Artefatos (Material 08) e no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celillac-backend-prepare`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue da Atividade Atual** | [`SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` (Issue #7)](https://github.com/evertonfoz/dsc-tests/issues/7) |
| **Responsável Técnico (Assignee)** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Bruno Oliveira Santos)* |
| **Revisor Designado da Issue** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Ana Clara Souza)* |
| **Oito Artefatos do Material 08 Recuperados** | `prompts/08/artefatos/08-01-diagnostico-arquitetura.md` a `08-08-versionamento-checklist.md` (lidos e verificados integralmente) |

---

## 2. Contratos Existentes e Preservados

A inspeção direta dos arquivos em `src/modules/products/` na branch ativa `feature/uc12-06-products-http` (`ee76412`) confirmou todos os contratos que deverão permanecer inalterados durante a substituição da infraestrutura em memória pelo PostgreSQL + TypeORM:

### 2.1 Entidade de Domínio — `Product` (`src/modules/products/entities/product.entity.ts`)
```typescript
export class Product {
  constructor(
    public readonly productId: string,
    public readonly name: string,
  ) {}
}
```
- **Invariante Arquitetural:** Classe de domínio pura, sem decoradores do TypeORM (`@Entity`, `@Column`), mantendo exclusivamente `productId: string` e `name: string` (sem `price`, `description`, `partnerId`, `status` ou substituição de `productId` por `id`).

### 2.2 Contrato de Persistência — `ProductsRepository` (`src/modules/products/repositories/products.repository.interface.ts`)
```typescript
import { Product } from '../entities/product.entity.js';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```
- **Invariante Arquitetural:** Token de injeção `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'` e método `save(product: Product): Promise<Product>` operando exclusivamente com a entidade de domínio `Product`.

### 2.3 Serviço de Aplicação — `ProductsService` (`src/modules/products/services/products.service.ts`)
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
- **Invariante Arquitetural:** Gera `productId` via `randomUUID()` (`node:crypto`), mantém a assinatura `createProduct(name: string): Promise<Product>` e depende unicamente da abstração `ProductsRepository`.

### 2.4 Controller HTTP — `ProductsController` (`src/modules/products/controllers/products.controller.ts`)
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

### 2.5 DTO de Entrada — `CreateProductDto` (`src/modules/products/dtos/create-product.dto.ts`)
```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
```

### 2.6 Implementação Atual em Memória — `InMemoryProductsRepository` (`src/modules/products/repositories/in-memory-products.repository.ts`)
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
- **Papel no Material 09:** Deixará de ser o provider padrão do `ProductsModule` (substituído por `TypeOrmProductsRepository`), mas continuará disponível no código para testes integrados rápidos em memória sem dependência de banco de dados.

---

## 3. Arquitetura Atual e Módulos NestJS

### 3.1 Estrutura Atual do Backend (`src/`)
```text
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── common/
│   ├── enums/ (order-status.enum.ts, payment-status.enum.ts)
│   ├── exceptions/ (exceções de domínio de orders/payments)
│   └── filters/ (domain-http-exception.filter.ts)
├── database/
│   ├── data-source.ts
│   └── migrations/
│       ├── 1791738728692-CreateOrdersAndPayments.ts
│       ├── 1791814820800-AddDomainFieldsToOrdersAndPayments.ts
│       ├── 1791814929531-UseDatabaseTimestamps.ts
│       └── 1791815040413-AddUpdatedAtTriggers.ts
├── infrastructure/
│   └── persistence/
│       ├── orders/ (order.orm-entity.ts, order.mapper.ts, typeorm-orders.repository.ts)
│       └── payments/ (payment.orm-entity.ts, payment.mapper.ts, typeorm-payments.repository.ts)
├── modules/
│   ├── orders/ (controllers, dtos, entities, repositories, services, orders.module.ts)
│   ├── payments/ (entities, repositories)
│   └── products/
│       ├── controllers/ (products.controller.ts, products.controller.spec.ts)
│       ├── dtos/ (create-product.dto.ts)
│       ├── entities/ (product.entity.ts)
│       ├── repositories/ (products.repository.interface.ts, in-memory-products.repository.ts)
│       ├── services/ (products.service.ts, products.service.spec.ts)
│       ├── products.integration.spec.ts
│       └── products.module.ts
└── scripts/ (seed-test-scenarios.ts, verify-persistence.ts)
```

### 3.2 Módulos NestJS Verificados
1. **`AppModule` (`src/app.module.ts`):**
   - Importa `ConfigModule.forRoot({ isGlobal: true })`, `OrdersModule`, `ProductsModule` e `TypeOrmModule.forRootAsync(...)`.
   - Registra `AppController`, `AppService` e o filtro global `DomainHttpExceptionFilter`.
2. **`OrdersModule` (`src/modules/orders/orders.module.ts`):**
   - Importa `TypeOrmModule.forFeature([OrderEntity, PaymentEntity])` e registra `TypeOrmOrdersRepository` e `TypeOrmPaymentsRepository`.
3. **`ProductsModule` (`src/modules/products/products.module.ts`):**
   - Atualmente registra `controllers: [ProductsController]`, `providers: [ProductsService, { provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }]` e `exports: [ProductsService]`.

---

## 4. Inspeção da Infraestrutura Existente (PostgreSQL, Docker, TypeORM, Scripts)

| Item Inspecionado | Configuração / Estado Real Encontrado | Diagnóstico Técnico |
| :--- | :--- | :--- |
| **5. Configuração PostgreSQL (`.env` e `.env.example`)** | `.env` define as chaves `DB_HOST=127.0.0.1`, `DB_PORT=5432`, `DB_USERNAME=celilac_user`, `DB_PASSWORD=[PROTEGIDO]`, `DB_NAME=celilac_db`. Não há ainda variáveis `TEST_DB_*` definidas no `.env` nem no `.env.example`. | Necessário definir as variáveis `TEST_DB_*` de forma isolada, sem sobrescrever as credenciais atuais de desenvolvimento. |
| **6. Configuração Docker (`compose.yaml` e contêineres ativos)** | `compose.yaml` define o serviço `postgres` (`postgres:17`, `container_name: celilac-postgres`, porta `5432:5432`, banco `celilac_db`, usuário `celilac_user`, volume `celilac_postgres_data`, healthcheck com `pg_isready`).<br>**Inspeção `docker ps -a`:**<br>• `celilac-postgres` (`544f5f92d334`) está **ativo e saudável (`Up 13 days (healthy)`)** na porta `5432:5432`, montando o volume `celilac-backend_celilac_postgres_data`.<br>• **ALERTA CRÍTICO DE PORTA:** A porta **`5434`** no host está atualmente **ocupada** pelo contêiner `classhero-postgres` (`cb1743af87f2`, `0.0.0.0:5434->5432/tcp`) de outro projeto! | 1. O contêiner `celilac-postgres` na porta `5432` deve ser preservado intacto.<br>2. **Não se deve conectar testes na porta `5434` enquanto `classhero-postgres` estiver nela**, nem tentar publicar um novo serviço na porta `5434` sem ajuste, sob risco de colisão de porta ou acesso acidental a banco de outro sistema. Para o banco de testes exclusivo, deve-se utilizar uma porta livre no host (ex.: `5435:5432` para um serviço `postgres-test`) ou banco isolado dedicado. |
| **7. Configuração TypeORM (`AppModule` e `package.json`)** | Dependências já instaladas em `package.json`: `@nestjs/typeorm` (`^12.0.2`), `typeorm` (`^1.1.2`), `pg` (`^8.23.1`), `@nestjs/config` (`^12.0.1`), `dotenv` (`^18.0.7`).<br>`AppModule` configura `TypeOrmModule.forRootAsync` com `autoLoadEntities: true` e `synchronize: false`. | Nenhuma dependência NPM precisa ser reinstalada. `AppModule` já está configurado corretamente com `autoLoadEntities: true` e `synchronize: false`. |
| **8. DataSource CLI (`src/database/data-source.ts`)** | Carrega `dotenv/config`, aponta para `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, lista `entities: [OrderEntity, PaymentEntity]`, `migrations: ['src/database/migrations/*.ts']` e `synchronize: false`. | Deverá incluir `ProductOrmEntity` no array `entities`. |
| **9. Migrations Existentes e Estado do Banco `celilac_db`** | Diretório `src/database/migrations/` possui 4 migrations de `orders`/`payments` (`1791738728692`, `1791814820800`, `1791814929531`, `1791815040413`).<br>**Inspeção SQL real em `celilac_db`:**<br>• Tabela `public.migrations` contém `1 | 1792519198708 | CreateOrders1792519198708`.<br>• Tabela `orders.orders` já existe (1 registro) com `createdAt`, `updatedAt`, `deletedAt`, e `public.infraestrutura_check` possui 1 registro.<br>• `pnpm typeorm migration:show` lista as 4 migrations de `src/database/migrations/` como `[ ]` (não registradas em `public.migrations`).<br>• **Não existe** o schema `products` nem a tabela `products.products` em `celilac_db`. | **Risco Crítico Identificado:** Executar `pnpm typeorm migration:run` diretamente sobre `celilac_db` sem tratamento tentaria rodar `CreateOrdersAndPayments1791738728692`, que falharia com erro `type "orders.orders_status_enum" already exists` porque `orders.orders` já foi criada no banco por `CreateOrders1792519198708`. Esse conflito histórico deve ser tratado com segurança antes de aplicar a migration de `products.products`. |
| **11. Testes Existentes e Configuração Vitest** | `vitest.config.ts` inclui `**/*.spec.ts`. `vitest.config.e2e.ts` inclui `**/*.e2e-spec.ts`.<br>Existem 5 arquivos `.spec.ts` totalizando 12 testes. Ainda não existe `vitest.integration.config.ts` nem script `test:integration`. | Preservar `vitest.config.ts` para a suíte rápida (unitários + integrados em memória) e criar configuração dedicada (`vitest.integration.config.ts` / `test:integration`) para os testes com PostgreSQL real. |
| **12. Scripts do `package.json`** | `build`, `format`, `start`, `start:dev`, `start:debug`, `start:prod`, `lint`, `test` (`vitest run`), `test:watch`, `test:cov`, `test:debug`, `test:e2e`, `typeorm` (`typeorm-ts-node-esm -d src/database/data-source.ts`), `verify:persistence`, `seed:scenarios`. | Preservar scripts existentes e adicionar `test:integration` quando os testes PostgreSQL forem configurados na Fase 9. |

---

## 5. Mapeamento das Issues, Prontidão (DoR) da `SUB-04` e Política de WIP

### 5.1 Situação Atual das Issues no GitHub e no GitHub Project (#6)

Verificado em tempo real via `gh issue list --repo evertonfoz/dsc-tests` e `gh project item-list 6 --owner evertonfoz`:

| Issue | Identificador | Responsabilidade | Assignee Real (Papel Simulado) | Revisor (Papel Simulado) | Estado na Issue | Status no Project #6 |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| [#1](https://github.com/evertonfoz/dsc-tests/issues/1) | `EPIC-UC12` | Caso de uso completo (`[UC12] Cadastrar Produto`) | `@evertonfoz` (Coordenação) | Equipe | `OPEN` | **`Backlog`** |
| [#4](https://github.com/evertonfoz/dsc-tests/issues/4) | `SUB-01` | Entidade de domínio `Product` | `@evertonfoz` (Ana Clara Souza) | Bruno Oliveira Santos | `OPEN` | **`Ready`** |
| [#5](https://github.com/evertonfoz/dsc-tests/issues/5) | `SUB-02` | DTO de cadastro (`CreateProductDto`) | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`Ready`** |
| [#6](https://github.com/evertonfoz/dsc-tests/issues/6) | `SUB-03` | Validações e regras de negócio (`RN01`, `CA02`) | `@evertonfoz` (Bruno Oliveira Santos) | Ana Clara Souza | `OPEN` | **`Ready`** |
| [#7](https://github.com/evertonfoz/dsc-tests/issues/7) | **`SUB-04`** | **Persistência e repositório de produtos** | **`@evertonfoz` (Bruno Oliveira Santos)** | **Ana Clara Souza** | **`OPEN`** | **`Ready`** |
| [#8](https://github.com/evertonfoz/dsc-tests/issues/8) | `SUB-05` | Serviço de aplicação (`ProductsService.createProduct`) | `@evertonfoz` (Ana Clara Souza) | Carla Mendes Ferreira | `OPEN` | **`In Progress`** |
| [#9](https://github.com/evertonfoz/dsc-tests/issues/9) | `SUB-06` | Endpoint HTTP (`POST /products`) | `@evertonfoz` (Carla Mendes Ferreira) | Diego Costa Almeida | `OPEN` | **`In Progress`** |
| [#10](https://github.com/evertonfoz/dsc-tests/issues/10) | `SUB-07` | Testes automatizados | `@evertonfoz` (Diego Costa Almeida) | Bruno Oliveira Santos | `OPEN` | **`In Progress`** |
| [#11](https://github.com/evertonfoz/dsc-tests/issues/11) | `SUB-08` | Documentação técnica | `@evertonfoz` (Diego Costa Almeida) | Carla Mendes Ferreira | `OPEN` | **`Backlog`** |

### 5.2 Verificação da Definition of Ready (DoR) — `SUB-04` (Issue #7)

A inspeção de `gh issue view 7 --repo evertonfoz/dsc-tests --comments` comprova:

| Critério da DoR | Avaliação | Evidência Verificada na Issue #7 e no Repositório |
| :--- | :---: | :--- |
| **1. Objetivo definido (`DoR-01`)** | **Atende** | Seção 1 da Issue #7: *"Configurar o mecanismo de persistência de dados para a entidade `Product` e implementar o repositório responsável pelo armazenamento de produtos cadastrados."* |
| **2. Escopo delimitado (`DoR-02`)** | **Atende** | Seções 2 e 4 da Issue #7 delimitam contrato `ProductsRepository`, mapeamento TypeORM/PostgreSQL e implementação de `save(product: Product): Promise<Product>`, excluindo interface HTTP. |
| **3. Critérios de aceite verificáveis (`DoR-03`)** | **Atende** | Seção 5 da Issue #7 define 4 itens de checklist verificáveis (persistência configurada, método `save(product: Product): Promise<Product>`, gravação com sucesso `RF03`, propagação tratável de falhas `FE01`). |
| **4. Dependências identificadas (`DoR-04`)** | **Atende** | Seção 6 da Issue #7 identifica a dependência de `#4 (SUB-01 — Entidade Product)` e vínculo com `#1 (EPIC-UC12)`. A entidade `Product(productId, name)` e a interface `ProductsRepository` já existem no código. |
| **5. Informações disponíveis (`DoR-05`)** | **Atende** | Contratos `Product(productId: string, name: string)`, `ProductsRepository.save(product: Product): Promise<Product>`, `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'` e mapeamento técnico (`products.products` no schema `products`, `productId` UUID PK, `name` `varchar(120)` `NOT NULL`) disponíveis e confirmados. |
| **6. Responsável atribuído (`DoR-06`)** | **Atende** | Assignee `@evertonfoz` (papel simulado: Bruno Oliveira Santos) e revisor designado Ana Clara Souza (`@evertonfoz`). |
| **7. Revisão de planejamento concluída (`DoR-07`)** | **Atende (Regularizada)** | Formalizada e aprovada na Issue #7 por meio do comentário [`#issuecomment-6750384276`](https://github.com/evertonfoz/dsc-tests/issues/7#issuecomment-6750384276), viabilizando a transição para `In Progress`. |

### 5.3 Análise da Política de WIP e Regularização Realizada

1. **Regras de WIP estabelecidas no Material 03 (`03-05-politica-wip.md`):**
   - **Limite Individual:** Máximo de **1 atividade em `In Progress` por integrante/papel simulado** ($WIP = 1$).
   - **Limite Global da Equipe:** Máximo de **3 atividades simultâneas na coluna `In Progress`**.
   - **Limite da Coluna `In Review`:** Máximo de **2 atividades simultâneas na coluna `In Review`**.
2. **Diagnóstico Inicial e Regularização Autorizada:**
   - **No nível individual (Bruno Oliveira Santos):** Bruno possuía **0 itens** em `In Progress` (`SUB-03` #6 e `SUB-04` #7 em `Ready`).
   - **No nível global da equipe (`In Progress`):** Havia inicialmente **3 Issues em `In Progress`** (`SUB-05` #8, `SUB-06` #9 e `SUB-07` #10).
   - **Regularização Executada no GitHub Project #6:**
     - Como a `SUB-06` (Issue #9 — Endpoint `POST /products`, Carla Mendes Ferreira) já teve sua implementação HTTP, DTO, `ValidationPipe` e testes HTTP/integrados em memória concluídos e publicados no Draft PR #14, ela foi movida legitimamente de `In Progress` para **`In Review`** (item `PVTI_lAHOAJgJDc4Bp2afzhFacyo`, ocupando `1/2` da coluna `In Review`).
     - Após o registro de `DoR-07` ([`#issuecomment-6750384276`](https://github.com/evertonfoz/dsc-tests/issues/7#issuecomment-6750384276)), a **`SUB-04` (Issue #7 — Bruno Oliveira Santos)** foi movida de `Ready` para **`In Progress`** (item `PVTI_lAHOAJgJDc4Bp2afzhFact8`), mantendo rigorosamente **`WIP global = 3`** (`#7`, `#8`, `#10`) e **`WIP individual = 1`** por papel técnico.

---

## 6. Recuperação da Linha de Base dos Testes

Antes de qualquer alteração no código ou na infraestrutura, foi executado o comando oficial da suíte de testes na branch atual.

### 6.1 Registro da Execução Real
- **Branch ativa:** `feature/uc12-06-products-http` (commit `ee76412bb719958f8a07ff40eb4c9b48eb109714`)
- **Comando executado:** `pnpm test --run`
- **Saída real observada:**
  ```text
  $ vitest run --run

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/modules/products/services/products.service.spec.ts (1 test) 73ms
   ✓ src/app.controller.spec.ts (1 test) 76ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 66ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 59ms
   ✓ src/modules/products/products.integration.spec.ts (2 tests) 56ms

   Test Files  5 passed (5)
        Tests  12 passed (12)
     Start at  16:58:21
     Duration  498ms (transform 131ms, setup 0ms, import 1.37s, tests 331ms, environment 0ms)
  ```

### 6.2 Síntese da Linha de Base

| Métrica | Resultado Confirmado |
| :--- | :--- |
| **Branch** | `feature/uc12-06-products-http` (`ee76412`) |
| **Comando** | `pnpm test --run` |
| **Arquivos de teste (`Test Files`)** | `5 passed (5)` (`app.controller.spec.ts`, `orders.service.spec.ts`, `products.service.spec.ts`, `products.controller.spec.ts`, `products.integration.spec.ts`) |
| **Testes executados (`Tests`)** | `12` (`1` em `AppController`, `6` em `OrdersService`, `1` unitário em `ProductsService`, `2` HTTP simulados em `ProductsController`, `2` integrados em memória em `products.integration.spec.ts`) |
| **Aprovações** | `12 passed (12)` |
| **Falhas** | `0` |
| **Diagnóstico** | Linha de base **100% GREEN**, confirmando integralmente os 12 testes aprovados em 5 arquivos registrados ao final do Material 08. |

---

## 7. Situação das Branches, Working Tree e Pull Requests

### 7.1 Topologia de Branches e PRs Verificada
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 — SUB-07 | OPEN]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 — SUB-05 | OPEN]
              └── feature/uc12-06-products-http (ee76412) [Draft PR #14 — SUB-06 / SUB-07 | OPEN]
                    └── feature/uc12-04-products-persistence (ee76412) [Branch da SUB-04 — HEAD atual]
```
- **Branch da `SUB-04`:** Criada (`git checkout -b feature/uc12-04-products-persistence feature/uc12-06-products-http`), preservando todos os componentes existentes do módulo `products` sem realizar merge prematuro na `main`.
- **Higiene da Working Tree (`git status` / `git diff`):** Existem pequenas modificações não adicionadas ao stage herdadas da sessão anterior (apenas 1 linha em branco no final de 6 arquivos em `src/modules/products/`, 2 arquivos `.http` e `tsconfig.build.tsbuildinfo`). Nenhum contrato foi alterado.

---

## 8. Riscos, Pendências e Condições para Prosseguir

### 8.1 Riscos Técnicos Identificados
1. **Colisão na porta `5434` do host:** O contêiner `classhero-postgres` ocupa atualmente `0.0.0.0:5434->5432/tcp`. Utilizar `5434` para o banco de testes do CeliLac causaria erro de bind ou conexão acidental em banco de outro projeto. Solução aprovada: utilizar porta **`5435:5432`** (`TEST_DB_PORT=5435`) para o serviço exclusivo `postgres_test`.
2. **Divergência no histórico de migrations do banco de desenvolvimento (`celilac_db`):** O banco ativo no contêiner `celilac-postgres` (porta `5432`) possui a tabela `orders.orders` criada pela migration `CreateOrders1792519198708`, enquanto `src/database/migrations/` contém 4 migrations com timestamps `1791738728692` a `1791815040413` não registradas em `public.migrations`. Solução aprovada: sincronizar o histórico das migrations anteriores e aplicar a nova migration `CreateProductsTable` de forma segura, preservando os dados existentes.
3. **Impacto da troca de provider nos testes integrados em memória (`products.integration.spec.ts`):** Quando `ProductsModule` passar a importar `TypeOrmModule.forFeature([ProductOrmEntity])` e prover `TypeOrmProductsRepository` para `PRODUCTS_REPOSITORY`, o teste em memória deverá preservar seu isolamento sem depender de conexão PostgreSQL.

### 8.2 Condições Atendidas para Prosseguir
- [x] Oito artefatos do Material 08 recuperados e analisados.
- [x] Contratos existentes verificados no código-fonte.
- [x] Linha de base dos testes (`5 passed files`, `12 passed tests`) comprovada.
- [x] Infraestrutura Docker, PostgreSQL e TypeORM inspecionada sem alterações destrutivas.
- [x] **Decisão 1 (Governança WIP / DoR da `SUB-04` #7):** Comentário `DoR-07` registrado na Issue #7 (`#issuecomment-6750384276`), `SUB-06` (#9) movida para `In Review` e `SUB-04` (#7) movida para `In Progress` (`WIP global = 3`, `WIP individual = 1`).
- [x] **Decisão 2 (Isolamento do Banco de Testes — Fase 3):** Aprovada a criação do serviço exclusivo `postgres_test` mapeado na porta livre `5435:5432` (`TEST_DB_PORT=5435`).
- [x] **Decisão 3 (Migrations e Limpeza Segura — Fases 4, 5 e 9):** Aprovada a sincronização segura do histórico de migrations em `celilac_db` e o uso autorizado de `TRUNCATE` exclusivamente no banco isolado de testes (`celilac_test`).
