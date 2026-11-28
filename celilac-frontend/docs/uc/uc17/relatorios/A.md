# Relatório da Fase A — UC17 Autenticar usuário

> Siglas: UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), RF (requisito funcional), RN (regra de negócio), FA (fluxo alternativo), CA (critério de aceite), ADR (*Architecture Decision Record*, registro de decisão arquitetural), DoR (*Definition of Ready*, critério de prontidão), RED (o teste que falha antes do código), CI (*Continuous Integration*, integração contínua), PR (*Pull Request*, proposta de mudança no GitHub), TDD (*Test-Driven Development*, desenvolvimento guiado por testes), HTML (*HyperText Markup Language*, a linguagem das páginas da web).

| Campo | Valor |
|---|---|
| Caso de uso | UC17 — Autenticar usuário |
| Fase | A — Planejar e publicar |
| Período | 2026-11-28 → 2026-11-28 |
| Responsável | `evertonfoz` |
| Issue(s) | #171 (principal), #172 (F01), #173 (F02) |
| Branch / PR | `main`, sem commit / nenhum |
| Commit de referência | `96509d4d6d00b99f9767f23543efb27f1c9f7f50` |

## 1. Objetivo da fase
Especificar a base da interface do UC17, dizer como cada item será provado ou por que fica de fora, e registrar o estado em um arquivo conferido por programa.

## 2. O que foi feito
- *Executado nesta fase:* busca pela existência do UC17 e por autenticação na API.
- *Executado nesta fase:* cópia de `method/` sem o material do curso; testes do validador no novo local.
- *Documentado:* perfil do projeto, perfil de stack React, especificação, ADR-001 a ADR-003, descrição prévia, proposta para o GitHub e `state.yaml`.
- *Executado nesta fase:* validação do `state.yaml`, quebra proposital e restauração.
- *Executado nesta fase:* com autorização de `evertonfoz`, criação dos rótulos `uc17` e `module:frontend`, das issues #171 a #173 (#172 e #173 vinculadas à #171) e do GitHub Project #7, com os cinco estados e os três itens em `Backlog`.

## 3. Cobertura inicial (módulo 1)
No gate da fase A não havia testes: os itens com teste previsto estavam em *A implementar*. A coluna "Situação" foi atualizada em 2026-11-28, depois da parte 3.4. *Coberto* significa que o teste existe e passa na execução local; a prova está no relatório da fase B (`docs/uc/uc17/relatorios/B.md`).

| Item | Fatia ou destino | Teste que prova (nome previsto) | Situação |
|---|---|---|---|
| RF01, CA01, fluxo principal (raiz leva ao login) | F01 | `should redirect the root path to the login page (CA01)` | Coberto |
| RF03, CA03 (dashboard) | F01 | `should show the dashboard page at /dashboard (CA03)` | Coberto |
| RF04, CA04 (acesso negado) | F01 | `should show the access denied page at /unauthorized (CA04)` | Coberto |
| FA01, RN03 (rotas abertas, temporário) | F01 | os testes de CA03 e CA04 | Coberto |
| RF02, CA02 (formulário de login) | F02 | `should show the e-mail and password fields and the submit button (CA02)` | Coberto |
| RN02, CA07 (envio não gera requisição) | F02 | `should not send any request when the login form is submitted (CA07)` | Coberto (teste de caracterização, sem RED) |
| RF05, CA05 (endereço da API) | base do projeto (etapa 2), teste na etapa 3 | `should expose the API base URL from VITE_API_BASE_URL (CA05)` | Coberto (sem RED válido; validado por mutação) |
| RN01, CA06 (`.env` fora do repositório) | base do projeto (etapa 2) | comando do Git (`docs/uc/uc17/evidencias/A/base-env-versionado.txt`) | Coberto por comando |
| RF09, CA08 (idioma e título; acrescentados depois do gate, além do material) | base do projeto, depois da etapa 4 | `should declare the page language as Brazilian Portuguese (CA08)` e `should use CeliLac as the page title (CA08)` | Coberto |
| RF06 (autenticar na API) | — | nenhum | Não implementado (ADR-001 aceita) |
| RF07 (proteger o dashboard) | — | nenhum | Não implementado (ADR-001 aceita) |
| RF08 (controle por perfil) | — | nenhum | Não implementado (ADR-001 aceita) |
| P1 (endereço inexistente) | — | nenhum | Aguardando decisão (mantida em aberto por `evertonfoz` em 2026-11-28) |
| P2 (variável da API ausente) | — | nenhum | Aguardando decisão (mantida em aberto por `evertonfoz` em 2026-11-28) |
| P3 (recarga no envio do formulário) | — | nenhum | Aguardando decisão (mantida em aberto por `evertonfoz` em 2026-11-28) |
| P4 (regras de credenciais e token) | — | nenhum | Aguardando decisão |

