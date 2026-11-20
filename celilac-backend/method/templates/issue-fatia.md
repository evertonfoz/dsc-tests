# [<UC>][F<NN>] <Comportamento em uma frase>

> Modelo do corpo de uma Sub-Issue de **fatia**. Uma fatia é um comportamento verificável do caso de uso.
> Não crie fatias "só de teste", "só de DTO" ou "só de controller".

## 1. Comportamento
<Descreva em termos observáveis: dado X, quando Y, então Z.>

## 2. Origem no caso de uso
| Tipo | Identificadores |
|---|---|
| Fluxo | <principal / FA.. / FE..> |
| Regras de negócio | <RN..> |
| Requisitos | <RF..> |
| Critérios de aceite | <CA..> |

## 3. Teste RED esperado
- **Nome do teste:** `<texto exato do it(...)>`
- **Nível:** unitário (núcleo) — adaptadores entram na Fase C
- **Falha esperada antes da implementação:** <mensagem/razão>

## 4. Escopo
- **Dentro:** <o que esta fatia entrega>
- **Fora:** <o que fica para outras fatias ou fases>

## 5. Definition of Ready
- [ ] Objetivo claro e escopo delimitado
- [ ] Critérios de aceite verificáveis (item 2) e teste RED nomeado (item 3)
- [ ] Dependências identificadas (outras fatias)
- [ ] Responsável e revisor definidos
- [ ] WIP respeitado

## 6. Dependências
<Fatias que precisam estar integradas antes, ou "nenhuma".>

## 7. Entrega
- Branch: `feature/<uc>-<fatia>-<resumo>`
- Um PR; commits separados de RED, GREEN e (se houver) REFACTOR; mensagens com `(refs #<esta issue>)`.
- Evidências: saída do RED e do GREEN em `docs/uc/<uc>/evidencias/B/`.

## 8. Labels sugeridas
`<uc>` · `type:feature` · `layer:<...>` · `priority:<...>`
