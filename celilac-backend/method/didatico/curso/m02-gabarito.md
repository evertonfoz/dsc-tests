---
id: m02-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 2'
gabarito_de: [m02]
---

# Gabarito para autoestudo — Módulo 2

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Atividade da seção 2
Não há resposta única: o objetivo é você perceber o custo de reconstruir o estado a partir de documentos. Esperam-se respostas como "6 sub-issues no plano e 9 no GitHub" (no caso real) ou, no seu projeto, divergências entre README, issues e quadro.

## Raciocínio para conferir
1. Por que "atualizar todos os documentos" falha mesmo com boa vontade? (informação repetida diverge)
2. O que o `por:` do gate protege? (impede que o assistente se aprove)
3. Por que o arquivo guarda caminhos de evidência e não os resultados copiados? (o arquivo apontado é verificável)

## Verificação da prática
Para conferir a prática, compare os artefatos e evidências do seu projeto: (a) a saída do validador com "OK"; (b) a saída do erro provocado (fatia `integrada` sem PR) e a explicação; (c) o resultado do `--remote` e o que ele confirma.

## Autoavaliação sugerida
| Critério | Peso sugerido |
|---|---|
| `state.yaml` válido segundo o validador | 30% |
| Erro provocado e explicado | 25% |
| Gates com `por:` coerente (nenhum aprovado sem validador) | 25% |
| Nenhum fato duplicado em outros documentos | 20% |
