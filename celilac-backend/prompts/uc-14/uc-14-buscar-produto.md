# UC14 — Buscar Produto por Identificador

> **Situação:** especificação com as pendências P1 a P6 respondidas pelo estudante, gerada pela Etapa 1 de [`uc-buscar.md`](./uc-buscar.md) (Decisão A: o UC não existia). Aprovada pelo estudante para iniciar a Etapa 2.
> **Moldado em:** [`uc-12.md`](../../docs/planejamento/uc12-cadastrar-produto/uc-12.md) (mesmas 13 seções).
> **Legenda:** **[confirmado]** = decidido pelo estudante nesta execução; **[candidato]** = proposta do assistente, precisa ser confirmada; **[existente]** = já consta no código ou em ADR do repositório.

## Valores desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC12 — Cadastrar Produto | [confirmado] |
| `ENTIDADE` | `Product` (`src/modules/products/entities/product.entity.ts`) | [confirmado] |
| `CHAVE` | `productId` (identificador da entidade, UUID) | [confirmado] |
| `CAMPOS` | `productId`, `name` | [confirmado] ver seção 10 |
| `ALVO` | UC14 — Buscar Produto por `productId` | [confirmado] |
| `ARTEFATOS` | `prompts/` (pasta deste arquivo) | [confirmado] |

## 1. Identificação do caso de uso

**Código:** UC14 [confirmado]
**Nome:** Buscar Produto por Identificador
**Sistema:** CeliLac
**Módulo:** Gerenciamento de Produtos
**Tipo:** Caso de uso funcional (consulta, sem alteração de dados)

## 2. Objetivo

Permitir a consulta de **um único produto ativo** da plataforma CeliLac a partir do seu identificador (`productId`), devolvendo os dados definidos na seção 10.

A busca não altera dados. Produtos inexistentes, removidos (ADR-005) ou com identificador de formato inválido **não** devem ser retornados como se existissem.

## 3. Atores envolvidos

**Ator principal:** consumidor da API de produtos que conhece o identificador de um produto.

**Observação:** a busca é **pública por enquanto** [confirmado]. O projeto ainda não trabalha com autenticação; permissões ficam para um UC futuro.

## 4. Pré-condições

Proposta, sujeita à confirmação:

1. O sistema CeliLac deve estar operacional.
2. O ator informa um identificador de produto na rota.
3. O serviço de persistência deve estar disponível.

## 5. Pós-condições

### Em caso de sucesso

1. O sistema retorna os dados do produto ativo correspondente ao identificador.
2. Nenhum dado é criado, alterado ou removido.

### Em caso de falha

1. Nenhum produto é retornado.
2. Nenhum dado é criado, alterado ou removido.
3. O sistema comunica a falha conforme o contrato de erros do projeto (ADR-003 e ADR-004).

## 6. Fluxo principal

1. O ator solicita a busca de um produto informando o `productId` na rota (`GET /products/:productId`) [confirmado].
2. A fronteira HTTP valida que o `productId` é um UUID válido (pipe de UUID) [confirmado].
3. O Controller delega a busca ao Service.
4. O Service consulta o Repository pelo `productId`.
5. O Repository retorna o produto ativo (`deletedAt` nulo) ou ausência.
6. O sistema converte o produto para o DTO de resposta e o retorna com status `200 OK`.

## 7. Fluxos alternativos e de exceção

### FA01 — Produto inexistente

1. O `productId` é um UUID válido, mas não existe produto com esse identificador.
2. O Service sinaliza a ausência com uma exceção de domínio de "produto não encontrado".
3. A fronteira HTTP responde `404 Not Found`, no formato de erro de domínio (`{ statusCode, message, error }`).

### FA02 — Produto removido (soft delete)

1. O produto existe, mas tem `deletedAt` preenchido (ADR-005).
2. O sistema o trata como inexistente e segue o mesmo desfecho de FA01 (`404`), sem revelar que o produto existiu [confirmado].

### FA03 — Identificador com formato inválido

