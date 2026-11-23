# Relatório das fases B e C — UC13 (parcial)

Fatos de 2026-11-23; veredictos de gate são da pessoa responsável (regra 21).

## Executado nesta sessão
- Fatias F01 a F07 no núcleo (domínio + serviço + repositório em memória), ciclo RED→GREEN com evidências em `docs/uc/uc13/evidencias/B/`. ADR-005 (soft delete) registrada.
- C1: `GET /products` com `ListProductsQueryDto`, envelope `{ items, page, limit, total }`, mapeamento 400 e 500. Evidências em `docs/uc/uc13/evidencias/C/`.
- C2: coluna `deletedAt`, migration `1794342000000`, mapper e listagem paginada no PostgreSQL de testes.
- D: `docs/uc/uc13/contrato.md`. E: cenários `.http` e `run-checks.sh` atualizados (não executados no contêiner).

## Desvios do método (registrados)
1. As sete fatias foram feitas em **uma branch** (`feature/uc13-fatias-nucleo`) com commits RED/GREEN separados, e não em um PR por fatia (regra 11). Para cumprir a regra, a branch teria de ser dividida antes do push.
2. A F03 não teve RED: o comportamento já era satisfeito pela F01 (teste de caracterização).
3. O GREEN da F05 saiu incompleto no primeiro commit; a saída falha está em `evidencias/B/f05-green-tentativa-falha.txt` e o conserto em commit próprio.
4. A F01 incluiu uma implementação mínima no TypeORM (sem filtro de `deletedAt`) para manter o build verde; o filtro veio na C2.

## Pendências
Veja `docs/uc/uc13/evidencias/F/cobertura.md` (itens "Aguardando evidência"). Push, PR, merge e fechamento de issues: decisão humana.
