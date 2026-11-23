---
id: m01-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 1'
gabarito_de: [m01]
---

# Gabarito para autoestudo — Módulo 1

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use a resposta para comparar o raciocínio; isso é uma recomendação pedagógica, não uma trava. Os fatos sobre o CeliLac são referências do material e não resultados executados no seu projeto.

## Atividade da seção 2 (estado `b71f5e1`)
| Afirmação | O que conferir no material |
|---|---|
| Preço positivo (RN02) | Não existe: `Product` só tem `productId` e `name`; não há DTO (*Data Transfer Object*) nem teste de preço. Resposta correta: "não implementado". |
| Falha de persistência (FE01) | O serviço apenas chama `save` e não trata falha; há um único teste do serviço (caso feliz). Resposta correta: "sem teste". |
| Nome obrigatório (RN01) | Existe só no DTO da fronteira HTTP (o protocolo de entrada da API); o serviço aceita nome vazio. Resposta correta: "coberta apenas na fronteira". |

## Como conferir sua resposta
- Sua tabela de cobertura não deve repetir os 100%: a evidência do projeto de referência mostrou itens sem prova.
- Confira se você distingue "o relatório diz" de "o código mostra" de "o teste executado prova".
- Ao revisar sua resposta, aceite a diferença "o preço deveria existir" **somente** se você também percebeu que o documento chama a validação de preço de "ilustrativa"; a decisão de adiar cabe à pessoa responsável pelo seu caso de uso.

## Raciocínio para conferir
1. Por que a porcentagem de cobertura de linhas não responde à pergunta do módulo?
2. Quem deve decidir a destinação de um item sem teste? (Resposta esperada: a pessoa responsável pelo caso de uso, não o assistente.)
3. Em que situação "adiar com ADR" (*Architecture Decision Record*) é melhor que "implementar"? (Quando a especificação não define a regra.)

## Autoavaliação sugerida (tarefa da seção 6)
| Critério | Peso sugerido |
|---|---|
| Uma linha por item, com identificador | 25% |
| Situação coerente (nenhum "coberto" sem teste) | 30% |
| ADR com contexto, decisão, condição para retomar e consequências | 25% |
| Justificativa de uma decisão pessoal (implementar, adiar ou excluir) | 20% |

## Limites do exemplo
O UC12 é um caso de cadastro com uma regra (nome). Casos de consulta, atualização, exclusão e autenticação ainda não foram exercitados pelo método; a tabela de cobertura se aplica, mas as regras específicas de cada tipo estão como esboço em `method/playbooks/matriz-arquetipos.md`.
