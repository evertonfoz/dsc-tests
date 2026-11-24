import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductNotFoundException } from '../../../common/exceptions/product-not-found.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { ProductsService } from './products.service.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_ID = '22222222-2222-4222-8222-222222222222';

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

  it('should throw ProductNotFoundException when there is no product with the identifier (CA07, FA01)', async () => {
    await expect(service.removeProduct(OTHER_ID)).rejects.toBeInstanceOf(
      ProductNotFoundException,
    );
  });

  it('should not remove any other product when the identifier does not exist (CA07, RN05)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    await expect(service.removeProduct(OTHER_ID)).rejects.toBeInstanceOf(
      ProductNotFoundException,
    );

    expect(await repository.findActiveById(PRODUCT_ID)).not.toBeNull();
  });

  it('should throw ProductNotFoundException when the product was already removed (CA08, FA02)', async () => {
    await repository.save(
      new Product(PRODUCT_ID, 'Leite sem lactose', new Date('2026-01-01')),
    );

    await expect(service.removeProduct(PRODUCT_ID)).rejects.toBeInstanceOf(
      ProductNotFoundException,
    );
  });

  it('should throw ProductNotFoundException when removing the same product twice (CA08, RN07)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    await service.removeProduct(PRODUCT_ID);

    await expect(service.removeProduct(PRODUCT_ID)).rejects.toBeInstanceOf(
      ProductNotFoundException,
    );
  });

  it('should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA11, FE01)', async () => {
    vi.spyOn(repository, 'removeActive').mockRejectedValue(
      new Error('connection refused at 10.0.0.5:5432'),
    );

    const result = service.removeProduct(PRODUCT_ID);

    await expect(result).rejects.toBeInstanceOf(
      ProductPersistenceFailedException,
    );
    await expect(result).rejects.not.toThrow(/10\.0\.0\.5|5432/);
  });

  it('should keep the product active when the repository fails (CA11, RN05)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    vi.spyOn(repository, 'removeActive').mockRejectedValue(
      new Error('connection lost'),
    );

    await expect(service.removeProduct(PRODUCT_ID)).rejects.toBeInstanceOf(
      ProductPersistenceFailedException,
    );

    expect(await repository.findActiveById(PRODUCT_ID)).not.toBeNull();
  });
});
