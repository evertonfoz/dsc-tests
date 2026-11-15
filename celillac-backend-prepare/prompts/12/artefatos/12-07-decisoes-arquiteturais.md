# ARTEFATO 12-07 — REGISTRO DAS DECISÕES ARQUITETURAIS (ADR)

## 1. Enquadramento do Resultado da Auditoria

O Material 12 prevê dois cenários igualmente válidos como resultado da auditoria arquitetural:
- **Cenário A — Refatoração justificada:** quando há problema técnico demonstrável e a mudança preserva os contratos.
- **Cenário B — Preservação justificada:** quando a inspeção rigorosa dos componentes comprova que a arquitetura existente cumpre suas responsabilidades e não há melhoria que justifique alteração imediata no código.

Esta auditoria enquadra-se no **Cenário B — Preservação justificada**, fundamentada nas evidências estáticas e dinâmicas coletadas nas Fases 2 a 7. A seguir estão registradas, de forma proporcional ao escopo do `UC12 — Cadastrar Produto`, as quatro decisões arquiteturais tomadas na unidade.

---

## 2. Decisão 1 — `ADR-UC12-01`: Preservação Integral da Arquitetura e dos Contratos do Fluxo `POST /products`

### Identificação
- **Código:** `ADR-UC12-01`
- **Título:** Preservação da divisão em camadas e da inversão de dependência no cadastro de produtos (`UC12`)

### Problema
Avaliar se a integração acumulada entre `ProductsController`, `ProductsService`, `ProductsRepository`, `TypeOrmProductsRepository`, `ProductOrmEntity` e `ProductsModule` ao longo dos Materiais 04 a 11 introduziu acoplamento indevido entre aplicação e infraestrutura, exposição de tipos do ORM ou violação de responsabilidades que exigisse refatoração no Material 12.

### Evidência
- `src/modules/products/entities/product.entity.ts` não possui nenhuma dependência externa.
- `src/modules/products/repositories/products.repository.interface.ts` define `ProductsRepository.save(product: Product): Promise<Product>` sem expor tipos do TypeORM.
- `src/modules/products/services/products.service.ts` depende apenas de `Product` e do contrato `ProductsRepository` (injetado via token `PRODUCTS_REPOSITORY`).
- `src/infrastructure/persistence/products/typeorm-products.repository.ts` implementa `ProductsRepository` na camada de infraestrutura e encapsula `Repository<ProductOrmEntity>`.
- `src/modules/products/products.module.ts` compõe explicitamente os providers (`TypeOrmModule.forFeature([ProductOrmEntity])` e `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`).

### Alternativas Consideradas
1. **Preservar a arquitetura e os contratos existentes sem alterações de código.**
2. **Alterar assinaturas ou mover classes** (ex.: substituir `createProduct(name)` por `create(dto)` ou fundir camadas) apenas para registrar um diff na etapa de refatoração.

### Decisão
**Preservar integralmente a arquitetura e os contratos existentes do módulo `Products`.**

### Justificativa
A arquitetura atual já materializa corretamente a separação entre Apresentação, Aplicação, Domínio e Infraestrutura, respeitando o Princípio da Inversão de Dependência (DIP) e o Princípio da Responsabilidade Única (SRP). Qualquer modificação nas assinaturas ou na estrutura de diretórios violaria contratos estáveis sem produzir benefício técnico real.

### Consequências
- **Benefícios:** Estabilidade total para consumidores HTTP e para as suítes de teste unitárias, integradas e de persistência; histórico Git limpo e sem commits artificiais.
- **Custos / Riscos residuais:** Caso surjam regras de domínio adicionais em futuros casos de uso, a entidade `Product` precisará evoluir de forma controlada.

### Verificação
Execução de `pnpm test` (13 testes aprovados), `pnpm test:integration` (1 teste aprovado) e `pnpm build` (0 erros), com `git diff` limpo sobre `src/` e `test/`.

