# ARTEFATO 09-03 — CONFIGURAÇÃO DO TYPEORM E PREPARAÇÃO DO DATASOURCE

## 1. Inspeção das Dependências Existentes no `package.json`

A verificação de `package.json` e `node_modules/` confirmou que todas as dependências necessárias para integração com PostgreSQL e TypeORM já estão instaladas e operacionais no projeto, dispensando qualquer reinstalação:

| Pacote | Versão Instalada (`package.json`) | Papel na Arquitetura |
| :--- | :--- | :--- |
| **`@nestjs/typeorm`** | `^12.0.2` | Integração do TypeORM com o container IoC do NestJS (`TypeOrmModule.forRootAsync`, `TypeOrmModule.forFeature`, `@InjectRepository`). |
| **`typeorm`** | `^1.1.2` | ORM relacional, `DataSource`, decoradores (`@Entity`, `@PrimaryColumn`, `@Column`), `Repository<T>` e executor de migrations. |
| **`pg`** | `^8.23.1` | Driver nativo de conexão PostgreSQL para Node.js. |
| **`@nestjs/config`** | `^12.0.1` | Carregamento e injeção tipada de variáveis de ambiente via `ConfigModule` e `ConfigService`. |
| **`dotenv`** | `^18.0.7` | Leitura de `.env` para scripts CLI fora do runtime NestJS (`import 'dotenv/config'` em `src/database/data-source.ts`). |

---

## 2. Verificação e Preservação do `AppModule` (`src/app.module.ts`)

O módulo raiz da aplicação já possui `TypeOrmModule.forRootAsync` configurado e integrado ao `ConfigService`, preservando integralmente `OrdersModule`, `ProductsModule` e `DomainHttpExceptionFilter`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './modules/orders/orders.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionFilter } from './common/filters/domain-http-exception.filter.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrdersModule,
    ProductsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainHttpExceptionFilter },
  ],
})
export class AppModule {}
```

### Garantias Verificadas no `AppModule`:
1. **`autoLoadEntities: true`:** Toda entidade ORM registrada em módulos de feature via `TypeOrmModule.forFeature([...])` (como `ProductOrmEntity` no `ProductsModule`) é carregada automaticamente na conexão principal do TypeORM.
2. **`synchronize: false` (sem duplicação):** O esquema do banco nunca é modificado automaticamente na inicialização da aplicação, exigindo migrations explícitas e auditáveis.

---

## 3. Configuração do `DataSource` da CLI (`src/database/data-source.ts`)

O arquivo `src/database/data-source.ts` é utilizado pelo script `"typeorm": "typeorm-ts-node-esm -d src/database/data-source.ts"` do `package.json`. Ele foi atualizado para incluir `ProductOrmEntity` junto às entidades existentes `OrderEntity` e `PaymentEntity`, mantendo a compatibilidade com ESM (`.js` nos imports relativos) e o padrão `migrations: ['src/database/migrations/*.ts']`:

```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OrderEntity } from '../infrastructure/persistence/orders/order.orm-entity.js';
import { PaymentEntity } from '../infrastructure/persistence/payments/payment.orm-entity.js';
import { ProductOrmEntity } from '../infrastructure/persistence/products/product.orm-entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [OrderEntity, PaymentEntity, ProductOrmEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
```

---

## 4. Inspeção Prévia e Alinhamento Seguro do Histórico de Migrations em `celilac_db`

Antes de criar e aplicar a migration da tabela `products`, seguiu-se o protocolo obrigatório de segurança em 5 etapas:

1. **Verificação do banco de destino:** Confirmada conexão em `celilac_db` (`127.0.0.1:5432`, usuário `celilac_user`).
2. **Inspeção do histórico (`public.migrations`):**
   - Consulta inicial: `SELECT * FROM public.migrations;` retornou apenas `1 | 1792519198708 | CreateOrders1792519198708`.
3. **Verificação do esquema existente:**
   - `orders.orders` já existia no schema `orders` com as colunas `orderId`, `customerId`, `status`, `createdAt`, `updatedAt`, `deletedAt` (e 1 linha persistida), além de `public.infraestrutura_check` (1 linha).
   - O schema `products` e a tabela `products.products` **ainda não existiam** (seguindo a convenção de isolamento por schema de cada módulo do projeto: `orders.orders`, `payments.payments` e `products.products`).
4. **Identificação e resolução do conflito histórico:**
   - O comando `pnpm typeorm migration:show` exibia inicialmente as 4 migrations legadas de `orders`/`payments` (`1791738728692`, `1791814820800`, `1791814929531`, `1791815040413`) como pendentes (`[ ]`), pois `orders.orders` havia sido criada no volume compartilhado com a identificação `CreateOrders1792519198708`.
   - Para evitar que `migration:run` tentasse recriar `orders.orders` e falhasse, aplicaram-se de forma idempotente os objetos complementares de `payments` (`CREATE SCHEMA IF NOT EXISTS payments`, `CREATE TABLE IF NOT EXISTS payments.payments`, função e triggers `set_updated_at`) e registraram-se os 4 identificadores em `public.migrations`, preservando 100% dos registros existentes em `orders.orders` e `public.infraestrutura_check`.
5. **Verificação pós-alinhamento (`pnpm typeorm migration:show`):**
   ```text
   $ typeorm-ts-node-esm -d src/database/data-source.ts migration:show
   [X] 2 CreateOrdersAndPayments1791738728692
   [X] 3 AddDomainFieldsToOrdersAndPayments1791814820800
   [X] 4 UseDatabaseTimestamps1791814929531
   [X] 5 AddUpdatedAtTriggers1791815040413
   ```

---

## 5. Resultados e Pendências

- **Resultado:** `AppModule` e `src/database/data-source.ts` estão configurados com `synchronize: false`, `ProductOrmEntity` registrada e histórico de migrations de `celilac_db` consistente.
- **Próximo passo:** Documentar a entidade ORM `ProductOrmEntity`, a migration `CreateProductsTable1794255600000` e o `ProductMapper` no Artefato `09-04`.

