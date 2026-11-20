import 'dotenv/config';
import { createTestDataSource } from '../../src/database/test-data-source.js';
import { assertSafeTestDbEnv } from './test-db-env.js';

// Roda uma vez antes da suíte E2E: prepara o schema do banco de TESTES.
export default async function setup(): Promise<void> {
  assertSafeTestDbEnv(process.env);

  const dataSource = createTestDataSource({ includeOrders: true });
  await dataSource.initialize();
  try {
    // A migration EnableUuidOssp cria a extensão antes de CreateOrders (banco novo, ex.: CI).
    await dataSource.runMigrations();
  } finally {
    await dataSource.destroy();
  }
}
