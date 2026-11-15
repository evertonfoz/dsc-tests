import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../entities/product.entity.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

describe('ProductsController (HTTP)', () => {
  let app: INestApplication<App>;

  const serviceMock = {
    createProduct: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a product when valid data is provided (POST /products -> 201)', async () => {
    const createdProduct = new Product('product-1', 'Celular XYZ');
    serviceMock.createProduct.mockResolvedValue(createdProduct);

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Celular XYZ' })
      .expect(201);

    expect(serviceMock.createProduct).toHaveBeenCalledTimes(1);
    expect(serviceMock.createProduct).toHaveBeenCalledWith('Celular XYZ');
    expect(response.body).toEqual({
      productId: 'product-1',
      name: 'Celular XYZ',
    });
  });

  it('should reject an empty product name at the HTTP boundary (POST /products -> 400)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: '' })
      .expect(400);

    expect(serviceMock.createProduct).not.toHaveBeenCalled();
    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.arrayContaining(['name should not be empty']),
      }),
    );
  });

  it('should expose only public contract fields and filter simulated internal properties (POST /products -> 201)', async () => {
    serviceMock.createProduct.mockResolvedValue({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Produto de exemplo',
      internalNote: 'informacao-interna-ilustrativa',
    });

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto de exemplo' })
      .expect(201);

    expect(serviceMock.createProduct).toHaveBeenCalledTimes(1);
    expect(serviceMock.createProduct).toHaveBeenCalledWith('Produto de exemplo');
    expect(response.body).not.toHaveProperty('internalNote');
    expect(response.body).toEqual({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Produto de exemplo',
    });
  });
});
