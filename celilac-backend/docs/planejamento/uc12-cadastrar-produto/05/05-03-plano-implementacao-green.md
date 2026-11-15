# ARTEFATO 05-03 — PLANO DE IMPLEMENTAÇÃO MÍNIMA (FASE GREEN)

> **Material 05 — Do Teste RED à Implementação GREEN com TDD**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 04

---

## 1. Objetivo Técnico e Escopo Focal

O objetivo desta etapa é definir o planejamento cirúrgico e mínimo necessário para fazer o teste unitário de sucesso do caso de uso `UC12` transitar do estado **RED (falhando)** para o estado **GREEN (aprovado)**.

- **Critério de Aceite Focal:** `CA01 — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto`.
- **Princípio Norteador do TDD:** *"Write just enough production code to make the failing test pass"* (escrever estritamente o código de produção suficiente para passar no teste que falha, sem antecipar lógicas ou abstrações desnecessárias).

---

## 2. Análise de Insumos e Contratos Arquiteturais

O teste especificado no Material 04 impõe as seguintes restrições de comportamento e contrato:

1. **Invocação:** `await service.createProduct('Celular XYZ')`.
2. **Delegação:** `productsRepository.save` deve ser invocado exatamente 1 vez com a entidade instanciada.
3. **Identificador:** O resultado retornado deve conter uma propriedade `productId` do tipo `string`.
4. **Atributo de Negócio:** O resultado retornado deve preservar o nome informado (`'Celular XYZ'`).
5. **Retorno:** A promessa resolvida deve retornar o objeto `Product` salvo pelo repositório.

---

## 3. Matriz de Alterações Previstas

| Arquivo | Componente / Elemento | Responsabilidade Arquitetural | Estado Atual (RED) | Alteração Planejada (GREEN) | Justificativa Técnica | Critério de Aceite |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `src/modules/products/services/products.service.ts` | `ProductsService.createProduct` | Serviço de Aplicação (Orquestração do Caso de Uso) | Lança exceção de stub: `throw new Error('Not implemented: createProduct')` | 1. Importar `randomUUID` de `node:crypto`.<br>2. Instanciar `const product = new Product(randomUUID(), name);`.<br>3. Retornar `this.productsRepository.save(product);`. | Atende exatamente às 3 asserções do teste sem introduzir acoplamentos ou complexidades prematuras. | `CA01` |
| `src/modules/products/entities/product.entity.ts` | `Product` | Entidade de Domínio | Classe simples com construtor `(productId, name)` | **Nenhuma alteração** | O contrato atual atende integralmente à necessidade do teste. | `CA01` |
| `src/modules/products/repositories/products.repository.interface.ts` | `ProductsRepository` / `PRODUCTS_REPOSITORY` | Contrato de Persistência e Token de Injeção | Interface com método `save(product: Product): Promise<Product>` | **Nenhuma alteração** | O contrato é suficiente para viabilizar a injeção do mock no teste. | `CA01` |
| `src/modules/products/services/products.service.spec.ts` | Suíte de Testes Unitários | Testes Automatizados | Teste unitário para `CA01` | **Nenhuma alteração** | As asserções devem ser rigorosamente preservadas para validar a transição. | `CA01` |

---

## 4. O que NÃO será Feito nesta Iteração (Delimitação Negativa)

Para manter a disciplina do TDD e a segregação de escopo:
1. **Não alterar as asserções do teste:** É estritamente proibido afrouxar asserções para forçar aprovação artificial.
2. **Não implementar validações de nome em branco (`CA02`):** Isso pertence ao próximo ciclo RED → GREEN.
3. **Não integrar com TypeORM, Docker ou PostgreSQL físico:** Esta etapa valida a camada de aplicação de forma unitária isolada.
4. **Não criar DTOs ou Controllers HTTP:** O foco é o serviço de aplicação (`SUB-05`).

---

## 5. Critério de Conclusão do Estado GREEN

O estado GREEN será considerado formalmente atingido quando:
1. O comando `pnpm test src/modules/products/services/products.service.spec.ts` for executado e retornar `1 passed (1)`.
2. A suíte completa de testes unitários do repositório (`pnpm test`) for executada sem regressão (`8 passed (8)`).
3. A chamada a `productsRepository.save` for comprovadamente executada com a entidade `Product`.

