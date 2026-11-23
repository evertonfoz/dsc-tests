# Cobertura do UC13 — item do UC → teste que prova

Fatos de 2026-11-23, nesta branch (`feature/uc13-fatias-nucleo`). "Aguardando evidência" = não executado nesta sessão.

| CA | Teste que prova (nome do `it`) | Arquivo | Situação |
|---|---|---|---|
| CA01, RN04 | `should list the active products with productId and name (CA01)` · `should return 200 with the page envelope and only productId and name per item (CA01, CA07)` | `products.service.list.spec.ts` · `products.list.controller.spec.ts` | Executado |
| CA02, RN03, FA01 | `should return an empty list with total 0 when there are no active products (CA02)` · `should return 200 with an empty page when there are no active products (CA02)` | idem | Executado (RED da F03 não falhou: ver `docs/uc/uc13/evidencias/B/f03-teste.txt`) |
| CA03, RN02 | `should paginate with default limit 20 and navigate pages without gaps (CA03, CA04)` · `should honor page and limit query parameters (CA03)` | idem | Executado |
| CA04 | `should paginate with default limit 20 …` · `should order by name then productId and paginate without gaps in the real database (CA04, CA08)` | service e `typeorm-products.repository.postgres.spec.ts` | Executado (PostgreSQL de testes) |
| CA05, RN01, RN06, FA02 | `should exclude soft-deleted products from the list and the total (CA05)` · `should list only active products with the real database, excluding soft-deleted ones from the total (CA05)` | service e postgres spec | Executado |
| CA06, FA03 | `should reject invalid pagination … (CA06)` · `should answer 400 in the single ValidationPipe format for ?… (CA06)` · `should map InvalidPaginationException to 400 in the same format (CA06)` | service e controller specs | Executado |
| CA07 | `should return 200 with the page envelope and only productId and name per item (CA01, CA07)` | controller spec | Executado |
| CA08, RN05 | `should order by name then productId deterministically (CA08)` · teste PostgreSQL de CA04/CA08 | service e postgres spec | Executado, inclusive ordem linguística (`should order names linguistically …`) no serviço e no PostgreSQL de testes (collation `en_US.utf8`, verificada em 2026-11-23); o resultado depende da collation do banco |
| CA09, FE01 | `should report a persistence failure on listing without leaking details (CA09)` · `should answer 500 with a generic message … (CA09)` | service e controller specs | Executado com repositório simulado; falha real de consulta no PostgreSQL **não** exercitada |
| CA10 | `should create new products as active (CA10)` | `products.service.list.spec.ts` | Executado; regressão do `POST /products`: `pnpm test` sem falhas novas (4 falhas conhecidas de `orders`, ADR-001) |
| CA11 | `should keep rows created without deletedAt active after the UC13 migration (CA11)` | postgres spec | Executado no PostgreSQL de testes, incluindo `should revert and reapply the UC13 migration, keeping existing products (CA11)` (down e up com `migration:revert` autorizado pelo estudante; saída em `docs/uc/uc13/evidencias/C/c2-reversibilidade.txt`) |
| CA12 | `should keep unknown routes returning 404 (CA12)` · checagens do `run-checks.sh` | controller spec | Executado em teste e no contêiner (`docs/uc/uc13/evidencias/F/run-checks.txt`: 30 ok, 0 falha) |
| CA13 | esta tabela | — | Cada CA acima nomeia um teste |
| RF07 | `should create new products as active (CA10)` + migration | — | Executado |

## Itens sem prova completa
- Fase E executada em 2026-11-23, com autorização do estudante: migration aplicada ao banco de desenvolvimento (`pnpm migration:run:prod`), API reconstruída da branch e `run-checks.sh --durability` com 30 ok e 0 falha (`docs/uc/uc13/evidencias/F/run-checks.txt`). O script grava produtos no banco de desenvolvimento via `POST /products`, como já fazia no UC12.
- Collation: a ordenação com caixa mista e acentos foi testada contra `en_US.utf8` (banco de testes). Um banco com outra collation pode ordenar diferente; o adaptador em memória usa `Intl.Collator('pt-BR')` como aproximação.
- Falha real de consulta no PostgreSQL (500): só exercitada com repositório simulado.
- `pnpm test`: 4 falhas conhecidas de `orders`; `pnpm test:e2e`: 1 falha conhecida de `orders` (ADR-001). Sem falhas novas.
