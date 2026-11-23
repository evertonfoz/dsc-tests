# 00 — UC de referência, entidade, campos, artefatos e mapa de fontes (UC14)

## Variáveis confirmadas

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC12 — `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | Resposta do estudante |
| `ENTIDADE` | `Product` (módulo `products`, identificador `productId`) | Resposta do estudante + código |
| `CHAVE` | `productId` (UUID) | Resposta do estudante (P1) |
| `CAMPOS` | `productId`, `name` | Resposta do estudante (P2) |
| `ALVO` | UC14 — Buscar Produto por `productId` (`prompts/uc-14-buscar-produto.md`) | Resposta do estudante |
| `ARTEFATOS` | `prompts/` (pasta do prompt), versionados | Resposta do estudante |

## Régua extraída do `REF` (13 seções)

Identificação; objetivo; atores; pré e pós-condições; fluxo principal; FA/FE; RN; validações; RF; considerações arquiteturais; CA; escopo. Lacunas do `REF` supridas pelo UC14: CA sem ligação a RF/RN, sem rastreabilidade e sem dados retornados.

## Decisão campo → retornado → justificativa

| Campo | Tipo | Origem | Retornado? | Justificativa |
|---|---|---|---|---|
| `productId` | uuid | Entidade, ORM, `ProductResponseDto` | Sim | Identificador, já retornado no cadastro e na listagem |
| `name` | varchar(120) | Entidade, ORM, `ProductResponseDto` | Sim | Mesmo conjunto da listagem (P2) |
| `deletedAt` | `Date \| null` | Entidade, ADR-005 | **Não** | Atributo interno (ADR-005, decisão 2) |
| preço | — | Não existe (ADR-002) | Não | Fora de escopo |

## Mapa de fontes (seção 2.1 do `uc-buscar.md`), conferido em somente leitura

| Fonte esperada | Encontrada? | Caminho real |
|---|---|---|
| `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | Sim | `docs/planejamento/uc12-cadastrar-produto/uc-12.md` |
| Materiais `prompts/01` a `prompts/13` | Sim (com sufixo) | `prompts/uc-12/01-planejamento-...md` a `13B-guia-verificacao-pos-atividade.md` |
| `prompts/uc-buscar-por-que-este-metodo.md` | Sim | `prompts/uc-buscar-por-que-este-metodo.md` |
| `method/didatico/curso/m00-o-caso-pronto.md` e `m00-pratica.md` | Sim | `method/didatico/curso/m00-o-caso-pronto.md`, `m00-pratica.md` (existência conferida; conteúdo não lido nesta execução) |
| `prompts/uc-listar.md` e resumo do UC13 | Sim | `prompts/uc-listar.md`, `prompts/uc-listar-resumo-da-execucao-uc13.md` |
| `docs/uc/`, `docs/adr/`, `project-profile.md`, `method/` | Sim | `docs/uc/uc12`, `docs/uc/uc13`, `docs/adr/ADR-001` a `ADR-005`, `project-profile.md`, `method/` |
| Modelos de issue | Sim | `../.github/ISSUE_TEMPLATE/fatia.yml` e `fase.yml` (raiz do git) |

## Observação

A descrição prévia do módulo 0 **não existia**: a Etapa 1 partiu sem ela, a pedido do estudante, que autorizou o assistente a propor o UC e respondeu às pendências P1 a P6.
