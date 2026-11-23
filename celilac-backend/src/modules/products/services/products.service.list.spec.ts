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

  it('should exclude soft-deleted products from the list and the total (CA05)', async () => {
    await repository.save(
      new Product('11111111-1111-4111-8111-111111111111', 'Ativo'),
    );
    await repository.save(
      new Product(
        '22222222-2222-4222-8222-222222222222',
        'Removido',
        new Date('2026-11-01T00:00:00Z'),
      ),
    );

    const page = await service.listProducts();

    expect(page.items.map((product) => product.name)).toEqual(['Ativo']);
    expect(page.total).toBe(1);
  });

  it('should create new products as active (CA10)', async () => {
    const product = await service.createProduct('Novo');

    expect(product.deletedAt).toBeNull();
  });

  it('should return an empty list with total 0 when there are no active products (CA02)', async () => {
    const page = await service.listProducts();

    expect(page.items).toEqual([]);
    expect(page.total).toBe(0);
  });

  it('should paginate with default limit 20 and navigate pages without gaps (CA03, CA04)', async () => {
    for (let index = 1; index <= 45; index += 1) {
      const suffix = String(index).padStart(2, '0');
      await repository.save(
        new Product(
          `00000000-0000-4000-8000-0000000000${suffix}`,
          `Produto ${suffix}`,
        ),
      );
    }

    const first = await service.listProducts();
    const second = await service.listProducts({ page: 2 });
    const third = await service.listProducts({ page: 3 });
    const custom = await service.listProducts({ page: 1, limit: 50 });

    expect(first).toMatchObject({ page: 1, limit: 20, total: 45 });
    expect(first.items).toHaveLength(20);
    expect(second.items).toHaveLength(20);
    expect(third.items).toHaveLength(5);
    const ids = [...first.items, ...second.items, ...third.items].map(
      (p) => p.productId,
    );
    expect(new Set(ids).size).toBe(45);
    expect(custom.items).toHaveLength(45);
    expect(custom.limit).toBe(50);
  });
});
