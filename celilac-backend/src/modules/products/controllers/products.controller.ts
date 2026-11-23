import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { ListProductsQueryDto } from '../dtos/list-products-query.dto.js';
import {
  type ProductResponseDto,
  type ProductsPageResponseDto,
  toProductResponse,
  toProductsPageResponse,
} from '../mappers/product-response.mapper.js';
import { ProductsService } from '../services/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.createProduct(
      createProductDto.name,
    );

    return toProductResponse(product);
  }

  @Get()
  async listProducts(
    @Query() query: ListProductsQueryDto,
  ): Promise<ProductsPageResponseDto> {
    const page = await this.productsService.listProducts({
      page: query.page,
      limit: query.limit,
    });

    return toProductsPageResponse(page);
  }
}
