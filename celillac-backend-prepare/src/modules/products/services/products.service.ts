import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from '../repositories/products.repository.interface.js';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createProduct(_name: string): Promise<Product> {
    throw new Error('Not implemented: createProduct');
  }
}
