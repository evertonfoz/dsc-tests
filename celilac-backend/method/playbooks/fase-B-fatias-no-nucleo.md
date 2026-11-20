# Playbook — Fase B: Fatias no núcleo

> Procedimento curto e sem dados de projeto. Nomes, comandos e números vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`. Definição de fatia e divisão B/C: `method/decisoes/ADR-003-fatia-fases-b-c-e-arquetipos.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | B — Fatias no núcleo |
| Arquétipos | criar *(validado)* · consultar, atualizar, excluir, autenticar *(esboços, ver `matriz-arquetipos.md`)* |
| Depende de | Fase A aprovada; Fundação (CI verde) |
| Valida-se com | testes unitários (`pnpm test` ou o comando do perfil) · CI · revisão humana de cada PR |

## 1. Objetivo
Entregar **cada fatia** do caso de uso **no núcleo** (domínio + serviço de aplicação, com a porta de repositório e um adaptador em memória), por TDD, em **um PR por fatia**. Ao final, o comportamento existe e é provado por teste unitário; ainda **não** é acessível por HTTP nem persiste em banco (isso é a Fase C).

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md` (comandos de teste, convenção de branch e commit, estrutura de código).
- `docs/uc/<uc>/state.yaml` (fatias, critérios, issues, responsáveis) e o relatório da Fase A.
- Issue de cada fatia (comportamento, teste RED nomeado, escopo).
### 2.2. A perguntar (somente se faltar)
- **Qual fatia começar** quando houver mais de uma `Ready` — *a ordem segue dependências e a ordem feliz → validação → regra → falha*.
- **Quem revisa** o PR, se o `state.yaml` não indicar — *a integração exige revisão humana*.

## 3. Gate de entrada
- [ ] Fase A com gate aprovado por pessoa (`por` preenchido) e `check-state.sh --remote` sem erros.
- [ ] A fatia está `Ready`, tem issue e teste RED nomeado, e suas dependências estão integradas.
- [ ] Branch principal com CI verde e árvore de trabalho limpa.

## 4. Passos (repetir para **cada fatia**, uma por vez)
1. **Branch** a partir da principal atualizada, com a convenção do perfil (`feature/<uc>-<fatia>-<resumo>`). `state.yaml`: fatia `em_andamento` (exige issue e branch).
2. **RED** — escrever **apenas** o teste nomeado na issue. Executá-lo e confirmar que falha **pelo motivo esperado** (comportamento ausente), não por erro de compilação ou de configuração. — evidência: saída em `evidencias/B/<fatia>-red.txt`. Commit só do teste: `test(<escopo>): <comportamento> (refs #N)`.
3. **Draft PR** com a issue, o critério coberto e a evidência do RED. `state.yaml`: registrar `pr`.
4. **GREEN** — o mínimo de código que faz o teste passar, no núcleo. Nada de HTTP, banco, DTO de resposta ou funcionalidade de outra fatia. — evidência: `evidencias/B/<fatia>-green.txt`. Commit: `feat(<escopo>): … (refs #N)`.
5. **REFACTOR** (se houver necessidade) — melhorar nomes e estrutura **sem mudar comportamento**, com os testes verdes antes e depois. Commit separado: `refactor(<escopo>): … (refs #N)`. Se não houve, registre "sem refatoração".
6. **Regressão** — rodar toda a suíte rápida e a verificação local do perfil; comparar com a linha de base (nenhum teste antes verde pode falhar). — evidência: `evidencias/B/<fatia>-suite.txt`.
7. **Marcar o PR como pronto**; `state.yaml`: `em_revisao`. Mostrar o diff, o RED/GREEN e a regressão e **aguardar a revisão humana**.
8. **Integração (humana)** — a pessoa aprova e faz o merge. Só então: fatia `integrada` (exige `revisor` e `evidencias`), issue fechada **com PR integrado e link da evidência** (regra 14), `check-state.sh` sem erros.
9. **Próxima fatia** parte da principal já atualizada (sem PR empilhado).

Ao fim de todas as fatias: **relatório da Fase B** (`relatorio-de-fase.md`) com a tabela fatia → teste que a prova → PR, e `check-links.mjs`. Mostrar o gate de saída e **aguardar validação**.

> Pare e pergunte antes de qualquer ação destrutiva ou irreversível (regra 8), inclusive `push --force` e apagar branches.

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Código e testes de cada fatia | PRs (um por fatia) | sim |
| Evidências RED, GREEN e regressão | `docs/uc/<uc>/evidencias/B/` | sim |
| Relatório da fase | `docs/uc/<uc>/relatorios/B.md` | sim |
| `state.yaml` atualizado | `docs/uc/<uc>/state.yaml` | sim |
| ADR | `docs/adr/` | se houve decisão (ex.: regra ambígua do UC) |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Todas as fatias `integrada`, cada uma com PR, revisor e evidências | `check-state.sh --remote` | CI / pessoa |
| Cada fatia tem teste RED→GREEN com commits separados | histórico do PR + evidências | pessoa responsável |
| CI verde na branch principal | resultado do CI | CI |
| Tabela fatia → teste confere com o código | relatório B | pessoa responsável |

O agente **não** marca `aprovado` nem faz merge (regras 9 e 21).

## 7. Proibições da fase
- Código de produção sem teste RED anterior; teste escrito já passando (não prova nada).
- Implementar HTTP, DTO de resposta ou persistência real: é a Fase C.
- Misturar duas fatias no mesmo PR; PRs empilhados por padrão.
- Alterar o teste para "fazer passar" sem registrar o motivo.
- Integrar com teste falhando; desabilitar ou excluir teste para o CI ficar verde.

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | fatias do catálogo do guia (seção 5); porta de repositório com `save` | validado (UC12) |
| consultar | fatias de leitura, sem efeito colateral | esboço |
| atualizar | acrescenta estado anterior e conflitos | esboço |
| excluir | acrescenta integridade e política de remoção | esboço |
| autenticar | acrescenta hash e política de credenciais | esboço |

## 9. Erros comuns
- RED que falha por erro de importação → o teste não mede o comportamento → criar o mínimo para compilar e refazer o RED.
- GREEN com mais do que o necessário → antecipou outra fatia → remover e deixar para a fatia correta.
- PR grande demais → fatia mal cortada → voltar ao guia de fatias e dividir (referência: ~300 linhas de diff).
- Fatia `integrada` sem revisor ou evidência → o `state.yaml` rejeita; complete antes de fechar a issue.
- Suíte "verde" por exclusão de teste → só a lista de falhas conhecidas com ADR pode ser excluída.

## 10. Para o estudante
- **O que esta fase ensina:** TDD com commits que contam a história (RED, GREEN, REFACTOR) e integração em pequenos passos.
- **Pergunte-se:** (1) meu RED falhou pelo motivo certo? (2) o que escrevi no GREEN foi o mínimo? (3) o refactor mudou algum comportamento?
- **Documento didático relacionado:** `method/didatico/` (será o 05, ao fim da Etapa 5).
