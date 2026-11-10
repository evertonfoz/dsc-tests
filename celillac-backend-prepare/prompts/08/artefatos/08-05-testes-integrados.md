# ARTEFATO 08-05 — TESTES INTEGRADOS E DELIMITAÇÃO DA EVIDÊNCIA DE ARMAZENAMENTO

## 1. Objetivos e Identificação Técnica

| Elemento | Definição |
| :--- | :--- |
| **Objetivo** | Verificar de forma automatizada e reproduzível a integração entre `ProductsModule`, `ProductsController`, `CreateProductDto`, `ValidationPipe`, `ProductsService` e `InMemoryProductsRepository` reais via requisições HTTP com Supertest e Vitest. |
| **Issue Principal** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue Responsável pelo Teste** | [`SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (Issue #10)](https://github.com/evertonfoz/dsc-tests/issues/10) (em coordenação com [`SUB-06` — Issue #9](https://github.com/evertonfoz/dsc-tests/issues/9)) |
| **Arquivo Implementado** | `src/modules/products/products.integration.spec.ts` |
| **Framework e Ferramentas** | `vitest` (`v4.1.11`), `supertest` (`^7.0.0`), `@nestjs/testing` (`Test.createTestingModule`), `ValidationPipe` (`@nestjs/common`) |
| **Componentes Reais Exercitados** | `ProductsModule`, `ProductsController`, `CreateProductDto`, `ProductsService`, `InMemoryProductsRepository` (associado ao token `PRODUCTS_REPOSITORY`), entidade `Product` |
| **Mocks Utilizados** | **Nenhum mock** (nem `ProductsService` nem `InMemoryProductsRepository` foram substituídos por dublês). |

---

## 2. Código Completo e Consolidado (`src/modules/products/products.integration.spec.ts`)

Em conformidade com o **Refinamento da Seção 10.3**, o teste integrado foi consolidado integralmente em um único arquivo contendo preparação (`beforeAll`), cenários de teste (`it`) e encerramento (`afterAll`), além da verificação explícita das instâncias reais resolvidas pelo `ProductsModule`:

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

## 3. Análise dos Cenários Implementados

### 3.1 Cenário 1 — `deve criar um produto com dados válidos`
1. **Disponibilidade da rota:** Envia `POST /products` ao servidor HTTP criado a partir de `ProductsModule`.
2. **Aceitação do DTO:** O payload `{ name: 'Celular XYZ' }` passa pelo `ValidationPipe({ whitelist: true, transform: true })` e é aceito por `CreateProductDto`.
3. **Resposta HTTP adequada:** Retorna `201 Created`.
4. **Presença de `productId`:** `expect(response.body.productId).toEqual(expect.any(String))` confirma a geração dinâmica de UUID pelo `ProductsService` real.
5. **Preservação de `name`:** `expect(response.body).toMatchObject({ name: 'Celular XYZ' })`.
6. **Utilização do módulo real e ausência de mocks:** `Test.createTestingModule({ imports: [ProductsModule] })` sem `.overrideProvider()`, confirmado por `toBeInstanceOf(ProductsController)`, `toBeInstanceOf(ProductsService)` e `toBeInstanceOf(InMemoryProductsRepository)`.

### 3.2 Cenário 2 — `deve rejeitar nome vazio na fronteira HTTP`
1. **Envio de nome vazio:** Envia `{ name: '' }` para `POST /products`.
2. **Resposta HTTP de rejeição:** Retorna `400 Bad Request` (`expect(response.body.statusCode).toBe(400)`).
3. **Aplicação do `ValidationPipe` e consistência com o DTO:** A violação de `@IsNotEmpty()` interrompe o fluxo na fronteira HTTP e `expect(saveSpy).not.toHaveBeenCalled()` confirma que nenhuma gravação ocorreu no repositório (`CA03` na fronteira HTTP).
4. **Delimitação sobre `CA02`:** Este teste comprova a rejeição na **fronteira HTTP**, mas **não** comprova que `ProductsService.createProduct('')` rejeitaria o nome vazio se invocado diretamente sem passar pelo Controller/Pipe.

---

## 4. Execução Real dos Testes e Análise dos Resultados

### 4.1 Execução Isolada do Novo Teste Integrado
- **Comando:** `pnpm test src/modules/products/products.integration.spec.ts --run`
- **Saída real:**
  ```text
  $ vitest run src/modules/products/products.integration.spec.ts --run

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/modules/products/products.integration.spec.ts (2 tests) 83ms
     ✓ POST /products — integração (2)
       ✓ deve criar um produto com dados válidos 13ms
       ✓ deve rejeitar nome vazio na fronteira HTTP 1ms

   Test Files  1 passed (1)
        Tests  2 passed (2)
     Start at  19:25:47
     Duration  504ms (transform 57ms, setup 0ms, import 354ms, tests 83ms, environment 0ms)
  ```

### 4.2 Execução da Suíte Completa (Incluindo Testes Anteriores)
- **Comando:** `pnpm test --run`
- **Saída real:**
  ```text
  $ vitest run --run

   RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

   ✓ src/app.controller.spec.ts (1 test) 59ms
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 57ms
   ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 62ms
   ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 54ms
   ✓ src/modules/products/products.integration.spec.ts (2 tests) 53ms

   Test Files  5 passed (5)
        Tests  12 passed (12)
     Start at  19:25:50
     Duration  372ms (transform 137ms, setup 0ms, import 985ms, tests 285ms, environment 0ms)
  ```

### 4.3 Comparação com a Linha de Base (Fase 3)

| Métrica | Linha de Base (Material 07 / Fase 3) | Resultado Atual (Material 08 / Fase 7) | Evolução Observada |
| :--- | :---: | :---: | :--- |
| **Arquivos de teste (`Test Files`)** | `4 passed (4)` | **`5 passed (5)`** | `+1` arquivo (`products.integration.spec.ts`) |
| **Testes executados (`Tests`)** | `10 passed (10)` | **`12 passed (12)`** | `+2` testes integrados aprovados |
| **Teste unitário (`products.service.spec.ts`)** | `1 passed` | **`1 passed`** | Preservado sem regressão |
| **Teste HTTP simulado (`products.controller.spec.ts`)** | `2 passed` | **`2 passed`** | Preservado sem regressão |
| **Demais suítes (`AppController` + `OrdersService`)** | `7 passed` | **`7 passed`** | Preservadas sem regressão |
| **Falhas / Regressões** | `0` | **`0`** | Zero regressões introduzidas |

---

## 5. Delimitação da Evidência de Armazenamento (Fase 8)

O contrato atual de persistência (`ProductsRepository`) define exclusivamente a operação de escrita:

```typescript
export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```

E a implementação em memória (`InMemoryProductsRepository`) encapsula a coleção internamente como atributo privado:

```typescript
@Injectable()
export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }
}
```

### Distinção Técnica Obrigatória entre as Evidências

1. **Evidência pela Resposta HTTP (`response.body`):**
   - Receber `201 Created` com `{ productId: "...", name: "Celular XYZ" }` demonstra que a requisição atravessou o Controller, executou `ProductsService.createProduct` e retornou o resultado de `this.productsRepository.save(product)`.
   - **Limitação:** Isoladamente, a resposta HTTP **não comprova** que o array interno `this.products` de `InMemoryProductsRepository` foi inspecionado (pois um repositório defeituoso que apenas fizesse `return product` sem `this.products.push(product)` produziria exatamente a mesma resposta HTTP).
2. **Evidência por Instrumentação Controlada da Implementação Real (`vi.spyOn`):**
   - No teste integrado implementado, obteve-se a instância real do container (`moduleRef.get<ProductsRepository>(PRODUCTS_REPOSITORY)`), comprovou-se que ela é uma instância de `InMemoryProductsRepository` (`toBeInstanceOf(InMemoryProductsRepository)`) e aplicou-se `vi.spyOn(productsRepository, 'save')` **sem substituir sua implementação** (isto é, executando o método real `InMemoryProductsRepository.prototype.save`).
   - Isso comprova que o método `save` da instância real `InMemoryProductsRepository` foi invocado exatamente 1 vez com `new Product(response.body.productId, 'Celular XYZ')` no cenário válido e `0` vezes no cenário inválido.
3. **Limitação quanto à Inspeção Direta do Estado Interno (`products`):**
   - Como `private readonly products: Product[] = []` é privado em TypeScript e o contrato `ProductsRepository` não possui métodos de leitura (`findById`, `findAll`), **não foram criados métodos extras no contrato nem endpoints `GET /products`** apenas para inspecionar o array em memória, preservando o encapsulamento e os contratos aprovados. A verificação direta de persistência com consulta ao estado armazenado ocorrerá de forma apropriada quando a infraestrutura PostgreSQL/TypeORM (`SUB-04`) e seus testes de integração com banco real forem implementados.

