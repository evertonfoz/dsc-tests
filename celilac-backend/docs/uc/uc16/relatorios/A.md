# Relatório da Fase A — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | A — Planejar e publicar |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #162 (fase), Epic #156 |
| Branch | `feature/uc16-remover-produto` (única, para documentação e implementação; antes chamada `docs/uc16-etapa1`, renomeada antes do push) | <!-- links:ignore -->

## 1. Objetivo da fase
Publicar Epic, fatias e Project do UC16 e reconciliá-los com `docs/uc/uc16/state.yaml`.

## 2. O que foi feito
- UC16 especificado e **aprovado pelo estudante** em 2026-11-24: `prompts/uc-16/artefatos/03-uc-16-remover-produto.md` — Executado nesta fase.
- Fontes, existência, descrição prévia, cobertura inicial e planejamento: `prompts/uc-16/artefatos/` (arquivos 00 a 05) — Executado nesta fase.
- Estrutura de documentação, `state.yaml` e ADR-008 a ADR-011 — Executado nesta fase.
- Linha de base antes de alterar código: `pnpm build` e `pnpm lint` passam (só avisos); `pnpm test` com 81 passando e 4 falhando, todas em `orders.services.spec.ts` (falhas conhecidas, ADR-001) — Executado nesta fase.
- Epic #156, 5 fatias (#157 a #161) e 6 issues de fase (#162 a #167) criadas, vinculadas ao Epic e adicionadas ao Project #6 (11 em `Backlog`, F01 em `Ready`) — Executado nesta fase.
- `check-state.sh --remote`: `OK (local + GitHub)` — Executado nesta fase.
- Opção B escolhida pelo estudante: **um PR único** para as fatias, com `pr_compartilhado`, mantendo cada commit com o build verde — Confirmado pelo estudante.
- **Ainda não feito:** PR (aguardando autorização) — Aguardando evidência.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Linha de base do ambiente | Executado nesta fase | `../evidencias/A/linha-de-base.txt` |
| 2 | Issues e vínculos criados | Executado nesta fase | `../evidencias/A/publicacao.txt` |

## 4. Tabela de cobertura

