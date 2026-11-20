# ARTEFATO 08-05 — IMPLEMENTAÇÃO E EXECUÇÃO DOS TESTES INTEGRADOS DE BACKEND

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Identificação da Suíte e Objetivos Técnicos

- **Sub-Issue Responsável:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Sub-Issue do Caso de Uso:** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` ([#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Caminho do Arquivo:** `src/modules/products/products.integration.spec.ts`.
- **Framework de Testes:** Vitest 4.1.2.
- **Ferramenta de Requisição HTTP:** Supertest 7.0.0 (`supertest/types.js`).
- **Objetivo Central:** Exercitar o fluxo integrado real da aplicação NestJS utilizando o módulo completo (`ProductsModule`) com **todas as classes reais** (Controller, Service, Contrato de Persistência e Repositório em Memória), sem substituição de Service ou Repository por mocks no fluxo em memória.

---

## 2. 🌟 Refinamento da Fase 7 — Código Completo Consolidado em Arquivo Único

Em estrito atendimento à diretriz do Material 08, o código da suíte integrada foi implementado em um **único arquivo consolidado e funcional**, contendo todos os imports, preparação do container de IoC (`beforeAll`), configuração do `ValidationPipe`, cenários de teste (válido e inválido) e encerramento limpo da aplicação (`afterAll`):

**Arquivo:** `src/modules/products/products.integration.spec.ts`

```typescript
import {
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { type App } from 'supertest/types.js';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { ProductsController } from './controllers/products.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductsModule } from './products.module.js';
import { InMemoryProductsRepository } from './repositories/in-memory-products.repository.js';
import {
  PRODUCTS_REPOSITORY,
  type ProductsRepository,
} from './repositories/products.repository.interface.js';
import { ProductsService } from './services/products.service.js';

describe('POST /products — integração', () => {
  let app: INestApplication<App>;
  let moduleRef: TestingModule;
  let productsController: ProductsController;
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    productsController = moduleRef.get<ProductsController>(ProductsController);
    productsService = moduleRef.get<ProductsService>(ProductsService);
    productsRepository = moduleRef.get<ProductsRepository>(PRODUCTS_REPOSITORY);

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('deve criar um produto com dados válidos', async () => {
    expect(productsController).toBeInstanceOf(ProductsController);
    expect(productsService).toBeInstanceOf(ProductsService);
    expect(productsRepository).toBeInstanceOf(InMemoryProductsRepository);

    const saveSpy = vi.spyOn(productsRepository, 'save');

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Celular XYZ',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      name: 'Celular XYZ',
    });

    expect(response.body.productId).toEqual(
      expect.any(String),
    );

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      new Product(response.body.productId, 'Celular XYZ'),
    );

    saveSpy.mockRestore();
  });

  it('deve rejeitar nome vazio na fronteira HTTP', async () => {
    const saveSpy = vi.spyOn(productsRepository, 'save');

    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: '',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(saveSpy).not.toHaveBeenCalled();

    saveSpy.mockRestore();
  });
});
```

---

## 3. Análise Detalhada dos Cenários de Teste

### 3.1 Cenário Válido: Criação de Produto com Dados Válidos
- **Verificação das Instâncias Reais:** Através de `expect(...).toBeInstanceOf(...)`, comprova-se antes da chamada que o NestJS resolveu instâncias reais das classes `ProductsController`, `ProductsService` e `InMemoryProductsRepository`.
- **Spy Não Intrusivo:** O uso de `vi.spyOn(productsRepository, 'save')` atua como observador e **não altera a implementação real** do método `save` (a entidade continua sendo gravada no array em memória).
- **Requisição HTTP via Supertest:** O payload `{"name": "Celular XYZ"}` é transmitido via socket HTTP local para a aplicação.
- **Status Esperado:** `201 Created`.
- **Asserção de Resposta:** `response.body` contém `name: "Celular XYZ"` e um `productId` do tipo string (UUID v4).
- **Asserção de Interação Real:** O método `save` do repositório em memória é invocado exatamente 1 vez com a instância `Product` contendo o mesmo ID e nome da resposta.

### 3.2 Cenário Inválido: Rejeição de Nome Vazio na Fronteira HTTP
- **Requisição HTTP via Supertest:** Envio de payload `{"name": ""}`.
- **Intercepção pelo ValidationPipe:** O pipe global interrompe a requisição com `400 Bad Request`.
- **Garantia de Não Propagação:** `saveSpy` confirma que `productsRepository.save` **não foi invocado** (`not.toHaveBeenCalled()`), comprovando a proteção das camadas internas contra dados inválidos.

---

## 4. Evidência Real da Execução dos Testes Integrados no Terminal

### Comando Executado:
```bash
pnpm vitest run src/modules/products/products.integration.spec.ts
```

### Saída Real do Terminal:
```text
 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/modules/products/products.integration.spec.ts (2 tests) 81ms
   ✓ POST /products — integração (2)
     ✓ deve criar um produto com dados válidos 14ms
     ✓ deve rejeitar nome vazio na fronteira HTTP 2ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:32:49
   Duration  462ms (transform 29ms, setup 0ms, import 313ms, tests 81ms, environment 0ms)
