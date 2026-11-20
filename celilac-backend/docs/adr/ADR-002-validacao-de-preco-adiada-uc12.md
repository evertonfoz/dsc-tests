# ADR-002 — Validação de preço (RN02/FA02) adiada no UC12

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável (escolha registrada na reconciliação do piloto)
- **Caso de uso / fase:** UC12 — Cadastrar Produto, Fase A (reconciliação) e Fase F

## Contexto
O `uc-12.md` lista RN02 ("o preço deve atender às restrições definidas pelo domínio") e FA02 ("preço inválido"), mas declara que a validação do preço é **ilustrativa** e que os valores permitidos **não estão definidos**. O código implementa apenas `name` em `Product`, no DTO de entrada e na resposta (*Confirmado no código*). O relatório de consistência `01-12` declarava 100% de cobertura de RN01 a RN04, inclusive "preço positivo", sem teste que o provasse.

## Decisão
RN02 e FA02 ficam **fora do escopo atual** do UC12. Não há campo de preço no produto. A afirmação de cobertura de RN02/FA02 é retirada: na Fase F, esses itens constam como **"não implementado (ADR-002)"**.

## Condição para retomar
Quando a especificação definir o campo de preço e suas restrições (tipo, faixa, formato), o preço entra como **nova fatia** pelo ciclo B e C, com teste RED nomeado, e esta ADR passa a "Substituída".

## Consequências
- (+) Registra a lacuna em vez de escondê-la; evita implementar regra inventada (regra 7 do `AGENTS.md`).
- (+) O relatório de cobertura deixa de afirmar o que não tem prova.
- (−) O UC12 não cobre RN02/FA02 até a especificação ser completada.

## Alternativas consideradas
- **Implementar preço agora com regras assumidas** — descartada: as regras não estão definidas e a hipótese viraria requisito sem confirmação.
