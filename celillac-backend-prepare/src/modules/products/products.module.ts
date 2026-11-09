import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../../infrastructure/persistence/products/product.orm-entity.js';
import { TypeOrmProductsRepository } from '../../infrastructure/persistence/products/typeorm-products.repository.js';
import { ProductsController } from './controllers/products.controller.js';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository.interface.js';
import { ProductsService } from './services/products.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: TypeOrmProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
