# Relatório da Fase F — UC12 Cadastrar Produto

> Fatos e evidências, sem veredicto. O agente não aprovou gate, não fechou issue nem Epic e não fez merge de nada além do que o professor autorizou.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | F — Auditoria e encerramento |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | Epic do piloto #23 |
| Commit de referência | 4bbb03f (`main`, após o merge do #52) |

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
| Coberto | Fluxo principal, CA01, CA02, CA03, CA04, RN01, RN03, RN04, RF01, RF03, RF04, RF05, FA01, FE01 (CA03, RN03 e RF04 também no banco real, após o PR #52) |
| Parcial | RF02 (só o nome) |
| Não implementado (ADR-002) | RN02, FA02 (preço) |
| Aguardando decisão | nenhum item do UC |

Fatias: F01, F02, F03, F04, F05 e F06 integradas (PRs 13, 14, 26, 31, 44 e 45); o C1b (PR 46) e a E (PR 49) completam a entrega.

## 4. Auditoria arquitetural
Em `docs/uc/uc12/evidencias/F/auditoria.md`. Núcleo sem dependência de infraestrutura e adaptadores sem regra. Sete achados; A2 e A7 foram tratados depois (PRs #51 e #52), A3 foi decidido e #27 segue aberta.

## 5. Consistência
- `check-state.sh --remote` e `check-links.mjs` executados (ver gate).
- As ocorrências de "100%" nos documentos são citações da lição do preço, não afirmações de cobertura.
- O relatório A ainda cita F03 e F04 como "a implementar" porque descreve o estado daquela data; o `state.yaml` vence (regra 15).

## 6. Decisões do professor (recomendações aceitas em 2026-11-20)
| # | Pergunta | Decisão | Entrega |
|---|---|---|---|
| A2 | Compartilhar a configuração do `ValidationPipe`? | extrair para uma função | PR #51 (sem mudança de comportamento; 16 testes iguais antes e depois) |
| A3 | Nome com caractere NUL | manter 500 (FE01 documentado); o UC não define restrição de caracteres | sem código |
| A7 | Provar no banco real que a rejeição não grava | acrescentar teste | PR #52 (duas mutações em `docs/uc/uc12/evidencias/F/a7-mutacao.txt`) |
| #27 | Teste instável | deixar aberta (causa desconhecida, fora do UC12) | issue #27 aberta |

## 7. Encerramento
Feito pelo agente, com autorização do professor: PRs #50, #51 e #52 integrados; issue #41 fechada com link da evidência. CI verde na `main` em 4bbb03f; `check-state.sh --remote` sem erros.

**Falta, e é ato humano:** (1) validar os gates "pessoa responsável" abaixo; (2) fechar o Epic #23 e passar `fase_atual: concluido` com Epic `closed` no `state.yaml`. O agente não executa esses dois passos.

## 8. Gate de saída
| Verificação | Como | Resultado | Validado por |
|---|---|---|---|
| Todo item do UC tem teste ou ADR | `cobertura.md` e `testes.txt` | pendente | pessoa responsável |
| Nenhuma afirmação de cobertura sem prova | seções 3 e 5 | pendente | pessoa responsável |
| Arquitetura em conformidade, achados tratados | `auditoria.md` (A2 e A7 tratados, A3 decidido, #27 aberta) | pendente | pessoa responsável |
| `state.yaml`, documentos e GitHub consistentes | `check-state.sh --remote` e `check-links.mjs` | aprovado | CI |
| CI verde na principal | workflow em 4bbb03f | aprovado | CI |
| Issues e Epic fechados | GitHub (#41 fechada; Epic #23 aberto) | pendente | pessoa (ato humano) |

## 9. Aprendizados do piloto
- Um relatório de consistência afirmava 100% sem prova; refazer a tabela com testes executados achou o preço, FE01 e um "CA05" inexistente.
- Um teste chamado "integração" usava repositório em memória: o nome do arquivo não prova o nível do teste.
- Divergências descobertas tarde reabrem fases anteriores; o método ganhou a ADR-004 para isso.
- Todo teste que passa de primeira precisa de uma mutação que o derrube.
