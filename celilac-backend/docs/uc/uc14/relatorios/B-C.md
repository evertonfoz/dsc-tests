# Relatório das Fases B a E — UC14 Buscar Produto por Identificador

> Fatos e evidências, sem veredicto. Saídas brutas em `../evidencias/`.

| Campo | Valor |
|---|---|
| Período | 2026-11-23 |
| Issues | Fatias #127 a #131; fases #133 (C1), #134 (C2), #135 (D), #136 (E) |
| Branch / PR | `feature/uc14-buscar-produto` / #138, integrado em `6963f1f` |

## Fase B — fatias no núcleo
| Fatia | RED | GREEN | Observação |
|---|---|---|---|
| F01 #127 | `e11ce97` | `44c931e` | `findActiveById` no contrato; TypeORM entrou aqui para o build compilar |
| F02 #128 | `3c59916` | `da3fa04` | RED por módulo inexistente |
| F03 #129 | `c13dde8` | sem código novo | Sem RED; validado por mutação (`../evidencias/B/f03-red.txt`) |
| F04 #130 | `267967a` | `5177172` | RED por módulo inexistente |
| F05 #131 | `65b8f9b` | `4c5cb0a` | Pipe de UUID testável sem HTTP |

## Fase C — adaptadores
- C1 #133: RED `feca9c2` (5 falhas), GREEN `6502db9`. Mapeamento 404, 400 e 500 no filtro de exceções.
- C2 #134: 6 testes no `postgres_test`; sem migration; sem RED, validado por mutação (`../evidencias/B/c2-red.txt`). `pnpm test:integration`: 15 de 15; `pnpm test:e2e`: 10 passam, 1 falha conhecida de `orders`.

## Fase D — contrato
`../contrato.md`, com Esperado × Obtido ligado aos testes.

## Fase E — verificação
`run-checks.sh` no contêiner: 36 ok, 0 falha (`../evidencias/E/run-checks.txt`). CI do PR #138: quatro checks `pass`.

## Pendências
CA09 parcial (sem `.http` para CA04 e CA06), aceito pelo estudante.
