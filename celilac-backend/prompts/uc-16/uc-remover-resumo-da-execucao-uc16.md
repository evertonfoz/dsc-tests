# Resumo da execução do UC16 — Remover Produto

> Escrito para o estudante. Só fatos obtidos nesta execução (2026-11-24). **Situação:** implementado na branch `feature/uc16-remover-produto` (push feito até a Fase E; a Fase F está commitada, sem push), **sem PR e sem merge**. Gates das fases B a F pendentes de aprovação do estudante; `fase_atual: B`.

## 1. Ponto de partida
O prompt `uc-remover.md` pede um UC de remoção de uma entidade, reaproveitando o processo do UC12 e o padrão dos UC13 a UC15. A execução começou só com perguntas, como o prompt exige.

## 2. Decisões do estudante
`REF` = UC15; `ENTIDADE` = `Product`; `CHAVE` = `productId`; `POLITICA` = remoção lógica; `MARCA` = `deletedAt` existente (ADR-005); `RESPOSTA` = `204` sem corpo; ator público (ADR-008); `DELETE /products/:productId` com corpo ignorado; identificador inválido `400`; inexistente e já removido `404` (o `deletedAt` original é preservado); falha ao gravar `500` genérico; remoções simultâneas: exatamente uma tem sucesso; fora do UC: restauração, remoção física e lote (ADR-009 a ADR-011). Autorizou versionar os artefatos, criar a estrutura, as Issues, iniciar a Etapa 2, escolher **PR único** (opção B), os pushes, o banco de testes, a reconstrução da API e a execução do `run-checks.sh` no banco de desenvolvimento.

## 3. Etapa 1
Busca: nenhuma rota `@Delete`, Issue ou especificação do UC16. Documentos em `prompts/uc-16/artefatos/` (00 a 05) e estrutura criada: `docs/planejamento/uc16-remover-produto/`, `docs/uc/uc16/`, ADR-008 a ADR-011. Fase A aprovada por você.

## 4. Planejamento no GitHub
Epic **#156**; fatias **#157 a #161** (F01 a F05); fases **#162 a #167** (A, C1, C2, D, E, F). Vinculadas ao Epic e ao Project #6. `check-state.sh --remote` passou na Fase A.

## 5. Etapa 2
- **Núcleo (F01 a F05):** `removeActive` no contrato do Repository (aditivo), versão em memória e `ProductsService.removeProduct`.
- **HTTP (C1):** `@Delete(':productId')` com `204`, reaproveitando o pipe de UUID e o filtro de domínio.
- **Persistência (C2):** `UPDATE ... SET "deletedAt" = now() WHERE "productId" = ... AND "deletedAt" IS NULL`; sem migration.
- **Contrato (D):** `docs/uc/uc16/contrato.md`.
- **Verificação (E):** `06-products-remover-produto.http`, `uc16-remover-produto/test-scenarios.http`, 14 checagens novas no `run-checks.sh` e README atualizado.
- **Auditoria e encerramento (F):** `docs/uc/uc16/evidencias/F/` e `relatorios/F.md`, com a comparação com o esboço `excluir`.

## 6. Cobertura e decisões
Tabela em `docs/uc/uc16/relatorios/A.md` (seção 4): 15 itens *Coberto* e 4 *Não implementado* (ADR-008 a ADR-011). Os 24 nomes de teste citados foram conferidos por `grep` (0 ausentes).

## 7. O que deu errado ou ficou diferente
- Uma fatia por PR quebraria o build (o adaptador real do TypeORM precisava implementar o novo contrato). Usei um método provisório que rejeita e você escolheu o PR único.
- F03 e F05 passaram sem RED, e foram registradas como caracterização. F02 e F04 tiveram RED real.
- Em C2, o teste de falha real de banco (CA11) passou antes do GREEN, porque o método provisório já rejeitava.
- O e2e e os `.http` foram escritos depois da implementação, sem RED.
- A primeira execução do `run-checks.sh` deu 58 ok e 1 falha por erro do meu script (comparei `t` com `true`); corrigi e reexecutei. Preservei as duas saídas.
- Descobri que a contagem de gravações do README do contêiner estava desatualizada (dizia dois `POST`; eram três antes e agora são quatro); corrigi.
- Falha de e2e de `orders` já existia sem o UC16 (confirmado com `git stash`).

## 8. Autorizações que afetaram o ambiente
Issues e rótulo `uc16` no GitHub e itens no Project #6. Push da branch. Banco de **testes** (`celilac_test`): usado e truncado pelos testes de integração e e2e. API reconstruída (`docker compose up -d --build api`, sem tocar no banco). Banco de **desenvolvimento**: duas execuções do `run-checks.sh` criaram 8 produtos de teste, renomearam 2 e removeram logicamente 2; consulta somente de leitura ao catálogo para chaves estrangeiras. Nenhuma remoção física.

## 9. Resultados verificados
`pnpm build` e `pnpm lint`: sem erros (avisos). `pnpm test`: 100 passam e 4 falham (`orders`, ADR-001; linha de base: 81 passam e 4 falham). `pnpm test:integration`: 24 passam. `pnpm test:e2e`: 25 passam e 1 falha (`orders`). `run-checks.sh --durability`: 59 ok, 0 falha. Regressão UC12 a UC15 nos testes de products e common: 98 passam. Evidências em `docs/uc/uc16/evidencias/`.

## 10. Sem prova ainda (Aguardando evidência)
CI (não há PR). Execução individual dos `.http`. Concorrência com duas requisições HTTP. Cenário `.http` para CA11 e CA12.

## 11. Além do prompt
Nada além do pedido. Proposta de promoção do arquétipo `excluir` registrada em `relatorios/F.md`, **sem editar o método**.

## 12. Onde está tudo
Branch `feature/uc16-remover-produto`, Issues #156 a #167, rótulo `uc16`, Project #6. Roteiro: `prompts/uc-16/artefatos/roteiro-conclusao-uc16.md`. Pasta: `celilac-backend/`.

## 13. Pendente
Enviar a Fase F, abrir o PR, conferir o CI, aprovar os gates, merge e fechamento (ver o roteiro). Decidir a promoção de `excluir`.
