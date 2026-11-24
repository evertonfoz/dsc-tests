# Relatório da Fase A — UC15 Alterar Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC15 — Alterar Produto |
| Fase | A — Planejar e publicar |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #147 (fase), Epic #141 |
| Branch | `feature/uc15-alterar-produto` |

## 1. Objetivo da fase
Publicar Epic, fatias e Project do UC15 e reconciliá-los com `docs/uc/uc15/state.yaml`.

## 2. O que foi feito
- UC15 especificado e aprovado pelo estudante: `prompts/uc-15/artefatos/03-uc-15-alterar-produto.md` — Executado nesta fase.
- Fontes, existência, descrição prévia, cobertura inicial e planejamento: `prompts/uc-15/artefatos/` (arquivos 00 a 05) — Executado nesta fase.
- ADR-006 (concorrência adiada) e ADR-007 (sem autenticação) — Executado nesta fase.
- Epic #141, 5 fatias (#142 a #146) e 6 issues de fase (#147 a #152) criadas, vinculadas ao Epic e adicionadas ao Project #6 — Executado nesta fase.
- Linha de base (antes de alterar código): `pnpm build` e `pnpm lint` passam (só avisos); `pnpm test` com 59 passando e 4 falhando, todas em `orders.services.spec.ts` (falhas conhecidas, ADR-001) — Executado nesta fase.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Issues e vínculos criados | Executado nesta fase | `../evidencias/A/publicacao.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Epic e Sub-Issues conferem com o state.yaml | `check-state.sh --remote` | pendente | aguardando o estudante |
| Project com os 5 estados e itens posicionados | listagem do Project #6 | pendente | aguardando o estudante |

## 5. Decisões e hipóteses
Corte em 5 fatias e 6 fases, no mesmo padrão do UC14. Hipótese a validar: o arquétipo `atualizar` é um esboço do método (`method/playbooks/matriz-arquetipos.md`).

## 6. Pendências e riscos
Os gates ainda não foram aprovados pelo estudante. Falhas de `orders` são anteriores ao UC15.

## 7. Tabela de cobertura (atualizada na Etapa 2, 2026-11-24)

Conferida por `grep` dos nomes nos arquivos de teste e por execução registrada em `../evidencias/B/` e `../evidencias/F/`. Siglas dos arquivos: **S** = `products.service.update.spec.ts`; **C** = `products.update.controller.spec.ts`; **P** = `typeorm-products.repository.postgres.spec.ts` (casos "UC15"); **E** = `test/products/alterar-produto.e2e-spec.ts`.

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal (RF01, CA01, CA03) | S "should change the name of the active product and return it (CA01)"; C "should return 200 with only productId and the new name, and persist it (CA01, CA02, CA03)"; P "should change only the name of the active product in the real database and keep the other rows (UC15, CA01, CA03, CA04)"; E "should return 200 with exactly productId and the new name and persist it (CA01, CA02, CA03)" | Coberto |
| Resposta com exatamente `productId` e `name` (RF05, RN06, CA02) | C e E (mesmos testes do fluxo principal, `toEqual` do corpo) | Coberto |
| Atributos não alterados permanecem; memória não duplica (RF06, RN01, CA04) | S "should keep productId, deletedAt and the other products unchanged, without duplicating (CA04)"; P (teste do fluxo principal, confere `deletedAt` nulo e a outra linha) | Coberto |
| FA01 — inexistente, `404` (RF03, CA05) | S "should throw ProductNotFoundException when the product does not exist (CA05)"; C "should return 404 in the domain error format when the product does not exist (CA05)"; E "should return 404 for a UUID without a product (CA05)" | Coberto |
| FA02 — removido, `404` e não alterado (RN02, CA06) | S "should throw ProductNotFoundException and not change a removed product (CA06)"; C "should return 404 for a removed product and leave it unchanged (CA06)"; P "should not alter a removed product in the real database and report it as not found (UC15, CA06)"; E "should return 404 for a soft-deleted product and not alter it (CA06)" | Coberto |
| FA03 — identificador inválido, `400` (RF02, RN04, CA07) | C "should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA07)"; E "should return 400 in the ValidationPipe format for a non-UUID id (CA07)" | Coberto |
| FA04 — nome inválido, `400`, nada gravado (RF04, RN03, RN05, CA08) | S "should reject a name that is %s without calling the repository (CA08)"; C "should return 400 in the ValidationPipe format for a name that is %s and keep the old name (CA08)"; E "should return 400 for a name that is %s and keep the old name in the database (CA08)" | Coberto |
| FA05 — campo não alterável ignorado (RN01) | C "should ignore productId and deletedAt sent in the body (CA04, FA05)"; E "should ignore productId and deletedAt in the body and keep the product active (CA04)" | Coberto |
| FA06 — mesmo valor, `200` (RN07, CA09) | S "should succeed when the new name equals the current one (CA09)"; C "should return 200 when the new name equals the current one (CA09)"; E (mesmo título) | Coberto |
| FE01 — falha ao gravar, `500` e sem alteração parcial (RF07, CA10) | S "should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA10)"; C "should return 500 with a generic message and no cause details (CA10)"; P "should report an incomplete update when the real database rejects it, leaving the name unchanged (UC15, CA10)" | Coberto |
| RN08 — duas alterações em sequência, vale a última (CA11) | S "should keep the name of the last of two sequential updates (CA11, RN08)"; P "should keep the last name after two sequential updates in the real database (UC15, CA11)"; E "should keep the last name after two sequential updates (CA11)" | Coberto |
| Repositório em memória não duplica nem altera removido | S (CA04 e CA06 acima) | Coberto |
| RF08 — UC12, UC13 e UC14 sem regressão (CA12) | `pnpm exec vitest run src/modules/products` (76 passam; specs do UC12 a UC14 sem diff); e2e dos UC12 a UC14 passam | Coberto (`../evidencias/F/regressao.txt`, `../evidencias/B/c1-c2-e2e.txt`) |
| CA13 — cada CA com teste e cenário `.http` | testes: acima; cenários em `http-rest-client/products/uc15-alterar-produto/` e `containerizado/05-…` | Parcial: os `.http` existem, mas **não foram executados** (gravam dados) |
| Verificação no contêiner (`run-checks.sh`) | checagens "Contrato UC15" acrescentadas ao script | Aguardando evidência (não executado: grava no banco de desenvolvimento; o CI roda o script no smoke do Compose) |
| Concorrência real (alterações simultâneas) | nenhum | Não implementado (ADR-006) |
| Autenticação e permissões | nenhum | Não implementado (ADR-007) |
