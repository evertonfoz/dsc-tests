# Contrato — PUT /products/:productId (UC15)

> Fatos vêm dos testes `products.update.controller.spec.ts` (HTTP), `products.service.update.spec.ts` (núcleo), do spec PostgreSQL de persistência (casos "UC15") e de `test/products/alterar-produto.e2e-spec.ts`, executados em 2026-11-24 (`docs/uc/uc15/evidencias/B/`). Decisões: `prompts/uc-15/artefatos/03-uc-15-alterar-produto.md`, ADR-003 a ADR-007. Verificação no contêiner (Fase E): `run-checks.sh --durability`, 47 ok e 0 falha, em 2026-11-24 (`evidencias/E/run-checks.txt`).

## Requisição
`PUT /products/:productId` com corpo `{ "name": "<novo nome>" }`. `productId` é um UUID de qualquer versão. A rota é pública por enquanto (ADR-007). O nome segue a regra do cadastro (ADR-004): obrigatório, texto, não vazio, não só espaços, até 120 caracteres. Campos extras do corpo (`productId`, `deletedAt`, outros) são ignorados (`whitelist`).

## Respostas (Esperado × Obtido nos testes)
| Situação | Resposta | Prova |
|---|---|---|
| Produto ativo existe e nome válido | `200` `{ productId, name }` com o nome novo, exatamente esses dois campos | controller (CA01, CA02), e2e, PostgreSQL |
| Nome igual ao atual | `200` | controller e e2e (CA09) |
| Campo não alterável no corpo | `200`; `productId` e `deletedAt` não mudam | controller e e2e (CA04) |
| UUID válido sem produto | `404` `{ statusCode: 404, message: "Product with id \"<id>\" was not found.", error: "ProductNotFoundException" }` | controller (CA05), e2e |
| Produto removido (`deletedAt` preenchido) | `404`, idêntico ao inexistente; o produto **não é alterado** | controller, e2e e PostgreSQL (CA06) |
| `productId` que não é UUID | `400` `{ statusCode: 400, message: ["productId must be a valid UUID."], error: "Bad Request" }`; o Service não é chamado | controller e e2e (CA07) |
| Nome ausente, não texto, vazio, só espaços ou com 121 caracteres | `400` no formato do `ValidationPipe` (`message` em lista, `error: "Bad Request"`); **nada é gravado** | controller e e2e (CA08), núcleo |
| Falha ao gravar na persistência | `500` `{ statusCode: 500, message: "Product update could not be completed.", error: "ProductPersistenceFailedException" }`, sem host, porta ou SQL; nome anterior preservado | controller com serviço simulado e falha real do PostgreSQL via Service (CA10) |
| Rota inexistente (sub-rota) | `404` padrão do Nest | `.http` (Aguardando evidência no contêiner) |

## Sempre verdadeiro
- Só produtos com `deletedAt` nulo são alterados; removido e inexistente são indistinguíveis (RN02).
- Só `name` muda; `productId` e `deletedAt` permanecem (RN01).
- A resposta expõe apenas `productId` e `name`; `deletedAt` nunca aparece (RN06).
- A gravação é um único `UPDATE` condicionado a `deletedAt IS NULL`: ou altera a linha ou não altera nada (RN05).
- Em alterações simultâneas vale a última gravação (ADR-006); o teste de duas alterações em sequência documenta a regra (CA11), sem provar concorrência real.

## Mudança em relação ao contrato anterior
`PUT /products/:productId` respondia `404` do framework (rota inexistente). Hoje responde `200`, `404` de domínio ou `400`. Nenhum teste nem checagem do `run-checks.sh` fixava o `404` anterior para essa rota (conferido por `grep` de `PUT` e `404` nos testes e no script antes da alteração).

## Fora do contrato
Autenticação e permissões (ADR-007), controle de concorrência (ADR-006), alteração de outros atributos, alteração em lote, remoção e restauração de produtos, preço (ADR-002).
