# Relatório da Fase B — UC17 Autenticar usuário

> Fase **em andamento**. Siglas: UC (caso de uso), CA (critério de aceite), RED (o teste que falha antes do código), TDD (*Test-Driven Development*, desenvolvimento guiado por testes), CI (*Continuous Integration*, integração contínua), PR (*Pull Request*, proposta de mudança no GitHub).

| Campo | Valor |
|---|---|
| Caso de uso | UC17 — Autenticar usuário |
| Fase | B — Fatias (neste projeto: comportamento visível da tela) |
| Período | 2026-11-28 → em andamento |
| Responsável | `evertonfoz` |
| Issue(s) | #172 (F01), #173 (F02) |
| Branch / PR | `feature/uc17-telas-iniciais` / nenhum |
| Commit de referência | `fa92d754` (base do projeto; o preparo dos testes entra no commit seguinte) |

## 1. Objetivo da fase
Entregar F01 e F02 pelo ciclo do apoio B: teste falhando, código mínimo, melhoria e mutação revertida.

## 2. O que foi feito
### 2.1. Preparo dos testes (parte 3.1)
- *Executado nesta fase:* instalação das versões atuais de Vitest, `jsdom` e Testing Library, sem conflito entre pares.
- *Executado nesta fase:* teste de fumaça sobre a tela mínima; título trocado de propósito no código, falha observada e alteração desfeita.
- **Não é um RED de TDD:** o código já existia. O exercício prova que o executor funciona e acusa erros.
- Parte 3.1 **validada por `evertonfoz` em 2026-11-28**.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência (arquivo em `evidencias/`) |
|---|---|---|---|
| 1 | Versões das ferramentas de teste, sem conflito | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-versoes.txt` |
| 2 | Teste de fumaça passa | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-verde.txt` |
| 3 | O teste falha com o título trocado | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-quebrado.txt` |
| 4 | Alteração desfeita e teste passando | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-restaurado.txt` |
| 5 | Build e lint passam com a configuração de testes | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-build-lint.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todas as fatias integradas, com PR, revisor e evidências | `check-state.sh --remote` | pendente | — |
| Cada fatia com teste RED e GREEN em commits separados | histórico e evidências | pendente | — |
| CI verde na branch principal | resultado do CI | não poderá ser aprovado (ADR-003) | — |
| Tabela fatia → teste confere com o código | este relatório | pendente | — |

## 5. Decisões e hipóteses
- Sem decisões novas.

## 6. Pendências e riscos
- F01, F02 e o teste de CA05 ainda não começaram.
- O teste de fumaça será substituído quando a tela mínima der lugar às rotas.
