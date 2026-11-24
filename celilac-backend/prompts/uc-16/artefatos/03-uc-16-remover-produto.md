# UC16 — Remover Produto

> **Situação:** especificação gerada pela Etapa 1 de [`uc-remover.md`](../uc-remover.md) (Decisão A: o UC não existia). **Aguardando validação do estudante** para iniciar a Etapa 2.
> **Moldado em:** [`03-uc-15-alterar-produto.md`](../../uc-15/artefatos/03-uc-15-alterar-produto.md) (mesmas 13 seções), que segue o `uc-12.md`.
> **Legenda:** **[confirmado]** = decidido pelo estudante nesta execução (decisões 1 a 15); **[candidato]** = proposta do assistente, precisa ser confirmada; **[existente]** = já consta no código ou em ADR.
> **Siglas:** UC (caso de uso), RN (regra de negócio), RF (requisito funcional), CA (critério de aceite), FA/FE (fluxo alternativo / de exceção), DTO (*Data Transfer Object*, objeto de transferência de dados), HTTP (*HyperText Transfer Protocol*), DELETE (método HTTP que remove um recurso), UUID (*Universally Unique Identifier*), ADR (*Architecture Decision Record*), ORM (*Object-Relational Mapping*).

## Valores desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC15 — Alterar Produto | [confirmado] |
| `ENTIDADE` | `Product` (`src/modules/products/entities/product.entity.ts`) | [confirmado] |
| `CHAVE` | `productId` (UUID) | [confirmado] |
| `POLITICA` | remoção **lógica** | [confirmado] |
| `MARCA` | `deletedAt` (já existe, ADR-005) | [confirmado] |
| `RESPOSTA` | `204 No Content`, sem corpo | [confirmado; estudante aceitou a sugestão] |
| `ALVO` | UC16 — Remover Produto | [confirmado] |
| `ARTEFATOS` | `prompts/uc-16/artefatos/` | [confirmado] |

## 1. Identificação do caso de uso

**Código:** UC16 [confirmado; código livre depois do UC15]
**Nome:** Remover Produto
**Sistema:** CeliLac
**Módulo:** Gerenciamento de Produtos
**Tipo:** Caso de uso funcional (exclusão lógica de um item existente; arquétipo `excluir`)

## 2. Objetivo

Permitir que o consumidor da API **remova logicamente um único produto ativo**, identificado por `productId`, de modo que ele deixe de existir para a listagem, a busca e a alteração, **sem apagar o registro**.

A remoção grava dados. Produto inexistente, já removido ou identificador de formato inválido **não** removem nada.

## 3. Atores envolvidos

**Ator principal:** consumidor da API de produtos que conhece o `productId`.

**Observação:** a remoção é **pública por enquanto** [confirmado]. O projeto ainda não tem autenticação; permissões ficam para um UC futuro. Como remover é mais grave que alterar, o risco é registrado em ADR própria (ver `04-cobertura-e-adrs-propostas.md`).

## 4. Pré-condições

Proposta, sujeita à confirmação:

1. O sistema CeliLac deve estar operacional.
2. Existe um produto **ativo** (`deletedAt` nulo) com o `productId` informado na rota.
3. O serviço de persistência deve estar disponível.

## 5. Pós-condições

### Em caso de sucesso

1. O produto passa a ter `deletedAt` com o instante da remoção; `productId` e `name` permanecem iguais; o registro continua no banco.
2. O sistema responde `204`, sem corpo.
3. Nenhum outro produto é criado, alterado ou removido.
4. O produto deixa de aparecer na listagem e no total, e é tratado como inexistente pela busca e pela alteração.

### Em caso de falha

1. **Nada foi removido:** o produto continua ativo, com `deletedAt` nulo.
2. Nenhum outro produto é criado, alterado ou removido.
3. O sistema comunica a falha conforme o contrato de erros (ADR-003 e ADR-004).

## 6. Fluxo principal

1. O ator envia `DELETE /products/:productId`, sem corpo [confirmado].
2. A fronteira HTTP valida que o `productId` é um UUID válido (pipe de UUID já existente nos UC14 e UC15) [confirmado].
3. O Controller delega a remoção ao Service, informando o `productId`.
4. O Service solicita ao Repository a remoção do produto **ativo** com esse `productId`.
5. O Repository grava a marca de remoção em uma única operação e informa se algum produto foi removido; se não houver produto ativo, informa que nada foi removido.
6. O sistema responde `204 No Content`, sem corpo [confirmado].

