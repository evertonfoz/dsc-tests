# ADR-008 — Remoção de produto sem autenticação por enquanto (UC16)

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC16)
- **Caso de uso / fase:** UC16 — Remover Produto, Etapa 1

## Contexto
O projeto não tem autenticação (ADR-007). Diferente da alteração, a remoção **tira o produto de circulação**: qualquer cliente que conheça um `productId` pode removê-lo. Como a remoção é lógica (`deletedAt`), o registro é preservado, mas fica inacessível pela API.

## Decisão
`DELETE /products/:productId` é público por enquanto, sem autenticação nem permissões.

## Condição para retomar
Quando o projeto introduzir autenticação (UC próprio). A remoção deve então passar a exigir permissão e vale tratá-la entre as primeiras operações protegidas, por ser a mais grave.

## Consequências
- (+) UC simples e coerente com os UCs 12 a 15.
- (−) Qualquer cliente da API pode remover produtos; adequado apenas ao ambiente didático atual.

## Alternativas consideradas
- Exigir autenticação já no UC16 — descartada: o projeto não tem o mecanismo, e criá-lo é outro UC.
