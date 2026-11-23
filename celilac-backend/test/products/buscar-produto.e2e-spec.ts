import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { createValidationPipe } from '../../src/common/config/validation-pipe.js';

// UC14 — GET /products/:productId com a aplicação completa e o banco de TESTES (sem mocks).
describe('GET /products/:productId (UC14, e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const criados: string[] = [];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    for (const id of criados) {
      await dataSource.query(
        'DELETE FROM "products"."products" WHERE "productId" = $1',
        [id],
      );
    }
    await app.close();
  });

  async function criarProduto(name: string): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name })
      .expect(201);
    criados.push(res.body.productId);
    return res.body.productId;
  }

  it('should return 200 with exactly productId and name for an active product (CA01, CA02)', async () => {
    const id = await criarProduto('Biscoito sem glúten UC14');

    const res = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200);

    expect(res.body).toEqual({
      productId: id,
      name: 'Biscoito sem glúten UC14',
    });
  });

  it('should return 404 for a UUID without a product (CA03)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/products/${randomUUID()}`)
      .expect(404);

    expect(res.body.error).toBe('ProductNotFoundException');
  });

  it('should return 404 for a soft-deleted product (CA04)', async () => {
    const id = await criarProduto('Removido UC14');
    await dataSource.query(
      'UPDATE "products"."products" SET "deletedAt" = now() WHERE "productId" = $1',
      [id],
    );

    const res = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(404);

    expect(res.body.error).toBe('ProductNotFoundException');
  });

  it('should return 400 in the ValidationPipe format for a non-UUID id (CA05)', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/abc')
      .expect(400);

    expect(res.body).toEqual({
      statusCode: 400,
      message: ['productId must be a valid UUID.'],
      error: 'Bad Request',
    });
  });

  it('should keep GET /products (UC13) and POST /products (UC12) working (CA07)', async () => {
    await request(app.getHttpServer()).get('/products').expect(200);
    await criarProduto('Regressão UC12 UC14');
  });
});
