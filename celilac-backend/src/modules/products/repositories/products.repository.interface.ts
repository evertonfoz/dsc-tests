import { Product } from '../entities/product.entity.js';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsPageQuery {
  offset: number;
  limit: number;
}

export interface ProductsPageResult {
  items: Product[];
  total: number;
}

export interface ProductsRepository {
  save(product: Product): Promise<Product>;
  /** Produtos ativos (não removidos), em ordem estável: name, depois productId. */
  findActivePage(query: ProductsPageQuery): Promise<ProductsPageResult>;
}