### 3.1. Checklist do material
O material traz um checklist **já marcado**. Marcação não é prova: os 15 itens foram conferidos até a etapa 4, em 2026-11-28.

| Item do material | Como foi provado | Situação |
|---|---|---|
| Projeto criado com Vite e React TypeScript | `docs/uc/uc17/evidencias/A/base-versoes.txt` e `docs/uc/uc17/evidencias/B/conf-verificacao.txt` | Conferido |
| Dependências instaladas com `npm install` | `docs/uc/uc17/evidencias/A/base-instalacao.txt` e `docs/uc/uc17/evidencias/B/conf-verificacao.txt` | Conferido, com diferença: foi usado o `pnpm` |
| React Router DOM instalado | `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido, com diferença: pacote `react-router` (ADR-002) |
| Estrutura de pastas organizada | `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido; há a mais `src/test/` e os arquivos de teste |
| Arquivos desnecessários removidos | `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido; os quatro citados estão ausentes; `public/favicon.svg` foi mantido |
| Variável `VITE_API_BASE_URL` configurada | teste de CA05 e `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido, com diferença: porta 3200, e não 3000 |
| Arquivo `.env.example` criado | `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido |
| `.env` adicionado ao `.gitignore` | `docs/uc/uc17/evidencias/B/conf-material.txt` | Conferido |
| Página de Login criada | teste de CA02 e `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido |
| Página de Dashboard criada | teste de CA03 e `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido |
| Página de Acesso Negado criada | teste de CA04 e `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido |
| Arquivo de rotas `AppRoutes.tsx` funcionando | testes de CA01, CA03 e CA04 e `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido |
| `apiClient.ts` criado | teste de CA05 | Conferido; nenhuma tela o usa ainda |
| CSS global aplicado | `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido, com acréscimo declarado de estilo mínimo para o formulário |
| Rotas testadas no navegador | `docs/uc/uc17/evidencias/B/conf-navegador.txt` | Conferido no Chrome sem janela, na porta 5273 |

## 4. Fatias e prontidão (DoR)

| Critério | F01 | F02 |
|---|---|---|
| Objetivo claro | sim | sim |
| Escopo delimitado | sim | sim |
| Critérios verificáveis | CA01, CA03, CA04 | CA02, CA07 |
| Dependências conhecidas | base do projeto | F01 |
| Informações disponíveis | sim | sim; P3 em aberto |
| Responsável | `evertonfoz` | `evertonfoz` |
| Revisão concluída | sim (`evertonfoz`, 2026-11-28; modo solo, não independente) | sim (idem) |
| Situação | `Ready` | `Ready` |

O teste de CA07 tende a passar sem falhar antes: se isso ocorrer, será registrado como teste de caracterização e validado por mutação.

