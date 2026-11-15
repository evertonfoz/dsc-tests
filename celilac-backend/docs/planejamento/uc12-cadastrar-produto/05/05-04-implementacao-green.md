# ARTEFATO 05-04 — IMPLEMENTAÇÃO TÉCNICA DO COMPORTAMENTO GREEN

> **Material 05 — Do Teste RED à Implementação GREEN com TDD**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 04

---

## 1. Identificação da Implementação

- **Issue de Implementação:** `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` (GitHub Issue [#8](https://github.com/evertonfoz/dsc-tests/issues/8)).
- **Issue de Teste Orientador:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Branch Ativa de Implementação:** `feature/uc12-05-products-service`.
- **Branch-Base de Referência:** `feature/uc12-07-product-registration-test`.
- **Critério de Aceite Atendido:** `CA01 — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto`.

---

## 2. Arquivos Modificados e Código Implementado

O código de produção foi modificado estritamente em um único arquivo de aplicação:

### Arquivo: `src/modules/products/services/products.service.ts`

```typescript
import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from '../repositories/products.repository.interface.js';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createProduct(name: string): Promise<Product> {
    const product = new Product(randomUUID(), name);
    return this.productsRepository.save(product);
  }
}
```

---

## 3. Detalhamento do Diff em Relação à Fase RED

```diff
--- a/src/modules/products/services/products.service.ts
+++ b/src/modules/products/services/products.service.ts
@@ -1,3 +1,4 @@
+import { randomUUID } from 'node:crypto';
 import { Inject, Injectable } from '@nestjs/common';
 import { Product } from '../entities/product.entity.js';
 import {
@@ -12,7 +13,8 @@ export class ProductsService {
     private readonly productsRepository: ProductsRepository,
   ) {}
 
-  async createProduct(_name: string): Promise<Product> {
-    throw new Error('Not implemented: createProduct');
+  async createProduct(name: string): Promise<Product> {
+    const product = new Product(randomUUID(), name);
+    return this.productsRepository.save(product);
   }
 }
```

---

## 4. Justificativa Técnica das Decisões de Design

1. **Uso de `randomUUID` nativo do Node.js (`node:crypto`):**
   - Evita dependências externas pesadas (como pacotes npm adicionais) para geração de identificadores universais.
   - Fornece UUIDs v4 criptograficamente seguros e compatíveis com a asserção `expect.any(String)` do teste.
2. **Instanciação Imutável de Domínio:**
   - Cria o objeto `Product` passando o identificador e o nome recebido, respeitando a assinatura do construtor da entidade de domínio.
3. **Delegação Limpa de Persistência:**
   - O serviço não realiza persistência direta em banco nem conhece detalhes de SQL; apenas delega o `Product` ao `ProductsRepository.save`, satisfazendo o princípio da inversão de dependência (DIP).

---

## 5. Relação com as Asserções do Teste Unitário

| Asserção do Teste | Código que Satisfaz a Asserção |
| :--- | :--- |
| `expect(productsRepository.save).toHaveBeenCalledTimes(1)` | Invocação direta de `this.productsRepository.save(product)`. |
| `expect(result.productId).toEqual(expect.any(String))` | Atribuição de `randomUUID()` no construtor de `Product`. |
| `expect(result.name).toBe('Celular XYZ')` | Passagem do argumento `name` para o construtor da entidade. |

---

## 6. Alterações Deliberadamente Não Realizadas

- **Nenhuma alteração nos arquivos de teste:** O arquivo `products.service.spec.ts` não foi modificado.
- **Nenhuma validação defensiva prematura adicionada:** Não foram adicionados `if (!name)` ou lançamentos de erro neste método nesta etapa, pois essas regras pertencem à especificação dos testes dos critérios `CA02` e `CA03` no próximo ciclo RED do TDD.

