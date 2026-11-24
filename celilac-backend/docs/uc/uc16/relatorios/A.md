# Relatório da Fase A — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | A — Planejar e publicar |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #162 (fase), Epic #156 |
| Branch | `feature/uc16-remover-produto` (única, para documentação e implementação; antes chamada `docs/uc16-etapa1`, renomeada antes do push) | <!-- links:ignore -->

## 1. Objetivo da fase
Publicar Epic, fatias e Project do UC16 e reconciliá-los com `docs/uc/uc16/state.yaml`.

## 2. O que foi feito
- UC16 especificado e **aprovado pelo estudante** em 2026-11-24: `prompts/uc-16/artefatos/03-uc-16-remover-produto.md` — Executado nesta fase.
- Fontes, existência, descrição prévia, cobertura inicial e planejamento: `prompts/uc-16/artefatos/` (arquivos 00 a 05) — Executado nesta fase.
- Estrutura de documentação, `state.yaml` e ADR-008 a ADR-011 — Executado nesta fase.
- Linha de base antes de alterar código: `pnpm build` e `pnpm lint` passam (só avisos); `pnpm test` com 81 passando e 4 falhando, todas em `orders.services.spec.ts` (falhas conhecidas, ADR-001) — Executado nesta fase.
- Epic #156, 5 fatias (#157 a #161) e 6 issues de fase (#162 a #167) criadas, vinculadas ao Epic e adicionadas ao Project #6 (11 em `Backlog`, F01 em `Ready`) — Executado nesta fase.
- `check-state.sh --remote`: `OK (local + GitHub)` — Executado nesta fase.
- Opção B escolhida pelo estudante: **um PR único** para as fatias, com `pr_compartilhado`, mantendo cada commit com o build verde — Confirmado pelo estudante.
- **Ainda não feito:** PR (aguardando autorização) — Aguardando evidência.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Linha de base do ambiente | Executado nesta fase | `../evidencias/A/linha-de-base.txt` |
| 2 | Issues e vínculos criados | Executado nesta fase | `../evidencias/A/publicacao.txt` |

## 4. Tabela de cobertura

> Na Etapa 1 e no início da Etapa 2 não há testes do UC16. **Nenhuma linha pode ser *Coberto*** até existir um teste conferido no código e **executado**. Cada linha recebe o nome exato do teste e a situação só depois de rodar.
> Situações: *Coberto*, *Parcial* (diga o que falta), *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal: `204` sem corpo (RF01, RF04, RN09, CA01) | — | A implementar |
| Produto removido continua no banco com `deletedAt` e os mesmos `productId` e `name` (RN01, CA06) | — | A implementar |
| Busca responde `404` depois da remoção (RF05, RN03, CA02) | — | A implementar |
| Listagem não traz o produto e o total diminui em 1 (RF05, RN03, CA03) | — | A implementar |
| Alteração responde `404` e não altera (RF05, RN03, CA04) | — | A implementar |
| Só o produto alvo é afetado (RF07, RN06, CA05) | — | A implementar |
| FA01 — produto inexistente, `404` (RF03, RN02, CA07) | — | A implementar |
| FA02 — produto já removido, `404` e `deletedAt` preservado (RF03, RN07, CA08) | — | A implementar |
| FA03 — identificador inválido, `400` (RF02, RN04, CA09) | — | A implementar |
| FA04 — corpo ignorado (CA10) | — | A implementar |
| FE01 — falha ao gravar, `500` e produto continua ativo (RF06, RN05, CA11) | — | A implementar |
| RN08 — remoções simultâneas: um `204` e um `404` (CA12) | — | A implementar |
| Repositório em memória reproduz o banco (removido ou inexistente: nada removido; não duplica) | — | A implementar |
| RF08 — UC12 a UC15 sem regressão, exceto o efeito de RF05 (CA13) | — | A implementar |
| Autenticação e permissões | nenhum | **Não implementado (ADR-008)** |
| Restauração de produto removido | nenhum | **Não implementado (ADR-009)** |
| Remoção física (*purge*) de produtos já removidos | nenhum | **Não implementado (ADR-010)** |
| Remoção em lote | nenhum | **Não implementado (ADR-011)** |
| Dependências de outras entidades | — | A implementar (confirmar no banco que não há chave estrangeira para `products`) |

## 5. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Epic e Sub-Issues conferem com o state.yaml | `check-state.sh --remote` (OK, executado) | aprovado | evertonfoz (2026-11-24) |
| GitHub Project configurado com os 5 estados | listagem do Project (`docs/uc/uc16/evidencias/A/publicacao.txt`) | aprovado | evertonfoz (2026-11-24) |
