import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createValidationPipe } from '../../../common/config/validation-pipe.js';
import { ProductLookupFailedException } from '../../../common/exceptions/product-lookup-failed.exception.js';
import { DomainHttpExceptionFilter } from '../../../common/filters/domain-http-exception.filter.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { PRODUCTS_REPOSITORY } from '../repositories/products.repository.interface.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
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

describe('GET /products/:productId (UC14), com serviço real e repositório em memória', () => {
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

  it('should return 200 with only productId and name for an active product (CA01, CA02)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const response = await request(app.getHttpServer())
      .get(`/products/${PRODUCT_ID}`)
      .expect(200);

    expect(response.body).toEqual({
      productId: PRODUCT_ID,
      name: 'Leite sem lactose',
    });
  });

  it('should return 404 in the domain error format when the product does not exist (CA03)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${MISSING_ID}`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: `Product with id "${MISSING_ID}" was not found.`,
      error: 'ProductNotFoundException',
    });
  });

  it('should return 404 for a removed product, identical to a missing one (CA04)', async () => {
    await repository.save(
      new Product(PRODUCT_ID, 'Removido', new Date('2026-11-01T00:00:00Z')),
    );

    const response = await request(app.getHttpServer())
      .get(`/products/${PRODUCT_ID}`)
      .expect(404);

    expect(response.body.error).toBe('ProductNotFoundException');
  });
});

describe('GET /products/:productId (UC14), com serviço simulado', () => {
  let app: INestApplication<App>;
  const serviceMock = { getProductById: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createApp([
      { provide: ProductsService, useValue: serviceMock },
    ]);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA05)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['productId must be a valid UUID.'],
      error: 'Bad Request',
    });
    expect(serviceMock.getProductById).not.toHaveBeenCalled();
  });

  it('should return 500 with a generic message and no cause details (CA06)', async () => {
    serviceMock.getProductById.mockRejectedValue(
      new ProductLookupFailedException(
        new Error('connection refused at 10.0.0.5:5432'),
      ),
    );

    const response = await request(app.getHttpServer())
      .get(`/products/${PRODUCT_ID}`)
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Product lookup could not be completed.',
      error: 'ProductLookupFailedException',
    });
    expect(JSON.stringify(response.body)).not.toMatch(/10\.0\.0\.5|5432/);
  });
});
