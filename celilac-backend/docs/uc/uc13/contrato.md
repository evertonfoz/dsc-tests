# Contrato — GET /products (UC13)

> Fatos vêm dos testes `products.list.controller.spec.ts` (HTTP) e do spec PostgreSQL de persistência, executados em 2026-11-23 (`docs/uc/uc13/evidencias/C/`). Decisões: UC13, ADR-003, ADR-004 e ADR-005. Verificação no ambiente containerizado: **Aguardando evidência** (Fase E).

## Requisição
`GET /products?page=<inteiro>&limit=<inteiro>`. Ambos opcionais; `page` ≥ 1 (padrão 1); `limit` entre 1 e 100 (padrão 20; o teto 100 foi confirmado pelo estudante). Parâmetros desconhecidos são ignorados.

## Respostas
| Situação | Resposta | Situação do item |
|---|---|---|
| Há produtos ativos | 200 `{ items: [{ productId, name }], page, limit, total }`, ordenados por `name` e `productId` | Implementado e testado |
| Não há produtos ativos, ou página além do fim | 200 `{ items: [], page, limit, total }` | Implementado e testado |
| `page` ou `limit` inválidos (`0`, negativo, decimal, não numérico, `limit` > 100) | 400, formato do ValidationPipe (`message` em lista, `error: "Bad Request"`) | Implementado e testado |
| Falha ao consultar a persistência | 500 `{ statusCode, message: "Product listing could not be completed.", error: "ProductPersistenceFailedException" }` | Implementado e testado (mock); falha real no PostgreSQL **não** exercitada |
| Rota inexistente | 404 padrão do Nest | Implementado e testado |

## Sempre verdadeiro
- Só produtos com `deletedAt` nulo entram na lista e no `total`.
- Cada item expõe apenas `productId` e `name`; `deletedAt` e quaisquer campos internos não aparecem.
- A mensagem do erro 500 é genérica: sem host, porta, relação ou SQL.

## Mudança em relação ao contrato anterior
`GET /products` respondia 404. Hoje responde 200. A checagem do `run-checks.sh` foi atualizada de acordo (decisão do estudante, CA12 mantém o 404 para rotas inexistentes).

## Fora do contrato
Filtros, busca, ordenação escolhida pelo cliente, autenticação, preço (ADR-002) e remoção de produto.
