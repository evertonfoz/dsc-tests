---
id: m07-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 7'
gabarito_de: [m07]
---

# Gabarito do professor — Módulo 7

> Uso exclusivo do professor.

## Desafio da seção 2 (`descontoDe`)
Versões erradas que continuam passando com `descontoDe(200) === 20`:
| Versão errada | Teste que a derruba |
|---|---|
| `valor > 100` em vez de `>= 100` | `descontoDe(100)` deve ser 10 |
| `valor >= 150` | `descontoDe(120)` deve ser 12 |
| `return 20` fixo para qualquer valor ≥ 100 | `descontoDe(300)` deve ser 30 |
| Não devolver 0 abaixo do limite (ex.: `return valor * 0.1` sempre) | `descontoDe(50)` deve ser 0 |
| Arredondar o resultado (por exemplo, `Math.floor`) | testar um valor cujo desconto não seja inteiro (ex.: 155, desconto 15,5) |

Um bom aluno percebe que **um único exemplo** (200) não discrimina nada.

## Mutante sobrevivente do CeliLac (seção 6)
`name.trim().length > MAX_PRODUCT_NAME_LENGTH` sobrevive aos 16 testes de `products` (executado na preparação do módulo). Opções válidas:
- **Decidir que espaços nas pontas contam:** adicionar teste com 119 letras e 2 espaços (rejeitado), que mata o mutante.
- **Decidir que não contam:** mudar o código para `trim()` e testar com o mesmo valor (aceito).
- **Registrar a dúvida** para o professor responsável pelo caso de uso (a especificação não define).
Não implemente a decisão sem confirmá-la com quem responde pelo UC.

## Pontos para discussão
1. Por que a cobertura de linhas não responde à pergunta do módulo?
2. Em que ponto a mutação deixa de compensar? (código trivial, regras sem risco, custo de manter muitas evidências)
3. Por que o mutante 1 do caso 5.4 não bastava? (matou por status e deixou a afirmação principal sem prova)
4. O que muda quando uma ferramenta automática gera os mutantes? (escala, mas o julgamento sobre sobreviventes continua humano)

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| Dois mutantes de tipos diferentes por teste, com saída guardada | 30% |
| Sobreviventes com destino justificado | 25% |
| Pelo menos um caso de "morto pelo motivo certo" discutido | 20% |
| Código sem alteração residual (`git status` limpo) | 15% |
| Resposta ao desafio da seção 2 | 10% |

## Limites do exemplo
A mutação à mão não escala para projetos grandes. O objetivo é formar o hábito de desconfiar do verde; ferramentas automáticas entram quando o hábito já existe.
