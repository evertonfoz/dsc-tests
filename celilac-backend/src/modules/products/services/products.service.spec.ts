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

  it('should reject an empty product name in the service without saving (RN01)', async () => {
    await expect(service.createProduct('')).rejects.toMatchObject({
      name: 'InvalidProductNameException',
    });

    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('should report an incomplete operation when persistence fails (FE01)', async () => {
    productsRepository.save.mockRejectedValue(
      new Error('connection refused at 10.0.0.5:5432 (relation "products" does not exist)'),
    );

    const result = service.createProduct('Celular XYZ');

    await expect(result).rejects.toMatchObject({
      name: 'ProductPersistenceFailedException',
    });
    await expect(result).rejects.not.toThrow(/connection refused|10\.0\.0\.5|relation/);
  });

  it('should reject a blank product name in the service without saving (RN01)', async () => {
    await expect(service.createProduct('   ')).rejects.toMatchObject({
      name: 'InvalidProductNameException',
    });

    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('should reject a product name longer than 120 characters in the service without saving (RN01)', async () => {
    await expect(service.createProduct('x'.repeat(121))).rejects.toMatchObject({
      name: 'InvalidProductNameException',
    });

    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('should accept a product name with exactly 120 characters (RN01)', async () => {
    productsRepository.save.mockImplementation(async (product) => product);

    const result = await service.createProduct('x'.repeat(120));

    expect(result.name).toHaveLength(120);
  });
});
