# ARTEFATO 11-05 — TESTES AUTOMATIZADOS DO CONTRATO HTTP

## 1. Suíte Existente e Lacuna Identificada

- **Arquivo:** `src/modules/products/controllers/products.controller.spec.ts`
- **Stack:** Vitest `4.1.2`, Supertest `7.0.0`, `@nestjs/testing` `12.1.2`.
- **Testes existentes preservados:**
  1. `should create a product when valid data is provided (POST /products -> 201)`
  2. `should reject an empty product name at the HTTP boundary (POST /products -> 400)`
- **Lacuna identificada:** Não havia teste comprovando que, caso o `ProductsService.createProduct` retorne uma propriedade interna adicional em tempo de execução (ex.: `internalNote`), o Controller e o mapper `toProductResponse()` filtram essa propriedade e expõem apenas o contrato público fechado (`productId` e `name`).

---

## 2. Estratégia de Mocks, Configuração e Asserções

- **Mock:** Preservado `serviceMock = { createProduct: vi.fn() }` (sem usar `jest.fn()` nem `create()`).
- **Cenário simulado:** `serviceMock.createProduct.mockResolvedValue({ productId: '550e8400-e29b-41d4-a716-446655440000', name: 'Produto de exemplo', internalNote: 'informacao-interna-ilustrativa' })`.
- **Restrição respeitada:** `internalNote` existe exclusivamente no objeto simulado do teste, sem ser adicionada a `Product`, `CreateProductDto`, `ProductsRepository`, `ProductOrmEntity` ou PostgreSQL.
- **Asserções:**
  - `expect(response.body).not.toHaveProperty('internalNote')` garante a não exposição explícita do campo interno.
  - `expect(response.body).toEqual({ productId: '550e8400-e29b-41d4-a716-446655440000', name: 'Produto de exemplo' })` valida o **contrato fechado** (diferente de `toMatchObject()`, que toleraria campos adicionais não verificados).
- **Estrutura preservada:** Mantidos `describe`, `beforeEach`, `afterEach`, `ValidationPipe` e inicialização de `INestApplication<App>` sem duplicação.

---

## 3. Código Consolidado (`src/modules/products/controllers/products.controller.spec.ts`)

```typescript
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../entities/product.entity.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsController } from './products.controller.js';

describe('ProductsController (HTTP)', () => {
  let app: INestApplication<App>;

  const serviceMock = {
    createProduct: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a product when valid data is provided (POST /products -> 201)', async () => {
    const createdProduct = new Product('product-1', 'Celular XYZ');
    serviceMock.createProduct.mockResolvedValue(createdProduct);

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Celular XYZ' })
      .expect(201);

    expect(serviceMock.createProduct).toHaveBeenCalledTimes(1);
    expect(serviceMock.createProduct).toHaveBeenCalledWith('Celular XYZ');
    expect(response.body).toEqual({
      productId: 'product-1',
      name: 'Celular XYZ',
    });
  });

  it('should reject an empty product name at the HTTP boundary (POST /products -> 400)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: '' })
      .expect(400);

    expect(serviceMock.createProduct).not.toHaveBeenCalled();
    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.arrayContaining(['name should not be empty']),
      }),
    );
  });

  it('should expose only public contract fields and filter simulated internal properties (POST /products -> 201)', async () => {
    serviceMock.createProduct.mockResolvedValue({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Produto de exemplo',
      internalNote: 'informacao-interna-ilustrativa',
    });

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto de exemplo' })
      .expect(201);

    expect(serviceMock.createProduct).toHaveBeenCalledTimes(1);
    expect(serviceMock.createProduct).toHaveBeenCalledWith('Produto de exemplo');
    expect(response.body).not.toHaveProperty('internalNote');
    expect(response.body).toEqual({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Produto de exemplo',
    });
  });
});
```

---

## 4. Execução e Regressão

| Comando | Arquivos | Testes | Resultado | Observações |
| :--- | :---: | :---: | :--- | :--- |
| `pnpm test` (`vitest run`) | 5 | 13 | **13 passed (0 failed)** | Inclui os 3 testes de `products.controller.spec.ts` |
| `pnpm test:integration` | 1 | 1 | **1 passed (0 failed)** | PostgreSQL real em `celilac_test:5435` |
| `pnpm test:e2e` | 2 | 2 | **2 passed (0 failed)** | `app.e2e-spec.ts` e `confirm-order.e2e-spec.ts` |
| `pnpm build` | — | — | **Passou (0 erros)** | Compilação `nest build` |
| `pnpm lint` | 54 | — | **Passou (0 erros)** | 3 avisos pré-existentes fora dos arquivos alterados |

- **Regressões:** Zero regressões detectadas.
- **Pendências:** Nenhuma pendência nos testes automatizados do contrato.

