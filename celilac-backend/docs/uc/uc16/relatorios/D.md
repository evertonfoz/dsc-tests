# Relatório da Fase D — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | D — Contrato |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #165, Epic #156 |
| PR | #168 (integrado em 84dc4a9) |

## 1. O que foi feito
- Contrato de `DELETE /products/:productId` em `docs/uc/uc16/contrato.md`, com cada linha ligada a testes (controller, núcleo, PostgreSQL de testes e e2e) — Documentado.
- Reexecução dos testes que protegem o contrato — Executado (`../evidencias/D/contrato-testes.txt`): controller e núcleo 19 passam, integração 24 passam; o e2e rodou a suíte inteira (25 passam, 1 falha de `orders`, anterior ao UC16).
- A resposta anterior (`404` do framework) foi observada no contêiner antes da reconstrução (`../evidencias/E/antes-rota-inexistente.txt`) e não era fixada por nenhum teste ou script (conferido por `grep`).

## 2. Limites declarados
- Remoções simultâneas provadas no nível do serviço, não com duas requisições HTTP.
- A verificação no contêiner veio na Fase E (`../evidencias/E/run-checks.txt`).

## 3. Gate de saída
Aprovado pelo estudante (ver `state.yaml`).