> Na Etapa 1 e no início da Etapa 2 não há testes do UC16. **Nenhuma linha pode ser *Coberto*** até existir um teste conferido no código e **executado**. Cada linha recebe o nome exato do teste e a situação só depois de rodar.
> Situações: *Coberto*, *Parcial* (diga o que falta), *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal: `204` sem corpo (RF01, RF04, RN09, CA01) | `should remove the active product and resolve without a body (CA01, RN09)` e `should leave the removed product out of the active products of the repository (CA01, RN01)` (`products.service.remove.spec.ts`) | Coberto: HTTP em memória e e2e no banco de testes
| Produto removido continua no banco com `deletedAt` e os mesmos `productId` e `name` (RN01, CA06) | `should mark only the target row with deletedAt and keep productId, name and the other rows (UC16, CA05, CA06, RN01)` (`typeorm-products.repository.postgres.spec.ts`) | Coberto no banco de testes |
| Busca responde `404` depois da remoção (RF05, RN03, CA02) | `should throw ProductNotFoundException when getting the removed product (CA02, RN03)` (`products.service.remove.spec.ts`; caracterização) e `should return 204 without a body, keep the row with deletedAt and hide it from get, list and update (CA01 a CA04, CA06)` (`remover-produto.e2e-spec.ts`, banco de testes) | Coberto: núcleo, HTTP (`remover-produto.e2e-spec.ts`) e banco de testes |
| Listagem não traz o produto e o total diminui em 1 (RF05, RN03, CA03) | `should leave the removed product out of the listing and decrease the total by one (CA03, RN03)` (`products.service.remove.spec.ts`; caracterização) e `should return 204 without a body, keep the row with deletedAt and hide it from get, list and update (CA01 a CA04, CA06)` (`remover-produto.e2e-spec.ts`, banco de testes) | Coberto: núcleo, HTTP (`remover-produto.e2e-spec.ts`) e banco de testes |
| Alteração responde `404` e não altera (RF05, RN03, CA04) | `should throw ProductNotFoundException when updating the removed product (CA04, RN03)` (`products.service.remove.spec.ts`; caracterização) e `should return 204 without a body, keep the row with deletedAt and hide it from get, list and update (CA01 a CA04, CA06)` (`remover-produto.e2e-spec.ts`, banco de testes) | Coberto: núcleo, HTTP (`remover-produto.e2e-spec.ts`) e banco de testes |
| Só o produto alvo é afetado (RF07, RN06, CA05) | `should mark only the target row with deletedAt and keep productId, name and the other rows (UC16, CA05, CA06, RN01)` (banco de testes), `should keep the other products active and unchanged (CA05, RN06)` e `should not remove any other product when the identifier does not exist (CA07, RN05)` (`products.service.remove.spec.ts`) | Coberto no núcleo e no banco de testes |
| FA01 — produto inexistente, `404` (RF03, RN02, CA07) | `should throw ProductNotFoundException when there is no product with the identifier (CA07, FA01)` e `should not remove any other product when the identifier does not exist (CA07, RN05)` (`products.service.remove.spec.ts`) | Coberto: núcleo, HTTP (`should return 404 in the domain error format when the product does not exist (CA07, FA01)`, `products.remove.controller.spec.ts`) e banco de testes (`should report not found and change nothing when the productId does not exist (UC16, CA07)`) |
| FA02 — produto já removido, `404` e `deletedAt` preservado (RF03, RN07, CA08) | `should throw ProductNotFoundException when the product was already removed (CA08, FA02)` e `should throw ProductNotFoundException when removing the same product twice (CA08, RN07)` (`products.service.remove.spec.ts`; teste de caracterização, sem RED real) | **Coberto:** `should report not found and keep the original deletedAt when the product was already removed (UC16, CA08, RN07)` (`typeorm-products.repository.postgres.spec.ts`) prova o `deletedAt` preservado no banco; o `404` no núcleo e o `404` HTTP (`should return 404 for an already removed product and keep its deletedAt (CA08, FA02)`, `products.remove.controller.spec.ts`) estão cobertos |
| FA03 — identificador inválido, `400` (RF02, RN04, CA09) | `should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA09, FA03)` (`products.remove.controller.spec.ts`) | Coberto na fronteira HTTP |
| FA04 — corpo ignorado (CA10) | `should ignore any body sent with the request (CA10, FA04)` (`products.remove.controller.spec.ts`) | Coberto na fronteira HTTP |
| FE01 — falha ao gravar, `500` e produto continua ativo (RF06, RN05, CA11) | `should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA11, FE01)` e `should keep the product active when the repository fails (CA11, RN05)` (`products.service.remove.spec.ts`) | **Coberto:** a tradução da falha no núcleo está coberta; `should return 500 with a generic message and no cause details (CA11, FE01)` (`products.remove.controller.spec.ts`) cobre o `500` HTTP; `should report an incomplete removal when the real database rejects it, without leaking details (UC16, CA11, FE01)` (`typeorm-products.repository.postgres.spec.ts`) prova no banco de testes que nada é removido. Caracterização, sem RED real, no banco |
| RN08 — remoções simultâneas: um `204` e um `404` (CA12) | `should let exactly one of two simultaneous removals succeed and keep a single deletedAt (UC16, CA12, RN08)` (`typeorm-products.repository.postgres.spec.ts`) | Coberto no banco de testes (nível de serviço; o `204`/`404` HTTP simultâneo não foi testado) |
| Repositório em memória reproduz o banco (removido ou inexistente: nada removido; não duplica) | `should keep a single record with the same productId and name and a deletedAt, without duplicating (CA06, RN01)`, `should throw ProductNotFoundException when the product was already removed (CA08, FA02)` e `should not remove any other product when the identifier does not exist (CA07, RN05)` (`products.service.remove.spec.ts`), com os equivalentes no PostgreSQL de testes | Coberto (paridade por testes equivalentes nos dois adaptadores; o `deletedAt` vem do relógio da aplicação em memória e do `now()` do banco, sem teste de igualdade) |
| RF08 — UC12 a UC15 sem regressão, exceto o efeito de RF05 (CA13) | `run-checks.sh --durability`: 59 ok e 0 falha, com as checagens de UC12 a UC15 (`docs/uc/uc16/evidencias/E/run-checks.txt`); `pnpm test` com os mesmos 4 testes de `orders` falhando e nenhum spec antigo alterado além de acréscimos | Coberto (contêiner e testes automatizados) |
| Autenticação e permissões | nenhum | **Não implementado (ADR-008)** |
| Restauração de produto removido | nenhum | **Não implementado (ADR-009)** |
| Remoção física (*purge*) de produtos já removidos | nenhum | **Não implementado (ADR-010)** |
| Remoção em lote | nenhum | **Não implementado (ADR-011)** |
| Dependências de outras entidades | consulta ao catálogo do banco de desenvolvimento: 0 chaves estrangeiras para `products.products` (`docs/uc/uc16/evidencias/F/dependencias-fk.txt`); nenhum `ManyToOne`, `OneToMany` ou `JoinColumn` em `src` | Coberto (consulta e busca no código; sem teste automatizado) |

## 5. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Epic e Sub-Issues conferem com o state.yaml | `check-state.sh --remote` (OK, executado) | aprovado | evertonfoz (2026-11-24) |
| GitHub Project configurado com os 5 estados | listagem do Project (`docs/uc/uc16/evidencias/A/publicacao.txt`) | aprovado | evertonfoz (2026-11-24) |
