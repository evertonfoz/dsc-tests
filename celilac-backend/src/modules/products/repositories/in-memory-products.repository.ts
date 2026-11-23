import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity.js';
import {
  ProductsPageQuery,
  ProductsPageResult,
  ProductsRepository,
} from './products.repository.interface.js';

@Injectable()
export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async findActivePage(query: ProductsPageQuery): Promise<ProductsPageResult> {
    const active = this.products.filter(
      (product) => product.deletedAt === null,
    );
    return {
      items: active.slice(query.offset, query.offset + query.limit),
      total: active.length,
    };
  }
}
