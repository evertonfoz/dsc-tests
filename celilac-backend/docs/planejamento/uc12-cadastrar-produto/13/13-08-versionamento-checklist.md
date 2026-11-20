# ARTEFATO 13-08 — VERSIONAMENTO, GOVERNANÇA E CHECKLIST CONSOLIDADO

## 1. Planejamento, Rastreabilidade e Governança

* **Repositório:** `evertonfoz/dsc-tests` (`celilac-backend`).
* **Caso de Uso:** `UC12 — Cadastrar Produto` (`prompts/uc-12.md`).
* **Epic de Referência:** [Issue #1 — `EPIC-UC12 — [UC12] Cadastrar Produto`](https://github.com/evertonfoz/dsc-tests/issues/1).
* **Sub-Issue Técnica:** [Issue #11 — `SUB-08 — [UC12][Documentação e Testes] Documentar e validar endpoints`](https://github.com/evertonfoz/dsc-tests/issues/11).
* **Branch-Base:** `main` (após a integração formal do PR #19 e conclusão do Material 12).
* **Branch Sugerida de Trabalho:** `feature/uc12-13-http-rest-client-verification`.
* **GitHub Project:** [Project #6 (`CeliLac — UC12 Cadastrar Produto`)](https://github.com/users/evertonfoz/projects/6) — mantido no fluxo `In Progress` / `In Review`.

---

## 2. Inspeção de Alterações Antes do Commit

### 2.1. Arquivos de Código e Coleção no Repositório
```bash
find http-rest-client -type f | sort
```
Arquivos confirmados:
1. `http-rest-client/tests/hello-world.http`
2. `http-rest-client/products/products-controller.http`
3. `http-rest-client/products/test-scenarios.http`
4. `http-rest-client/orders/orders-controller.http`
5. `http-rest-client/orders/test-scenarios.http`
6. `http-rest-client/containerizado/README.md`
7. `http-rest-client/containerizado/00-smoke.http`
8. `http-rest-client/containerizado/01-products-cadastrar-produto.http`
9. `http-rest-client/containerizado/02-orders-fronteira.http`
10. `http-rest-client/containerizado/run-checks.sh`

### 2.2. Modo de Permissão Git do Script
```bash
git ls-files -s http-rest-client/containerizado/run-checks.sh
# 100755 565b8274c2975fdbad1259fcb22820f5f4b8f29f 0 http-rest-client/containerizado/run-checks.sh
```
* O modo `100755` foi confirmado, assegurando que o script mantém executabilidade direta em ambientes Unix/CI.

### 2.3. Auditoria de Segurança do Diff
* **Código-fonte da aplicação (`src/`):** Intacto (zero alterações para fazer a coleção passar).
* **Migrations (`src/database/migrations/`):** Nenhuma alteração.
* **Orquestração Compose (`compose.yaml`):** Nenhuma alteração.
* **Segredos e Credenciais:** Nenhum `.env`, token, senha ou dado sensível foi incluído nos arquivos `.http`, README ou no script.

---

## 3. Modelo de Pull Request Proposto

```markdown
### Título: test(uc12): adicionar coleção REST Client versionada e script automatizado de verificação da API

#### Problema / Contexto
Até o Material 12, as evidências HTTP eram registradas apenas descritivamente em Markdown ou por testes pontuais de console. Não existia no repositório uma coleção versionada de requisições `.http`, documentação operacional de pré-requisitos em contêiner e nem um script determinístico com asserções que comprovasse a integridade da API e do banco em tempo de execução.

#### O que foi feito
1. Estruturação completa da pasta `http-rest-client/`:
   - `tests/hello-world.http`: smoke tests de disponibilidade da raiz e rota 404.
   - `products/`: requisições do controller e cenários completos do UC12.
   - `orders/`: recurso de apoio separando Grupo A (fronteira) de Grupo B (dependente de seed).
   - `containerizado/`: suíte orientada ao Docker Compose com `README.md` detalhado e script `run-checks.sh`.
2. Criação do script `run-checks.sh`:
   - Valida serviços ativos (`running`/`healthy`), migrations pendentes (esperado 0), endpoints do caso de uso e persistência real no PostgreSQL.
   - Flag `--durability`: reinicia a API e confere se os dados persistem no banco.
   - Prova documental de falha em caso de indisponibilidade da API.
3. Produção dos 8 artefatos Markdown em `docs/planejamento/uc12-cadastrar-produto/13/`.

#### Como reproduzir e testar
```bash
# 1. Garantir API e Postgres em execução
docker compose up -d --build api

# 2. Executar script de verificação automatizada
./http-rest-client/containerizado/run-checks.sh

# 3. Executar com teste de durabilidade
./http-rest-client/containerizado/run-checks.sh --durability
```

#### Evidências Reais
- `run-checks.sh`: 14 ok, 0 falha(s) (código de saída: 0).
- `run-checks.sh --durability`: 16 ok, 0 falha(s) (código de saída: 0).
- `BASE_URL=http://localhost:9 run-checks.sh`: 4 ok, 10 falha(s) (código de saída: 1).
- Suíte rápida de produtos: 6 testes aprovados (~550ms).
- Suíte PostgreSQL: 1 teste aprovado (32ms).
- Lint: 0 erros.

#### Riscos e Pendências
- Suíte E2E não foi executada para evitar contaminação do banco de desenvolvimento (`celilac_db`).
- Cenários do Grupo B (Orders dependentes de seed) documentados como "Não foi possível verificar" devido à ausência de gerador de seed no projeto.
- PR submetido à revisão humana do corpo docente / revisor técnico.
```

---

## 4. Checklist Consolidado do Material 13 (Classificação Estrita)

### 4.1. Arquivos no Repositório
- [x] **`tests/hello-world.http` criado.** — **Confirmado** (Rotas `GET /` e `GET /not-found-endpoint`).
- [x] **`.http` do caso de uso (controller e cenários) criados.** — **Confirmado** (`products/products-controller.http` e `products/test-scenarios.http`).
- [x] **`.http` de apoio criados (ou Não aplicável).** — **Confirmado** (`orders/orders-controller.http` e `orders/test-scenarios.http`).
- [x] **`containerizado/README.md`, `00-smoke.http`, `01-...http`, `02-...http` criados.** — **Confirmado** (Estrutura e documentação completa presente em `http-rest-client/containerizado/`).
- [x] **`containerizado/run-checks.sh` criado e executável.** — **Confirmado** (Permissões `-rwxr-xr-x` / modo Git `100755`).

### 4.2. Conteúdo e Contratos
- [x] **Todos os `.http` usam `@baseUrl` e a porta confirmada.** — **Confirmado** (Porta `3200` padronizada em todos os arquivos).
- [x] **Cada requisição tem o esperado no título.** — **Confirmado** (Formato `### <descrição> → esperado: <status> <nome>`).
- [x] **Contrato real respeitado; nenhuma rota inexistente.** — **Confirmado** (Apenas rotas existentes derivadas de `src/`).
- [x] **Encadeamento `# @name` presente no arquivo containerizado do caso de uso.** — **Confirmado** (`# @name criarProduto` e captura `@produtoId`).
- [x] **IDs do Grupo B vêm do seed real, ou o cenário está marcado como não verificado.** — **Confirmado** (Marcado explicitamente como *Não foi possível verificar*, sem UUIDs fictícios).
- [x] **Nenhum segredo nos arquivos.** — **Confirmado** (Zero credenciais ou variáveis sensíveis expostas).

### 4.3. Execução e Asserções
- [x] **Requisições executadas e status obtidos registrados.** — **Confirmado** (Executadas via `curl -i` e registradas no Artefato 13-03 e 13-04).
- [x] **`bash -n` sem erros.** — **Confirmado** (Sintaxe bash válida, código de saída 0).
- [x] **`run-checks.sh` e `run-checks.sh --durability` executados; saída e código de saída registrados.** — **Confirmado** (14 ok e 16 ok respectivamente, código de saída 0).
- [x] **Falha detectada comprovada (código ≠ 0).** — **Confirmado** (Testado com `BASE_URL=http://localhost:9`, resultando em 10 falhas e código 1).
- [x] **Suítes de teste executadas com números obtidos; E2E tratada com segurança.** — **Confirmado** (6 testes unitários/integrados e 1 teste PostgreSQL aprovados; E2E preservada de forma justificada).

### 4.4. Segurança Operacional
- [x] **Nenhum `down -v`, remoção de volume ou `prune`.** — **Confirmado** (Políticas de segurança respeitadas integralmente).
- [x] **Somente a API foi reiniciada.** — **Confirmado** (`docker compose restart api` sem tocar no contêiner do Postgres).
- [x] **Nenhuma migration alterada ou executada pelo script.** — **Confirmado** (`migration:show:prod` utilizado exclusivamente em modo leitura).
- [x] **Banco de testes não utilizado pela coleção.** — **Confirmado** (Coleção isolada na base de desenvolvimento `celilac_db`).

### 4.5. Governança e GitHub
- [x] **Issue verificada · branch-base confirmada · diff inspecionado.** — **Confirmado** (Issue #1 / #11, branch-base `main`, diff auditado).
- [x] **PR elaborado · revisão humana registrada como pendente.** — **Confirmado** (Modelo de PR pronto; aguardando revisão humana do docente/equipe).
- [x] **Nenhum merge prematuro.** — **Confirmado** (Nenhum merge realizado de forma automática).
