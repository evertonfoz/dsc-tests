import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { createValidationPipe } from '../../src/common/config/validation-pipe.js';

// Achado A7 da Fase F (CA03, RN03, RF04): uma requisição rejeitada não deixa linha no banco REAL (somente o banco de TESTES; guardas do vitest.config.e2e.ts).
describe('Rejeição não grava no banco (POST /products, banco real de testes)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const marcador = `rejeitado-${Date.now()}-`;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    await app.close();
  });

  const contar = async (filtroSql: string, parametros: unknown[] = []): Promise<number> => {
    const linhas = await dataSource.query(`SELECT count(*)::int AS total FROM "products"."products" WHERE ${filtroSql}`, parametros);
    return linhas[0].total;
  };

  it('should not store a product when the name is empty or blank (CA03)', async () => {
    await request(app.getHttpServer()).post('/products').send({ name: '' }).expect(400);
    await request(app.getHttpServer()).post('/products').send({ name: '   ' }).expect(400);
    await request(app.getHttpServer()).post('/products').send({}).expect(400);

    expect(await contar(`"name" ~ '^\\s*$'`)).toBe(0);
  });

  it('should not store a product when the name has more than 120 characters (CA03)', async () => {
    const nomeLongo = (marcador + 'x'.repeat(200)).slice(0, 121);

    await request(app.getHttpServer()).post('/products').send({ name: nomeLongo }).expect(400);

    expect(await contar(`"name" LIKE $1`, [`${marcador}%`])).toBe(0);
  });
});
