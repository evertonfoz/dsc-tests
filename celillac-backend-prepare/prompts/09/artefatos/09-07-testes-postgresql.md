# ARTEFATO 09-07 — TESTES AUTOMATIZADOS COM POSTGRESQL REAL

## 1. Separação de Suítes e Configuração do Vitest

Para manter as quatro categorias de testes estritamente separadas (unitários, HTTP simulados, integrados em memória e integrados com PostgreSQL real), foram configurados:

### 1.1 `vitest.integration.config.ts` (Exclusivo para Testes com PostgreSQL Real)
```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.postgres.spec.ts'],
  },
});
```

### 1.2 `vitest.config.ts` (Preservado para Testes Unitários e Integrados em Memória)
```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '**/*.postgres.spec.ts'],
  },
});
```

### 1.3 Script Adicionado em `package.json`
```json
"test": "vitest run",
"test:integration": "vitest run --config ./vitest.integration.config.ts"
```

---

## 2. `DataSource` Seguro do Banco de Testes (`src/database/test-data-source.ts`)

```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../infrastructure/persistence/products/product.orm-entity.js';
import { CreateProductsTable1794255600000 } from './migrations/1794255600000-CreateProductsTable.js';

export function createTestDataSource(): DataSource {
  const host = process.env.TEST_DB_HOST;
  const port = Number(process.env.TEST_DB_PORT);
  const username = process.env.TEST_DB_USERNAME;
  const password = process.env.TEST_DB_PASSWORD;
  const database = process.env.TEST_DB_NAME;

  if (!host || !port || !username || !password || !database) {
    throw new Error(
      'Variáveis TEST_DB_* ausentes. Configure um banco de testes exclusivo antes de executar a suíte PostgreSQL.',
    );
  }

  if (
    !database.endsWith('_test') ||
    database === process.env.DB_NAME ||
    username === process.env.DB_USERNAME ||
    port === Number(process.env.DB_PORT)
  ) {
    throw new Error(
      'Configuração insegura: o banco, usuário e porta de testes devem ser exclusivos e distintos do ambiente de desenvolvimento.',
    );
  }

  return new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [ProductOrmEntity],
    migrations: [CreateProductsTable1794255600000],
    synchronize: false,
  });
}
```

### Características Técnicas do `createTestDataSource`:
1. **`entities: [ProductOrmEntity]` e `migrations: [CreateProductsTable1794255600000]`:** Registra explicitamente a classe real da entidade ORM e da migration implementada, sem misturar globs incompatíveis.
2. **`synchronize: false`:** Garante que a tabela `products` no banco de testes seja criada exclusivamente pela migration `CreateProductsTable1794255600000`.
3. **Bloqueio preventivo:** Impede a criação do `DataSource` caso `TEST_DB_NAME` não termine com `_test` ou coincida em nome, usuário ou porta com o banco de desenvolvimento (`DB_*`).

---

## 3. Código Completo do Teste PostgreSQL (`src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts`)

Consolidado em um único arquivo válido TypeScript/ESM, com todos os imports explícitos e sem uso de mocks para o repositório ou banco:

```typescript
import { randomUUID } from 'node:crypto';
import { DataSource, type Repository } from 'typeorm';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { createTestDataSource } from '../../../database/test-data-source.js';
import { Product } from '../../../modules/products/entities/product.entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';
import { TypeOrmProductsRepository } from './typeorm-products.repository.js';

interface ConnectionIdentityRow {
  name: string;
  usuario: string;
  porta: number | null;
}

interface ProductRow {
  productId: string;
  name: string;
}

describe('TypeOrmProductsRepository — persistência real no PostgreSQL', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<ProductOrmEntity>;
  let repository: TypeOrmProductsRepository;
  let isSafeTestEnvironment = false;

  beforeAll(async () => {
    dataSource = createTestDataSource();

    try {
      await dataSource.initialize();

      const identityRows = await dataSource.query<ConnectionIdentityRow[]>(`
        SELECT
          current_database() AS name,
          current_user AS usuario,
          inet_server_port() AS porta;
      `);

      const identity = identityRows[0];

      expect(identity).toBeDefined();
      expect(identity.name).toBe(process.env.TEST_DB_NAME);
      expect(identity.name).toBe('celilac_test');
      expect(identity.usuario).toBe(process.env.TEST_DB_USERNAME);
      expect(identity.usuario).toBe('celilac_test');

      // Distinção entre a porta configurada no cliente (host: 5435)
      // e a porta interna do servidor PostgreSQL no contêiner (5432).
      const configuredClientPort = (
        dataSource.options as { port?: number }
      ).port;
      expect(configuredClientPort).toBe(Number(process.env.TEST_DB_PORT));
      expect(Number(identity.porta)).toBe(5432);

      isSafeTestEnvironment =
        identity.name === 'celilac_test' &&
        identity.usuario === 'celilac_test' &&
        configuredClientPort === Number(process.env.TEST_DB_PORT) &&
        process.env.TEST_DB_ALLOW_DESTRUCTIVE === 'true';

      if (!isSafeTestEnvironment) {
        throw new Error(
          'Ambiente de banco de testes não validado para execução de migrations ou limpeza.',
        );
      }

      await dataSource.runMigrations();

      ormRepository = dataSource.getRepository(ProductOrmEntity);
      repository = new TypeOrmProductsRepository(ormRepository);
    } catch (error) {
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
      throw error;
    }
  });

  beforeEach(async () => {
    if (
      !dataSource?.isInitialized ||
      !isSafeTestEnvironment ||
      process.env.TEST_DB_ALLOW_DESTRUCTIVE !== 'true'
    ) {
      throw new Error(
        'Operação TRUNCATE bloqueada: condições de segurança do banco de testes não atendidas.',
      );
    }

    await dataSource.query('TRUNCATE TABLE "products"."products"');
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco', async () => {
    const product = new Product(
      randomUUID(),
      'Farinha de Amêndoas Sem Glúten',
    );

    const savedProduct = await repository.save(product);

    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct.productId).toBe(product.productId);
    expect(savedProduct.name).toBe('Farinha de Amêndoas Sem Glúten');

    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "productId", "name" FROM "products"."products" WHERE "productId" = $1',
      [product.productId],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      productId: product.productId,
      name: 'Farinha de Amêndoas Sem Glúten',
    });
  });
});
```

