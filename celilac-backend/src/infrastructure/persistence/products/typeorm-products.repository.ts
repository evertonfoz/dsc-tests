import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product } from '../../../modules/products/entities/product.entity.js';
import {
  type ProductsPageQuery,
  type ProductsPageResult,
  type ProductsRepository,
} from '../../../modules/products/repositories/products.repository.interface.js';
import { ProductMapper } from './product.mapper.js';
import { ProductOrmEntity } from './product.orm-entity.js';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toPersistence(product);
    const savedEntity = await this.ormRepository.save(entity);

    return ProductMapper.toDomain(savedEntity);
  }

  async findActivePage(query: ProductsPageQuery): Promise<ProductsPageResult> {
    const [entities, total] = await this.ormRepository.findAndCount({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC', productId: 'ASC' },
      skip: query.offset,
      take: query.limit,
    });

    return { items: entities.map(ProductMapper.toDomain), total };
  }
}
