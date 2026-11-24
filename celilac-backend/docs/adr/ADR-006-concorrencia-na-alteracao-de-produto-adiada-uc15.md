# ADR-006 — Controle de concorrência na alteração de produto adiado (UC15)

- **Status:** Aceita
- **Data:** 2026-11-24
- **Decisores:** Estudante responsável (aprovação da especificação do UC15)
- **Caso de uso / fase:** UC15 — Alterar Produto, Etapa 1

## Contexto
A alteração muda um único atributo (`name`), e perder uma alteração simultânea tem custo baixo. Controlar a concorrência (por exemplo, com número de versão do produto) exigiria atributo novo, migration e mudança de contrato.

## Decisão
Em alterações simultâneas do mesmo produto vale a **última gravação** (*last write wins*). Não há controle de versão nem bloqueio. O teste de duas alterações em sequência documenta a regra; não é teste de concorrência real.

## Condição para retomar
Quando houver mais de um atributo alterável, ou quando passar a existir dado cuja perda de uma alteração tenha custo (por exemplo, preço, ADR-002). Nesse caso, criar um UC próprio de controle de concorrência.

## Consequências
- (+) UC simples, sem migration e sem mudança de contrato.
- (−) Uma alteração pode sobrescrever outra sem aviso.

## Alternativas consideradas
- Bloqueio otimista com versão do produto — descartada por ora: atributo novo, migration e contrato diferente para um ganho pequeno.
- Bloqueio pessimista — descartada: complexidade desproporcional.
