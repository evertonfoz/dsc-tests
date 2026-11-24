import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { createValidationPipe } from '../../src/common/config/validation-pipe.js';

// UC16 — DELETE /products/:productId com a aplicação completa e o banco de TESTES (sem mocks).
describe('DELETE /products/:productId (UC16, e2e)', () => {
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

  async function linha(id: string) {
    const rows = await dataSource.query<
      Array<{ name: string; deletedAt: Date | null }>
    >(
      'SELECT "name", "deletedAt" FROM "products"."products" WHERE "productId" = $1',
      [id],
    );
    return rows[0];
  }

  it('should return 204 without a body, keep the row with deletedAt and hide it from get, list and update (CA01 a CA04, CA06)', async () => {
    const id = await criarProduto('Biscoito sem glúten UC16');
    const outro = await criarProduto('Pão sem glúten UC16');

    const res = await request(app.getHttpServer())
      .delete(`/products/${id}`)
      .expect(204);

    expect(res.text).toBe('');
    const row = await linha(id);
    expect(row.name).toBe('Biscoito sem glúten UC16');
    expect(row.deletedAt).toBeInstanceOf(Date);
    await request(app.getHttpServer()).get(`/products/${id}`).expect(404);
    await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Novo nome' })
      .expect(404);
    const list = await request(app.getHttpServer())
      .get('/products?limit=100')
      .expect(200);
    const ids = (list.body.items as Array<{ productId: string }>).map(
      (item) => item.productId,
    );
    expect(ids).not.toContain(id);
    expect(ids).toContain(outro);
    expect((await linha(outro)).deletedAt).toBeNull();
  });

  it('should return 404 on a second removal and keep the original deletedAt (CA08)', async () => {
    const id = await criarProduto('Removido duas vezes UC16');
    await request(app.getHttpServer()).delete(`/products/${id}`).expect(204);
    const first = (await linha(id)).deletedAt;

    const res = await request(app.getHttpServer())
      .delete(`/products/${id}`)
      .expect(404);

    expect(res.body.error).toBe('ProductNotFoundException');
    expect((await linha(id)).deletedAt).toEqual(first);
  });

  it('should return 400 for an invalid id and 404 for an unknown UUID (CA07, CA09)', async () => {
    await request(app.getHttpServer()).delete('/products/abc').expect(400);
    await request(app.getHttpServer())
      .delete('/products/99999999-9999-4999-8999-999999999999')
      .expect(404);
  });

  it('should ignore the request body (CA10)', async () => {
    const id = await criarProduto('Corpo ignorado UC16');

    await request(app.getHttpServer())
      .delete(`/products/${id}`)
      .send({ name: 'x', deletedAt: null })
      .expect(204);

    const row = await linha(id);
    expect(row.name).toBe('Corpo ignorado UC16');
    expect(row.deletedAt).toBeInstanceOf(Date);
  });
});
