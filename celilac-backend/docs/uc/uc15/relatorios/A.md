# Relatório da Fase A — UC15 Alterar Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC15 — Alterar Produto |
| Fase | A — Planejar e publicar |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #147 (fase), Epic #141 |
| Branch | `feature/uc15-alterar-produto` |

## 1. Objetivo da fase
Publicar Epic, fatias e Project do UC15 e reconciliá-los com `docs/uc/uc15/state.yaml`.

## 2. O que foi feito
- UC15 especificado e aprovado pelo estudante: `prompts/uc-15/artefatos/03-uc-15-alterar-produto.md` — Executado nesta fase.
- Fontes, existência, descrição prévia, cobertura inicial e planejamento: `prompts/uc-15/artefatos/00` a `05` — Executado nesta fase.
- ADR-006 (concorrência adiada) e ADR-007 (sem autenticação) — Executado nesta fase.
- Epic #141, 5 fatias (#142 a #146) e 6 issues de fase (#147 a #152) criadas, vinculadas ao Epic e adicionadas ao Project #6 — Executado nesta fase.
- Linha de base (antes de alterar código): `pnpm build` e `pnpm lint` passam (só avisos); `pnpm test` com 59 passando e 4 falhando, todas em `orders.services.spec.ts` (falhas conhecidas, ADR-001) — Executado nesta fase.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Issues e vínculos criados | Executado nesta fase | `../evidencias/A/publicacao.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Epic e Sub-Issues conferem com o state.yaml | `check-state.sh --remote` | pendente | aguardando o estudante |
| Project com os 5 estados e itens posicionados | listagem do Project #6 | pendente | aguardando o estudante |

## 5. Decisões e hipóteses
Corte em 5 fatias e 6 fases, no mesmo padrão do UC14. Hipótese a validar: o arquétipo `atualizar` é um esboço do método (`method/playbooks/matriz-arquetipos.md`).

## 6. Pendências e riscos
Os gates ainda não foram aprovados pelo estudante. Falhas de `orders` são anteriores ao UC15.
