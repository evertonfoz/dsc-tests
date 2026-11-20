import 'dotenv/config';
import { createTestDataSource } from '../../src/database/test-data-source.js';
import { assertSafeTestDbEnv } from './test-db-env.js';

// Roda uma vez antes da suíte E2E: prepara o schema do banco de TESTES.
export default async function setup(): Promise<void> {
  assertSafeTestDbEnv(process.env);

  const dataSource = createTestDataSource({ includeOrders: true });
  await dataSource.initialize();
  try {
    // A migration CreateOrders usa uuid_generate_v4(), mas nenhuma migration cria a extensão.
    // Em um banco novo (ex.: CI) ela precisa existir antes. IF NOT EXISTS torna isto idempotente.
    await dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await dataSource.runMigrations();
  } finally {
    await dataSource.destroy();
  }
}
