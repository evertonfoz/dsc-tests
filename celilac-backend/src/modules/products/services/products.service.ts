import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
import { Product } from '../entities/product.entity.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from '../repositories/products.repository.interface.js';

const MAX_PRODUCT_NAME_LENGTH = 120;

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

    const product = new Product(randomUUID(), name);
    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new ProductPersistenceFailedException(error);
    }
  }
}
