# ARTEFATO 09-04 — ENTIDADE ORM, MAPPER E MIGRATION DA TABELA `products`

## 1. Entidade de Persistência ORM (`ProductOrmEntity`)

Arquivo implementado: `src/infrastructure/persistence/products/product.orm-entity.ts`

```typescript
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products', schema: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'productId',
  })
  productId!: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  name!: string;
}
```

### Decisões de Mapeamento e Limites Arquiteturais:
1. **Separação estrita entre Domínio e Persistência:** A classe de domínio `Product` (`src/modules/products/entities/product.entity.ts`) permanece 100% pura e imutável (`readonly productId: string`, `readonly name: string`), sem nenhum decorador do TypeORM. A classe `ProductOrmEntity` reside exclusivamente na camada de infraestrutura (`src/infrastructure/persistence/products/`).
2. **Isolamento por Schema PostgreSQL (`@Entity({ name: 'products', schema: 'products' })`):** Respeitando a convenção arquitetural estabelecida pelos módulos existentes (`@Entity({ name: 'orders', schema: 'orders' })` e `@Entity({ name: 'payments', schema: 'payments' })` na migration `1791738728692-CreateOrdersAndPayments.ts`), a entidade de produtos utiliza seu próprio schema dedicado `products` (`"products"."products"`).
3. **Chave primária `@PrimaryColumn({ type: 'uuid', name: 'productId' })`:** Como `ProductsService.createProduct(name)` já gera o UUID v4 na camada de aplicação (`randomUUID()`), utiliza-se `@PrimaryColumn` (e **não** `@PrimaryGeneratedColumn`), evitando geração automática redundante no banco e preservando o identificador definido pelo serviço.
4. **Coluna `@Column({ type: 'varchar', length: 120, nullable: false })`:** Mapeia `name` como texto obrigatório (`NOT NULL`). O limite `length: 120` é adotado como **decisão técnica ilustrativa** de armazenamento relacional (não constituindo regra de negócio confirmada na especificação original do `UC12`).

---

## 2. Conversor Domínio ↔ Persistência (`ProductMapper`)

Arquivo implementado: `src/infrastructure/persistence/products/product.mapper.ts`

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

### Papel Arquitetural do `ProductMapper`:
- **`ProductMapper.toPersistence(product: Product): ProductOrmEntity`:** Converte a instância de domínio `Product` em uma instância `ProductOrmEntity` antes da chamada `ormRepository.save(entity)`.
- **`ProductMapper.toDomain(entity: ProductOrmEntity): Product`:** Reconstrói uma instância de domínio `Product` pura a partir do retorno do TypeORM, impedindo que tipos de infraestrutura vazem para `ProductsService` ou `ProductsController`.
- **Ausência de regras de negócio:** O Mapper realiza exclusivamente tradução estrutural entre modelos.

---

## 3. Migration da Tabela `products.products` (`CreateProductsTable1794255600000`)

Arquivo implementado: `src/database/migrations/1794255600000-CreateProductsTable.ts`

```typescript
import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProductsTable1794255600000 implements MigrationInterface {
  name = 'CreateProductsTable1794255600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS products`);
    await queryRunner.query(`
      CREATE TABLE "products"."products" (
        "productId" uuid NOT NULL,
        "name" character varying(120) NOT NULL,
        CONSTRAINT "PK_products_productId"
          PRIMARY KEY ("productId")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"."products"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS products`);
  }
}
```

---

## 4. Esquema Esperado vs. Esquema Efetivo no PostgreSQL (`celilac_db`)

### 4.1 Esquema SQL Esperado
```sql
CREATE SCHEMA IF NOT EXISTS products;

CREATE TABLE "products"."products" (
  "productId" uuid NOT NULL,
  "name" character varying(120) NOT NULL,
  CONSTRAINT "PK_products_productId"
    PRIMARY KEY ("productId")
);
```

### 4.2 Comandos Executados para Aplicação da Migration
1. **Verificação prévia (`migration:show`):**
   ```bash
   pnpm typeorm migration:show
   ```
   Saída observada:
   ```text
   [X] 2 CreateOrdersAndPayments1791738728692
   [X] 3 AddDomainFieldsToOrdersAndPayments1791814820800
   [X] 4 UseDatabaseTimestamps1791814929531
   [X] 5 AddUpdatedAtTriggers1791815040413
   [ ] CreateProductsTable1794255600000
   ```
2. **Execução da migration (`migration:run`):**
   ```bash
   pnpm typeorm migration:run
   ```
   Saída real observada:
   ```text
   query: START TRANSACTION
   query: CREATE SCHEMA IF NOT EXISTS products
   query: 
         CREATE TABLE "products"."products" (
           "productId" uuid NOT NULL,
           "name" character varying(120) NOT NULL,
           CONSTRAINT "PK_products_productId"
             PRIMARY KEY ("productId")
         )
       
   query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1794255600000,"CreateProductsTable1794255600000"]
   Migration CreateProductsTable1794255600000 has been executed successfully.
   query: COMMIT
   ```

### 4.3 Verificação do Esquema Efetivo e Distinção entre `products.products` e `public.migrations`

1. **Inspeção da estrutura física da tabela `products.products` (`\d products.products`):**
   ```text
                         Table "products.products"
     Column   |          Type          | Collation | Nullable | Default 
   -----------+------------------------+-----------+----------+---------
    productId | uuid                   |           | not null | 
    name      | character varying(120) |           | not null | 
   Indexes:
       "PK_products_productId" PRIMARY KEY, btree ("productId")
   ```
   - **Concordância:** 100% idêntico ao esquema esperado e ao mapeamento de `ProductOrmEntity`.

2. **Consulta à tabela de histórico de migrations (`public.migrations`):**
   - Comando: `docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM public.migrations ORDER BY id;"`
   - Resultado:
     ```text
      id |   timestamp   |                      name                       
     ----+---------------+-------------------------------------------------
       1 | 1792519198708 | CreateOrders1792519198708
       2 | 1791738728692 | CreateOrdersAndPayments1791738728692
       3 | 1791814820800 | AddDomainFieldsToOrdersAndPayments1791814820800
       4 | 1791814929531 | UseDatabaseTimestamps1791814929531
       5 | 1791815040413 | AddUpdatedAtTriggers1791815040413
       6 | 1794255600000 | CreateProductsTable1794255600000
     (6 rows)
     ```

3. **Consulta inicial à tabela de dados de negócio (`products.products`):**
   - Comando: `docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products;"`
   - Resultado:
     ```text
      productId | name 
     -----------+------
     (0 rows)
     ```
   - **Distinção fundamental:** `SELECT * FROM public.migrations` comprova que o **DDL** (`CreateProductsTable1794255600000`) foi aplicado e registrado pelo TypeORM; já `SELECT * FROM products.products` consulta os **registros de produtos** efetivamente armazenados pela aplicação no schema `products` (inicialmente `0 rows` antes do disparo de `POST /products`).

---

## 5. Pendências

- Nenhuma pendência no mapeamento ORM ou na migration da tabela `products`.