---

## 4. Salvaguardas de Segurança Aplicadas Antes das Migrations e do `TRUNCATE`

1. **Verificação em duas camadas da conexão:**
   - **No cliente (`dataSource.options.port`):** Confirma que o cliente conectou-se à porta publicada no host (`TEST_DB_PORT = 5435`).
   - **No servidor (`SELECT current_database(), current_user, inet_server_port()`):** Confirma que o banco ativo é `celilac_test`, o usuário é `celilac_test` e a porta interna do processo PostgreSQL no contêiner é `5432`.
2. **Condições cumulativas para `runMigrations()` e `TRUNCATE TABLE "products"."products"`:**
   - A variável `TEST_DB_ALLOW_DESTRUCTIVE=true` **não é tratada isoladamente como garantia**: ela é combinada com a validação prévia em `createTestDataSource()` (banco terminado em `_test` e distinto de `DB_NAME`, usuário distinto de `DB_USERNAME`, porta distinta de `DB_PORT`), com a confirmação da identidade SQL do servidor (`celilac_test`) e com a autorização explícita obtida.
3. **Encerramento seguro de conexões:**
   - Caso qualquer asserção ou migration falhe dentro de `beforeAll`, o bloco `catch` verifica `if (dataSource?.isInitialized) await dataSource.destroy()`, evitando vazamento de conexões mesmo antes de `afterAll`.

---

## 5. Execução Real e Resultados Observados

### 5.1 Execução da Suíte de Integração PostgreSQL (`pnpm test:integration`)
- **Comando executado:**
  ```bash
  pnpm test:integration
  ```
- **Saída real observada:**
  ```text
  $ vitest run --config ./vitest.integration.config.ts

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 71ms
     ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
       ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 18ms

   Test Files  1 passed (1)
        Tests  1 passed (1)
     Start at  21:31:27
     Duration  290ms (transform 25ms, setup 0ms, import 163ms, tests 71ms, environment 0ms)
  ```

### 5.2 Evidência SQL no Banco de Testes (`celilac_test`) e Preservação do Banco de Desenvolvimento (`celilac_db`)
1. **No banco de testes (`celilac-postgres-test` — porta `5435`):**
   - Comando: `docker exec celilac-postgres-test psql -U celilac_test -d celilac_test -c "SELECT * FROM public.migrations; SELECT * FROM products.products;"`
   - Resultado:
     ```text
      id |   timestamp   |               name               
     ----+---------------+----------------------------------
       1 | 1794255600000 | CreateProductsTable1794255600000
     (1 row)

                   productId               |              name              
     --------------------------------------+--------------------------------
      18c748b6-9442-4cd1-adba-8a3285bb9a15 | Farinha de Amêndoas Sem Glúten
     (1 row)
     ```
2. **No banco de desenvolvimento (`celilac-postgres` — porta `5432`):**
   - Comando: `docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products;"`
   - Resultado:
     ```text
                   productId               |        name        
     --------------------------------------+--------------------
      256824a7-a374-4baf-8c95-492e870ee999 | Produto de exemplo
     (1 row)
     ```
   - **Comprovação de Isolamento:** O `TRUNCATE TABLE "products"."products"` executado em `beforeEach` atuou exclusivamente sobre `celilac_test` (porta `5435`), mantendo o registro `256824a7-a374-4baf-8c95-492e870ee999` de `celilac_db` (porta `5432`) 100% intacto.

### 5.3 Reexecução da Suíte Anterior (`pnpm test --run`)
- **Comando executado:**
  ```bash
  pnpm test --run
  ```
- **Saída real observada:**
  ```text
  $ vitest run --run

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/app.controller.spec.ts (1 test) 153ms
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 150ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 94ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 61ms
   ✓ src/modules/products/products.integration.spec.ts (2 tests) 54ms

   Test Files  5 passed (5)
        Tests  12 passed (12)
     Start at  17:32:18
     Duration  582ms (transform 148ms, setup 0ms, import 1.52s, tests 512ms, environment 0ms)
  ```

### 5.4 Quadro Consolidado de Testes e Regressões

| Suíte / Comando | Arquivos de Teste | Testes Executados | Aprovações | Falhas | Regressões |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Unitários + HTTP Simulado + Integrados em Memória (`pnpm test --run`)** | `5` | `12` | `12 passed (12)` | `0` | **Zero** |
| **Integração com PostgreSQL Real (`pnpm test:integration`)** | `1` | `1` | `1 passed (1)` | `0` | **Zero** |
| **Total Geral Acumulado** | **`6`** | **`13`** | **`13 passed (13)`** | **`0`** | **Zero** |

---

## 6. Pendências

- Nenhuma pendência nos testes automatizados com PostgreSQL real ou nas suítes anteriores.

