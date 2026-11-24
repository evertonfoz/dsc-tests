# 00 — UC de referência e mapa de fontes (UC15 — Alterar Produto)

> Gerado pela Etapa 1 de [`uc-alterar.md`](../uc-alterar.md). Origem das afirmações: **Confirmado no código** (leitura de arquivos) ou **Confirmado pelo estudante** (respostas desta execução).

## Valores confirmados desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC14 — Buscar Produto por Identificador (`prompts/uc-14/uc-14-buscar-produto.md`), moldado no UC12 (13 seções) | Confirmado pelo estudante |
| `ENTIDADE` | `Product` (`src/modules/products/entities/product.entity.ts`) | Confirmado pelo estudante |
| `CHAVE` | `productId` (UUID, chave primária) | Confirmado pelo estudante |
| `ALTERAVEIS` | `name` | Confirmado pelo estudante |
| `CAMPOS` | `productId`, `name` | Confirmado pelo estudante |
| `ALVO` | UC15 — Alterar Produto (`PUT /products/:productId`) | Confirmado pelo estudante |
| `ARTEFATOS` | `prompts/uc-15/artefatos/` | Confirmado pelo estudante |
| Versionamento dos artefatos | autorizado (commit local; push e PR continuam exigindo confirmação) | Confirmado pelo estudante |

## Régua extraída do `REF` (UC14)

O `REF` é um UC de **consulta**. Aproveita-se a estrutura das 13 seções, os valores `[confirmado]/[candidato]/[existente]`, a rastreabilidade e a lista de decisões. Não se copiam fluxos exclusivos da consulta. As regras de validação do nome vêm do UC12 (ADR-004).

| # | Seção do `REF` | Aplicada ao UC15 |
|---|---|---|
| 1 | Identificação | sim |
| 2 | Objetivo | sim |
| 3 | Atores | sim |
| 4 | Pré-condições | sim |
| 5 | Pós-condições (sucesso e falha) | sim |
| 6 | Fluxo principal | sim |
| 7 | Fluxos alternativos e de exceção | sim, com identificador inválido, inexistente, removido, nome inválido e falha ao gravar |
| 8 | Regras de negócio (RN) | sim |
| 9 | Validações e restrições | sim |
| 10 | Requisitos (RF) e tabela de atributos | sim |
| 11 | Considerações arquiteturais | sim |
| 12 | Critérios de aceite (CA) e rastreabilidade | sim |
| 13 | Escopo | sim |

## Mapa fonte → caminho real (2.1 e 2.2)

| Fonte esperada | Caminho real | Observação |
|---|---|---|
| Modelo de especificação (UC12) | `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | Encontrado |
| `REF` | `prompts/uc-14/uc-14-buscar-produto.md` | Encontrado, lido inteiro |
| Materiais `prompts/01` a `13` | `prompts/uc-12/01-…` a `13B-…` (sufixos A, B, C) | Pasta diferente da citada no prompt |
| `uc-listar.md` | `prompts/uc-13/uc-listar.md` | Pasta diferente da citada |
| `uc-buscar.md` | `prompts/uc-14/uc-buscar.md` | Encontrado |
| Resumos de execução UC13 e UC14 | `prompts/uc-13/uc-listar-resumo-da-execucao-uc13.md`, `prompts/uc-14/uc-buscar-resumo-da-execucao-uc14.md` | Encontrados |
| Módulos 0 e 1 do curso | `method/didatico/curso/m00-*.md`, `m01-*.md` | Encontrados |
| `docs/uc/` | `docs/uc/uc12`, `uc13`, `uc14` (com `relatorios/`, `evidencias/`, `state.yaml`) | Não existe `uc15` |
| `docs/adr/` | ADR-001 a ADR-005 | Próximo número livre: ADR-006 |
| `docs/planejamento/` | `uc12-cadastrar-produto`, `uc13-listar-produtos` | Não existe pasta do UC15 |
| `method/` e `method/templates/` | `method/templates/` com `caso-de-uso.md`, `adr.md`, `evidencia-de-comando.md`, `state.yaml` etc. | Encontrados |
| `method/scripts/` | `check-state.sh`, `check-links.mjs` | Encontrados |
| `project-profile.md` | raiz do repositório | Encontrado |
| `gh` | autenticado (conta `evertonfoz`) | Disponível |

Estrutura do UC15 (`docs/planejamento/`, `docs/uc/uc15/`, `docs/adr/ADR-006…`): **Aguardando decisão** (autorização para criar ainda não dada; ver `04-cobertura-e-adrs-propostas.md`).
