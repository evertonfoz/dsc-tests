# ADR-010 — Remoção física (*purge*) de produtos removidos fora do UC16

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC16)
- **Caso de uso / fase:** UC16 — Remover Produto, Etapa 1

## Contexto
Os registros removidos continuam no banco. Apagá-los de vez (*purge*) perde histórico e exigiria tratar integridade referencial caso, no futuro, outras entidades referenciem produtos. Hoje não há referência a produto em pedidos nem em pagamentos (busca textual; a Etapa 2 confirma no banco).

## Decisão
O *purge* está **excluído** do UC16. A remoção do UC16 é sempre lógica.

## Condição para retomar
Necessidade de liberar espaço, exigência legal de apagar dados ou política de retenção definida, em UC próprio.

## Consequências
- (+) Nenhum dado é perdido por esta operação.
- (−) O banco acumula registros removidos.

## Alternativas consideradas
- Remoção física já no UC16 — descartada: é irreversível e muda o que os UCs 13 a 15 assumem sobre produto removido.
