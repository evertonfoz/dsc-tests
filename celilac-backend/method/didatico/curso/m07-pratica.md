---
id: m07-pratica
tipo: pratica
titulo: "Prática do módulo 7"
pratica_de: m07
---

# Prática do módulo 7

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 7. Pratique no seu domínio
1. Escolha **três testes** que você escreveu nos módulos 5 e 6.
2. Para cada um, proponha **dois mutantes** de tipos diferentes (tabela 4.1).
3. Preencha esta tabela, guardando a saída de cada execução:

| Teste | Mutante | Esperado | Obtido | Morto ou sobreviveu |
|---|---|---|---|---|
| (nome do teste) | (o que estragou) | falha | (resultado) | |

4. Para cada **sobrevivente**, escolha: (a) escrever o teste que o mata; (b) declarar que o mutante é irrelevante e **explicar por quê**; (c) registrar uma pergunta para quem decide a regra.
5. Garanta que, ao final, `git status` está limpo e nenhuma mutação foi commitada.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Matriz de mutações e saídas reais, sem deixar mutação no código.

**Onde:** matriz e saídas de mutação em `docs/uc/<uc>/evidencias/B/`; descarte as alterações temporárias antes de encerrar.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