## 7. Fluxos alternativos e de exceção

### FA01 — Produto inexistente

1. O `productId` é um UUID válido, mas não existe produto com esse identificador.
2. O Service sinaliza com `ProductNotFoundException` (já existente).
3. A fronteira HTTP responde `404 Not Found`, no formato de erro de domínio (`{ statusCode, message, error }`) [confirmado].

### FA02 — Produto já removido

1. O produto existe, mas tem `deletedAt` preenchido (ADR-005), por uma remoção anterior.
2. É tratado como inexistente: mesmo desfecho de FA01 (`404`), e **o `deletedAt` original não é alterado** [confirmado].

### FA03 — Identificador com formato inválido

1. O `productId` não é um UUID válido (ex.: `DELETE /products/abc`).
2. O pipe de UUID rejeita antes do Service, com `InvalidProductIdException` (já existente).
3. A fronteira HTTP responde `400 Bad Request` no formato do `ValidationPipe` [confirmado].

### FA04 — Requisição com corpo

1. A requisição traz um corpo (que a remoção não usa).
2. O corpo é **ignorado** e a remoção segue [confirmado].

### FE01 — Falha ao gravar na persistência

1. O Repository falha ao gravar a remoção (ex.: banco indisponível).
2. O Service traduz para uma exceção de domínio de falha de persistência, sem expor a causa (reaproveita `ProductPersistenceFailedException`, com mensagem própria da remoção [candidato]).
3. A fronteira HTTP responde `500 Internal Server Error` com mensagem genérica (ADR-003). A causa fica apenas em `cause` e no log [confirmado].
4. **Nada é removido pela metade:** a remoção é uma única operação de gravação [candidato; a provar na Etapa 2].

## 8. Regras de negócio

**RN01 — Remoção lógica:** a remoção grava `deletedAt` com o instante atual; o registro permanece, e `productId` e `name` não mudam [confirmado].

**RN02 — Somente produto ativo pode ser removido:** produto inexistente ou já removido responde `404` [confirmado].

**RN03 — Removido = inexistente no resto do sistema:** depois da remoção, a listagem (e o total), a busca e a alteração tratam o produto como inexistente. A regra é **reaproveitada** do que os UC13, UC14 e UC15 já fazem (ADR-005), não duplicada [confirmado].

**RN04 — Identificador válido é pré-requisito:** o `productId` deve ser UUID válido [confirmado].

**RN05 — Remoção recusada ou que falha não grava nada:** nenhuma falha deixa o produto removido pela metade [confirmado].

**RN06 — Só o produto alvo é afetado:** nenhum outro produto muda de estado [confirmado].

**RN07 — Remover de novo não altera o registro:** a segunda remoção do mesmo produto responde `404` e **preserva** o instante original de `deletedAt` [confirmado].

**RN08 — Remoções simultâneas:** entre duas remoções do mesmo produto ao mesmo tempo, **exatamente uma** tem sucesso e a outra responde `404`. Obtida por uma única instrução condicionada ao produto ativo, não por controle de versão [candidato, a confirmar e a provar no banco de testes].

**RN09 — Resposta sem corpo:** o sucesso responde `204` sem corpo; `deletedAt` não é exposto [confirmado, ADR-005].

As regras acima não substituem a especificação original do UC16.

## 9. Validações e restrições

- `productId` UUID válido na fronteira HTTP [confirmado].
- A requisição não tem corpo; se vier, é ignorado [confirmado].
- Remoção apenas de produto ativo [confirmado].

**Definido:** operação pública por enquanto; `DELETE /products/:productId`; remoção lógica com a marca existente; `204` sem corpo; inexistente e já removido respondem `404`; `400` no formato do `ValidationPipe` para identificador inválido; `500` genérico para falha de persistência.

**Não definido:** autenticação e permissões (fora do escopo, ADR proposta); dependências de outras entidades (nenhuma encontrada, a confirmar no banco na Etapa 2).

## 10. Requisitos e relacionamentos relevantes

### Atributos de `Product` e remoção

| Atributo | Tipo | Origem | Identificador? | Efeito da remoção | Retornado? | Justificativa |
|---|---|---|---|---|---|---|
| `productId` | string (UUID) | [existente] domínio e ORM | Sim | Não muda | Não (sem corpo) | É a `CHAVE`. |
| `name` | string | [existente] domínio e ORM (`varchar(120)`) | Não | Não muda | Não | O registro é preservado. |
| `deletedAt` | `Date \| null` | [existente] ADR-005 | Não | **Passa a ter o instante da remoção** | **Não** | É a `MARCA`; atributo interno. |

