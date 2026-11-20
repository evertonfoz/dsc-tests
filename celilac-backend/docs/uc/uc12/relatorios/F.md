# Relatório da Fase F — UC12 Cadastrar Produto

> Fatos e evidências, sem veredicto. O agente não aprovou gate, não fechou issue nem Epic e não fez merge de nada além do que o professor autorizou.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | F — Auditoria e encerramento |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | Epic do piloto #23 |
| Commit de referência | 56cfad8 (`main`, após o merge do #49) |

## 1. Objetivo da fase
Verificar o que o UC12 realmente entregou: cobertura item a item com teste executado, auditoria arquitetural, consistência entre documentos, `state.yaml` e GitHub.

## 2. Gate de entrada
- Fase E validada pelo professor; PR #49 integrado.
- CI verde na `main` em 56cfad8. Nenhum PR do UC aberto.
- `check-state.sh --remote` sem erros (avisos: revisor igual ao responsável; #41 aberta com a fatia integrada).

## 3. Cobertura real
Tabela completa em `docs/uc/uc12/evidencias/F/cobertura.md`; saída dos testes em `docs/uc/uc12/evidencias/F/testes.txt` (todos passam).

| Situação | Itens |
|---|---|
| Coberto | Fluxo principal, CA01, CA02, CA04, RN01, RN04, RF01, RF03, RF05, FA01, FE01 |
| Coberto com limite | CA03, RN03, RF04 (a rejeição não grava, provado com repositório simulado; nenhum teste olha o banco real) |
| Parcial | RF02 (só o nome) |
| Não implementado (ADR-002) | RN02, FA02 (preço) |
| Aguardando decisão | nenhum item do UC |

Fatias: F01, F02, F03, F04, F05 e F06 integradas (PRs 13, 14, 26, 31, 44 e 45); o C1b (PR 46) e a E (PR 49) completam a entrega.

## 4. Auditoria arquitetural
Em `docs/uc/uc12/evidencias/F/auditoria.md`. Núcleo sem dependência de infraestrutura e adaptadores sem regra. Sete achados, nenhum corrigido nesta fase; **três pedem decisão humana** (A2, A3, A7).

## 5. Consistência
- `check-state.sh --remote` e `check-links.mjs` executados (ver gate).
- As ocorrências de "100%" nos documentos são citações da lição do preço, não afirmações de cobertura.
- O relatório A ainda cita F03 e F04 como "a implementar" porque descreve o estado daquela data; o `state.yaml` vence (regra 15).

## 6. Decisões pendentes (suas)
| # | Pergunta | Opções |
|---|---|---|
| A2 | Compartilhar a configuração do `ValidationPipe` entre `main.ts` e os testes? | extrair para uma função em um PR pequeno · aceitar o risco |
| A3 | Nome com caractere NUL: rejeitar (400) ou manter 500 (FE01)? | nova fatia no núcleo e no DTO · manter documentado |
| A7 | Provar no banco real que uma rejeição não grava linha? | acrescentar teste de persistência · aceitar a prova atual |
| #27 | Investigar o teste instável antes de encerrar? | investigar agora · deixar aberta |

## 7. Roteiro de encerramento (ato humano)
1. Decidir os itens da seção 6 (o agente registra ADR ou abre fatia, conforme a resposta).
2. Fechar a issue #41 (F06, integrada pelo PR #45) e a #23 (Epic do piloto), com o link desta evidência.
3. Aprovar os gates da F em `state.yaml` e passar `fase_atual: concluido` com Epic `closed`.
4. As issues da Fundação #20, #28 e #38 estão fora do UC12.

## 8. Gate de saída
| Verificação | Como | Resultado | Validado por |
|---|---|---|---|
| Todo item do UC tem teste ou ADR | `cobertura.md` e `testes.txt` | pendente | pessoa responsável |
| Nenhuma afirmação de cobertura sem prova | seção 3 e 5 | pendente | pessoa responsável |
| Arquitetura em conformidade, achados tratados | `auditoria.md` | pendente | pessoa responsável |
| `state.yaml`, documentos e GitHub consistentes | `check-state.sh --remote`, `check-links.mjs` | pendente | CI / pessoa |
| CI verde na principal | workflow | pendente | CI |
| Issues e Epic fechados | GitHub | pendente | pessoa (ato humano) |

## 9. Aprendizados do piloto
- Um relatório de consistência afirmava 100% sem prova; refazer a tabela com testes executados achou o preço, FE01 e um "CA05" inexistente.
- Um teste chamado "integração" usava repositório em memória: o nome do arquivo não prova o nível do teste.
- Divergências descobertas tarde reabrem fases anteriores; o método ganhou a ADR-004 para isso.
- Todo teste que passa de primeira precisa de uma mutação que o derrube.
