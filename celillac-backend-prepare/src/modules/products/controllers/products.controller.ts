import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductsService } from '../services/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(dto.name);
  }
}
