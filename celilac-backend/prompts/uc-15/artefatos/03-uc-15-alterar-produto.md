# UC15 — Alterar Produto

> **Situação:** especificação gerada pela Etapa 1 de [`uc-alterar.md`](../uc-alterar.md) (Decisão A: o UC não existia). **Aguardando validação do estudante** para iniciar a Etapa 2.
> **Moldado em:** [`uc-14-buscar-produto.md`](../../uc-14/uc-14-buscar-produto.md) (mesmas 13 seções), que por sua vez segue o `uc-12.md`.
> **Legenda:** **[confirmado]** = decidido pelo estudante nesta execução (decisões 1 a 14); **[candidato]** = proposta do assistente, precisa ser confirmada; **[existente]** = já consta no código ou em ADR.
> **Siglas:** UC (caso de uso), RN (regra de negócio), RF (requisito funcional), CA (critério de aceite), FA/FE (fluxo alternativo / de exceção), DTO (*Data Transfer Object*, objeto de transferência de dados), HTTP (*HyperText Transfer Protocol*), PUT (método HTTP que substitui um recurso), UUID (*Universally Unique Identifier*), ADR (*Architecture Decision Record*), ORM (*Object-Relational Mapping*).

## Valores desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC14 — Buscar Produto por Identificador | [confirmado] |
| `ENTIDADE` | `Product` (`src/modules/products/entities/product.entity.ts`) | [confirmado] |
| `CHAVE` | `productId` (UUID) | [confirmado] |
| `ALTERAVEIS` | `name` | [confirmado] |
| `CAMPOS` | `productId`, `name` | [confirmado] |
| `ALVO` | UC15 — Alterar Produto | [confirmado] |
| `ARTEFATOS` | `prompts/uc-15/artefatos/` | [confirmado] |

## 1. Identificação do caso de uso

**Código:** UC15 [confirmado; código livre depois do UC14]
**Nome:** Alterar Produto
**Sistema:** CeliLac
**Módulo:** Gerenciamento de Produtos
**Tipo:** Caso de uso funcional (atualização de um item existente)

## 2. Objetivo

Permitir que o consumidor da API altere o **nome** de **um único produto ativo**, identificado por `productId`, devolvendo o produto atualizado (`productId` e `name`).

A alteração grava dados. Produto inexistente, removido (ADR-005), identificador de formato inválido ou nome inválido **não** alteram nada.

## 3. Atores envolvidos

**Ator principal:** consumidor da API de produtos que conhece o `productId`.

**Observação:** a alteração é **pública por enquanto** [confirmado]. O projeto ainda não tem autenticação; permissões ficam para um UC futuro.

## 4. Pré-condições

Proposta, sujeita à confirmação:

1. O sistema CeliLac deve estar operacional.
2. Existe um produto **ativo** (`deletedAt` nulo) com o `productId` informado na rota.
3. O ator envia um corpo com o novo `name`.
4. O serviço de persistência deve estar disponível.

## 5. Pós-condições

### Em caso de sucesso

1. O produto passa a ter o novo `name`; `productId` e `deletedAt` permanecem iguais.
2. O sistema retorna o produto atualizado (`productId`, `name`).
3. Nenhum outro produto é criado, alterado ou removido.

### Em caso de falha

1. **Nada foi alterado:** o produto mantém o `name` anterior.
2. Nenhum produto é criado ou removido.
3. O sistema comunica a falha conforme o contrato de erros (ADR-003 e ADR-004).

## 6. Fluxo principal

1. O ator envia `PUT /products/:productId` com o corpo `{ "name": "<novo nome>" }` [confirmado].
2. A fronteira HTTP valida que o `productId` é um UUID válido (pipe de UUID já existente no UC14) [confirmado].
3. A fronteira HTTP valida o corpo: `name` obrigatório, não vazio, sem ser só espaços e com até 120 caracteres (mesma regra do cadastro, ADR-004) [confirmado].
4. O Controller delega a alteração ao Service, informando `productId` e `name`.
5. O Service valida novamente o nome com a regra do domínio e solicita ao Repository a atualização do produto **ativo** com esse `productId`.
6. O Repository grava o novo nome e retorna o produto atualizado; se não houver produto ativo, retorna ausência.
7. O sistema converte o produto para o DTO de resposta (`toProductResponse`) e o retorna com `200 OK` [confirmado].

## 7. Fluxos alternativos e de exceção

### FA01 — Produto inexistente

