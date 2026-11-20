# 05 — As seis fases e seus playbooks

> **Público:** estudantes que vão conduzir um caso de uso com o método, e quem for adaptar os playbooks a outra stack.
> **Objetivo:** entender o encadeamento das fases A–F, o que cada gate protege e como os 13 prompts antigos foram condensados em seis procedimentos curtos.
> **Pré-requisitos:** documentos 01 a 04.

---

## 1. De 13 prompts para 6 playbooks
Os materiais originais somavam centenas de KB e misturavam procedimento, exemplo do CeliLac e conversa com o agente. Cada playbook novo tem de 5 a 7 KB, trata de **uma** fase e não contém dados de projeto (eles vêm do `project-profile.md` e do `state.yaml`). Os playbooks agora são:

| Fase | Playbook | Substitui (aprox.) |
|---|---|---|
| A Planejar e publicar | `method/playbooks/fase-A-planejar-e-publicar.md` | prompts 01, 02, 03 |
| B Fatias no núcleo | `method/playbooks/fase-B-fatias-no-nucleo.md` | prompts 04, 05, 06 |
| C Adaptadores | `method/playbooks/fase-C-adaptadores-http-e-persistencia.md` | prompts 07, 08, 09 |
| D Contrato de resposta | `method/playbooks/fase-D-contrato-de-resposta.md` | prompt 11 |
| E Verificação reprodutível | `method/playbooks/fase-E-verificacao-reproduzivel.md` | prompts 10 e 13 |
| F Auditoria e encerramento | `method/playbooks/fase-F-auditoria-e-encerramento.md` | prompt 12 |

> A correspondência é aproximada: a containerização (prompt 10) virou **Fundação**, não fase do UC.

## 2. O fio condutor: cada fase protege contra um erro diferente

| Fase | Pergunta central | Erro que evita |
|---|---|---|
| A | O que exatamente vamos entregar, e como saberemos que entregamos? | Planejar por camada técnica; item do UC sem dono |
| B | O comportamento funciona e está provado? | Código sem teste; teste que nunca falhou |
| C | O comportamento chega pelo HTTP e persiste de verdade? | "Persiste" sem reler do banco; regra no adaptador |
| D | O que a API promete devolver? | Vazar entidade interna; contrato só no papel |
| E | Outra pessoa consegue repetir a prova? | "Funciona na minha máquina" |
| F | O que, de fato, está coberto? | Declarar "100%" sem teste |

## 3. Elementos que se repetem em toda fase
- **Gate de entrada e de saída** verificáveis, com *quem valida*. O agente nunca aprova a si mesmo (regras 9 e 21).
- **Inspecionar antes de criar** e **pare e pergunte** antes de ações destrutivas ou externas.
- **Evidência real**: saída de comando obtida na execução, guardada em `docs/uc/<uc>/evidencias/<fase>/`.
- **Variações por arquétipo**: só `criar` é validado; os demais são esboços até o primeiro UC real.
- **Pergunte-se**: perguntas para o estudante conferir se entendeu, não só se executou.

## 4. Decisões de projeto dos playbooks (e por quê)
1. **Um PR por fatia (B) e um por adaptador (C):** revisão pequena e `main` sempre verde (ADR-003).
2. **Aprovação do plano antes de publicar (A) e do contrato antes de codificar (D):** publicar e expor contrato são atos difíceis de desfazer.
3. **Contrato escrito (`contrato.md`) na fase D:** o texto precisa ser conferido contra a API em execução.
4. **Verificação por script, não por conversa (E):** reprodutível pelo CI e por qualquer pessoa.
5. **Decisão sobre lacuna é humana (F):** o agente apresenta opções; quem responde pelo UC decide.
6. **Campo `documento` no `state.yaml`:** o caminho do documento do UC passa a ser verificável.

## 5. Dois deslizes que aconteceram ao escrevê-los (e as correções)
- **Caminhos de evidência escritos como se existissem.** O `check-links` acusou referências quebradas em duas fases. A convenção `docs/uc/<uc>/evidencias/<fase>/...` marca o caminho como modelo. *Lição: o validador existe para ser rodado antes do commit, não depois.*
- **Estilo inconsistente entre playbooks.** Os dois primeiros usavam o caminho curto de evidência. Uniformizamos depois. *Lição: ao produzir uma série, releia a série.*

## 6. Limite honesto
Nenhum playbook foi executado ainda em um caso de uso **inteiro** com este método. O UC12 foi feito antes dele, e a reconstrução foi retrospectiva. A Etapa 6 (piloto) é o teste real: o que ela mostrar de errado nos playbooks volta para eles.

## 7. Exercícios
1. Escolha uma fase e reescreva o "Gate de saída" para o seu projeto. Quem valida cada item?
2. Em qual fase um "100% coberto" sem prova seria barrado? Por qual passo?
3. Por que a fase D vem depois da C e não antes? O que aconteceria na ordem inversa?
4. Pegue um prompt antigo (01 a 13) e liste o que dele virou playbook, o que virou Fundação e o que foi descartado.

## 8. Referências
- `method/templates/playbook.md` · `method/decisoes/ADR-003-fatia-fases-b-c-e-arquetipos.md`
- `method/playbooks/guia-decomposicao-em-fatias.md` · `method/playbooks/matriz-arquetipos.md`

Próximo documento: **06 — Piloto: reconciliando o UC12** (Etapa 6).