---

## 3. Decisão 2 — `ADR-UC12-02`: Manutenção da Separação Estrita entre Mapper HTTP e Mapper de Persistência

### Identificação
- **Código:** `ADR-UC12-02`
- **Título:** Preservação de dois mappers independentes (`toProductResponse` na fronteira HTTP e `ProductMapper` na persistência TypeORM)

### Problema
Avaliar se a existência de dois mecanismos de mapeamento no fluxo `UC12` (`toProductResponse` em `src/modules/products/mappers/product-response.mapper.ts` e `ProductMapper` em `src/infrastructure/persistence/products/product.mapper.ts`) configura duplicação indevida ou se há mapeamento HTTP inline residual no `ProductsController`.

### Evidência
- `src/modules/products/controllers/products.controller.ts` (linha 17) já delega a serialização de saída para `return toProductResponse(product);` (implementado no Material 11).
- `toProductResponse(product: Product): ProductResponseDto` atua exclusivamente na transformação `Product → ProductResponseDto` (fronteira pública HTTP).
- `ProductMapper.toPersistence(product)` e `ProductMapper.toDomain(entity)` atuam exclusivamente na transformação `Product ↔ ProductOrmEntity` (fronteira de persistência TypeORM).

### Alternativas Consideradas
1. **Manter os dois mappers separados em suas respectivas camadas.**
2. **Unificar os mappers em uma única classe utilitária** que conhecesse simultaneamente `Product`, `ProductResponseDto` e `ProductOrmEntity`.

### Decisão
**Manter `toProductResponse` e `ProductMapper` estritamente separados e inalterados.**

### Justificativa
Unificar os dois mappers violaria a separação de camadas e o Princípio da Responsabilidade Única, pois acoplaria a representação pública HTTP (`ProductResponseDto`) à entidade relacional do banco de dados (`ProductOrmEntity`). Eles mudam por razões diferentes: `toProductResponse` protege o contrato com clientes HTTP, enquanto `ProductMapper` adapta o esquema relacional `products.products`.

### Consequências
- **Benefícios:** Evolução independente entre o esquema SQL do PostgreSQL e o contrato JSON público da API; garantia em tempo de execução de que propriedades internas não vazem no JSON.
- **Custos / Riscos residuais:** Manutenção de dois arquivos de mapeamento pequenos e coesos (custo desprezível diante do ganho de isolamento).

### Verificação
3.º teste de `src/modules/products/controllers/products.controller.spec.ts` (`should expose only public contract fields and filter simulated internal properties`) e teste de persistência real `typeorm-products.repository.postgres.spec.ts`.

---

## 4. Decisão 3 — `ADR-UC12-03`: Não Realização de Refatoração Cosmética em Testes para Avisos Preexistentes de Linter (`OBS-01`)

### Identificação
- **Código:** `ADR-UC12-03`
- **Título:** Preservação de `products.service.spec.ts` diante do aviso informativo `typescript(unbound-method)`

### Problema
Durante a execução de `pnpm lint` (`oxlint --type-aware src/ test/`), observou-se 1 aviso (`warning`) `typescript(unbound-method)` em `src/modules/products/services/products.service.spec.ts:34` (`expect(productsRepository.save).toHaveBeenCalledTimes(1)`) e 2 avisos preexistentes em `src/modules/orders/services/orders.service.spec.ts`. Cumpria decidir se esse aviso justificava alterar o arquivo de teste e criar um commit no Material 12.

### Evidência
- `pnpm lint` finaliza com código de saída `0` (`Found 3 warnings and 0 errors`).
- Em `products.service.spec.ts`, `productsRepository.save` é criado com `vi.fn()`, uma função mock independente de contexto `this`.
- O arquivo `products.service.spec.ts` não sofreu modificações desde sua estabilização nos materiais iniciais de TDD e está incluído no histórico rastreável de Pull Requests da equipe.

