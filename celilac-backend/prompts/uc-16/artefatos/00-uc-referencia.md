# 00 — UC de referência e mapa de fontes (UC16 — Remover Produto)

> Gerado pela Etapa 1 de [`uc-remover.md`](../uc-remover.md). Origem das afirmações: **Confirmado no código** (leitura de arquivos e buscas), **Confirmado pelo estudante** (respostas desta execução) ou **Pendente** (ainda sem resposta). Leitura feita na branch `main`, somente leitura.

## Valores desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC15 — Alterar Produto (`prompts/uc-15/artefatos/03-uc-15-alterar-produto.md`), moldado no UC12 (13 seções) | Confirmado pelo estudante |
| `ENTIDADE` | `Product` (`src/modules/products/entities/product.entity.ts`) | Confirmado pelo estudante |
| `ARTEFATOS` | `prompts/uc-16/artefatos/` | Confirmado pelo estudante |
| Versionamento dos artefatos | autorizado (commit local; push e PR continuam exigindo confirmação) | Confirmado pelo estudante |
| Descrição prévia (módulo 0) | o estudante não tinha; pediu que o assistente a redigisse (ver nota abaixo) | Confirmado pelo estudante |
| `ALVO` | UC16 — Remover Produto (arquétipo `excluir`) | Confirmado pelo estudante |
| `CHAVE` | `productId` (UUID) | Confirmado pelo estudante (3a) |
| `POLITICA` | remoção lógica | Confirmado pelo estudante (3b) |
| `MARCA` | `deletedAt` (já existe, ADR-005) | Confirmado pelo estudante (3c) |
| `RESPOSTA` | `204 No Content`, sem corpo | Sugestão do assistente, aceita pelo estudante (3d) |
| Itens de 3.2 | os oito itens sugeridos | Confirmados pelo estudante |

**Nota sobre a descrição prévia.** O prompt manda não redigi-la sem as respostas do estudante. Ela foi redigida **depois** das respostas da pergunta 3 e das decisões de 3.2, em [`02-descricao-previa-uc16.md`](./02-descricao-previa-uc16.md), como **proposta** a ser revisada e aprovada por ele (mesmo procedimento do UC15).

## Mapa de fontes (2.1)

| Fonte esperada | Encontrada? | Caminho real |
|---|---|---|
| Especificação padrão do UC12 | sim | `docs/planejamento/uc12-cadastrar-produto/uc-12.md` |
| Materiais `prompts/01` a `13` | sim, com sufixo | `prompts/uc-12/01-…` a `13B-…` |
| Apoio do módulo 0 | sim | `prompts/uc-14/uc-buscar-por-que-este-metodo.md` |
| Apoio do módulo 1 | sim | `prompts/uc-15/uc-alterar-cobertura-real.md` |
| Apoio do módulo 2 | sim | `prompts/uc-16/uc-remover-estado-como-fonte.md` |
| Módulos e práticas do curso (m00, m01, m02) | sim | `method/didatico/curso/` |
| Prompts de listagem, busca e alteração | sim | `prompts/uc-13/uc-listar.md`, `prompts/uc-14/uc-buscar.md`, `prompts/uc-15/uc-alterar.md` |
| Resumos de execução dos UCs anteriores | sim | `prompts/uc-13/`, `prompts/uc-14/`, `prompts/uc-15/` (`…-resumo-da-execucao-uc<NN>.md`) |
| ADRs | sim | `docs/adr/ADR-001` a `ADR-007` |
| Perfil do projeto | sim | `project-profile.md` |
| Método (playbooks, templates, scripts) | sim | `method/` (inclui `matriz-arquetipos.md` e `templates/state.yaml`) |

## Estrutura de documentação (2.2)

| Item | Existe? | Observação |
|---|---|---|
| `docs/planejamento/` | sim | Há `uc12`, `uc13` e `uc15`; **não** há pasta do UC16 |
| `docs/uc/uc16/` (`state.yaml`, `relatorios/A.md`) | **não** | A criar em 3.5, com autorização |
| `docs/adr/` | sim | ADR-001 a ADR-007; a próxima livre é a ADR-008 |
| `method/templates/` e `method/scripts/check-state.sh` | sim | Modelos de referência disponíveis |
| `prompts/uc-16/artefatos/` | criada nesta etapa | Pasta confirmada pelo estudante |
