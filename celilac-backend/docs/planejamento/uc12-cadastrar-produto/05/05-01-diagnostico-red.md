# ARTEFATO 05-01 — DIAGNÓSTICO DO ESTADO RED (TDD)

> **Material 05 — Do Teste RED à Implementação GREEN com TDD**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 04

---

## 1. Identificação Geral da Demanda e Rastreabilidade

- **Projeto:** CeliLac Backend API.
- **Caso de Uso:** `UC12 — Cadastrar Produto`.
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Issue de Testes (Origem do RED):** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Issue de Implementação Relacionada:** `SUB-05 — [UC12][Serviço de Aplicação] Implementar serviço de aplicação para cadastro de produto` (GitHub Issue [#8](https://github.com/evertonfoz/dsc-tests/issues/8)).
- **Critério de Aceite Focal:** `CA01 — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto`.
- **Branch do Teste RED:** `feature/uc12-07-product-registration-test`.
- **Commit Registrado no RED:** `2724b979479582f0ec7090d4613c35c486f5baa9` (`test: add failing product creation test (refs #10)`).
- **Draft Pull Request:** [#12](https://github.com/evertonfoz/dsc-tests/pull/12) (`test(uc12): add failing unit test for product registration with valid data (CA01)`).

---

## 2. Diagnóstico Técnico do Teste RED

### 2.1 Localização e Especificação do Teste
- **Arquivo de Teste:** `src/modules/products/services/products.service.spec.ts`.
- **Framework de Testes:** Vitest (com `@nestjs/testing`).
- **Nome do Cenário:** `should register and save a product when valid data is provided (CA01)`.
- **Comando de Execução:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```

### 2.2 Resultado da Execução RED (Evidência Documental do Material 04)
```text
 FAIL  src/modules/products/services/products.service.spec.ts > ProductsService > should register and save a product when valid data is provided (CA01)
Error: Not implemented: createProduct
 ❯ ProductsService.createProduct src/modules/products/services/products.service.ts:16:11
     14| 
     15|   async createProduct(_name: string): Promise<Product> {
     16|     throw new Error('Not implemented: createProduct');
       |           ^
     17|   }
     18| }
 ❯ src/modules/products/services/products.service.spec.ts:32:26

Serialized Error: {
  "message": "Not implemented: createProduct",
}

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Duration  482ms
```

### 2.3 Causa Raiz da Falha e Validade Metodológica do RED
1. **O ambiente e a compilação são saudáveis?**  
   Sim. TypeScript compila perfeitamente, o módulo `TestingModule` do NestJS injeta o dublê (`PRODUCTS_REPOSITORY`) e o Vitest executa normalmente sem falhas de sintaxe, tipagem ou importação.
2. **A falha reflete a ausência de comportamento de negócio?**  
   Sim. O método `ProductsService.createProduct` está configurado com um stub explícito que lança `throw new Error('Not implemented: createProduct')`.
3. **Classificação:** Trata-se de um **RED legítimo e controlado**, que expressa uma expectativa de comportamento ainda não implementada na base de código de produção.

---

## 3. Contratos e Responsabilidades Arquiteturais Envolvidos

| Elemento | Tipo | Localização | Papel Arquitetural / Contrato |
| :--- | :--- | :--- | :--- |
| `Product` | Entidade de Domínio | `src/modules/products/entities/product.entity.ts` | Construtor contendo `productId: string` e `name: string`. |
| `ProductsRepository` | Interface de Persistência | `src/modules/products/repositories/products.repository.interface.ts` | Contrato contendo a operação `save(product: Product): Promise<Product>`. |
| `PRODUCTS_REPOSITORY` | Token de Injeção | `src/modules/products/repositories/products.repository.interface.ts` | Token simbólico (`'PRODUCTS_REPOSITORY'`) para injeção via NestJS. |
| `ProductsService` | Serviço de Aplicação | `src/modules/products/services/products.service.ts` | Orquestrador da operação `createProduct(name: string): Promise<Product>`. |

---

## 4. Comportamento Ausente (Necessário para o GREEN)

Para que o teste passe e atinja a fase **GREEN**, a implementação mínima em `ProductsService.createProduct` deve:
1. Receber o argumento `name: string`.
2. Instanciar a entidade `Product`, gerando um identificador (`productId`) do tipo string (ex.: via `randomUUID()`).
3. Invocar a operação de persistência do repositório: `this.productsRepository.save(product)`.
4. Retornar a promessa resolvida com o `Product` persistido.

---

## 5. Verificação do Repositório Real

- **Branch Atual do Workspace:** O workspace estava posicionado temporariamente na branch `feature/uc12-09-backend-containerization`.
- **Branch Original do Teste RED:** `feature/uc12-07-product-registration-test` (commit `2724b97`), mantida íntegra e publicada no remoto.
- **Rastreabilidade de Implementação Prévia:** O histórico Git registra a branch `feature/uc12-05-products-service` (commit `facb3ca`), indicando que a implementação da `SUB-05` foi desenvolvida a partir de `feature/uc12-07-product-registration-test`.

---

## 6. Parecer e Condições para Prosseguir

- **Diagnóstico:** Estado RED validado e comprovado documental e tecnicamente.
- **Condições para Prosseguir:**
  1. Definir formalmente a estratégia de branches e isolamento de escopo (Fase 3 / Artefato 05-02).
  2. Planejar o conjunto mínimo de alterações para satisfazer as asserções sem adicionar lógica supérflua (Fase 4 / Artefato 05-03).
  3. Realizar ou consolidar a implementação GREEN e executar o runner do Vitest para coletar a evidência real de aprovação (Fase 5 e 6).