### Alternativas Consideradas
1. **Preservar `products.service.spec.ts` sem edição cosmética.**
2. **Alterar a linha 34 ou adicionar supressão de regra** apenas para eliminar o warning em `products.service.spec.ts`.

### Decisão
**Preservar `products.service.spec.ts` sem alterações nesta unidade.**

### Justificativa
O aviso ocorre apenas pela análise estática genérica de métodos em TypeScript sobre a sintaxe padrão de asserção de mocks do Vitest (`expect(mock.fn).toHaveBeenCalledTimes(1)`), não representando risco em tempo de execução nem problema arquitetural. Alterar o arquivo produziria um commit artificial desconectado dos objetivos arquiteturais do Material 12.

### Consequências
- **Benefícios:** Preservação da integridade histórica da suíte unitária e aderência estrita à diretriz de não produzir diffs cosméticos.
- **Custos / Riscos residuais:** Permanência dos 3 warnings informativos já documentados desde a linha de base do Material 11.

### Verificação
Execução de `pnpm lint` (`0 errors`) e `pnpm test` (`products.service.spec.ts` aprovado).

---

## 5. Decisão 4 — `ADR-UC12-04`: Protocolo de Segurança para Execução das Suítes de Persistência e E2E

### Identificação
- **Código:** `ADR-UC12-04`
- **Título:** Distinção operacional entre `pnpm test:integration` (`celilac_test`) e `pnpm test:e2e` (`celilac_db`)

### Problema
A aplicação possui duas suítes que interagem com o PostgreSQL: `pnpm test:integration` (voltada ao `TypeOrmProductsRepository` do UC12) e `pnpm test:e2e` (voltada aos testes E2E legados de `AppController` e `UC07 — Orders`). Era necessário definir como verificar regressões sem colocar em risco os dados do banco de desenvolvimento `celilac_db` e sem alterar silenciosamente credenciais ou conexões.

### Evidência
- `src/database/test-data-source.ts` conecta `pnpm test:integration` exclusivamente a `celilac_test` na porta `5435` com travas explícitas contra execução em `celilac_db`.
- `src/app.module.ts` conecta `pnpm test:e2e` ao banco configurado em `DB_NAME` (`celilac_db`, porta `5432`).
- `test/orders/confirm-order.e2e-spec.ts` insere apenas 1 pedido e 1 pagamento com UUID aleatório e remove exclusivamente esses IDs no `afterAll`, sem tocar no schema `products`.

### Alternativas Consideradas
1. **Inspecionar previamente o código dos testes E2E, confirmar a ausência de impacto destrutivo e executar ambas as suítes preservando intactas as configurações de conexão.**
2. **Alterar `AppModule` ou `.env`** durante a auditoria para redirecionar `pnpm test:e2e` para outro banco.
3. **Deixar de executar `pnpm test:e2e`** sem inspecionar seu código.

### Decisão
**Adotar a Alternativa 1: inspecionar estaticamente os testes antes da execução, confirmar as salvaguardas de `celilac_test` (`5435`) e o teardown cirúrgico de `confirm-order.e2e-spec.ts` em `celilac_db` (`5432`), executando ambas as suítes sem alterar `.env` ou `AppModule`.**

### Justificências e Consequências
- **Justificativa:** Cumpre integralmente o protocolo de segurança do PostgreSQL exigido na Fase 7 e respeita a restrição de não modificar conexões, credenciais ou volumes Docker sem necessidade comprovada.
- **Consequências:** Cobertura completa de regressão confirmada (16 testes aprovados no total), registrando-se como observação futura (`OBS-04`) a recomendação de parametrizar um banco dedicado para a suíte E2E de `Orders`.

### Verificação
Execução controlada de `pnpm test:integration` (`1 passed`) e `pnpm test:e2e` (`2 passed`), seguida da verificação de saúde dos contêineres `celilac-postgres` e `celilac-postgres-test`.
