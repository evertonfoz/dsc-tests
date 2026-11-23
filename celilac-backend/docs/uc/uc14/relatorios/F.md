# Relatório da Fase F — UC14 Buscar Produto por Identificador

| Campo | Valor |
|---|---|
| Caso de uso | UC14 — Buscar Produto por Identificador |
| Fase | F — Auditoria e encerramento |
| Período | 2026-11-23 |
| Responsável | evertonfoz |
| Issue(s) | #137, Epic #126 |
| Branch / PR | `feature/uc14-buscar-produto` / PR ainda não aberto |
| Commit de referência | `0585749` (último commit antes desta fase) |

## 1. Objetivo da fase
Provar item a item o UC14, auditar a arquitetura, conferir a regressão e preparar o roteiro de conclusão.

## 2. O que foi feito
- Tabela de cobertura com o teste que prova cada item — Executado nesta fase (`../evidencias/F/cobertura.md`).
- Auditoria arquitetural — Executado nesta fase (`../evidencias/F/auditoria.md`, `auditoria.txt`).
- Regressão: `pnpm test` 59 passam e 4 falham (`orders`, ADR-001); `pnpm test:integration` 15 de 15; `pnpm test:e2e` 10 passam e 1 falha (`orders`); build 0; lint exit 0 — Executado nesta fase (`../evidencias/F/regressao.txt`).
- `run-checks.sh` no contêiner: 36 ok, 0 falha — Executado na Fase E (`../evidencias/E/run-checks.txt`).
- CI na branch principal — **Aguardando evidência** (sem push nem PR).

## 3. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Todo item do UC tem teste que o prova ou ADR | `../evidencias/F/cobertura.md` | pendente | pessoa |
| Arquitetura em conformidade, achados tratados | `../evidencias/F/auditoria.md` | pendente | pessoa |
| `state.yaml`, documentos e GitHub consistentes | `check-state.sh --remote` e `check-links.mjs` | pendente | CI/pessoa |
| Issues e Epic fechados | GitHub | pendente | pessoa |

## 4. Decisões e hipóteses
- CA09 ficou **parcial**: CA04 e CA06 sem cenário `.http` executável (motivos em `cobertura.md`).
- F03 e C2 sem RED, validados por mutação.

## 5. Pendências e riscos
CI, PR, merge e fechamento de issues dependem do estudante. As falhas de `orders` são anteriores ao UC14.
