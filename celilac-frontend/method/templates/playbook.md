# Playbook — <Fase ou tarefa de fundação>

> Modelo de playbook. Um playbook é curto (alvo: 3 a 6 KB), descreve **uma** fase e não contém dados de nenhum projeto específico.
> Nomes, portas, comandos e números vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`.
> Exemplos reais (do CeliLac, no repositório do curso) ficam em `method/exemplos/`, nunca aqui. <!-- links:ignore -->

| Campo | Valor |
|---|---|
| Camada | 0 (Fundação) · 1 (Ciclo do UC) |
| Fase | A · B · C · D · E · F · (fundação: nome) |
| Arquétipos | criar · consultar · atualizar · excluir · autenticar (e o grau de validação de cada um: ver `matriz-arquetipos.md`) |
| Depende de | <fases/playbooks anteriores> |
| Valida-se com | <comandos e/ou CI> |

## 1. Objetivo
<Uma ou duas frases: o que existe ao final que não existia antes.>

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md`, `docs/uc/<uc>/state.yaml`, <outros>.
### 2.2. A perguntar à pessoa (somente se faltar)
- <pergunta objetiva> — *por que é necessária:* <motivo>.

## 3. Gate de entrada
Condições que precisam ser verdadeiras para começar (verificáveis).
- [ ] <ex.: fase anterior concluída no `state.yaml`>
- [ ] `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` sem erros

## 4. Passos
Cada passo: **ação** · **como verificar** · **evidência a guardar**.
1. <ação> — verificar: <comando/critério> — evidência: `evidencias/<fase>/<arquivo>`
2. …

> Pare e pergunte antes de qualquer ação destrutiva ou irreversível (ver `AGENTS.md`, regra 8).

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Relatório da fase | `docs/uc/<uc>/relatorios/<fase>.md` (template `relatorio-de-fase.md`) | sim |
| Evidências brutas | `docs/uc/<uc>/evidencias/<fase>/` | sim |
| ADR | `docs/adr/` (template `adr.md`) | se houve decisão |
| `state.yaml` atualizado | `docs/uc/<uc>/state.yaml` | sim |

## 6. Gate de saída
Cada item é verificável e tem **quem valida** (pessoa ou CI). O agente **não** marca `aprovado`.
| Verificação | Como | Quem valida |
|---|---|---|
| | | |

## 7. Proibições da fase
- <o que não fazer>

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | | validado (UC12) |
| consultar | | esboço |
| atualizar | | esboço |
| excluir | | esboço |
| autenticar | | esboço |

## 9. Erros comuns
- <sintoma> → <causa provável> → <correção segura>

## 10. Para o estudante (didático)
- **O que esta fase ensina:** <conceito>
- **Pergunte-se:** <2 a 3 perguntas de verificação>
- **Documento didático relacionado:** `method/didatico/<NN>-<nome>.md`
