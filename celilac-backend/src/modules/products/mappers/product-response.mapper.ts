import { Product } from '../entities/product.entity.js';
import type { ProductsPage } from '../services/products.service.js';

export interface ProductResponseDto {
  productId: string;
  name: string;
}

export function toProductResponse(product: Product): ProductResponseDto {
  return {
    productId: product.productId,
    name: product.name,
  };
}

export interface ProductsPageResponseDto {
  items: ProductResponseDto[];
  page: number;
  limit: number;
  total: number;
}

export function toProductsPageResponse(
  page: ProductsPage,
): ProductsPageResponseDto {
  return {
    items: page.items.map(toProductResponse),
    page: page.page,
    limit: page.limit,
    total: page.total,
  };
}
