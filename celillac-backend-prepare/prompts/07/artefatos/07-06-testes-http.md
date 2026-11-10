# ARTEFATO 07-06 — TESTES AUTOMATIZADOS DA FRONTEIRA HTTP E REGRESSÃO

## 1. Identificação e Ferramental de Testes

| Elemento | Valor Verificado no Projeto |
| :--- | :--- |
| **Issues Relacionadas** | [`SUB-06` (Issue #9 — Endpoint HTTP)](https://github.com/evertonfoz/dsc-tests/issues/9) e [`SUB-07` (Issue #10 — Testes Automatizados)](https://github.com/evertonfoz/dsc-tests/issues/10) |
| **Arquivo de Teste HTTP Criado** | `src/modules/products/controllers/products.controller.spec.ts` |
| **Arquivo de Teste Unitário Anterior** | `src/modules/products/services/products.service.spec.ts` |
| **Framework de Testes** | **Vitest** (`v4.1.11`, configurado em `vitest.config.ts`) |
| **Biblioteca de Requisições HTTP** | **Supertest** (`^7.0.0` + `@types/supertest` `^7.0.0`) |
| **Utilitário de Módulo de Teste** | `@nestjs/testing` (`Test.createTestingModule`) |

---

## 2. Código Implementado (`src/modules/products/controllers/products.controller.spec.ts`)

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

### Análise da Configuração do Contexto de Teste
1. **Isolamento com `serviceMock` (`createProduct: vi.fn()`):** Substitui `ProductsService` por um dublê de teste controlado, permitindo verificar se a camada HTTP delega (ou deixa de delegar) a chamada ao serviço com o argumento exato.
2. **Higiene de Estado (`vi.clearAllMocks()` e `await app.close()`):** Antes de cada teste os contadores do mock são zerados, e após cada teste a instância da aplicação NestJS é encerrada para liberar recursos.
3. **Alinhamento ao Pipeline de Produção:** Registra `new ValidationPipe({ whitelist: true, transform: true })` na aplicação de teste, reproduzindo fielmente o comportamento da fronteira HTTP configurado em `src/main.ts`.

---

## 3. Execução Real dos Testes e Saídas Obtidas

### 3.1 Execução Exclusiva da Suíte HTTP (`products.controller.spec.ts`)
- **Comando:** `pnpm test src/modules/products/controllers/products.controller.spec.ts --run`
- **Saída real:**
  ```text
  RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 77ms
     ✓ ProductsController (HTTP) (2)
       ✓ should create a product when valid data is provided (POST /products -> 201) 72ms
       ✓ should reject an empty product name at the HTTP boundary (POST /products -> 400) 5ms

   Test Files  1 passed (1)
        Tests  2 passed (2)
     Start at  12:35:16
     Duration  449ms (transform 24ms, setup 0ms, import 306ms, tests 77ms, environment 0ms)
  ```

### 3.2 Reexecução do Teste Unitário Anterior de `CA01` (`products.service.spec.ts`)
- **Comando:** `pnpm test src/modules/products/services/products.service.spec.ts --run`
- **Saída real:**
  ```text
  RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/modules/products/services/products.service.spec.ts (1 test) 48ms
     ✓ ProductsService (1)
       ✓ should register and save a product when valid data is provided (CA01) 47ms

   Test Files  1 passed (1)
        Tests  1 passed (1)
     Start at  12:35:17
     Duration  332ms (transform 24ms, setup 0ms, import 167ms, tests 48ms, environment 0ms)
  ```

### 3.3 Execução da Suíte Completa do Projeto (`pnpm test --run`)
- **Comando:** `pnpm test --run`
- **Saída real:**
  ```text
  RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/modules/products/services/products.service.spec.ts (1 test) 158ms
   ✓ src/app.controller.spec.ts (1 test) 166ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 173ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 70ms

   Test Files  4 passed (4)
        Tests  10 passed (10)
     Start at  12:35:18
     Duration  525ms (transform 119ms, setup 0ms, import 898ms, tests 566ms, environment 0ms)
  ```

---

## 4. Interpretação Metodológica: Escopo e Limitações dos Testes

| Tipo de Teste | O que Exercita | Presente nesta Etapa? | Limitações |
| :--- | :--- | :---: | :--- |
| **Teste Unitário de Controller** | Invoca diretamente o método TypeScript `controller.create(dto)` sem subir servidor HTTP nem executar `ValidationPipe`. | Não (substituído por teste HTTP mais abrangente) | Não verifica roteamento `@Post('/products')`, serialização JSON, status HTTP ou pipes. |
| **Teste HTTP com Serviço Simulado (`products.controller.spec.ts`)** | Sobe a camada HTTP NestJS (`INestApplication` + `ValidationPipe`) e envia requisições reais via Supertest contra um `ProductsService` simulado (`vi.fn()`). | **Sim (`2 passed`)** | Comprova o funcionamento da fronteira HTTP (`201` e `400` + delegação), mas **não** testa a lógica interna do serviço real nem o banco de dados. |
| **Teste Unitário de Serviço (`products.service.spec.ts`)** | Testa `ProductsService.createProduct` isoladamente com mock de `ProductsRepository`. | **Sim (`1 passed` — `CA01`)** | Não cobre ainda `CA02` (rejeição de nome vazio no serviço/domínio) nem persistência real. |
| **Teste de Integração / E2E com Persistência Real** | Exercita o fluxo completo desde o endpoint HTTP até o banco PostgreSQL real. | Não (fora do escopo desta unidade) | Depende da implementação da `SUB-04` (repositório TypeORM e migration de `products`). |

### Conclusão sobre Regressões e Pendências
- **Regressões:** **Zero regressões.** Os 8 testes anteriores continuam passando e a suíte avançou de `8 passed` para `10 passed` (`4 passed` arquivos de teste).
- **Pendências:** Implementar em ciclos futuros os testes unitários de `CA02`/`CA03`/`FE01` no serviço (`SUB-03`/`SUB-05`/`SUB-07`) e os testes de integração com banco real após a `SUB-04`.

