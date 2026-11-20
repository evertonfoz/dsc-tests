# ARTEFATO 12-02 — RECONSTRUÇÃO DA ARQUITETURA E MAPA DE DEPENDÊNCIAS

## 1. Distinção Obrigatória: Fluxo de Execução × Dependências Arquiteturais

Uma falha conceitual comum em revisões arquiteturais é confundir a direção das chamadas em tempo de execução (*runtime*) com a direção das dependências de código em tempo de compilação (*design-time / compile-time*). Na arquitetura do CeliLac (UC12), a Inversão de Dependências (DIP) garante que a aplicação não dependa dos detalhes de infraestrutura.

---

## 2. Fluxo de Execução em Tempo de Execução (Runtime)

O fluxo de execução descreve a sequência temporal em que as mensagens e dados transitam pelos componentes durante o processamento de uma requisição `POST /products`:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP
    participant Controller as ProductsController
    participant Pipe as ValidationPipe
    participant Service as ProductsService
    participant RepoIface as ProductsRepository (Token)
    participant Adaptador as TypeOrmProductsRepository
    participant MapperPersist as ProductMapper (Persistência)
    participant ORM as TypeORM Repository
    participant DB as PostgreSQL (Schema products)
    participant MapperHTTP as toProductResponse (HTTP)

    Cliente->>Controller: POST /products { name: "Celular XYZ" }
    Controller->>Pipe: Validação de CreateProductDto
    Pipe-->>Controller: DTO validado e higienizado
    Controller->>Service: createProduct("Celular XYZ")
    Note over Service: Instancia Product(uuid, name)
    Service->>RepoIface: save(product)
    RepoIface->>Adaptador: Chamada despachada pelo NestJS
    Adaptador->>MapperPersist: toPersistence(product)
    MapperPersist-->>Adaptador: ProductOrmEntity
    Adaptador->>ORM: save(entity)
    ORM->>DB: INSERT INTO products.products VALUES (...)
    DB-->>ORM: Registro persistido com sucesso
    ORM-->>Adaptador: ProductOrmEntity recuperada
    Adaptador->>MapperPersist: toDomain(entity)
    MapperPersist-->>Adaptador: Product (Entidade de Domínio)
    Adaptador-->>Service: Product
    Service-->>Controller: Product
    Controller->>MapperHTTP: toProductResponse(product)
    MapperHTTP-->>Controller: ProductResponseDto
    Controller-->>Cliente: 201 Created { productId, name }
```

### Representação Textual Linear do Fluxo:
```text
Cliente HTTP
  └── (1) Requisição POST /products
      └── (2) ProductsController
          └── (3) ValidationPipe (higienização e validação de CreateProductDto)
              └── (4) ProductsService.createProduct(name)
                  ├── instancia Product(randomUUID(), name)
                  └── (5) ProductsRepository.save(product)
                      └── (6) TypeOrmProductsRepository.save(product)
                          ├── (7) ProductMapper.toPersistence(product)
                          ├── (8) TypeORM Repository<ProductOrmEntity>.save(entity)
                          │       └── (9) SQL INSERT no PostgreSQL (banco celilac_db)
                          └── (10) ProductMapper.toDomain(savedEntity)
                              └── (11) Retorno de Product ao ProductsService
                                  └── (12) Retorno de Product ao ProductsController
                                      └── (13) toProductResponse(product)
                                          └── (14) Resposta HTTP 201 com ProductResponseDto
```

---

## 3. Mapa de Dependências Arquiteturais (Tempo de Compilação)

Diferente do fluxo temporal, as dependências de código (expressas nas cláusulas `import` do TypeScript) convergem para o **núcleo do domínio e da aplicação**. A camada de infraestrutura depende da aplicação, e não o contrário:

```mermaid
graph TD
    subgraph CamadaHTTP ["Camada HTTP (Apresentação / Externa)"]
        ProductsController["ProductsController"]
        CreateProductDto["CreateProductDto"]
        ProductResponseMapper["toProductResponse / ProductResponseDto"]
    end

    subgraph CamadaAplicacao ["Camada de Aplicação e Domínio (Núcleo)"]
        ProductsService["ProductsService"]
        ProductEntity["Product (Entidade de Domínio)"]
        ProductsRepoIface["ProductsRepository (Interface e Token)"]
    end

    subgraph CamadaInfra ["Camada de Infraestrutura (Persistência)"]
        TypeOrmProductsRepo["TypeOrmProductsRepository"]
        ProductMapper["ProductMapper (Persistência)"]
        ProductOrmEntity["ProductOrmEntity"]
    end

    subgraph ModuloComposicao ["Composição e DI (NestJS)"]
        ProductsModule["ProductsModule"]
    end

    %% Relações HTTP -> Aplicação
    ProductsController --> ProductsService
    ProductsController --> CreateProductDto
    ProductsController --> ProductResponseMapper
    ProductResponseMapper --> ProductEntity

    %% Relações Aplicação -> Domínio
    ProductsService --> ProductEntity
    ProductsService --> ProductsRepoIface
    ProductsRepoIface --> ProductEntity

    %% Inversão de Dependências: Infraestrutura -> Aplicação/Domínio
    TypeOrmProductsRepo -->|implementa| ProductsRepoIface
    TypeOrmProductsRepo --> ProductEntity
    TypeOrmProductsRepo --> ProductMapper
    TypeOrmProductsRepo --> ProductOrmEntity
    ProductMapper --> ProductEntity
    ProductMapper --> ProductOrmEntity

    %% Composição
    ProductsModule -.->|amarra| ProductsController
    ProductsModule -.->|amarra| ProductsService
    ProductsModule -.->|registra como provider de PRODUCTS_REPOSITORY| TypeOrmProductsRepo
    ProductsModule -.->|importa forFeature| ProductOrmEntity

    style ProductEntity fill:#d4edda,stroke:#28a745,stroke-width:2px;
    style ProductsRepoIface fill:#d4edda,stroke:#28a745,stroke-width:2px;
    style ProductsService fill:#d1ecf1,stroke:#17a2b8,stroke-width:2px;
    style ProductsController fill:#fff3cd,stroke:#ffc107,stroke-width:2px;
    style TypeOrmProductsRepo fill:#f8d7da,stroke:#dc3545,stroke-width:2px;
