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
    // Collation fixada (ICU pt-BR) para que a ordem não dependa da collation padrão do banco
    // e coincida com o adaptador em memória (Intl.Collator('pt-BR')).
    const [entities, total] = await this.ormRepository
      .createQueryBuilder('product')
      .where('product.deletedAt IS NULL')
      .orderBy('product.name COLLATE "pt-BR-x-icu"', 'ASC')
      .addOrderBy('product.productId', 'ASC')
      .skip(query.offset)
      .take(query.limit)
      .getManyAndCount();

    return { items: entities.map(ProductMapper.toDomain), total };
  }

  async findActiveById(productId: string): Promise<Product | null> {
    const entity = await this.ormRepository.findOne({
      where: { productId, deletedAt: IsNull() },
    });

    return entity === null ? null : ProductMapper.toDomain(entity);
  }
}
