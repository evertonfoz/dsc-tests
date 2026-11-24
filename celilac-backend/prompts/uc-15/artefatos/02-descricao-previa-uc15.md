# 02 — Descrição prévia do UC15 (módulo 0)

> **Situação:** redigida pelo assistente **a partir das decisões 1 a 14 confirmadas pelo estudante** nesta execução, a pedido dele (o estudante não tinha a descrição). É **proposta do estudante** até ele revisar e aprovar; nada aqui é requisito aprovado por si só.
> Siglas: **UC** (caso de uso), **HTTP** (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), **UUID** (*Universally Unique Identifier*, identificador único universal), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural).

## Quem usa

Qualquer consumidor da API de produtos que conheça o identificador (`productId`) de um produto. Por enquanto a operação é pública, sem autenticação, como nos UCs 12 a 14.

## Caso normal

O consumidor envia `PUT /products/<productId>` com o corpo `{ "name": "<novo nome>" }`. O produto ativo com esse identificador passa a ter o novo nome. O sistema responde `200` com o produto atualizado, contendo `productId` e `name`.

## Duas regras

1. **Só o nome muda.** O identificador e o atributo interno `deletedAt` não são alteráveis: se vierem no corpo, são ignorados (ADR-004, item 4), e o produto continua com o mesmo `productId` e o mesmo estado de remoção.
2. **O novo nome segue a mesma regra do cadastro:** não pode ser vazio nem só espaços e tem no máximo 120 caracteres (ADR-004). Produto removido (soft delete, ADR-005) conta como inexistente e não pode ser alterado.

Regra complementar, ainda candidata: alterar para o mesmo nome que o produto já tem é sucesso (`200`). Em alterações simultâneas vale a última gravação (*last write wins*).

## Uma situação de falha

O nome enviado é inválido (por exemplo, só espaços). O sistema responde `400` no formato do `ValidationPipe` e **nada é gravado**: o produto continua com o nome anterior.

Outras falhas previstas: identificador que não é UUID (`400`), produto inexistente ou removido (`404`) e falha ao gravar (`500` genérico, sem expor a causa e sem alteração pela metade).

## Como eu mostraria

| Item | Como mostro |
|---|---|
| Caso normal | Teste de integração: altero o nome, recebo `200` com `productId` e `name` novos e releio por `GET /products/:productId`. Cenário `.http` com o resultado esperado no título |
| Só o nome muda | Teste: envio `productId` e `deletedAt` no corpo, e o identificador e o estado de remoção seguem iguais; a resposta não traz `deletedAt` |
| Mesma regra do nome | Teste com nome vazio, só espaços, 121 caracteres e ausente: `400` e produto relido com o nome anterior |
| Falha (nome inválido) | Teste de que o Repository não é chamado e, na integração, o nome gravado não mudou |
| Removido = inexistente | Teste com `deletedAt` preenchido: `404`, igual ao produto que nunca existiu |
| Última gravação vale | Teste: duas alterações em sequência no mesmo produto deixam o nome da segunda |
