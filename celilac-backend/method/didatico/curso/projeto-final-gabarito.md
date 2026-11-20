# Gabarito do professor — Projeto final

> Uso exclusivo do professor. **Proposta de critérios**: ainda não foi usada com turmas; ajuste pesos e prazos à sua disciplina.

## Rubrica sugerida (100 pontos, proposta)
| Critério | Pontos | O que olhar |
|---|---|---|
| Evidência real e etiquetas | 20 | saídas com data/commit, nada colado sem execução, `a confirmar` quando cabível |
| Fatias e ciclo RED/GREEN | 15 | um comportamento por fatia, commits separados, PR por fatia |
| Provas de qualidade (mutação, controle negativo) | 15 | saída guardada, falha pelo motivo certo |
| Persistência e falhas reais | 10 | teste com banco real, leitura independente, falha do banco sem vazamento |
| Contrato | 10 | inventário executado, decisões registradas, teste de não exposição |
| Decisão e papéis | 15 | gates com `por:` correto, IA não aprova, uso de IA registrado, reabertura bem feita |
| Pendências e honestidade | 10 | lista escrita, limites declarados, "o que não prova" |
| Repetição por outra pessoa | 5 | verificação reproduzida pelo colega ou na apresentação |

## Itens de conferência rápida
- `check-state` e `check-links` rodam sem erro no repositório do aluno.
- O CI da principal está verde e roda o script de verificação.
- Existe pelo menos um exemplo de erro da IA, **descrito com a evidência que o revelou**.
- Os gates objetivos têm `por: CI`, os de julgamento têm o login do aluno.
- Nada de `down -v`, `DROP` ou `TRUNCATE` fora do banco de testes no histórico dos comandos mostrados.

## Pontos de atenção
- Verificar o tipo de caso de uso: fora de "criar", os guias são esboços; avaliar com tolerância e registrar aprendizados.
- O tempo de 4 a 6 semanas e a rubrica são estimativas do material.
- Em dupla, exigir que revisor e autor de cada PR sejam pessoas diferentes.
- Exigir Docker nas máquinas dos alunos (apoio D): confirmar antes do projeto, ou prever laboratório.
- Pendências do próprio CeliLac, para você decidir antes da turma (não corrigidas): ADR-003 menciona log da causa e o código não registra log; o mutante `name.trim().length` sobrevive (regra de espaços nas pontas indefinida); a mensagem de `InvalidProductNameException` é imprecisa para nomes longos; NUL no nome devolve 500; teste instável #27 sem causa. Os módulos 5 a 7 usam esses pontos como exercício; se você os corrigir, atualize os módulos.

## Sinais de alerta
- Relatório perfeito, sem pendências, sem mutações.
- Todas as saídas com horário idêntico ou formato diferente do ambiente do aluno.
- Gates marcados `aprovado` sem `por:` coerente.