## 5. Evidências
| # | Afirmação | Etiqueta | Evidência (arquivo em `evidencias/`) |
|---|---|---|---|
| 1 | Não havia issue nem ocorrência do UC17 | Executado nesta fase | `docs/uc/uc17/evidencias/A/busca-existencia.txt` |
| 2 | Não foi encontrada autenticação na API | Executado nesta fase | `docs/uc/uc17/evidencias/A/api-sem-autenticacao.txt` |
| 3 | Versões publicadas na data | Executado nesta fase | `docs/uc/uc17/evidencias/A/versoes-publicadas.txt` |
| 4 | Testes do validador no novo local | Executado nesta fase | `docs/uc/uc17/evidencias/A/testes-do-validador.txt` |
| 5 | `state.yaml` válido | Executado nesta fase | `docs/uc/uc17/evidencias/A/estado-valido.txt` |
| 6 | O validador recusa fatia `integrada` sem provas | Executado nesta fase | `docs/uc/uc17/evidencias/A/estado-quebrado-de-proposito.txt` |
| 7 | `state.yaml` restaurado | Executado nesta fase | `docs/uc/uc17/evidencias/A/estado-restaurado.txt` |
| 8 | Conferência de links e caminhos (limpa desde a etapa 4; no gate havia duas referências quebradas) | Executado nesta fase | `docs/uc/uc17/evidencias/A/links.txt` |
| 9 | Issues, vínculos, Project, estados e itens | Executado nesta fase | `docs/uc/uc17/evidencias/A/publicacao.txt` |
| 10 | `state.yaml` conferido com o GitHub | Executado nesta fase | `docs/uc/uc17/evidencias/A/estado-remoto.txt` |
| 11 | F01 e F02 movidas para `Ready` após a revisão | Executado nesta fase | `docs/uc/uc17/evidencias/A/fatias-prontas.txt` |
| 12 | Estado após a validação do gate | Executado nesta fase | `docs/uc/uc17/evidencias/A/gate-aprovado.txt` |
| 13 | Base: versões instaladas, sem conflito | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-versoes.txt` |
| 14 | Base: instalação pelo arquivo de travamento | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-instalacao.txt` |
| 15 | Base: build | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-build.txt` |
| 16 | Base: lint | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-lint.txt` |
| 17 | Base: `.env` ignorado | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-env.txt` |
| 18 | Base: arquivos do projeto | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-arquivos.txt` |
| 19 | Base: servidor de desenvolvimento | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-servidor.txt` |
| 20 | Base: `.env.example` versionado e `.env` fora do repositório, após o commit | Executado nesta fase | `docs/uc/uc17/evidencias/A/base-env-versionado.txt` |

> As linhas 13 a 20 são da base do projeto (etapa 2), guardadas em `evidencias/A/` como no módulo 4 do curso, e registradas depois da validação do gate.

## 6. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todo item do UC mapeado (fatia, ADR ou pergunta) | seção 3 | aprovado | `evertonfoz`, 2026-11-28 |
| Issue principal e sub-issues conferem com o `state.yaml` | `check-state.sh --remote` | aprovado | `evertonfoz`, 2026-11-28 |
| Cada fatia tem teste RED nomeado e DoR avaliada | seções 3 e 4 | aprovado | `evertonfoz`, 2026-11-28 |
| GitHub Project com os cinco estados | listagem em `evidencias/A/` | aprovado | `evertonfoz`, 2026-11-28 |
| Links e caminhos dos documentos existem | `check-links.mjs` | **não atendido** no gate; passou a conferir na etapa 4, validada por `evertonfoz` em 2026-11-28 | gate validado com esta ressalva por `evertonfoz`, 2026-11-28 |

## 7. Decisões e hipóteses
- **Aceitas por `evertonfoz` em 2026-11-28:** ADR-001, ADR-002 e ADR-003.
- **Aprovados na mesma data:** o recorte desta entrega e os critérios CA01 a CA07. P1, P2 e P3 mantidas em aberto.
- **Base do projeto (etapa 2) validada por `evertonfoz` em 2026-11-28.**
- **Hipóteses:** código `UC17`; especificação e descrição prévia redigidas pelo assistente; acréscimo de um mínimo de CSS para o formulário, que o material não traz.

## 8. Pendências e riscos
- A especificação citada na issue #171 está na branch do PR #174, ainda fora da `main`. A issue ainda a descreve como não publicada.
- Resolvido na etapa 4: as duas citações ao script `scripts/verify.sh`, feitas pelo método copiado, faziam o `check-links.mjs` e um teste do validador falharem. O script foi criado (`docs/uc/uc17/evidencias/B/conf-validador.txt`).
- O validador diz se o arquivo é coerente, não se o trabalho foi feito.
- Revisão em modo solo não é revisão independente.
