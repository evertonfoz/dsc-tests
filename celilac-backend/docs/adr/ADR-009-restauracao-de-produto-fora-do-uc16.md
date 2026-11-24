# ADR-009 — Restauração de produto removido fora do UC16

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC16)
- **Caso de uso / fase:** UC16 — Remover Produto, Etapa 1

## Contexto
Como a remoção é lógica, seria possível desfazê-la. A especificação do UC16 não pede isso, e restaurar mistura duas operações em um caso de uso. Também seria preciso decidir o que fazer se, depois da remoção, outro produto for cadastrado com o mesmo nome.

## Decisão
A restauração está **excluída** do UC16. Um produto removido só volta a existir por um UC próprio.

## Condição para retomar
Um UC de restauração, se um dia for especificado.

## Consequências
- (+) O UC16 fica pequeno e verificável.
- (−) Quem precisar desfazer uma remoção terá de esperar outro UC (ou mexer direto no banco).

## Alternativas consideradas
- Restaurar ao cadastrar de novo — descartada: mistura operações e muda o UC12.
