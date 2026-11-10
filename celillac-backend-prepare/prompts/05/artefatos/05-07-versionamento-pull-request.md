# ARTEFATO 05-07 — VERSIONAMENTO, PULL REQUEST E GITHUB PROJECT

## 1. Identificação e Rastreabilidade de Versionamento

| Elemento | Valor Real Verificado |
| :--- | :--- |
| **Caso de Uso** | `UC12 — Cadastrar Produto` ([Issue Principal #1 — `EPIC-UC12`](https://github.com/evertonfoz/dsc-tests/issues/1)) |
| **Issue de Implementação (`SUB-05`)** | [Issue #8 — `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto`](https://github.com/evertonfoz/dsc-tests/issues/8) (`OPEN`) |
| **Issue de Testes (`SUB-07`)** | [Issue #10 — `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto`](https://github.com/evertonfoz/dsc-tests/issues/10) (`OPEN`) |
| **Branch de Implementação (`head`)** | `feature/uc12-05-products-service` (rastreando `origin/feature/uc12-05-products-service`) |
| **Branch-Base (`base`)** | `feature/uc12-07-product-registration-test` (commit `2724b979479582f0ec7090d4613c35c486f5baa9`) |
| **Commit da Fase GREEN** | `facb3ca41d309b49fa147ba4bbc7ec0cdaf5e1e2` (curto: `facb3ca`) |
| **Mensagem do Commit** | `feat(products): implement product creation behavior for valid data (refs #8, refs #10)` |
| **Pull Request da Implementação GREEN** | [Draft PR #13](https://github.com/evertonfoz/dsc-tests/pull/13) (`feature/uc12-05-products-service` → `feature/uc12-07-product-registration-test`, **Draft / Aberto**) |
| **Pull Request do Teste RED (Preservado)** | [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) (`feature/uc12-07-product-registration-test` → `main`, **Draft / Aberto**) |

---

## 2. Inspeção e Seleção Controlada das Alterações

Antes do commit, foram executados os comandos de inspeção `git status`, `git diff` e `git diff --staged` para assegurar que apenas o arquivo pertencente ao escopo da `SUB-05` fosse incluído:

### 2.1 Comandos Executados
```bash
git status
git diff
git add src/modules/products/services/products.service.ts
git diff --staged
```

### 2.2 Diff Staged Verificado
```diff
diff --git a/celillac-backend-prepare/src/modules/products/services/products.service.ts b/celillac-backend-prepare/src/modules/products/services/products.service.ts
index 513c574..46afd75 100644
--- a/celillac-backend-prepare/src/modules/products/services/products.service.ts
+++ b/celillac-backend-prepare/src/modules/products/services/products.service.ts
@@ -1,3 +1,4 @@
+import { randomUUID } from 'node:crypto';
 import { Inject, Injectable } from '@nestjs/common';
 import { Product } from '../entities/product.entity.js';
 import {
@@ -12,7 +13,8 @@ export class ProductsService {
     private readonly productsRepository: ProductsRepository,
   ) {}
 
-  async createProduct(_name: string): Promise<Product> {
-    throw new Error('Not implemented: createProduct');
+  async createProduct(name: string): Promise<Product> {
+    const product = new Product(randomUUID(), name);
+    return this.productsRepository.save(product);
   }
 }
```
*(Os diretórios locais `.vscode/` e `prompts/` foram mantidos fora do staging).*

---

## 3. Evidências Reais do Commit e do Push

### 3.1 Comandos Executados
```bash
git commit -m "feat(products): implement product creation behavior for valid data (refs #8, refs #10)"
git push -u origin feature/uc12-05-products-service
git rev-parse HEAD
git log -2 --oneline
```

### 3.2 Saída Real Obtida
```text
[feature/uc12-05-products-service facb3ca] feat(products): implement product creation behavior for valid data (refs #8, refs #10)
 1 file changed, 4 insertions(+), 2 deletions(-)
To https://github.com/evertonfoz/dsc-tests.git
 * [new branch]      feature/uc12-05-products-service -> feature/uc12-05-products-service
branch 'feature/uc12-05-products-service' set up to track 'origin/feature/uc12-05-products-service'.
facb3ca41d309b49fa147ba4bbc7ec0cdaf5e1e2
facb3ca (HEAD -> feature/uc12-05-products-service, origin/feature/uc12-05-products-service) feat(products): implement product creation behavior for valid data (refs #8, refs #10)
2724b97 (origin/feature/uc12-07-product-registration-test, feature/uc12-07-product-registration-test) test: add failing product creation test (refs #10)
```

---

## 4. Pull Request Publicado no GitHub

Conforme a estratégia do **Cenário B (Branches e PRs dependentes)** definida na Fase 3:
- O [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) (`feature/uc12-07-product-registration-test` → `main`) da `SUB-07` foi preservado intacto e aberto em estado **Draft**.
- Foi criado o **[Draft PR #13](https://github.com/evertonfoz/dsc-tests/pull/13)** para a `SUB-05` (#8) com:
  - **URL Real:** `https://github.com/evertonfoz/dsc-tests/pull/13`
  - **Estado:** **Draft** (Aberto — não pronto para merge final)
  - **Head:** `feature/uc12-05-products-service`
  - **Base:** `feature/uc12-07-product-registration-test`
  - **Título:** `feat(uc12): implement minimal product creation behavior for valid data (CA01)`
  - **Vínculos:** `Refs #8`, `Refs #10`, `Refs #1` e referência ao Draft PR `#12` (utilizando `Refs` para evitar fechamento automático prematuro das Issues).

### Conteúdo Registrado no Draft PR #13
- **Issues relacionadas:** #8 (`SUB-05`), #10 (`SUB-07`), #1 (`EPIC-UC12`) e PR #12.
- **Objetivo da implementação:** Satisfazer na Fase GREEN o teste de `CA01`.
- **Arquivos modificados:** Exclusivamente `src/modules/products/services/products.service.ts` (`+4/-2` linhas).
- **Comportamento implementado:** Instanciação de `new Product(randomUUID(), name)` e retorno de `this.productsRepository.save(product)`.
- **Evidências de testes:** `1 passed (1)` no teste específico de `products.service.spec.ts` e `8 passed (8)` na suíte completa (`pnpm test`).
- **Pontos de refatoração:** `REF-01` e `REF-02` documentados para a próxima etapa.
- **Situação de integração:** Explicita que o PR encontra-se na Fase GREEN do primeiro ciclo TDD (`CA01`) e ainda não deve sofrer merge na `main`.

---

## 5. Atualização do GitHub Project (#6) e Comentários nas Issues

O quadro [GitHub Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6) (`ID: PVT_kwHOAJgJDc4Bp2af`) foi atualizado para refletir com exatidão o andamento real:

- A Issue **#8 (`SUB-05`)** foi movida de **`Ready`** (`dd0c8878`) para **`In Progress`** (`7c6c668a`) via `gh project item-edit`.
- A Issue **#10 (`SUB-07`)** permaneceu em **`In Progress`** (`7c6c668a`).
- Nenhuma Issue foi movida prematuramente para `Done` nem encerrada.
- Foram registrados comentários de rastreabilidade:
  - Na [Issue #8 (comentário #6593149127)](https://github.com/evertonfoz/dsc-tests/issues/8#issuecomment-6593149127);
  - Na [Issue #10 (comentário #6593149559)](https://github.com/evertonfoz/dsc-tests/issues/10#issuecomment-6593149559).

### Quadro Atualizado dos Itens no GitHub Project #6

| Issue | Identificador | Status no GitHub Project #6 | Situação da Issue |
| :---: | :--- | :---: | :---: |
| **#1** | `EPIC-UC12 — [UC12] Cadastrar Produto` | `Backlog` | `OPEN` |
| **#4** | `SUB-01 — Modelar entidade Product` | `Ready` | `OPEN` |
| **#5** | `SUB-02 — Criar DTO de cadastro de produto` | `Ready` | `OPEN` |
| **#6** | `SUB-03 — Implementar validações de dados e regras de negócio` | `Ready` | `OPEN` |
| **#7** | `SUB-04 — Configurar persistência e implementar repositório` | `Ready` | `OPEN` |
| **#8** | `SUB-05 — Implementar serviço de aplicação para cadastro de produto` | **`In Progress`** | `OPEN` |
| **#9** | `SUB-06 — Criar endpoint POST /products` | `Backlog` | `OPEN` |
| **#10** | `SUB-07 — Implementar testes automatizados para o cadastro de produto` | **`In Progress`** | `OPEN` |
| **#11** | `SUB-08 — Atualizar documentação técnica` | `Backlog` | `OPEN` |

---

## 6. Pendências de Integração

1. Conduzir a etapa de refatoração (`REFACTOR`) e revisão técnica no próximo material.
2. Completar os demais ciclos TDD para `CA02`, `CA03` e `FE01` antes de consolidar os PRs #13 e #12 e integrá-los à `main`.

