# ARTEFATO 04-07 — DRAFT PULL REQUEST

## 1. Dados Reais do Draft Pull Request Publicado no GitHub

- **URL Real do Draft Pull Request:** `https://github.com/evertonfoz/dsc-tests/pull/12`
- **Número do PR:** `#12`
- **Estado no GitHub:** **Draft** (Aberto — não pronto para merge)
- **Branch de Origem (`head`):** `feature/uc12-07-product-registration-test`
- **Branch de Destino (`base`):** `main`
- **Título:** `test(uc12): add failing unit test for product registration with valid data (CA01)`
- **Issue Vinculada:** `SUB-07` — [Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10) (`Refs #10`)
- **Nota de Rastreabilidade:** Utilizou-se intencionalmente `Refs #10` em vez de `Closes #10` ou `Fixes #10` para vincular o Draft PR à Issue sem provocar seu encerramento automático no futuro antes de todos os critérios de aceite da `SUB-07` serem atendidos.

---

## 2. Conteúdo Completo do Draft Pull Request (Publicado no PR #12)

O bloco Markdown abaixo corresponde ao documento estruturado utilizado na abertura do [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12):

```markdown
# test(uc12): add failing unit test for product registration with valid data (CA01)

## Issue relacionada
- **Identificador de Planejamento:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto`
- **Issue no GitHub:** Refs #10 (vinculada à Issue Principal #1 `EPIC-UC12`)

## Objetivo
Especificar e registrar o primeiro teste automatizado na **fase RED do TDD** para o caso de uso **UC12 — Cadastrar Produto**, cobrindo o critério de aceite **CA01** (*"Uma solicitação contendo dados válidos deve resultar no cadastro de um produto"*).

O teste verifica que, ao acionar `ProductsService.createProduct('Celular XYZ')`, o serviço instancia um `Product` com `productId` válido e `name` correspondente, invoca `productsRepository.save` exatamente 1 vez e retorna o produto cadastrado.

## Alterações realizadas
- `celillac-backend-prepare/src/modules/products/entities/product.entity.ts`: Definição do contrato base da entidade `Product` (`productId`, `name`).
- `celillac-backend-prepare/src/modules/products/repositories/products.repository.interface.ts`: Definição do token `PRODUCTS_REPOSITORY` e da interface `ProductsRepository` (`save(product: Product): Promise<Product>`).
- `celillac-backend-prepare/src/modules/products/services/products.service.ts`: Esqueleto (stub) de `ProductsService.createProduct` sem a implementação do comportamento de produção (`throw new Error('Not implemented: createProduct')`), preservando estritamente a fase RED.
- `celillac-backend-prepare/src/modules/products/services/products.service.spec.ts`: Implementação do teste unitário `should register and save a product when valid data is provided (CA01)` utilizando `@nestjs/testing` e `vitest`.

## Validação executada
- **Comando executado:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```
- **Resultado obtido:** `1 failed (1)` — Falha controlada na execução do teste.
- **Causa da falha:**
  ```text
  FAIL src/modules/products/services/products.service.spec.ts > ProductsService > should register and save a product when valid data is provided (CA01)
  Error: Not implemented: createProduct
   ❯ ProductsService.createProduct src/modules/products/services/products.service.ts:16:11
  ```
- **Relação com o comportamento esperado:** O módulo NestJS compilou, injetou o dublê `PRODUCTS_REPOSITORY` corretamente e executou o teste até a chamada de `service.createProduct('Celular XYZ')`, falhando exclusivamente porque o comportamento de criação e persistência do produto (`CA01`) ainda não foi implementado.

## Estado atual
**TDD — Fase RED.**

## Pendências
1. Implementar o comportamento mínimo em `ProductsService.createProduct` para instanciar `new Product(randomUUID(), name)` e invocar `this.productsRepository.save(product)` (transição para a **Fase GREEN** na próxima etapa).
2. Implementar os demais testes automatizados previstos no escopo da `SUB-07` (#10): rejeição de nome obrigatório ausente/vazio (`CA02` / `FA01`) e garantia de não persistência de produto inválido (`CA03` / `RN03`).

## Condição de integração
**Este Draft Pull Request não está pronto para merge.**
```

