# ARTEFATO 04-04 — ESPECIFICAÇÃO TÉCNICA DO PRIMEIRO TESTE AUTOMATIZADO (TDD RED)

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API)  
> **Data de Emissão:** 10/11/2026

---

## 1. Contexto Metodológico e Objetivo

No desenvolvimento guiado por testes (Test-Driven Development — TDD), a fase **RED** tem por objetivo escrever um teste automatizado que expresse de forma inequívoca o comportamento de negócio desejado antes de escrever o código de produção que o atenda.

- **Issue Vinculada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Critério de Aceite Focal:** `CA01` — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto.
- **Requisitos Funcionais Associados:** `RF01` (Cadastrar produto), `RF02` (Validar dados), `RF03` (Persistir informações válidas).
- **Meta Específica da Unidade:** Especificar o teste automatizado para o cenário de sucesso com dados válidos, acompanhado apenas dos contratos e stubs mínimos indispensáveis para a compilação do projeto, **sem implementar a lógica de produção** (mantendo estritamente o estado RED).

---

## 2. Cenário de Teste e Asserções

### 2.1 Identificação do Cenário
- **Título do Cenário:** `should register and save a product when valid data is provided (CA01)`
- **Nível de Teste:** Teste Unitário com injeção de dependências e dublê de repositório (mock via Vitest).
- **Justificativa do Nível Unitário:** O comportamento a ser verificado reside na lógica de orquestração do serviço de aplicação (`ProductsService`). Testes unitários oferecem execução ultrarrápida, feedback imediato e isolamento completo em relação a bancos de dados físicos ou redes, permitindo verificar as invariantes da camada de aplicação antes de envolver infraestrutura pesada.

### 2.2 Estrutura do Teste (Padrão AAA — Arrange, Act, Assert)
1. **Arrange (Preparação):**
   - Criação de um módulo de testes NestJS (`TestingModule`) configurado com `ProductsService` e um mock de `ProductsRepository` sob o token `PRODUCTS_REPOSITORY`.
   - Configuração do mock `productsRepository.save` para resolver retornando o próprio produto recebido como parâmetro.
2. **Act (Ação):**
   - Invocação de `await service.createProduct('Celular XYZ')`.
3. **Assert (Verificação):**
   - O repositório deve ter sido chamado exatamente uma vez: `expect(productsRepository.save).toHaveBeenCalledTimes(1)`.
   - O objeto retornado deve conter um `productId` válido gerado: `expect(result.productId).toEqual(expect.any(String))`.
   - O objeto retornado deve conter o nome informado: `expect(result.name).toBe('Celular XYZ')`.

---

## 3. Contratos de Suporte e Arquivos Criados

Para viabilizar a compilação do teste dentro do ecossistema TypeScript/NestJS, foram introduzidos os contratos mínimos e um stub intencionalmente incompleto:

### 3.1 Entidade de Domínio Mínima (`product.entity.ts`)
```typescript
export class Product {
  constructor(
    public readonly productId: string,
    public readonly name: string,
  ) {}
}
```

### 3.2 Contrato de Persistência (`products.repository.interface.ts`)
```typescript
import { Product } from '../entities/product.entity.js';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```

### 3.3 Stub do Serviço de Aplicação (`products.service.ts`)
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
    // Intencionalmente NÃO IMPLEMENTADO para caracterizar a fase RED
    throw new Error('Not implemented: createProduct');
  }
}
```

### 3.4 Arquivo do Teste Automatizado (`products.service.spec.ts`)
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

---

## 4. Garantia Metodológica de Restrição

- **Não avanço para GREEN:** Não foi introduzida a geração real de UUID nem a invocação de `productsRepository.save` na classe `ProductsService`.
- **Rastreabilidade estrita:** O teste modela fielmente o critério `CA01` registrado na Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10).

