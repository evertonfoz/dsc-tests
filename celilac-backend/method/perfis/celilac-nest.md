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
| E2E | `pnpm test:e2e` | se o `AppModule` usar `DB_*`, conecta ao banco de desenvolvimento: ver Proteções |
| Subir | `docker compose up -d --build` | |
| Parar sem apagar dados | `docker compose stop` | |
| Migrations | `pnpm migration:show:prod` · `pnpm migration:run:prod` | rodam sobre `dist/`; exigem build |
| Verificação HTTP | `<caminho>/run-checks.sh` | criado na Fundação |

## Proteções
- Nunca usar na verificação: `docker compose down -v`, `volume rm`, `system prune`, `DROP`, `TRUNCATE`, `migration:revert`.
- Testes que apagam dados: somente contra o serviço de banco de **testes** e com `TEST_DB_ALLOW_DESTRUCTIVE=true` (ou equivalente do seu projeto), nunca contra o banco de desenvolvimento.
- **Isolamento:** testes que **gravam** dados (integração, E2E) devem usar o banco de testes. Se o E2E importar o `AppModule` com `DB_*`, ele usa o banco de desenvolvimento: registre isso no perfil do projeto e corrija na Fundação.
- Senhas em `compose.yaml`: preferir `${VAR:?mensagem}` (sem valor padrão) — melhoria prevista na Fundação.

## Estrutura de código esperada (referência)
```
src/modules/<modulo>/{controllers,dtos,entities,mappers,repositories,services}
src/infrastructure/persistence/<modulo>/   adaptador ORM
src/database/{data-source.ts,migrations/}
```
Contratos a preservar entre fases: entidade de domínio, interface do repositório e seu token de injeção, assinatura do serviço, DTO de entrada, DTO de resposta.
