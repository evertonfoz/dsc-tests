# ARTEFATO 08-06 — DIAGNÓSTICO DE FALHAS DE INTEGRAÇÃO

## 1. Objetivo do Diagnóstico

Demonstrar a identificação e análise técnica das categorias de falhas de integração em aplicações NestJS e reproduzir, em um **ambiente de teste isolado** (sem modificar nem quebrar `ProductsModule`), uma falha real de composição de injeção de dependências (`UnknownDependenciesException`), registrando a mensagem real emitida pelo NestJS, a causa raiz e a correção correspondente.

---

## 2. Categorias de Falhas de Integração no Fluxo do Backend

| Categoria | Subtipos / Sintomas Comuns | Camada / Componente Afetado | Impacto Observado nos Testes |
| :--- | :--- | :--- | :--- |
| **1. Falhas de Composição (IoC / DI)** | • Provider ausente no `@Module`<br>• Token de injeção incorreto ou divergente<br>• Uso de `interface` TypeScript como token em vez de constante/símbolo<br>• Módulo de feature não importado<br>• Dependência não exportada por módulo externo | `ProductsModule`, `AppModule`, `@Inject(PRODUCTS_REPOSITORY)` | Falha imediata na compilação/inicialização do módulo (`UnknownDependenciesException`) antes mesmo de receber requisições HTTP. *(Testes unitários e testes HTTP com mocks não detectam falhas do `ProductsModule` se não o importarem).* |
| **2. Falhas na Fronteira HTTP** | • `ValidationPipe` ausente na aplicação/teste<br>• Decoradores `class-validator` ausentes no DTO<br>• Rota `@Controller` ou método `@Post` incorreto<br>• Código HTTP inesperado | `main.ts`, `CreateProductDto`, `ProductsController` | Sem `ValidationPipe`, um payload inválido (`{"name": ""}`) atravessa a fronteira HTTP e retorna `201 Created` em vez de `400 Bad Request`; rotas incorretas retornam `404 Not Found`. |
| **3. Falhas de Comportamento Integrado** | • Controller invoca método com argumento errado (`dto` inteiro em vez de `dto.name`)<br>• Service chama o contrato incorretamente<br>• Repository retorna dados incompatíveis com `Product(productId, name)` | `ProductsController`, `ProductsService`, `InMemoryProductsRepository` | A aplicação inicializa, mas a resposta HTTP diverge do contrato esperado (`productId` ausente, `name` incorreto ou erro `500 Internal Server Error`). |

---

## 3. Reprodução Controlada em Ambiente Isolado (Refinamento 12.2)

### 3.1 Ambiente e Restrição de Segurança
- **Ambiente:** Script de verificação isolada em `scratch/diagnose_di_failure.mjs` utilizando `@nestjs/testing` (`Test.createTestingModule`), **sem tocar em `src/modules/products/products.module.ts`**.
- **Falha Investigada:** `ProductsService` solicita `@Inject(PRODUCTS_REPOSITORY)` em seu construtor (`index [0]`), mas o módulo de teste isolado declara apenas `controllers: [ProductsController]` e `providers: [ProductsService]`, omitindo o provider associado ao token `PRODUCTS_REPOSITORY`.

### 3.2 Configuração Experimental Utilizada
```typescript
// 1. Tentativa de compilação com módulo de teste incompleto (sem PRODUCTS_REPOSITORY)
await Test.createTestingModule({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    // Provider PRODUCTS_REPOSITORY deliberadamente omitido no contexto isolado
  ],
}).compile();
```

### 3.3 Comando Executado e Saída Real do NestJS
- **Comando:**
  ```bash
  node /Users/evertoncoimbradearaujo/.gemini/antigravity/brain/f63ca744-58f6-4525-992e-80b405768481/scratch/diagnose_di_failure.mjs
  ```
- **Saída real obtida:**
  ```text
  === 1. TENTATIVA DE COMPILACAO COM MODULO DE TESTE INCOMPLETO (SEM PRODUCTS_REPOSITORY) ===
  Excecao capturada: UnknownDependenciesException
  Mensagem real do NestJS:
  Nest can't resolve dependencies of the ProductsService (?). Please make sure that the argument "PRODUCTS_REPOSITORY" at index [0] is available in the RootTestModule module.

  Potential solutions:
  - Is RootTestModule a valid NestJS module?
  - If "PRODUCTS_REPOSITORY" is a provider, is it part of the current RootTestModule?
  - If "PRODUCTS_REPOSITORY" is exported from a separate @Module, is that module imported within RootTestModule?
    @Module({
      imports: [ /* the Module containing "PRODUCTS_REPOSITORY" */ ]
    })

  For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors
  ```

---

## 4. Análise da Causa, Token Envolvido e Correção

| Elemento de Diagnóstico | Detalhamento Técnico |
| :--- | :--- |
| **Exceção Lançada** | `UnknownDependenciesException` (`@nestjs/core/errors/exceptions/unknown-dependencies.exception`) |
| **Classe Dependente** | `ProductsService` |
| **Parâmetro / Token Ausente** | Argumento `"PRODUCTS_REPOSITORY"` na posição `index [0]` do construtor de `ProductsService` (`@Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository`). |
| **Causa Raiz** | O container de Injeção de Dependências do NestJS tentou instanciar `ProductsService`, leu o metadado `@Inject(PRODUCTS_REPOSITORY)` no primeiro parâmetro do construtor (`index [0]`), procurou na tabela de providers do módulo (`RootTestModule`) um registro para a chave `'PRODUCTS_REPOSITORY'` e não o encontrou. |
| **Correção Necessária** | Registrar no array `providers` do módulo a associação explícita entre o token `PRODUCTS_REPOSITORY` e uma implementação concreta compatível com `ProductsRepository` (como `{ provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }`) — ou importar diretamente `ProductsModule`, que já encapsula essa composição. |

### Verificação da Correção no Contexto Isolado
Ao incluir o provider `{ provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }` na segunda etapa do mesmo script experimental:

```text
=== 2. VERIFICACAO DA CORRECAO NO CONTEXTO ISOLADO (COM PRODUCTS_REPOSITORY) ===
Modulo compilado com sucesso!
Controller resolvido: ProductsController
Service resolvido: ProductsService
Repository resolvido: InMemoryProductsRepository
```

---

## 5. Limitações e Pendências

- **Integridade do Código de Produção Preservada:** O experimento foi executado exclusivamente em um contexto `TestingModule` isolado na pasta `scratch/`, sem modificar `ProductsModule` e sem publicar configurações quebradas no repositório.
- **Pendências:** Nenhuma pendência no diagnóstico de composição de dependências.

