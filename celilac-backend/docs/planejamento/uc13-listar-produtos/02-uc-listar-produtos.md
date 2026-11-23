# UC13 — Listar Produtos

> Itens marcados **[proposta]** precisam ser confirmados na especificação original. Itens **[decidido]** foram definidos pelo estudante na Etapa 1.
> **Status: validado pelo estudante em 2026-11-23** (gate da Etapa 1 aprovado; respostas às perguntas em aberto registradas no fim deste documento).

## 1. Identificação do caso de uso

**Código:** UC13
**Nome:** Listar Produtos
**Sistema:** CeliLac
**Módulo:** Gerenciamento de Produtos
**Tipo:** Caso de uso funcional (consulta)

## 2. Objetivo

Permitir a consulta paginada dos produtos **ativos** cadastrados na plataforma CeliLac, retornando para cada produto o identificador e o nome.

## 3. Atores envolvidos

**Ator principal [decidido]:** Consumidor da API do CeliLac (usuário da plataforma ou aplicação cliente), em **consulta pública, sem permissão específica**.
**Justificativa:** a listagem é leitura sem dado sensível (apenas `productId` e `name`), e o código não possui autenticação nem autorização; exigir permissão criaria requisito inexistente. O UC12 deixou o ator pendente da mesma forma. **Precisa ser confirmado na especificação original.**

## 4. Pré-condições

1. O sistema CeliLac e a persistência estão operacionais. **[proposta]**
2. Nenhuma permissão específica é exigida. **[proposta]**

## 5. Pós-condições

### Sucesso
1. O sistema devolve a página solicitada de produtos ativos, com `200`.
2. Nenhum dado é alterado (operação somente leitura).

### Falha
1. Nenhuma página é devolvida.
2. O sistema comunica a falha conforme o contrato de erros do projeto (ADR-003/ADR-004; a semântica exata da consulta é **[proposta]**, ver FE01).

## 6. Fluxo principal

1. O ator solicita `GET /products`, opcionalmente informando `page` e `limit`.
2. O sistema valida os parâmetros de paginação.
3. O serviço de aplicação solicita ao repositório a página de produtos ativos, em ordem estável.
4. O repositório consulta a persistência considerando apenas produtos ativos.
5. O sistema retorna `200` com a página de itens `{ productId, name }` e os metadados de paginação.

## 7. Fluxos alternativos e de exceção

### FA01 — Nenhum produto ativo **[decidido]**
Se não houver produto ativo (ou a página estiver além do fim), o sistema retorna `200` com lista vazia e metadados coerentes. Lista vazia **não** é erro.

### FA02 — Produto removido (soft delete) **[decidido]**
Produtos marcados como removidos não aparecem em nenhuma página nem entram no total.

### FA03 — Parâmetros de paginação inválidos **[proposta]**
`page` ou `limit` não inteiros, menores que 1, ou `limit` acima do teto (100): o sistema rejeita com `400` no formato único de erros 400 (ADR-004). Nenhuma consulta é feita.

### FE01 — Falha na persistência **[proposta]**
Falha ao consultar: a aplicação trata conforme os contratos do projeto e informa que a operação não foi concluída (status a alinhar com ADR-003).

## 8. Regras de negócio

| RN | Descrição | Situação |
|---|---|---|
| RN01 | A listagem retorna **somente produtos ativos** (não removidos). | Confirmada (estudante) |
| RN02 | A paginação usa **20 itens por página** como padrão; o cliente pode pedir mais via `limit`, até um teto máximo. | Confirmada (padrão 20; cliente pode pedir mais); **valor do teto: 100, candidata** |
| RN03 | Lista vazia é resultado de sucesso (`200`). | Confirmada |
| RN04 | Cada item expõe **apenas** `productId` e `name`; o indicador de remoção e qualquer outro atributo interno não são expostos. | Confirmada (campos) |
| RN05 | A ordenação é estável e determinística: por `name` ascendente e, em empate, por `productId`. | Candidata |
| RN06 | O conceito de **soft delete** passa a existir na entidade `Product`. | Confirmada (estudante); forma da modelagem **candidata** (ver §11 e ADR) |

## 9. Validações e restrições

- `page`: inteiro ≥ 1; padrão 1. **[proposta]**
- `limit`: inteiro entre 1 e 100; padrão 20 (teto 100 é **candidata**, pois "pedir mais" exige um limite superior). **[proposta]**
- Parâmetros desconhecidos são ignorados, como em ADR-004 (item 4). **[proposta]**
- **Não definido:** filtro, busca textual, ordenação escolhida pelo cliente, autenticação.
- **Fora de escopo:** preço (ADR-002).

## 10. Requisitos funcionais

| RF | Descrição |
|---|---|
| RF01 | Disponibilizar `GET /products` que lista produtos ativos. |
| RF02 | Paginar o resultado (padrão de 20 itens; `limit` ajustável até o teto). |
| RF03 | Retornar por item exatamente `productId` e `name` (tabela campo→retornado em `00-uc-referencia.md`). |
| RF04 | Retornar `200` com lista vazia quando não houver produtos ativos. |
| RF05 | Excluir produtos removidos (soft delete) da lista e do total. |
| RF06 | Rejeitar parâmetros de paginação inválidos com `400`. |
| RF07 | Introduzir o conceito de soft delete em `Product` (domínio, persistência e migration) sem alterar `productId`, `name`, `save` nem o contrato do `POST /products`. |

