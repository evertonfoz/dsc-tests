# UC13 — Listar Produtos: índice da documentação

Ponto de entrada para quem chega ao UC13. Estado: **concluído** em 2026-11-23 (`docs/uc/uc13/state.yaml`). O que foi especificado está em `docs/planejamento/`; o que foi feito e provado está em `docs/uc/uc13/`.

## Em uma frase
`GET /products` lista os produtos **ativos** (soft delete com `deletedAt`), paginados (padrão 20, `limit` até 100), ordenados por nome (collation `pt-BR-x-icu`) e `productId`, devolvendo `{ items: [{ productId, name }], page, limit, total }`; lista vazia é sucesso.

## Por onde começar
| Quero… | Abra |
|---|---|
| Entender o que o UC exige | `docs/planejamento/uc13-listar-produtos/02-uc-listar-produtos.md` |
| Saber como a rota se comporta (status, erros, formato) | `docs/uc/uc13/contrato.md` |
| Ver o estado oficial (fases, fatias, issues, PR, gates) | `docs/uc/uc13/state.yaml` |
| Saber qual teste prova cada critério de aceite | `docs/uc/uc13/evidencias/F/cobertura.md` |
| Conferir a arquitetura | `docs/uc/uc13/evidencias/F/auditoria.md` |
| Ver o que sobrou pendente ou com ressalva | `docs/uc/uc13/relatorios/F.md` e `docs/uc/uc13/roteiro-conclusao-uc13.md` |

## Mapa completo
**Especificação (Etapa 1)** — `docs/planejamento/uc13-listar-produtos/`
- `00-uc-referencia.md`: UC de referência, entidade, campos retornados e destino dos artefatos.
- `01-existencia-do-uc.md`: busca que concluiu que o UC13 não existia.
- `02-uc-listar-produtos.md`: o UC em 13 seções, 13 critérios de aceite, rastreabilidade e respostas às perguntas.

**Estado, relatórios e evidências** — `docs/uc/uc13/`
- `state.yaml`, `contrato.md`, `roteiro-conclusao-uc13.md`.
- `relatorios/A.md` (planejamento e publicação), `relatorios/B-C.md` (fatias, HTTP, persistência, contrato e verificação) e `relatorios/F.md` (auditoria e encerramento).
- `evidencias/A` (publicação no GitHub), `evidencias/B` (RED e GREEN de cada fatia, collation), `evidencias/C` (HTTP, PostgreSQL, down e up da migration, E2E) e `evidencias/F` (cobertura, auditoria, contêiner, paridade de collation).

**Decisões**
- `docs/adr/ADR-005-soft-delete-de-produtos-uc13.md`: soft delete com `deletedAt`.
- `method/decisoes/ADR-005-pr-compartilhado-entre-fatias.md`: PR compartilhado entre fatias (exceção usada aqui).
- Herdadas do UC12 e ainda válidas: `docs/adr/ADR-002-validacao-de-preco-adiada-uc12.md` (preço fora de escopo), `docs/adr/ADR-003-mapeamento-http-dos-erros-de-produtos.md` e `docs/adr/ADR-004-contrato-de-erros-e-validacao-de-nome-uc12.md`.

**Código**
- Núcleo: `src/modules/products/services/products.service.ts`, `src/modules/products/entities/product.entity.ts`, `src/modules/products/entities/product-pagination.rules.ts`.
- HTTP: `src/modules/products/controllers/products.controller.ts`, `src/modules/products/dtos/list-products-query.dto.ts`, `src/modules/products/mappers/product-response.mapper.ts`.
- Persistência: `src/infrastructure/persistence/products/typeorm-products.repository.ts` e `src/database/migrations/1794342000000-AddDeletedAtToProducts.ts`.
- Testes: `src/modules/products/services/products.service.list.spec.ts`, `src/modules/products/controllers/products.list.controller.spec.ts` e `src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts`.

**Verificação executável**
- `http-rest-client/containerizado/03-products-listar-produtos.http` e as checagens do UC13 em `http-rest-client/containerizado/run-checks.sh`.

**No GitHub** (repositório `evertonfoz/dsc-tests`)
- Epic #104; Fase A #105; fatias F01 a F07 #106 a #112; Fases C1 #113, C2 #114, D #115, E #116 e F #117.
- PRs: #118 (implementação), #119 (Fase F e ajuste do método) e #120 (encerramento). Project #6.

## Ressalvas conhecidas
- Sete fatias entregues em um único PR, por decisão do estudante (ADR-005 do método).
- A F03 não teve RED; o GREEN da F05 teve uma tentativa falha registrada em `evidencias/B/`.
- Falhas de `orders` (ADR-001) seguem fora do escopo.
- Falha real de consulta no PostgreSQL (500) só foi testada com repositório simulado.
