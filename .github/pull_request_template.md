## Issue
<!-- Use "Refs #N". Não use "Closes" em Epic nem em issue de fase: o fechamento é decisão humana (regra 14 do AGENTS.md). -->
Refs #

## Tipo
- [ ] Fatia (fase B)
- [ ] Fase do ciclo (A, C, D, E, F)
- [ ] Fundação (Camada 0)
- [ ] Outro (explique)

## O que muda
<!-- 2 a 5 linhas. O quê e por quê. -->

## Critérios de aceite cobertos
<!-- CA.. do caso de uso, ou itens do gate da fase. -->

## Evidências
<!-- Links para a execução do CI e/ou arquivos em docs/uc/<uc>/evidencias/. Não cole saídas inventadas: só o que foi executado. -->

## Checklist
- [ ] Commits referenciam a issue (`refs #N`); RED, GREEN e REFACTOR em commits separados (fatias)
- [ ] `pnpm lint`, `pnpm build` e `pnpm test` passam (ou as falhas conhecidas estão cobertas por ADR)
- [ ] `docs/uc/<uc>/state.yaml` atualizado e válido (`method/scripts/check-state.sh`)
- [ ] Links e caminhos dos documentos válidos (`node method/scripts/check-links.mjs`)
- [ ] Nenhum segredo, `.env` ou valor de senha no diff
- [ ] Decisões arquiteturais registradas em ADR (se houve)

## Ordem de integração
<!-- Base = main, salvo exceção justificada. Se este PR depende de outro (PR empilhado), diga qual e lembre: redirecione para main ANTES de apagar a branch base. -->

## Riscos e pendências
<!-- O que não foi provado, o que ficou aberto, quem decide. -->
