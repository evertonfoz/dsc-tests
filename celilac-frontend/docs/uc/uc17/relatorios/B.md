# Relatório da Fase B — UC17 Autenticar usuário

> Fase **em andamento**. Siglas: UC (caso de uso), CA (critério de aceite), RED (o teste que falha antes do código), TDD (*Test-Driven Development*, desenvolvimento guiado por testes), CI (*Continuous Integration*, integração contínua), PR (*Pull Request*, proposta de mudança no GitHub).

| Campo | Valor |
|---|---|
| Caso de uso | UC17 — Autenticar usuário |
| Fase | B — Fatias (neste projeto: comportamento visível da tela) |
| Período | 2026-11-28 → em andamento |
| Responsável | `evertonfoz` |
| Issue(s) | #172 (F01), #173 (F02); #171 para o CA05 |
| Branch / PR | `feature/uc17-telas-iniciais` / nenhum |
| Commits de referência | preparo `59f8a74`; F01: início `2e0b458`, RED `24ce794`, GREEN `f4d4e6e`, REFACTOR `f220388`; F02: início `9cd1d97`, RED `f302821`, GREEN `dc4effd`, caracterização `f4cb4bc`; CA05: RED `f7ea182`, GREEN `3b6e3b5` |

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
- Parte 3.2 **validada por `evertonfoz` em 2026-11-28**.

| Critério | Teste | Situação |
|---|---|---|
| CA01, RF01 | `should redirect the root path to the login page (CA01)` | passa; teve RED; validado por mutação |
| CA03, RF03, FA01, RN03 | `should show the dashboard page at /dashboard (CA03)` | passa; teve RED |
| CA04, RF04, FA01, RN03 | `should show the access denied page at /unauthorized (CA04)` | passa; teve RED |

### 2.3. F02 — formulário de login sem autenticação (parte 3.3)
- *Executado nesta fase:* RED de CA02, com o teste falhando porque a tela só tinha o título (o campo "E-mail" não existia); os três testes da F01 continuaram passando.
- *Executado nesta fase:* GREEN com o formulário do material. A única adição em relação ao código do material é o comentário que registra que o formulário não autentica.
- *Executado nesta fase:* o teste de CA07 **passou na primeira execução**. É um teste de **caracterização** (descreve o que o código já faz), não um RED: o formulário da GREEN já não enviava nada.
- *Executado nesta fase:* três mutações, cada uma acusada por um teste e desfeita em seguida: senha visível (CA02), chamada à API no envio (CA07) e destino de envio no formulário (CA07).
- **Sem REFACTOR:** não foi identificada melhoria que justificasse mudar o código do material ou os testes.
- **Limite do teste de CA07:** observa `fetch`, `XMLHttpRequest` e os atributos `action` e `formaction`. Outros meios de requisição não são observados.
- Parte 3.3 **validada por `evertonfoz` em 2026-11-28**.

| Critério | Teste | Situação |
|---|---|---|
| CA02, RF02 | `should show the e-mail and password fields and the submit button (CA02)` | passa; teve RED; validado por mutação |
| CA07, RN02 | `should not send any request when the login form is submitted (CA07)` | passa; **sem RED** (caracterização); validado por duas mutações |

### 2.4. Endereço base da API, CA05 (parte 3.4)
CA05 pertence à base do projeto, não à F01 nem à F02; os commits citam a issue principal #171.

- *Executado nesta fase:* RED com o arquivo de teste falhando porque o módulo `apiClient` não existia. A comparação do valor **não chegou a ser executada** nesse momento.
- *Executado nesta fase:* GREEN com `src/api/apiClient.ts`, com o código do material, e remoção do `.gitkeep` da pasta.
- *Executado nesta fase:* mutação (endereço fixo no código), acusada pela comparação do valor, e desfeita.
- **Sem REFACTOR:** o módulo tem uma linha.
- **Limite:** o teste prova que o valor vem da variável. Ele não cobre a variável ausente (P2, em aberto), e nenhuma tela usa o endereço ainda (RN02).
- Aguardando validação de `evertonfoz`.

| Critério | Teste | Situação |
|---|---|---|
| CA05, RF05 | `should expose the API base URL from VITE_API_BASE_URL (CA05)` | passa; teve RED (módulo ausente); validado por mutação |

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
| 13 | F02 em andamento no Project e no estado | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-inicio.txt` |
| 14 | F02: RED de CA02 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-red.txt` |
| 15 | F02: GREEN de CA02 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-green.txt` |
| 16 | F02: teste de caracterização de CA07 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-caracterizacao-ca07.txt` |
| 17 | F02: mutação acusada por CA02 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-mutacao-ca02.txt` |
| 18 | F02: mutação com chamada à API acusada por CA07 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-mutacao-ca07-fetch.txt` |
| 19 | F02: mutação com destino de envio acusada por CA07 | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-mutacao-ca07-action.txt` |
| 20 | F02: mutações desfeitas | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-mutacao-revertida.txt` |
| 21 | F02: build e lint | Executado nesta fase | `docs/uc/uc17/evidencias/B/f02-build-lint.txt` |
| 22 | CA05: RED | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-red.txt` |
| 23 | CA05: GREEN | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-green.txt` |
| 24 | CA05: mutação acusada | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-mutacao.txt` |
| 25 | CA05: mutação desfeita | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-mutacao-revertida.txt` |
| 26 | CA05: build e lint | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-build-lint.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todas as fatias integradas, com PR, revisor e evidências | `check-state.sh --remote` | pendente | — |
| Cada fatia com teste RED e GREEN em commits separados | histórico e evidências | pendente de validação; CA07 não tem RED (seção 2.3) | — |
| CI verde na branch principal | resultado do CI | não poderá ser aprovado (ADR-003) | — |
| Tabela fatia → teste confere com o código | este relatório | pendente | — |

## 5. Decisões e hipóteses
- Sem decisões novas.

## 6. Pendências e riscos
- F01 e F02 só passam a `em_revisao` quando houver PR.
- No navegador real, o envio sem tratamento deve recarregar a página (pendência P3, em aberto); conferir na etapa 4.
- Os testes rodam em navegador simulado; as rotas ainda não foram conferidas no navegador real (etapa 4).
