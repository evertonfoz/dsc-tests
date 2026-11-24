import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createValidationPipe } from '../../../common/config/validation-pipe.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { DomainHttpExceptionFilter } from '../../../common/filters/domain-http-exception.filter.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { PRODUCTS_REPOSITORY } from '../repositories/products.repository.interface.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_ID = '22222222-2222-4222-8222-222222222222';
const MISSING_ID = '99999999-9999-4999-8999-999999999999';

async function createApp(providers: object[]): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    controllers: [ProductsController],
    providers: [
      ...providers,
      { provide: APP_FILTER, useClass: DomainHttpExceptionFilter },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  app.useGlobalPipes(createValidationPipe());
  await app.init();
  return app;
}

describe('PUT /products/:productId (UC15), com serviço real e repositório em memória', () => {
  let app: INestApplication<App>;
  let repository: InMemoryProductsRepository;

  beforeEach(async () => {
    repository = new InMemoryProductsRepository();
    app = await createApp([
      ProductsService,
      { provide: PRODUCTS_REPOSITORY, useValue: repository },
    ]);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 200 with only productId and the new name, and persist it (CA01, CA02, CA03)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const response = await request(app.getHttpServer())
      .put(`/products/${PRODUCT_ID}`)
      .send({ name: 'Leite integral' })
      .expect(200);

    expect(response.body).toEqual({
      productId: PRODUCT_ID,
      name: 'Leite integral',
    });
    const reread = await request(app.getHttpServer())
      .get(`/products/${PRODUCT_ID}`)
      .expect(200);
    expect(reread.body.name).toBe('Leite integral');
  });

  it('should ignore productId and deletedAt sent in the body (CA04, FA05)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const response = await request(app.getHttpServer())
      .put(`/products/${PRODUCT_ID}`)
      .send({
        name: 'Leite integral',
        productId: OTHER_ID,
        deletedAt: '2026-11-01T00:00:00Z',
      })
      .expect(200);

    expect(response.body).toEqual({
      productId: PRODUCT_ID,
      name: 'Leite integral',
    });
    await request(app.getHttpServer()).get(`/products/${OTHER_ID}`).expect(404);
    await request(app.getHttpServer())
      .get(`/products/${PRODUCT_ID}`)
      .expect(200);
  });

  it('should return 200 when the new name equals the current one (CA09)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const response = await request(app.getHttpServer())
      .put(`/products/${PRODUCT_ID}`)
      .send({ name: 'Leite sem lactose' })
      .expect(200);

    expect(response.body.name).toBe('Leite sem lactose');
  });

  it('should return 404 in the domain error format when the product does not exist (CA05)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/products/${MISSING_ID}`)
      .send({ name: 'Novo nome' })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: `Product with id "${MISSING_ID}" was not found.`,
      error: 'ProductNotFoundException',
    });
  });

  it('should return 404 for a removed product and leave it unchanged (CA06)', async () => {
    const removedAt = new Date('2026-11-01T00:00:00Z');
    await repository.save(new Product(PRODUCT_ID, 'Removido', removedAt));

    const response = await request(app.getHttpServer())
      .put(`/products/${PRODUCT_ID}`)
      .send({ name: 'Novo nome' })
      .expect(404);

    expect(response.body.error).toBe('ProductNotFoundException');
    const stored = (repository as unknown as { products: Product[] }).products;
    expect(stored).toEqual([new Product(PRODUCT_ID, 'Removido', removedAt)]);
  });

  it.each([
    ['missing', {}],
    ['not a string', { name: 123 }],
    ['empty', { name: '' }],
    ['only spaces', { name: '   ' }],
    ['121 characters', { name: 'a'.repeat(121) }],
  ])(
    'should return 400 in the ValidationPipe format for a name that is %s and keep the old name (CA08)',
    async (_label, body) => {
      await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

      const response = await request(app.getHttpServer())
        .put(`/products/${PRODUCT_ID}`)
        .send(body)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.error).toBe('Bad Request');
      expect(Array.isArray(response.body.message)).toBe(true);
      const reread = await request(app.getHttpServer())
        .get(`/products/${PRODUCT_ID}`)
        .expect(200);
      expect(reread.body.name).toBe('Leite sem lactose');
    },
  );
});

describe('PUT /products/:productId (UC15), com serviço simulado', () => {
  let app: INestApplication<App>;
  const serviceMock = { updateProductName: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createApp([
      { provide: ProductsService, useValue: serviceMock },
    ]);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA07)', async () => {
    const response = await request(app.getHttpServer())
      .put('/products/abc')
      .send({ name: 'Novo nome' })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['productId must be a valid UUID.'],
      error: 'Bad Request',
    });
    expect(serviceMock.updateProductName).not.toHaveBeenCalled();
  });

  it('should return 500 with a generic message and no cause details (CA10)', async () => {
    serviceMock.updateProductName.mockRejectedValue(
      new ProductPersistenceFailedException(
        new Error('connection refused at 10.0.0.5:5432'),
        'Product update could not be completed.',
      ),
    );

    const response = await request(app.getHttpServer())
      .put(`/products/${PRODUCT_ID}`)
      .send({ name: 'Novo nome' })
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Product update could not be completed.',
      error: 'ProductPersistenceFailedException',
    });
    expect(JSON.stringify(response.body)).not.toMatch(/10\.0\.0\.5|5432/);
  });
});
