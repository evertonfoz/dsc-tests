# Relatório da Fase B — UC12 Cadastrar Produto

> Fatos e evidências, sem veredicto de aprovação humana. Os dois gates objetivos foram aferidos pelo CI.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | B — Fatias no núcleo |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | #24 (F03, fechada), #25 (F04); Epic do piloto #23 |
| PR(s) | #26 (F03), #31 (F04); F01 e F02 vêm do laboratório (#13, #14) |
| Commit de referência | 355ba6c (`main`, após o merge do #31) |

## 1. Objetivo da fase
Entregar no núcleo as fatias que faltavam ao UC12 (F03 e F04), por TDD, um PR por fatia, com RED e GREEN em commits separados.

## 2. O que foi feito
- **F03** — o serviço rejeita nome vazio com `InvalidProductNameException`, sem gravar. *Executado nesta fase.* RED `fbf70f7`, GREEN `b0754d5`, PR #26.
- **F04** — o serviço traduz falha do repositório em `ProductPersistenceFailedException`, com a causa só em `cause`. *Executado nesta fase.* RED `5302956`, GREEN `3b08d0e`, PR #31.
- Sem REFACTOR em nenhuma das duas (mudanças de poucas linhas; registrado nos PRs).
- Mutação de verificação em F04: com a mensagem original vazando, o teste falhou. *Executado nesta fase.*

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | RED da F03 falha porque a promessa resolve, não por erro de importação | Executado nesta fase | `docs/uc/uc12/evidencias/B/f03-red.txt` |
| 2 | GREEN da F03: 7 testes passam | Executado nesta fase | `docs/uc/uc12/evidencias/B/f03-green.txt` |
| 3 | RED da F04 falha porque o erro original é propagado | Executado nesta fase | `docs/uc/uc12/evidencias/B/f04-red.txt` |
| 4 | GREEN da F04: 8 testes de `products` passam | Executado nesta fase | `docs/uc/uc12/evidencias/B/f04-green.txt` |
| 5 | Teste de controller instável, pré-existente | Executado nesta fase | `docs/uc/uc12/evidencias/B/f03-instabilidade.txt` (issue #27) |
| 6 | CI verde na `main` em `355ba6c` | Executado nesta fase | execução do workflow no GitHub (evento `push`) |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todas as fatias integradas | `check-state.sh --remote` | aprovado | CI |
| CI verde na branch principal | workflow do GitHub | aprovado | CI |

> Os dois itens são verificáveis por máquina. A validação humana da fase fica registrada pela autorização do professor na sessão ("Sim", 2026-11-20) para integrar os PRs e abrir a fase C; o agente não aprovou nenhum gate.

## 5. Decisões e hipóteses
- Nome da exceção e regra de não vazar a mensagem original (F04): **hipótese/decisão da fatia**, FE01 é "proposta técnica" no UC.
- "Vazio" significa `''`; nome só com espaços fica fora de escopo.

## 6. Pendências e riscos
- **Para a C1:** o filtro HTTP não conhece `InvalidProductNameException` nem `ProductPersistenceFailedException`; sem mapeamento chegariam como 500.
- **Issue #25** aberta até o fechamento humano ou autorizado.
- **Instabilidade #27** sem causa; pode derrubar o CI por acaso.
- Revisões de #24 e #25 foram delegadas e feitas por IA (não independentes).
- RN02/FA02 (preço) seguem "não implementado (ADR-002)".

## 7. Aprendizados
- O RED só vale se falha pelo motivo certo; o teste de F04 foi validado por mutação.
- Uma instabilidade pré-existente apareceu só porque rodamos a suíte muitas vezes; registrá-la com número de ocorrências evitou culpar a fatia.
