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

describe('DELETE /products/:productId (UC16), com serviço real e repositório em memória', () => {
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

  it('should return 204 without a body and make the product disappear (CA01, CA02)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const response = await request(app.getHttpServer())
      .delete(`/products/${PRODUCT_ID}`)
      .expect(204);

    expect(response.text).toBe('');
    expect(response.body).toEqual({});
    await request(app.getHttpServer()).get(`/products/${PRODUCT_ID}`).expect(404);
  });

  it('should ignore any body sent with the request (CA10, FA04)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    await repository.save(new Product(OTHER_ID, 'Pão sem glúten'));

    await request(app.getHttpServer())
      .delete(`/products/${PRODUCT_ID}`)
      .send({ productId: OTHER_ID, name: 'x', deletedAt: null })
      .expect(204);

    await request(app.getHttpServer()).get(`/products/${PRODUCT_ID}`).expect(404);
    await request(app.getHttpServer()).get(`/products/${OTHER_ID}`).expect(200);
  });

  it('should return 404 in the domain error format when the product does not exist (CA07, FA01)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/products/${MISSING_ID}`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: `Product with id "${MISSING_ID}" was not found.`,
      error: 'ProductNotFoundException',
    });
  });

  it('should return 404 for an already removed product and keep its deletedAt (CA08, FA02)', async () => {
    const removedAt = new Date('2026-11-01T00:00:00Z');
    await repository.save(new Product(PRODUCT_ID, 'Removido', removedAt));

    const response = await request(app.getHttpServer())
      .delete(`/products/${PRODUCT_ID}`)
      .expect(404);

    expect(response.body.error).toBe('ProductNotFoundException');
    const stored = (repository as unknown as { products: Product[] }).products;
    expect(stored).toEqual([new Product(PRODUCT_ID, 'Removido', removedAt)]);
  });

  it('should return 404 on the second of two consecutive removals (CA08, RN07)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    await request(app.getHttpServer()).delete(`/products/${PRODUCT_ID}`).expect(204);
    await request(app.getHttpServer()).delete(`/products/${PRODUCT_ID}`).expect(404);
  });
});

describe('DELETE /products/:productId (UC16), com serviço simulado', () => {
  let app: INestApplication<App>;
  const serviceMock = { removeProduct: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createApp([{ provide: ProductsService, useValue: serviceMock }]);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA09, FA03)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/products/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['productId must be a valid UUID.'],
      error: 'Bad Request',
    });
    expect(serviceMock.removeProduct).not.toHaveBeenCalled();
  });

  it('should return 500 with a generic message and no cause details (CA11, FE01)', async () => {
    serviceMock.removeProduct.mockRejectedValue(
      new ProductPersistenceFailedException(
        new Error('connection refused at 10.0.0.5:5432'),
        'Product removal could not be completed.',
      ),
    );

    const response = await request(app.getHttpServer())
      .delete(`/products/${PRODUCT_ID}`)
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Product removal could not be completed.',
      error: 'ProductPersistenceFailedException',
    });
    expect(JSON.stringify(response.body)).not.toMatch(/10\.0\.0\.5|5432/);
  });
});
