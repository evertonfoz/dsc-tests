# project-profile.md — CeliLac (celilac-backend)

> Perfil real deste projeto. Itens `a confirmar` precisam de validação humana. Só nomes de variáveis, nunca valores.

## 1. Identidade
| Campo | Valor |
|---|---|
| Projeto | CeliLac (backend) |
| Repositório | `evertonfoz/dsc-tests` (raiz do git: `dsc-tests/`). Projeto de referência: **esta pasta** (`celilac-backend`) |
| Branch principal | `main` |
| GitHub Project | #6 — "CeliLac — UC12 Cadastrar Produto" (usuário `evertonfoz`) |
| Estados do GitHub Project | `Backlog`, `Ready`, `In Progress`, `In Review`, `Done` (campo `Status`) |
| Perfil de stack base | `method/perfis/celilac-nest.md` |

> **Papel das pastas (informado pelo professor em 2026-11-20; estado conferido no git):**
> - `celillac-backend-prepare/` — **laboratório**: onde o professor executou os materiais para estudar o processo. Os PRs #12–#19 e as issues #1–#16 do GitHub vieram dessa execução; o código do UC12 está versionado lá.
> - `celilac-backend/` — **projeto de referência** (esta pasta): onde o método é aplicado. Versiona documentos, prompts e o código base de `orders`. O módulo `products`, o `Dockerfile`, o `.dockerignore`, a coleção `.http` do UC12 e as alterações de `compose.yaml`, `package.json`, `main.ts`, `app.module.ts`, `data-source.ts` e `vitest.config.ts` existem **no disco, mas não commitados**.
> - Consequência: o histórico de issues/PRs do GitHub descreve a execução do laboratório; o `state.yaml` do piloto (Etapa 6) precisa dizer isso explicitamente.

## 2. Stack e versões
| Item | Valor | Origem |
|---|---|---|
| Runtime | Node 24.21.0 | Dockerfile |
| Gerenciador | pnpm 12.8.1 | Dockerfile |
| Framework | NestJS ^12 | package.json |
| ORM | TypeORM ^1.1.2 | package.json |
| Banco | PostgreSQL 17 | compose.yaml |
| Testes | Vitest ^4 + supertest | package.json |
| Lint / formatação | oxlint · Prettier | package.json |

## 3. Comandos
| Finalidade | Comando |
|---|---|
| Instalar | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Testes rápidos | `pnpm test` |
| Integração (banco real) | `pnpm test:integration` |
| E2E (banco de testes) | `pnpm test:e2e` (as falhas conhecidas aparecem localmente: ver Proteções) |
| Subir ambiente | `docker compose up -d --build` |
| Parar (sem apagar dados) | `docker compose stop` |
| Migrations | `pnpm migration:show:prod` / `pnpm migration:run:prod` |
| Verificação HTTP | `http-rest-client/containerizado/run-checks.sh` |
| Validar estado do UC | `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` |
| Validar links dos documentos | `node method/scripts/check-links.mjs` |
| Verificação local rápida | `bash scripts/verify.sh` |
| Verificação local completa (com banco de testes) | `bash scripts/verify.sh --completo` |

## 4. Infraestrutura
| Serviço | Container | Porta host → container | Volume |
|---|---|---|---|
| `postgres` (dev) | `celilac-postgres` | 5432 → 5432 | `celilac_postgres_data` |
| `postgres_test` | `celilac-postgres-test` | 5435 → 5432 (`TEST_DB_PORT`) | `celilac_postgres_test_data` |
| `api` | `celilac-api` | 3200 → 3200 (`PORT`) | — |

Schema/tabela do UC12: `products.products` (migration `1794255600000-CreateProductsTable.ts`).

## 5. Variáveis de ambiente (somente nomes)
`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `TEST_DB_HOST`, `TEST_DB_PORT`, `TEST_DB_USERNAME`, `TEST_DB_PASSWORD`, `TEST_DB_NAME`, `TEST_DB_ALLOW_DESTRUCTIVE`, `COMPOSE_PROJECT_NAME`, `PORT`. Exemplo versionado: `.env.example`; `.env` é ignorado pelo git.

## 6. Proteções
- Proibidos sem autorização explícita: `docker compose down -v`, `DROP`, `TRUNCATE`, `migration:revert`, `git push --force`, `git reset --hard`.
- Testes de persistência real só contra `postgres_test` e com `TEST_DB_ALLOW_DESTRUCTIVE=true` (verificado em `typeorm-products.repository.postgres.spec.ts`).
- Isolamento (Fundação): `pnpm test:integration` e `pnpm test:e2e` usam `postgres_test` (`TEST_DB_*`), com as travas `TEST_DB_ALLOW_DESTRUCTIVE=true`, nome terminado em `_test` e usuário/porta distintos do desenvolvimento. Guarda permanente: `test/database-isolation.e2e-spec.ts`.
- Senhas: `compose.yaml` exige as variáveis (`${VAR:?}`), sem valor padrão; `.env.example` traz só exemplos sem segredo.
- Migration `EnableUuidOssp` (`1792519198707`) garante a extensão em bancos novos.
- Falhas conhecidas (exercício didático de `orders`, ADR-001 em `docs/adr/`): 4 testes unitários em `orders.services.spec.ts` e 1 E2E em `confirm-order.e2e-spec.ts`. Lista única em `scripts/known-failures.env`; excluídas no CI e no `verify.sh`, e visíveis em `pnpm test` e `pnpm test:e2e` locais.
- CI: `.github/workflows/celilac-backend-ci.yml` (qualidade, integração/E2E, smoke do Compose). Modelos de issue (`fatia.yml`, `fase.yml`) e de PR em `.github/` na raiz do git.

## 7. Convenções
- Branch (a partir do UC13; **não renomear** os históricos do UC12, que usam `feature/uc12-NN-...`):
  - fatia (comportamento, ADR-003): `feature/<uc>-<fatia>-<resumo>` (ex.: `feature/uc13-f01-consulta-por-id`);
  - fase sem fatia (A, D, E, F): `docs/<uc>-fase-<letra>-<resumo>` ou `test/<uc>-fase-<letra>-<resumo>`;
  - fundação: `chore/<resumo>`.
- Commit: `<tipo>(<escopo>): <resumo> (refs #N)` — como já praticado (`feat(products): … (refs #8, refs #10)`).
- PR: título com UC e fatia; descrição com issue, critérios cobertos e evidência.

## 8. Equipe
| Pessoa | Papel | Observação |
|---|---|---|
| `evertonfoz` | autor e revisor | modo solo: papéis nomeados, sem personas fictícias; não conta como revisão independente |
