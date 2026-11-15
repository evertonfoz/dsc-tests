# ARTEFATO 04-04 — ESPECIFICAÇÃO DO PRIMEIRO TESTE RED

## 1. Identificação e Contexto

- **Caso de Uso:** `UC12 — Cadastrar Produto`
- **Issue Relacionada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10))
- **Requisito Funcional:** `RF01 — Cadastro de produto` e `RF03 — Persistência`
- **Critério de Aceite Alvo:** **`CA01`** — *Uma solicitação contendo dados válidos deve resultar no cadastro de um produto* (em conjunto com **`CA04`** — *Os comportamentos especificados devem possuir testes automatizados*).

---

## 2. Análise da Estrutura Real do Projeto

Antes de especificar o teste, foi inspecionada a estrutura real do projeto em `celillac-backend-prepare`:

1. **Linguagem e Runtime:** TypeScript (`^6.0.2`, ESM `"type": "module"` com imports `.js`) em Node.js.
2. **Framework de Aplicação e Injeção de Dependências:** NestJS (`@nestjs/common`, `@nestjs/core`, `@nestjs/testing` `^12.1.2`).
3. **Framework de Testes e Asserções:** **Vitest** (`^4.1.2`), configurado em `vitest.config.ts` e executado via script `"test": "vitest run"`.
4. **Convenção de Testes Existentes no Repositório:**
   - Inspeção de `src/modules/orders/services/orders.service.spec.ts` demonstrou o padrão arquitetural adotado no projeto:
     - Uso de `Test.createTestingModule` (`@nestjs/testing`) para instanciar o serviço sob teste;
     - Uso de token de injeção em constante string (`ORDERS_REPOSITORY` / `PRODUCTS_REPOSITORY`) e interface TypeScript para o contrato do repositório;
     - Uso de dublê de teste (`Mocked<Repository>` com `vi.fn()`) injetado via `{ provide: TOKEN, useValue: mock }`;
     - Verificação explícita das chamadas ao repositório (`expect(repo.save).toHaveBeenCalledTimes(1)`) e das propriedades do objeto retornado.

---

## 3. Definição Técnica do Primeiro Teste Automatizado (Fase RED)

| Elemento da Especificação | Definição |
| :--- | :--- |
| **Objetivo do Teste** | Verificar que o serviço de aplicação `ProductsService.createProduct(name)` cadastra um novo produto quando recebe um nome válido, delegando a gravação ao `ProductsRepository.save` e retornando a instância criada. |
| **Cenário (`CA01`)** | Dado que o `ProductsService` está configurado com o repositório de produtos, quando `createProduct('Celular XYZ')` é chamado com dados válidos, então o repositório deve salvar o produto exatamente uma vez e o serviço deve retornar o `Product` contendo `productId` (string) e `name` igual a `'Celular XYZ'`. |
| **Pré-condições** | `TestingModule` compilado com `ProductsService` e mock de `ProductsRepository` configurado para retornar a entidade recebida em `save`. |
| **Entradas** | `name = 'Celular XYZ'` (string válida e não vazia). |
| **Resultado Esperado** | 1. `productsRepository.save` é invocado `1` vez (`toHaveBeenCalledTimes(1)`).<br>2. O objeto retornado possui `productId` do tipo `String` (`expect.any(String)`).<br>3. O objeto retornado possui `result.name === 'Celular XYZ'`. |
| **Nível de Teste Escolhido** | **Teste Unitário de Serviço de Aplicação** (`src/modules/products/services/products.service.spec.ts`). |
| **Comando de Execução** | `pnpm test src/modules/products/services/products.service.spec.ts` |

---

## 4. Justificativa Técnica do Nível de Teste Escolhido

Optou-se por um **teste unitário na camada de serviço de aplicação (`ProductsService`)** em vez de um teste HTTP/E2E pelos seguintes motivos técnicos:

1. **Alinhamento ao Planejamento Operacional (Material 03):** O refinamento de dependências (`03-02-dependencias-refinadas.md`) e a análise de paralelismo (`03-03-paralelismo.md`) estabeleceram que a `SUB-07` inicia pelos testes unitários orientados aos contratos de domínio e aplicação, enquanto os testes E2E (`Supertest`) dependem da integração completa das camadas de infraestrutura TypeORM (`SUB-04`) e controller HTTP (`SUB-06`).
2. **Isolamento do Comportamento de Negócio:** O teste unitário com dublê de repositório (`PRODUCTS_REPOSITORY`) permite verificar diretamente a orquestração do caso de uso `UC12` (`CA01`) sem depender de conexão ativa com container PostgreSQL ou de camada HTTP ainda não implementada.
3. **Fidelidade ao Padrão do Projeto:** Segue exatamente a estrutura já consolidada em `src/modules/orders/services/orders.service.spec.ts`.

---

## 5. Contratos Base e Código do Teste Implementado (Fase RED)

Para que a falha do teste represente genuinamente a **Fase RED do TDD** (falha por comportamento de negócio ainda não implementado, e não erro de compilação ou de importação de arquivo inexistente), foram definidos os contratos mínimos e o stub de `ProductsService`:

### 5.1 Contrato da Entidade (`src/modules/products/entities/product.entity.ts`)
```typescript
export class Product {
  constructor(
    public readonly productId: string,
    public readonly name: string,
  ) {}
}
```

### 5.2 Contrato do Repositório (`src/modules/products/repositories/products.repository.interface.ts`)
```typescript
import { Product } from '../entities/product.entity.js';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```

### 5.3 Stub do Serviço sem Implementação do Comportamento (`src/modules/products/services/products.service.ts`)
```typescript
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

  async createProduct(_name: string): Promise<Product> {
    throw new Error('Not implemented: createProduct');
  }
}
```

### 5.4 Primeiro Teste Automatizado (`src/modules/products/services/products.service.spec.ts`)
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository.interface.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Mocked<ProductsRepository>;

  beforeEach(async () => {
    const productsRepositoryMock: Mocked<ProductsRepository> = {
      save: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PRODUCTS_REPOSITORY, useValue: productsRepositoryMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(PRODUCTS_REPOSITORY);
  });

  it('should register and save a product when valid data is provided (CA01)', async () => {
    productsRepository.save.mockImplementation(async (input) => input);

    const result = await service.createProduct('Celular XYZ');

    expect(productsRepository.save).toHaveBeenCalledTimes(1);
    expect(result.productId).toEqual(expect.any(String));
    expect(result.name).toBe('Celular XYZ');
  });
});
```

