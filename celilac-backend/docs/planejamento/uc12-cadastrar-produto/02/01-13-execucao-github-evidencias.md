# Artefato 13 — Evidências de Execução e Automação no GitHub

## 1. Metadados da Execução
- **Data e Hora da Execução:** 10/11/2026 às 14:14 (BRT / UTC-3)
- **Repositório GitHub Utilizado:** [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) (branch padrão: `main`)
- **Conta Autenticada (`gh auth status`):** `evertonfoz`
- **Diretório Local dos Artefatos de Entrada (Prompt 01):** `docs/planejamento/uc12-cadastrar-produto/01/`
- **Diretório Local de Evidências (Prompt 02):** `docs/planejamento/uc12-cadastrar-produto/02/`
- **Política de Execução:** Reaproveitamento integral dos recursos já existentes no repositório (sem duplicação de Epic, Sub-Issues ou Project Board) e criação complementar das labels faltantes do plano taxonômico.

---

## 2. Issue Principal (Epic)
- **Número Real no GitHub:** `#1`
- **Título no GitHub:** `EPIC-UC12 — [UC12] Cadastrar Produto` *(correspondente a `[UC12] Cadastrar Produto` no Artefato 03)*
- **URL Oficial:** https://github.com/evertonfoz/dsc-tests/issues/1
- **Estado da Issue:** `OPEN`
- **Estado no GitHub Project (Board):** `Backlog`
- **Labels Associadas:** `uc12`, `type:epic`, `priority:high`
- **Responsável:** `@evertonfoz`

---

## 3. Tabela Comparativa de Rastreabilidade das Sub-Issues

### 3.1 Mapeamento entre o Planejamento (`01-04-sub-issues.md`) e as Issues Reais no GitHub

