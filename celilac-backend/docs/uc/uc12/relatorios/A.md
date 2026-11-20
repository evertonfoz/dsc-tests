# Relatório da Fase A — UC12 Cadastrar Produto (reconciliação retroativa)

> Piloto da Etapa 6. Fatos e evidências, sem veredicto: quem aprova é a pessoa responsável ou o CI.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | A — Planejar e publicar (reconciliação) |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | a criar (ver seção 6); a Epic #1 do laboratório está fechada |
| Branch / PR | branch de piloto docs/uc12-piloto-reconciliacao (nome de branch) / ainda sem PR |

## 1. Objetivo da fase
Reconciliar o planejamento do UC12, feito por camada técnica no laboratório, com o método atual: itens do UC mapeados a fatias (comportamentos), decisões registradas e `state.yaml` válido.

## 2. Proveniência
O UC12 foi executado no laboratório (`celillac-backend-prepare`) sob o método antigo: sub-issues por camada (#4 a #11 e #16), PRs #12 a #19, Epic #1 fechada. Aqui as entregas são **reorganizadas** em fatias; nada foi refeito. *Documentado* (issues e PRs do GitHub) e *Confirmado no código*.

## 3. Cobertura item a item (estado em 2026-11-20)

| Item do UC | Fatia | Teste que prova (nome do `it`) | Situação |
|---|---|---|---|
| CA01, RF01, RF03, RF05 | F01 | `should register and save a product when valid data is provided (CA01)` (serviço); `should create a product when valid data is provided (POST /products -> 201)` (HTTP); `deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco` | Coberto *(Executado nesta fase)* |
| CA02, RN01, FA01 | F02 (HTTP) e **F03 (núcleo, a implementar)** | `should reject an empty product name at the HTTP boundary (POST /products -> 400)`; `deve rejeitar nome vazio na fronteira HTTP` | Coberto **apenas na fronteira HTTP (DTO)**; o núcleo (`createProduct`) aceita nome vazio |
| CA03, RN03, RN04, RF04 | F02 | mesmos testes de F02 (`save` não é chamado) | Coberto na fronteira HTTP |
| RF02 | F02 | validação do DTO | Parcial: só o nome |
| CA04 | — | 7 testes passam (6 rápidos e 1 de banco) | Coberto, mas só para o que existe |
| RN02, FA02 (preço) | — | nenhum | **Não implementado (ADR-002)** |
| FE01 (falha de persistência) | F04 *(a implementar)* | nenhum | **Sem teste**; decisão: implementar como fatia |
| "CA05" | — | — | Não existe no `uc-12.md` (ver seção 5) |

## 4. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | 6 testes rápidos de `products` e 1 de integração com PostgreSQL passam | Executado nesta fase | `docs/uc/uc12/evidencias/A/testes-do-uc12.txt` |
| 2 | O código só tem o campo `name` | Confirmado no código | `src/modules/products/entities/product.entity.ts` |
| 3 | O serviço não valida o nome; a regra está no DTO | Confirmado no código | `src/modules/products/services/products.service.ts` |

## 5. Decisões (consulta ao professor, 2026-11-20)
1. **Epic:** nova issue de reconciliação; a #1 permanece como histórico (regra 13).
2. **Preço (RN02/FA02):** adiado, `docs/adr/ADR-002-validacao-de-preco-adiada-uc12.md`.
3. **FE01:** implementar como fatia F04, pelos playbooks B e C.
4. **Nome vazio no núcleo:** nova fatia F03 (a validação hoje só existe no DTO), executada antes da F04.
5. **CA05:** o rótulo aparece em dois sentidos (critério de processo da Epic, e "resposta 201/400" no `12-10`). O `12-10` foi corrigido para citar RF05; o `uc-12.md` fica com CA01 a CA04.

## 6. Pendências e riscos
- **Publicação:** criar a issue de reconciliação e as issues de F03 e F04 exige aprovação do plano (playbook A, passo 6). Nada foi publicado.
- **Revisão solo:** `revisor` e `responsavel` coincidem; é papel, não revisão independente.
- **F02 só no HTTP:** a regra de nome vazio não existe no núcleo; tratada pela fatia F03.
- **Achados sobre o método:** (a) `criterios` agora aceita CA, RN, RF, FA e FE (validador ajustado nesta rodada); (b) o relatório `01-12` e o `12-10` afirmavam cobertura sem prova.

## 7. Fatias novas e Definition of Ready

| Fatia | Teste RED nomeado | Escopo (dentro / fora) | Dependência |
|---|---|---|---|
| F03 | `should reject an empty product name in the service without saving (RN01)` | dentro: regra de nome no serviço e erro de domínio; fora: HTTP e banco | nenhuma |
| F04 | `should report an incomplete operation when persistence fails (FE01)` | dentro: serviço traduz falha do repositório em erro de aplicação sem detalhes internos; fora: mapeamento HTTP e banco real (Fase C) | F03 integrada |

| Critério | F03 | F04 |
|---|---|---|
| DoR-01 Objetivo claro | Atende | Atende |
| DoR-02 Escopo delimitado | Atende | Atende |
| DoR-03 Critérios verificáveis | Atende (RN01, FA01, CA02) | Atende (FE01), mas o UC o chama de proposta técnica: formato do erro é **hipótese** |
| DoR-04 Dependências | Atende | Atende (depende de F03) |
| DoR-05 Informações disponíveis | Atende | Atende |
| DoR-06 Responsável | Atende (evertonfoz) | Atende (evertonfoz) |
| DoR-07 Revisão humana | **Pendente** | **Pendente** |

Resultado: ambas ficam em `Backlog` até a revisão humana (DoR-07).

## 8. Gate de saída
| Verificação | Como | Resultado | Validado por |
|---|---|---|---|
| Todo item do UC12 mapeado | tabela da seção 3 | pendente | — |
| Issue de reconciliação criada e conferida | `check-state.sh --remote` | pendente | — |
| F03 e F04 com DoR avaliada e RED nomeado | issues das fatias | pendente | — |
