# ARTEFATO 08-03 — VERIFICAÇÃO DE MÓDULOS E RESOLUÇÃO DE PROVIDERS

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Verificação dos 8 Pontos de Conformidade de Módulos e Injeção

A inspeção detalhada da configuração de injeção de dependência e módulos no projeto CeliLac confirmou os 8 pontos mandatórios:

| Ponto de Verificação | Situação no Projeto | Evidência Comprobatória |
| :--- | :---: | :--- |
| **1. Módulo da funcionalidade disponível** | **Confirmado** | `ProductsModule` implementado em `src/modules/products/products.module.ts`. |
| **2. Controller registrado** | **Confirmado** | `ProductsController` registrado no array `controllers` de `ProductsModule`. |
| **3. Service registrado** | **Confirmado** | `ProductsService` registrado no array `providers` de `ProductsModule`. |
| **4. Token de injeção configurado** | **Confirmado** | `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'` definido no arquivo de interface. |
| **5. Repositório em memória associado** | **Confirmado** | Provider customizado `{ provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }`. |
| **6. Importação no módulo raiz** | **Confirmado** | `ProductsModule` importado no array `imports` de `AppModule` (`src/app.module.ts`). |
| **7. ValidationPipe global configurado** | **Confirmado** | `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` em `src/main.ts`. |
| **8. Compilação e inicialização sem falhas** | **Confirmado** | Inicialização do container e resolução de instâncias executada com sucesso. |

---

## 2. Configuração Real do Módulo (`ProductsModule`)

**Arquivo:** `src/modules/products/products.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller.js';
import { InMemoryProductsRepository } from './repositories/in-memory-products.repository.js';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository.interface.js';
import { ProductsService } from './services/products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: InMemoryProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
```

---

## 3. Explicação Técnica: Provider Desacoplado e *Type Erasure*

Em TypeScript, interfaces puras (como `export interface ProductsRepository`) são **constructs de tempo de compilação**. Durante a etapa de compilação/transpilação para JavaScript (`tsc` ou `nest build`), todo o sistema de tipos estáticos sofre **type erasure** (eliminação completa de tipos).

Como resultado, em tempo de execução no Node.js:
1. Uma interface TypeScript não existe e não possui representação como objeto, função ou protótipo na memória do runtime V8.
2. O NestJS, cujo container de Inversão de Controle (IoC) opera em tempo de execução baseado em metadados de reflexão (`Reflect.getMetadata('design:paramtypes')`), não consegue associar uma interface como chave de injeção.
3. Se um construtor declarasse apenas `constructor(private readonly repo: ProductsRepository)`, o TypeScript emitiria metadado `Object`, e o NestJS falharia com `UnknownDependenciesException`.

### Solução Arquitetural Aplicada no CeliLac:
Define-se uma constante de token (`string` ou `symbol`) e anota-se o parâmetro do construtor com o decorador `@Inject()`:

```typescript
// Contrato
export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';
export interface ProductsRepository { ... }

// Consumo no Serviço (Camada de Aplicação)
@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}
}

// Configuração no Módulo (IoC Provider)
{
  provide: PRODUCTS_REPOSITORY,
  useClass: InMemoryProductsRepository,
}
```

Essa abordagem atende rigorosamente ao **Dependency Inversion Principle (DIP)**:
- O módulo de alto nível (`ProductsService`) depende de uma abstração (`ProductsRepository`).
- A infraestrutura (`InMemoryProductsRepository`) implementa a abstração.
- O container conecta ambas via token sem que o serviço tenha qualquer menção ou acoplamento com a classe concreta em memória.

---

## 4. Rastreamento da Cadeia de Resolução no Container NestJS

Quando a aplicação ou o módulo de testes é inicializado (`app.init()` ou `moduleRef.compile()`), o NestJS segue o seguinte grafo direcionado de dependências:

```text
[1. NestApplication / InstanceLoader]
                 │
                 ▼
[2. Instanciação do ProductsController]
                 │ solicita no construtor: ProductsService
                 ▼
[3. Resolução do Provider ProductsService]
                 │ solicita no construtor: @Inject('PRODUCTS_REPOSITORY')
                 ▼
[4. Busca no Container pelo Token 'PRODUCTS_REPOSITORY']
                 │ localiza a definição { provide: ..., useClass: InMemoryProductsRepository }
                 ▼
[5. Instanciação de InMemoryProductsRepository]
                 │ repositório não possui dependências adicionais
                 ▼
[6. Injeção de InMemoryProductsRepository no ProductsService]
                 │
                 ▼
[7. Injeção de ProductsService no ProductsController]
                 │
                 ▼
[8. Roteamento Registrado: POST /products pronto para execução]
```

---

## 5. Evidência Real de Compilação e Resolução de Dependências

A compilação do projeto via compilador TypeScript e Nest CLI foi executada no ambiente com êxito:

### Comando Executado:
```bash
pnpm build
```

### Saída do Terminal:
```text
$ nest build
(Compilação limpa, sem erros de tipagem, decorators ou referências de providers)
```

E no momento da inicialização da aplicação, os logs do NestJS confirmam a resolução de dependências no `InstanceLoader`:
```text
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +11ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
```

### Diagnóstico de Módulos e Providers:
- Zero falhas de injeção (`UnknownDependenciesException`);
- Token `PRODUCTS_REPOSITORY` associado corretamente;
- A cadeia de dependências está íntegra e pronta para suportar a execução integrada real.
