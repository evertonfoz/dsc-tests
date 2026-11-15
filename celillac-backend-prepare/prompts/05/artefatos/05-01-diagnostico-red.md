# ARTEFATO 05-01 — DIAGNÓSTICO DO ESTADO RED

## 1. Identificação Recuperada do Material 04

| Elemento | Valor Verificado nos Artefatos e no Repositório |
| :--- | :--- |
| **Caso de Uso** | `UC12 — Cadastrar Produto` ([Issue Principal #1 — `EPIC-UC12`](https://github.com/evertonfoz/dsc-tests/issues/1)) |
| **Issue do Teste** | `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10)) |
| **Critério de Aceite** | **`CA01`** — *Uma solicitação contendo dados válidos deve resultar no cadastro de um produto* (associado a **`CA04`** — *Os comportamentos especificados devem possuir testes automatizados*) |
| **Branch Utilizada** | `feature/uc12-07-product-registration-test` (rastreando `origin/feature/uc12-07-product-registration-test`) |
| **Arquivo de Teste** | `src/modules/products/services/products.service.spec.ts` |
| **Framework de Testes** | **Vitest** (`v4.1.11`, integrado com `@nestjs/testing` `^12.1.2`) |
| **Comando Executado** | `pnpm test src/modules/products/services/products.service.spec.ts` |
| **Resultado RED** | `Test Files 1 failed (1)` / `Tests 1 failed (1)` |
| **Causa da Falha** | `Error: Not implemented: createProduct` lançada em `ProductsService.createProduct` (`src/modules/products/services/products.service.ts:16:11`) |
| **Componente Não Implementado** | Método `ProductsService.createProduct(name: string): Promise<Product>` |
| **Commit Registrado (RED)** | `2724b979479582f0ec7090d4613c35c486f5baa9` (`test: add failing product creation test (refs #10)`) |
| **Draft Pull Request** | [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) (`feature/uc12-07-product-registration-test` → `main`, **Draft / Aberto**) |
| **Status no GitHub Project** | [GitHub Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6): `#10 (SUB-07)` em **`In Progress`**; `#8 (SUB-05)` em **`Ready`** |

---

## 2. Contratos Utilizados na Fase RED

Os contratos existentes no repositório e preservados desde o commit `2724b97` são:

1. **Entidade de Domínio (`src/modules/products/entities/product.entity.ts`):**
   ```typescript
   export class Product {
     constructor(
       public readonly productId: string,
       public readonly name: string,
     ) {}
   }
   ```

2. **Contrato do Repositório (`src/modules/products/repositories/products.repository.interface.ts`):**
   ```typescript
   import { Product } from '../entities/product.entity.js';

   export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

   export interface ProductsRepository {
     save(product: Product): Promise<Product>;
   }
   ```

3. **Stub do Serviço de Aplicação (`src/modules/products/services/products.service.ts`):**
   ```typescript
   @Injectable()
   export class ProductsService {
     constructor(
       @Inject(PRODUCTS_REPOSITORY)
       private readonly productsRepository: ProductsRepository,
     ) {}

     async createProduct(_name: string): Promise<Product> {
       throw new Error('Not implemented: createProduct');
     }
   }
   ```

4. **Especificação Executável no Teste (`src/modules/products/services/products.service.spec.ts`):**
   - **Operação invocada:** `const result = await service.createProduct('Celular XYZ');`
   - **Asserções exigidas:**
     1. `expect(productsRepository.save).toHaveBeenCalledTimes(1);`
     2. `expect(result.productId).toEqual(expect.any(String));`
     3. `expect(result.name).toBe('Celular XYZ');`

---

## 3. Verificação do Estado Atual do Repositório e Evidências

Antes de prosseguir, o repositório local foi inspecionado e o teste foi reexecutado para confirmar se o estado documentado no Material 04 permanecia íntegro:

### 3.1 Estado do Git (`git status`, `git branch -vv`, `git log`)
```text
On branch feature/uc12-07-product-registration-test
Your branch is up to date with 'origin/feature/uc12-07-product-registration-test'.
* feature/uc12-07-product-registration-test 2724b97 [origin/feature/uc12-07-product-registration-test] test: add failing product creation test (refs #10)
  main                                      cb70436 [origin/main] Projeto de preparação
```
*(Observação: verificou-se `git diff` nos 4 arquivos de `src/modules/products/`, constatando-se apenas a adição de uma linha em branco final (`\n`) pelo editor, sem nenhuma alteração semântica ou de código em relação ao commit `2724b97`).*

### 3.2 Reexecução Atual do Teste RED
```text
$ vitest run src/modules/products/services/products.service.spec.ts

 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare

 ❯ src/modules/products/services/products.service.spec.ts (1 test | 1 failed) 84ms
   ❯ ProductsService (1)
     × should register and save a product when valid data is provided (CA01) 83ms

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

 Test Files  1 failed (1)
      Tests  1 failed (1)
```

---

## 4. Avaliação de RED Válido e Comportamento Ausente

- **Classificação da Falha:** **RED Válido.**
- **Distinção Técnica:** O runner Vitest (`v4.1.11`), a resolução de módulos TypeScript/ESM e o container de injeção de dependências `@nestjs/testing` (`TestingModule`) funcionam perfeitamente sem erros de sintaxe, importação ou configuração. O teste falha única e exclusivamente na linha de invocação da regra de negócio (`service.createProduct('Celular XYZ')`) porque o método ainda lança `Error: Not implemented: createProduct`.
- **Comportamento Ausente Identificado:**
  1. Instanciar a entidade `Product` com um identificador único do tipo `string` (`productId`) e o `name` recebido;
  2. Invocar `this.productsRepository.save(product)` passando a entidade criada;
  3. Retornar a `Promise<Product>` resultante da operação `save`.

---

## 5. Pendências e Condições para Prosseguir

- **Pendências identificadas:**
  1. Verificar formalmente a Issue responsável pela implementação do serviço de aplicação (`SUB-05` — Issue #8) e sua *Definition of Ready* (Fase 3).
  2. Definir a estratégia de branch e de Pull Request para a implementação GREEN em relação à branch RED `feature/uc12-07-product-registration-test` (Fase 3).
  3. Planejar e codificar a implementação mínima em `ProductsService.createProduct` (Fases 4 e 5).
- **Condições para prosseguir:** **Atendidas.** O estado RED foi recuperado, revalidado em execução real e permanece fiel aos contratos do projeto.

