# Relatório da Fase A — UC13 Listar Produtos

Fatos obtidos em 2026-11-23. Veredictos de gate são da pessoa responsável (regra 21).

## Itens do UC e cobertura (todos mapeados)

| Item do UC | Destino |
|---|---|
| RN01, RN06, RF05, RF07, FA02, CA05 | F02 (#107) + ADR-005; coluna e migration em C2 (#114) |
| RN02, RF02, CA03, CA04 | F04 (#109) |
| RN03, RF04, FA01, CA02 | F03 (#108) |
| RN04, RF01, RF03, CA01, CA07 | F01 (#106); CA07 também em C1 (#113) |
| RN05, CA08 | F05 (#110); PostgreSQL em C2 |
| RF06, FA03, CA06 | F06 (#111); mapeamento 400 em C1 |
| FE01, CA09 | F07 (#112); mapeamento 500 em C1 |
| CA10 | F02 (núcleo) e C1/C2 (regressão do POST) |
| CA11 | C2 (#114) |
| CA12 | C1 (#113) e Fase E (#116) |
| CA13 | Fase F (#117) |
| Teto de `limit` = 100 | Candidata confirmada pelo estudante em 2026-11-23 |

## DoR das fatias
Objetivo, escopo, critérios, teste RED nomeado, dependências e responsável: atendidos nas sete fatias. Revisão: modo solo, feita por IA, **não independente**. F01 em `Ready`; as demais em `Backlog` por dependência.

## Publicação (Executado nesta fase)
Epic #104; Sub-Issues #105 a #117 vinculadas ao Epic; Project #6 com os 14 itens (F01 em Ready, demais em Backlog). Saída em `docs/uc/uc13/evidencias/A/publicacao.txt`.

## Observações
- O Project #6 mantém o título "CeliLac — UC12 Cadastrar Produto". Não foi renomeado (ato fora do escopo).
- `GET /products → 404` é contrato testado hoje; a troca é deliberada (C1/E).