1. O `productId` é um UUID válido, mas não existe produto com esse identificador.
2. O Service sinaliza com `ProductNotFoundException` (já existente).
3. A fronteira HTTP responde `404 Not Found`, no formato de erro de domínio (`{ statusCode, message, error }`) [confirmado].

### FA02 — Produto removido (soft delete)

1. O produto existe, mas tem `deletedAt` preenchido (ADR-005).
2. É tratado como inexistente: mesmo desfecho de FA01 (`404`), e **o produto removido não é alterado** [confirmado].

### FA03 — Identificador com formato inválido

1. O `productId` não é um UUID válido (ex.: `PUT /products/abc`).
2. O pipe de UUID rejeita antes do Service, com `InvalidProductIdException` (já existente).
3. A fronteira HTTP responde `400 Bad Request` no formato do `ValidationPipe` [confirmado].

### FA04 — Nome inválido

1. O `name` está ausente, não é texto, é vazio, só tem espaços ou passa de 120 caracteres.
2. A validação do DTO (ou, se chegar ao Service, `InvalidProductNameException`) rejeita a requisição.
3. A fronteira HTTP responde `400 Bad Request` no formato do `ValidationPipe` (ADR-004) e **nada é gravado** [confirmado].

### FA05 — Campo não alterável no corpo

1. O corpo traz, além de `name`, campos como `productId` ou `deletedAt`.
2. Os campos extras são **ignorados** (`whitelist`, ADR-004 item 4) e a alteração segue com o `name` [confirmado].

### FA06 — Mesmo valor já existente

1. O `name` enviado é igual ao atual.
2. A alteração é um sucesso: `200` com o produto, sem erro [confirmado].

### FE01 — Falha ao gravar na persistência

1. O Repository falha ao atualizar (ex.: banco indisponível).
2. O Service traduz para uma exceção de domínio de falha de persistência, sem expor a causa (reaproveita `ProductPersistenceFailedException` com mensagem própria da alteração [candidato]).
3. A fronteira HTTP responde `500 Internal Server Error` com mensagem genérica (ADR-003). A causa fica apenas em `cause` e no log [confirmado].
4. **Nada é alterado pela metade:** a atualização é uma única operação de gravação [candidato; a provar na Etapa 2].

## 8. Regras de negócio

**RN01 — Só o nome é alterável:** apenas `name` pode mudar; `productId` e `deletedAt` não são alteráveis e, se enviados, são ignorados [confirmado].

**RN02 — Somente produto ativo:** apenas produtos com `deletedAt` nulo podem ser alterados; removido responde como inexistente (`404`) [confirmado].

**RN03 — Mesma regra de nome do cadastro:** o novo nome segue a regra do UC12 (ADR-004): não vazio, não só espaços, até 120 caracteres. A regra é reaproveitada (`MAX_PRODUCT_NAME_LENGTH`, `InvalidProductNameException`), não duplicada [confirmado].

**RN04 — Identificador válido é pré-requisito:** o `productId` deve ser UUID válido [confirmado].

**RN05 — Alteração recusada não grava nada:** nenhuma falha deixa o produto com o nome parcialmente alterado [confirmado].

**RN06 — Resposta restrita aos campos aprovados:** a resposta contém apenas `productId` e `name`; `deletedAt` não é exposto [confirmado, ADR-005].

**RN07 — Mesmo valor é sucesso:** repetir o nome atual responde `200` [confirmado].

**RN08 — Última gravação vale (*last write wins*):** em alterações simultâneas, prevalece a última gravação; não há controle de versão nem bloqueio. Regra **candidata**, adiada por ADR (ver `04-cobertura-e-adrs-propostas.md`) [candidato, a confirmar].

As regras acima não substituem a especificação original do UC15.

## 9. Validações e restrições

- `productId` UUID válido na fronteira HTTP [confirmado].
- `name` obrigatório, texto, não vazio, sem ser só espaços, até 120 caracteres [confirmado, reaproveitado].
- Campos desconhecidos no corpo são ignorados [confirmado, ADR-004 item 4].
- Alteração apenas de produto ativo [confirmado].

**Definido:** operação pública por enquanto; `PUT` com `name` obrigatório; erro `400` no formato do `ValidationPipe`; pipe aceita qualquer versão de UUID (UC14).

**Não definido:** autenticação e permissões (fora do escopo); controle de concorrência (adiado por ADR).

**Condição para reavaliar o `PUT`:** se `Product` ganhar mais atributos alteráveis (ex.: preço, ADR-002), acrescentar um atributo **obrigatório** ao `PUT` quebra clientes existentes; nesse caso, avaliar `PATCH` (que exige tratar o corpo vazio). `PATCH` fica como alternativa documentada [confirmado].

