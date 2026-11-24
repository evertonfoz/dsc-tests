# ADR-011 — Remoção em lote fora do UC16

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC16)
- **Caso de uso / fase:** UC16 — Remover Produto, Etapa 1

## Contexto
Remover vários produtos de uma vez traz perguntas próprias: tudo ou nada, resposta parcial, limite de itens e formato do corpo.

## Decisão
A remoção em lote está **excluída** do UC16, que trata um produto por vez.

## Condição para retomar
Um UC próprio, se um dia for especificado.

## Consequências
- (+) O UC16 tem contrato simples e erros bem definidos.
- (−) Remover muitos produtos exige várias chamadas.

## Alternativas consideradas
- `DELETE` com lista de identificadores — descartada: exigiria definir erros parciais e limites, fora do escopo.
