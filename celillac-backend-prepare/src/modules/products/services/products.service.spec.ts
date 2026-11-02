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
    productsRepository.save.mockImplementation(async (input) => input);

    const result = await service.createProduct('Celular XYZ');

    expect(productsRepository.save).toHaveBeenCalledTimes(1);
    expect(result.productId).toEqual(expect.any(String));
    expect(result.name).toBe('Celular XYZ');
  });
});
