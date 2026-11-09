import {
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { type App } from 'supertest/types.js';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { ProductOrmEntity } from '../../infrastructure/persistence/products/product.orm-entity.js';
import { ProductsController } from './controllers/products.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductsModule } from './products.module.js';
import { InMemoryProductsRepository } from './repositories/in-memory-products.repository.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from './repositories/products.repository.interface.js';
import { ProductsService } from './services/products.service.js';

describe('POST /products — integração', () => {
  let app: INestApplication<App>;
  let moduleRef: TestingModule;
  let productsController: ProductsController;
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(getRepositoryToken(ProductOrmEntity))
      .useValue({})
      .overrideProvider(PRODUCTS_REPOSITORY)
      .useClass(InMemoryProductsRepository)
      .compile();

    productsController = moduleRef.get<ProductsController>(ProductsController);
    productsService = moduleRef.get<ProductsService>(ProductsService);
    productsRepository = moduleRef.get<ProductsRepository>(PRODUCTS_REPOSITORY);

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('deve criar um produto com dados válidos', async () => {
    expect(productsController).toBeInstanceOf(ProductsController);
    expect(productsService).toBeInstanceOf(ProductsService);
    expect(productsRepository).toBeInstanceOf(InMemoryProductsRepository);

    const saveSpy = vi.spyOn(productsRepository, 'save');

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Celular XYZ',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      name: 'Celular XYZ',
    });

    expect(response.body.productId).toEqual(
      expect.any(String),
    );

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      new Product(response.body.productId, 'Celular XYZ'),
    );

    saveSpy.mockRestore();
  });

  it('deve rejeitar nome vazio na fronteira HTTP', async () => {
    const saveSpy = vi.spyOn(productsRepository, 'save');

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: '',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(saveSpy).not.toHaveBeenCalled();

    saveSpy.mockRestore();
  });
});

