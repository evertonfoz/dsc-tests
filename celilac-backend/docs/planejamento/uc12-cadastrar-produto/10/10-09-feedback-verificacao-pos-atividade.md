# ARTEFATO 10-09 — FEEDBACK E RELATÓRIO DA VERIFICAÇÃO PÓS-ATIVIDADE (MATERIAL 10)

## 1. Identificação da Verificação

| Elemento | Valor Verificado no Repositório |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`) |
| **Repositório** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (#1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue da Containerização** | [`SUB-09 — [UC12][Infraestrutura] Containerizar o backend NestJS e integrá-lo ao PostgreSQL via Docker Compose` (#16)](https://github.com/evertonfoz/dsc-tests/issues/16) |
| **Branch Auditada** | `main` (com commits sincronizados de `feature/uc12-09-backend-containerization`) |
| **Guia de Origem** | `prompts/10B-guia-verificacao-pos-atividade.md` |
| **Data da Verificação** | 20 de Novembro de 2026 |
| **Status da Avaliação** | **APROVADO COM EXCELÊNCIA** (Todas as verificações não destrutivas validadas com evidências reais) |

---

## 2. Resumo Executivo da Auditoria

A execução do roteiro de verificação pós-atividade comprovou que o ecossistema containerizado do backend NestJS com PostgreSQL e Docker Compose atende com rigor aos princípios de Engenharia de Software e aos critérios pedagógicos estabelecidos no Material 10:

1. **Determinismo e Imutabilidade da Imagem:** A imagem `celilac-api:dev` foi compilada via Dockerfile multi-stage com versões fixas do Node (`24.21.0-bookworm-slim`) e pnpm (`12.8.1`), gerando um artefato mínimo de ~166 MB sem ferramentas de desenvolvimento nem vazamento de credenciais.
2. **Preservação de Dados e Não Destrutividade:** Os serviços `postgres` (desenvolvimento) e `postgres_test` (testes isolados), juntamente com seus respectivos volumes persistentes, permaneceram intactos durante todo o procedimento.
3. **Comunicação Segura entre Contêineres:** A API conecta-se ao PostgreSQL exclusivamente pelo nome do serviço interno (`DB_HOST: postgres`, porta `5432`) através da rede gerenciada pelo Compose com healthcheck mandatório (`condition: service_healthy`).
4. **Idempotência de Migrations:** O histórico de migrations compiladas (`1 CreateOrders` e `6 CreateProductsTable`) foi auditado em modo de leitura via `migration:show:prod` sem disparar execuções redundantes.
5. **Comprovação Factual de Durabilidade:** A prova de persistência física foi demonstrada com a consulta SQL do registro `9b1d56e8-18ef-41b6-b5b4-f021f8ff767f` antes e após a reinicialização isolada da API (`docker compose restart api`), confirmando que os dados sobrevivem independentemente do ciclo de vida do contêiner da aplicação.
6. **Ausência de Regressões:** Todos os 7 testes pertinentes ao caso de uso `UC12` (1 de integração real com banco dedicado + 6 unitários e integrados em memória) foram executados e obtiveram 100% de aprovação.

---

## 3. Tabela de Mapeamento dos Parâmetros do Projeto

| Placeholder do Guia | Descrição | Valor Real Confirmado no Projeto |
| :--- | :--- | :--- |
| `<API>` | Nome do serviço da API no Compose | `api` |
| `<DB>` | Nome do serviço PostgreSQL dev | `postgres` |
| `<DB_TEST>` | Nome do serviço PostgreSQL testes | `postgres_test` |
| `<PORTA_HTTP>` | Porta HTTP publicada no host | `3200` |
| `<ROTA>` | Rota do caso de uso | `POST /products` |
| `<SCHEMA.TABELA>` | Tabela com schema qualificado | `products.products` |
| `<COLUNA_ID>` | Coluna identificadora do registro | `"productId"` |
| `<CONTAINER_TESTE>` | Contêiner do banco de testes | `celilac-postgres-test` |
| `<PROJETO_COMPOSE>` | Prefixo de rede e volumes | `celilac-backend` |
| `<BRANCH>` | Branch de trabalho | `feature/uc12-09-backend-containerization` |

---

## 4. Registro Estruturado das Evidências Reais

### 4.1 Pré-requisitos e Segurança
- **Branch e Git:** Confirmada branch de trabalho e ausência do `.env` no controle de versão (`git check-ignore .env` retornou `.env`).
- **Paridade de Configuração:** Executado `comm -3 <(grep -o '^[^=]*' .env | sort) <(grep -o '^[^=]*' .env.example | sort)` comprovando 100% de paridade entre as chaves declaradas (inclusive `COMPOSE_PROJECT_NAME`).
- **Versões do Ambiente:** Docker `29.4.0` e Docker Compose `v5.1.1`.

### 4.2 Compose e Compilação da Imagem
- **Validação Sintática Silenciosa:** `docker compose config --quiet && echo OK` retornou `OK` sem imprimir variáveis sensíveis.
- **Construção da Imagem:** `docker compose build api` concluiu com sucesso (`celilac-api:dev` / ID `c0aa8ce27a73`, ~166 MB).

### 4.3 Subida e Logs de Inicialização
- **Orquestração:** `docker compose up -d --build api` inicializou os contêineres na ordem correta, aguardando `celilac-postgres` tornar-se `healthy` antes de subir `celilac-api`.
- **Mapeamento de Rotas:** Os logs registraram o carregamento de `ProductsModule` e o mapeamento da rota `POST /products`:
  ```text
  celilac-api | LOG [RouterExplorer] Mapped {/products, POST} route +0ms
  celilac-api | Server is running on http://localhost:3200
  ```

### 4.4 Migrations em Modo Somente Leitura
- **Comando:** `docker compose run --rm --no-deps api pnpm migration:show:prod`.
- **Resultado:**
  ```text
  [X] 1 CreateOrders1792519198708
  [X] 6 CreateProductsTable1794255600000
  ```
  Zero pendências; nenhuma migration executada por mera formalidade.

### 4.5 Cadastro HTTP e Validação de Fronteira
- **Requisição Válida com Atributo Extra:**
  ```http
  POST http://localhost:3200/products
  Payload: {"name":"Biscoito de Polvilho","campoExtraIgnorado":"teste"}
  
  Status: HTTP/1.1 201 Created
  Body: {"productId":"9b1d56e8-18ef-41b6-b5b4-f021f8ff767f","name":"Biscoito de Polvilho"}
  ```
  *O campo `campoExtraIgnorado` foi sumariamente descartado pelo `ValidationPipe(whitelist: true)`.*
- **Requisição com Nome Vazio:**
  ```http
  POST http://localhost:3200/products
  Payload: {"name":""}
  
  Status: HTTP/1.1 400 Bad Request
  Body: {"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
  ```

### 4.6 Durabilidade e Persistência Física
- **SQL Antes do Restart:**
  ```sql
  SELECT * FROM products.products WHERE "productId" = '9b1d56e8-18ef-41b6-b5b4-f021f8ff767f';
  -- 1 row: (9b1d56e8-18ef-41b6-b5b4-f021f8ff767f | Biscoito de Polvilho)
  ```
- **Reinicialização:** `docker compose restart api` (banco de dados e volumes preservados).
- **SQL Após o Restart:**
  ```sql
  SELECT * FROM products.products WHERE "productId" = '9b1d56e8-18ef-41b6-b5b4-f021f8ff767f';
  -- 1 row: (9b1d56e8-18ef-41b6-b5b4-f021f8ff767f | Biscoito de Polvilho)
  ```
  *Comprovação inequívoca de persistência em volume Docker.*

### 4.7 Testes Automatizados
- **PostgreSQL Isolado (`pnpm test:integration`):** 1 teste executado e aprovado contra `celilac-postgres-test` na porta `5435`.
- **Suíte Rápida UC12:** 4 arquivos de teste e 6 testes unitários/integrados em memória aprovados.
- **Suítes E2E Legadas:** Documentadas como não executadas por segurança (risco de escrita não controlada no banco de desenvolvimento).

---

## 5. Checklist de Verificação Pós-Atividade Auditado

- [x] `docker compose config --quiet` retornou `OK`
- [x] Build da imagem da API concluído com tag `celilac-api:dev`
- [x] `docker compose ps` confirmou contêineres saudáveis e ativos
- [x] Logs da API registraram rota `POST /products` e porta 3200
- [x] Histórico de migrations comprovado com `[X]` em modo leitura
- [x] Cadastro HTTP retornou `201 Created` com `productId` gerado
- [x] Regras de validação (rejeição de nome vazio e whitelist) confirmadas
- [x] Registro consultado no PostgreSQL via SQL antes da reinicialização
- [x] Reinicialização restrita à API (`docker compose restart api`)
- [x] Registro idêntico confirmado no PostgreSQL após a reinicialização
- [x] Testes de integração PostgreSQL e unitários aprovados (7/7 no UC12)
- [x] Suítes legadas não executadas devidamente justificadas
- [x] Segurança de credenciais preservada (sem `.env` no Git)

---

## 6. Parecer Técnico e Conclusão

O ecossistema containerizado do caso de uso **UC12 — Cadastrar Produto** está **aprovado**, com evidências reais demonstradas e registradas. O ambiente é estável, determinístico e está pronto para revisão técnica por pares e preparação de Pull Request.
