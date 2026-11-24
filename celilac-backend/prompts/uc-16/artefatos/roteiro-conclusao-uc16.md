# Roteiro de conclusão — UC16 Remover Produto

> Nada deste roteiro foi executado além do que consta como **Feito**. Merge e fechamento de Issues são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Aprovar os gates das Fases A a F em `docs/uc/uc16/state.yaml` | Feito (2026-11-24, em nome do estudante, por autorização expressa) |
| 2 | `run-checks.sh --durability` no contêiner reconstruído: 59 ok, 0 falha (`docs/uc/uc16/evidencias/E/run-checks.txt`) | Feito |
| 3 | Push da branch `feature/uc16-remover-produto` | Feito |
| 4 | Abrir **um PR único** (#168) das fatias F01 a F05 e das fases C1 a F (`pr_compartilhado`) | Feito |
| 5 | Conferir o CI do PR #168 (qualidade, integração e e2e, smoke do Compose e GitGuardian) | Feito (4 jobs com sucesso, commit d257609) |
| 6 | Merge do PR #168 (commit 84dc4a9; CI da `main` com sucesso, run 45460697698) | Feito |
| 7 | Preencher `pr`, `revisor` (modo solo) e `evidencias` das fatias, marcá-las `integrada` e fechar #157 a #167 com link para o PR e para `docs/uc/uc16/evidencias/` | Feito |
| 8 | Fechar o Epic #156 e mover os itens do Project #6 para `Done` | Feito |
| 9 | `fase_atual: concluido` e `check-state.sh --remote` | Feito (neste PR de encerramento) |
| 10 | Decidir sobre a proposta de promover `excluir` a validado em `method/playbooks/matriz-arquetipos.md` e no guia de decomposição (`relatorios/F.md`, seção 4) | Pendente (estudante) |

## Provas disponíveis
- Tabela de cobertura: `docs/uc/uc16/relatorios/A.md`, seção 4; conferência dos nomes em `docs/uc/uc16/evidencias/F/cobertura.md`.
- Contrato: `docs/uc/uc16/contrato.md`.
- Auditoria: `docs/uc/uc16/evidencias/F/auditoria.md` e `auditoria.txt`; dependências: `dependencias-fk.txt`.
- Verificação no contêiner: `docs/uc/uc16/evidencias/E/run-checks.txt`.
- CI: PR #168 com 4 jobs com sucesso (run 45460324032) e `main` com sucesso (run 45460697698).

## Ressalvas
- Falhas conhecidas fora do escopo: 4 testes de `orders` no `pnpm test` e 1 no `pnpm test:e2e` (ADR-001); já falhavam sem o UC16.
- Desvios: F03, F05 e o teste de "não duplica" são caracterização, sem RED real; o e2e e os cenários `.http` foram escritos depois da implementação; a primeira execução do `run-checks.sh` teve um erro do meu script, preservado em `evidencias/E/run-checks-1-erro-no-script.txt`.
- CA11 e CA12 não têm cenário `.http`; os `.http` não foram executados um a um.
- Alterações no ambiente do estudante: API reconstruída (`docker compose up -d --build api`) e duas execuções do `run-checks.sh` no banco de desenvolvimento, que criaram 8 produtos de teste (4 por execução), renomearam 2 e removeram logicamente 2 (registros que a API não desfaz). Consulta somente de leitura ao catálogo do banco de desenvolvimento para as chaves estrangeiras. O banco de testes (`celilac_test`) foi truncado e reutilizado pelos testes de integração e e2e.
- Issues criadas, movidas no Project, branch enviada, PR #168, merge (84dc4a9) e fechamento de #156 a #167 foram feitos com autorização do estudante. Os gates foram aprovados em nome do estudante por essa autorização. A promoção do arquétipo `excluir` não foi feita.

## Encerramento
Em 2026-11-24 o estudante autorizou o merge e o fechamento ("Autorizo o merge e o fechamento, siga o roteiro"). O PR #168 foi integrado em 84dc4a9, o CI da `main` passou, as Issues #156 a #167 foram fechadas e o Project #6 foi movido para `Done`. O arquétipo `excluir` continua como esboço até decisão do estudante.
