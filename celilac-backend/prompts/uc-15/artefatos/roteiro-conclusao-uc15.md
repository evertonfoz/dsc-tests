# Roteiro de conclusão — UC15 Alterar Produto

> Nada deste roteiro foi executado além do que consta como **Feito**. Merge e fechamento de Issues são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Aprovar os gates das Fases A, C, D, E e F (itens verificáveis) em `state.yaml` | Feito (2026-11-24, pelo estudante) |
| 2 | `run-checks.sh --durability` no contêiner reconstruído: 47 ok, 0 falha (`docs/uc/uc15/evidencias/E/run-checks.txt`) | Feito |
| 3 | Push da branch `feature/uc15-alterar-produto` | Feito |
| 4 | PR único das fatias F01 a F05, C1, C2 e D | Aberto para revisão |
| 5 | Conferir o CI do PR #153 (qualidade, integração e e2e, smoke do Compose e GitGuardian) | Feito (4 jobs com sucesso) |
| 6 | Merge do PR | Pendente (estudante) |
| 7 | Fechar #142 a #146 e #148 a #150 com link para o PR e para `docs/uc/uc15/evidencias/` | Pendente (estudante) |
| 8 | Fases E e F executadas (evidências em `docs/uc/uc15/evidencias/E/` e `F/`); fechar #151 e #152 | Fechamento pendente (estudante) |
| 9 | Fechar o Epic #141 e mover os itens do Project #6 para `Done` | Pendente (estudante) |
| 10 | Depois do merge: aprovar o gate da Fase B e o item "Issues e Epic fechados" da Fase F, avançar `fase_atual` para `concluido` e rodar `method/scripts/check-state.sh docs/uc/uc15/state.yaml --remote` | Pendente (estudante) |

## Provas disponíveis
- Tabela de cobertura: `docs/uc/uc15/relatorios/A.md`, seção 7.
- Contrato: `docs/uc/uc15/contrato.md`.
- Evidências: `docs/uc/uc15/evidencias/B/` e `F/`.
- Verificação no contêiner: `docs/uc/uc15/evidencias/E/run-checks.txt`; CI: Aguardando evidência.

## Ressalvas
- Falhas conhecidas fora do escopo: 4 testes de `orders` no `pnpm test` e 1 no `pnpm test:e2e` (ADR-001).
- O arquétipo `atualizar` do método continua **esboço**; este UC pode servir para promovê-lo, o que exige decisão do estudante (`method/playbooks/matriz-arquetipos.md`, seção 4).
- Alterações no ambiente do estudante: API reconstruída e `run-checks.sh` executado no banco de desenvolvimento (2 produtos de teste criados e 1 renomeado), com autorização. O banco de testes (`celilac_test`) foi truncado e reutilizado pelos testes de integração, como previsto.

## Encerramento
Seção a acrescentar, com data, quando o estudante confirmar que o UC foi concluído.
