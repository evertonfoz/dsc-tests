# Guia de Verificação Pós-Atividade — Material 12

**Auditoria Arquitetural e Refatoração Orientada por Evidências (CeliLac, UC12 — Cadastrar Produto)**

Use este guia **depois** de executar a atividade do Material 12, para conferir com evidências reais se a auditoria arquitetural, a preservação dos contratos, a separação de camadas, os testes de regressão e o parecer técnico foram conduzidos corretamente. Todos os comandos são não destrutivos. Execute-os na pasta `celillac-backend-prepare/`, na branch `feature/uc12-10-http-contract-stabilization`.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Pré-requisitos e Estado do Repositório

| Verificação | Comando | Esperado |
|---|---|---|
| Branch atual | `git branch --show-current` | `feature/uc12-10-http-contract-stabilization` |
| Ausência de alterações artificiais no código | `git diff -- src/ test/` | saída vazia (no Cenário B — Preservação justificada) |
| `.env` existe e não é versionado | `git check-ignore .env` | imprime `.env` |
| Artefatos do Material 11 presentes | `ls prompts/11/artefatos/11-*.md` | 8 arquivos (`11-01` a `11-08`) listados |
| Artefatos do Material 12 presentes | `ls prompts/12/artefatos/12-*.md` | 8 arquivos (`12-01` a `12-08`) listados |

---

## 1. Verificação das Dependências Arquiteturais (Compilação vs. Execução)

A auditoria deve comprovar que o núcleo de domínio e aplicação não depende da infraestrutura (TypeORM) nem da camada HTTP:

```bash
# 1.1 Entidade de domínio não deve ter imports externos
cat src/modules/products/entities/product.entity.ts

# 1.2 Interface do Repository não deve expor tipos do TypeORM
cat src/modules/products/repositories/products.repository.interface.ts

# 1.3 Service não deve importar nada de src/infrastructure/ nem DTOs HTTP
cat src/modules/products/services/products.service.ts

# 1.4 Controller não deve importar nada de typeorm ou src/infrastructure/
cat src/modules/products/controllers/products.controller.ts
```

**Esperado:**
- `Product` declara apenas `public readonly productId: string` e `public readonly name: string`.
- `ProductsRepository` declara `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'` e `save(product: Product): Promise<Product>`.
- `ProductsService` importa apenas `randomUUID`, `@nestjs/common`, `Product` e `products.repository.interface.js`, mantendo a assinatura `createProduct(name: string): Promise<Product>`.
- `ProductsController` injeta apenas `ProductsService` e converte a saída com `return toProductResponse(product);`.

---

## 2. Verificação dos Providers e dos Dois Mappers

Confira a composição do módulo e a separação entre os mappers HTTP e de persistência:

```bash
cat src/modules/products/products.module.ts
cat src/modules/products/mappers/product-response.mapper.ts
cat src/infrastructure/persistence/products/product.mapper.ts
```

**Esperado:**
- `ProductsModule` importa `TypeOrmModule.forFeature([ProductOrmEntity])` e vincula `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`.
- `product-response.mapper.ts` transforma `Product -> ProductResponseDto` (fronteira pública HTTP).
- `product.mapper.ts` (`ProductMapper`) transforma `Product <-> ProductOrmEntity` (fronteira de persistência TypeORM).

---

## 3. Compilação e Análise Estática (Lint)

```bash
pnpm build
pnpm lint
```

**Esperado:**
- `pnpm build` (`nest build`) conclui com código `0` e sem erros.
- `pnpm lint` (`oxlint --type-aware src/ test/`) conclui com `0 errors` (apenas os 3 avisos preexistentes em arquivos `.spec.ts`).

---

## 4. Verificação de Regressões e Segurança do PostgreSQL

### 4.1 Suíte Rápida (Unitários, HTTP e Integração em Memória)
```bash
pnpm test
```
**Esperado:** **5 arquivos aprovados (`5 passed`) e 13 testes aprovados (`13 passed`)**, cobrindo:
- `products.service.spec.ts` (1 teste)
- `products.controller.spec.ts` (3 testes: `201`, `400` e filtro de `internalNote` com `toEqual()`)
- `products.integration.spec.ts` (2 testes com `InMemoryProductsRepository`)
- `app.controller.spec.ts` (1 teste)
- `orders.service.spec.ts` (6 testes)

