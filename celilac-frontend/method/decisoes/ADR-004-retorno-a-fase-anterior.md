# ADR-004 — Retorno a uma fase anterior quando surgem fatias novas

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável
- **Origem:** piloto do UC12 (Fase D descobriu duas fatias novas depois de a Fase B fechar)

## Contexto
O método assume ordem linear A → F. Na prática, a Fase D (contrato) ou a E (verificação) pode revelar um comportamento que o UC não cobria e que merece fatia própria. O validador do `state.yaml` rejeita "fase B concluída, mas há fatias não integradas", e os playbooks não diziam o que fazer.

## Decisão
1. **Fatia descoberta depois da Fase B reabre a Fase B.** Não se cria exceção para "fatias de fase D". A fatia segue o ciclo normal: issue, RED, GREEN, PR, revisão humana.
2. **Como registrar no `state.yaml`:**
   - `fase_atual` volta a `B`; a Fase B passa a `em_andamento`, com o gate "Todas as fatias integradas" de volta a `pendente`.
   - As fases posteriores **mantêm seu status** como histórico. Só voltam a `em_andamento` as que forem afetadas pelo novo trabalho (ex.: a C, se a fatia exigir mudança na fronteira HTTP).
   - A fatia nova entra em `fatias` como `planejada`, e o relatório da fase reaberta ganha uma seção "Reabertura" com data, motivo e fatias.
3. **Quem decide** reabrir é a pessoa responsável; o agente propõe, com a evidência da descoberta.
4. **Rastreabilidade:** a ADR do projeto que motivou a descoberta é citada no relatório.
5. **O validador não muda.** Já aceita `fase_atual` anterior à de fases adiantadas.

## Consequências
- (+) Mantém a regra "fatia é da Fase B" e o histórico honesto do que foi aprovado antes.
- (+) Sem código novo no validador.
- (−) O `state.yaml` fica não linear durante a reabertura, o que exige o relatório explicar.
- (−) Gates aprovados de fases adiantadas continuam registrados como aprovados mesmo que o novo trabalho os afete; por isso o item 2 manda reabri-las quando for o caso.

## Alternativas consideradas
- **Tratar a fatia como parte da Fase D** — descartada: mistura planejamento de comportamento com contrato e esconde fatia sem teste RED.
- **Impedir descobertas depois da B** — descartada: contraria a lição do UC12 (cobertura real só aparece ao verificar).
