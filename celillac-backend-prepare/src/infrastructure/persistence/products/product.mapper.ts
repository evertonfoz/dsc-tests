import { Product } from '../../../modules/products/entities/product.entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';

export class ProductMapper {
  static toPersistence(product: Product): ProductOrmEntity {
    const entity = new ProductOrmEntity();

    entity.productId = product.productId;
    entity.name = product.name;

    return entity;
  }

  static toDomain(entity: ProductOrmEntity): Product {
    return new Product(entity.productId, entity.name);
  }
}
