# ARTEFATO 07-04 — VALIDAÇÃO GLOBAL E COMPOSIÇÃO DO MÓDULO NESTJS

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Configuração do `ValidationPipe` Global

Para garantir que todos os endpoints da aplicação validem automaticamente as entradas decoradas nos DTOs, configurou-se o `ValidationPipe` no ponto de entrada global da aplicação:

**Arquivo:** `src/main.ts`

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3200;
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
await bootstrap();
```

### Explicação Técnica Precisa das Opções do `ValidationPipe`:
- **`whitelist: true`**: Inspeciona as propriedades presentes no JSON da requisição. Qualquer propriedade que não possua decorador de validação correspondente na classe DTO é **automaticamente removida** antes que o objeto chegue ao método do Controller. Isso impede ataques de *Mass Assignment* (injeção de propriedades não autorizadas).
- **`transform: true`**: Utiliza a biblioteca `class-transformer` para instanciar a classe do DTO a partir do objeto JavaScript plano recebido no payload. Permite conversões automáticas primitivas e tipagem forte em tempo de execução.
- **Interrupção Automática com `400 Bad Request`**: Caso qualquer validação decorada (`@IsString`, `@IsNotEmpty`) falhe, o NestJS interrompe imediatamente a requisição na camada de *Pipes*, sem executar o método do Controller ou acionar o Serviço de Aplicação.

---

## 2. Composição do Módulo da Funcionalidade (`ProductsModule`)

O módulo encapsula o Controller, o Serviço e associa a abstração do repositório a uma implementação concreta.

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

## 3. Implementação Didática do Repositório em Memória

Para viabilizar a execução operacional da API HTTP nesta etapa antes da introdução de banco de dados relacional, implementou-se o repositório em memória em estrita conformidade com o contrato `ProductsRepository`.

**Arquivo:** `src/modules/products/repositories/in-memory-products.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity.js';
import { ProductsRepository } from './products.repository.interface.js';

@Injectable()
export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: Product[] = [];

  async save(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }
}
```

---

## 4. Integração no Módulo Raiz (`AppModule`)

O `ProductsModule` foi devidamente importado no módulo principal da aplicação:

**Arquivo:** `src/app.module.ts` (trecho)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ ... }),
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: DomainHttpExceptionFilter }],
})
export class AppModule {}
```

---

## 5. Evidências Reais de Inicialização da Aplicação

A inicialização real da aplicação no terminal com o container de injeção de dependência resolveu todos os módulos e mapeou com sucesso as rotas:

```text
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [NestFactory] Starting Nest application...
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +4ms
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +1ms
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +11ms
[Nest] 65479  - 11/19/2026, 10:25:17 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [InstanceLoader] OrdersModule dependencies initialized +0ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
[Nest] 65479  - 11/19/2026, 10:25:18 PM     LOG [NestApplication] Nest application successfully started +1ms
Server is running on http://localhost:3210
```

### Análise dos Logs:
1. `ProductsModule dependencies initialized`: Injeção de `ProductsService` e binding de `PRODUCTS_REPOSITORY` resolvidos sem exceções.
2. `Mapped {/products, POST} route`: Rota HTTP registrada e pronta para responder no endereço local.
