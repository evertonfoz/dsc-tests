import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import {
  type ProductResponseDto,
  toProductResponse,
} from '../mappers/product-response.mapper.js';
import { ProductsService } from '../services/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.createProduct(dto.name);

    return toProductResponse(product);
  }
}
