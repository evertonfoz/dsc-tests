# ARTEFATO 06-04 — EVIDÊNCIAS DE AUSÊNCIA DE REGRESSÕES E PRESERVAÇÃO DE COMPORTAMENTO

## 1. Linha de Base e Comandos Executados

Para assegurar a integridade do comportamento e a preservação dos contratos após a avaliação de refatoração, os testes unitários foram reexecutados formalmente:

### 1.1 Execução do Teste Específico de CA01
- **Comando:** `pnpm test src/modules/products/services/products.service.spec.ts --run`
- **Ambiente:** Node.js v22.13.1, Vitest v4.1.11, macOS Darwin
- **Saída Real do Console:**
  ```text
  RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

  ✓ src/modules/products/services/products.service.spec.ts (1 test) 88ms
    ✓ ProductsService (1)
      ✓ should register and save a product when valid data is provided (CA01) 87ms

  Test Files  1 passed (1)
       Tests  1 passed (1)
    Start at  19:57:34
    Duration  393ms (transform 17ms, setup 0ms, import 232ms, tests 88ms, environment 0ms)
  ```

### 1.2 Execução da Suíte Completa do Backend
- **Comando:** `pnpm test --run`
- **Saída Real do Console:**
  ```text
  RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

  ✓ src/app.controller.spec.ts (1 test) 64ms
  ✓ src/modules/products/services/products.service.spec.ts (1 test) 55ms
  ✓ src/modules/orders/services/orders.service.spec.ts (6 tests) 60ms

  Test Files  3 passed (3)
       Tests  8 passed (8)
    Start at  19:57:39
    Duration  359ms (transform 112ms, setup 0ms, import 555ms, tests 180ms, environment 0ms)
  ```

---

## 2. Matriz Comparativa: Antes vs. Depois da Fase de Refatoração

| Arquivo de Teste | Comportamento Verificado | Resultado no Material 05 (GREEN) | Resultado Atual no Material 06 | Alterações Observadas | Situação |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `src/modules/products/services/products.service.spec.ts` | Cadastro de produto com dados válidos e persistência no repositório (`CA01`) | `1 passed` (75ms) | `1 passed` (88ms) | Nenhuma | **Preservado / Aprovado** |
| `src/app.controller.spec.ts` | Teste básico de inicialização do controlador da aplicação (`getHello`) | `1 passed` (73ms) | `1 passed` (64ms) | Nenhuma | **Preservado / Aprovado** |
| `src/modules/orders/services/orders.service.spec.ts` | Criação e regras de negócio de pedidos (`OrdersService`) | `6 passed` (65ms) | `6 passed` (60ms) | Nenhuma | **Preservado / Aprovado** |
| **Total Consolidado** | **Suíte geral de testes unitários** | **8 passed (8)** | **8 passed (8)** | **Zero regressões** | **Conforme** |

---

## 3. Verificação Formal dos Contratos

| Componente | Tipo / Assinatura Verificada | Conformidade |
| :--- | :--- | :---: |
| `Product` | `class Product { productId: string; name: string; }` | **100% aderente** |
| `ProductsRepository` | `interface ProductsRepository { save(product: Product): Promise<Product>; }` | **100% aderente** |
| `PRODUCTS_REPOSITORY` | `const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';` (DI token) | **100% aderente** |
| `ProductsService` | `class ProductsService { createProduct(name: string): Promise<Product>; }` | **100% aderente** |

---

## 4. Limites Metodológicos das Verificações Executadas

Conforme as boas práticas de Engenharia de Software, é imperativo explicitar os limites da suíte atual:

1. **Escopo Unitário com Dublês (*Mocks*):** Os testes aprovados comprovam exclusivamente o isolamento lógico de `ProductsService.createProduct` diante de um repositório simulado em memória (`Mocked<ProductsRepository>`).
2. **Ausência de Testes de Integração com Banco de Dados:** Não foi testada a persistência real em banco relacional/NoSQL (escopo futuro da `SUB-04`).
3. **Ausência de Testes de Camada HTTP:** Não foi testado o controller ou serialização JSON via rota `POST /products` (escopo futuro da `SUB-06`).
4. **Comportamentos Não Cobertos do Caso de Uso UC12:**
   - Rejeição de nome vazio/inválido (`CA02` / `RN01` / `FA01`);
   - Garantia de não persistência quando os dados forem inválidos (`CA03` / `RN03`);
   - Tratamento de exceção de persistência (`FE01`).

Portanto, **a aprovação de 8/8 testes comprova a ausência de regressões no código existente, mas não atesta a conclusão integral do caso de uso UC12**.

