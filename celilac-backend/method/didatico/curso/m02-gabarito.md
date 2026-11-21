---
id: m02-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 2'
gabarito_de: [m02]
---

# Gabarito do professor — Módulo 2

> Uso exclusivo do professor.

## Atividade da seção 2
Não há resposta única: o objetivo é o aluno **sentir** o custo de reconstruir o estado a partir de documentos. Esperam-se respostas como "6 sub-issues no plano e 9 no GitHub" (no caso real) ou, no projeto do aluno, divergências entre README, issues e quadro.

## Pontos para discussão
1. Por que "atualizar todos os documentos" falha mesmo com boa vontade? (informação repetida diverge)
2. O que o `por:` do gate protege? (impede que o assistente se aprove)
3. Por que o arquivo guarda caminhos de evidência e não os resultados copiados? (o arquivo apontado é verificável)

## Verificação da prática
O aluno deve mostrar: (a) a saída do validador com "OK"; (b) a saída do erro provocado (fatia `integrada` sem PR) e a explicação; (c) o resultado do `--remote` e o que ele confirma.

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| `state.yaml` válido segundo o validador | 30% |
| Erro provocado e explicado | 25% |
| Gates com `por:` coerente (nenhum aprovado sem validador) | 25% |
| Nenhum fato duplicado em outros documentos | 20% |
