import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { createValidationPipe } from '../../src/common/config/validation-pipe.js';

// UC15 — PUT /products/:productId com a aplicação completa e o banco de TESTES (sem mocks).
describe('PUT /products/:productId (UC15, e2e)', () => {
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

  async function nomeNoBanco(id: string): Promise<string | undefined> {
    const rows = await dataSource.query<Array<{ name: string }>>(
      'SELECT "name" FROM "products"."products" WHERE "productId" = $1',
      [id],
    );
    return rows[0]?.name;
  }

  it('should return 200 with exactly productId and the new name and persist it (CA01, CA02, CA03)', async () => {
    const id = await criarProduto('Biscoito sem glúten UC15');

    const res = await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Biscoito integral sem glúten UC15' })
      .expect(200);

    expect(res.body).toEqual({
      productId: id,
      name: 'Biscoito integral sem glúten UC15',
    });
    const reread = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200);
    expect(reread.body.name).toBe('Biscoito integral sem glúten UC15');
  });

  it('should ignore productId and deletedAt in the body and keep the product active (CA04)', async () => {
    const id = await criarProduto('Ignora campos UC15');

    await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({
        name: 'Ignora campos alterado UC15',
        productId: randomUUID(),
        deletedAt: '2026-11-01T00:00:00Z',
      })
      .expect(200);

    const rows = await dataSource.query<
      Array<{ productId: string; deletedAt: Date | null }>
    >(
      'SELECT "productId", "deletedAt" FROM "products"."products" WHERE "productId" = $1',
      [id],
    );
    expect(rows).toEqual([{ productId: id, deletedAt: null }]);
  });

  it('should return 200 when the new name equals the current one (CA09)', async () => {
    const id = await criarProduto('Mesmo nome UC15');

    await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Mesmo nome UC15' })
      .expect(200);
  });

  it('should return 404 for a UUID without a product (CA05)', async () => {
    const res = await request(app.getHttpServer())
      .put(`/products/${randomUUID()}`)
      .send({ name: 'Qualquer' })
      .expect(404);

    expect(res.body.error).toBe('ProductNotFoundException');
  });

  it('should return 404 for a soft-deleted product and not alter it (CA06)', async () => {
    const id = await criarProduto('Removido UC15');
    await dataSource.query(
      'UPDATE "products"."products" SET "deletedAt" = now() WHERE "productId" = $1',
      [id],
    );

    const res = await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Nao deve gravar' })
      .expect(404);

    expect(res.body.error).toBe('ProductNotFoundException');
    expect(await nomeNoBanco(id)).toBe('Removido UC15');
  });

  it('should return 400 in the ValidationPipe format for a non-UUID id (CA07)', async () => {
    const res = await request(app.getHttpServer())
      .put('/products/abc')
      .send({ name: 'Qualquer' })
      .expect(400);

    expect(res.body).toEqual({
      statusCode: 400,
      message: ['productId must be a valid UUID.'],
      error: 'Bad Request',
    });
  });

  it.each([
    ['missing', {}],
    ['empty', { name: '' }],
    ['only spaces', { name: '   ' }],
    ['121 characters', { name: 'a'.repeat(121) }],
  ])(
    'should return 400 for a name that is %s and keep the old name in the database (CA08)',
    async (_label, body) => {
      const id = await criarProduto('Nome preservado UC15');

      const res = await request(app.getHttpServer())
        .put(`/products/${id}`)
        .send(body)
        .expect(400);

      expect(res.body.error).toBe('Bad Request');
      expect(await nomeNoBanco(id)).toBe('Nome preservado UC15');
    },
  );

  it('should keep the last name after two sequential updates (CA11)', async () => {
    const id = await criarProduto('Sequencia UC15');

    await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Primeiro UC15' })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Segundo UC15' })
      .expect(200);

    expect(await nomeNoBanco(id)).toBe('Segundo UC15');
  });
});
