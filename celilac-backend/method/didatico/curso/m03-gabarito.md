---
id: m03-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 3'
gabarito_de: [m03]
---

# Gabarito para autoestudo — Módulo 3

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Atividade da seção 2
| Pergunta | Resposta esperada |
|---|---|
| Qual teste falhou? | `should register and save a product when valid data is provided (CA01)`, com `Error: Not implemented: createProduct` |
| O que faz `createProduct`? | Só lança `Error('Not implemented: createProduct')` |
| O robô aceitaria uma terceira mudança? | Não: a `main` já está vermelha; o novo PR herdaria a falha |

Antes de repetir a atividade do repositório de referência, você precisa de Node.js, pnpm e clone com histórico completo. No seu projeto, registre os pré-requisitos reais.

## Raciocínio para conferir
1. Em que a divisão por camada parecia correta? (tarefas pequenas, papéis claros) E por que falha? (separa RED e GREEN)
2. Um teste vermelho deve ir para a `main` se o código vem no próximo PR? (não: o PR precisa ser autossuficiente)
3. Quando um PR empilhado pode ser aceitável? (equipes experientes, com revisão em sequência e CI próprio; fora do padrão do curso)

## Como conferir sua prática
Confira no seu projeto: o histórico de commits do PR (RED antes de GREEN), a saída do RED, a do GREEN e uma frase de comportamento por fatia.

## Autoavaliação sugerida
| Critério | Peso sugerido |
|---|---|
| Fatias descritas como comportamento (nenhuma como camada) | 30% |
| Nome de teste RED no formato combinado | 15% |
| Commits separados e saída do RED coerente | 35% |
| Um PR por fatia, sem dependência de outro PR | 20% |

## Limite do exemplo
O instante vermelho foi reproduzido a partir do commit `5081158`, no laboratório. Para quem não tiver o histórico completo, use a saída do RED da fatia F03 (`docs/uc/uc12/evidencias/B/f03-red.txt`).