```

---

## 4. Auditoria dos Dois Mappers Distintos

O projeto possui dois mappers claramente segregados que atendem a fronteiras distintas:

| Característica | Mapper HTTP (`toProductResponse`) | Mapper de Persistência (`ProductMapper`) |
|---|---|---|
| **Localização** | `src/modules/products/mappers/product-response.mapper.ts` | `src/infrastructure/persistence/products/product.mapper.ts` |
| **Fronteira** | Domínio → Apresentação Externa (HTTP) | Domínio ↔ Infraestrutura (TypeORM / Relacional) |
| **Sentido** | Unidirecional (`Product → ProductResponseDto`) | Bidirecional (`toPersistence` e `toDomain`) |
| **Tipo de Retorno** | Objeto literal TypeScript / DTO público | Instância de `ProductOrmEntity` ou `Product` |
| **Regras de Negócio** | Nenhuma (apenas projeção de campos permitidos) | Nenhuma (apenas adaptação de formato relacional) |
| **Motivo da Separação** | Proteger consumidores HTTP contra vazamento de atributos internos e permitir evolução do domínio sem quebra de API pública. | Desacoplar o modelo de domínio corporativo das especificidades de banco e decorators do TypeORM. |

---

## 5. Composição de Dependências e Resolução de Providers no NestJS

Como as interfaces do TypeScript são apagadas durante a transpilação para JavaScript (*type erasure*), uma interface pura não pode ser utilizada como token de injeção em tempo de execução. O NestJS resolve isso por meio da composição explícita no módulo:

### Injeção no Serviço (`ProductsService`):
```typescript
@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}
  ...
}
```

### Configuração no Módulo (`ProductsModule`):
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: TypeOrmProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### Justificativa Arquitetural da Composição:
* O `ProductsModule` atua como o **Composer Root** da funcionalidade.
* O `ProductsService` permanece agnóstico quanto à implementação concreta: em testes integrados (`products.integration.spec.ts`), o token `PRODUCTS_REPOSITORY` é facilmente substituído por `InMemoryProductsRepository` através de `overrideProvider`.
* Em produção e no contêiner da aplicação, o NestJS injeta a classe `TypeOrmProductsRepository`, que recebe internamente o `Repository<ProductOrmEntity>` injetado pelo TypeORM via `@InjectRepository`.

---

## 6. Evidências Concretas de Isolamento nos Arquivos Inspecionados

1. **`product.entity.ts`:**
   - Contém apenas propriedades puras: `productId: string`, `name: string`.
   - **Zero** imports de TypeORM, NestJS, Express ou qualquer biblioteca externa.
2. **`products.repository.interface.ts`:**
   - Declara o token constante `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`.
   - Declara o método `save(product: Product): Promise<Product>`.
   - **Zero** menções a `ProductOrmEntity`, `FindOptions` ou `Repository` do TypeORM.
3. **`products.service.ts`:**
   - Importa apenas `@Inject`, `@Injectable` (NestJS utilitário neutro), `randomUUID` (`node:crypto`), `Product` e a interface/token `ProductsRepository`.
   - **Zero** imports de `src/infrastructure` ou `typeorm`.
4. **`products.controller.ts`:**
   - Injeta apenas `ProductsService`.
   - Importa apenas `CreateProductDto`, `toProductResponse`, `ProductResponseDto` e decorators HTTP (`@Controller`, `@Post`, `@Body`).
   - **Zero** imports de `typeorm` ou persistência.
5. **Verificação Objetiva de Imports Indevidos (Grep):**
   - `grep -n "typeorm" src/modules/products/entities/product.entity.ts src/modules/products/repositories/products.repository.interface.ts src/modules/products/services/products.service.ts src/modules/products/controllers/products.controller.ts` → **0 ocorrências (código 1)**.
   - `grep -n "infrastructure" src/modules/products/services/products.service.ts src/modules/products/controllers/products.controller.ts` → **0 ocorrências (código 1)**.
