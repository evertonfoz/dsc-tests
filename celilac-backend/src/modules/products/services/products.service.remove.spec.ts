import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { ProductsService } from './products.service.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';

describe('ProductsService.removeProduct (UC16)', () => {
  let repository: InMemoryProductsRepository;
  let service: ProductsService;

  beforeEach(() => {
    repository = new InMemoryProductsRepository();
    service = new ProductsService(repository);
  });

  it('should remove the active product and resolve without a body (CA01, RN09)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    await expect(service.removeProduct(PRODUCT_ID)).resolves.toBeUndefined();
  });

  it('should leave the removed product out of the active products of the repository (CA01, RN01)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    await service.removeProduct(PRODUCT_ID);

    expect(await repository.findActiveById(PRODUCT_ID)).toBeNull();
  });
});
