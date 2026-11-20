import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../infrastructure/persistence/products/product.orm-entity.js';
import { CreateProductsTable1794255600000 } from './migrations/1794255600000-CreateProductsTable.js';
import { OrderEntity } from '../infrastructure/persistence/orders/order.orm-entity.js';
import { CreateOrders1792519198708 } from './migrations/1792519198708-CreateOrders.js';
import { EnableUuidOssp1792519198707 } from './migrations/1792519198707-EnableUuidOssp.js';

export interface TestDataSourceOptions {
  /** Inclui entidade e migration de `orders` (necessário ao E2E). Padrão: somente `products`. */
  includeOrders?: boolean;
}

export function createTestDataSource(
  options: TestDataSourceOptions = {},
): DataSource {
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
    entities: options.includeOrders
      ? [ProductOrmEntity, OrderEntity]
      : [ProductOrmEntity],
    migrations: options.includeOrders
      ? [
          EnableUuidOssp1792519198707,
          CreateOrders1792519198708,
          CreateProductsTable1794255600000,
        ]
      : [CreateProductsTable1794255600000],
    synchronize: false,
  });
}
