# Gabarito do professor — Módulo 1

> Uso exclusivo do professor. Não distribua antes da atividade da seção 2.

## Atividade da seção 2 (estado `b71f5e1`)
| Afirmação | O que o aluno deve encontrar |
|---|---|
| Preço positivo (RN02) | Não existe: `Product` só tem `productId` e `name`; não há DTO nem teste de preço. Resposta correta: "não implementado". |
| Falha de persistência (FE01) | O serviço apenas chama `save` e não trata falha; há um único teste do serviço (caso feliz). Resposta correta: "sem teste". |
| Nome obrigatório (RN01) | Existe só no DTO da fronteira HTTP; o serviço aceita nome vazio. Resposta correta: "coberta apenas na fronteira". |

## Respostas esperadas
- A tabela do aluno não deve repetir os 100%.
- O aluno deve distinguir "o relatório diz" de "o código mostra" de "o teste executado prova".
- Aceite o erro "o preço deveria existir" **somente** se o aluno também percebeu que o documento chama a validação de preço de "ilustrativa"; a decisão de adiar é do professor responsável pelo caso.

## Pontos para discussão em aula
1. Por que a porcentagem de cobertura de linhas não responde à pergunta do módulo?
2. Quem deve decidir a destinação de um item sem teste? (Resposta esperada: a pessoa responsável pelo caso de uso, não o assistente.)
3. Em que situação "adiar com ADR" é melhor que "implementar"? (Quando a especificação não define a regra.)

## Critérios de avaliação sugeridos (tarefa da seção 6)
| Critério | Peso |
|---|---|
| Uma linha por item, com identificador | 25% |
| Situação coerente (nenhum "coberto" sem teste) | 30% |
| ADR com contexto, decisão, condição para retomar e consequências | 25% |
| Justificativa de uma decisão pessoal (implementar, adiar ou excluir) | 20% |

## Limites do exemplo
O UC12 é um caso de cadastro com uma regra (nome). Casos de consulta, atualização, exclusão e autenticação ainda não foram exercitados pelo método; a tabela de cobertura se aplica, mas as regras específicas de cada tipo estão como esboço em `method/playbooks/matriz-arquetipos.md`.
