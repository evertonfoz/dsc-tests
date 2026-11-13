import { Product } from '../entities/product.entity.js';

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
