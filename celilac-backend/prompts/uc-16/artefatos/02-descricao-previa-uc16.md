# 02 — Descrição prévia do UC16 (módulo 0)

> **Situação:** redigida pelo assistente **a partir das decisões confirmadas pelo estudante** nesta execução (3a a 3d e 3.2), a pedido dele (o estudante não tinha a descrição). É **proposta do estudante** até ele revisar e aprovar; nada aqui é requisito aprovado por si só.
> Siglas: **UC** (caso de uso), **HTTP** (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), **UUID** (*Universally Unique Identifier*, identificador único universal), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural).

## Quem usa

Qualquer consumidor da API de produtos que conheça o identificador (`productId`) de um produto. Por enquanto a operação é pública, sem autenticação, como nos UCs 12 a 15. Isso é mais arriscado que na alteração (remover tira o produto de circulação) e vai para uma ADR própria.

## Caso normal

O consumidor envia `DELETE /products/<productId>`, sem corpo. O produto ativo com esse identificador recebe a marca de remoção (`deletedAt` com o instante atual). O registro **permanece** no banco. O sistema responde `204` sem corpo.

## Duas regras

1. **A remoção é lógica e só vale para produto ativo.** O produto não é apagado: `productId` e `name` ficam como estavam e `deletedAt` passa a ter valor. Produto inexistente ou **já removido** responde `404`, e a segunda tentativa **não altera** o instante original da remoção.
2. **O produto removido passa a ser tratado como inexistente em todo o resto.** A listagem não o traz (nem no total), a busca responde `404` e a alteração também. Os outros produtos não são afetados.

Regra complementar, ainda candidata: entre duas remoções simultâneas do mesmo produto, exatamente uma tem sucesso e a outra responde `404`.

## Uma situação de falha

A gravação falha (por exemplo, banco indisponível). O sistema responde `500` com mensagem genérica, sem expor a causa, e o produto **continua ativo**: nada foi removido pela metade.

Outras falhas previstas: identificador que não é UUID (`400`) e produto inexistente ou já removido (`404`).

## Como eu mostraria

| Item | Como mostro |
|---|---|
| Caso normal | Teste de integração: removo um produto criado pelo teste, recebo `204` sem corpo e confiro no banco de testes que `deletedAt` tem valor e `productId` e `name` seguem iguais. Cenário `.http` com o resultado esperado no título |
| Removido = inexistente no resto | Teste de ciclo completo: cadastro, remoção, e então `GET /products/:productId` e `PUT` respondem `404`, e `GET /products` não traz o produto e o total diminui em 1 |
| Só o alvo é afetado | Teste com dois produtos: removo um e o outro continua na listagem, com o mesmo nome |
| Já removido ou inexistente | Teste: segunda remoção responde `404` e o `deletedAt` gravado é o da primeira; UUID sem registro responde `404` |
| Falha de persistência | Teste com repositório que falha: `500` genérico e, na leitura seguinte, o produto continua ativo |
| Remoções simultâneas | Teste no banco de testes: duas remoções em paralelo do mesmo produto resultam em um `204` e um `404` |
