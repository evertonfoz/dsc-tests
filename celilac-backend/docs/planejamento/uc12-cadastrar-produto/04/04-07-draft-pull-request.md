# ARTEFATO 04-07 — DRAFT PULL REQUEST DOCUMENTADO NO GITHUB

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API)  
> **Data de Emissão:** 10/11/2026

---

## 1. Identificação do Pull Request no GitHub

- **Número do Pull Request:** [#12](https://github.com/evertonfoz/dsc-tests/pull/12)
- **URL Oficial:** https://github.com/evertonfoz/dsc-tests/pull/12
- **Tipo / Modalidade:** **Draft Pull Request**
- **Título do PR:** `test(uc12): add failing unit test for product registration with valid data (CA01)`
- **Branch de Origem (Head):** `feature/uc12-07-product-registration-test`
- **Branch de Destino (Base):** `main`
- **Autor:** `@evertonfoz`
- **Labels Associadas:** `layer:tests`, `priority:high`, `type:test`, `uc12`

---

## 2. Conteúdo Transcrito do Draft Pull Request #12

Abaixo está o conteúdo estruturado publicado no corpo do Pull Request no GitHub:

```markdown
## Issue relacionada

• Identificador de Planejamento: SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto
• Issue no GitHub: Refs #10 (vinculada à Issue Principal #1 EPIC-UC12)

## Objetivo

Especificar e registrar o primeiro teste automatizado na fase RED do TDD para o caso de uso UC12 — Cadastrar Produto, cobrindo o critério de aceite CA01 ("Uma solicitação contendo dados válidos deve resultar no cadastro de um produto").

O teste verifica que, ao acionar `ProductsService.createProduct('Celular XYZ')`, o serviço instancia um `Product` com `productId` válido e `name` correspondente, invoca `productsRepository.save` exatamente 1 vez e retorna o produto cadastrado.

## Alterações realizadas

• `src/modules/products/entities/product.entity.ts`: Definição do contrato base da entidade `Product` (`productId`, `name`).
• `src/modules/products/repositories/products.repository.interface.ts`: Definição do token `PRODUCTS_REPOSITORY` e da interface `ProductsRepository` (`save(product: Product): Promise<Product>`).
• `src/modules/products/services/products.service.ts`: Esqueleto (stub) de `ProductsService.createProduct` sem a implementação do comportamento de produção (`throw new Error('Not implemented: createProduct')`), preservando estritamente a fase RED.
• `src/modules/products/services/products.service.spec.ts`: Implementação do teste unitário `should register and save a product when valid data is provided (CA01)` utilizando `@nestjs/testing` e `vitest`.

## Validação executada

• Comando executado:
  pnpm test src/modules/products/services/products.service.spec.ts

• Resultado obtido: `1 failed (1)` — Falha controlada na execução do teste.
• Causa da falha:
  FAIL src/modules/products/services/products.service.spec.ts > ProductsService > should register and save a product when valid data is provided (CA01)
  Error: Not implemented: createProduct
   ❯ ProductsService.createProduct src/modules/products/services/products.service.ts:16:11

• Relação com o comportamento esperado: O módulo NestJS compilou, injetou o dublê `PRODUCTS_REPOSITORY` corretamente e executou o teste até a chamada de `service.createProduct('Celular XYZ')`, falhando exclusivamente porque o comportamento de criação e persistência do produto (CA01) ainda não foi implementado.

## Estado atual

TDD — Fase RED.

## Pendências

1. Implementar o comportamento mínimo em `ProductsService.createProduct` para instanciar `new Product(randomUUID(), name)` e invocar `this.productsRepository.save(product)` (transição para a Fase GREEN na próxima etapa).
2. Implementar os demais testes automatizados previstos no escopo da SUB-07 (#10): rejeição de nome obrigatório ausente/vazio (CA02 / FA01) e garantia de não persistência de produto inválido (CA03 / RN03).

## Condição de integração

Este Draft Pull Request não está pronto para merge.
```

---

## 3. Justificativa Técnica para o Uso do Draft PR

- **Visibilidade Precoce:** Permite que a equipe acompanhe a evolução do código antes da conclusão final da funcionalidade.
- **Bloqueio Automático de Merge:** O GitHub impede acidentalmente a integração de branches marcadas como Draft.
- **Rastreabilidade com a Issue:** O PR referencia `#10` explicitamente (`refs #10`), sem utilizar palavras-chave de encerramento (`fixes #10` ou `closes #10`), assegurando que a Issue permaneça aberta.

