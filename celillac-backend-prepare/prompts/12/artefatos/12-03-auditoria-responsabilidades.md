# ARTEFATO 12-03 — AUDITORIA DE RESPONSABILIDADES E QUALIDADE ARQUITETURAL

## 1. Matriz de Auditoria de Componentes

A tabela a seguir confronta a responsabilidade esperada de cada componente do fluxo `UC12 — Cadastrar Produto` com o comportamento efetivamente verificado no código-fonte:

| Componente | Arquivo Verificado | Responsabilidade Esperada | Responsabilidade Observada no Código | Evidência Concreta | Avaliação |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ProductsController`** | `src/modules/products/controllers/products.controller.ts` | Receber e responder requisições HTTP | Recebe `CreateProductDto`, delega a `productsService.createProduct(dto.name)` e retorna `toProductResponse(product)` | Linhas 9–19: `@Post() async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto>` | **Adequado** |
| **`CreateProductDto`** | `src/modules/products/dtos/create-product.dto.ts` | Representar e validar dados de entrada HTTP | Declara `name!: string` com `@IsString()` e `@IsNotEmpty()` | Linhas 1–7: decoradores `class-validator` aplicados exclusivamente a `name` | **Adequado** |
| **`ProductResponseDto`** | `src/modules/products/mappers/product-response.mapper.ts` | Definir o contrato público de saída HTTP | Interface exportada com `productId: string` e `name: string` | Linhas 3–6: `export interface ProductResponseDto { productId: string; name: string; }` | **Adequado** |
| **Mapper HTTP (`toProductResponse`)** | `src/modules/products/mappers/product-response.mapper.ts` | Transformar `Product` em resposta pública | Cria literal de objeto contendo apenas `productId` e `name`, sem lógica de negócio | Linhas 8–13: `return { productId: product.productId, name: product.name };` | **Adequado** |
| **`ProductsService`** | `src/modules/products/services/products.service.ts` | Coordenar o caso de uso de cadastro | Gera UUID (`randomUUID()`), instancia `Product` e chama `productsRepository.save(product)` | Linhas 16–19: `const product = new Product(randomUUID(), name); return this.productsRepository.save(product);` | **Adequado** |
| **`Product`** | `src/modules/products/entities/product.entity.ts` | Representar a entidade de domínio | Classe pura com `readonly productId: string` e `readonly name: string` | Linhas 1–6: sem imports de NestJS, TypeORM ou `class-validator` | **Adequado** |
| **`ProductsRepository`** | `src/modules/products/repositories/products.repository.interface.ts` | Definir o contrato abstrato de persistência | Declara token `PRODUCTS_REPOSITORY` e interface `save(product: Product): Promise<Product>` | Linhas 1–7: importa apenas `Product`; zero tipos do TypeORM expostos | **Adequado** |
| **`TypeOrmProductsRepository`** | `src/infrastructure/persistence/products/typeorm-products.repository.ts` | Implementar a persistência relacional via TypeORM | Implementa `ProductsRepository`, usa `ProductMapper` e delega a `Repository<ProductOrmEntity>` | Linhas 10–21: `toPersistence(product)` → `ormRepository.save(entity)` → `toDomain(savedEntity)` | **Adequado** |
| **`InMemoryProductsRepository`** | `src/modules/products/repositories/in-memory-products.repository.ts` | Implementar persistência em memória para testes integrados | Implementa `ProductsRepository` armazenando instâncias de `Product` em array local | Linhas 6–13: `this.products.push(product); return product;` | **Adequado** |
| **`ProductMapper`** | `src/infrastructure/persistence/products/product.mapper.ts` | Adaptar modelos entre domínio e persistência | Métodos estáticos `toPersistence(product): ProductOrmEntity` e `toDomain(entity): Product` | Linhas 4–17: conversão explícita e isolada na infraestrutura | **Adequado** |
| **`ProductOrmEntity`** | `src/infrastructure/persistence/products/product.orm-entity.ts` | Mapear o esquema relacional do banco | Mapeia `@Entity({ name: 'products', schema: 'products' })` com colunas `productId` (`uuid`) e `name` (`varchar(120)`) | Linhas 3–17: alinhado à migration `1794255600000-CreateProductsTable.ts` | **Adequado** |
| **`ProductsModule`** | `src/modules/products/products.module.ts` | Compor dependências do módulo | Registra `TypeOrmModule.forFeature([ProductOrmEntity])`, `ProductsController`, `ProductsService` e o vínculo `PRODUCTS_REPOSITORY -> TypeOrmProductsRepository` | Linhas 9–21: composição completa e explícita | **Adequado** |

---

## 2. Avaliação segundo os Oito Critérios de Qualidade Arquitetural

### Critério 1 — Separação de Responsabilidades
- **Observação:** Cada camada exerce exclusivamente seu papel arquitetural: HTTP (`ProductsController`, `CreateProductDto`, `toProductResponse`), Aplicação (`ProductsService`), Domínio (`Product`, `ProductsRepository`) e Infraestrutura (`TypeOrmProductsRepository`, `ProductMapper`, `ProductOrmEntity`).
- **Evidência:** `ProductsController` não instancia `Product` nem chama `Repository<ProductOrmEntity>`; `ProductsService` não manipula objetos HTTP (`Request`/`Response`/`CreateProductDto`) nem entidades ORM (`ProductOrmEntity`).
- **Conclusão:** O critério foi examinado e não revelou inadequação no escopo verificado.

### Critério 2 — Acoplamento
- **Observação:** O acoplamento entre aplicação e infraestrutura é mediado pela interface `ProductsRepository` e pelo token `PRODUCTS_REPOSITORY`.
- **Evidência:** Em `src/modules/products/services/products.service.ts` (linhas 1–8), as únicas dependências são `node:crypto`, `@nestjs/common`, `Product` e `products.repository.interface.js`. Nenhuma classe de `src/infrastructure/` é importada pelo Service ou pelo Controller.
- **Conclusão:** Acoplamento aferido como baixo e direcionado para abstrações, sem vazamento de infraestrutura.

### Critério 3 — Coesão
- **Observação:** Cada arquivo e classe possui foco único e métodos diretamente relacionados à sua responsabilidade.
- **Evidência:** `ProductMapper` realiza apenas conversões `Product ↔ ProductOrmEntity`; `product-response.mapper.ts` realiza apenas `Product → ProductResponseDto`; `ProductsService` coordena apenas casos de uso de `Product`.
- **Conclusão:** Alta coesão verificada em todos os componentes do UC12.

### Critério 4 — Duplicação
- **Observação:** Não há duplicação de regras de negócio, de mapeamento HTTP ou de persistência no código de produção do UC12.
- **Evidência:** A transformação para resposta HTTP está centralizada em `toProductResponse(product)` (`product-response.mapper.ts`) e reutilizada pelo `ProductsController` (linha 17). A conversão ORM está centralizada em `ProductMapper` (`product.mapper.ts`).
- **Conclusão:** Nenhuma duplicação problemática identificada no código de produção.

### Critério 5 — Legibilidade
- **Observação:** Nomenclatura consistente com o domínio e com os contratos estabelecidos (`productId`, `name`, `createProduct`, `save`, `toProductResponse`, `toPersistence`, `toDomain`), arquivos enxutos (entre 6 e 22 linhas no código de produção) e tipagem explícita (`strictNullChecks`, `isolatedModules`).
- **Evidência:** Inspeção direta dos 11 arquivos de produção de `products` e execução de `pnpm build` sem erros.
- **Conclusão:** Código claro, legível e aderente às convenções do projeto.

### Critério 6 — Testabilidade
- **Observação:** A arquitetura permite testar cada fronteira isoladamente ou de forma integrada sem artifícios complexos.
- **Evidência:**
  - `products.service.spec.ts` testa `ProductsService` injetando um mock simples no token `PRODUCTS_REPOSITORY`.
  - `products.controller.spec.ts` testa a fronteira HTTP (`ValidationPipe` + `ProductsController` + `toProductResponse`) mockando `ProductsService`.
  - `products.integration.spec.ts` testa a integração `Controller -> Service -> Repository` substituindo `PRODUCTS_REPOSITORY` por `InMemoryProductsRepository` sem exigir PostgreSQL ativo.
  - `typeorm-products.repository.postgres.spec.ts` testa `TypeOrmProductsRepository` + `ProductMapper` + `ProductOrmEntity` + migration contra o banco real isolado `celilac_test`.
- **Conclusão:** Testabilidade comprovada nas quatro camadas de verificação.

### Critério 7 — Estabilidade dos Contratos
- **Observação:** Os contratos internos e externos mantêm-se estáveis desde sua definição e estão protegidos por barreiras de mapeamento.
- **Evidência:**
  - Contrato HTTP público (`POST /products` → `201 Created`, `{ productId, name }`) protegido por `toProductResponse()` e verificado com asserção fechada `toEqual()` e teste de não exposição (`internalNote`) em `products.controller.spec.ts` (linhas 78–97).
  - Contrato do Service (`createProduct(name: string): Promise<Product>`) e do Repository (`save(product: Product): Promise<Product>`) preservados sem alterações.
- **Conclusão:** Contratos estáveis e verificados por testes automatizados.

### Critério 8 — Configuração e Composição
- **Observação:** A composição de providers em `ProductsModule` e `AppModule` está consistente com o ciclo de vida do NestJS e do TypeORM.
- **Evidência:** `ProductsModule` importa `TypeOrmModule.forFeature([ProductOrmEntity])` (fornecendo `Repository<ProductOrmEntity>` para `TypeOrmProductsRepository`) e registra `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`. Em `AppModule`, `autoLoadEntities: true` e `synchronize: false` garantem que o esquema dependa exclusivamente de migrations controladas.
- **Conclusão:** Composição íntegra e validada tanto em testes integrados quanto no contêiner `celilac-api`.

---

## 3. Investigação das Hipóteses do Material Didático (Hipóteses Descartadas)

O Material 12 apresenta cinco exemplos hipotéticos de anomalias arquiteturais para exercitar o diagnóstico. Cada hipótese foi confrontada com o código real do CeliLac e **descartada com base em evidências**:

| # | Hipótese do Material Didático | Verificação no Código Real do CeliLac | Evidência | Status da Hipótese |
| :---: | :--- | :--- | :--- | :--- |
| **H-01** | **Controller acessando diretamente o TypeORM** (`@InjectRepository` ou `DataSource` no Controller) | `ProductsController` injeta exclusivamente `ProductsService`. Não há nenhum import de `typeorm` ou `@nestjs/typeorm` no Controller. | `src/modules/products/controllers/products.controller.ts` (linhas 1–19) | **Descartada** (não ocorre no CeliLac) |
| **H-02** | **Service dependente de infraestrutura** (importando `TypeOrmProductsRepository`, `ProductOrmEntity` ou DTOs HTTP) | `ProductsService` importa apenas `randomUUID`, `@nestjs/common`, `Product` e `products.repository.interface.js`. | `src/modules/products/services/products.service.ts` (linhas 1–20) | **Descartada** (não ocorre no CeliLac) |
| **H-03** | **Repository abstrato expondo tipos do TypeORM** (`DeleteResult`, `InsertResult`, `ProductOrmEntity` ou `FindOptionsWhere` na interface) | `ProductsRepository` declara apenas `save(product: Product): Promise<Product>`, referenciando unicamente a entidade de domínio `Product`. | `src/modules/products/repositories/products.repository.interface.ts` (linhas 1–7) | **Descartada** (não ocorre no CeliLac) |
| **H-04** | **Duplicação ou mapeamento HTTP inline no Controller** (`return { productId: product.productId, name: product.name }`) | O Material 11 já extraiu `toProductResponse(product)` em `product-response.mapper.ts`, e `ProductsController.create()` já retorna `toProductResponse(product)`. | `src/modules/products/controllers/products.controller.ts` (linha 17) e `mappers/product-response.mapper.ts` (linhas 8–13) | **Descartada** (já resolvido no Material 11) |
| **H-05** | **Providers inconsistentes no `ProductsModule`** (falta de binding de `PRODUCTS_REPOSITORY` ou ausência de `TypeOrmModule.forFeature`) | `ProductsModule` registra `TypeOrmModule.forFeature([ProductOrmEntity])` e vincula `PRODUCTS_REPOSITORY` a `TypeOrmProductsRepository` via `useClass`. | `src/modules/products/products.module.ts` (linhas 9–20) e inicialização real no contêiner `celilac-api` | **Descartada** (não ocorre no CeliLac) |

---

## 4. Registro Estruturado das Observações Técnicas (Diferenciação entre Observação e Problema)

Conforme a metodologia da auditoria, **uma observação não é automaticamente um problema**. Abaixo estão registradas as quatro observações levantadas durante a inspeção minuciosa, avaliando se alguma delas configura um problema técnico que exija refatoração imediata:

### Achado `OBS-01` — Aviso `typescript(unbound-method)` em teste unitário do Service
1. **Identificador:** `OBS-01`
2. **Componente:** `src/modules/products/services/products.service.spec.ts` (teste unitário)
3. **Responsabilidade esperada:** Verificar o comportamento unitário de `ProductsService.createProduct` com mock de `ProductsRepository`.
4. **Característica observada:** O linter `oxlint --type-aware` emite 1 aviso (`warning`, não erro) na linha 34: `expect(productsRepository.save).toHaveBeenCalledTimes(1)` devido à regra `typescript(unbound-method)` (além de 2 avisos análogos preexistentes em `src/modules/orders/services/orders.service.spec.ts`, fora do escopo do UC12).
5. **Evidência concreta:** Saída de `pnpm lint`: `Found 3 warnings and 0 errors`, apontando `products.service.spec.ts:34:12`.
6. **Risco técnico:** Baixíssimo/nulo em execução, pois `productsRepository.save` é uma função mockada com `vi.fn()` que não utiliza `this` interno, e a expressão `expect(mock.method).toHaveBeenCalledTimes(1)` é o idioma padrão do Vitest.
7. **Impacto:** Nenhum impacto na arquitetura de produção, nos contratos ou na execução dos testes (`pnpm lint` retorna código `0`).
8. **Conclusão:** Classificado como **Observação** (não é um problema arquitetural do fluxo UC12).
9. **Proposta:** Preservar o arquivo sem modificação nesta etapa para não gerar diff e commit cosméticos em código de teste já aprovado nos Materiais 04 a 11.
10. **Verificação necessária:** Confirmar que `pnpm lint` e `pnpm test` continuam retornando código de saída `0`.

### Achado `OBS-02` — Localização de `InMemoryProductsRepository` em `src/modules/products/repositories/`
1. **Identificador:** `OBS-02`
2. **Componente:** `InMemoryProductsRepository` (`src/modules/products/repositories/in-memory-products.repository.ts`)
3. **Responsabilidade esperada:** Fornecer implementação em memória de `ProductsRepository` para testes integrados rápidos sem banco de dados.
4. **Característica observada:** Enquanto `TypeOrmProductsRepository` reside em `src/infrastructure/persistence/products/`, `InMemoryProductsRepository` reside dentro de `src/modules/products/repositories/`.
5. **Evidência concreta:** Inspeção de diretórios e importação em `src/modules/products/products.integration.spec.ts` (linha 21).
6. **Risco técnico:** Nenhum vazamento de infraestrutura, pois `InMemoryProductsRepository` depende apenas de `Product`, `ProductsRepository` e `@Injectable()`, sem bibliotecas externas de persistência.
7. **Impacto:** Nenhum impacto negativo; facilita a coesão dos testes do módulo `products`.
8. **Conclusão:** Classificado como **Observação** (organização válida e estabelecida desde o Material 08).
9. **Proposta:** Preservar a localização atual para não quebrar caminhos de importação consolidados nos materiais anteriores.
10. **Verificação necessária:** Execução de `products.integration.spec.ts` via `pnpm test`.

### Achado `OBS-03` — Instanciação local de `ValidationPipe` nas suítes de teste HTTP
1. **Identificador:** `OBS-03`
2. **Componente:** `products.controller.spec.ts` (linhas 31–36) e `products.integration.spec.ts` (linhas 51–56)
3. **Responsabilidade esperada:** Reproduzir no ambiente de teste HTTP a mesma configuração de validação global definida em `src/main.ts` (`whitelist: true, transform: true`).
4. **Característica observada:** Como `main.ts` executa `bootstrap()` diretamente e os testes NestJS criam aplicações isoladas via `moduleFixture.createNestApplication()`, cada suíte registra `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`.
5. **Evidência concreta:** Comparação entre `src/main.ts` (linhas 7–12), `products.controller.spec.ts` (linhas 31–36) e `products.integration.spec.ts` (linhas 51–56).
6. **Risco técnico:** Caso as opções globais do `ValidationPipe` mudem no futuro em `main.ts`, os testes precisariam acompanhar a mudança se não houver um helper compartilhado ou provider `APP_PIPE`.
7. **Impacto:** No escopo atual do CeliLac, a configuração `{ whitelist: true, transform: true }` é estável e explícita em cada suíte de teste, tornando o setup de cada arquivo autossuficiente e legível.
8. **Conclusão:** Classificado como **Observação** (não constitui defeito na arquitetura do módulo `Products`).
9. **Proposta:** Preservar a configuração atual de `main.ts` e dos testes, evitando alterar o bootstrap global da aplicação sem requisito.
10. **Verificação necessária:** Execução dos testes de fronteira HTTP (`201` e `400`).

### Achado `OBS-04` — Conexão de `pnpm test:e2e` ao banco `celilac_db`
1. **Identificador:** `OBS-04`
2. **Componente:** Suíte E2E legada (`test/app.e2e-spec.ts` e `test/orders/confirm-order.e2e-spec.ts`)
3. **Responsabilidade esperada:** Executar testes fim a fim de `AppController` e `UC07 — Orders`.
4. **Característica observada:** Ao importar `AppModule`, a suíte E2E utiliza as variáveis `DB_*` do `.env` (`celilac_db` na porta `5432`), ao passo que a suíte de persistência do UC12 (`pnpm test:integration`) utiliza `createTestDataSource()` conectado ao banco isolado `celilac_test` na porta `5435`.
5. **Evidência concreta:** Inspeção de `src/app.module.ts` (linhas 18–30), `test/orders/confirm-order.e2e-spec.ts` (linhas 25–46) e `src/database/test-data-source.ts` (linhas 6–40).
6. **Risco técnico:** Operações E2E mal projetadas poderiam afetar dados de desenvolvimento em `celilac_db`; contudo, a inspeção de `confirm-order.e2e-spec.ts` comprovou que ele cria apenas 1 registro em `orders` e 1 em `payments` com UUID aleatório e remove exclusivamente os IDs criados em `afterAll`, sem tocar no schema `products`.
7. **Impacto:** Nenhum impacto sobre os dados ou contratos do `UC12 — Cadastrar Produto`, desde que verificado antes da execução.
8. **Conclusão:** Classificado como **Observação** de infraestrutura de testes legados (fora do escopo de refatoração do módulo `products`).
9. **Proposta:** Preservar `AppModule` e registrar o protocolo de inspeção prévia na documentação de regressão (`12-06`).
10. **Verificação necessária:** Inspeção estática prévia e execução controlada de `pnpm test:integration` e `pnpm test:e2e`.

---

## 5. Problemas Confirmados

**Nenhum problema arquitetural confirmado foi identificado no fluxo `UC12 — Cadastrar Produto`.**

Todos os componentes construídos e refinados ao longo dos Materiais 04 a 11 cumprem suas responsabilidades com baixo acoplamento, alta coesão, inversão de dependência funcional e contratos públicos e internos estabilizados.

---

## 6. Pontos Adequados Confirmados por Evidências

1. **Fronteira HTTP estabilizada:** `ProductsController` recebe `CreateProductDto` e retorna `ProductResponseDto` por meio de `toProductResponse(product)`, impedindo vazamento da entidade interna.
2. **Núcleo de domínio e aplicação limpo:** `Product`, `ProductsRepository` e `ProductsService` não possuem nenhuma dependência do TypeORM ou de objetos de transporte HTTP.
3. **Inversão de dependência efetiva:** `TypeOrmProductsRepository` implementa `ProductsRepository` na camada `src/infrastructure/persistence/products/`, sendo resolvido via token `PRODUCTS_REPOSITORY` no `ProductsModule`.
4. **Isolamento entre mappers:** `toProductResponse` (HTTP) e `ProductMapper` (persistência) estão em camadas distintas e têm responsabilidades claramente demarcadas.
5. **Segurança da persistência de testes do UC12:** `createTestDataSource()` e `typeorm-products.repository.postgres.spec.ts` exigem banco terminado em `_test` (`celilac_test`), porta e usuário exclusivos (`5435`, `celilac_test`) e flag `TEST_DB_ALLOW_DESTRUCTIVE=true` antes de executar migrations ou `TRUNCATE`.

---

## 7. Limitações da Auditoria

- A auditoria avaliou o escopo implementado do `UC12 — Cadastrar Produto` (`POST /products` com os campos `productId` e `name`).
- A adequação atual não significa qualidade absoluta ou imutabilidade perpétua: caso novos casos de uso ou regras de negócio complexas (como validações cruzadas de domínio, políticas de preço, categorias ou restrições alimentares) sejam introduzidos em etapas futuras, a necessidade de validações ricas na entidade `Product` ou de filtros de exceção específicos para `Products` deverá ser reavaliada.

---

## 8. Conclusão da Fase 4

A auditoria de responsabilidades comprovou, com evidências diretas do código-fonte e das suítes de teste, que a arquitetura integrada do fluxo de cadastro de produtos atende aos oito critérios de qualidade no escopo atual, não havendo defeitos estruturais que justifiquem refatoração de código.
