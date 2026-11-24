import { randomUUID } from 'node:crypto';
import { DataSource, type Repository } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestDataSource } from '../../../database/test-data-source.js';
import { Product } from '../../../modules/products/entities/product.entity.js';
import { InMemoryProductsRepository } from '../../../modules/products/repositories/in-memory-products.repository.js';
import { ProductsService } from '../../../modules/products/services/products.service.js';
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
      const configuredClientPort = (dataSource.options as { port?: number })
        .port;
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
    const product = new Product(randomUUID(), 'Farinha de Amêndoas Sem Glúten');

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

  it('should report an incomplete operation when the real database rejects the insert (FE01)', async () => {
    const service = new ProductsService(repository);
    // O PostgreSQL rejeita o caractere NUL em texto (22021): falha real de banco que o núcleo ainda não barra.
    const nameRejectedByDatabase = 'Produto\u0000com NUL';

    const result = service.createProduct(nameRejectedByDatabase);

    await expect(result).rejects.toMatchObject({
      name: 'ProductPersistenceFailedException',
    });
    await expect(result).rejects.not.toThrow(
      /invalid byte sequence|0x00|encoding|utf8/i,
    );

    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "productId" FROM "products"."products"',
    );
    expect(rows).toHaveLength(0);
  });

  it('should list only active products with the real database, excluding soft-deleted ones from the total (CA05)', async () => {
    await repository.save(new Product(randomUUID(), 'Ativo A'));
    await repository.save(new Product(randomUUID(), 'Ativo B'));
    await dataSource.query(
      'INSERT INTO "products"."products" ("productId", "name", "deletedAt") VALUES ($1, $2, now())',
      [randomUUID(), 'Removido'],
    );

    const page = await new ProductsService(repository).listProducts();

    expect(page.items.map((product) => product.name)).toEqual([
      'Ativo A',
      'Ativo B',
    ]);
    expect(page.total).toBe(2);
    expect(page.items.every((product) => product.deletedAt === null)).toBe(
      true,
    );
  });

  it('should order by name then productId and paginate without gaps in the real database (CA04, CA08)', async () => {
    const ids = [
      '00000000-0000-4000-8000-000000000003',
      '00000000-0000-4000-8000-000000000002',
      '00000000-0000-4000-8000-000000000001',
    ];
    await repository.save(new Product(ids[0], 'Banana'));
    await repository.save(new Product(ids[1], 'Arroz'));
    await repository.save(new Product(ids[2], 'Arroz'));
    const service = new ProductsService(repository);

    const first = await service.listProducts({ page: 1, limit: 2 });
    const second = await service.listProducts({ page: 2, limit: 2 });

    expect(first.items.map((product) => product.productId)).toEqual([
      ids[2],
      ids[1],
    ]);
    expect(second.items.map((product) => product.productId)).toEqual([ids[0]]);
    expect(first.total).toBe(3);
  });

  it('should keep rows created without deletedAt active after the UC13 migration (CA11)', async () => {
    const productId = randomUUID();
    await dataSource.query(
      'INSERT INTO "products"."products" ("productId", "name") VALUES ($1, $2)',
      [productId, 'Sem deletedAt informado'],
    );

    const rows = await dataSource.query<Array<{ deletedAt: Date | null }>>(
      'SELECT "deletedAt" FROM "products"."products" WHERE "productId" = $1',
      [productId],
    );

    expect(rows[0].deletedAt).toBeNull();
  });

  it('should revert and reapply the UC13 migration, keeping existing products (CA11)', async () => {
    const productId = randomUUID();
    await repository.save(new Product(productId, 'Produto anterior'));

    const columnExists = async (): Promise<boolean> => {
      const rows = await dataSource.query<unknown[]>(
        `SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'products' AND table_name = 'products' AND column_name = 'deletedAt'`,
      );
      return rows.length === 1;
    };

    expect(await columnExists()).toBe(true);
    try {
      // Banco de testes validado em beforeAll (TEST_DB_ALLOW_DESTRUCTIVE=true).
      await dataSource.undoLastMigration();
      expect(await columnExists()).toBe(false);
    } finally {
      await dataSource.runMigrations();
    }

    expect(await columnExists()).toBe(true);
    const rows = await dataSource.query<Array<{ deletedAt: Date | null }>>(
      'SELECT "deletedAt" FROM "products"."products" WHERE "productId" = $1',
      [productId],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].deletedAt).toBeNull();
  });

  it('should order names linguistically in the real database, with the same order as the in-memory adapter (CA08)', async () => {
    const names = ['arroz', 'Banana', 'Ácido', 'Zebra', 'abacaxi'];
    for (const name of names) {
      await repository.save(new Product(randomUUID(), name));
    }

    const page = await new ProductsService(repository).listProducts();

    // Depende da collation do banco de testes (en_US.utf8, verificada em 2026-11-23).
    expect(page.items.map((product) => product.name)).toEqual([
      'abacaxi',
      'Ácido',
      'arroz',
      'Banana',
      'Zebra',
    ]);
  });

  it('should pin the ICU pt-BR collation instead of the database default, so spaces are not ignored (CA08)', async () => {
    // A collation padrão do banco (glibc en_US) ignora o espaço no 1º nível ("AA" < "A B");
    // a ICU pt-BR não ignora ("A B" < "AA").
    await repository.save(new Product(randomUUID(), 'AA'));
    await repository.save(new Product(randomUUID(), 'A B'));

    const page = await new ProductsService(repository).listProducts();

    expect(page.items.map((product) => product.name)).toEqual(['A B', 'AA']);
  });

  it('should list names in the same order in the in-memory and PostgreSQL adapters (parity, CA08)', async () => {
    const names = [
      'abacaxi',
      'Ácido',
      'arroz',
      'Banana',
      'Zebra',
      'A B',
      'AA',
      'a-b',
      'ab',
      'Água',
      'água',
      'Agua',
      'Éclair',
      'eclair',
      'Eclair',
      '10 itens',
      '2 itens',
      '_x',
      'Ñandu',
      'nata',
      'Nata',
      'ça',
      'cb',
    ];
    const memory = new InMemoryProductsRepository();
    for (const [index, name] of names.entries()) {
      const product = new Product(
        `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
        name,
      );
      await repository.save(product);
      await memory.save(product);
    }
    const query = { offset: 0, limit: names.length };

    const fromDatabase = await repository.findActivePage(query);
    const fromMemory = await memory.findActivePage(query);

    expect(fromMemory.items.map((product) => product.name)).toEqual(
      fromDatabase.items.map((product) => product.name),
    );
  });

  it('should find an active product by productId in the real database (UC14, CA01)', async () => {
    const product = new Product(randomUUID(), 'Pão sem glúten');
    await repository.save(product);
    await repository.save(new Product(randomUUID(), 'Outro produto'));

    const found = await repository.findActiveById(product.productId);

    expect(found).toBeInstanceOf(Product);
    expect(found?.productId).toBe(product.productId);
    expect(found?.name).toBe('Pão sem glúten');
  });

  it('should return null for a productId that does not exist in the real database (UC14, CA03)', async () => {
    const found = await repository.findActiveById(randomUUID());

    expect(found).toBeNull();
  });

  it('should return null for a soft-deleted product in the real database (UC14, CA04)', async () => {
    const product = new Product(
      randomUUID(),
      'Removido',
      new Date('2026-11-01T00:00:00Z'),
    );
    await repository.save(product);

    const found = await repository.findActiveById(product.productId);

    expect(found).toBeNull();
  });

  it('should throw ProductNotFoundException through the service for a removed product with the real database (UC14, CA04)', async () => {
    const service = new ProductsService(repository);
    const product = new Product(
      randomUUID(),
      'Removido',
      new Date('2026-11-01T00:00:00Z'),
    );
    await repository.save(product);

    const result = service.getProductById(product.productId);

    await expect(result).rejects.toMatchObject({
      name: 'ProductNotFoundException',
    });
  });

  it('should report a lookup failure when the real database rejects the query, without leaking details (UC14, CA06)', async () => {
    const service = new ProductsService(repository);

    // O PostgreSQL rejeita texto que não é UUID em coluna uuid (22P02): falha real de banco, não "não encontrado".
    const result = service.getProductById('not-a-uuid');

    await expect(result).rejects.toMatchObject({
      name: 'ProductLookupFailedException',
    });
    await expect(result).rejects.not.toThrow(/invalid input syntax|uuid/i);
  });

  it('should not create or alter rows when searching (UC14, CA08)', async () => {
    const product = new Product(randomUUID(), 'Intacto');
    await repository.save(product);
    const before = await dataSource.query<ProductRow[]>(
      'SELECT "productId", "name", "deletedAt" FROM "products"."products"',
    );

    await repository.findActiveById(product.productId);
    await repository.findActiveById(randomUUID());

    const after = await dataSource.query<ProductRow[]>(
      'SELECT "productId", "name", "deletedAt" FROM "products"."products"',
    );
    expect(after).toEqual(before);
  });

  it('should change only the name of the active product in the real database and keep the other rows (UC15, CA01, CA03, CA04)', async () => {
    const productId = randomUUID();
    const otherId = randomUUID();
    await repository.save(new Product(productId, 'Leite sem lactose'));
    await repository.save(new Product(otherId, 'Outro produto'));

    const updated = await new ProductsService(repository).updateProductName(
      productId,
      'Leite integral',
    );

    expect(updated.productId).toBe(productId);
    expect(updated.name).toBe('Leite integral');
    expect(updated.deletedAt).toBeNull();
    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "productId", "name", "deletedAt" FROM "products"."products" ORDER BY "name"',
    );
    expect(rows).toEqual([
      { productId, name: 'Leite integral', deletedAt: null },
      { productId: otherId, name: 'Outro produto', deletedAt: null },
    ]);
  });

  it('should not alter a removed product in the real database and report it as not found (UC15, CA06)', async () => {
    const productId = randomUUID();
    await dataSource.query(
      'INSERT INTO "products"."products" ("productId", "name", "deletedAt") VALUES ($1, $2, now())',
      [productId, 'Removido'],
    );

    const result = new ProductsService(repository).updateProductName(
      productId,
      'Novo nome',
    );

    await expect(result).rejects.toMatchObject({
      name: 'ProductNotFoundException',
    });
    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "name" FROM "products"."products" WHERE "productId" = $1',
      [productId],
    );
    expect(rows).toEqual([{ name: 'Removido' }]);
  });

  it('should report an incomplete update when the real database rejects it, leaving the name unchanged (UC15, CA10)', async () => {
    const productId = randomUUID();
    await repository.save(new Product(productId, 'Leite sem lactose'));
    // O PostgreSQL rejeita o caractere NUL em texto (22021): falha real de banco que o núcleo ainda não barra.
    const result = new ProductsService(repository).updateProductName(
      productId,
      'Produto\u0000com NUL',
    );

    await expect(result).rejects.toMatchObject({
      name: 'ProductPersistenceFailedException',
    });
    await expect(result).rejects.not.toThrow(
      /invalid byte sequence|0x00|encoding|utf8/i,
    );
    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "name" FROM "products"."products" WHERE "productId" = $1',
      [productId],
    );
    expect(rows).toEqual([{ name: 'Leite sem lactose' }]);
  });

  it('should keep the last name after two sequential updates in the real database (UC15, CA11)', async () => {
    const productId = randomUUID();
    await repository.save(new Product(productId, 'Leite sem lactose'));
    const service = new ProductsService(repository);

    await service.updateProductName(productId, 'Primeiro');
    await service.updateProductName(productId, 'Segundo');

    const rows = await dataSource.query<ProductRow[]>(
      'SELECT "name" FROM "products"."products" WHERE "productId" = $1',
      [productId],
    );
    expect(rows).toEqual([{ name: 'Segundo' }]);
  });

  describe('remoção lógica no PostgreSQL (UC16)', () => {
    interface RemovalRow {
      productId: string;
      name: string;
      deletedAt: Date | null;
    }

    async function allRows(): Promise<RemovalRow[]> {
      return dataSource.query<RemovalRow[]>(
        'SELECT "productId", "name", "deletedAt" FROM "products"."products" ORDER BY "name"',
      );
    }

    it('should mark only the target row with deletedAt and keep productId, name and the other rows (UC16, CA05, CA06, RN01)', async () => {
      const productId = randomUUID();
      const otherId = randomUUID();
      await repository.save(new Product(productId, 'Leite sem lactose'));
      await repository.save(new Product(otherId, 'Outro produto'));

      await expect(
        new ProductsService(repository).removeProduct(productId),
      ).resolves.toBeUndefined();

      const rows = await allRows();
      expect(rows).toHaveLength(2);
      const removed = rows.find((row) => row.productId === productId);
      expect(removed?.name).toBe('Leite sem lactose');
      expect(removed?.deletedAt).toBeInstanceOf(Date);
      expect(rows.find((row) => row.productId === otherId)).toEqual({
        productId: otherId,
        name: 'Outro produto',
        deletedAt: null,
      });
    });

    it('should report not found and change nothing when the productId does not exist (UC16, CA07)', async () => {
      await repository.save(new Product(randomUUID(), 'Existente'));
      const before = await allRows();

      const result = new ProductsService(repository).removeProduct(
        randomUUID(),
      );

      await expect(result).rejects.toMatchObject({
        name: 'ProductNotFoundException',
      });
      expect(await allRows()).toEqual(before);
    });

    it('should report not found and keep the original deletedAt when the product was already removed (UC16, CA08, RN07)', async () => {
      const productId = randomUUID();
      await dataSource.query(
        'INSERT INTO "products"."products" ("productId", "name", "deletedAt") VALUES ($1, $2, $3)',
        [productId, 'Já removido', '2026-01-01T00:00:00Z'],
      );
      const before = await allRows();

      const result = new ProductsService(repository).removeProduct(productId);

      await expect(result).rejects.toMatchObject({
        name: 'ProductNotFoundException',
      });
      expect(await allRows()).toEqual(before);
      expect(before[0].deletedAt?.toISOString()).toBe(
        '2026-01-01T00:00:00.000Z',
      );
    });

    it('should let exactly one of two simultaneous removals succeed and keep a single deletedAt (UC16, CA12, RN08)', async () => {
      const productId = randomUUID();
      await repository.save(new Product(productId, 'Disputado'));
      const service = new ProductsService(repository);

      const results = await Promise.allSettled([
        service.removeProduct(productId),
        service.removeProduct(productId),
      ]);

      const fulfilled = results.filter((r) => r.status === 'fulfilled');
      const rejected = results.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected',
      );
      expect(fulfilled).toHaveLength(1);
      expect(rejected).toHaveLength(1);
      expect(rejected[0].reason).toMatchObject({
        name: 'ProductNotFoundException',
      });
      const rows = await allRows();
      expect(rows).toHaveLength(1);
      expect(rows[0].deletedAt).toBeInstanceOf(Date);
    });

    it('should report an incomplete removal when the real database rejects it, without leaking details (UC16, CA11, FE01)', async () => {
      const productId = randomUUID();
      await repository.save(new Product(productId, 'Intacto'));
      // Texto que não é UUID em coluna uuid (22P02): falha real de banco, não "não encontrado".
      const result = new ProductsService(repository).removeProduct(
        'not-a-uuid',
      );

      await expect(result).rejects.toMatchObject({
        name: 'ProductPersistenceFailedException',
      });
      await expect(result).rejects.not.toThrow(/invalid input syntax|uuid/i);
      expect(await allRows()).toEqual([
        { productId, name: 'Intacto', deletedAt: null },
      ]);
    });
  });
});
