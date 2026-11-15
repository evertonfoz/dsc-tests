# ARTEFATO 12-04 — PRIORIZAÇÃO E DECISÕES DE MELHORIA ARQUITETURAL

## 1. Critérios de Avaliação Utilizados

Conforme estabelecido na metodologia do Material 12, toda proposição de mudança arquitetural deve ser avaliada antes de qualquer intervenção no código a partir de sete dimensões qualitativas (julgamento técnico fundamentado em evidências, sem pontuações numéricas artificiais):

1. **Impacto arquitetural:** grau em que a questão afeta a separação de responsabilidades, a inversão de dependências ou a evolução das camadas.
2. **Risco de regressão:** probabilidade de uma alteração quebrar contratos existentes (`Product`, `ProductsService.createProduct`, `ProductsRepository.save`, `ProductResponseDto`, `POST /products`) ou testes aprovados.
3. **Frequência de ocorrência:** recorrência da característica nos fluxos de execução ou manutenção da base de código.
4. **Benefício esperado:** ganho real e demonstrável em desacoplamento, legibilidade, segurança ou testabilidade.
5. **Esforço necessário:** complexidade técnica e volume de arquivos/testes impactados pela mudança.
6. **Dependências envolvidas:** quantidade de módulos, branches e Pull Requests abertos afetados.
7. **Cobertura de testes existente:** existência de suítes capazes de detectar imediatamente eventuais quebras.

---

## 2. Matriz de Decisão e Priorização

Como a auditoria (`12-03`) não revelou defeitos arquiteturais confirmados no código de produção do UC12 e descartou as cinco hipóteses teóricas (`H-01` a `H-05`), a matriz abaixo avalia formalmente as quatro observações técnicas (`OBS-01` a `OBS-04`) e as hipóteses verificadas para fundamentar a decisão de engenharia:

| Campo | Análise de `OBS-01` (Aviso `unbound-method` em `products.service.spec.ts`) | Análise de `OBS-02` (Localização de `InMemoryProductsRepository`) | Análise de `OBS-03` (`ValidationPipe` configurado em `main.ts` e nos testes) | Análise de `OBS-04` (Suíte `test:e2e` legada conectada a `celilac_db`) | Hipóteses `H-01` a `H-05` (Exemplos teóricos do PDF) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Achado** | `OBS-01` — Observação de lint em teste unitário (não é defeito arquitetural) | `OBS-02` — Observação sobre organização de pastas do repositório em memória | `OBS-03` — Observação sobre instanciação de `ValidationPipe` em cada suíte HTTP | `OBS-04` — Observação sobre configuração de banco na suíte E2E de `Orders`/`App` | `H-01` a `H-05` — Hipóteses de acoplamento HTTP/Service/TypeORM e duplicação de mapper |
| **Evidência** | `src/modules/products/services/products.service.spec.ts:34` (`pnpm lint`: 0 erros, 3 avisos preexistentes) | `src/modules/products/repositories/in-memory-products.repository.ts` e `products.integration.spec.ts:21` | `src/main.ts:7-12`, `products.controller.spec.ts:31-36`, `products.integration.spec.ts:51-56` | `src/app.module.ts:18-30` e `test/orders/confirm-order.e2e-spec.ts:25-46` | Inspeção integral dos 11 arquivos de `products` e `infrastructure/persistence/products` |
| **Impacto** | Nenhum impacto na arquitetura, nos contratos ou na execução dos testes | Nenhum impacto arquitetural; classe não importa bibliotecas de infraestrutura | Baixo; restrito à configuração repetida de 5 linhas nos setups de teste HTTP | Fora do módulo `Products`; requer apenas verificação de segurança antes de rodar `pnpm test:e2e` | Inexistente no código real, pois as boas práticas já estão implementadas |
| **Risco** | Baixo em código, mas geraria commit/diff cosmético em arquivo de teste estabilizado desde o Material 04 | Médio para rastreabilidade didática (quebraria caminhos de importação documentados no Material 08) | Médio se alterado globalmente em `AppModule` (poderia impactar suítes E2E de `Orders`) | Alto se `AppModule` ou `.env` fossem alterados sem necessidade comprovada | Alto caso se tentasse alterar componentes que já cumprem seus contratos |
| **Benefício** | Apenas estético (reduzir 1 warning informativo de linter em arquivo de teste) | Nenhum benefício funcional ou de desacoplamento | Mínimo no escopo atual (apenas 2 arquivos de teste HTTP no módulo `Products`) | Isolamento futuro da suíte E2E de `Orders` (fora do escopo do UC12) | Zero benefício (alteração redundante) |
| **Esforço** | Mínimo (1 linha), porém artificial para o objetivo de auditoria arquitetural | Baixo (mover arquivo e atualizar imports), porém sem justificativa técnica | Baixo a moderado (alterar registro global de pipe e revisar todos os testes) | Moderado (refatorar configuração de ambiente de `Orders` / `AppModule`) | Não aplicável |
| **Dependências** | `products.service.spec.ts` (histórico de Draft PR #12 / #13) | `products.integration.spec.ts` (histórico do Material 08) | `main.ts`, `AppModule`, `products.controller.spec.ts`, `products.integration.spec.ts` | `AppModule`, `test/app.e2e-spec.ts`, `test/orders/confirm-order.e2e-spec.ts` | Todos os componentes de `Products` |
| **Cobertura** | Coberto por `pnpm test` (`1 passed` em `products.service.spec.ts`) | Coberto por `pnpm test` (`2 passed` em `products.integration.spec.ts`) | Coberto por `pnpm test` (`5 passed` nos testes HTTP de `products`) | Coberto por `pnpm test:e2e` (`2 passed`) | Coberto por 16 testes automatizados (`test`, `test:integration`, `test:e2e`) |
| **Prioridade** | **Baixa** (cosmética / opcional) | **Nenhuma** (estrutura adequada) | **Baixa** (monitorar apenas se o número de suítes crescer) | **Baixa no UC12** (dívida técnica futura do módulo `Orders`/E2E geral) | **Não aplicável** (hipóteses sem ocorrência real) |
| **Decisão** | **Preservar a implementação** (não realizar alteração cosmética) | **Preservar a implementação** | **Preservar a implementação** | **Adiar e registrar observação** (manter protocolo de inspeção prévia ao rodar `test:e2e`) | **Descartar hipóteses sem evidência** |

---

## 3. Alternativas Consideradas e Justificativas

### Alternativa 1 — Realizar micro-alterações cosméticas apenas para produzir um commit no Material 12
- **Descrição:** Modificar `products.service.spec.ts`, renomear variáveis internas ou mover `InMemoryProductsRepository` apenas para gerar um `git diff` e abrir um novo Pull Request.
- **Avaliação:** **Rejeitada.** Viola frontalmente o princípio central da auditoria orientada por evidências (*"Não é obrigatório alterar código. Não realize alterações cosméticas apenas para produzir um diff. Não crie commits de código artificialmente"*).

### Alternativa 2 — Alterar contratos do Service ou do Repository (ex.: passar `CreateProductDto` para o Service)
- **Descrição:** Alterar `createProduct(name: string)` para `create(dto: CreateProductDto)` ou expor `ProductOrmEntity`.
- **Avaliação:** **Rejeitada.** Além de proibido pelas restrições do projeto, acoplaria o `ProductsService` à camada de transporte HTTP (`CreateProductDto`) e quebraria os testes unitários e integrados construídos nos Materiais 04 a 11.

### Alternativa 3 — Preservar integralmente o código-fonte do fluxo UC12 e documentar o parecer arquitetural com evidências (Selecionada)
- **Descrição:** Manter intactos os arquivos de produção e de teste consolidados até o Material 11 (branch `feature/uc12-10-http-contract-stabilization`, commit `e4e3e12`), comprovando por inspeção estática e execução das suítes de regressão que os contratos, responsabilidades, mappers e providers estão corretos.
- **Avaliação:** **Selecionada.** É a decisão tecnicamente rigorosa quando a auditoria comprova que a arquitetura existente já cumpre os requisitos de separação de responsabilidades, inversão de dependências e estabilidade contratual.

---

## 4. Síntese da Decisão Final da Fase 5

| Decisão | Escopo Aplicado | Justificativa |
| :--- | :--- | :--- |
| **Descartar hipótese sem evidência** | Hipóteses `H-01` a `H-05` do material didático | Inspeção direta do código confirmou que o Controller não acessa TypeORM, o Service não depende de infraestrutura, o Repository não expõe tipos do ORM, o mapper HTTP `toProductResponse()` já está implementado e os providers de `ProductsModule` estão íntegros. |
| **Preservar a implementação** | Todos os componentes do fluxo `UC12 — Cadastrar Produto` (`Product`, `ProductsService`, `ProductsRepository`, `ProductsController`, `CreateProductDto`, `ProductResponseDto`, `toProductResponse`, `TypeOrmProductsRepository`, `InMemoryProductsRepository`, `ProductMapper`, `ProductOrmEntity`, `ProductsModule`) e `OBS-01` a `OBS-03` | A arquitetura apresenta responsabilidades bem delimitadas, acoplamento controlado por abstrações e 100% dos testes aprovados; qualquer alteração seria artificial ou cosmética. |
| **Adiar e registrar observação** | `OBS-04` (isolamento futuro do banco na suíte E2E legada `test:e2e`) | A suíte `test:e2e` pertence a `AppController` e `UC07 — Orders` (fora do escopo do UC12) e já limpa seus próprios registros em `afterAll`; sua reconfiguração fica registrada como recomendação futura de infraestrutura geral, sem modificar conexões ou `.env` nesta atividade. |