| ID Provisório (Artefato 04) | ID / Número Real no GitHub | Título da Sub-Issue no GitHub (Equivalência no Artefato 04) | URL Oficial | Estado no Board (Project #6) | Responsável |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `SUB-01` | `#4` (`SUB-01`) | `SUB-01 — [UC12][Domínio] Modelar entidade Product` <br>*(Equivalente: [SUB-01] Modelar a Entidade de Domínio Product e Invariantes)* | https://github.com/evertonfoz/dsc-tests/issues/4 | `Ready` | `@evertonfoz` |
| `SUB-02` | `#5` (`SUB-02`) <br>`#6` (`SUB-03`) | `SUB-02 — [UC12][Contratos] Criar DTO de cadastro de produto` <br>`SUB-03 — [UC12][Validação] Implementar validações de dados e regras de negócio do produto` <br>*(Equivalente: [SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato)* | https://github.com/evertonfoz/dsc-tests/issues/5 <br>https://github.com/evertonfoz/dsc-tests/issues/6 | `Ready` <br>`Ready` | `@evertonfoz` |
| `SUB-03` | `#7` (`SUB-04`) | `SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` <br>*(Equivalente: [SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos)* | https://github.com/evertonfoz/dsc-tests/issues/7 | `In Review` *(Inicial: Backlog)* | `@evertonfoz` |
| `SUB-04` | `#8` (`SUB-05`) | `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` <br>*(Equivalente: [SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto)* | https://github.com/evertonfoz/dsc-tests/issues/8 | `In Progress` *(Inicial: Backlog)* | `@evertonfoz` |
| `SUB-05` | `#9` (`SUB-06`) | `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` <br>*(Equivalente: [SUB-05] Implementar o Controlador HTTP e Rota POST /products)* | https://github.com/evertonfoz/dsc-tests/issues/9 | `In Review` *(Inicial: Backlog)* | `@evertonfoz` |
| `SUB-06` | `#10` (`SUB-07`) | `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` <br>*(Equivalente: [SUB-06] Implementar Suíte Completa de Testes Automatizados)* | https://github.com/evertonfoz/dsc-tests/issues/10 | `In Progress` *(Inicial: Backlog)* | `@evertonfoz` |
| *(Complementar)* | `#11` (`SUB-08`) | `SUB-08 — [UC12][Documentação] Atualizar documentação técnica do cadastro de produtos` | https://github.com/evertonfoz/dsc-tests/issues/11 | `Backlog` | `@evertonfoz` |
| *(Complementar)* | `#16` (`SUB-09`) | `SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` | https://github.com/evertonfoz/dsc-tests/issues/16 | `In Progress` | `@evertonfoz` |

---

## 4. GitHub Project e Board Configurados
- **Nome do Projeto:** `CeliLac — UC12 Cadastrar Produto`
- **Número do Projeto:** `#6`
- **ID GraphQL:** `PVT_kwHOAJgJDc4Bp2af`
- **Link Direto para o GitHub Project (Board):** https://github.com/users/evertonfoz/projects/6
- **Colunas do Campo `Status` (5 estados metodológicos obrigatórios):**
  1. `Backlog` (`#1`, `#11`)
  2. `Ready` (`#4`, `#5`, `#6`)
  3. `In Progress` (`#8`, `#10`, `#16`)
  4. `In Review` (`#7`, `#9`)
  5. `Done`
- **Total de Itens Vinculados no Board:** 10 itens (`#1`, `#4`, `#5`, `#6`, `#7`, `#8`, `#9`, `#10`, `#11`, `#16`).

---

## 5. Relação de Labels no Repositório (`evertonfoz/dsc-tests`)

### 5.1 Labels Criadas Nesta Execução (Complemento do Artefato 07)
| Nome da Label | Cor (Hex) | Descrição | Status |
| :--- | :---: | :--- | :---: |
| `module:products` | `#0E8A16` | Associa o artefato ao módulo de Produtos do CeliLac | Criada via `gh label create` |
| `type:documentation` | `#0075CA` | Tarefas voltadas à especificação de APIs, OpenAPI/Swagger e documentação de arquitetura | Criada via `gh label create` |
| `layer:infrastructure` | `#D93F0B` | Acesso a dados, migrações SQL e repositórios ORM | Criada via `gh label create` |
| `layer:api` | `#1D76DB` | Controladores REST, rotas HTTP e documentação Swagger | Criada via `gh label create` |
| `priority:critical` | `#B60205` | Bloqueio essencial no caminho crítico | Criada via `gh label create` |

### 5.2 Labels Previamente Existentes e Reaproveitadas
| Nome da Label | Cor (Hex) | Descrição | Status |
| :--- | :---: | :--- | :---: |
| `uc12` | `#0E8A16` | Caso de Uso UC12 — Cadastrar Produto | Reaproveitada |
| `type:epic` | `#5319E7` | Issue principal (Epic) | Reaproveitada |
| `type:feature` | `#1D76DB` | Implementação de funcionalidade | Reaproveitada |
| `type:test` | `#FBCA04` | Implementação de testes automatizados | Reaproveitada |
| `type:docs` | `#0075CA` | Documentação técnica | Reaproveitada |
| `layer:domain` | `#C2E0C6` | Camada de Domínio | Reaproveitada |
| `layer:application` | `#BFDADC` | Camada de Aplicação / Contratos | Reaproveitada |
| `layer:persistence` | `#D4C5F9` | Camada de Persistência / Infraestrutura | Reaproveitada |
| `layer:http` | `#FEF2C0` | Camada de Interface HTTP | Reaproveitada |
| `layer:docs` | `#E6E6E6` | Camada de Documentação | Reaproveitada |
| `layer:tests` | `#F9D0C4` | Camada de Testes | Reaproveitada |
| `priority:high` | `#B60205` | Prioridade Alta | Reaproveitada |
| `priority:medium` | `#D93F0B` | Prioridade Média | Reaproveitada |
| `priority:low` | `#0E8A16` | Prioridade Baixa | Reaproveitada |

