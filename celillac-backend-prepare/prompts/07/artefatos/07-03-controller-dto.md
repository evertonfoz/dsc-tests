# ARTEFATO 07-03 — IMPLEMENTAÇÃO DO CONTROLLER E DO DTO

## 1. Identificação e Rastreabilidade de Escopo

| Elemento | Valor Verificado |
| :--- | :--- |
| **Issue Principal** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue do Endpoint HTTP** | [`SUB-06 — [UC12][HTTP] Criar endpoint POST /products` (Issue #9)](https://github.com/evertonfoz/dsc-tests/issues/9) |
| **Issue do DTO (Coordenada)** | [`SUB-02 — [UC12][Contratos] Criar DTO de cadastro de produto` (Issue #5)](https://github.com/evertonfoz/dsc-tests/issues/5) |
| **Issue do Serviço Reutilizado** | [`SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` (Issue #8)](https://github.com/evertonfoz/dsc-tests/issues/8) |
| **Branch de Trabalho** | `feature/uc12-06-products-http` (derivada de `feature/uc12-05-products-service`) |

---

## 2. Implementação do Controller (`ProductsController`)

### 2.1 Arquivo Implementado
- **Caminho:** `src/modules/products/controllers/products.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductsService } from '../services/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(dto.name);
  }
}
```

### 2.2 Responsabilidades e Contratos Verificados no Controller
1. **Prefixo de Rota (`@Controller('products')`):** Define o agrupamento de rotas sob `/products`.
2. **Método HTTP (`@Post()`):** Configura o endpoint `POST /products` e adota o código HTTP padrão do NestJS para criação (`201 Created`).
3. **Extração do Corpo (`@Body() dto: CreateProductDto`):** Extrai o corpo JSON da requisição HTTP e o submete ao pipeline de validação e transformação associado ao tipo `CreateProductDto`.
4. **Injeção de Dependência (`ProductsService`):** Recebe a instância gerenciada pelo container IoC do NestJS via construtor (`private readonly productsService: ProductsService`).
5. **Delegação Fiel ao Contrato Existente:** Invoca `this.productsService.createProduct(dto.name)`, respeitando rigorosamente a assinatura `ProductsService.createProduct(name: string): Promise<Product>` sem substituí-la por `create(dto)`.
6. **Ausência de Acoplamento Indevido:** O Controller **não** instancia `Product`, **não** gera UUID, **não** contém regras de negócio, **não** executa SQL e **não** acessa `ProductsRepository` diretamente.

---

## 3. Implementação do DTO (`CreateProductDto`)

### 3.1 Arquivo Implementado
- **Caminho:** `src/modules/products/dtos/create-product.dto.ts`

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
```

### 3.2 Restrições Configuradas e Justificativas Técnicas
1. **Aderência Estrita ao Contrato da Entidade (`name`):** O DTO declara exclusivamente a propriedade `name!: string`, mantendo total alinhamento com o contrato atual de `Product(productId, name)` e de `ProductsService.createProduct(name)`. Não foi introduzido o campo `price`.
2. **Decoradores de Validação (`class-validator`):**
   - `@IsString()`: Garante que o valor de `name` no payload JSON seja do tipo texto (`string`).
   - `@IsNotEmpty()`: Garante que `name` não seja uma string vazia (`""`), `null` ou `undefined`.
3. **Coordenação com a `SUB-02` (Issue #5):** O arquivo foi criado em coordenação explícita entre `SUB-02` (#5) e `SUB-06` (#9), registrado no [comentário #6723458815 da Issue #5](https://github.com/evertonfoz/dsc-tests/issues/5#issuecomment-6723458815), mantendo a Issue #5 aberta para os demais contratos de resposta previstos no épico.

---

## 4. Distinção Obrigatória: Validação da Fronteira HTTP vs. Regra de Negócio (`CA02`)

| Dimensão | Validação da Fronteira HTTP (`SUB-06` / `SUB-02`) | Regra de Negócio na Aplicação/Domínio (`SUB-03` / `SUB-05`) |
| :--- | :--- | :--- |
| **Mecanismo** | Decoradores `@IsString()`, `@IsNotEmpty()` em `CreateProductDto` + `ValidationPipe` do NestJS | Validação invariante em `ProductsService` / `Product` (`ProductNameRequiredException`) |
| **Camada Arquitetural** | Camada de Interface HTTP (Apresentação) | Camada de Aplicação / Domínio |
| **Comportamento em Caso de Falha** | Rejeita a requisição HTTP com `400 Bad Request` **antes** de invocar `ProductsController.create` e `ProductsService.createProduct` | Impede a criação/persistência de um produto inválido independentemente do canal de chamada (HTTP, CLI, fila, teste unitário direto) |
| **Situação Atual no Projeto** | **Implementada e verificada nesta etapa** | **Pendente** para o ciclo TDD próprio de `CA02` (`RED → GREEN → REFACTOR`) |

Portanto, a rejeição de `{"name": ""}` pelo DTO/ValidationPipe comprova o funcionamento correto da **fronteira HTTP**, mas **não significa** que `CA02` esteja implementado dentro de `ProductsService.createProduct(name)`, o qual foi preservado sem modificações nesta fase.

---

## 5. Verificações Realizadas e Pendências

- [x] `ProductsController` implementado em `src/modules/products/controllers/products.controller.ts`.
- [x] `CreateProductDto` implementado em `src/modules/products/dtos/create-product.dto.ts`.
- [x] Assinatura `ProductsService.createProduct(name: string): Promise<Product>` preservada e consumida sem alterações.
- [x] Compilação TypeScript/NestJS (`pnpm build`) executada sem erros.
- **Pendências para este componente:** Nenhuma no escopo da fronteira HTTP de `POST /products`.

