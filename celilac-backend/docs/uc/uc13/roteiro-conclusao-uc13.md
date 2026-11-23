# Roteiro de conclusão do UC13

Estado em 2026-11-23. Decisões de merge e fechamento são do estudante; os itens marcados "feito" foram executados com autorização expressa.

| Passo | Ação | Situação |
|---|---|---|
| 1 | Merge do PR #118 (merge commit, preserva RED/GREEN) | Feito (7ea867d) |
| 2 | Fechar #105 a #116 com link para o PR e a evidência; mover os itens para `Done` no Project #6 | Feito |
| 3 | PR da Fase F (este documento, auditoria, refatoração das constantes, `state.yaml`) | Aberto para revisão |
| 4 | Revisar e fazer merge do PR da Fase F | Pendente (estudante) |
| 5 | Fechar #117 (Fase F) com link para o PR da Fase F | Pendente, após o passo 4 |
| 6 | Fechar o Epic #104 | Pendente (estudante), após o passo 5 |
| 7 | Mover os itens do Project #6 para `Done` | Pendente, junto com os fechamentos |
| 8 | Aprovar os gates das fases B a F no `state.yaml` e mudar `fase_atual` para `concluido` | Pendente (estudante ou CI) |

## Provas disponíveis
Cobertura item a item: `docs/uc/uc13/evidencias/F/cobertura.md`. Auditoria: `docs/uc/uc13/evidencias/F/auditoria.md`. Contêiner: `docs/uc/uc13/evidencias/F/run-checks.txt` (30 ok, 0 falha).

## Ressalvas
- Sete fatias entregues em um único PR (exceção da regra 11, decisão do estudante, registrada na ADR-005 do método).
- Falhas conhecidas de `orders` (ADR-001) seguem fora do escopo.
- Migration aplicada ao banco de desenvolvimento em 2026-11-23, com autorização.

## Encerramento (2026-11-23)
PR #119 integrado (ee4415b); #117 e o Epic #104 fechados com link para a evidência e movidos para `Done` no Project #6; gates das fases A a F aprovados no `state.yaml` por `evertonfoz` (autorização expressa do estudante) e por CI (checks verdes no `main`, `celilac-backend CI` em ee4415b); `fase_atual: concluido`.
