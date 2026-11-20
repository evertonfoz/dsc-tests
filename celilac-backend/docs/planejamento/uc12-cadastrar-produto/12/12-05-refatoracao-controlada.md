# ARTEFATO 12-05 — REGISTRO DE PRESERVAÇÃO ARQUITETURAL CONTROLADA

## 1. Princípio Orientador da Intervenção

> **"Não é obrigatório alterar código. Uma auditoria que conclua, com evidências e justificativas, que a arquitetura deve ser preservada é um resultado válido e igualmente valioso."**
> — *Material 12, Seção 1.2*

Em conformidade com a metodologia orientada por evidências, nenhuma linha de código em `src/` ou `test/` foi alterada artificialmente. A auditoria comprovou a adequação técnica da estrutura consolidada no Material 11.

---

## 2. Componentes Auditados e Preservados

A tabela abaixo documenta o estado final de preservação dos componentes do caso de uso `UC12 — Cadastrar Produto`:

| Componente | Caminho do Arquivo | Decisão de Auditoria | Justificativa Técnica |
|---|---|---|---|
| **Entidade de Domínio** | `src/modules/products/entities/product.entity.ts` | **Preservada** | Entidade pura, imutável e desacoplada de decorators de banco e frameworks. |
| **Interface do Repositório** | `src/modules/products/repositories/products.repository.interface.ts` | **Preservada** | Contrato estável `save(product: Product): Promise<Product>`, livre de dependências de infraestrutura. |
| **Token de Injeção** | `src/modules/products/repositories/products.repository.interface.ts` | **Preservado** | Constante `PRODUCTS_REPOSITORY` garante resolução determinística pelo NestJS. |
| **Serviço de Aplicação** | `src/modules/products/services/products.service.ts` | **Preservado** | Coordena o caso de uso com injeção por token, sem acoplamento a ORM ou HTTP. |
| **Controller HTTP** | `src/modules/products/controllers/products.controller.ts` | **Preservado** | Responsabilidade estritamente limitada ao protocolo HTTP; delega ao Service e usa mapper. |
| **DTO de Entrada** | `src/modules/products/dtos/create-product.dto.ts` | **Preservado** | Validação declarativa com `class-validator` operando corretamente na fronteira HTTP. |
| **DTO de Resposta** | `src/modules/products/mappers/product-response.mapper.ts` | **Preservado** | Interface `ProductResponseDto` garante isolamento do contrato público de saída. |
| **Mapper de Resposta HTTP** | `src/modules/products/mappers/product-response.mapper.ts` | **Preservado** | Função pura `toProductResponse` centraliza a projeção de saída, impedindo vazamento interno. |
| **Mapper de Persistência** | `src/infrastructure/persistence/products/product.mapper.ts` | **Preservado** | Segregação perfeita entre modelo de domínio e entidade relacional `ProductOrmEntity`. |
| **Entidade ORM** | `src/infrastructure/persistence/products/product.orm-entity.ts` | **Preservada** | Mapeamento no schema `products` compatível com a migration versionada. |
| **Adaptador TypeORM** | `src/infrastructure/persistence/products/typeorm-products.repository.ts` | **Preservado** | Implementação isolada na camada de infraestrutura que atende ao contrato abstrato. |
| **Módulo NestJS** | `src/modules/products/products.module.ts` | **Preservado** | Composição de providers clara e extensível para inversão de dependência em testes. |

---

## 3. Contratos Rigorosamente Preservados

Nenhum contrato foi modificado ou quebrado durante esta atividade:
1. **Contrato HTTP:**
   - Rota: `POST /products`
   - Retorno: `201 Created`
   - Schema JSON: `{ "productId": string, "name": string }`
2. **Contrato de Serviço:**
   - `ProductsService.createProduct(name: string): Promise<Product>`
3. **Contrato de Repositório:**
   - `ProductsRepository.save(product: Product): Promise<Product>`
4. **Contrato do Mapper HTTP:**
   - `toProductResponse(product: Product): ProductResponseDto`

---

## 4. Auditoria de Diffs e Inexistência de Alterações Cosméticas

A verificação do estado da árvore de trabalho em relação ao código-fonte de produtos comprova ausência de alterações desnecessárias:

```bash
$ git diff -- src/modules/products/ src/infrastructure/persistence/products/
# (Saída vazia — Nenhuma alteração espúria introduzida)
```

A ausência de diffs de código reafirma a maturidade técnica da solução já consolidada nos Materiais 09, 10 e 11, evitando a geração de commits artificiais ou reparações cosméticas que apenas trariam riscos de regressão.

---

## 5. Riscos Residuais e Monitoramento

* **Evolução Futura do Domínio:** Caso novos campos sejam adicionados a `Product` (ex.: preço, categoria, status), eles não serão expostos automaticamente na API HTTP graças ao isolamento do `toProductResponse`.
* **Substituição de ORM ou Banco:** A persistência permanece encapsulada sob a interface `ProductsRepository`; a substituição do TypeORM por outro mecanismo (ex.: Prisma, Kysely) poderá ser realizada criando um novo adaptador sem alterar o Service ou o Controller.
