import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { InvalidPaginationException } from '../../../common/exceptions/invalid-pagination.exception.js';
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '../entities/product-pagination.rules.js';
import { MAX_PRODUCT_NAME_LENGTH } from '../entities/product-name.rules.js';
import { Product } from '../entities/product.entity.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from '../repositories/products.repository.interface.js';

export interface ListProductsQuery {
  page?: number;
  limit?: number;
}

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

  async listProducts(query: ListProductsQuery = {}): Promise<ProductsPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_LIMIT;
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > MAX_PAGE_LIMIT
    ) {
      throw new InvalidPaginationException();
    }

    try {
      const { items, total } = await this.productsRepository.findActivePage({
        offset: (page - 1) * limit,
        limit,
      });

      return { items, page, limit, total };
    } catch (error) {
      throw new ProductPersistenceFailedException(
        error,
        'Product listing could not be completed.',
      );
    }
  }
}