## 11. Considerações arquiteturais

Unidades de trabalho possíveis, a refinar depois da aprovação:

1. Modelar soft delete na entidade `Product` e na persistência (ORM + migration, com valor padrão que mantenha os produtos existentes **ativos**). **Requer ADR** (ex.: ADR-005), pois a regra 2 do prompt exige decisão própria para novo atributo. Forma **decidida**: `deletedAt` anulável (`null` = ativo).
2. Ampliar o contrato do Repository com operação de listagem paginada (aditivo; `save` inalterado), com implementação em memória e TypeORM.
3. Caso de uso no Service (`listProducts`), sem HTTP/ORM.
4. Endpoint `GET /products` com DTO de query (`page`, `limit`) e envelope de resposta `{ items, page, limit, total }` **[proposta]** reutilizando `ProductResponseDto` nos itens.
5. Testes: Service, controller, integração, persistência (PostgreSQL de testes) e contrato.
6. Atualizar os testes que fixam `GET /products → 404` (`inventario-contrato.e2e-spec.ts`, `run-checks.sh`) e adicionar cenários `.http`.
7. Documentação técnica/ADR de paginação, soft delete e formato.

Observação: **não existe operação de remoção** hoje. O UC13 introduz só o conceito (atributo + filtro); a remoção de produto seria outro UC. Nos testes, produtos removidos são criados diretamente via repositório/ORM.

## 12. Critérios de aceite

| CA | Critério | Liga a |
|---|---|---|
| CA01 | Com produtos ativos cadastrados, `GET /products` retorna `200` e itens com exatamente `productId` e `name`. | RF01, RF03, RN04 |
| CA02 | Sem produtos ativos, retorna `200` com `items: []` e `total: 0`. | RF04, RN03, FA01 |
| CA03 | Sem parâmetros, retorna no máximo 20 itens e `page: 1`, `limit: 20`. Com `limit=50`, retorna até 50 itens. | RF02, RN02 |
| CA04 | Com mais de 20 produtos ativos, `page=2` retorna os itens seguintes, sem repetição nem omissão. | RF02, RN02, RN05 |
| CA05 | Produto removido não aparece em nenhuma página e não conta em `total`. | RF05, RN01, RN06, FA02 |
| CA06 | `page=0`, `limit=0`, `limit=101` ou valores não numéricos retornam `400` e não consultam o repositório. | RF06, FA03 |
| CA07 | A resposta não contém o indicador de remoção nem outros campos além de `productId` e `name` por item. | RF03, RN04 |
| CA08 | A ordem é por `name` e, em empate, por `productId`, de forma repetível. | RN05 |
| CA09 | Falha na persistência produz a resposta de erro definida, sem corpo parcial. | FE01 |
| CA10 | `POST /products` mantém status, corpo e testes do UC12; produtos novos nascem ativos. | RF07 |
| CA11 | A migration preserva os produtos existentes como ativos e é reversível. | RF07, RN06 |
| CA12 | Rota inexistente continua `404`. | Regressão |
| CA13 | Cada CA acima tem teste automatizado nomeado. | Todos |

## 13. Escopo do trabalho

**Dentro:** especificação do UC13 (Etapa 1); depois, implementação conforme §11, após aprovação.
**Fora:** preço (ADR-002); operação de remover produto; filtro e busca; autenticação; ordenação escolhida pelo cliente; alteração do contrato do `POST /products`.
Nesta etapa não há código, branches, PRs, Issues nem commits.

## Rastreabilidade

| Origem | CA |
|---|---|
| RN01 | CA05 |
| RN02 | CA03, CA04 |
| RN03 | CA02 |
| RN04 | CA01, CA07 |
| RN05 | CA04, CA08 |
| RN06 | CA05, CA11 |
| RF01 | CA01 |
| RF02 | CA03, CA04 |
| RF03 | CA01, CA07 |
| RF04 | CA02 |
| RF05 | CA05 |
| RF06 | CA06 |
| RF07 | CA10, CA11 |
| FA01 | CA02 |
| FA02 | CA05 |
| FA03 | CA06 |
| FE01 | CA09 |

## Respostas às perguntas (2026-11-23)

| # | Pergunta | Resposta |
|---|---|---|
| 1 | Ator | Confirmado: consumidor sem permissão específica |
| 2 | Limite | Padrão 20; cliente pode pedir mais. **Teto de 100 proposto na implementação** (precisa de confirmação do valor) |
| 3 | Formato | `{ items, page, limit, total }` aceito |
| 4 | Soft delete | `deletedAt` anulável |
| 5 | Falha de persistência | Seguir a sugestão: semântica da ADR-003 |
| 6 | Ordenação | `name` asc, depois `productId` |
| 7 | Versionar | Sim |

## Perguntas em aberto

1. Confirmar o teto de `limit` (proposta: 100).
2. Confirmar na ADR-003 o status exato da falha de persistência na consulta (será lido e citado no teste RED).
