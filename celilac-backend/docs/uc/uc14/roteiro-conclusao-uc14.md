# Roteiro de conclusão do UC14

> Nada abaixo foi executado pelo agente além do que consta como `Feito`. Merge, fechamento de issues e aprovação de gates são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Push da branch `feature/uc14-buscar-produto` | Feito (autorizado pelo estudante) |
| 2 | Abrir um PR único (fatias F01 a F05 e Fases C a F), citando #126 a #137 | Feito: PR #138, aberto para revisão |
| 3 | CI verde no PR (qualidade, integração/E2E, smoke do Compose, `run-checks.sh`) | Feito: 4 checks `pass` no PR #138 |
| 4 | Merge do PR (`pr_compartilhado: true` em F01 a F05, como no UC13) | Feito: merge `6963f1f` (autorizado pelo estudante) |
| 5 | Fechar #127 a #131 (fatias), com link para o PR e para `evidencias/B/` | Feito: #127 a #131 fechadas |
| 6 | Fechar #132 (Fase A), #133 e #134 (C), #135 (D), #136 (E) e #137 (F) | Feito: #132 a #137 fechadas |
| 7 | Fechar o Epic #126 | Feito: #126 fechado |
| 8 | Mover os itens do Project #6 para `Done` | Feito: itens do Project #6 em `Done` |
| 9 | Aprovar os gates das Fases B a F no `state.yaml`, atualizar `epic.estado` e `fase_atual: concluido`, e rodar `check-state.sh --remote` | Feito: gates aprovados por delegação expressa do estudante ("Pode fazer tudo") ou por CI; `fase_atual: concluido` |
| 10 | Atualizar `branch`, `pr` e `status: integrada` das fatias no `state.yaml` | Feito: fatias `integrada`, `pr: 138` |

Feito: todos os passos acima, em 2026-11-23.

## Provas disponíveis
- Cobertura: `docs/uc/uc14/evidencias/F/cobertura.md`.
- Auditoria: `docs/uc/uc14/evidencias/F/auditoria.md`.
- Regressão: `docs/uc/uc14/evidencias/F/regressao.txt`.
- Contêiner: `docs/uc/uc14/evidencias/E/run-checks.txt` (36 ok, 0 falha).
- RED e GREEN: `docs/uc/uc14/evidencias/B/`.
- CI na branch principal: **Aguardando evidência**.

## Ressalvas
- F03 e a Fase C2 não tiveram RED; foram validadas por mutação (`f03-red.txt`, `c2-red.txt`).
- CA09 parcial: sem `.http` para CA04 e CA06.
- Falhas conhecidas de `orders` (ADR-001), 4 unitárias e 1 e2e, e 17 avisos de lint anteriores ao UC14.
- Alterações no ambiente do estudante: `docker compose up -d --build api` (só a API recriada) e 2 `POST /products` de teste no banco de desenvolvimento pelo `run-checks.sh`. Nenhuma migration aplicada.

## Encerramento
UC14 concluído em 2026-11-23, por instrução expressa do estudante ("Pode fazer tudo"). PR #138 integrado em `6963f1f`; Epic #126 e issues #127 a #137 fechados. A branch `feature/uc14-buscar-produto` é removida depois deste encerramento. Registrado pelo agente; aprovações dos gates por delegação do estudante e por CI.
