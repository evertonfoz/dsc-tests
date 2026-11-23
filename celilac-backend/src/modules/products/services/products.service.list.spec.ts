import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { ProductsService } from './products.service.js';

describe('ProductsService.listProducts (UC13)', () => {
  let repository: InMemoryProductsRepository;
  let service: ProductsService;

  beforeEach(() => {
    repository = new InMemoryProductsRepository();
    service = new ProductsService(repository);
  });

  it('should list the active products with productId and name (CA01)', async () => {
    await repository.save(
      new Product('11111111-1111-4111-8111-111111111111', 'Leite sem lactose'),
    );

    const page = await service.listProducts();

    expect(
      page.items.map(({ productId, name }) => ({ productId, name })),
    ).toEqual([
      {
        productId: '11111111-1111-4111-8111-111111111111',
        name: 'Leite sem lactose',
      },
    ]);
  });
});
