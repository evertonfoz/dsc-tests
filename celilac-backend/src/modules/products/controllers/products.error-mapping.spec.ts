import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { DomainHttpExceptionFilter } from '../../../common/filters/domain-http-exception.filter.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

describe('ProductsController — mapeamento de erros do núcleo (HTTP)', () => {
  let app: INestApplication<App>;
  const serviceMock = { createProduct: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: serviceMock },
        { provide: APP_FILTER, useClass: DomainHttpExceptionFilter },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should map InvalidProductNameException to 400 at the HTTP boundary', async () => {
    serviceMock.createProduct.mockRejectedValue(new InvalidProductNameException());

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Celular XYZ' })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Product name must not be empty.',
      error: 'InvalidProductNameException',
    });
  });

  it('should map ProductPersistenceFailedException to 500 without leaking internal details', async () => {
    serviceMock.createProduct.mockRejectedValue(
      new ProductPersistenceFailedException(
        new Error('connection refused at 10.0.0.5:5432 (relation "products" does not exist)'),
      ),
    );

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Celular XYZ' })
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Product registration could not be completed.',
      error: 'ProductPersistenceFailedException',
    });
    expect(JSON.stringify(response.body)).not.toMatch(/connection refused|10\.0\.0\.5|relation/);
  });
});
