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
  /** Produto ativo (não removido) pelo identificador, ou `null` se não houver (UC14). */
  findActiveById(productId: string): Promise<Product | null>;
  /**
   * Altera o nome do produto ativo (não removido) e o retorna atualizado, ou `null` se não houver
   * produto ativo com o identificador (UC15). Operação única: não deixa alteração pela metade.
   */
  updateActiveName(productId: string, name: string): Promise<Product | null>;
}
