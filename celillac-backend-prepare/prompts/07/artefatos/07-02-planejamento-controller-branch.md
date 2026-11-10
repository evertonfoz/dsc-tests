# ARTEFATO 07-02 — PLANEJAMENTO DA BRANCH E DA IMPLEMENTAÇÃO HTTP

## 1. Identificação e Escopo do Planejamento

| Campo | Definição |
| :--- | :--- |
| **Issue Principal** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue Principal desta Unidade** | [`SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (Issue #9)](https://github.com/evertonfoz/dsc-tests/issues/9) |
| **Issues Relacionadas (Coordenadas)** | [`SUB-02` (Issue #5 — DTO)](https://github.com/evertonfoz/dsc-tests/issues/5), [`SUB-05` (Issue #8 — Serviço)](https://github.com/evertonfoz/dsc-tests/issues/8), [`SUB-07` (Issue #10 — Testes)](https://github.com/evertonfoz/dsc-tests/issues/10) |
| **Responsável pela Execução** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Carla Mendes Ferreira)* |
| **Revisor Designado** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Diego Costa Almeida)* |

---

## 2. Verificação de Branches Dependentes (Refinamento 2) e Estratégia Adotada

### 2.1 Diagnóstico das Branches Atuais no Repositório
A inspeção via Git e GitHub CLI comprovou o seguinte estado real das branches e Pull Requests:

1. **`main` (`cb70436`):** Contém apenas a estrutura base do projeto e os módulos `orders` e `payments`. **Não possui** o módulo `products`, nem a entidade `Product`, nem `ProductsRepository`, nem `ProductsService`.
2. **`feature/uc12-07-product-registration-test` (`2724b97` — [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) → `main`):** Introduz os contratos `Product`, `ProductsRepository`, o teste unitário de `CA01` e o stub de `ProductsService.createProduct` na fase RED (lançando `Error: Not implemented: createProduct`).
3. **`feature/uc12-05-products-service` (`facb3ca` — [Draft PR #13](https://github.com/evertonfoz/dsc-tests/pull/13) → `feature/uc12-07-product-registration-test`):** Contém a implementação GREEN de `ProductsService.createProduct(name: string): Promise<Product>` com todos os testes passando (`8 passed`).

### 2.2 Decisão sobre a Branch de Trabalho da `SUB-06`

Criar a branch da `SUB-06` a partir de `main` é **inviável**, pois `ProductsService`, `Product` e `ProductsRepository` ainda não foram integrados à `main` (e realizar merge prematuro dos PRs #12 e #13 apenas para contornar essa dependência violaria as regras de governança do projeto).

Portanto, adota-se a estratégia de **branches dependentes em cadeia (*stacked branches*)**, criando a branch `feature/uc12-06-products-http` diretamente a partir de `feature/uc12-05-products-service` (`facb3ca`):

```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97) [Draft PR #12 — SUB-07]
        └── feature/uc12-05-products-service (facb3ca)    [Draft PR #13 — SUB-05]
              └── feature/uc12-06-products-http           [Novo Draft PR — SUB-06]
```

| Parâmetro de Versionamento | Definição Planejada |
| :--- | :--- |
| **Branch de Trabalho (`head`)** | `feature/uc12-06-products-http` |
| **Branch-Base (`base`)** | `feature/uc12-05-products-service` |
| **Comando de Criação** | `git checkout -b feature/uc12-06-products-http feature/uc12-05-products-service` |
| **Estratégia de Pull Request** | Abrir Pull Request (em Draft / revisão) com origem `feature/uc12-06-products-http` e destino `feature/uc12-05-products-service`. |
| **Vantagem de Rastreabilidade** | O diff do Pull Request da `SUB-06` exibirá **exclusivamente** os commits e arquivos da fronteira HTTP, sem misturar os commits herdados de `SUB-07` (`2724b97`) e `SUB-05` (`facb3ca`). |
| **Estratégia de Futura Consolidação** | Quando o ciclo completo do caso de uso for aprovado e autorizado para integração, os PRs serão integrados da ponta para a base (ou via rebase sequencial após merge da base na `main`), preservando a integridade da `main`. |

---

## 3. Matriz de Planejamento Técnico dos Componentes

| Componente | Responsabilidade | Arquivo Previsto | Contrato / Assinatura | Issue Associada | Alteração Prevista | Dependências | Critério de Aceite | Verificação Necessária |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **Dependências de Validação** | Prover decoradores de metadados e transformação para o `ValidationPipe` | `package.json` e `pnpm-lock.yaml` | `class-validator` e `class-transformer` | `SUB-02` (#5) / `SUB-06` (#9) | Adição de `class-validator` e `class-transformer` em `dependencies` | Node.js / pnpm | Suporte ao `ValidationPipe` | Instalação sem erros e compilação TypeScript |
| **`CreateProductDto`** | Representar e validar o payload de entrada HTTP na criação de produto | `src/modules/products/dtos/create-product.dto.ts` | `class CreateProductDto { @IsString() @IsNotEmpty() name!: string; }` | `SUB-02` (#5) / `SUB-06` (#9) | Criação da classe DTO com decoradores `class-validator` | `class-validator` | `CA01` (entrada válida) e rejeição HTTP de nome vazio | Teste HTTP com nome válido (`201`) e nome vazio (`400`) |
| **`ProductsController`** | Receber `POST /products`, extrair `@Body() dto: CreateProductDto` e delegar ao `ProductsService` | `src/modules/products/controllers/products.controller.ts` | `@Controller('products')` / `@Post() async create(@Body() dto: CreateProductDto): Promise<Product>` | `SUB-06` (#9) | Criação do Controller chamando `this.productsService.createProduct(dto.name)` | `ProductsService`, `CreateProductDto` | `CA01` / `RF01` / `RF05` | Verificar delegação exata a `createProduct(dto.name)` e retorno `201 Created` |
| **`InMemoryProductsRepository`** | Implementação didática em memória do contrato `ProductsRepository` para viabilizar a execução HTTP sem antecipar banco real | `src/modules/products/repositories/in-memory-products.repository.ts` | `class InMemoryProductsRepository implements ProductsRepository { save(product: Product): Promise<Product> }` | `SUB-06` (#9) | Criação de repositório em memória implementando `ProductsRepository` | `Product`, `ProductsRepository` | Inicialização do módulo e execução de `POST /products` | Inicialização da aplicação NestJS e requisição HTTP real |
| **`ProductsModule`** | Compor `ProductsController`, `ProductsService` e o provider do token `PRODUCTS_REPOSITORY` | `src/modules/products/products.module.ts` | `@Module({ controllers: [ProductsController], providers: [ProductsService, { provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }], exports: [ProductsService] })` | `SUB-06` (#9) | Criação do módulo NestJS de produtos | `ProductsController`, `ProductsService`, `PRODUCTS_REPOSITORY`, `InMemoryProductsRepository` | Resolução da árvore de injeção de dependências do NestJS | Subida da aplicação sem `UnknownDependenciesException` |
| **`AppModule`** | Registrar `ProductsModule` na raiz da aplicação | `src/app.module.ts` | Inclusão de `ProductsModule` em `imports` | `SUB-06` (#9) | Importação de `ProductsModule` (e limpeza da entrada duplicada de `OrdersModule`) | `ProductsModule` | Rota `/products` ativa na aplicação | Inicialização de `main.ts` mapeando `POST /products` |
| **`ValidationPipe` (`main.ts`)** | Validar payloads HTTP recebidos contra os metadados dos DTOs | `src/main.ts` | `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` | `SUB-06` (#9) | Registro global do `ValidationPipe` no bootstrap da aplicação | `@nestjs/common`, `class-validator`, `class-transformer` | Rejeição automática (`400 Bad Request`) de payloads inválidos na fronteira HTTP | Requisição `POST /products` com `{"name": ""}` retornando `400` |
| **Testes Automatizados HTTP** | Testar a fronteira HTTP para requisição válida (`201`) e inválida (`400`) com serviço simulado | `src/modules/products/controllers/products.controller.spec.ts` | Cenário 1: válido (`201` + `toHaveBeenCalledWith('Celular XYZ')`); Cenário 2: nome vazio (`400` + `not.toHaveBeenCalled()`) | `SUB-06` (#9) / `SUB-07` (#10) | Criação da suíte de testes HTTP usando `@nestjs/testing`, `ValidationPipe`, `Vitest` (`vi.fn()`) e `Supertest` | `Vitest`, `Supertest`, `@nestjs/testing` | `CA01`, `CA04` e proteção da fronteira HTTP | Execução de `pnpm test --run` com 100% de aprovação |

---

## 4. Contratos Preservados (Restrições Inegociáveis)

1. **Entidade `Product`:** Mantida inalterada com `constructor(public readonly productId: string, public readonly name: string)`. Nenhum campo `price` ou substituição de `productId` por `id` será introduzido.
2. **Repositório `ProductsRepository`:** Mantida a interface `ProductsRepository` com `save(product: Product): Promise<Product>` e o token `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`.
3. **Serviço `ProductsService`:** Mantido inalterado com `createProduct(name: string): Promise<Product>`. O Controller invocará `this.productsService.createProduct(dto.name)` (e **não** `create(dto)`).
4. **Distinção entre Validação HTTP e Regra de Negócio (`CA02`):** A validação `@IsNotEmpty()` no `CreateProductDto` protege a fronteira HTTP (retornando `400 Bad Request` antes de chegar ao serviço), mas o método `ProductsService.createProduct(name)` permanece sem validação interna até que o ciclo TDD específico de `CA02` seja realizado na camada de aplicação/domínio.

---

## 5. Riscos Identificados e Mitigação

| Risco | Impacto | Mitigação Planejada |
| :--- | :--- | :--- |
| **Ausência de `class-validator` e `class-transformer` no `package.json`** | Falha de compilação ou erro em tempo de execução ao instanciar `ValidationPipe`. | Instalar `class-validator` e `class-transformer` via `pnpm` antes de codificar o DTO e o `ValidationPipe`. |
| **Conexão com PostgreSQL na inicialização de `AppModule` (`main.ts`)** | `AppModule` utiliza `TypeOrmModule.forRootAsync` para conectar ao PostgreSQL (`DB_HOST`, `DB_PORT`, etc.). Se o container do banco não estiver ativo ao subir a aplicação completa, `pnpm start` pode falhar na conexão TypeORM. | Verificar a disponibilidade do PostgreSQL local antes de subir `main.ts` para as requisições HTTP reais; nos testes automatizados da fronteira HTTP (`products.controller.spec.ts`), utilizar `Test.createTestingModule` isolando `ProductsController` e o mock de `ProductsService`. |
| **Mistura de commits com branches anteriores** | Dificuldade de revisar apenas o código da `SUB-06`. | Apontar a branch-base do novo PR para `feature/uc12-05-products-service`, mantendo o diff restrito às alterações da fronteira HTTP. |

---

## 6. Decisões e Pendências para Início da Execução

- **Decisões Técnicas Definidas:**
  1. Derivar `feature/uc12-06-products-http` a partir de `feature/uc12-05-products-service`.
  2. Coordenar a criação de `CreateProductDto` (`SUB-02` #5) e dos testes HTTP (`SUB-07` #10) junto à `SUB-06` (#9), mantendo rastreabilidade explícita e sem fechar prematuramente nenhuma Issue.
  3. Utilizar `InMemoryProductsRepository` apenas como provider didático para resolução de `PRODUCTS_REPOSITORY` no `ProductsModule`, sem antecipar a persistência real (`SUB-04` #7).
- **Pendências Imediatas (Aguardando Confirmação para Execução):**
  1. Regularizar `DoR-07` na Issue #9 (`SUB-06`) no GitHub e atualizar o GitHub Project #6.
  2. Instalar `class-validator` e `class-transformer`.
  3. Criar a branch `feature/uc12-06-products-http` e iniciar a Fase 5 (Controller) e Fase 6 (DTO).

