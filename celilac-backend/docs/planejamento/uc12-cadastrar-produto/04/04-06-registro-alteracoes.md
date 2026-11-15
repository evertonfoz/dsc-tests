# ARTEFATO 04-06 — REGISTRO CONTROLADO DE ALTERAÇÕES E COMMIT

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API)  
> **Data de Emissão:** 10/11/2026

---

## 1. Identificação do Rastreamento

- **Issue Relacionada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Branch de Trabalho:** `feature/uc12-07-product-registration-test`
- **Hash do Commit no Repositório:** `2724b979479582f0ec7090d4613c35c486f5baa9` (abreviado: `2724b97`)
- **Mensagem do Commit:** `test: add failing product creation test (refs #10)`
- **Autor do Commit:** Everton Coimbra de Araújo (`<evertoncoimbra@gmail.com>`)

---

## 2. Seleção Controlada de Arquivos e Staging

Antes da gravação do commit, foi realizada a verificação de `git status` e `git diff` para assegurar que apenas arquivos estritamente pertinentes ao escopo do teste unitário e seus contratos fossem incluídos, evitando acoplamento de arquivos de configuração da IDE ou lixo de compilação.

```bash
git add src/modules/products/entities/product.entity.ts
git add src/modules/products/repositories/products.repository.interface.ts
git add src/modules/products/services/products.service.ts
git add src/modules/products/services/products.service.spec.ts

git commit -m "test: add failing product creation test (refs #10)"
```

---

## 3. Arquivos Versionados no Commit `2724b97`

A inspeção do commit revela a inclusão de 4 arquivos (69 linhas adicionadas):

1. **`src/modules/products/entities/product.entity.ts` (+6 linhas):**  
   Entidade mínima com propriedades imutáveis `productId` e `name`.
2. **`src/modules/products/repositories/products.repository.interface.ts` (+7 linhas):**  
   Token de injeção `PRODUCTS_REPOSITORY` e interface com assinatura `save(product: Product): Promise<Product>`.
3. **`src/modules/products/services/products.service.ts` (+18 linhas):**  
   Classe injetável com construtor dependente do repositório e método `createProduct` lançando `Error('Not implemented: createProduct')`.
4. **`src/modules/products/services/products.service.spec.ts` (+38 linhas):**  
   Suíte Vitest implementando o teste unitário para o critério `CA01` com mock de repositório.

---

## 4. Publicação Remota (Push)

O commit foi enviado para o repositório GitHub mantendo o upstream configurado:

```bash
$ git push origin feature/uc12-07-product-registration-test
To https://github.com/evertonfoz/dsc-tests.git
 * [new branch]      feature/uc12-07-product-registration-test -> feature/uc12-07-product-registration-test
Branch 'feature/uc12-07-product-registration-test' set up to track remote branch 'feature/uc12-07-product-registration-test' from 'origin'.
```

---

## 5. Auditoria de Conformidade do Commit

- **Rastreabilidade:** Mensagem referencia diretamente a Issue correspondente (`refs #10`).
- **Atomicidade:** O commit engloba exatamente uma unidade de trabalho coerente (o primeiro teste RED).
- **Semântica:** Prefixo convencional `test:` utilizado adequadamente.

