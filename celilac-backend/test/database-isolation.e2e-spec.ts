import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';

// Guarda permanente de isolamento (AGENTS.md, regra 16): o E2E só pode usar o banco de TESTES.
describe('Isolamento do banco no E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    await app.close();
  });

  it('conecta ao banco de testes configurado em TEST_DB_*', async () => {
    const options = dataSource.options as { database?: string; port?: number };
    expect(options.database).toBe(process.env.TEST_DB_NAME);
    expect(Number(options.port)).toBe(Number(process.env.TEST_DB_PORT));

    const [row] = await dataSource.query('SELECT current_database() AS name');
    expect(row.name).toBe(process.env.TEST_DB_NAME);
    expect(String(row.name).endsWith('_test')).toBe(true);
  });
});
