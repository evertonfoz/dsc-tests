# ARTEFATO 05-04 — IMPLEMENTAÇÃO DO COMPORTAMENTO GREEN

## 1. Identificação do Escopo de Implementação

- **Caso de Uso:** `UC12 — Cadastrar Produto` ([Issue #1 — `EPIC-UC12`](https://github.com/evertonfoz/dsc-tests/issues/1))
- **Issue Responsável pela Implementação:** `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` ([Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8))
- **Issue do Teste Orientador:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10))
- **Critério de Aceite:** **`CA01`** — *Uma solicitação contendo dados válidos deve resultar no cadastro de um produto*
- **Branch de Implementação Ativa:** `feature/uc12-05-products-service` (derivada de `feature/uc12-07-product-registration-test` no commit `2724b97`)

---

## 2. Verificações Prévias Realizadas Antes da Alteração

Antes de modificar qualquer arquivo, foram verificadas as 5 condições obrigatórias:

1. **Branch ativa confirmada:** `feature/uc12-05-products-service` criada a partir de `feature/uc12-07-product-registration-test` (`2724b97`).
2. **Issue responsável confirmada:** `SUB-05` ([Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8)).
3. **Contratos confirmados:** `Product(productId: string, name: string)` e `ProductsRepository.save(product: Product): Promise<Product>` (token `PRODUCTS_REPOSITORY`).
4. **Teste RED disponível:** `src/modules/products/services/products.service.spec.ts` presente e intacto na branch.
5. **Ausência de alterações locais inesperadas:** Verificado com `git status` que nenhum arquivo rastreado possuía modificações pendentes antes da edição.

---

## 3. Arquivos Modificados e Código Implementado

### 3.1 Único Arquivo Modificado
- `src/modules/products/services/products.service.ts`

### 3.2 Código Completo de `src/modules/products/services/products.service.ts`

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

### 3.3 Contratos Utilizados e Preservados
- **Entidade:** `new Product(randomUUID(), name)` (`src/modules/products/entities/product.entity.ts`).
- **Repositório:** `this.productsRepository.save(product)` injetado via `@Inject(PRODUCTS_REPOSITORY)` (`src/modules/products/repositories/products.repository.interface.ts`).
- **Assinatura Pública:** `async createProduct(name: string): Promise<Product>`.

---

## 4. Justificativa Técnica e Relação com o Teste RED

1. **Geração de Identificador Único (`randomUUID()`):**
   - O contrato de `Product` exige `productId: string` no construtor, e o teste verifica `expect(result.productId).toEqual(expect.any(String))`.
   - Utilizar `randomUUID()` do módulo nativo `node:crypto` gera um UUID v4 válido a cada invocação, evitando retornos constantes ou valores fixos artificiais.
2. **Delegação ao Repositório (`this.productsRepository.save(product)`):**
   - Cumpre a responsabilidade arquitetural da camada de aplicação (orquestrar a criação da entidade de domínio e delegar a gravação à abstração de persistência) e atende diretamente à asserção `expect(productsRepository.save).toHaveBeenCalledTimes(1)`.
3. **Retorno da Entidade Persistida:**
   - Retornar o resultado de `this.productsRepository.save(product)` garante que o chamador receba o `Product` persistido com `productId` e `name === 'Celular XYZ'`.

---

## 5. Alterações Deliberadamente Não Realizadas

Para respeitar estritamente a disciplina da **Fase GREEN do TDD** (implementar apenas o código mínimo necessário para satisfazer o teste atual):

1. **Nenhuma alteração no teste (`products.service.spec.ts`):** Todas as asserções originais foram mantidas intactas.
2. **Nenhuma validação adicional não exigida pelo teste atual (`CA02` / `CA03`):** Validações de nome vazio ou ausente pertencem aos próximos ciclos RED → GREEN do TDD e não foram antecipadas sem teste falhando correspondente.
3. **Nenhuma alteração em `product.entity.ts` ou `products.repository.interface.ts`:** Os contratos existentes já atendem integralmente ao cenário `CA01`.
4. **Nenhuma implementação de infraestrutura TypeORM (`SUB-04`) ou Controller HTTP (`SUB-06`):** Fora do escopo da `SUB-05` e deste teste unitário.

