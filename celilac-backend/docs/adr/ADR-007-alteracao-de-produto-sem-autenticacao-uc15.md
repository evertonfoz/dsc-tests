# ADR-007 — Alteração de produto sem autenticação por enquanto (UC15)

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC15)
- **Caso de uso / fase:** UC15 — Alterar Produto, Etapa 1

## Contexto
O projeto não tem autenticação. A busca (UC14) já é pública por decisão do estudante. Diferente da consulta, a alteração **grava dados**, então qualquer cliente que conheça um `productId` pode renomear o produto.

## Decisão
`PUT /products/:productId` é público por enquanto, sem autenticação nem permissões.

## Condição para retomar
Quando o projeto introduzir autenticação (UC próprio). A alteração deve então passar a exigir permissão.

## Consequências
- (+) UC simples e coerente com os UCs 12 a 14.
- (−) Qualquer cliente da API pode alterar nomes de produtos; adequado apenas ao ambiente didático atual.

## Alternativas consideradas
- Exigir autenticação já no UC15 — descartada: o projeto não tem o mecanismo e criá-lo é outro UC.
