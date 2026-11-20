import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { InvalidProductNameException } from '../../../common/exceptions/invalid-product-name.exception.js';
import { ProductPersistenceFailedException } from '../../../common/exceptions/product-persistence-failed.exception.js';
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

  async createProduct(name: string): Promise<Product> {
    if (name === '') {
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
