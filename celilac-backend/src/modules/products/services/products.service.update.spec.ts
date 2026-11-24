import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductNotFoundException } from '../../../common/exceptions/product-not-found.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { Product } from '../entities/product.entity.js';
import { InMemoryProductsRepository } from '../repositories/in-memory-products.repository.js';
import { ProductsService } from './products.service.js';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_ID = '22222222-2222-4222-8222-222222222222';

describe('ProductsService.updateProductName (UC15)', () => {
  let repository: InMemoryProductsRepository;
  let service: ProductsService;

  beforeEach(() => {
    repository = new InMemoryProductsRepository();
    service = new ProductsService(repository);
  });

  it('should change the name of the active product and return it (CA01)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const product = await service.updateProductName(PRODUCT_ID, 'Leite integral');

    expect({ productId: product.productId, name: product.name }).toEqual({
      productId: PRODUCT_ID,
      name: 'Leite integral',
    });
    const reread = await service.getProductById(PRODUCT_ID);
    expect(reread.name).toBe('Leite integral');
  });

  it('should keep productId, deletedAt and the other products unchanged, without duplicating (CA04)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
    await repository.save(new Product(OTHER_ID, 'Outro produto'));

    const product = await service.updateProductName(PRODUCT_ID, 'Leite integral');

    expect(product.productId).toBe(PRODUCT_ID);
    expect(product.deletedAt).toBeNull();
    const page = await repository.findActivePage({ offset: 0, limit: 100 });
    expect(page.total).toBe(2);
    expect((await service.getProductById(OTHER_ID)).name).toBe('Outro produto');
  });

  it('should succeed when the new name equals the current one (CA09)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const product = await service.updateProductName(PRODUCT_ID, 'Leite sem lactose');

    expect(product.name).toBe('Leite sem lactose');
  });

  it('should keep the name of the last of two sequential updates (CA11, RN08)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    await service.updateProductName(PRODUCT_ID, 'Primeiro');
    await service.updateProductName(PRODUCT_ID, 'Segundo');

    expect((await service.getProductById(PRODUCT_ID)).name).toBe('Segundo');
  });

  it('should throw ProductNotFoundException when the product does not exist (CA05)', async () => {
    await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));

    const result = service.updateProductName(OTHER_ID, 'Novo nome');

    await expect(result).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('should throw ProductNotFoundException and not change a removed product (CA06)', async () => {
    const removedAt = new Date('2026-11-01T00:00:00Z');
    await repository.save(new Product(PRODUCT_ID, 'Removido', removedAt));

    const result = service.updateProductName(PRODUCT_ID, 'Novo nome');

    await expect(result).rejects.toBeInstanceOf(ProductNotFoundException);
    const page = await repository.findActivePage({ offset: 0, limit: 100 });
    expect(page.total).toBe(0);
    const stored = (repository as unknown as { products: Product[] }).products;
    expect(stored).toEqual([new Product(PRODUCT_ID, 'Removido', removedAt)]);
  });

  it.each([
    ['empty', ''],
    ['only spaces', '   '],
    ['121 characters', 'a'.repeat(121)],
  ])(
    'should reject a name that is %s without calling the repository (CA08)',
    async (_label, name) => {
      await repository.save(new Product(PRODUCT_ID, 'Leite sem lactose'));
      const updateSpy = vi.spyOn(repository, 'updateActiveName');

      const result = service.updateProductName(PRODUCT_ID, name);

      await expect(result).rejects.toBeInstanceOf(InvalidProductNameException);
      expect(updateSpy).not.toHaveBeenCalled();
      expect((await service.getProductById(PRODUCT_ID)).name).toBe(
        'Leite sem lactose',
      );
    },
  );

  it('should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA10)', async () => {
    vi.spyOn(repository, 'updateActiveName').mockRejectedValue(
      new Error('connection refused at 10.0.0.5:5432'),
    );

    const result = service.updateProductName(PRODUCT_ID, 'Novo nome');

    await expect(result).rejects.toBeInstanceOf(
      ProductPersistenceFailedException,
    );
    await expect(result).rejects.not.toThrow(/10\.0\.0\.5|5432/);
  });
});
