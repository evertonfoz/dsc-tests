---
id: m00-pratica
tipo: pratica
titulo: "Prática do módulo 0"
pratica_de: m00
---

# Prática do módulo 0

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 7. Pratique no seu domínio
1. **Escolha** o seu caso de uso, conforme os critérios do `README.md` (cria algo, tem regra, grava em banco). Copie `method/templates/caso-de-uso.md` para `docs/planejamento/<uc>.md`, sem sobrescrever um arquivo existente, e preencha-o com os dados do seu domínio.
2. **Escreva** em meia página: o ator, o fluxo principal, **duas regras de negócio** e **um fluxo de falha**. Se o seu texto tiver "validar os dados" sem dizer quais, ainda está vago.
3. **Refaça as cinco perguntas** da seção 2 para o seu caso de uso, agora com os nomes reais.
4. **Anote**, para cada resposta, *como você provaria*: qual teste, qual comando.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Descrição do caso de uso e respostas às cinco perguntas do módulo.

**Onde:** `docs/planejamento/<uc>.md` para a descrição do caso; perguntas e como provar podem ficar em `docs/uc/<uc>/relatorios/A.md`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