Nenhum atributo novo é criado e **não há migration**: a coluna `deletedAt` já existe.

### Requisitos

**RF01 — Remoção por identificador:** o sistema deverá disponibilizar `DELETE /products/:productId` que remova logicamente um produto ativo.

**RF02 — Validação do identificador:** rejeitar com `400` e exceção específica identificadores que não sejam UUID.

**RF03 — Produto inexistente ou já removido:** responder `404` quando não houver produto ativo com o identificador, sem alterar o registro.

**RF04 — Resposta de sucesso:** responder `204`, sem corpo.

**RF05 — Efeito nos UCs existentes:** depois da remoção, `GET /products` não traz o produto e reduz o total em 1; `GET /products/:productId` e `PUT /products/:productId` respondem `404`.

**RF06 — Falha de persistência:** responder `500` genérico, sem expor detalhes, e sem remoção parcial.

**RF07 — Só o alvo é afetado:** os demais produtos permanecem ativos e inalterados.

**RF08 — Aditividade:** a remoção não deverá mudar o contrato nem o comportamento de `POST`, `GET` e `PUT`, **exceto** pelo efeito de RF05, que já é o comportamento definido para produto removido.

## 11. Considerações arquiteturais

Unidades de trabalho possíveis, a refinar com o UC aprovado (ver 4.2 do `uc-remover.md`):

1. Ampliar o contrato `ProductsRepository` com uma operação **própria** de remoção do produto ativo (ex.: `removeActive(productId): Promise<boolean>`, nome a confirmar). `save`, `findActivePage`, `findActiveById` e `updateActiveName` ficam intactos. **Não** reaproveitar o `save` (a implementação em memória acrescentaria um item).
2. Implementar o caso de uso no `ProductsService` (ex.: `removeProduct`), lançando `ProductNotFoundException` quando nada foi removido e traduzindo falha para `ProductPersistenceFailedException`; sem acoplar a HTTP ou ORM. A decisão "ativo ou não" fica **na própria operação do Repository**, sem ler antes e gravar depois.
3. Implementar a operação no repositório em memória, reproduzindo o banco: produto removido ou inexistente informa que nada foi removido.
4. Implementar no repositório TypeORM como **uma única instrução** (`UPDATE … SET "deletedAt" = agora WHERE "productId" = … AND "deletedAt" IS NULL`), conferindo as linhas afetadas, sem migration.
5. Criar o endpoint `DELETE /products/:productId` com o pipe de UUID existente e `204`, **sem DTO de entrada**.
6. Mapeamento das exceções: reaproveitar o já existente no `DomainHttpExceptionFilter`; ADR somente se houver decisão nova.
7. Testes: unitários (Service), controller, integração sem mocks de Service/Repository e contrato HTTP, incluindo os específicos: remoção que falha não remove, só o alvo é removido, segunda remoção preserva o `deletedAt`, ciclo completo (cadastro, remoção, listagem, busca, alteração) e remoções simultâneas no banco de testes.
8. Cenários `.http` em `http-rest-client/products/uc16-remover-produto/`, `containerizado/06-products-remover-produto.http`, atualização do `README.md` e do `run-checks.sh` (Esperado × Obtido). O `run-checks.sh` remove **apenas um produto criado por ele mesmo**. Os cenários que removem não se executam sem autorização.
9. ADRs (ver `04-cobertura-e-adrs-propostas.md`).

Respeitar as regras herdadas: núcleo sem TypeORM/HTTP, dois mappers separados, nomes existentes preservados (`productId`, não `id`) e mudança aditiva.

## 12. Critérios gerais de aceite

**CA01 (RF01, RF04, RN09):** `DELETE /products/:productId` com UUID de produto ativo retorna `204`, sem corpo.

**CA02 (RF05, RN03):** depois da remoção, `GET /products/:productId` retorna `404`.

**CA03 (RF05, RN03):** depois da remoção, `GET /products` não traz o produto e o total diminui em 1.

**CA04 (RF05, RN03):** depois da remoção, `PUT /products/:productId` retorna `404` e o produto não é alterado.

**CA05 (RF07, RN06):** os outros produtos permanecem na listagem, ativos e com o mesmo `name`.

