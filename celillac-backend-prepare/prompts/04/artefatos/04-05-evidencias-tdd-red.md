# ARTEFATO 04-05 — EVIDÊNCIAS DA FASE RED DO TDD

## 1. Identificação da Execução

- **Caso de Uso:** `UC12 — Cadastrar Produto`
- **Issue Relacionada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10))
- **Branch Ativa:** `feature/uc12-07-product-registration-test`
- **Arquivo de Teste Executado:** `src/modules/products/services/products.service.spec.ts`
- **Comando Executado:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```

---

## 2. Saída Real do Terminal

```text
$ vitest run src/modules/products/services/products.service.spec.ts

 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

 ❯ src/modules/products/services/products.service.spec.ts (1 test | 1 failed) 98ms
   ❯ ProductsService (1)
     × should register and save a product when valid data is provided (CA01) 96ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/products/services/products.service.spec.ts > ProductsService > should register and save a product when valid data is provided (CA01)
Error: Not implemented: createProduct
 ❯ ProductsService.createProduct src/modules/products/services/products.service.ts:16:11
     14|
     15|   async createProduct(_name: string): Promise<Product> {
     16|     throw new Error('Not implemented: createProduct');
       |           ^
     17|   }
     18| }
 ❯ src/modules/products/services/products.service.spec.ts:32:34

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  11:12:50
   Duration  392ms (transform 18ms, setup 0ms, import 219ms, tests 98ms, environment 0ms)

[ELIFECYCLE] Test failed. See above for more details.
```

---

## 3. Avaliação Técnica da Falha (Verificação de RED Válido)

| Pergunta de Verificação | Resposta | Evidência Técnica |
| :--- | :---: | :--- |
| **1. O ambiente iniciou corretamente?** | **Sim** | O runner `vitest v4.1.11` iniciou sem erros de configuração ou dependências ausentes. |
| **2. O framework executou o teste?** | **Sim** | O `TestingModule` do `@nestjs/testing` compilou no `beforeEach`, resolveu o provider `ProductsService` e injetou o token `PRODUCTS_REPOSITORY` com sucesso. |
| **3. O teste falhou?** | **Sim** | `Test Files 1 failed (1) / Tests 1 failed (1)`. |
| **4. Qual foi a causa da falha?** | **Comportamento não implementado** | Ao invocar `await service.createProduct('Celular XYZ')` na linha 32 do arquivo de teste, o método `ProductsService.createProduct` lançou `Error: Not implemented: createProduct`. |
| **5. A falha corresponde ao comportamento ainda não implementado?** | **Sim** | Não houve erro de sintaxe, erro de importação, falha de injeção de dependência nem falha de infraestrutura. A falha deve-se exclusivamente ao fato de a lógica de instanciar `Product` e chamar `productsRepository.save(product)` ainda não ter sido codificada. |
| **6. O resultado está relacionado ao critério de aceite `CA01`?** | **Sim** | O teste exige exatamente o cumprimento de `CA01` (solicitação com dados válidos resulta no cadastro e persistência do produto). |
| **7. A falha demonstra adequadamente a fase RED?** | **Sim** | Caracteriza um **RED válido e tecnicamente justificado** no ciclo TDD. |

---

## 4. Conclusão e Pendências

- **Status da Fase RED:** **Comprovada com evidência real.**
- **Restrição Respeitada:** O comportamento de produção para satisfazer o teste **não** foi implementado nesta etapa, mantendo o projeto estritamente na Fase RED conforme exigido pelo Material 04.
- **Pendência para a próxima unidade (Fase GREEN):** Implementar a criação da instância `new Product(randomUUID(), name)` e a chamada `return this.productsRepository.save(product)` em `ProductsService.createProduct`.

