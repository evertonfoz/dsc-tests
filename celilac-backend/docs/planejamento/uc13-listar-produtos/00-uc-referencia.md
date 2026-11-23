# 00 — UC de referência, entidade, campos e artefatos

## Variáveis confirmadas

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC12 — `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | Resposta do estudante |
| `ENTIDADE` | `Product` (módulo `products`, identificador `productId`) | Código + confirmação |
| `CAMPOS` | `productId`, `name` | Confirmação (todos os atributos atuais) |
| `ALVO` | UC13 — Listar Produtos | Resposta do estudante |
| `ARTEFATOS` | `docs/planejamento/uc13-listar-produtos/` | Confirmação; sem commit por ora |

## Régua extraída do `REF` (13 seções) e lacunas do `REF`

Seções: identificação; objetivo; atores; pré e pós-condições; fluxo principal; FA/FE; RN; validações; RF; considerações arquiteturais; CA; escopo.
Lacunas do `REF`: CA sem ligação explícita a RF/RN; sem tabela de rastreabilidade; sem dados retornados. O UC13 supre as três (régua de 17 itens da 3.3 do prompt).

## Decisão campo → retornado → justificativa

| Campo | Tipo | Origem | Retornado? | Justificativa |
|---|---|---|---|---|
| `productId` | uuid | Entidade, ORM, `ProductResponseDto` | Sim | Identificador |
| `name` | varchar(120) | Entidade, ORM, `ProductResponseDto` | Sim | Pedido: todos os dados |
| *(indicador de soft delete)* | a definir (ver ADR proposta) | Novo, decisão do estudante | **Não** | Atributo interno, usado só para filtrar; não aparece na resposta |
| preço | — | Não existe (ADR-002) | Não | Fora de escopo |
