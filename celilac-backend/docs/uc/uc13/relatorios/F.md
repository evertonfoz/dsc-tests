# Relatório da Fase F — UC13 Listar Produtos

Fatos de 2026-11-23. Veredictos de gate são do estudante (regra 21).

## Executado
- Merge do PR #118 (7ea867d) e fechamento das issues #105 a #116.
- Auditoria arquitetural: `docs/uc/uc13/evidencias/F/auditoria.md`. Um achado menor (DTO de query importava constante do serviço), tratado em refatoração sem mudança de comportamento.
- Tabela de cobertura com o teste que prova cada CA: `docs/uc/uc13/evidencias/F/cobertura.md`.
- Roteiro de conclusão: `docs/uc/uc13/roteiro-conclusao-uc13.md`.

## Sem prova ou pendente
- Paridade entre `Intl.Collator('pt-BR')` (memória) e `COLLATE "pt-BR-x-icu"` (PostgreSQL): teste de paridade com 23 nomes (acentos, caixa, espaço, hífen, dígitos, `_`, `ñ`, `ç`) passou na primeira execução, sem RED (`docs/uc/uc13/evidencias/F/paridade-collation.txt`). Só vale para esses nomes e para a imagem `postgres:17` usada; outros casos de borda não foram exercitados.
- Falha real de consulta no PostgreSQL: só com repositório simulado.
- Gates das fases B a F, fechamento de #117 e do Epic #104: decisão do estudante.

## Ajuste do método
O validador rejeitava o PR único (`PR já usado`). Foi criado o campo opcional `pr_compartilhado` (ADR-005 do método, `method/decisoes/ADR-005-pr-compartilhado-entre-fatias.md`), com fixtures e testes em `method/scripts/testes/`. O `state.yaml` do UC13 passa em `check-state.sh --remote`.

## Desvios do método
Um PR para sete fatias (agora previsto como exceção declarada); F03 sem RED; GREEN da F05 corrigido em commit posterior (`docs/uc/uc13/relatorios/B-C.md`).
