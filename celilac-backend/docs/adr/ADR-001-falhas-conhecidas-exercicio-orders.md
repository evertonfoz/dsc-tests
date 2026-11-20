# ADR-001 — Falhas conhecidas: exercício didático do módulo `orders`

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável
- **Issue:** #20 (Fundação)

## Contexto
O módulo `orders` contém um exercício de aula: em `OrdersService`, a injeção de `PaymentsRepository` e a verificação de pagamento (`findByOrderId`, `PaymentNotFoundException`, `PaymentNotApprovedException`, `order.confirm(payment.status)`) estão **comentadas**. Os testes já descrevem o comportamento completo e, por isso, falham (estado RED proposital). Solução de referência existe em `celillac-backend-prepare/`.

Falhas conhecidas (5):
| Nível | Arquivo | Testes |
|---|---|---|
| Unitário | `src/modules/orders/services/orders.services.spec.ts` | 4: pagamento inexistente, pendente, rejeitado e aprovado |
| E2E | `test/orders/confirm-order.e2e-spec.ts` | 1: confirma pedido com pagamento aprovado (recebe `PENDING`, espera `CONFIRMED`) |

## Decisão
1. O **CI exclui esses arquivos pela linha de comando do workflow** (`--exclude`), não pela configuração do Vitest. Quem executa `pnpm test` ou `pnpm test:e2e` localmente continua vendo as falhas do exercício.
2. A lista de exclusões fica **em um único lugar** (variáveis `KNOWN_FAILURES_*` no workflow) e referencia esta ADR.
3. Quando o exercício for resolvido, as exclusões são **removidas** e esta ADR passa a "Substituída".
4. Nenhuma outra falha pode ser excluída sem uma ADR própria.

## Consequências
- (+) CI verde e honesto; as falhas ficam documentadas e visíveis localmente.
- (−) O CI não protege o comportamento de confirmação de pedidos enquanto o exercício estiver aberto.
- (−) A lista precisa ser mantida: ela é verificável porque cada exclusão aponta para uma ADR.

## Alternativas descartadas
- **Excluir no `vitest.config.ts`:** esconderia as falhas de quem estuda o exercício.
- **CI vermelho:** inutilizaria o CI como sinal.
- **Marcar os testes com `it.skip`/`it.fails`:** altera o material didático.
