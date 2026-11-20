# ARTEFATO 07-03 — IMPLEMENTAÇÃO DO CONTROLLER HTTP E DTO DE ENTRADA

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Identificação dos Componentes e Sub-Issues Atendidas

- **Sub-Issue do Controller HTTP:** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` ([#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Sub-Issue do DTO de Entrada:** `SUB-02 — [UC12][DTO] Criar DTO para cadastro de produto` ([#5](https://github.com/evertonfoz/dsc-tests/issues/5)).
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` ([#1](https://github.com/evertonfoz/dsc-tests/issues/1)).

---

## 2. Implementação do DTO de Entrada (`CreateProductDto`)

O DTO de entrada é o contrato que delimita a estrutura aceita na borda HTTP da aplicação.

**Arquivo:** `src/modules/products/dtos/create-product.dto.ts`

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
```

### Análise Técnica dos Decoradores:
- `@IsString()`: Garante que o valor recebido seja obrigatoriamente do tipo primitivo string, rejeitando números, arrays, booleanos ou objetos no campo `name`.
- `@IsNotEmpty()`: Assegura que o campo não seja nulo, indefinido ou uma string vazia (`""`).

---

## 3. Implementação do Controller HTTP (`ProductsController`)

O Controller é projetado com responsabilidade única de tradução e adaptação entre o protocolo HTTP e a camada de aplicação.

**Arquivo:** `src/modules/products/controllers/products.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { ProductsService } from '../services/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto.name);
  }
}
```

---

## 4. Checklist Arquitetural de Preservação e Qualidade

| Princípio Arquitetural | Situação no Código | Evidência Comprobatória |
| :--- | :---: | :--- |
| **Prefixo de Rota Coeso** | **Atendido** | `@Controller('products')` define a raiz REST do recurso. |
| **Verbo HTTP Apropriado** | **Atendido** | `@Post()` configurado para criação de recursos (retorno padrão 201). |
| **Tipagem com DTO** | **Atendido** | `@Body() createProductDto: CreateProductDto` tipa e submete à validação. |
| **Injeção de Dependência** | **Atendido** | `constructor(private readonly productsService: ProductsService)` via NestJS IoC. |
| **Preservação de Assinatura** | **Atendido** | Chama exatamente `createProduct(name: string)` sem adulterações. |
| **Ausência de Lógica de Negócio** | **Atendido** | Zero checagens condicionais, cálculos ou manipulação de banco no controller. |
| **Ausência de Vazamento de Infra** | **Atendido** | Nenhuma menção a SQL, TypeORM ou repositórios diretos no controller. |

---

## 5. Distinção Crítica: Validação da Fronteira HTTP vs. Regra de Negócio

A equipe registrou e validou formalmente a fronteira de responsabilidades:

1. **Validação na Fronteira HTTP (DTO + ValidationPipe):**
   - Responsabilidade: Protege a aplicação contra requisições malformadas ou sintaticamente inválidas na porta de entrada da rede.
   - Resposta: `400 Bad Request` com array descritivo de violações.
   - Escopo: Sintaxe e formato de transporte.
2. **Regras de Negócio da Aplicação/Domínio (`ProductsService` / `Product`):**
   - Responsabilidade: Garante as invariantes do negócio independentemente de o serviço ser invocado via HTTP, mensageria (RabbitMQ/Kafka), fila assíncrona ou CLI.
   - Resposta: Exceções de domínio ou rejeição de persistência.
   - Escopo: Semântica e invariantes da entidade.

> ⚠️ **Nota Metodológica:** A validação `@IsNotEmpty()` no DTO rejeita nomes vazios na API REST, mas a regra de negócio completa do critério `CA02` na camada de aplicação será implementada e comprovada em seu respectivo ciclo TDD nas etapas subsequentes.
