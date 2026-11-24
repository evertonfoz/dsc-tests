# Roteiro de conclusão — UC16 Remover Produto

> Nada deste roteiro foi executado além do que consta como **Feito**. Merge e fechamento de Issues são decisão do estudante.

## Passos

| Passo | Ação | Situação |
|---|---|---|
| 1 | Aprovar os gates das Fases B, C, D, E e F em `docs/uc/uc16/state.yaml` (hoje vazios ou pendentes; a A está aprovada) | Pendente (estudante) |
| 2 | `run-checks.sh --durability` no contêiner reconstruído: 59 ok, 0 falha (`docs/uc/uc16/evidencias/E/run-checks.txt`) | Feito |
| 3 | Push da branch `feature/uc16-remover-produto` | Feito (último push inclui a Fase E; a Fase F ainda não foi enviada) |
| 4 | Enviar os commits da Fase F e abrir **um PR único** das fatias F01 a F05, C1, C2, D, E e F (`pr_compartilhado`) | Pendente (estudante) |
| 5 | Conferir o CI do PR (qualidade, integração e e2e, smoke do Compose com `run-checks` e GitGuardian) | Pendente (estudante) |
| 6 | Merge do PR e conferência do CI da `main` | Pendente (estudante) |
| 7 | Preencher `pr`, `revisor` e `evidencias` das fatias no `state.yaml`, marcá-las `integrada` e fechar #157 a #161 e #163 a #167 com link para o PR e para `docs/uc/uc16/evidencias/` | Pendente (estudante) |
| 8 | Fechar o Epic #156 e mover os itens do Project #6 para `Done` | Pendente (estudante) |
| 9 | Aprovar o gate da Fase B, `fase_atual: concluido` e rodar `check-state.sh --remote` | Pendente (estudante) |
| 10 | Decidir sobre a proposta de promover `excluir` a validado em `method/playbooks/matriz-arquetipos.md` e no guia de decomposição (`relatorios/F.md`, seção 4) | Pendente (estudante) |

## Provas disponíveis
- Tabela de cobertura: `docs/uc/uc16/relatorios/A.md`, seção 4; conferência dos nomes em `docs/uc/uc16/evidencias/F/cobertura.md`.
- Contrato: `docs/uc/uc16/contrato.md`.
- Auditoria: `docs/uc/uc16/evidencias/F/auditoria.md` e `auditoria.txt`; dependências: `dependencias-fk.txt`.
- Verificação no contêiner: `docs/uc/uc16/evidencias/E/run-checks.txt`.
- CI: Aguardando evidência (não há PR).

## Ressalvas
- Falhas conhecidas fora do escopo: 4 testes de `orders` no `pnpm test` e 1 no `pnpm test:e2e` (ADR-001); já falhavam sem o UC16.
- Desvios: F03, F05 e o teste de "não duplica" são caracterização, sem RED real; o e2e e os cenários `.http` foram escritos depois da implementação; a primeira execução do `run-checks.sh` teve um erro do meu script, preservado em `evidencias/E/run-checks-1-erro-no-script.txt`.
- CA11 e CA12 não têm cenário `.http`; os `.http` não foram executados um a um.
- Alterações no ambiente do estudante: API reconstruída (`docker compose up -d --build api`) e duas execuções do `run-checks.sh` no banco de desenvolvimento, que criaram 8 produtos de teste (4 por execução), renomearam 2 e removeram logicamente 2 (registros que a API não desfaz). Consulta somente de leitura ao catálogo do banco de desenvolvimento para as chaves estrangeiras. O banco de testes (`celilac_test`) foi truncado e reutilizado pelos testes de integração e e2e.
- Issues criadas, movidas no Project e branch enviada ao remoto foram feitas com autorização do estudante ao longo da execução; PR, merge e fechamento não.

## Encerramento
Seção a ser acrescentada, com data, somente quando o estudante confirmar que o UC16 foi concluído.
