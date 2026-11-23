# Roteiro de conclusão do UC14

> Nada abaixo foi executado pelo agente além do que consta como `Feito`. Merge, fechamento de issues e aprovação de gates são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Push da branch `feature/uc14-buscar-produto` | Pendente (estudante) |
| 2 | Abrir um PR único (fatias F01 a F05 e Fases C a F), citando #126 a #137 | Pendente (estudante) |
| 3 | CI verde no PR (qualidade, integração/E2E, smoke do Compose, `run-checks.sh`) | Pendente (estudante) |
| 4 | Merge do PR (`pr_compartilhado: true` em F01 a F05, como no UC13) | Pendente (estudante) |
| 5 | Fechar #127 a #131 (fatias), com link para o PR e para `evidencias/B/` | Pendente (estudante) |
| 6 | Fechar #132 (Fase A), #133 e #134 (C), #135 (D), #136 (E) e #137 (F) | Pendente (estudante) |
| 7 | Fechar o Epic #126 | Pendente (estudante) |
| 8 | Mover os itens do Project #6 para `Done` | Pendente (estudante) |
| 9 | Aprovar os gates das Fases B a F no `state.yaml`, atualizar `epic.estado` e `fase_atual: concluido`, e rodar `check-state.sh --remote` | Pendente (estudante) |
| 10 | Atualizar `branch`, `pr` e `status: integrada` das fatias no `state.yaml` | Pendente (estudante) |

Feito até aqui: planejamento publicado (Fase A, gate aprovado por evertonfoz em 2026-11-23).

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
*(preencher com data só quando o estudante confirmar que o UC foi concluído.)*
