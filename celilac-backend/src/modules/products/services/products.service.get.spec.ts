import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductLookupFailedException } from '../../../common/exceptions/product-lookup-failed.exception.js';
import { ProductNotFoundException } from '../../../common/exceptions/product-not-found.exception.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { ProductsService } from './products.service.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';

describe('ProductsService.getProductById (UC14)', () => {
  let repository: InMemoryProductsRepository;
  let service: ProductsService;

  beforeEach(() => {
    repository = new InMemoryProductsRepository();
    service = new ProductsService(repository);
  });

  it('should return the active product found by productId (CA01)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    await repository.save(
      new Product('22222222-2222-4222-8222-222222222222', 'Outro produto'),
    );

    const product = await service.getProductById(PRODUCT_ID);

    expect({ productId: product.productId, name: product.name }).toEqual({
      productId: PRODUCT_ID,
      name: 'Leite sem lactose',
    });
  });

  it('should not change the stored products when searching (CA08)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    const saveSpy = vi.spyOn(repository, 'save');
    const before = await repository.findActivePage({ offset: 0, limit: 100 });

    await service.getProductById(PRODUCT_ID);

    const after = await repository.findActivePage({ offset: 0, limit: 100 });
    expect(saveSpy).not.toHaveBeenCalled();
    expect(after).toEqual(before);
  });

  it('should throw ProductNotFoundException when the product does not exist (CA03)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const result = service.getProductById(
      '99999999-9999-4999-8999-999999999999',
    );

    await expect(result).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('should throw ProductNotFoundException when the product is removed (CA04)', async () => {
    await repository.save(
      new Product(PRODUCT_ID, 'Removido', new Date('2026-11-01T00:00:00Z')),
    );

    const result = service.getProductById(PRODUCT_ID);

    await expect(result).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('should throw ProductLookupFailedException when the repository fails (CA06)', async () => {
    vi.spyOn(repository, 'findActiveById').mockRejectedValue(
      new Error('connection refused at 10.0.0.5:5432'),
    );

    const result = service.getProductById(PRODUCT_ID);

    await expect(result).rejects.toBeInstanceOf(ProductLookupFailedException);
    await expect(result).rejects.not.toThrow(/10\.0\.0\.5|5432/);
  });
});
