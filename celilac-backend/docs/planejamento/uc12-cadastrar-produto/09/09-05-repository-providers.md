# ARTEFATO 09-05 — ADAPTADOR `TypeOrmProductsRepository` E CONFIGURAÇÃO DE PROVIDERS

## 1. Visão Geral do Fluxo de Persistência Implementado

Com a introdução do adaptador TypeORM e do `ProductMapper`, o fluxo completo da aplicação passa a ser:

```text
Cliente HTTP (POST /products)
        │
        ▼
ProductsController.create(dto: CreateProductDto)
        │  delega dto.name
        ▼
ProductsService.createProduct(name: string)
        │  instancia new Product(randomUUID(), name)
        ▼
ProductsRepository (Token: PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY')
        │  resolvido via DI pelo ProductsModule
        ▼
TypeOrmProductsRepository.save(product: Product)
        ├──> ProductMapper.toPersistence(product) -> ProductOrmEntity
        ├──> ormRepository.save(entity)           -> TypeORM -> PostgreSQL (tabela "products"."products")
        └──> ProductMapper.toDomain(savedEntity)  -> Product
```

---

## 2. Código Completo dos Componentes de Infraestrutura

### 2.1 `ProductMapper` (`src/infrastructure/persistence/products/product.mapper.ts`)

```typescript
import { Product } from '../../../modules/products/entities/product.entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';

export class ProductMapper {
  static toPersistence(product: Product): ProductOrmEntity {
    const entity = new ProductOrmEntity();

    entity.productId = product.productId;
    entity.name = product.name;

    return entity;
  }

  static toDomain(entity: ProductOrmEntity): Product {
    return new Product(entity.productId, entity.name);
  }
}
```

### 2.2 Adaptador `TypeOrmProductsRepository` (`src/infrastructure/persistence/products/typeorm-products.repository.ts`)

Implementado com tipagem completa (`Repository<ProductOrmEntity>` e `Promise<Product>`) e imports ESM explícitos:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../modules/products/entities/product.entity.js';
import { type ProductsRepository } from '../../../modules/products/repositories/products.repository.interface.js';
import { ProductMapper } from './product.mapper.js';
import { ProductOrmEntity } from './product.orm-entity.js';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toPersistence(product);
    const savedEntity = await this.ormRepository.save(entity);

    return ProductMapper.toDomain(savedEntity);
  }
}
```

### Verificação dos Limites Arquiteturais:
- **Contrato implementado:** `ProductsRepository` (`save(product: Product): Promise<Product>`).
- **`ProductsService` intocado:** Não importa `typeorm`, `@nestjs/typeorm` ou `ProductOrmEntity`.
- **`ProductsController` intocado:** Não contém lógica de persistência nem SQL.
- **Domínio intocado:** `Product` não foi substituída por `ProductOrmEntity`.

---

## 3. Substituição do Provider em `ProductsModule` (`src/modules/products/products.module.ts`)

O módulo de produtos foi atualizado para importar `TypeOrmModule.forFeature([ProductOrmEntity])` e associar o token `PRODUCTS_REPOSITORY` à classe `TypeOrmProductsRepository`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../../infrastructure/persistence/products/product.orm-entity.js';
import { TypeOrmProductsRepository } from '../../infrastructure/persistence/products/typeorm-products.repository.js';
import { ProductsController } from './controllers/products.controller.js';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository.interface.js';
import { ProductsService } from './services/products.service.js';

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

---

## 4. Preservação dos Testes Integrados em Memória e Diagnóstico Real (Fase 7 e Fase 10)

### 4.1 Diagnóstico Real ao Executar a Suíte em Memória Sem Override
Ao atualizar `ProductsModule` para usar `TypeOrmModule.forFeature([ProductOrmEntity])` e `TypeOrmProductsRepository`, executou-se `pnpm test --run` para inspecionar o impacto imediato sobre `src/modules/products/products.integration.spec.ts` (que importa `ProductsModule` isoladamente sem `AppModule` / `TypeOrmModule.forRoot`):

- **Sintoma e Evidência Real Observada:**
  ```text
  FAIL  src/modules/products/products.integration.spec.ts > POST /products — integração
  Error: Nest can't resolve dependencies of the ProductOrmEntityRepository (?). Please make sure that the argument DataSource at index [0] is available in the TypeOrmModule module.
  ```
- **Componente Localizado:** `ProductsModule` importado em `src/modules/products/products.integration.spec.ts`.
- **Causa Raiz:** `TypeOrmModule.forFeature([ProductOrmEntity])` registra o provider `getRepositoryToken(ProductOrmEntity)` (`ProductOrmEntityRepository`), que exige um `DataSource` ativo do `TypeOrmModule.forRoot(...)`. Como `products.integration.spec.ts` é o teste integrado **em memória** (Nível C do Material 08, que não deve depender de PostgreSQL), o container de teste não possui `DataSource` e precisa de override explícito para continuar utilizando `InMemoryProductsRepository`.

### 4.2 Correção Aplicada em `src/modules/products/products.integration.spec.ts`
Sem alterar nenhuma asserção dos testes (`it(...)`), configurou-se o override explícito no `TestingModule` do teste integrado em memória:

```typescript
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(getRepositoryToken(ProductOrmEntity))
      .useValue({})
      .overrideProvider(PRODUCTS_REPOSITORY)
      .useClass(InMemoryProductsRepository)
      .compile();
```

### 4.3 Verificação de Compilação e Reexecução da Suíte em Memória
1. **Compilação (`pnpm build`):**
   ```text
   $ nest build
   ```
   (Código de saída `0`, zero erros TypeScript).
2. **Suíte de Testes (`pnpm test --run`):**
   ```text
    ✓ src/app.controller.spec.ts (1 test) 93ms
    ✓ src/modules/products/services/products.service.spec.ts (1 test) 90ms
    ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 81ms
    ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 166ms
    ✓ src/modules/products/products.integration.spec.ts (2 tests) 170ms

    Test Files  5 passed (5)
         Tests  12 passed (12)
   ```

---

## 5. Verificações Concluídas e Pendências

- [x] `ProductOrmEntity` registrada via `TypeOrmModule.forFeature([ProductOrmEntity])`.
- [x] Provider `PRODUCTS_REPOSITORY` vinculado a `TypeOrmProductsRepository`.
- [x] Compilação (`pnpm build`) validada sem erros.
- [x] Suítes anteriores (unitários, HTTP simulados e integrados em memória) 100% preservadas e independentes do PostgreSQL.
- [ ] **Próximo passo (Fase 8):** Inicializar a aplicação real conectada ao PostgreSQL (`celilac_db`), executar `POST /products`, consultar o banco diretamente, reiniciar o backend e comprovar a durabilidade do registro.

