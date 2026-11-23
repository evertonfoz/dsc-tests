import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { MAX_PRODUCT_NAME_LENGTH } from '../entities/product-name.rules.js';
import { Product } from '../entities/product.entity.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from '../repositories/products.repository.interface.js';

export const DEFAULT_PAGE_LIMIT = 20;

export interface ProductsPage {
  items: Product[];
  page: number;
  limit: number;
  total: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createProduct(name: string): Promise<Product> {
    if (name.trim() === '' || name.length > MAX_PRODUCT_NAME_LENGTH) {
      throw new InvalidProductNameException();
    }

    const product = new Product(randomUUID(), name, null);
    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new ProductPersistenceFailedException(error);
    }
  }

  async listProducts(): Promise<ProductsPage> {
    const { items, total } = await this.productsRepository.findActivePage({
      offset: 0,
      limit: DEFAULT_PAGE_LIMIT,
    });

    return { items, page: 1, limit: DEFAULT_PAGE_LIMIT, total };
  }
}
