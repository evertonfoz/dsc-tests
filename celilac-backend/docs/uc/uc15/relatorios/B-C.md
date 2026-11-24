# Relatório das Fases B, C e D — UC15 Alterar Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC15 — Alterar Produto |
| Fases | B (fatias no núcleo), C (HTTP e persistência) e D (contrato) |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | F01 a F05 (#142 a #146), C1 #148, C2 #149, D #150 |
| Branch | `feature/uc15-alterar-produto` (sem push, sem PR) |

## 1. O que foi feito
- **Núcleo (F01 a F05):** operação `updateActiveName` no contrato `ProductsRepository` (aditiva), implementação em memória, `ProductsService.updateProductName` com a regra do nome reaproveitada (`assertValidName`, compartilhada com o cadastro) — Executado.
- **HTTP (C1):** `UpdateProductDto` (só `name`) e `PUT /products/:productId`, reaproveitando `createProductIdPipe`, `toProductResponse` e o `DomainHttpExceptionFilter` — Executado.
- **Persistência (C2):** `TypeOrmProductsRepository.updateActiveName` com um único `UPDATE ... WHERE productId AND deletedAt IS NULL RETURNING`. Sem migration — Executado.
- **Contrato (D):** `docs/uc/uc15/contrato.md` — Documentado, com cada linha ligada a testes.

## 2. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | RED de F01 falha por `updateProductName is not a function` | Executado | `../evidencias/B/f01-red.txt` |
| 2 | GREEN de F01 (4 testes) | Executado | `../evidencias/B/f01-green.txt` |
| 3 | RED de F02 a F05: só F04 falhou (3 casos); F02, F03 e F05 já passavam | Executado | `../evidencias/B/f02-f05-red.txt` |
| 4 | GREEN de F02 a F05 e suíte de products (64 passam) | Executado | `../evidencias/B/f02-f05-green.txt` |
| 5 | RED de C1: 12 testes falham com 404 do framework | Executado | `../evidencias/B/c1-red.txt` |
| 6 | GREEN de C1: 12 passam | Executado | `../evidencias/B/c1-green.txt` |
| 7 | RED de C2: 3 falham por `updateActiveName is not a function`; 1 passou por acaso | Executado | `../evidencias/B/c2-red.txt` |
| 8 | GREEN de C2: 19 testes no banco de testes `celilac_test` | Executado | `../evidencias/B/c2-integration.txt` |
| 9 | e2e: 21 passam e 1 falha (`orders`, ADR-001) | Executado | `../evidencias/B/c1-c2-e2e.txt` |
| 10 | build e lint sem erros; `pnpm test`: 81 passam e 4 falham (`orders`, ADR-001) | Executado | `../evidencias/B/build.txt`, `lint.txt`, `unit-tests.txt` |
| 11 | Regressão UC12 a UC14: 76 testes de products passam, specs antigos sem diff | Executado | `../evidencias/F/regressao.txt` |
| 12 | Pureza arquitetural | Executado | `../evidencias/F/auditoria.txt` |

## 3. Desvios do método (registrados)
- **RED que não falhou (F02, F03, F05):** o GREEN de F01 já incluiu a tradução de "não encontrado" e de falha de persistência no Service, então os testes dessas fatias passaram sem RED. A fatia F04 teve RED real.
- **RED de C2:** o teste de falha de persistência passou por acaso, porque o `TypeError` da operação ausente é traduzido para `ProductPersistenceFailedException`. Os outros 3 testes falharam pelo motivo certo.
- **Testes de contrato (e2e)** foram escritos depois da implementação, sem RED, por serem provas de contrato da Fase D.
- **Branch única** `feature/uc15-alterar-produto` e fatias commitadas juntas (como no UC14); nenhuma fatia foi integrada nem tem PR.

## 4. Gate de saída
Pendente: nenhum gate foi marcado como aprovado. Decisão do estudante.

## 5. Pendências e riscos
- `run-checks.sh` e os cenários `.http` **não foram executados** (gravam no banco de desenvolvimento): Aguardando evidência.
- Sem push, sem PR, sem merge, sem fechamento de issues.
