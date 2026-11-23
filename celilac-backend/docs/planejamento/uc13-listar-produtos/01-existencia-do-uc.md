# 01 — Existência do UC13 (3.1)

Busca somente leitura em 2026-11-23.

| O que procurei | Onde | O que encontrei |
|---|---|---|
| Documento de UC de listagem / UC13 | `prompts`, `docs`, `method`, `src`, `test` | Nenhum. Só exemplos e menções ao UC12 |
| Pastas `docs/uc/uc13`, `docs/planejamento/uc13-*` | `docs/` | Não existiam (só `uc12`) |
| `@Get(`, `findAll`, `list…(` | módulo e persistência de produtos, `test` | Nenhuma ocorrência; Repository só tem `save` |
| Issues "listar produto" / "UC13" | GitHub | Nenhuma |

**Evidências relevantes**
- `project-profile.md:71-72` cita `uc13` só como exemplo de branch.
- `GET /products` é hoje contrato de **404**, testado em `test/products/inventario-contrato.e2e-spec.ts:44` e `http-rest-client/containerizado/run-checks.sh:138`. Mudança deliberada, confirmada pelo estudante.
- Não há autenticação/autorização no código (`UseGuards`, `AuthGuard`, `jwt`, `Bearer`: sem ocorrências).

**Decisão A — Não existe.** UC criado em `02-uc-listar-produtos.md`.
