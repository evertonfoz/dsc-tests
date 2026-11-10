# ARTEFATO 05-03 — PLANO DE IMPLEMENTAÇÃO MÍNIMA (FASE GREEN)

## 1. Objetivo e Critério de Aceite

- **Objetivo:** Planejar o menor conjunto de alterações de código de produção necessário para fazer o teste automatizado `should register and save a product when valid data is provided (CA01)` passar na **Fase GREEN do TDD**, respeitando integralmente os contratos e as responsabilidades arquiteturais do projeto CeliLac.
- **Caso de Uso:** `UC12 — Cadastrar Produto` ([Issue #1 — `EPIC-UC12`](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Issue Responsável pela Implementação:** `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` ([Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8)).
- **Issue do Teste Orientador:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Critério de Aceite Alvo:** **`CA01`** — *Uma solicitação contendo dados válidos deve resultar no cadastro de um produto* (em conjunto com `RN04` — *Persistência após validação* e `CA04` — *Cobertura por testes automatizados*).

---

## 2. Análise Técnica do Teste RED Existente

Antes de propor alterações, foram analisados os 8 elementos estruturais do teste em `src/modules/products/services/products.service.spec.ts`:

| # | Elemento Analisado | Especificação no Teste Existente |
| :---: | :--- | :--- |
| **1** | **Entradas** | `name = 'Celular XYZ'` (parâmetro `string` passado para `createProduct`). |
| **2** | **Operação Executada** | `const result = await service.createProduct('Celular XYZ');` |
| **3** | **Resultado Esperado** | Uma instância de `Product` persistida via `productsRepository.save` contendo `productId` (`string`) e `name` (`'Celular XYZ'`). |
| **4** | **Asserções** | 1. `expect(productsRepository.save).toHaveBeenCalledTimes(1)`<br>2. `expect(result.productId).toEqual(expect.any(String))`<br>3. `expect(result.name).toBe('Celular XYZ')` |
| **5** | **Contratos** | `Product(productId: string, name: string)`, `PRODUCTS_REPOSITORY`, `ProductsRepository.save(product: Product): Promise<Product>` e `ProductsService.createProduct(name: string): Promise<Product>`. |
| **6** | **Dependências** | Injeção de `ProductsRepository` via `@Inject(PRODUCTS_REPOSITORY)` no construtor de `ProductsService` e geração de identificador único via `randomUUID` (`node:crypto`). |
| **7** | **Responsabilidade Arquitetural** | Cabe ao serviço de aplicação (`ProductsService`) coordenar a criação da instância da entidade `Product`, delegar sua persistência ao contrato `ProductsRepository.save` e retornar o produto persistido. |
| **8** | **Comportamento Ausente** | O método `ProductsService.createProduct` atualmente apenas lança `throw new Error('Not implemented: createProduct')`, sem instanciar `Product` nem invocar `this.productsRepository.save`. |

---

## 3. Avaliação dos Componentes do Módulo `products`

1. **`Product` (`src/modules/products/entities/product.entity.ts`):**
   - Já define `constructor(public readonly productId: string, public readonly name: string) {}`.
   - Atende integralmente ao contrato exigido pelo teste de `CA01`. **Não requer modificação nesta etapa.**
2. **`ProductsRepository` e `PRODUCTS_REPOSITORY` (`src/modules/products/repositories/products.repository.interface.ts`):**
   - Já define o token `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'` e a interface `ProductsRepository { save(product: Product): Promise<Product>; }`.
   - **Não requer modificação nesta etapa.**
3. **`ProductsService` e `ProductsService.createProduct` (`src/modules/products/services/products.service.ts`):**
   - Já possui `@Injectable()` e a injeção `@Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository`.
   - O método `createProduct` precisa substituir o lançamento de erro pela instanciação de `new Product(randomUUID(), name)` (utilizando `randomUUID` do módulo nativo `node:crypto` para evitar valores fixos artificiais) e pela chamada `return this.productsRepository.save(product)`.
4. **Teste Automatizado (`src/modules/products/services/products.service.spec.ts`):**
   - Está corretamente especificado e todas as suas asserções devem ser **integralmente preservadas**. **Nenhuma linha do teste será alterada.**

---

## 4. Plano de Alteração (Conjunto Mínimo para GREEN)

| Arquivo | Componente | Responsabilidade | Estado Atual | Alteração Necessária | Justificativa | Critério de Aceite Relacionado |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `src/modules/products/entities/product.entity.ts` | `Product` | Representar a entidade de domínio Produto com `productId` e `name`. | Implementado (`productId: string`, `name: string`). | **Nenhuma alteração.** | O contrato atual já satisfaz a estrutura exigida por `CA01`. | `CA01` |
| `src/modules/products/repositories/products.repository.interface.ts` | `ProductsRepository` / `PRODUCTS_REPOSITORY` | Definir o contrato de persistência desacoplado da infraestrutura. | Implementado (`save(product: Product): Promise<Product>`). | **Nenhuma alteração.** | O contrato e o token de injeção já estão alinhados ao serviço e ao teste. | `CA01` |
| `src/modules/products/services/products.service.ts` | `ProductsService.createProduct` | Coordenar a criação da entidade `Product`, acionar a persistência no repositório e retornar o produto salvo. | Stub RED: `throw new Error('Not implemented: createProduct')`. | Importar `randomUUID` de `node:crypto`, instanciar `const product = new Product(randomUUID(), name);` e retornar `await this.productsRepository.save(product);`. | É a implementação mínima e não artificial que cumpre o contrato de `ProductsService`, gera um identificador único real (`string`), invoca `save` 1 vez e retorna o produto com o `name` informado. | `CA01` / `CA04` |
| `src/modules/products/services/products.service.spec.ts` | `ProductsService.spec` | Verificar automatizadamente o comportamento de `CA01`. | Teste implementado e falhando na fase RED. | **Nenhuma alteração.** | As asserções não devem ser modificadas; o teste deve passar exclusivamente pela implementação de `ProductsService.createProduct`. | `CA01` / `CA04` |

---

## 5. Dependências, Riscos e Critério de Conclusão do GREEN

- **Dependências:**
  - Contratos de `Product` e `ProductsRepository` (já presentes na branch-base `feature/uc12-07-product-registration-test`);
  - Biblioteca padrão do Node.js (`node:crypto` → `randomUUID()`), sem necessidade de pacotes externos adicionais.
- **Riscos e Cuidados:**
  - **Não utilizar ID fixo/hardcoded** (ex.: `'1'` ou `'id-fixo'`), utilizando `randomUUID()` para respeitar a semântica real de identidade de domínio.
  - **Não antecipar regras de negócio de outras etapas** (como validações de nome vazio de `CA02`/`CA03`), mantendo o foco estrito na implementação mínima que satisfaz o teste atual de `CA01`.
- **Critério de Conclusão do GREEN:**
  1. O arquivo `src/modules/products/services/products.service.ts` implementa `createProduct(name: string): Promise<Product>` conforme planejado;
  2. O arquivo de teste `src/modules/products/services/products.service.spec.ts` permanece inalterado;
  3. A execução de `pnpm test src/modules/products/services/products.service.spec.ts` resulta em **`1 passed (1)`**;
  4. Os demais testes existentes na suíte do projeto continuam passando sem regressões.