## 10. Requisitos e relacionamentos relevantes

### Atributos de `Product`, alterabilidade e retorno

| Atributo | Tipo | Origem | Identificador? | Alterável? | Retornado? | Justificativa |
|---|---|---|---|---|---|---|
| `productId` | string (UUID) | [existente] domínio e ORM | Sim | **Não** | Sim | É a `CHAVE`; mudar o identificador é outro UC. |
| `name` | string | [existente] domínio e ORM (`varchar(120)`) | Não | **Sim** | Sim | Único atributo alterável desta execução. |
| `deletedAt` | `Date \| null` | [existente] ADR-005 | Não | **Não** | **Não** | Atributo interno (ADR-005). |

Resposta [confirmado]: mesmo conjunto da busca e da listagem, reaproveitando `ProductResponseDto` e `toProductResponse`. Nenhum atributo novo é criado.

### Requisitos

**RF01 — Alteração por identificador:** o sistema deverá disponibilizar `PUT /products/:productId` que altere o `name` de um produto ativo.

**RF02 — Validação do identificador:** rejeitar com `400` e exceção específica identificadores que não sejam UUID.

**RF03 — Produto inexistente ou removido:** responder `404` quando não houver produto ativo com o identificador.

**RF04 — Validação do nome:** rejeitar com `400`, no formato do `ValidationPipe`, nome ausente, vazio, só com espaços ou acima de 120 caracteres, sem gravar nada.

**RF05 — Campos retornados:** retornar exatamente `productId` e `name`, com o valor novo.

**RF06 — Atributos não alterados:** `productId` e `deletedAt` permanecem iguais; campos extras do corpo são ignorados.

**RF07 — Falha de persistência:** responder `500` genérico, sem expor detalhes, e sem alteração parcial.

**RF08 — Aditividade:** a alteração não deverá mudar o contrato nem o comportamento de `POST /products` (UC12), `GET /products` (UC13) e `GET /products/:productId` (UC14).

## 11. Considerações arquiteturais

Unidades de trabalho possíveis, a refinar com o UC aprovado (ver 4.2 do `uc-alterar.md`):

1. Ampliar o contrato `ProductsRepository` com uma operação **própria** de atualização do nome de produto ativo (ex.: `updateActiveName(productId, name): Promise<Product | null>`, nome a confirmar). `save`, `findActivePage` e `findActiveById` ficam intactos [confirmado: operação própria, decisão 14].
2. Implementar o caso de uso no `ProductsService` (ex.: `updateProductName`), reaproveitando a regra do nome e as exceções `InvalidProductNameException`, `ProductNotFoundException` e `ProductPersistenceFailedException`; sem acoplar a HTTP ou ORM.
3. Implementar a operação no repositório em memória, **sem duplicar** o produto e sem alterar produto removido.
4. Implementar no repositório TypeORM como uma única atualização condicionada a `deletedAt IS NULL`, sem migration (o esquema não muda) [a confirmar na leitura da entidade ORM].
5. Criar `UpdateProductDto` (apenas `name`, com as mesmas regras do `CreateProductDto`, compartilhando `MAX_PRODUCT_NAME_LENGTH`) e o endpoint `PUT /products/:productId` com o pipe de UUID existente, reaproveitando `toProductResponse`.
6. Mapeamento das exceções: reaproveitar o já existente no `DomainHttpExceptionFilter`; ADR somente se houver decisão nova.
7. Testes: unitários (Service), controller, integração sem mocks de Service/Repository e contrato HTTP, incluindo os três específicos: alteração recusada não grava, atributos não alterados permanecem e duas alterações em sequência deixam a última.
8. Cenários `.http` em `http-rest-client/products/uc15-alterar-produto/`, `containerizado/05-products-alterar-produto.http`, atualização do `README.md` e do `run-checks.sh` (Esperado × Obtido). Os cenários que gravam não se executam sem autorização.
9. ADR de adiamento da concorrência (ADR-006, proposta).

Respeitar as regras herdadas: núcleo sem TypeORM/HTTP, dois mappers separados, nomes existentes preservados (`productId`, não `id`) e mudança aditiva.

## 12. Critérios gerais de aceite

**CA01 (RF01, RN01):** `PUT /products/:productId` com UUID de produto ativo e nome válido retorna `200`.

**CA02 (RF05, RN06):** o corpo do `200` contém exatamente `productId` e `name` (o novo), sem `deletedAt` nem outro campo.