### 4.2 Suíte de Persistência Real do UC12 (`celilac_test` na porta `5435`)
```bash
docker compose up -d postgres_test
pnpm test:integration
```
**Esperado:** **1 arquivo aprovado (`1 passed`) e 1 teste aprovado (`1 passed`)** em `typeorm-products.repository.postgres.spec.ts`, confirmando conexão exclusiva com `celilac_test` (`5435`) e salvaguarda `TEST_DB_ALLOW_DESTRUCTIVE=true`.

### 4.3 Atenção Especial sobre `pnpm test:e2e` (`celilac_db` na porta `5432`)
O comando `pnpm test:e2e` executa `test/app.e2e-spec.ts` e `test/orders/confirm-order.e2e-spec.ts`, que inicializam `AppModule` conectado ao banco de desenvolvimento `celilac_db`.
- **Antes de executar:** inspecione `test/orders/confirm-order.e2e-spec.ts` para confirmar que ele remove apenas os UUIDs criados no próprio teste (`afterAll`) e não acessa `products.products`.
- Se o ambiente estiver compreendido e autorizado:
  ```bash
  pnpm test:e2e
  ```
  **Esperado:** **2 arquivos aprovados (`2 passed`) e 2 testes aprovados (`2 passed`)**.

---

## 5. Checklist de Evidências para o Parecer Técnico / Pull Request

No Material 12, quando a auditoria conclui pela **Preservação Arquitetural Justificada (Cenário B)**, não se deve criar commit artificial nem PR vazio. Confira se o parecer técnico e os artefatos `12-01` a `12-08` registram:

- [ ] Distinção explícita entre **fluxo de execução** e **dependências de compilação (DIP)** (`12-02`)
- [ ] Avaliação dos 10 componentes e dos 8 critérios de qualidade (`12-03`)
- [ ] Descarte fundamentado das 5 hipóteses teóricas do PDF (`H-01` a `H-05`) e diferenciação entre **Observação** e **Problema** (`12-03` e `12-04`)
- [ ] Confirmação de que `toProductResponse()` já foi implementado no Material 11 e está preservado (`12-05`)
- [ ] Resultados reais reexecutados de `pnpm test`, `pnpm test:integration`, `pnpm build` e `pnpm lint`, além da análise de segurança de `celilac_test` vs. `celilac_db` (`12-06`)
- [ ] Decisões arquiteturais documentadas (`12-07`)
- [ ] Rastreabilidade com as Issues reais do GitHub (`#1`, `#7`–`#11`) sem reutilizar `#16` (containerização) e sem declarar aprovação humana prematura (`12-08`)

---

## 6. Problemas Conhecidos e Armadilhas no Material 12

1. **Inventar refatoração apenas para gerar diff/commit:** alterar nomes de métodos (`createProduct` → `create`), adicionar campos não solicitados (`price`) ou fazer edições cosméticas em testes quebra contratos e contraria o princípio central da unidade.
2. **Tratar exemplos hipotéticos do PDF como defeitos reais do CeliLac:** o PDF mostra exemplos de Controller acessando TypeORM ou mapeamento inline (`return { productId, name }`) para fins didáticos; no CeliLac, esses problemas não ocorrem (ou já foram resolvidos no Material 11).
3. **Confundir direção de chamada em runtime com dependência de código:** em runtime o `ProductsService` chama `TypeOrmProductsRepository.save()`, mas em compilação é `TypeOrmProductsRepository` quem depende de `ProductsRepository` (Inversão de Dependência).
4. **Presumir que `implements ProductsRepository` resolve DI sozinho no NestJS:** interfaces somem no JavaScript; quem resolve a injeção em runtime é o provider `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }` no `ProductsModule`.
5. **Presumir que `pnpm test:e2e` usa `celilac_test`:** `test:integration` usa `celilac_test` (`5435`), mas `test:e2e` sobe `AppModule` conectado a `celilac_db` (`5432`).

---

## 7. Distinções que o Aluno Deve Conseguir Explicar

- **Fluxo de execução ≠ Dependência arquitetural de compilação.**
- **Observação ≠ Problema confirmado.** Nem toda característica observada no código exige refatoração.
- **Refatoração justificada (Cenário A) ≠ Preservação justificada (Cenário B).** Preservar o código com base em evidências é uma decisão de engenharia completa e válida.
- **Mapper HTTP (`toProductResponse`) ≠ Mapper de Persistência (`ProductMapper`).**
- **Testes aprovados ≠ Garantia absoluta de ausência de defeitos.** Testes reduzem riscos no escopo exercitado, mas possuem limites que devem ser reconhecidos no relatório de auditoria.