1. O `productId` informado não é um UUID válido (ex.: `GET /products/abc`).
2. O pipe de UUID rejeita a requisição **antes** de chegar ao Service e o sistema lança uma **exceção específica** de identificador de produto inválido [confirmado].
3. A fronteira HTTP responde `400 Bad Request`. O corpo segue o formato do `ValidationPipe`: `{ statusCode: 400, message: [<texto>], error: "Bad Request" }`, como `InvalidProductNameException` e `InvalidPaginationException` (ADR-004) [confirmado].

### FE01 — Falha ao consultar a persistência

1. O Repository falha ao consultar (ex.: banco indisponível).
2. O Service traduz a falha para uma exceção de domínio de falha de consulta, sem expor a causa original na resposta.
3. A fronteira HTTP responde `500 Internal Server Error` com mensagem genérica, conforme o ADR-003. A causa fica apenas em `cause` e no log.

Este fluxo é uma proposta técnica, não uma regra explicitamente documentada.

## 8. Regras de negócio

**RN01 — Busca somente de produtos ativos:** apenas produtos com `deletedAt` nulo podem ser retornados [confirmado].

**RN02 — Removido equivale a inexistente:** produto removido responde como produto inexistente (`404`) [confirmado].

**RN03 — Identificador válido é pré-requisito:** o `productId` deve ser um UUID válido para que a consulta seja executada [confirmado].

**RN04 — Resposta restrita aos campos aprovados:** a resposta contém apenas os `CAMPOS` da seção 10; atributos internos (como `deletedAt`) não são expostos [confirmado, coerente com o ADR-005].

**RN05 — Busca sem efeitos colaterais:** a operação não grava, altera nem remove dados [confirmado].

As regras acima não substituem a especificação original do UC14.

## 9. Validações e restrições

- Validação do formato do `productId` (UUID) na fronteira HTTP, com exceção específica [confirmado].
- Consulta apenas de produtos ativos [confirmado].
- Tratamento de ausência e de falha de persistência conforme os fluxos da seção 7.

**Definido:** a busca é pública por enquanto; o erro `400` usa o formato do `ValidationPipe`; o pipe aceita qualquer versão de UUID, como o padrão do `ParseUUIDPipe` [confirmado].

**Não definido:** autenticação e permissões (fora do escopo).

## 10. Requisitos e relacionamentos relevantes

### Atributos de `Product` e decisão de retorno

| Atributo | Tipo | Origem | Identificador? | Retornado? | Justificativa |
|---|---|---|---|---|---|
| `productId` | string (UUID) | [existente] entidade de domínio | Sim | Sim | Já retornado pelo cadastro e pela listagem. |
| `name` | string | [existente] entidade de domínio | Não | Sim | Já retornado pelo cadastro e pela listagem. |
| `deletedAt` | `Date \| null` | [existente] ADR-005 | Não | **Não** | Atributo interno (ADR-005, decisão 2). |

Resposta [confirmado]: o mesmo conjunto da listagem, reaproveitando `ProductResponseDto` e `toProductResponse` (`product-response.mapper.ts`). Nenhum atributo novo é criado.

### Requisitos

**RF01 — Busca por identificador:** o sistema deverá disponibilizar uma operação que retorne um produto ativo a partir do seu `productId`.

**RF02 — Validação do identificador:** o sistema deverá rejeitar, com exceção específica e status `400`, identificadores que não sejam UUID válidos.

**RF03 — Produto inexistente ou removido:** o sistema deverá responder `404` quando não houver produto ativo com o identificador informado.

**RF04 — Campos retornados:** o sistema deverá retornar exatamente `productId` e `name`.

**RF05 — Falha de persistência:** o sistema deverá responder `500` genérico, sem expor detalhes internos, quando a consulta falhar.

**RF06 — Aditividade:** a busca não deverá alterar o contrato nem o comportamento de `POST /products` (UC12) e `GET /products` (UC13).

## 11. Considerações arquiteturais

Unidades de trabalho possíveis, a refinar com o UC aprovado (ver 4.2 do `uc-buscar.md`):

