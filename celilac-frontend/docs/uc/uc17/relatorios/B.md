# Relatório da Fase B — UC17 Autenticar usuário

> Fase **em andamento**. Siglas: UC (caso de uso), CA (critério de aceite), RED (o teste que falha antes do código), TDD (*Test-Driven Development*, desenvolvimento guiado por testes), CI (*Continuous Integration*, integração contínua), PR (*Pull Request*, proposta de mudança no GitHub), HTML (*HyperText Markup Language*, a linguagem das páginas da web).

| Campo | Valor |
|---|---|
| Caso de uso | UC17 — Autenticar usuário |
| Fase | B — Fatias (neste projeto: comportamento visível da tela) |
| Período | 2026-11-28 → em andamento |
| Responsável | `evertonfoz` |
| Issue(s) | #172 (F01), #173 (F02); #171 para o CA05, a conferência e o CA08 |
| Branch / PR | `feature/uc17-telas-iniciais` / nenhum |
| Commits de referência | preparo `59f8a74`; F01: início `2e0b458`, RED `24ce794`, GREEN `f4d4e6e`, REFACTOR `f220388`; F02: início `9cd1d97`, RED `f302821`, GREEN `dc4effd`, caracterização `f4cb4bc`; CA05: teste `f7ea182`, GREEN `3b6e3b5`; conferência: `83a92ec`, `e298df6`; CA08: RED `5c49149`, GREEN `87ed4a5` |

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

- *Executado nesta fase:* o arquivo de teste falhou porque o módulo `apiClient` não existia. A comparação do valor **não chegou a ser executada**. **Isso não é um RED válido:** o playbook da fase B e o perfil `method/perfis/react-vite.md` não aceitam erro de importação, e pedem criar o mínimo para o teste rodar e repetir o RED. O passo não foi feito antes da GREEN. O commit `f7ea182` traz "RED" na mensagem. Correção deste registro feita na etapa 4.
- *Executado nesta fase:* GREEN com `src/api/apiClient.ts`, com o código do material, e remoção do `.gitkeep` da pasta.
- *Executado nesta fase:* mutação (endereço fixo no código), acusada pela comparação do valor, e desfeita.
- **Sem REFACTOR:** o módulo tem uma linha.
- **Limite:** o teste prova que o valor vem da variável. Ele não cobre a variável ausente (P2, em aberto), e nenhuma tela usa o endereço ainda (RN02).
- Parte 3.4 **validada por `evertonfoz` em 2026-11-28**.

| Critério | Teste | Situação |
|---|---|---|
| CA05, RF05 | `should expose the API base URL from VITE_API_BASE_URL (CA05)` | passa; **sem RED válido** (falha de importação); validado por mutação |

### 2.5. Conferência (etapa 4)
- *Executado nesta fase:* `scripts/verify.sh` reúne instalação pelo arquivo de travamento, lint, testes, build, testes dos validadores, links e estado. Os sete passos passaram, com o estado conferido no GitHub.
- *Executado nesta fase:* quebra proposital (título trocado e caminho inexistente no README), acusada nos passos de testes e de links, e desfeita.
- *Executado nesta fase:* os testes do validador passam todos; as duas referências quebradas da fase A foram resolvidas com a criação do script.
- *Executado nesta fase:* `scripts/verificar-navegador.mjs` abriu `/`, `/login`, `/dashboard` e `/unauthorized` em um Google Chrome sem janela (*headless*), com o servidor de desenvolvimento: endereços, títulos, textos, estilos e ausência de erros no console conferem, e a raiz não fica no histórico. A cor do botão foi trocada de propósito, a conferência acusou e a alteração foi desfeita.
- *Executado nesta fase:* checklist do material conferido item por item (relatório da fase A, `docs/uc/uc17/relatorios/A.md`, seção 3.1).
- **Observado (P3, em aberto):** ao clicar em "Entrar", a página recarrega, o endereço vira `/login?` e os campos esvaziam. Os dados digitados não aparecem no endereço, e nenhuma requisição vai à API.
- **Observado (P1, em aberto):** um endereço inexistente mostra tela em branco, com o aviso `No routes matched location` no console.
- **Achado, corrigido depois (seção 2.6):** `index.html` vem do modelo com `lang="en"`, embora o conteúdo esteja em português, e com o título `celilac-frontend`. O material não trata dos dois.
- **Limites:** conferência em um só navegador, sem janela, em 1280×800, no servidor de desenvolvimento; telas estreitas e o resultado do build não foram abertos no navegador.
- Etapa 4 **validada por `evertonfoz` em 2026-11-28**, com a correção do registro do CA05 (seção 2.4).