**CA06 (RN01):** no banco de testes, o produto removido continua existindo, com `productId` e `name` iguais e `deletedAt` preenchido.

**CA07 (RF03, RN02, FA01):** UUID válido sem produto retorna `404` no formato de erro de domínio.

**CA08 (RF03, RN07, FA02):** remover um produto já removido retorna `404` e **o `deletedAt` original é preservado**.

**CA09 (RF02, RN04, FA03):** identificador que não é UUID retorna `400` e o Service não é chamado.

**CA10 (FA04):** `DELETE` com corpo retorna `204` e o corpo é ignorado.

**CA11 (RF06, RN05, FE01):** falha de persistência retorna `500` com mensagem genérica, sem detalhes da causa, e o produto continua ativo.

**CA12 (RN08):** duas remoções simultâneas do mesmo produto resultam em exatamente um `204` e um `404` (banco de testes).

**CA13 (RF08):** testes e contratos de `POST /products`, `GET /products`, `GET /products/:productId` e `PUT /products/:productId` continuam passando, exceto pelo que RF05 define para produto removido.

**CA14:** cada CA acima tem teste automatizado e cenário `.http` correspondente.

Esses critérios deverão ser confirmados ou adaptados.

### Rastreabilidade (requisito → critério de aceite)

| Item | Cobertura |
|---|---|
| RF01 / RF04 / RN09 / fluxo principal | CA01 |
| RF05 / RN03 | CA02, CA03, CA04 |
| RF07 / RN06 | CA05 |
| RN01 | CA06 |
| RF03 / RN02 / FA01 | CA07 |
| RF03 / RN07 / FA02 | CA08 |
| RF02 / RN04 / FA03 | CA09 |
| FA04 | CA10 |
| RF06 / RN05 / FE01 | CA11 |
| RN08 | CA12 |
| RF08 | CA13 |
| Todos | CA14 |

## 13. Escopo do trabalho

**Dentro do escopo:** especificar e, após aprovação, implementar e verificar a **remoção lógica de um produto por `productId`**, conforme as seções acima.

**Fora do escopo** (nova execução do prompt, quando desejado): outras entidades (ex.: `Order`); **restauração** de produto removido; **remoção física** (*purge*) de produtos já removidos; **remoção em lote**; autenticação e permissões; controle de concorrência além da regra RN08; novos atributos de `Product`.

Nesta etapa (Etapa 1) **não** há implementação de código, Issues, PRs ou merges.

## Decisões do estudante

| # | Decisão | Resposta |
|---|---|---|
| 1 | `CHAVE` = `productId` em `DELETE /products/:productId` | Confirmado |
| 2 | `POLITICA` = remoção lógica | Confirmado |
| 3 | `MARCA` = `deletedAt` existente | Confirmado |
| 4 | `RESPOSTA` = `204` sem corpo | Confirmado (aceitou a sugestão) |
| 5 | Ator público, sem autenticação, com ADR própria | Confirmado |
| 6 | Rota `DELETE /products/:productId`, corpo ignorado | Confirmado |
| 7 | Identificador inválido: `400` pelo pipe de UUID | Confirmado |
| 8 | Produto inexistente: `404` | Confirmado |
| 9 | Produto já removido: `404`, sem alterar o registro | Confirmado |
| 10 | Dependências: nenhuma encontrada | Confirmado |
| 11 | Efeito nos UCs existentes: removido = inexistente (regra 12, conferido no código) | Confirmado |
| 12 | Falha ao gravar: `500` genérico, nada removido pela metade | Confirmado |
| 13 | Remoções simultâneas: exatamente uma tem sucesso (instrução única) | Confirmado |
| 14 | Fora de escopo: restauração, *purge* e remoção em lote, com ADRs de exclusão | Confirmado |
| 15 | `REF` = UC15 | Confirmado |

## Perguntas em aberto

1. Nome da operação do Repository e do método do Service (propostas: `removeActive` e `removeProduct`).
2. Autorização para criar a estrutura de documentação (3.5): `docs/planejamento/uc16-remover-produto/`, `docs/uc/uc16/` (com `state.yaml` e `relatorios/A.md`) e as ADRs propostas.
3. Qual é a especificação oficial: esta (em `prompts/uc-16/artefatos/`) ou uma cópia em `docs/planejamento/`, ficando a outra apenas apontando para ela.
4. Um PR por fatia (padrão do método) ou um PR único com `pr_compartilhado` (como no UC15)?

## Próximo passo

Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação.
