# ARTEFATO 11-03 — DTO DE RESPOSTA E CONTROLE DA SERIALIZAÇÃO

## 1. Estado Anterior

Em `src/modules/products/controllers/products.controller.ts`, o método `create` retornava diretamente a entidade de domínio:

```typescript
@Post()
async create(@Body() dto: CreateProductDto): Promise<Product> {
  return this.productsService.createProduct(dto.name);
}
```

---

## 2. DTO de Resposta e Mapper HTTP Implementados

Criado o arquivo `src/modules/products/mappers/product-response.mapper.ts`:

```typescript
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
```

### Por que o Mapeamento Explícito é Necessário em Tempo de Execução?
Uma `interface` TypeScript (`ProductResponseDto`) existe apenas em tempo de compilação e é removida ao gerar JavaScript. Se o Controller retornasse diretamente o objeto recebido do Service, quaisquer propriedades extras anexadas em tempo de execução seriam serializadas no JSON pelo Express/NestJS. A função `toProductResponse(product)` constrói explicitamente um novo objeto contendo apenas `productId` e `name`.

### Separação entre Mappers
- **Mapper HTTP (`toProductResponse`):** converte `Product -> ProductResponseDto` na fronteira HTTP, sem regras de negócio.
- **Mapper de Persistência (`ProductMapper`):** converte `Product <-> ProductOrmEntity` na camada de infraestrutura (`src/infrastructure/persistence/products/product.mapper.ts`), preservado intacto.

### Alternativa Conceitual
O ecossistema NestJS também oferece `ClassSerializerInterceptor` com `class-transformer` (`@Expose()` / `@Exclude()`). Contudo, para um contrato simples e fechado de dois campos, o mapper explícito `toProductResponse()` é mais direto, livre de metadados/reflexão extra e suficiente.

---

## 3. Código Final do Controller

Arquivo `src/modules/products/controllers/products.controller.ts`:

```typescript
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
```

Observação: `ProductResponseDto` é importado com `import { type ProductResponseDto, ... }` para compatibilidade com `isolatedModules: true` e `moduleResolution: "nodenext"`.

---

## 4. Arquivos Modificados / Criados

- **Criado:** `src/modules/products/mappers/product-response.mapper.ts`
- **Modificado:** `src/modules/products/controllers/products.controller.ts`
- **Preservados intactos:** `Product`, `ProductsService`, `ProductsRepository`, `CreateProductDto`, `ProductOrmEntity`, `ProductMapper`.

---

## 5. Compilação, Lint e Evidências

- **`pnpm build` (`nest build`):** Executado com sucesso (código `0`, zero erros).
- **`pnpm lint` (`oxlint --type-aware src/ test/`):** Executado com sucesso (0 erros; 3 avisos pré-existentes em arquivos de teste não alterados nesta etapa).
- **`pnpm test`:** `5 passed (5)` arquivos, `13 passed (13)` testes.
- **Pendências:** Nenhuma pendência na camada de serialização.

