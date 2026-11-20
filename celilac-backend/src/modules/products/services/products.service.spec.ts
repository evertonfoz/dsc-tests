import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository.interface.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Mocked<ProductsRepository>;

  beforeEach(async () => {
    const productsRepositoryMock: Mocked<ProductsRepository> = {
      save: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PRODUCTS_REPOSITORY, useValue: productsRepositoryMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(PRODUCTS_REPOSITORY);
  });

  it('should register and save a product when valid data is provided (CA01)', async () => {
    const productName = 'Celular XYZ';
    productsRepository.save.mockImplementation(async (product) => product);

    const result = await service.createProduct(productName);

    expect(result).toBeDefined();
    expect(result.productId).toBeDefined();
    expect(result.name).toBe(productName);
    expect(productsRepository.save).toHaveBeenCalledTimes(1);
    expect(productsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: productName,
      }),
    );
  });
});
