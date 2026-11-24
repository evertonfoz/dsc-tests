# Relatório da Fase F — UC15 Alterar Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC15 — Alterar Produto |
| Fase | F — Auditoria e encerramento |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #152 (fase), Epic #141 |
| PR | #153 (integrado em e138874 em 2026-11-24) |

## 1. O que foi feito
- Verificação final: build, lint, `pnpm test`, integração e e2e — Executado (`../evidencias/F/verificacao-final.txt`).
- Auditoria arquitetural, somente leitura, sem achados — Executado (`../evidencias/F/auditoria.md`, `auditoria.txt`).
- Conferência dos 27 nomes de teste da tabela de cobertura contra o código — Executado (`../evidencias/F/cobertura.md`): 27 encontrados, 0 ausentes.
- Regressão dos UC12 a UC14 — Executado (`../evidencias/F/regressao.txt`) e `git diff` vazio nos specs antigos.
- CI do PR #153: quatro jobs com sucesso (qualidade, integração e e2e, smoke do Compose com `run-checks` e GitGuardian) — Executado (consulta ao GitHub em 2026-11-24).

## 2. Resultados
| Verificação | Resultado |
|---|---|
| `pnpm build` | passa |
| `pnpm lint` | sem erros (avisos anteriores ao UC15) |
| `pnpm test` | 81 passam, 4 falham (`orders`, ADR-001) |
| `pnpm test:integration` | 19 passam |
| `pnpm test:e2e` | 21 passam, 1 falha (`orders`, ADR-001) |
| `run-checks.sh --durability` (contêiner) | 47 ok, 0 falha (`../evidencias/E/run-checks.txt`) |

## 3. Gate de saída
| Verificação | Resultado | Validado por |
|---|---|---|
| Todo item do UC tem teste que o prova ou ADR | aprovado (13 *Coberto*, 1 *Parcial*, 2 *Não implementado* com ADR-006 e ADR-007) | evertonfoz (2026-11-24) |
| Arquitetura em conformidade, achados tratados | aprovado (nenhum achado) | evertonfoz (2026-11-24) |
| `state.yaml`, documentos e GitHub consistentes | aprovado (`check-state.sh --remote` e `check-links.mjs`) | CI e verificação local |
| Issues e Epic fechados | aprovado: #141 a #152 fechadas após o merge; itens do Project #6 em `Done` | evertonfoz (2026-11-24) |

## 4. Promoção do arquétipo `atualizar` (esboço → validado)
Autorizada pelo estudante em 2026-11-24. O que foi diferente do esboço, registrado em `method/playbooks/matriz-arquetipos.md` (seção 3.2) e em `guia-decomposicao-em-fatias.md` (seção 5.1):
- `PUT` escolhido por haver um único atributo alterável (o esboço deixava `PUT`/`PATCH` em aberto); 409 e concorrência ficaram **fora** do UC (ADR-006).
- Risco novo: o `save` em memória acrescenta, então o Repository ganhou operação própria de atualização.
- Atualização atômica (`UPDATE ... AND deletedAt IS NULL RETURNING`).
- Corte em fatias pode gerar RED que não falha (F02, F03 e F05).
- Não exercitado: `PATCH`, corpo vazio, vários atributos, `409`.

## 5. Pendências e riscos
- Merge feito pelo assistente por autorização expressa do estudante; CI da `main` com sucesso (run 45438561157).
- Item *Parcial* (CA13): os arquivos `.http` não foram executados um a um; o contrato foi provado pelo `run-checks.sh`.
