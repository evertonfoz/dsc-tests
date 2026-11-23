import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createValidationPipe } from '../../../common/config/validation-pipe.js';
import { InvalidPaginationException } from '../../../common/exceptions/invalid-pagination.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { DomainHttpExceptionFilter } from '../../../common/filters/domain-http-exception.filter.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { PRODUCTS_REPOSITORY } from '../repositories/products.repository.interface.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

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

describe('GET /products (UC13), com serviço real e repositório em memória', () => {
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

  it('should return 200 with the page envelope and only productId and name per item (CA01, CA07)', async () => {
    await repository.save(
      new Product('11111111-1111-4111-8111-111111111111', 'Leite sem lactose'),
    );

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          productId: '11111111-1111-4111-8111-111111111111',
          name: 'Leite sem lactose',
        },
      ],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('should return 200 with an empty page when there are no active products (CA02)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toEqual({ items: [], page: 1, limit: 20, total: 0 });
  });

  it('should honor page and limit query parameters (CA03)', async () => {
    for (let index = 1; index <= 3; index += 1) {
      await repository.save(
        new Product(
          `00000000-0000-4000-8000-00000000000${index}`,
          `Produto ${index}`,
        ),
      );
    }

    const response = await request(app.getHttpServer())
      .get('/products?page=2&limit=2')
      .expect(200);

    expect(response.body).toMatchObject({ page: 2, limit: 2, total: 3 });
    expect(response.body.items).toHaveLength(1);
  });

  it('should keep unknown routes returning 404 (CA12)', async () => {
    await request(app.getHttpServer()).get('/produtos').expect(404);
  });
});

describe('GET /products (UC13), erros na fronteira', () => {
  let app: INestApplication<App>;
  const serviceMock = { createProduct: vi.fn(), listProducts: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createApp([
      { provide: ProductsService, useValue: serviceMock },
    ]);
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    'page=0',
    'page=-1',
    'page=1.5',
    'page=abc',
    'limit=0',
    'limit=101',
    'limit=abc',
  ])(
    'should answer 400 in the single ValidationPipe format for ?%s without calling the service (CA06)',
    async (query) => {
      const response = await request(app.getHttpServer())
        .get(`/products?${query}`)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(serviceMock.listProducts).not.toHaveBeenCalled();
    },
  );

  it('should map InvalidPaginationException to 400 in the same format (CA06)', async () => {
    serviceMock.listProducts.mockRejectedValue(
      new InvalidPaginationException(),
    );

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('should answer 500 with a generic message when listing fails, without leaking details (CA09)', async () => {
    serviceMock.listProducts.mockRejectedValue(
      new ProductPersistenceFailedException(
        new Error('connection refused at 10.0.0.5:5432'),
        'Product listing could not be completed.',
      ),
    );

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Product listing could not be completed.',
      error: 'ProductPersistenceFailedException',
    });
    expect(JSON.stringify(response.body)).not.toMatch(/10\.0\.0\.5|5432/);
  });
});
