---
id: m05-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 5'
gabarito_de: [m05]
---

# Gabarito para autoestudo — Módulo 5

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Atividade da seção 2 (no commit `b71f5e1`)
| Pergunta | Resposta esperada |
|---|---|
| O serviço lançou erro? | Não: devolve um produto com `name: ''` (o repositório simulado devolve o que recebeu) |
| Outros chamadores | Outro módulo, tarefa agendada, consumidor de fila, teste, script de importação |
| O DTO ajudaria? | Não: ele só atua em requisições HTTP |

## Respostas esperadas
- **Exercício 1:** é um problema pequeno, mas real: a mensagem de `InvalidProductNameException` ("must not be empty") não descreve nome longo. Hoje o DTO barra o nome longo antes de o serviço ser chamado, então o cliente HTTP não vê essa mensagem; ela apareceria se outro chamador (ou um teste) chegasse ao serviço. Correção aceitável: mensagem genérica ("invalid product name") ou classes/mensagens distintas. O teste deve afirmar a mensagem para pelo menos dois casos (vazio e longo).
- **Exercício 2:** o UC12 chama a validação de "nome obrigatório" sem definir "vazio"; o caso `''` foi o primeiro interpretado. O caso de "só espaços" apareceu no inventário do contrato real da API, na fase D (módulo 9).
- **Exercício 3:** exigir teste em `tamanho_mínimo` (aceita) e `tamanho_mínimo - 1` (rejeita).

## Raciocínio para conferir
1. Defesa em profundidade: por que manter a barreira do DTO se o núcleo já valida? (rejeita cedo, devolve resposta rápida e padronizada; o núcleo é a rede de segurança)
2. Em que situação o teste de valor-limite seria desnecessário? (quando não há limite numérico)
3. O que muda se a regra depende do banco (por exemplo, unicidade)? (não se resolve só no núcleo; ver módulo 8)

## Autoavaliação sugerida
| Critério | Peso sugerido |
|---|---|
| Três fatias, cada uma com RED e GREEN em commits separados | 30% |
| Testes afirmam a rejeição **e** a ausência de gravação | 20% |
| Teste no limite exato e mutação documentada | 25% |
| Núcleo sem importação de HTTP ou banco | 15% |
| Resposta justificada ao exercício 1 | 10% |

## Limites do exemplo
O exemplo é de validação de campo texto. Regras que envolvem outros dados (unicidade, estado de outra entidade) precisam do repositório e serão tratadas com os módulos 8 e 9.
