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
| Commits de referência | preparo `59f8a74`; F01: início `2e0b458`, RED `24ce794`, GREEN `f4d4e6e`, REFACTOR `f220388` |

## 1. Objetivo da fase
Entregar F01 e F02 pelo ciclo do apoio B: teste falhando, código mínimo, melhoria e mutação revertida.

## 2. O que foi feito
### 2.1. Preparo dos testes (parte 3.1)
- *Executado nesta fase:* instalação das versões atuais de Vitest, `jsdom` e Testing Library, sem conflito entre pares.
- *Executado nesta fase:* teste de fumaça sobre a tela mínima; título trocado de propósito no código, falha observada e alteração desfeita.
- **Não é um RED de TDD:** o código já existia. O exercício prova que o executor funciona e acusa erros.
- Parte 3.1 **validada por `evertonfoz` em 2026-11-28**.

### 2.2. F01 — telas e rotas iniciais (parte 3.2)
- *Executado nesta fase:* RED com os três testes falhando pelo comportamento ausente (o endereço não mudava e os títulos não existiam).
- *Executado nesta fase:* GREEN com as rotas e as três telas; a tela de login tem só o título, porque o formulário é da F02. O teste de fumaça saiu junto com a tela mínima.
- *Executado nesta fase:* REFACTOR **no código de teste** (uma função para abrir a aplicação em um endereço). No código da aplicação não houve refatoração.
- *Executado nesta fase:* mutação (a raiz levando ao dashboard), acusada pelo teste de CA01, e desfeita.
- Diferença para o material: os `import` vêm de `react-router` (ADR-002).
- Aguardando validação de `evertonfoz`.

| Critério | Teste | Situação |
|---|---|---|
| CA01, RF01 | `should redirect the root path to the login page (CA01)` | passa; teve RED; validado por mutação |
| CA03, RF03, FA01, RN03 | `should show the dashboard page at /dashboard (CA03)` | passa; teve RED |
| CA04, RF04, FA01, RN03 | `should show the access denied page at /unauthorized (CA04)` | passa; teve RED |

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência (arquivo em `evidencias/`) |
|---|---|---|---|
| 1 | Versões das ferramentas de teste, sem conflito | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-versoes.txt` |
| 2 | Teste de fumaça passa | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-verde.txt` |
| 3 | O teste falha com o título trocado | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-quebrado.txt` |
| 4 | Alteração desfeita e teste passando | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-fumaca-restaurado.txt` |
| 5 | Build e lint passam com a configuração de testes | Executado nesta fase | `docs/uc/uc17/evidencias/B/preparo-build-lint.txt` |
| 6 | F01 em andamento no Project e no estado | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-inicio.txt` |
| 7 | F01: RED | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-red.txt` |
| 8 | F01: GREEN | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-green.txt` |
| 9 | F01: build e lint | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-build-lint.txt` |
| 10 | F01: REFACTOR nos testes | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-refactor.txt` |
| 11 | F01: mutação acusada | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-mutacao.txt` |
| 12 | F01: mutação desfeita | Executado nesta fase | `docs/uc/uc17/evidencias/B/f01-mutacao-revertida.txt` |

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
- F02 e o teste de CA05 ainda não começaram.
- A F01 só passa a `em_revisao` quando houver PR.
- Os testes rodam em navegador simulado; as rotas ainda não foram conferidas no navegador real (etapa 4).
