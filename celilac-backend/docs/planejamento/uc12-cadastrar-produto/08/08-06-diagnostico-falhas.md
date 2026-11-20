# ARTEFATO 08-06 — DIAGNÓSTICO DE FALHAS DE INTEGRAÇÃO E INJEÇÃO DE DEPENDÊNCIAS

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Categorização Geral de Falhas de Integração em Aplicações NestJS

Falhas de integração no backend manifestam-se tipicamente em três categorias fundamentais:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. FALHAS DE COMPOSIÇÃO DE MÓDULOS E INJEÇÃO DE DEPENDÊNCIAS (IoC)     │
│    - Provider ausente no array providers do módulo                     │
│    - Token incorreto ou desacordo entre @Inject(TOKEN) e { provide }   │
│    - Módulo não importado no AppModule ou dependência não exportada    │
│    - Erro em tempo de inicialização: UnknownDependenciesException      │
├────────────────────────────────────────────────────────────────────────┤
│ 2. FALHAS NA FRONTEIRA HTTP (PIPELINE E TRANSPORTE)                    │
│    - ValidationPipe ausente ou configurado sem whitelist/transform     │
│    - Rota/verbo HTTP divergente do esperado                            │
│    - DTO sem decoradores de validação ou payload malformado            │
│    - Erro em tempo de requisição: 404 Not Found ou 500 inesperado      │
├────────────────────────────────────────────────────────────────────────┤
│ 3. FALHAS DE COMPORTAMENTO ENTRE CAMADAS (CONTRATOS)                   │
│    - Service invocando método com assinatura divergente da interface   │
│    - Repositório retornando estrutura de dados incompatível            │
│    - Violação de tipagem em tempo de execução                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 🌟 Refinamento da Fase 9 — Diagnóstico Controlado em Ambiente de Teste Isolado

Para demonstrar a habilidade técnica de diagnosticar falhas de injeção de dependência sem quebrar o código de produção (`ProductsModule`), reproduziu-se de forma controlada a clássica falha de **omissão de provider de repositório**.

### 2.1 Configuração do Experimento em Contexto Isolado:
Configurou-se um módulo de teste (`Test.createTestingModule`) registrando o `ProductsController` e o `ProductsService` reais, **mas omitindo propositalmente o provider do `PRODUCTS_REPOSITORY`**:

```typescript
// Experimento em Contexto de Teste Isolado:
await Test.createTestingModule({
  controllers: [ProductsController],
  providers: [ProductsService],
  // Omissão proposital do provider:
  // { provide: PRODUCTS_REPOSITORY, useClass: InMemoryProductsRepository }
}).compile();
```

---

## 3. Evidência Real da Falha Capturada no Terminal

Ao compilar o módulo isolado com a dependência ausente, o container do NestJS interrompeu a inicialização lançando a seguinte exceção real:

```text
Error: Nest can't resolve dependencies of the ProductsService (?). Please make sure that the argument "PRODUCTS_REPOSITORY" at index [0] is available in the RootTestModule module.

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

## 4. Anatomia Técnica da Mensagem de Erro do NestJS

A dissecação minuciosa da mensagem de erro revela as seguintes informações cruciais para o engenheiro de software:

1. **Classe Afetada:** `ProductsService` — indica que o container conseguiu identificar e tentar instanciar a classe de serviço.
2. **Ponto de Interrupção no Construtor:** `(?)` e `at index [0]` — aponta com precisão cirúrgica que o primeiro parâmetro do construtor de `ProductsService` (`constructor(@Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository)`) não pôde ser resolvido.
3. **Token Ausente Identificado:** `"PRODUCTS_REPOSITORY"` — confirma que o decorador `@Inject(PRODUCTS_REPOSITORY)` procurou por esse identificador string no catálogo do container e não o encontrou.
4. **Escopo do Módulo:** `RootTestModule` — delimita o contexto do módulo onde a dependência deveria ter sido declarada ou importada.

---

## 5. Solução Técnica e Correção Demonstrada

A causa-raiz é a ausência do provider associado ao token no array `providers`. A correção técnica definitiva consiste em registrar o provider customizado associando o token à classe de infraestrutura:

```typescript
// Configuração Correta do Provider:
{
  provide: PRODUCTS_REPOSITORY,
  useClass: InMemoryProductsRepository,
}
```

Ao reinserir o provider no `ProductsModule`, a cadeia é completamente satisfeita:
- O container localiza o token `"PRODUCTS_REPOSITORY"`;
- Instancia a classe `InMemoryProductsRepository`;
- Injeta a instância na posição `[0]` do construtor de `ProductsService`;
- Injeta o `ProductsService` no construtor de `ProductsController`.

---

## 6. Verificação de Integridade do Código de Produção

- O módulo real de produção (`src/modules/products/products.module.ts`) permaneceu **100% intacto e íntegro** durante todo o diagnóstico.
- A suíte de testes de produção permanece 100% verde (5 testes aprovados).
- Nenhuma alteração defeituosa ou instável foi introduzida no repositório.
