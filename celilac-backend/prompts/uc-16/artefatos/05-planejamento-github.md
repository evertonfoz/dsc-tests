# 05 — Planejamento no GitHub (proposta, nada criado)

> **Situação:** apenas proposta (3.4). Nenhuma Issue, branch, PR ou item de Project foi criado. Números reais de Issue só existirão depois de criadas, com autorização do estudante.
> Padrão seguido: UC15 (Epic #141, fatias #142 a #146 e fases #147 a #152).

## Epic

`[UC16] Remover Produto` — labels propostas: `type:feature`, `module:products`, `uc16`. Responsável: A definir.

## Sub-Issues propostas (≥ 5, cada uma um comportamento verificável)

| # | Título proposto | Camada | Comportamento verificável | Depende de |
|---|---|---|---|---|
| F01 | `[UC16][F01]` Remover produto ativo no núcleo | domain | Remove o produto ativo e informa o sucesso; `productId` e `name` não mudam (CA01, CA06 no núcleo) | — |
| F02 | `[UC16][F02]` Produto inexistente não é removido | domain | Sem produto ativo, `ProductNotFoundException` e nada é gravado (CA07) | F01 |
| F03 | `[UC16][F03]` Produto já removido é tratado como inexistente | domain | Segunda remoção lança `ProductNotFoundException` e preserva o `deletedAt` original (CA08) | F01 |
| F04 | `[UC16][F04]` Falha de persistência na remoção | domain | `ProductPersistenceFailedException`, sem remoção parcial (CA11) | F01 |
| F05 | `[UC16][F05]` Produto removido some dos outros casos de uso | domain | Depois da remoção, listar, buscar e alterar o tratam como inexistente; os outros produtos seguem ativos (CA02 a CA05) | F01 |
| C1 | `[UC16][Fase C1]` Adaptador HTTP de `DELETE /products/:productId` | http | `204` sem corpo, `400` para identificador inválido, `404`, `500`, corpo ignorado (CA01, CA07 a CA11 na fronteira) | F01 a F05 |
| C2 | `[UC16][Fase C2]` Persistência real: remoção lógica no TypeORM | persistence | Uma única instrução condicionada ao ativo; registro preservado; remoções simultâneas (CA06, CA12); sem migration | F01 a F05 |
| D | `[UC16][Fase D]` Contrato de `DELETE /products/:productId` | api / docs | Contrato documentado e testes de contrato | C1, C2 |
| E | `[UC16][Fase E]` Verificação reprodutível da remoção | tests | `.http`, `run-checks.sh` (Esperado × Obtido), substituição do contrato anterior (`DELETE` respondendo `404`) | D |
| F | `[UC16][Fase F]` Auditoria e encerramento do UC16 | docs | Auditoria arquitetural, cobertura, comparação com o esboço `excluir`, roteiro de conclusão | E |

Sem Sub-Issue por fase RED/GREEN/REFACTOR. O identificador malformado (`400`) é da fase C1 (pipe), não do núcleo.

### Aviso sobre RED que não falha

No UC15, três fatias (F02, F03 e F05) passaram **sem RED**, porque o GREEN de F01 já traduzia as exceções. Aqui a mesma armadilha existe em **F02, F03 e F05**: um bom GREEN de F01 pode já satisfazer o que elas pedem. Para evitar o problema:

1. O GREEN de F01 é **só** o sucesso. Não traduzir "não encontrado" nem falha de persistência nele.
2. Se mesmo assim uma fatia posterior passar de primeira, registrar como **teste de caracterização**, com o motivo, e não como RED.

## Project

Estados: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`. Estado inicial das Sub-Issues: `Backlog` (F01 `Ready` após a aprovação do UC).

## `state.yaml`

Se aprovado, criar `docs/uc/uc16/state.yaml` a partir de `method/templates/state.yaml`, com `arquetipo: excluir` (valor aceito pelo validador), e validar com `method/scripts/check-state.sh`, mostrando a saída real. **Limite declarado:** `excluir` é um **esboço** do método (`method/playbooks/matriz-arquetipos.md`, seção 3.3); o UC16 é o caso que o valida ou corrige.

## Quantos PRs

- **Padrão do método:** um PR por fatia.
- **Alternativa (como no UC15):** um PR único para várias fatias, o que exige `pr_compartilhado: true` em **todas** as fatias desse PR (ADR-005 do método). Com PR único, cada fatia continua precisando do seu estado atualizado quando for integrada.

**Pergunta aberta:** qual dos dois?
