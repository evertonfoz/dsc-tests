# Módulo 10 — E se uma fatia aparecer tarde demais?

> **Pré-requisito:** módulos 2, 3 e 9. Duração sugerida: 1 a 2 aulas.
> **Você vai:** aprender o que fazer quando, no meio do caminho, descobre-se um comportamento que ninguém planejou, **sem** esconder o desvio nem fingir que o plano estava certo.

---

## 1. O problema
O método do curso tem fases em ordem: A (planejar), B (regras no núcleo), C (HTTP e banco), D (contrato), E (verificação), F (auditoria). No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), a fase B foi **fechada**: todas as fatias integradas, gate aprovado.

Depois, na fase D (módulo 9), o inventário mostrou que "nome só com espaços" era aceito e que "nome com mais de 120 caracteres" virava erro 500. Corrigir isso é **comportamento novo**: duas fatias que ninguém planejou (F05 e F06).

E o método **não dizia o que fazer**. O validador do `state.yaml` (o arquivo de estado do módulo 2) rejeita "fase B concluída, mas há fatias não integradas". Qualquer saída parecia errada:
- implementar na fase D, escondendo a fatia;
- editar o estado para "fingir" que a fatia sempre esteve na B;
- não corrigir.

## 2. Antes de ler a solução: escolha e justifique
Você está na fase D de um projeto seu. A fase B foi aprovada ontem. Hoje você descobre que falta um comportamento. Em 15 minutos, responda por escrito:
1. Em qual fase esse trabalho deve ser feito? Por quê?
2. O que acontece com o status da fase B? E com as fases C e D?
3. Quem decide que se volta atrás?
4. O que você registra, e onde, para que quem ler depois entenda?

Guarde as respostas.

## 3. A tentativa ingênua
| Atalho | Por que falha |
|---|---|
| "Faço dentro da fase D, é rapidinho" | mistura planejamento de comportamento com contrato e esconde uma fatia que talvez nem tenha teste escrito antes (RED) |
| "Edito o `state.yaml` para a B nunca ter sido fechada" | apaga o histórico do que foi aprovado e quando |
| "Impeço novas descobertas depois da B" | contraria a lição do módulo 1: a cobertura real só aparece quando se verifica |
| "Deixo a IA decidir o que fazer" | decidir reabrir uma fase é decisão de uma pessoa |

## 4. A solução: a ADR-004 do método
Foi escrita uma ADR (*Architecture Decision Record*, documento curto que guarda **uma** decisão: contexto, decisão e consequências) em `method/decisoes/ADR-004-retorno-a-fase-anterior.md`. Em resumo:

1. **Fatia descoberta depois da B reabre a B.** Não existe "fatia de fase D". Ela segue o ciclo normal: issue, teste que falha (RED), implementação (GREEN), um PR (*pull request*) e revisão humana.
2. **Como registrar no `state.yaml`:**
   - `fase_atual` volta para `B`; a B passa a `em_andamento` e o gate "todas as fatias integradas" volta a `pendente`.
   - As fases seguintes **mantêm o status** como histórico. Só voltam a `em_andamento` as que forem **afetadas** (a C, se a mudança mexer na fronteira HTTP).
   - A fatia nova entra em `fatias` como `planejada`; o relatório da fase reaberta ganha a seção **"Reabertura"**: data, motivo, fatias.
3. **Quem decide** é a pessoa responsável. A IA **propõe**, com a evidência da descoberta.
4. **Rastreabilidade:** a decisão do projeto que motivou a descoberta (aqui, a ADR-004 do UC12, sobre contrato e nome) é citada no relatório.

### 4.1. O que aconteceu na prática
Uma sequência real do UC12:
1. O inventário (módulo 9) achou as divergências.
2. O professor decidiu o contrato.
3. Um commit "reabrir B e C" atualizou `state.yaml` e os relatórios (`8aeef61`).
4. F05 foi integrada no PR #44 e F06 no PR #45; o trabalho de DTO e filtro (C1b) no PR #46.
5. O relatório da fase B registra: *"Reabertura (2026-11-20)... Fechamento: F05 (PR #44) e F06 (PR #45) integradas; CI verde na `main`."* As fases B, C e D voltaram a `concluida`.

### 4.2. O preço
A ADR admite os custos:
- durante a reabertura o estado fica **fora de ordem** (`fase_atual: B` com a D `em_andamento`); o relatório precisa explicar;
- gates aprovados de fases adiantadas **continuam** aprovados no registro, mesmo que o trabalho novo os afete. Por isso a regra manda reabrir a fase afetada, e isso depende de **julgamento**.

> A ADR não promete que o método é perfeito. Ela registra uma decisão **com** seus custos.

## 5. Pratique no seu domínio
1. Releia suas respostas da seção 2 e compare com a seção 4. Onde divergiu? Você tinha uma razão melhor?
2. Escolha um comportamento que **não** estava no seu plano (por exemplo, um limite de tamanho, uma duplicidade) e simule a descoberta tardia:
   - escreva a nota de reabertura (data, motivo, evidência, fatias);
   - atualize o `state.yaml`: `fase_atual`, status da fase, gate pendente, fatia nova `planejada`;
   - rode o validador do estado e **guarde a saída**.
3. Crie a issue da fatia e siga o ciclo normal (módulo 3): RED, GREEN, PR.
4. Ao integrar, **feche** a reabertura: gates aprovados por quem de direito, relatório com a seção "Fechamento".
5. Responda: quais fases foram **afetadas** e quais só mantiveram o histórico? Justifique.

## 6. Como saber que funcionou
- [ ] A fatia nova tem issue, RED e PR próprios; nada foi feito "por baixo" de outra fase.
- [ ] O `state.yaml` mostra a reabertura e o validador passa.
- [ ] O relatório tem as seções de abertura e de fechamento.
- [ ] A pessoa responsável decidiu reabrir, e isso consta registrado.
- [ ] Nenhum status anterior foi apagado.

## 7. Armadilhas comuns
- **Reabrir demais:** voltar todas as fases quando só uma foi afetada.
- **Reabrir de menos:** deixar a C "concluída" quando a fatia mexe na fronteira HTTP.
- **Esquecer o relatório:** quem lê só o `state.yaml` não entende por que `fase_atual` voltou.
- **Descobrir e não registrar** a causa (o inventário, a ADR do projeto).
- **Tratar a reabertura como fracasso.** Ela é o processo funcionando: a verificação achou o que o plano não previa.

## 8. Exercícios
1. Por que não existe "fatia da fase D"?
2. O que, no `state.yaml`, não pode ser editado para "esconder" a reabertura?
3. Dê um exemplo de descoberta tardia que **não** deve reabrir a B (por exemplo, correção de texto de uma mensagem).
4. Quem pode decidir reabrir? E a IA?
5. Cite um custo da decisão que a própria ADR reconhece.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
- A IA tende a **resolver no lugar onde está**: se estiver na fase D, vai corrigir lá. Lembre-a da regra e peça a **proposta de reabertura**, não a implementação.
- Peça que ela liste **quais fases são afetadas e por quê**, e confira você.
- Ela pode editar o `state.yaml` "para o validador passar". Confira o **diff**: o histórico de aprovações não pode desaparecer.
- A decisão de reabrir, e o fechamento depois, são **seus**.

Próximo: módulo 11, outra pessoa consegue repetir sua verificação?
