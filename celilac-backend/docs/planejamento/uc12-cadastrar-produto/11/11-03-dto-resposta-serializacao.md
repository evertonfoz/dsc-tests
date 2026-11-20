# ARTEFATO 11-03 — DTO DE RESPOSTA E CONTROLE DA SERIALIZAÇÃO

## 1. Abordagem Técnica: Mapeamento Explícito

Para assegurar que o contrato HTTP seja respeitado em tempo de compilação e em tempo de execução, foi adotada a estratégia de **mapeamento explícito (Explicit Mapper Pattern)**.

### Por que Interfaces TypeScript Não Bastam em Tempo de Execução?
No ecossistema JavaScript/TypeScript:
- Interfaces TypeScript existem **exclusivamente em tempo de compilação** e são completamente removidas (erased) pelo compilador durante a geração do código JavaScript (`.js`).
- Se um método retornar um objeto com 10 campos em runtime e a tipagem TypeScript declarar apenas 2, a serialização JSON padrão do NestJS (`res.json()`) serializará **todos os 10 campos** na resposta HTTP, expondo dados internos sem qualquer erro de compilação.
- O mapper explícito instancia um novo literal de objeto atribuindo **somente** os campos pertencentes ao contrato público.

---

## 2. Implementação do DTO e do Mapper de Resposta

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

### Características Técnicas:
1. **Desacoplamento:** Não importa nenhum decorator do NestJS ou TypeORM.
2. **Função Pura:** Recebe a entidade de domínio `Product` e projeta os atributos públicos em um novo objeto `ProductResponseDto`.
3. **Segurança de Runtime:** Mesmo se o objeto `product` recebido em runtime contiver campos adicionais (ex.: `internalNote`, `created_at`, metadados de persistência), eles são ignorados e não compõem o objeto retornado.
4. **Distinção Rigorosa com o Mapper de Persistência:**
   - Mapper HTTP (`src/modules/products/mappers/product-response.mapper.ts`): converte **Domínio → DTO de Resposta**.
   - Mapper de Persistência (`src/infrastructure/persistence/products/product.mapper.ts`): converte **Domínio ↔ Entidade TypeORM**. Ambos operam em camadas distintas sem cruzamento de responsabilidades.

---

## 3. Adaptação do Controller

O arquivo `src/modules/products/controllers/products.controller.ts` foi atualizado para utilizar o novo mapper e a tipagem explícita:

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
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.createProduct(
      createProductDto.name,
    );

    return toProductResponse(product);
  }
}
```

### Preservação Arquitetural Confirmada:
- A injeção de dependência de `ProductsService` permanece idêntica.
- O método chamado (`this.productsService.createProduct(createProductDto.name)`) mantém rigorosamente a mesma assinatura.
- O uso de `import { type ProductResponseDto, toProductResponse }` respeita as diretrizes de ESM e TypeScript moderno (`verbatimModuleSyntax`).

---

## 4. Comparativo de Alternativas Consideradas

| Alternativa | Mecanismo | Prós | Contras | Decisão |
| :--- | :--- | :--- | :--- | :--- |
| **Mapeamento Explícito (Adotada)** | Função pura `toProductResponse(entity)` montando o literal `{ productId, name }`. | Máximo desempenho, zero reflexão, determinístico em tempo de execução, zero dependências externas. | Exige escrita de funções de mapeamento. | **Selecionada como padrão de engenharia do projeto.** |
| `ClassSerializerInterceptor` | Uso de `class-transformer` com decorators `@Exclude()` / `@Expose()`. | Automatizado via interceptor do NestJS. | Exige transformar DTOs em classes, sobrecarga de reflexão, risco de esquecer decorator ao evoluir a entidade. | Descartada por complexidade e acoplamento desnecessários. |
| Retorno Direto da Entidade | `return product` sem tratamento. | Nenhum código adicional. | Quebra de encapsulamento, acoplamento entre HTTP e domínio, vazamento direto de propriedades internas. | Rejeitada terminantemente. |

---

## 5. Validação da Compilação e Linters

Foram executados os comandos oficiais de compilação e análise estática:

```bash
$ pnpm build
$ pnpm lint
```

**Resultado Observado:**
- `pnpm build`: compilou com sucesso em `dist/`, gerando os arquivos `.js`, `.d.ts` e `.js.map` correspondentes.
- `pnpm lint`: `0 errors` reportados em todo o projeto.
