# Contrato — DELETE /products/:productId (UC16)

> Fatos vêm dos testes `products.remove.controller.spec.ts` (HTTP), `products.service.remove.spec.ts` (núcleo), do spec PostgreSQL de persistência (bloco "remoção lógica no PostgreSQL (UC16)") e de `test/products/remover-produto.e2e-spec.ts`, executados em 2026-11-24 (`docs/uc/uc16/evidencias/C/`). Decisões: `prompts/uc-16/artefatos/03-uc-16-remover-produto.md`, ADR-008 a ADR-011 (e ADR-005 para a marca de remoção). Verificação no contêiner (Fase E): Aguardando evidência.

## Requisição
`DELETE /products/:productId`. `productId` é um UUID de qualquer versão. Não há corpo esperado: se houver, é ignorado. A rota é pública por enquanto (ADR-008).

## Respostas (Esperado × Obtido nos testes)
| Situação | Resposta | Prova |
|---|---|---|
| Produto ativo existe | `204` sem corpo; o produto continua no banco com `deletedAt` preenchido e os mesmos `productId` e `name` | controller (CA01), e2e e PostgreSQL (CA06) |
| Corpo enviado na requisição | `204`; o corpo (`productId`, `name`, `deletedAt`) é ignorado | controller e e2e (CA10) |
| UUID válido sem produto | `404` `{ statusCode: 404, message: "Product with id \"<id>\" was not found.", error: "ProductNotFoundException" }` | controller, e2e e PostgreSQL (CA07) |
| Produto já removido (`deletedAt` preenchido) | `404`, idêntico ao inexistente; o `deletedAt` original **não muda** | controller, e2e e PostgreSQL (CA08) |
| Segunda remoção seguida do mesmo produto | primeira `204`, segunda `404` | controller e e2e (CA08) |
| `productId` que não é UUID | `400` `{ statusCode: 400, message: ["productId must be a valid UUID."], error: "Bad Request" }`; o Service não é chamado | controller e e2e (CA09) |
| Falha ao gravar na persistência | `500` `{ statusCode: 500, message: "Product removal could not be completed.", error: "ProductPersistenceFailedException" }`, sem host, porta ou SQL; nada é removido | controller com serviço simulado e falha real do PostgreSQL via Service (CA11) |
| Rota inexistente (sub-rota) | `404` padrão do Nest | Aguardando evidência no contêiner (Fase E) |

## Efeito nos outros casos de uso
Depois do `204`, o produto responde `404` em `GET /products/:productId` e em `PUT /products/:productId`, não aparece em `GET /products` e o `total` diminui em 1; os demais produtos seguem ativos (CA02 a CA05). Provado no e2e (`remover-produto.e2e-spec.ts`) e, no núcleo, em `products.service.remove.spec.ts`.

## Sempre verdadeiro
- Só produtos com `deletedAt` nulo são removidos; removido e inexistente são indistinguíveis (RN02, RN07).
- A remoção é lógica: nenhuma linha é apagada, `productId` e `name` permanecem (RN01).
- A gravação é um único `UPDATE` condicionado a `deletedAt IS NULL`: ou marca a linha ou não altera nada (RN05).
- Em remoções simultâneas do mesmo produto, exatamente uma tem sucesso e a outra recebe `ProductNotFoundException`; o `deletedAt` é único (RN08). Provado no PostgreSQL de testes no nível do serviço (duas chamadas simultâneas); não foi testado com duas requisições HTTP simultâneas.
- A resposta de sucesso não tem corpo (RN09); a de erro nunca expõe detalhes internos.

## Mudança em relação ao contrato anterior
`DELETE /products/:productId` respondia `404` do framework (rota inexistente). Hoje responde `204`, `404` de domínio ou `400`. Nenhum teste, `.http` ou checagem do `run-checks.sh` fixava o `404` anterior (conferido por `grep` de `DELETE` em `test`, `src`, `http-rest-client` e nos scripts antes desta fase).

## Fora do contrato
Autenticação e permissões (ADR-008), restauração (ADR-009), remoção física (ADR-010), remoção em lote (ADR-011), concorrência HTTP simultânea (não testada), dependências de outras entidades (a conferir na Fase F).
