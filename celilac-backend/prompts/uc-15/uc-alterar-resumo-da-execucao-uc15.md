# Resumo da execução do UC15 — Alterar Produto

> Escrito para o estudante. Só fatos obtidos nesta execução (2026-11-24). **Situação:** Etapa 2 implementada localmente na branch `feature/uc15-alterar-produto`; nada foi publicado (sem push, PR ou merge) e nenhum gate foi aprovado.

## 1. Ponto de partida
O prompt `uc-alterar.md` pede um UC de alteração de uma entidade, reaproveitando o processo do UC12 e o padrão dos UC13 e UC14. A execução começou só com perguntas, como o prompt exige.

## 2. Decisões do estudante
`REF` = UC14 (`prompts/uc-14/uc-14-buscar-produto.md`); `ENTIDADE` = `Product`; `CHAVE` = `productId`; `ALTERAVEIS` = `name`; `CAMPOS` = `productId` e `name`; `ALVO` = UC15; ator público; `PUT /products/:productId`; identificador inválido `400`; inexistente e removido `404`; nome inválido `400` sem gravar; campo extra ignorado; mesmo valor `200`; resposta `200` com o produto; falha ao gravar `500` genérico; concorrência adiada (*last write wins*); operação própria no Repository. Autorizou versionar os artefatos, criar a estrutura de documentação, as Issues e iniciar a Etapa 2 ("Aprovo, pode criar tudo e iniciar a Etapa 2").

## 3. Etapa 1
Busca: nenhum `@Put`, `@Patch`, Issue ou especificação do UC15 (**Decisão A**). Achado: o `save` em memória acrescenta (duplicaria); o do TypeORM atualiza. Documentos em `prompts/uc-15/artefatos/` (00 a 05) e estrutura criada: `docs/planejamento/uc15-alterar-produto/`, `docs/uc/uc15/`, ADR-006 e ADR-007.

## 4. Planejamento no GitHub
Epic **#141**; fatias **#142 a #146** (F01 a F05); fases **#147 a #152** (A, C1, C2, D, E, F). Vinculadas ao Epic como sub-issues e adicionadas ao Project #6 (F01 em Ready, as demais em Backlog). `state.yaml` válido pelo `check-state.sh --remote`.

## 5. Etapa 2
- **Núcleo:** `updateActiveName` no contrato do Repository (aditivo), versão em memória e `ProductsService.updateProductName` com a regra do nome reaproveitada do cadastro.
- **HTTP:** `UpdateProductDto` e `PUT /products/:productId`.
- **Persistência:** `UPDATE` único com `deletedAt IS NULL` e `RETURNING`; sem migration.
- **Cenários `.http`:** `http-rest-client/products/uc15-alterar-produto/` e `containerizado/05-products-alterar-produto.http`; `run-checks.sh` e README atualizados; árvore da coleção atualizada.
- **Contrato:** `docs/uc/uc15/contrato.md`. **Auditoria:** `docs/uc/uc15/evidencias/F/auditoria.txt` (pureza arquitetural conferida).

## 6. Cobertura e decisões
Tabela em `docs/uc/uc15/relatorios/A.md` (seção 7): 13 itens *Coberto*, 1 *Parcial* (cenários `.http` não executados), 1 *Aguardando evidência* (`run-checks.sh`) e 2 *Não implementado* (ADR-006 concorrência, ADR-007 autenticação). Itens e nomes de teste conferidos por `grep`.

## 7. O que deu errado ou ficou diferente
- RED que não falhou em F02, F03 e F05: eu escrevi, no GREEN de F01, a tradução de "não encontrado" e de falha de persistência. Só F04 teve RED real.
- RED de C2: o teste de falha de persistência passou por acaso (o `TypeError` foi traduzido).
- Testes e2e escritos depois da implementação, sem RED.
- Duas Issues a mais que a proposta (11 em vez de 6), para seguir o padrão do UC14.
- Branch única e fatias commitadas juntas; nenhuma fatia está `integrada` no `state.yaml`.
- Um comando de limpeza inofensivo (`cp` de `/dev/null`) foi executado por engano durante a auditoria; não alterou nada.

## 8. Autorizações que afetaram o ambiente
Criação de 12 Issues e de um rótulo (`uc15`) no GitHub, inclusão no Project #6. Banco de **desenvolvimento**: não tocado. Banco de **testes** (`celilac_test`): usado e truncado pelos testes de integração e e2e. Nenhum merge, push, fechamento de Issue ou aprovação de gate.

## 9. Resultados verificados
`pnpm build` e `pnpm lint`: sem erros (avisos). `pnpm test`: 81 passam e 4 falham (`orders`, ADR-001; linha de base: 59 passam e 4 falham). `pnpm test:integration`: 19 passam. `pnpm test:e2e`: 21 passam e 1 falha (`orders`, ADR-001). Regressão dos testes de products: 76 passam, specs do UC12 a UC14 sem diff. Evidências em `docs/uc/uc15/evidencias/`.

## 10. Sem prova ainda (Aguardando evidência)
`run-checks.sh` com as checagens "Contrato UC15" e os cenários `.http` (gravam no banco de desenvolvimento; exigem reconstruir a API); CI no GitHub (nada foi enviado).

## 11. Além do prompt
Nada além do pedido.

## 12. Onde está tudo
Só **localmente**, na branch `feature/uc15-alterar-produto` (commits do UC15 sobre `docs/uc15-etapa1-especificacao`). No GitHub existem apenas as Issues #141 a #152 e o rótulo `uc15`. Pasta: `celilac-backend/`.

## 13. Pendente
Gates, `run-checks.sh`, push, PR, merge, fechamento de Issues e do Epic (roteiro em `prompts/uc-15/artefatos/roteiro-conclusao-uc15.md`); Fases E e F; promoção do arquétipo `atualizar` (esboço) a validado; outras entidades ou operações (remover, restaurar, alterar em lote) em novas execuções.