1. Ampliar o contrato `ProductsRepository` com uma operação de busca de produto ativo por `productId` (aditiva; `save` e `findActivePage` ficam intactos).
2. Criar as exceções `ProductNotFoundException`, `InvalidProductIdException` e `ProductLookupFailedException` (`src/common/exceptions/`) e mapeá-las no `DomainHttpExceptionFilter`.
3. Implementar o caso de uso no `ProductsService` (ex.: `getProductById`), sem acoplar a HTTP ou ORM.
4. Implementar a busca no repositório em memória.
5. Implementar a busca no repositório TypeORM, filtrando `deletedAt` nulo. Sem migration, pois `productId` já é a chave primária [a confirmar na leitura da entidade ORM].
6. Criar o endpoint `GET /products/:productId` com pipe de UUID, reaproveitando o DTO e o mapper de resposta.
7. Testes: unitários (Service), controller, integração sem mocks e contrato HTTP.
8. Cenários `.http` em `http-rest-client/products/uc14-buscar-produto/`, `containerizado/04-products-buscar-produto.http` e checagens no `run-checks.sh` (Esperado × Obtido).
9. ADR somente se houver decisão nova além das já registradas neste documento (ex.: mapeamento HTTP das três novas exceções).

Respeitar as regras herdadas: núcleo sem TypeORM/HTTP, dois mappers separados e nomes existentes preservados (`productId`, não `id`).

## 12. Critérios gerais de aceite

**CA01 (RF01, RN05):** `GET /products/:productId` com UUID de produto ativo retorna `200` e o produto.

**CA02 (RF04, RN04):** o corpo da resposta de `200` contém exatamente `productId` e `name`, sem `deletedAt` nem outro campo.

**CA03 (RF03, FA01):** UUID válido sem produto correspondente retorna `404` no formato de erro de domínio.

**CA04 (RF03, RN01, RN02, FA02):** produto com `deletedAt` preenchido retorna `404`, igual ao inexistente.

**CA05 (RF02, RN03, FA03):** identificador que não é UUID retorna `400` via exceção específica, e o Service não é chamado.

**CA06 (RF05, FE01):** falha de persistência na consulta retorna `500` com mensagem genérica, sem detalhes da causa.

**CA07 (RF06):** os testes e os contratos de `POST /products` e `GET /products` continuam passando sem alteração.

**CA08 (RN05):** a busca não altera dados (verificável por teste de integração).

**CA09:** cada CA acima possui teste automatizado e cenário `.http` correspondente.

Esses critérios deverão ser confirmados ou adaptados.

### Rastreabilidade (requisito → critério de aceite)

| Item | Cobertura |
|---|---|
| RF01 / RN05 / fluxo principal | CA01, CA08 |
| RF02 / RN03 / FA03 | CA05 |
| RF03 / RN01 / RN02 / FA01 / FA02 | CA03, CA04 |
| RF04 / RN04 | CA02 |
| RF05 / FE01 | CA06 |
| RF06 | CA07 |
| Todos | CA09 |

## 13. Escopo do trabalho

**Dentro do escopo:** especificar e, após aprovação, implementar e verificar a busca de **um produto por `productId`**, conforme as seções acima.

**Fora do escopo** (nova execução do prompt, quando desejado): outras entidades (ex.: `Order`); busca por outro atributo ou por filtro retornando vários itens (pertence à listagem, UC13); busca de produtos removidos; remoção, edição e restauração de produtos; autenticação e permissões; novos atributos de `Product` (ex.: preço).

Nesta etapa (Etapa 1) **não** há implementação de código, criação de branches, Issues, PRs ou merges.

## Decisões do estudante sobre as pendências

| # | Decisão | Resposta |
|---|---|---|
| P1 | `productId` como `CHAVE` e UC14 como código | Confirmado |
| P2 | Retornar `productId` e `name`, como a listagem | Confirmado |
| P3 | Busca pública por enquanto, sem autenticação | Confirmado |
| P4 | Erro `400` no formato do `ValidationPipe` | Confirmado |
| P5 | Pipe aceita qualquer versão de UUID | Confirmado |
| P6 | Nomes `ProductNotFoundException`, `InvalidProductIdException` e `ProductLookupFailedException` | Confirmado |

## Próximo passo

Etapa 1 concluída e UC14 aprovado pelo estudante. Etapa 2 (implementação) liberada.
