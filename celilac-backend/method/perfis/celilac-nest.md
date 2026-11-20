# Perfil de stack: `celilac-nest`

> Perfil **modelo** para projetos NestJS + TypeORM + PostgreSQL + Vitest + Docker Compose.
> Não é o `project-profile.md` do seu projeto: copie os comandos como **ponto de partida** e confirme cada um no seu `package.json` e no seu Compose.
> Valores marcados `<...>` vêm do seu projeto. Os do CeliLac estão em `project-profile.md` (raiz) e em `method/exemplos/`.

## Stack
Node.js (versão fixada no Dockerfile) · pnpm · NestJS · TypeORM (migrations) · PostgreSQL · Vitest (+ supertest) · oxlint · Prettier · Docker Compose.

## Comandos de referência
| Finalidade | Comando | Observação |
|---|---|---|
| Instalar | `pnpm install --frozen-lockfile` | falha se o lockfile estiver desatualizado: é proposital |
| Build | `pnpm build` | |
| Lint | `pnpm lint` | |
| Testes rápidos | `pnpm test` | não deve exigir banco |
| Integração (banco real) | `pnpm test:integration` | exige banco de **testes** e variável de proteção |
| E2E | `pnpm test:e2e` | deve usar o banco de **testes** (`TEST_DB_*`) mapeado para o app: ver Proteções |
| Subir | `docker compose up -d --build` | |
| Parar sem apagar dados | `docker compose stop` | |
| Migrations | `pnpm migration:show:prod` · `pnpm migration:run:prod` | rodam sobre `dist/`; exigem build |
| Verificação HTTP | `<caminho>/run-checks.sh` | criado na Fundação |
| Verificação local | `bash scripts/verify.sh` · `--completo` | mesmos passos do CI; `--completo` exige o banco de testes no ar |
| Links dos documentos | `node method/scripts/check-links.mjs` | regra 19 do `AGENTS.md` |

## Proteções
- Nunca usar na verificação: `docker compose down -v`, `volume rm`, `system prune`, `DROP`, `TRUNCATE`, `migration:revert`.
- Testes que apagam dados: somente contra o serviço de banco de **testes** e com `TEST_DB_ALLOW_DESTRUCTIVE=true` (ou equivalente do seu projeto), nunca contra o banco de desenvolvimento.
- **Isolamento:** testes que **gravam** dados (integração, E2E) usam o banco de testes, com três travas: variável de permissão (`TEST_DB_ALLOW_DESTRUCTIVE=true`), nome do banco terminado em `_test` e usuário/porta distintos dos de desenvolvimento. Mantenha um teste permanente que prove isso (no CeliLac: `test/database-isolation.e2e-spec.ts`).
- **Senhas em `compose.yaml`:** `${VAR:?mensagem}`, sem valor padrão; `.env.example` só com exemplos sem segredo.
- **Extensões do banco:** se uma tabela usa `uuid_generate_v4()`, uma migration deve criar `uuid-ossp`; verifique em banco novo, não só no seu.
- **Falhas conhecidas:** só com ADR, em lista única (`scripts/known-failures.env`), excluídas na linha de comando do CI e do `verify.sh`, nunca na configuração do Vitest.

## Fundação esperada neste perfil
Compose sem segredos · banco de testes isolado · migrations aplicáveis em banco novo · `scripts/verify.sh` · CI com qualidade, integração/E2E e *smoke* do Compose · validadores `check-state` e `check-links` · formulários de issue (fatia, fase) e modelo de PR. Narrativa e lições: `method/didatico/04-fundacao-do-projeto.md`.

## Estrutura de código esperada (referência)
```
src/modules/<modulo>/{controllers,dtos,entities,mappers,repositories,services}
src/infrastructure/persistence/<modulo>/   adaptador ORM
src/database/{data-source.ts,migrations/}
```
Contratos a preservar entre fases: entidade de domínio, interface do repositório e seu token de injeção, assinatura do serviço, DTO de entrada, DTO de resposta.
