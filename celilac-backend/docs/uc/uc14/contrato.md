# Contrato — GET /products/:productId (UC14)

> Fatos vêm dos testes `products.get.controller.spec.ts` (HTTP), `products.service.get.spec.ts` (núcleo), `product-id.pipe.spec.ts`, do spec PostgreSQL de persistência e de `test/products/buscar-produto.e2e-spec.ts`, executados em 2026-11-23 (`docs/uc/uc14/evidencias/B/`). Decisões: `prompts/uc-14-buscar-produto.md`, ADR-003, ADR-004 e ADR-005. Verificação no ambiente containerizado: ver Fase E.

## Requisição
`GET /products/:productId`. `productId` é um UUID de qualquer versão. A rota é pública por enquanto (sem autenticação). Não há corpo nem parâmetros de consulta.

## Respostas (Esperado × Obtido nos testes)
| Situação | Resposta | Prova |
|---|---|---|
| Produto ativo existe | `200` `{ productId, name }`, exatamente esses dois campos | controller (CA01, CA02), e2e |
| UUID válido sem produto | `404` `{ statusCode: 404, message: "Product with id \"<id>\" was not found.", error: "ProductNotFoundException" }` | controller (CA03), e2e, PostgreSQL |
| Produto removido (`deletedAt` preenchido) | `404`, idêntico ao inexistente | controller (CA04), e2e, PostgreSQL |
| `productId` que não é UUID | `400` `{ statusCode: 400, message: ["productId must be a valid UUID."], error: "Bad Request" }`; o Service não é chamado | controller e pipe (CA05), e2e |
| Falha ao consultar a persistência | `500` `{ statusCode: 500, message: "Product lookup could not be completed.", error: "ProductLookupFailedException" }`, sem host, porta ou SQL | controller com serviço simulado (CA06) e falha real do PostgreSQL via Service |
| Rota inexistente | `404` padrão do Nest | e2e e `run-checks.sh` |

## Sempre verdadeiro
- Só produtos com `deletedAt` nulo são retornados; removido e inexistente são indistinguíveis (RN01, RN02).
- A resposta expõe apenas `productId` e `name`; `deletedAt` nunca aparece (RN04).
- A busca não grava nem altera dados (RN05, CA08, provado no PostgreSQL de testes).
- A mensagem do `500` é genérica; a causa fica só em `cause`.

## Mudança em relação ao contrato anterior
`GET /products/:productId` respondia `404` do framework (rota inexistente). Hoje responde `200`, `404` de domínio ou `400`. Nenhum teste nem checagem do `run-checks.sh` fixava o `404` anterior para essa rota.

## Fora do contrato
Autenticação e permissões, busca por outro atributo ou por filtro, busca de produtos removidos, preço (ADR-002) e remoção de produto.
