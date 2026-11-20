# ARTEFATO 12-07 — REGISTRO DAS DECISÕES ARQUITETURAIS (ADRS)

## 1. Visão Geral dos Registros Arquiteturais
Este documento formaliza as decisões de arquitetura e design adotadas e ratificadas durante a auditoria do caso de uso `UC12 — Cadastrar Produto` no projeto CeliLac.

---

## 2. ADR-01: Inversão de Dependências na Persistência de Dados
* **Status:** Ratificado e Preservado.
* **Contexto e Problema:** Como persistir produtos em banco relacional sem acoplar a lógica de negócio do domínio e o serviço de aplicação ao TypeORM ou a detalhes de infraestrutura?
* **Evidência no Código:** 
  - Interface pura `ProductsRepository` em `src/modules/products/repositories/products.repository.interface.ts`.
  - Injeção por token `@Inject(PRODUCTS_REPOSITORY)` no `ProductsService`.
  - Grep de `typeorm` no domínio e serviço retorna 0 ocorrências.
* **Alternativas Consideradas:**
  1. *Injeção direta de `Repository<ProductOrmEntity>` no `ProductsService`:* Rejeitada devido ao forte acoplamento com o ORM, dificultando testes unitários rápidos e violando a Clean Architecture.
  2. *Uso do padrão Active Record no domínio:* Rejeitada porque transformaria a entidade pura de domínio em dependente do TypeORM.
  3. *Inversão de Dependência com Repository Pattern e Token de DI:* Escolhida.
* **Decisão:** Manter a interface abstrata `ProductsRepository` e o token `PRODUCTS_REPOSITORY`, com implementação concreta em `TypeOrmProductsRepository` vinculada pelo módulo NestJS.
* **Consequências:**
  - *Positivas:* Alta testabilidade (serviço testável com repositório em memória em 70ms); independência de fornecedor de banco de dados; domínio corporativo limpo.
  - *Custos:* Necessidade de uma camada intermediária de repositório e mapeamento.
* **Verificação:** Testes unitários e integrados aprovados; execução real comprovada via PostgreSQL.

---

## 3. ADR-02: Segregação Estrita entre Mapper HTTP e Mapper de Persistência
* **Status:** Ratificado e Preservado.
* **Contexto e Problema:** A entidade de domínio `Product` transita tanto para a camada externa (clientes HTTP) quanto para a camada de armazenamento (PostgreSQL). Como evitar que alterações no banco reflitam na API pública e vice-versa?
* **Evidência no Código:**
  - `toProductResponse(product: Product): ProductResponseDto` em `src/modules/products/mappers/product-response.mapper.ts`.
  - `ProductMapper.toPersistence` e `toDomain` em `src/infrastructure/persistence/products/product.mapper.ts`.
* **Alternativas Consideradas:**
  1. *Mapper único universal:* Rejeitada por misturar conceitos de apresentação externa com detalhes relacionais de banco.
  2. *Retorno direto da entidade de domínio ou entidade ORM no Controller:* Rejeitada pelo risco de vazamento de atributos internos e quebra de contratos públicos.
  3. *Dois mappers especializados e independentes:* Escolhida.
* **Decisão:** Separar rigorosamente a transformação para a fronteira HTTP da transformação para a fronteira de persistência.
* **Consequências:**
  - *Positivas:* O domínio pode evoluir sem quebrar contratos de clientes HTTP; a entidade relacional pode alterar tipos e índices sem afetar a resposta da API; ausência de duplicação.
  - *Custos:* Manutenção de duas classes/funções de mapeamento bem delimitadas.
* **Verificação:** Teste de contrato em `products.controller.spec.ts` validando a não exposição de campos internos com asserção estrita `toEqual`.

---

## 4. ADR-03: Decisão pelo Cenário B (Preservação Arquitetural Justificada)
* **Status:** Adotado.
* **Contexto e Problema:** A auditoria arquitetural deve forçar alterações no código ou preservar a implementação quando não forem detectados problemas reais?
* **Evidência no Código:**
  - 8 critérios de qualidade inspecionados sem inconformidades no escopo do `UC12`.
  - Linha de base estável com 100% dos testes do caso de uso aprovados.
  - Ausência de acoplamentos indevidos comprovada por análise estática.
* **Alternativas Consideradas:**
  1. *Cenário A (Refatoração Forçada):* Rejeitada por contrariar os princípios da engenharia orientada por evidências. Criar diffs cosméticos traz riscos de quebra e gera ruído de governança.
  2. *Cenário B (Preservação Justificada):* Escolhida.
* **Decisão:** Declarar a preservação arquitetural da funcionalidade `UC12`, emitindo parecer técnico formal sem modificações desnecessárias no código-fonte.
* **Consequências:**
  - *Positivas:* Estabilidade do código em produção; conformidade com os princípios da disciplina; respeito ao escopo planejado.
  - *Custos:* Nenhum.
* **Verificação:** Diffs nulos em `src/modules/products/` e preservação integral dos 7 testes do caso de uso.

---

## 5. ADR-04: Política de Segurança e Isolamento dos Ambientes PostgreSQL
* **Status:** Ratificado e Preservado.
* **Contexto e Problema:** Testes de persistência real necessitam executar operações DDL e `TRUNCATE`. Como garantir que dados do ambiente de desenvolvimento ou produção nunca sejam corrompidos?
* **Evidência no Código:**
  - `docker-compose.yaml` com portas `5432` (dev) e `5435` (testes).
  - Salvaguardas programáticas em `src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts`.
  - Bloqueio da execução de `test:e2e` desprotegido.
* **Alternativas Consideradas:**
  1. *Executar testes no mesmo banco de desenvolvimento:* Rejeitada pelo risco inaceitável de perda de dados.
  2. *Bancos efêmeros sem validação de identidade:* Rejeitada pelo risco de conexão acidental à porta padrão.
  3. *Contêiner dedicado com porta distinta e salvaguarda obrigatória:* Escolhida.
* **Decisão:** Manter contêiner exclusivo `postgres_test` na porta `5435`, com validação estrita de banco, usuário e flag `TEST_DB_ALLOW_DESTRUCTIVE=true`.
* **Consequências:**
  - *Positivas:* Segurança absoluta do banco de desenvolvimento contra operações destrutivas.
  - *Custos:* Necessidade de manter dois serviços PostgreSQL no Docker Compose.
* **Verificação:** Suíte `pnpm test:integration` aprovada no contêiner isolado sem impactar o banco `celilac_db`.
