# ARTEFATO 11-05 — TESTES AUTOMATIZADOS DO CONTRATO HTTP

## 1. Estratégia de Testes do Contrato

A validação de contratos HTTP exige uma abordagem automatizada que combine:
1. **Verificação de Sucesso (`201 Created`):** Validação de que entradas válidas geram a resposta correta com o identificador e nome.
2. **Verificação da Fronteira HTTP (`400 Bad Request`):** Validação de que o `ValidationPipe` barra dados inconsistentes antes de invocar o Service.
3. **Verificação de Não Exposição de Propriedades Internas:** Simulação intencional no mock do Service de um objeto com propriedades internas extras (ex.: `internalNote`), assegurando que o Controller e seu mapper filtram tais dados e nunca os expõem ao cliente.
4. **Asserção Fechada com `toEqual()`:** Garantir que o objeto resultante não contenha nenhuma chave além das especificadas no contrato público.

---

## 2. Implementação Consolidada da Suíte de Testes do Controller

O arquivo `src/modules/products/controllers/products.controller.spec.ts` foi atualizado preservando integralmente os testes anteriores do Material 07 e incorporando o teste de não exposição com asserção estrita:

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

  it('should not expose internal properties from domain/service in the HTTP response', async () => {
    const internalProductSimulation = {
      productId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Produto de exemplo',
      internalNote: 'informacao-interna-ilustrativa',
    };
    serviceMock.createProduct.mockResolvedValue(
      internalProductSimulation as unknown as Product,
    );

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto de exemplo' })
      .expect(201);

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

## 3. Teste de Sanidade (Ciclo RED → GREEN)

Para comprovar a eficácia preventiva do teste de não exposição:
1. **Cenário RED (Falha Intencional):** Se o `ProductsController` retornar diretamente o objeto do service (`return this.productsService.createProduct(...)`) sem passar pelo mapper, `response.body` passa a conter a propriedade `internalNote`. O teste falha com a seguinte asserção:
   ```
   AssertionError: expected { productId: '...', name: '...', internalNote: '...' } not to have property 'internalNote'
   ```
2. **Cenário GREEN (Aprovação com Mapeamento):** Com `return toProductResponse(product)`, a projeção é restrita a `productId` e `name`. O teste passa com 100% de sucesso.

---

## 4. Resultados da Execução dos Testes Automatizados

Execução realizada no runner oficial do projeto (Vitest 4.x):

```bash
$ pnpm vitest run src/modules/products/controllers/products.controller.spec.ts

 ✓ src/modules/products/controllers/products.controller.spec.ts (3 tests) 103ms
   ✓ ProductsController (HTTP) (3)
     ✓ should create a product when valid data is provided (POST /products -> 201)
     ✓ should reject an empty product name at the HTTP boundary (POST /products -> 400)
     ✓ should not expose internal properties from domain/service in the HTTP response

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  592ms
```

### Execução Completa dos Módulos de Produtos:
```bash
$ pnpm vitest run src/modules/products/

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Duration  592ms
```

### Comparação com a Linha de Base:
- **Linha de Base do Material 10:** 2 testes no `products.controller.spec.ts` (total de 5 testes rápidos no módulo de produtos).
- **Após Estabilização do Material 11:** 3 testes no `products.controller.spec.ts` (total de 6 testes rápidos no módulo de produtos).
- **Taxa de Sucesso:** 100% aprovado. Zero regressões.
