# 01 — O UC de busca de produto existe? (UC14)

Busca real feita em 2026-11-23, somente leitura.

| O que procurei | Onde | O que encontrei |
|---|---|---|
| Documento de UC de busca de produto | `prompts/`, `docs/`, `method/` (termos: buscar produto, `GET /products/:`, UC14) | Nenhum documento anterior. Só o `prompts/uc-14-buscar-produto.md`, criado nesta execução |
| Rota `@Get(':id')` em products | `src/modules/products`, `test/` | Nenhuma. O controller só tem `@Post()` e `@Get()` (listagem) |
| Métodos de leitura por identificador em products | `ProductsRepository`, `ProductsService` | Nenhum. O contrato tem apenas `save` e `findActivePage` |
| Indícios de busca em outro módulo | `src/modules/orders`, `src/scripts/verify-persistence.ts` | `findById`/`getById` existem em **orders** e em um script de verificação; fora do escopo (outra entidade) |
| Issues e Epic no GitHub | `gh issue list --state all` | Nenhum sobre buscar produto; último UC é o UC13 (#104 a #117, fechados) |
| Cenários `.http` de busca | `http-rest-client/products/`, `containerizado/` | Nenhum. Existem só `uc12-cadastrar-produto` e `uc13-listar-produtos` |

**Observação:** o `GET /products/:productId` hoje responde `404` (rota inexistente). Uma busca por `/products/<segmento>` em `run-checks.sh`, `test/` e `src/` não achou teste nem checagem que fixe esse contrato anterior; a Fase E reconfere ao atualizar o `run-checks.sh` (seção 4.4 do `uc-buscar.md`).

## Decisão

**Decisão A — Não existe.** O UC foi criado a partir do `REF` em `prompts/uc-14-buscar-produto.md`, aprovado pelo estudante em 2026-11-23.