**CA03 (RF01):** relendo o produto por `GET /products/:productId`, o novo nome está gravado.

**CA04 (RF06, RN01):** `productId` e `deletedAt` permanecem iguais após a alteração, mesmo se vierem no corpo.

**CA05 (RF03, FA01):** UUID válido sem produto retorna `404` no formato de erro de domínio.

**CA06 (RF03, RN02, FA02):** produto com `deletedAt` preenchido retorna `404` e **não é alterado**.

**CA07 (RF02, RN04, FA03):** identificador que não é UUID retorna `400` e o Service não é chamado.

**CA08 (RF04, RN03, RN05, FA04):** nome ausente, vazio, só espaços ou com 121 caracteres retorna `400` no formato do `ValidationPipe` e o produto mantém o nome anterior.

**CA09 (RN07, FA06):** alterar para o mesmo nome retorna `200`.

**CA10 (RF07, RN05, FE01):** falha de persistência retorna `500` com mensagem genérica, sem detalhes da causa, e o produto não fica alterado pela metade.

**CA11 (RN08):** duas alterações em sequência no mesmo produto deixam o nome da última (documenta *last write wins*; não é teste de concorrência real).

**CA12 (RF08):** testes e contratos de `POST /products`, `GET /products` e `GET /products/:productId` continuam passando sem alteração.

**CA13:** cada CA acima tem teste automatizado e cenário `.http` correspondente.

Esses critérios deverão ser confirmados ou adaptados.

### Rastreabilidade (requisito → critério de aceite)

| Item | Cobertura |
|---|---|
| RF01 / RN01 / fluxo principal | CA01, CA03 |
| RF05 / RN06 | CA02 |
| RF06 / RN01 / FA05 | CA04 |
| RF03 / RN02 / FA01 / FA02 | CA05, CA06 |
| RF02 / RN04 / FA03 | CA07 |
| RF04 / RN03 / RN05 / FA04 | CA08 |
| RN07 / FA06 | CA09 |
| RF07 / RN05 / FE01 | CA10 |
| RN08 | CA11 |
| RF08 | CA12 |
| Todos | CA13 |

## 13. Escopo do trabalho

**Dentro do escopo:** especificar e, após aprovação, implementar e verificar a alteração do **nome de um produto por `productId`**, conforme as seções acima.

**Fora do escopo** (nova execução do prompt, quando desejado): outras entidades (ex.: `Order`); alterar outros atributos ou o identificador; alteração em lote; remoção e restauração de produtos; autenticação e permissões; novos atributos de `Product` (ex.: preço, ADR-002); **controle de concorrência** (regra candidata *last write wins*, ADR-006 proposta).

Nesta etapa (Etapa 1) **não** há implementação de código, Issues, PRs ou merges.

## Decisões do estudante

| # | Decisão | Resposta |
|---|---|---|
| 1 | `CHAVE` = `productId` em `PUT /products/:productId` | Confirmado |
| 2 | `ALTERAVEIS` = só `name` | Confirmado |
| 3 | `CAMPOS` = `productId` e `name` | Confirmado |
| 4 | Método `PUT`, com `name` obrigatório | Confirmado |
| 5 | Ator público, sem autenticação | Confirmado |
| 6 | Identificador inválido: `400` pelo pipe de UUID | Confirmado |
| 7 | Inexistente ou removido: `404` | Confirmado |
| 8 | Nome inválido: `400` no formato do `ValidationPipe`, mesma regra do cadastro, sem gravar | Confirmado |
| 9 | Campo não alterável no corpo: ignorado (ADR-004 item 4) | Confirmado |
| 10 | Mesmo valor: `200` | Confirmado |
| 11 | Resposta de sucesso: `200` com o produto atualizado | Confirmado |
| 12 | Falha ao gravar: `500` genérico, nada alterado | Confirmado |
| 13 | Concorrência fora do escopo, *last write wins*, com ADR de adiamento | Confirmado |
| 14 | Repository: operação própria de atualização, sem mexer no `save` | Confirmado |

## Perguntas em aberto

1. Nome da operação do Repository e do método do Service (propostas: `updateActiveName` e `updateProductName`).
2. Autorização para criar a estrutura de documentação (3.5): `docs/planejamento/uc15-alterar-produto/`, `docs/uc/uc15/` e `docs/adr/ADR-006-…`.
3. Qual é a especificação oficial: esta (em `prompts/uc-15/artefatos/`) ou uma cópia em `docs/planejamento/`, ficando a outra apenas apontando para ela.

## Próximo passo

Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação.
