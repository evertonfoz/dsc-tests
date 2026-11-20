# ARTEFATO 10-08 — VERSIONAMENTO, CHECKLIST DE CONSISTÊNCIA E CONSOLIDAÇÃO

## 1. Relatório Consolidado dos 22 Itens Obrigatórios

| # | Tópico | Síntese Técnica e Evidências Comprovadas |
| :---: | :--- | :--- |
| **1** | **Projeto** | **CeliLac** — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`, repositório [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests)). |
| **2** | **Issue da Atividade** | [`SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` (Issue #16)](https://github.com/evertonfoz/dsc-tests/issues/16). |
| **3** | **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1). |
| **4** | **Branch de Trabalho** | `feature/uc12-09-backend-containerization`. |
| **5** | **Estado Inicial** | Preservados os artefatos do Material 09 (`docs/planejamento/uc12-cadastrar-produto/09/`), banco PostgreSQL em contêiner (`celilac-postgres`) e banco de testes (`celilac-postgres-test`). Inexistiam Dockerfile e serviço `api` na raiz de `celilac-backend`. |
| **6** | **Arquivos Verificados** | `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`, `src/main.ts`, `src/database/data-source.ts`, `src/database/migrations/1794255600000-CreateProductsTable.ts`, `.env`, `.env.example`, `compose.yaml`. |
| **7** | **Alterações Realizadas** | Criação do `Dockerfile` multi-stage, criação do `.dockerignore`, evolução de `compose.yaml` (inclusão do serviço `api`), documentação de `COMPOSE_PROJECT_NAME` em `.env.example` e configuração em `.env`. |
| **8** | **Imagem Docker** | Construída via `docker build -t celilac-api:dev .` com base em `node:24.21.0-bookworm-slim` e `pnpm@12.8.1`, gerando a imagem `celilac-api:dev` (ID `a6fa42a9ee3d`, tamanho ~166 MB). |
| **9** | **Docker Compose** | Configurado com o serviço `api` dependendo de `postgres` (`condition: service_healthy`), porta publicada `3200:3200`, volumes persistentes preservados. Validação: `docker compose config --quiet && echo OK` retornou `OK`. |
| **10** | **Variáveis e Rede** | Comunicação interna configurada com `DB_HOST=postgres`, `DB_PORT=5432`, `PORT=3200`. Separação estrita com o banco de testes (`celilac-postgres-test`, porta host `5435`). Nenhuma credencial exposta. |
| **11** | **Migrations** | Verificado histórico no contêiner com `docker compose run --rm api pnpm migration:show:prod`. Confirmadas as migrations `[X] 1 CreateOrders1792519198708` e `[X] 6 CreateProductsTable1794255600000`. Zero pendências; nenhuma migration executada desnecessariamente. |
| **12** | **Inicialização** | Executado `docker compose up -d api`. Logs do NestJS confirmaram injeção de dependências do `ProductsModule` e mapeamento da rota `{/products, POST}`. |
| **13** | **Operação HTTP** | Requisição `POST http://localhost:3200/products` com `{"name":"Produto de exemplo"}` retornou `201 Created` (`productId: "1c531e27-449a-40e0-8104-09daa975e9ea"`). Validação rejeitou nome vazio (`400 Bad Request`) e filtrou campos extras. |
| **14** | **PostgreSQL** | Consulta SQL direta em `celilac-postgres`: `SELECT * FROM products.products WHERE "productId" = '1c531e27-449a-40e0-8104-09daa975e9ea';` confirmou 1 registro persistido no schema `products`. |
| **15** | **Durabilidade** | Executado `docker compose restart api` (apenas contêiner da API reiniciado). Consulta SQL subsequente comprovou a integridade do mesmo registro persistido no volume `celilac_postgres_data`. |
| **16** | **Testes Automatizados** | `pnpm test:integration` aprovado com 100% de sucesso (`1 passed (1)`). Suíte rápida do UC12 aprovada com 100% de sucesso (`4 passed (4)` arquivos, `6 passed (6)` testes). Zero regressões no caso de uso. |
| **17** | **Commits Reais** | Commit de referência documentado: `8f83f6b` (`build(docker): containerize NestJS backend and integrate with Compose (refs #16, refs #1)`). |
| **18** | **Pull Request** | [Pull Request #17 (`https://github.com/evertonfoz/dsc-tests/pull/17`)](https://github.com/evertonfoz/dsc-tests/pull/17) (`feature/uc12-09-backend-containerization` → `origin/main`). Nenhum merge prematuro realizado. |
| **19** | **GitHub Project** | [Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6), mantendo a rastreabilidade das issues e revisões. |
| **20** | **Checklist** | Auditado e classificado integralmente na Seção 2 deste artefato. |
| **21** | **Pendências** | 1. Implementar regras de negócio adicionais de validação no domínio (`CA02`, `RN01` em `Product`/`ProductsService`).<br>2. Adicionar testes ponta a ponta (E2E) dedicados em ambiente de homologação containerizado.<br>3. Concluir documentação técnica final (`SUB-08` #11) e revisão por pares. |
| **22** | **Próximas Ações** | Submeter os artefatos de documentação para aprovação técnica da equipe e prosseguir para os módulos subsequentes do sistema. |

---

## 2. Checklist Consolidado de Consistência (Classificação Estrita)

### 2.1 Planejamento
- [x] **Oito Markdown do Material 09 analisados** — **Confirmado** (Lidos e recuperados de `docs/planejamento/uc12-cadastrar-produto/09/`).
- [x] **Issue de containerização e Epic verificadas** — **Confirmado** (Issue #16 e Epic #1 no repositório `evertonfoz/dsc-tests`).
- [x] **Branch confirmada** — **Confirmado** (`feature/uc12-09-backend-containerization`).
- [x] **Definition of Ready, WIP e dependências verificadas** — **Confirmado** (Escopo respeitado sem alterações de domínio).

### 2.2 Dockerfile e Imagem
- [x] **Dockerfile examinado (ou criado, com registro)** — **Confirmado** (Criado multi-stage na raiz do projeto).
- [x] **Versões de Node e pnpm confirmadas** — **Confirmado** (Node `24.21.0-bookworm-slim` e pnpm `12.8.1`).
- [x] **Lockfile validado** — **Confirmado** (`pnpm-lock.yaml` version 9.0 validado com `--frozen-lockfile`).
- [x] **Build multi-stage verificado** — **Confirmado** (Estágios `build` e `runtime` independentes).
- [x] **Entry point, DataSource e migrations compilados identificados** — **Confirmado** (`dist/main.js`, `dist/database/data-source.js`, `dist/database/migrations/*.js`).
- [x] **`.dockerignore` auditado** — **Confirmado** (Exclusão rigorosa de `.git`, `.env`, `node_modules`, `dist`).
- [x] **Imagem construída e identificada** — **Confirmado** (`celilac-api:dev` / ID `a6fa42a9ee3d`).

### 2.3 Compose e Rede
- [x] **Serviço da API confirmado (ou adicionado, com registro)** — **Confirmado** (Adicionado ao `compose.yaml`).
- [x] **Serviços PostgreSQL (dev e testes) e volumes preservados** — **Confirmado** (`celilac-postgres` e `celilac-postgres-test` intactos).
- [x] **Healthchecks verificados** — **Confirmado** (`pg_isready` no PostgreSQL com `condition: service_healthy` na API).
- [x] **Porta HTTP e porta interna do PostgreSQL confirmadas** — **Confirmado** (HTTP `3200`, PostgreSQL interno `5432`).
- [x] **`DB_HOST` apontando para o serviço do Compose** — **Confirmado** (`DB_HOST: postgres`).
- [x] **Credenciais verificadas sem exposição** — **Confirmado** (Nenhum segredo gravado em repositório).
- [x] **Configuração validada com `docker compose config --quiet`** — **Confirmado** (Código de saída `0`).

### 2.4 Migrations
- [x] **Scripts de migration confirmados** — **Confirmado** (`migration:show:prod` e `migration:run:prod` no `package.json`).
- [x] **Banco de destino confirmado** — **Confirmado** (`celilac_db` no serviço `postgres`).
- [x] **Histórico inspecionado e pendências identificadas** — **Confirmado** (`[X] 1` e `[X] 6` aplicadas; zero pendências).
- [x] **Migrations aplicadas somente quando necessárias** — **Confirmado** (Nenhuma execução desnecessária).
- [x] **Nenhuma operação destrutiva indevida realizada** — **Confirmado** (Nenhum volume deletado, sem `synchronize: true`).

### 2.5 Execução e Persistência
- [x] **API inicializada e PostgreSQL saudável** — **Confirmado** (`celilac-api` Up, `celilac-postgres` Up healthy).
- [x] **Logs inspecionados** — **Confirmado** (Módulos carregados e rotas mapeadas).
- [x] **Comunicação entre contêineres confirmada** — **Confirmado** (Conexão TypeORM estabelecida via rede bridge).
- [x] **Cadastro HTTP executado e resposta registrada** — **Confirmado** (`POST /products` retornou `201 Created`).
- [x] **Registro consultado no PostgreSQL** — **Confirmado** (Registro confirmado em `products.products`).
- [x] **API reiniciada e registro consultado novamente** — **Confirmado** (`docker compose restart api` executado).
- [x] **Durabilidade comprovada** — **Confirmado** (Registro idêntico retornado após reinício da API).

### 2.6 Testes
- [x] **Scripts de teste verificados** — **Confirmado** (`pnpm test` e `pnpm test:integration`).
- [x] **Testes aplicáveis executados com números obtidos agora** — **Confirmado** (7 testes do UC12 executados e aprovados).
- [x] **Banco de testes isolado** — **Confirmado** (`celilac_test` em porta `5435`).
- [x] **Suítes E2E legadas tratadas com segurança** — **Confirmado** (Não executadas contra o banco dev).
- [x] **Regressões investigadas** — **Confirmado** (Zero regressões no caso de uso `UC12`).

### 2.7 GitHub
- [x] **Alterações inspecionadas e segredos não versionados** — **Confirmado** (`.env` protegido).
- [x] **Commits reais identificados** — **Confirmado** (Commit `8f83f6b` e correlatos).
- [x] **PR existente verificado ou novo PR preparado** — **Confirmado** (PR #17).
- [x] **Evidências registradas e GitHub Project atualizado** — **Confirmado** (Documentação consolidada).
- [x] **Nenhum merge automático realizado** — **Confirmado** (PR mantido sem merge antecipado).