### 2.6. Idioma e título da página, CA08 (ajuste depois da etapa 4)
Por decisão de `evertonfoz` em 2026-11-28, o achado da conferência foi corrigido. O ajuste vai **além do material**: RF09 e CA08 foram acrescentados à especificação antes do teste. Pertence à base do projeto; os commits citam a issue principal #171.

- *Executado nesta fase:* RED **válido**, com os dois testes rodando e falhando na comparação (`en` no lugar de `pt-BR`; `celilac-frontend` no lugar de `CeliLac`).
- *Executado nesta fase:* GREEN com a mudança das duas linhas em `index.html`.
- *Executado nesta fase:* verificação completa e conferência no navegador passando; o HTML servido e o gerado pelo build trazem os valores novos.
- **Sem REFACTOR e sem mutação:** o RED já mostrou cada teste acusando o valor errado.
- **Limite:** não foi testado com leitor de tela nem com a oferta de tradução do navegador.
- A issue #171 ainda cita "CA01 a CA07"; atualizar no GitHub depende de autorização.
- Aguardando validação de `evertonfoz`.

| Critério | Teste | Situação |
|---|---|---|
| CA08, RF09 | `should declare the page language as Brazilian Portuguese (CA08)` | passa; teve RED |
| CA08, RF09 | `should use CeliLac as the page title (CA08)` | passa; teve RED |

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
| 22 | CA05: falha por módulo ausente (não é RED válido) | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-red.txt` |
| 23 | CA05: GREEN | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-green.txt` |
| 24 | CA05: mutação acusada | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-mutacao.txt` |
| 25 | CA05: mutação desfeita | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-mutacao-revertida.txt` |
| 26 | CA05: build e lint | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca05-build-lint.txt` |
| 27 | Verificação local completa | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-verificacao.txt` |
| 28 | A verificação acusa a quebra proposital | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-verificacao-quebrada.txt` |
| 29 | Quebra desfeita | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-verificacao-restaurada.txt` |
| 30 | Testes dos validadores | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-validador.txt` |
| 31 | Rotas, estilos e envio no navegador | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador.txt` |
| 32 | A conferência no navegador acusa a quebra proposital | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador-quebrado.txt` |
| 33 | Quebra no navegador desfeita | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador-restaurado.txt` |
| 34 | Captura da tela de login | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador-login.png` |
| 35 | Captura do dashboard | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador-dashboard.png` |
| 36 | Captura do acesso negado | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-navegador-unauthorized.png` |
| 37 | Arquivos e nomes dos testes comparados com o material | Executado nesta fase | `docs/uc/uc17/evidencias/B/conf-material.txt` |
| 38 | CA08: RED | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca08-red.txt` |
| 39 | CA08: GREEN | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca08-green.txt` |
| 40 | CA08: verificação, navegador e build | Executado nesta fase | `docs/uc/uc17/evidencias/B/ca08-conferencia.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todas as fatias integradas, com PR, revisor e evidências | `check-state.sh --remote` | pendente | — |
| Cada fatia com teste RED e GREEN em commits separados | histórico e evidências | pendente de validação; CA07 não tem RED (seção 2.3); CA05, da base, também não tem RED válido (seção 2.4) | — |
| CI verde na branch principal | resultado do CI | não poderá ser aprovado (ADR-003) | — |
| Tabela fatia → teste confere com o código | este relatório | pendente | — |

## 5. Decisões e hipóteses
- Sem decisões novas.

## 6. Pendências e riscos
- F01 e F02 só passam a `em_revisao` quando houver PR.
- P1 e P3 foram observadas no navegador e continuam em aberto; P2 não foi exercitada.
- Os testes automatizados rodam em navegador simulado; a conferência no Chrome é um passo à parte, fora do `scripts/verify.sh`.