```

---

## 5. Comparação com a Linha de Base e Ausência de Regressões

Executou-se em seguida a suíte completa de todos os testes do módulo de produtos (Unitário + Fronteira HTTP Mockada + Testes Integrados):

### Comando Executado:
```bash
pnpm vitest run src/modules/products
```

### Saída Real do Terminal:
```text
 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/modules/products/services/products.service.spec.ts (1 test) 54ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 55ms
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 53ms

 Test Files  3 passed (3)
      Tests  5 passed (5)
   Start at  22:31:16
   Duration  372ms (transform 77ms, setup 0ms, import 670ms, tests 162ms, environment 0ms)
```

### Evolução e Ausência de Regressões:
| Suíte de Testes | Linha de Base (Fase 3) | Situação Atual (Fase 7) | Variação |
| :--- | :---: | :---: | :---: |
| `products.service.spec.ts` (Unitário) | 1 aprovado | 1 aprovado | Mantido verde |
| `products.controller.spec.ts` (HTTP Mock) | 2 aprovados | 2 aprovados | Mantido verde |
| `products.integration.spec.ts` (Integrado) | *(não consolidado)* | 2 aprovados | **+2 aprovados** |
| **Total do Módulo de Produtos** | **3 aprovados** | **5 aprovados** | **+2 novos testes** |

---

## 6. Delimitação da Evidência de Armazenamento (Fase 8)

A análise da Fase 8 examina o limite exato do que foi comprovado em relação ao armazenamento:

1. **O que a resposta HTTP comprova:**
   - Comprova que a rota recebeu a requisição, executou o pipe, acionou o controller, que delegou ao service, que instanciou a entidade e chamou o repositório, serializando o resultado no retorno `201 Created`.
2. **O que o Spy no Repositório comprova:**
   - Comprova que o método `productsRepository.save(product)` da classe real `InMemoryProductsRepository` foi efetivamente executado com os parâmetros corretos.
3. **Encapsulamento do Repositório de Produção:**
   - Na classe `InMemoryProductsRepository`, o array de produtos é estritamente privado: `private readonly products: Product[] = [];`.
   - Em conformidade com as boas práticas de Engenharia de Software, **não se deve expor detalhes de infraestrutura** (como tornar o array público) nem adicionar métodos inexistentes no contrato de repositório (como `findAll()` ou `findById()`) apenas para facilitar a inspeção do teste integrado, quando esses métodos não pertencem aos requisitos do caso de uso.
   - Da mesma forma, **não se deve criar endpoints HTTP `GET /products`** fora do escopo do caso de uso UC12.
4. **Delimitação Formal:**
   - A resposta HTTP, combinada com a verificação de instância `toBeInstanceOf(InMemoryProductsRepository)` e a observação de chamada via `spyOn` restaurado, estabelece a comprovação técnica completa e não intrusiva do fluxo integrado em memória.
