# ARTEFATO 05-05 — EVIDÊNCIAS DE EXECUÇÃO E TRANSIÇÃO PARA A FASE GREEN DO TDD

> **Material 05 — Do Teste RED à Implementação GREEN com TDD**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 04

---

## 1. Identificação do Cenário de Teste Orientador

- **Arquivo de Teste:** `src/modules/products/services/products.service.spec.ts`
- **Cenário:** `should register and save a product when valid data is provided (CA01)`
- **Framework:** Vitest + `@nestjs/testing`
- **Critério de Aceite Focal:** `CA01 — Cadastro de produto com dados válidos`
- **Branch de Implementação:** `feature/uc12-05-products-service` (Commit `facb3ca`)
- **Draft Pull Request:** [#13](https://github.com/evertonfoz/dsc-tests/pull/13)

---

## 2. Histórico: Evidência Documentada da Fase RED (Material 04)

- **Comando:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```
- **Saída Real do Terminal (Fase RED):**
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
  ```

---

## 3. Evidência Real da Fase GREEN

Com a implementação mínima introduzida em `ProductsService.createProduct` (instanciação de `Product(randomUUID(), name)` e chamada a `this.productsRepository.save(product)`), o mesmo teste foi reexecutado:

- **Comando Executado:**
  ```bash
  pnpm test src/modules/products/services/products.service.spec.ts
  ```

- **Saída Real do Terminal (Fase GREEN):**
  ```text
   ✓ src/modules/products/services/products.service.spec.ts (1 test) 76ms
     ✓ ProductsService (1)
       ✓ should register and save a product when valid data is provided (CA01) 75ms

   Test Files  1 passed (1)
        Tests  1 passed (1)
     Start at  22:38:15
     Duration  412ms (transform 48ms, setup 152ms, collect 38ms, tests 75ms, environment 0ms, prepare 79ms)
  ```

---

## 4. Análise Comparativa: RED × GREEN

| Dimensão de Análise | Estado Anterior (Fase RED) | Estado Atual (Fase GREEN) | Parecer Metodológico |
| :--- | :--- | :--- | :--- |
| **Status do Teste** | `1 failed (1)` | `1 passed (1)` | **Aprovado com sucesso.** |
| **Causa Raiz / Saída** | Exceção `Not implemented: createProduct` | Execução completa do fluxo sem erros | O comportamento de produção preencheu a lacuna do stub. |
| **Asserção `toHaveBeenCalledTimes(1)`** | Não atingida (interrompida no throw) | Aprovada (repositório chamado 1x) | A orquestração do serviço delegou corretamente ao repositório. |
| **Asserção `productId`** | Não avaliada | Aprovada (`expect.any(String)`) | O identificador universal foi gerado e atribuído. |
| **Asserção `name`** | Não avaliada | Aprovada (`'Celular XYZ'`) | O valor de entrada foi preservado na entidade. |
| **Alteração nas Asserções** | Nenhuma | Nenhuma | Integridade do teste 100% preservada. |

---

## 5. Execução dos Demais Testes do Repositório e Investigação de Falhas

Ao executar a suíte global de testes do projeto (`pnpm test`):
- O teste do módulo `AppController` passou (`1 passed`).
- O teste do módulo `ProductsService` passou (`1 passed`).
- Identificaram-se falhas em cenários do módulo `OrdersService` (`src/modules/orders/services/orders.services.spec.ts`).

### Diagnóstico da Falha em `OrdersService`:
1. **Classificação:** **Falha preexistente**, não relacionada às alterações do caso de uso `UC12` (Cadastrar Produto).
2. **Causa:** O módulo de pedidos possui pendências de implementação e testes em desenvolvimento na sua respectiva branch de trabalho (`orders`), não havendo qualquer regressão provocada pelo módulo de produtos.
3. **Decisão:** Conforme preconizado pelo Material 05, **não alterar testes não relacionados sem justificativa de escopo**, mantendo o isolamento estrito na responsabilidade da `SUB-05` / `SUB-07`.

---

## 6. Limites da Evidência e Conclusão Técnica

- **O que a aprovação comprova:** Comprova estritamente que a unidade orquestradora (`ProductsService.createProduct`) é capaz de receber dados válidos, gerar o identificador do produto, acionar a interface de persistência e retornar a entidade de domínio criada.
- **O que a aprovação NÃO comprova:**
  - Não comprova persistência física em banco de dados relacional PostgreSQL (objeto da `SUB-03` / `SUB-04`).
  - Não comprova recebimento de payload HTTP via endpoint NestJS (objeto da `SUB-06`).
  - Não comprova validação de campos obrigatórios vazios (`CA02` / `FA01`).
- **Conclusão:** A transição **RED → GREEN** para o critério `CA01` está tecnicamente comprovada e validada.

