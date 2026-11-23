# ADR-005 — PR compartilhado entre fatias (exceção declarada)

- **Status:** Aceita
- **Data:** 2026-11-23
- **Decisores:** Estudante responsável (piloto do UC13)
- **Origem:** UC13 entregou sete fatias em um único PR (#118), por decisão humana, e o validador rejeitava `PR já usado pela fatia F01`.

## Contexto
A regra 11 do `AGENTS.md` e o validador do `state.yaml` assumem um PR por fatia. No UC13 o estudante escolheu um único PR. O `state.yaml` ficou sem como registrar o PR integrado: a fatia `integrada` exige `pr`, e o `pr` repetido era erro.

## Decisão
1. Cada fatia pode declarar `pr_compartilhado: true` (campo opcional, booleano).
2. O validador aceita o mesmo número de PR em mais de uma fatia **somente se todas as fatias com esse PR declaram `pr_compartilhado: true`**. Caso contrário, o erro `PR #N já usado pela fatia Fxx` continua, com a instrução de declarar.
3. `pr_compartilhado: true` exige `pr` preenchido.
4. O padrão continua sendo **um PR por fatia**. O compartilhamento é exceção decidida pela pessoa responsável e registrada no relatório da fase, com os commits RED e GREEN separados por fatia no mesmo PR.
5. Issue repetida continua proibida.

## Consequências
- (+) O `state.yaml` representa o PR único sem perder a rastreabilidade por fatia (cada fatia mantém sua issue e suas evidências).
- (−) Um PR maior é mais difícil de revisar; a exceção deve ser rara.

## Alternativas consideradas
- **Deixar `pr: null` nas fatias integradas** — descartada: o validador exige `pr` para `integrada`.
- **Registrar o PR em uma só fatia** — descartada: esconde que as outras entraram no mesmo PR.
