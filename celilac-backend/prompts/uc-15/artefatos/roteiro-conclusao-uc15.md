# Roteiro de conclusão — UC15 Alterar Produto

> Nada deste roteiro foi executado além do que consta como **Feito**. Merge e fechamento de Issues são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Aprovar os gates das Fases A, C, D, E e F (itens verificáveis) em `state.yaml` | Feito (2026-11-24, pelo estudante) |
| 2 | `run-checks.sh --durability` no contêiner reconstruído: 47 ok, 0 falha (`docs/uc/uc15/evidencias/E/run-checks.txt`) | Feito |
| 3 | Push da branch `feature/uc15-alterar-produto` | Feito |
| 4 | PR único #153 das fatias F01 a F05, C1, C2 e D | Feito |
| 5 | Conferir o CI do PR #153 (qualidade, integração e e2e, smoke do Compose e GitGuardian) | Feito (4 jobs com sucesso) |
| 6 | Merge do PR #153 (commit e138874; CI da `main` com sucesso) | Feito |
| 7 | Fechar #142 a #146 e #148 a #150 com link para o PR e para `docs/uc/uc15/evidencias/` | Feito |
| 8 | Fases E e F executadas (evidências em `docs/uc/uc15/evidencias/E/` e `F/`); fechar #151 e #152 | Feito |
| 9 | Fechar o Epic #141 e mover os itens do Project #6 para `Done` | Feito |
| 10 | Aprovar o gate da Fase B e o item de fechamento da Fase F, `fase_atual: concluido` e `check-state.sh --remote` | Feito (neste PR de encerramento) |

## Provas disponíveis
- Tabela de cobertura: `docs/uc/uc15/relatorios/A.md`, seção 7.
- Contrato: `docs/uc/uc15/contrato.md`.
- Evidências: `docs/uc/uc15/evidencias/B/` e `F/`.
- Verificação no contêiner: `docs/uc/uc15/evidencias/E/run-checks.txt`; CI: Aguardando evidência.

## Ressalvas
- Falhas conhecidas fora do escopo: 4 testes de `orders` no `pnpm test` e 1 no `pnpm test:e2e` (ADR-001).
- O arquétipo `atualizar` foi promovido de esboço a validado (UC15) em `method/playbooks/matriz-arquetipos.md`.
- Alterações no ambiente do estudante: API reconstruída e `run-checks.sh` executado no banco de desenvolvimento (2 produtos de teste criados e 1 renomeado), com autorização. O banco de testes (`celilac_test`) foi truncado e reutilizado pelos testes de integração, como previsto.

## Encerramento
Em 2026-11-24 o estudante autorizou o merge e a sequência ("Faça o merge e dê sequência"). O PR #153 foi integrado em e138874, o CI da `main` passou, as Issues #141 a #152 foram fechadas e o Project #6 foi movido para `Done`. O arquétipo `atualizar` foi promovido a validado (UC15) a pedido do estudante.
