# Gabarito do professor — Módulo 3

> Uso exclusivo do professor.

## Atividade da seção 2
| Pergunta | Resposta esperada |
|---|---|
| Qual teste falhou? | `should register and save a product when valid data is provided (CA01)`, com `Error: Not implemented: createProduct` |
| O que faz `createProduct`? | Só lança `Error('Not implemented: createProduct')` |
| O robô aceitaria uma terceira mudança? | Não: a `main` já está vermelha; o novo PR herdaria a falha |

Pré-requisitos do aluno para a atividade: Node.js, pnpm e o repositório clonado com histórico completo.

## Pontos para discussão
1. Em que a divisão por camada parecia correta? (tarefas pequenas, papéis claros) E por que falha? (separa RED e GREEN)
2. Um teste vermelho deve ir para a `main` se o código vem no próximo PR? (não: o PR precisa ser autossuficiente)
3. Quando um PR empilhado pode ser aceitável? (equipes experientes, com revisão em sequência e CI próprio; fora do padrão do curso)

## Verificação da prática
Pedir: o histórico de commits do PR (RED antes de GREEN), a saída do RED, a do GREEN e uma frase de comportamento por fatia.

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| Fatias descritas como comportamento (nenhuma como camada) | 30% |
| Nome de teste RED no formato combinado | 15% |
| Commits separados e saída do RED coerente | 35% |
| Um PR por fatia, sem dependência de outro PR | 20% |

## Limite do exemplo
O instante vermelho foi reproduzido a partir do commit `5081158`, no laboratório. Para quem não tiver o histórico completo, use a saída do RED da fatia F03 (`docs/uc/uc12/evidencias/B/f03-red.txt`).
