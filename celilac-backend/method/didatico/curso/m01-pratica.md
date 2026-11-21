---
id: m01-pratica
tipo: pratica
titulo: "Prática do módulo 1"
pratica_de: m01
---

# Prática do módulo 1

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. **Liste** todos os itens do seu caso de uso (fluxos, regras, requisitos, critérios) com identificadores.
2. **Monte** a tabela da seção 5 com as colunas *item*, *teste que prova*, *situação*. Neste ponto você ainda não tem testes: a maioria das linhas será **"Aguardando decisão"** ou "A implementar". Isso é o normal e é o ponto de partida.
3. **Procure** um item que você suspeita estar vago. Escreva o que decidiria: implementar, adiar com ADR ou excluir com ADR.
4. **Escreva uma ADR** curta (use `method/templates/adr.md`) para um item que você decidiu adiar.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Matriz de requisitos/testes e ADR para decisão adiada ou excluída.

**Onde:** matriz em `docs/uc/<uc>/relatorios/A.md`; ADRs em `docs/adr/ADR-NNN-*.md`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
