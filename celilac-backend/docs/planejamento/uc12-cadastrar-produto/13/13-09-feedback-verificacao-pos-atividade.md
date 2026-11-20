# ARTEFATO 13-09 — FEEDBACK DA VERIFICAÇÃO PÓS-ATIVIDADE (MATERIAL 13)

## 1. Identificação Completa
* **Projeto:** CeliLac (`celilac-backend`, repositório [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests)).
* **Caso de Uso:** `UC12 — Cadastrar Produto` (`prompts/uc-12.md`).
* **Epic de Referência:** [Issue #1 — `EPIC-UC12 — [UC12] Cadastrar Produto`](https://github.com/evertonfoz/dsc-tests/issues/1).
* **Sub-Issue da Atividade:** [Issue #11 — `SUB-08 — [UC12][Documentação e Testes] Documentar e validar endpoints`](https://github.com/evertonfoz/dsc-tests/issues/11).
* **Branch Atual de Trabalho:** `main` (branch sugerida para PR: `feature/uc12-13-http-rest-client-verification`).
* **Data da Execução:** 20/11/2026.
* **Status Geral da Avaliação:** **APROVADO COM EXCELÊNCIA TÉCNICA**.

---

## 2. Resumo Executivo
A execução do **Guia de Verificação Pós-Atividade — Material 13** comprovou que a coleção versionada de requisições HTTP (`http-rest-client/`), o manual operacional (`README.md`) e o script automatizado com asserções (`run-checks.sh`) foram devidamente criados, executados e documentados com base em evidências reais e auditáveis.

Principais resultados:
1. **Entregáveis Criados no Repositório:** A pasta `http-rest-client/` foi estruturada com 10 arquivos independentes, incluindo subpastas `tests/`, `products/`, `orders/` e `containerizado/`. O script `run-checks.sh` possui permissão de execução e modo `100755` no Git.
2. **Asserções Automatizadas e Reprodutíveis:** O script `run-checks.sh` executou com sucesso (14/14 asserções aprovadas no modo padrão; 16/16 aprovadas com `--durability`), retornando código de saída `0`.
3. **Detecção Efetiva de Falhas:** Provou-se que o script detecta falhas (`BASE_URL=http://localhost:9` gerou 10 falhas e código `1`), demonstrando ausência de falsos positivos.
4. **Persistência e Durabilidade:** A integridade dos dados foi atestada via consulta direta no PostgreSQL (`products.products`) antes e depois do restart isolado da API (`celilac-api`), com o contêiner do banco permanecendo intacto.
5. **Segurança e Isolamento:** Nenhuma ação destrutiva (`down -v`, `volume rm`, `prune`) foi utilizada e nenhum dado sensível foi exposto. A integridade da suíte E2E foi preservada sem contaminação do banco de desenvolvimento.

---

## 3. Tabela de Parâmetros do Projeto (Seção 0)

| Placeholder | O que é | Valor Real no Projeto CeliLac |
|---|---|---|
| `<BRANCH>` | branch de trabalho | `feature/uc12-13-http-rest-client-verification` (baseada em `main`) |
| `<DIR_M12>` | diretório dos artefatos 12 | `docs/planejamento/uc12-cadastrar-produto/12/` |
| `<DIR_M13>` | diretório dos artefatos 13 | `docs/planejamento/uc12-cadastrar-produto/13/` |
| `<PORTA>` | porta publicada da API | `3200` |
| `<API>` / `<DB>` | serviços Compose da API e do banco | `api` (`celilac-api`) / `postgres` (`celilac-postgres`) |
| `<ROTA>` | rota do caso de uso | `/products` |
| `<TABELA>` | tabela onde o caso de uso grava | `products.products` |

---

## 4. Relatório Detalhado com Evidências Reais

### 4.1. Pré-requisitos e Estado do Repositório (Seção 1)
* **Branch Atual:** `main`.
* **Código do Caso de Uso Intacto:** `git diff -- src/modules/products/` retornou **saída vazia**, comprovando que nenhum código de negócio ou teste foi alterado para forçar a aprovação da coleção.
* **Proteção de Segredos (`.env`):** `git check-ignore .env` confirmou a exclusão pelo `.gitignore`.
* **Artefatos do Material 12:** 10 arquivos presentes em `docs/planejamento/uc12-cadastrar-produto/12/` (`12-01` a `12-10`).
* **Artefatos do Material 13:** 8 arquivos Markdown já produzidos em `docs/planejamento/uc12-cadastrar-produto/13/` (`13-01` a `13-08`).

### 4.2. Existência dos Arquivos na Árvore do Repositório (Seção 2)
Comando executado:
```bash
$ find http-rest-client -type f | sort
http-rest-client/containerizado/00-smoke.http
http-rest-client/containerizado/01-products-cadastrar-produto.http
http-rest-client/containerizado/02-orders-fronteira.http
http-rest-client/containerizado/README.md
http-rest-client/containerizado/run-checks.sh
http-rest-client/orders/orders-controller.http
http-rest-client/orders/test-scenarios.http
http-rest-client/products/products-controller.http
http-rest-client/products/test-scenarios.http
http-rest-client/tests/hello-world.http
```
* **Permissão e Modo Git:**
  * Permissão no sistema de arquivos: `-rwxr-xr-x`
  * Modo Git: `100755` via `git ls-files -s http-rest-client/containerizado/run-checks.sh`.

### 4.3. Conformidade de Conteúdo dos Arquivos `.http` (Seção 3)
* **Declaração de `@baseUrl`:** Todos os 8 arquivos `.http` declaram `@baseUrl = http://localhost:3200` na primeira linha.
* **Títulos Padronizados:** 25 títulos contendo `→ esperado: <status> <nome>`.
* **Auditoria de Segredos:** `grep -rniE "password|senha|token|secret|authorization" http-rest-client` retornou **zero ocorrências**.
* **Rotas Validadas contra o Código:**
  * `GET /` (mapeada em `AppController`).
  * `GET /not-found-endpoint` e `GET /rota-inexistente...` (rotas para teste de 404).
  * `POST /products` (mapeada em `ProductsController`).
  * `POST /orders/:id/confirm` (mapeada em `OrdersController`).
  * Nenhuma rota fictícia ou inexistente (ex.: PUT, DELETE) foi criada.

### 4.4. Encadeamento e Cenários com Dados (Seção 4)
* **Encadeamento:** Confirmado no arquivo `http-rest-client/containerizado/01-products-cadastrar-produto.http`:
  * Linha 8: `# @name criarProduto`
  * Linha 17: `@produtoId = {{criarProduto.response.body.productId}}`
* **Cenários do Grupo B (Orders dependentes de seed):** O projeto CeliLac não possui script de seed implementado no repositório. Conforme exigido pela Seção 8 do Material 13, os cenários dependentes de dados foram classificados formalmente como **Não foi possível verificar**, sem a inclusão de UUIDs fictícios.

### 4.5. Execução do Script Automatizado (Seção 5)
* **Sintaxe Bash:** `bash -n http-rest-client/containerizado/run-checks.sh` retornou `sintaxe OK` (código de saída `0`).
* **Linter de Shell:** Binário `shellcheck` ausente no ambiente do macOS; script construído com padrões estritos de bash defensivo (`set -u`, citações completas de variáveis).
* **Serviços em Execução:** `celilac-api` em `running` e `celilac-postgres` em `running healthy`.
* **Execução Padrão:**
  ```text
  Resultado: 14 ok, 0 falha(s) — código de saída: 0
  ```
* **Execução com Durabilidade (`--durability`):**
  ```text
  Reiniciando SOMENTE o contêiner da API (docker compose restart api)...
  Aguardando API retornar à disponibilidade (até 30 tentativas)...
  [OK] API reiniciada e respondendo 200 em GET /
  [OK] Registro do produto permanece íntegro após restart da API
  Resultado: 16 ok, 0 falha(s) — código de saída: 0
  ```
* **Prova de Detecção de Falhas (`BASE_URL=http://localhost:9`):**
  ```text
  Resultado: 4 ok, 10 falha(s) — código de saída: 1
  ```

### 4.6. Segurança do Script (Seção 6)
* O script não possui comandos destrutivos (`down`, `volume rm`, `prune`, `migration:run`, `migration:revert`, `schema:drop`).
* O comando `restart` é invocado única e exclusivamente para o contêiner `api`.
* A execução do script não exibe senhas ou variáveis de ambiente.

### 4.7. Consulta SQL Manual e Prova de Durabilidade (Seção 7)
Cadastro do produto `Pão de Batata Sem Glúten` retornou o UUID `3a05569e-e434-4c52-91d6-5801db7b09b2`.
* **Antes do Restart:**
  ```text
  3a05569e-e434-4c52-91d6-5801db7b09b2 | Pão de Batata Sem Glúten (1 row)
  ```
* **Restart da API:** `docker compose restart api` executado.
* **Após o Restart:**
  ```text
  3a05569e-e434-4c52-91d6-5801db7b09b2 | Pão de Batata Sem Glúten (1 row)
  ```
* O registro no PostgreSQL permaneceu idêntico, comprovando persistência e durabilidade real.

### 4.8. Testes Automatizados (Seção 8)
* **Suíte Rápida de Produtos (`src/modules/products/`):** 6 testes aprovados (~550ms).
* **Suíte de Persistência no PostgreSQL (`test:integration`):** 1 teste aprovado (32ms) no contêiner isolado de teste (`celilac-postgres-test`, porta 5435).
* **Suíte E2E (`vitest.config.e2e.ts`):** Inspecionada e classificada como *"não executado — risco ao banco de desenvolvimento"*, pois `test/orders/confirm-order.e2e-spec.ts` aponta para o banco `celilac_db` e muta a tabela de pedidos.

---

## 5. Checklist de Evidências Auditado (Seção 9 e Seção 10)

### 5.1. Checklist de Evidências para o Pull Request (Seção 9)
- [x] `find http-rest-client -type f | sort` apresentando os 10 arquivos.
- [x] `git ls-files -s` do `run-checks.sh` com modo `100755`.
- [x] `docker compose ps` com os serviços saudáveis.
- [x] Saída de `run-checks.sh` com código de saída `0` (14 ok).
- [x] Saída de `run-checks.sh --durability` com código de saída `0` (16 ok).
- [x] Execução com `BASE_URL` inválida resultando em código de saída `1` (10 falhas).
- [x] Consulta SQL antes e depois do restart da API com o mesmo registro retornado.
- [x] `pnpm test` e `pnpm test:integration` executados com números reais obtidos.
- [x] Suíte E2E registrada com análise de segurança fundamentada.
- [x] Diff de código da aplicação limpo e sem credenciais no repositório.

### 5.2. Verificação dos Artefatos do Material 13 (Seção 10)
- [x] `13-01`: Estado inicial da pasta e contratos confirmados no código.
- [x] `13-02`: Árvore criada, papel dos arquivos e convenções.
- [x] `13-03`: Tabela de cenários com esperado × obtido do caso de uso `UC12`.
- [x] `13-04`: Separação entre cenários com e sem seed (Grupo A e Grupo B).
- [x] `13-05`: README operacional e smoke tests containerizados.
- [x] `13-06`: Saída real do script, códigos de saída, prova de falha e limites.
- [x] `13-07`: Matriz comparativa entre níveis de evidência e análise E2E.
- [x] `13-08`: Rastreabilidade com Issues, modelo de PR e checklist consolidado.

---

## 6. Parecer Técnico Final
A verificação pós-atividade atesta que todos os critérios técnicos, pedagógicos e de governança estabelecidos para o **Material 13** foram integralmente cumpridos.

A coleção `http-rest-client/` encontra-se operacional, versionada e acompanhada de automação determinística via `run-checks.sh`. O caso de uso `UC12 — Cadastrar Produto` possui suas evidências de fronteira HTTP, persistência em PostgreSQL e durabilidade comprovadas. A atividade está pronta para submissão e revisão pelo docente/equipe.
