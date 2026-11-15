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

    await dataSource.query('TRUNCATE TABLE "products"');
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
      'SELECT "productId", "name" FROM "products" WHERE "productId" = $1',
      [product.productId],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      productId: product.productId,
      name: 'Farinha de Amêndoas Sem Glúten',
    });
  });
});
