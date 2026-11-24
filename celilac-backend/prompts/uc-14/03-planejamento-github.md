# 03 — Planejamento e publicação no GitHub (UC14)

> Publicado em 2026-11-23 após autorização expressa do estudante ("Crie tudo"). Números **reais** retornados pelo `gh`. Evidência: `docs/uc/uc14/evidencias/A/publicacao.txt`.

## Issues publicadas

| # | Título | Tipo | Estado no Project |
|---|---|---|---|
| 126 | [UC14] Buscar Produto por Identificador | Epic | Backlog |
| 127 | [UC14][F01] Buscar produto ativo por productId e retornar productId e name | Fatia | **Ready** |
| 128 | [UC14][F02] Produto inexistente lança ProductNotFoundException | Fatia | Backlog |
| 129 | [UC14][F03] Produto removido (soft delete) é tratado como inexistente | Fatia | Backlog |
| 130 | [UC14][F04] Falha de persistência na consulta lança ProductLookupFailedException | Fatia | Backlog |
| 131 | [UC14][F05] Identificador que não é UUID é rejeitado com InvalidProductIdException | Fatia | Backlog |
| 132 | [UC14][Fase A] Planejamento e publicação do UC14 | Fase | Backlog |
| 133 | [UC14][Fase C1] Adaptador HTTP de GET /products/:productId | Fase | Backlog |
| 134 | [UC14][Fase C2] Persistência real: busca de produto ativo por productId | Fase | Backlog |
| 135 | [UC14][Fase D] Contrato de GET /products/:productId | Fase | Backlog |
| 136 | [UC14][Fase E] Verificação reprodutível da busca por productId | Fase | Backlog |
| 137 | [UC14][Fase F] Auditoria e encerramento do UC14 | Fase | Backlog |

Sub-Issues vinculadas ao Epic #126 (#127 a #137). Project reaproveitado: #6 "CeliLac — UC12 Cadastrar Produto", como no UC13. Rótulo `uc14` criado; os demais já existiam. Responsável e revisor: `evertonfoz` (modo solo, não conta como revisão independente).

## Dependências

| Item | Depende de | Tipo |
|---|---|---|
| F01 | nenhuma | — |
| F02, F04 | F01 | obrigatória |
| F03 | F01, F02 | obrigatória |
| F05 | nenhuma | — |
| C1 | F01 a F05 | obrigatória |
| C2 | F01 a F04 | obrigatória |
| D | C1 | obrigatória |
| E | C1, C2, D | obrigatória |
| F | todas | obrigatória |

Branch única `feature/uc14-buscar-produto` (decisão do estudante); WIP = 1 fatia por vez.

## Cobertura: item do UC → fatia, fase ou decisão

| Item do UC14 | Situação |
|---|---|
| Fluxo principal, RF01, RN05, CA01, CA08 | F01 |
| FA01, RF03, CA03 | F02 |
| FA02, RN01, RN02, CA04 | F03 (RN01 também em F02) |
| FE01, RF05, CA06 | F04 (mapeamento `500`: Fase C1) |
| FA03, RN03, RF02, CA05 | F05 (rota e `400`: Fase C1) |
| RN04, RF04, CA02 | F01 no núcleo; exatidão dos campos provada na Fase D |
| RF06, CA07 (regressão UC12/UC13) | Fase F, com regressão em cada fatia |
| CA09 (cada CA com teste e `.http`) | Fases E e F |

Nenhum item ficou sem fatia, fase ou pergunta. Nenhum foi adiado, então não há ADR de adiamento.

## Definition of Ready das fatias

| Fatia | Objetivo/escopo | CA verificáveis | Dependências | Responsável | Teste RED nomeado | Revisão (DoR-07) |
|---|---|---|---|---|---|---|
| F01 | sim | sim | nenhuma | evertonfoz | sim | UC aprovado pelo estudante; revisão por IA → **Ready** (como no UC13) |
| F02 a F05 | sim | sim | declaradas | evertonfoz | sim | idem, mas aguardam dependência/WIP → **Backlog** |

Testes RED: F01 `should return the active product found by productId (CA01)` · F02 `should throw ProductNotFoundException when the product does not exist (CA03)` · F03 `should throw ProductNotFoundException when the product is removed (CA04)` · F04 `should throw ProductLookupFailedException when the repository fails (CA06)` · F05 `should reject a non-UUID product id with InvalidProductIdException (CA05)`.

## Observações

- **Observação:** o corte em fatias é minha proposta, não confirmada fatia a fatia pelo estudante; ele autorizou a publicação, e o gate da Fase A segue `pendente`.
- **Observação:** o pipe de UUID é lógica de fronteira; por isso F05 testa a fábrica do pipe e a exceção sem subir HTTP, e a ligação à rota fica na Fase C1.
- **Observação:** `state.yaml` validado com `check-state.sh`; os avisos "revisor igual ao responsável" são do modo solo.
