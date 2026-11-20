import { writeFileSync } from 'node:fs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { createValidationPipe } from '../../src/common/config/validation-pipe.js';

// Inventário do contrato REAL de POST /products (Fase D, passo 1). Não afirma nada: só registra o que a API devolve.
// Mesma configuração de pipe do src/main.ts. Banco: somente o de TESTES (guardas do vitest.config.e2e.ts).
describe('Inventário do contrato de POST /products', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const criados: string[] = [];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    for (const id of criados) {
      await dataSource.query('DELETE FROM "products"."products" WHERE "productId" = $1', [id]);
    }
    await app.close();
  });

  const cenarios: Array<[string, () => request.Test]> = [
    ['nome válido', () => request(app.getHttpServer()).post('/products').send({ name: 'Celular XYZ' })],
    ['nome vazio', () => request(app.getHttpServer()).post('/products').send({ name: '' })],
    ['nome ausente', () => request(app.getHttpServer()).post('/products').send({})],
    ['nome null', () => request(app.getHttpServer()).post('/products').send({ name: null })],
    ['nome numérico', () => request(app.getHttpServer()).post('/products').send({ name: 123 })],
    ['nome só com espaços', () => request(app.getHttpServer()).post('/products').send({ name: '   ' })],
    ['nome com 120 caracteres', () => request(app.getHttpServer()).post('/products').send({ name: 'x'.repeat(120) })],
    ['nome com 121 caracteres', () => request(app.getHttpServer()).post('/products').send({ name: 'x'.repeat(121) })],
    ['campo extra (price)', () => request(app.getHttpServer()).post('/products').send({ name: 'Com preço', price: 10 })],
    ['JSON inválido', () => request(app.getHttpServer()).post('/products').set('Content-Type', 'application/json').send('{bad')],
    ['sem corpo', () => request(app.getHttpServer()).post('/products')],
    ['GET /products', () => request(app.getHttpServer()).get('/products')],
    ['rota inexistente', () => request(app.getHttpServer()).post('/produtos')],
  ];

  it('registra status e corpo de cada cenário', async () => {
    const linhas: string[] = [];
    for (const [nome, executar] of cenarios) {
      const res = await executar();
      if (res.status === 201 && res.body?.productId) criados.push(res.body.productId);
      const corpo = JSON.stringify(res.body).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<uuid>').slice(0, 230);
      linhas.push(`${nome.padEnd(26)} -> ${res.status} ${corpo}`);
    }
    writeFileSync(process.env.INVENTARIO_SAIDA ?? '/dev/null', linhas.join('\n') + '\n');
    expect(linhas).toHaveLength(cenarios.length);
  });
});
