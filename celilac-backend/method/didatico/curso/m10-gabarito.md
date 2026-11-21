---
id: m10-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 10'
gabarito_de: [m10]
---

# Gabarito do professor — Módulo 10

> Uso exclusivo do professor.

## Seção 2 (respostas esperadas)
1. Na **fase B** (comportamento novo é fatia). Justificativa: ADR-004 do método.
2. B volta a `em_andamento`, gate "todas as fatias integradas" pendente; C e D mantêm status, e só a afetada volta a `em_andamento`.
3. A pessoa responsável; a IA propõe com evidência.
4. Seção "Reabertura" no relatório (data, motivo, fatias), fatia `planejada` no `state.yaml`, citação da ADR do projeto que motivou.
Aceitar respostas diferentes **se justificadas**; o ponto é o raciocínio, não decorar.

## Fatos verificados na preparação
- `method/decisoes/ADR-004-retorno-a-fase-anterior.md` existe e diz o resumido no módulo (inclusive o item "o validador não muda").
- Commit `8aeef61` ("reopen phases B and C for F05, F06 and C1b") altera `state.yaml` e os relatórios B e C.
- `docs/uc/uc12/relatorios/B.md` tem a seção 8, "Reabertura (2026-11-20)", com fechamento citando PR #44, PR #45 e commit e52d954.
- `docs/uc/uc12/state.yaml` final: B, C e D com status `concluida`, com comentário da reabertura nas fases B e C.

## Exercícios
1. Mistura planejamento com contrato, e a fatia pode ficar sem RED (alternativa descartada na ADR).
2. O histórico de aprovações das fases posteriores e as datas/pessoas dos gates.
3. Texto de uma mensagem que não muda comportamento observável (ADR-003 do método: fatia = comportamento observável); registrar como ajuste, sem reabertura.
4. A pessoa responsável; a IA só propõe.
5. Estado não linear durante a reabertura, ou gates aprovados de fases adiantadas que continuam registrados.

## Pontos de atenção
- Critério para "afetada": a fatia mexe na fronteira daquela fase? A decisão é de julgamento; discutir casos.
- Verificar a saída real do validador na prática 2; é fácil o aluno só dizer que rodou.
- A afirmação do exercício 3 sobre o que não reabre é aplicação do conceito de fatia, não texto literal da ADR-004; deixar claro ao turma.

## Sinais de que o aluno não entendeu
- Implementa na fase atual sem reabrir.
- Apaga ou reescreve gates antigos.
- Reabre todas as fases por precaução.
