# Roteiro de conclusão — UC15 Alterar Produto

> Nada deste roteiro foi executado além do que consta como **Feito**. Merge e fechamento de Issues são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Revisar e aprovar o gate da Fase A (`docs/uc/uc15/relatorios/A.md`, seção 4) | Pendente (estudante) |
| 2 | Autorizar a execução de `run-checks.sh` e dos cenários `.http` que gravam (banco de desenvolvimento; exige reconstruir a API com `docker compose up -d --build api`) | Pendente (estudante) |
| 3 | Fazer push da branch `feature/uc15-alterar-produto` | Pendente (estudante) |
| 4 | Abrir um PR único das fatias F01 a F05, C1, C2 e D (ou um por fatia) | Pendente (estudante) |
| 5 | Conferir o CI (`pnpm test:e2e` com as exclusões conhecidas e o smoke do Compose com `run-checks.sh --durability`) | Pendente (estudante) |
| 6 | Merge do PR | Pendente (estudante) |
| 7 | Fechar #142 a #146 e #148 a #150 com link para o PR e para `docs/uc/uc15/evidencias/` | Pendente (estudante) |
| 8 | Executar a Fase E (evidência do `run-checks.sh`) e a Fase F (auditoria) e fechar #151 e #152 | Pendente (estudante) |
| 9 | Fechar o Epic #141 e mover os itens do Project #6 para `Done` | Pendente (estudante) |
| 10 | Aprovar os gates no `state.yaml` e rodar `method/scripts/check-state.sh docs/uc/uc15/state.yaml --remote` | Pendente (estudante) |

## Provas disponíveis
- Tabela de cobertura: `docs/uc/uc15/relatorios/A.md`, seção 7.
- Contrato: `docs/uc/uc15/contrato.md`.
- Evidências: `docs/uc/uc15/evidencias/B/` e `F/`.
- Verificação no contêiner: **Aguardando evidência** (passo 2 ou CI).

## Ressalvas
- Falhas conhecidas fora do escopo: 4 testes de `orders` no `pnpm test` e 1 no `pnpm test:e2e` (ADR-001).
- O arquétipo `atualizar` do método continua **esboço**; este UC pode servir para promovê-lo, o que exige decisão do estudante (`method/playbooks/matriz-arquetipos.md`, seção 4).
- Alterações no ambiente do estudante: nenhuma no banco de desenvolvimento. O banco de testes (`celilac_test`) foi truncado e reutilizado pelos testes de integração, como previsto.

## Encerramento
Seção a acrescentar, com data, quando o estudante confirmar que o UC foi concluído.
