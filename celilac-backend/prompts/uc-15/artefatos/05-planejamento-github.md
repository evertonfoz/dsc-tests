# 05 — Planejamento no GitHub (proposta, nada criado)

> **Situação:** apenas proposta (3.4). Nenhuma Issue, branch, PR ou item de Project foi criado. Números reais de Issue só existirão depois de criadas, com autorização do estudante.
> Padrão seguido: UC14 (Epic #126 e Sub-Issues F01, C1, C2, D, E, F).

## Epic

`[UC15] Alterar Produto` — labels propostas: `type:feature`, `module:products`, `uc15`. Responsável: A definir.

## Sub-Issues propostas (≥ 5, cada uma um comportamento verificável)

| # | Título proposto | Camada | Comportamento verificável | Depende de |
|---|---|---|---|---|
| F01 | `[UC15][F01]` Alterar nome de produto ativo no núcleo (Service + Repository + memória) | domain | Sucesso, inexistente, removido, nome inválido, falha de persistência, atributos preservados | — |
| C1 | `[UC15][Fase C1]` Adaptador HTTP de `PUT /products/:productId` | http | `200`, `400` (id e nome inválidos), `404`, campos extras ignorados, sem vazamento de `deletedAt` | F01 (obrigatória) |
| C2 | `[UC15][Fase C2]` Persistência real: atualização de produto ativo no TypeORM | persistence | Atualiza só produto ativo; não altera removido; sem migration | F01 (obrigatória) |
| D | `[UC15][Fase D]` Contrato de `PUT /products/:productId` | api / docs | Contrato documentado e testes de contrato | C1, C2 |
| E | `[UC15][Fase E]` Verificação reprodutível da alteração | tests | `.http`, `run-checks.sh` (Esperado × Obtido), atualização do contrato anterior | D |
| F | `[UC15][Fase F]` Auditoria e encerramento do UC15 | docs | Auditoria arquitetural, cobertura, roteiro de conclusão | E |

Sem Sub-Issue por fase RED/GREEN/REFACTOR.

## Project

Estados: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`. Estado inicial das Sub-Issues: `Backlog` (F01 `Ready` após a aprovação do UC).

## `state.yaml`

Se aprovado, criar `docs/uc/uc15/state.yaml` a partir de `method/templates/state.yaml` e validar com `method/scripts/check-state.sh`. O `arquetipo` seria `atualizar`. **Limite declarado:** `atualizar` é um **esboço** do método (de início só `criar` tinha sido exercitado em caso real; a consulta foi exercitada no UC14). Verificar o que `method/playbooks/matriz-arquetipos.md` e `method/scripts/check-state-core.mjs` aceitam antes de criar.
