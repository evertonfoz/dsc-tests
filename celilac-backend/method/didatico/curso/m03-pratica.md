---
id: m03-pratica
tipo: pratica
titulo: "Prática do módulo 3"
pratica_de: m03
---

# Prática do módulo 3

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. Pegue as duas fatias do `state.yaml` do módulo 2. Para cada uma, escreva em uma frase **o comportamento observável** ("dado X, quando Y, então Z").
2. Escreva o **nome do teste RED** de cada uma, no formato `should <fazer algo> when <condição> (<RN ou CA>)`.
3. Implemente a primeira fatia em uma branch própria: **commit RED** (teste falhando, com a saída guardada), **commit GREEN**, e, se houver, **commit REFACTOR**.
4. Abra **um PR** com `(refs #N)` e confira que **não** há outro PR esperando por este.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Comportamentos das fatias, testes RED/GREEN, commits e PR.

**Onde:** código/testes nas pastas do projeto, branch e PR no GitHub; saídas RED/GREEN em `docs/uc/<uc>/evidencias/B/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
