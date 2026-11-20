# ARTEFATO 07-06 — TESTES AUTOMATIZADOS DA FRONTEIRA HTTP

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Identificação da Suíte e Rastreabilidade

- **Sub-Issue de Testes Automatizados:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Sub-Issue do Endpoint:** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` ([#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Framework de Testes:** Vitest 4.1 (`vi.fn()`, `vi.spyOn()`).
- **Biblioteca de Teste HTTP:** Supertest 7.3 com `@types/supertest`.
- **Arquivos Implementados:**
  - `src/modules/products/controllers/products.controller.spec.ts` (Teste da fronteira HTTP com dublê de serviço).
  - `src/modules/products/products.integration.spec.ts` (Teste de integração da fronteira HTTP com módulo completo e repositório em memória).

---

## 2. 🌟 Refinamento 3 (Obrigatório) — Testes da Fronteira HTTP com Supertest

Em estrita consonância com o Material 07, foram implementados os dois cenários mandatórios exercitando a rota via protocolo HTTP:

### 2.1 Código de Testes da Fronteira HTTP (`products.controller.spec.ts`)

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
});
```

---

## 3. Evidência Real da Execução dos Testes da Fronteira HTTP

Executou-se a suíte completa de testes do módulo de produtos via terminal:

```text
$ npx vitest run src/modules/products/

 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/modules/products/services/products.service.spec.ts (1 test) 87ms
   ✓ ProductsService (1)
     ✓ should register and save a product when valid data is provided (CA01) 87ms

 ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 63ms
   ✓ ProductsController (HTTP) (2)
     ✓ should create a product when valid data is provided (POST /products -> 201) 58ms
     ✓ should reject an empty product name at the HTTP boundary (POST /products -> 400) 3ms

 ✓ src/modules/products/products.integration.spec.ts (2 tests) 58ms
   ✓ POST /products — integração (2)
     ✓ deve criar um produto com dados válidos 12ms
     ✓ deve rejeitar nome vazio na fronteira HTTP 2ms

 Test Files  3 passed (3)
      Tests  5 passed (5)
   Start at  22:25:27
   Duration  581ms (transform 123ms, setup 0ms, import 1.13s, tests 207ms, environment 0ms)
```

---

## 4. Revalidação da Ausência de Regressões

O teste unitário do serviço de aplicação (`products.service.spec.ts`), desenvolvido e integrado no Material 05/06, foi executado em conjunto com a nova fronteira HTTP:
- **Resultado:** 100% verde (87ms).
- **Garantia:** A adição do `ProductsController`, do `CreateProductDto`, do `InMemoryProductsRepository` e do `ValidationPipe` não provocou nenhuma alteração ou quebra de contrato no serviço de aplicação.

---

## 5. Diferenciação Técnica dos Quatro Níveis de Teste

A equipe consolida didaticamente a distinção entre os níveis de teste:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Teste Unitário de Controller                                        │
│    - Instanciação direta da classe ProductsController via TypeScript   │
│    - Não exercita pipeline HTTP, middlewares ou ValidationPipe         │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Teste da Fronteira HTTP com Dublê de Serviço (SUPERTEST)            │
│    - Sobe NestApplication mínima em memória                            │
│    - Exercita serialização JSON, roteamento, DTO e ValidationPipe      │
│    - Comprova delegação ao serviço mock sem acionar persistência       │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Teste de Integração em Memória (Módulo Completo)                    │
│    - Sobe o ProductsModule resolvendo InMemoryProductsRepository       │
│    - Testa o fluxo HTTP até a simulação de persistência                │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Teste de Integração Real com Banco de Dados e Teste E2E             │
│    - Exercita conexões PostgreSQL reais, migrações e persistência      │
│    - Escopo planejado para os Materiais 08 e 09                        │
└────────────────────────────────────────────────────────────────────────┘
```
