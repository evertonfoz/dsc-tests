import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity.js';
import { ProductsRepository } from './products.repository.interface.js';

@Injectable()
export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }
}
