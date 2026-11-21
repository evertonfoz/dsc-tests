---
id: m09-pratica
tipo: pratica
titulo: "Prática do módulo 9"
pratica_de: m09
---

# Prática do módulo 9

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. Faça o inventário **executando** o seu caso de uso, com **todas** as situações da sua tabela da seção 2. Guarde a saída real em `docs/uc/<uc>/evidencias/D/`, com data/hora UTC e commit de base conforme `method/templates/evidencia-de-comando.md`.
2. Compare com o que você esperava. Para cada diferença, classifique: corrigir ou aceitar (e escreva a ADR curta de quem decidiu e por quê).
3. Depois de executar o inventário, copie `method/templates/contrato-api.md` para `docs/uc/<uc>/contrato.md` sem sobrescrever arquivo existente. Preencha o observado só com os status e corpos da execução; registre a decisão separadamente. Este modelo descreve o contrato HTTP e não substitui `method/templates/caso-de-uso.md`.
4. Para cada linha, escreva o teste que quebra se ela mudar, incluindo um que prove que **nada interno vaza**.
5. Repita o inventário e guarde o resultado final.
6. **Mutação** (módulo 7): mude o status de uma resposta de erro (por exemplo, 400 vira 422). Um teste deve falhar. Guarde a saída.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Inventários executados, contrato observado, decisões/ADR e testes do contrato.

**Onde:** `docs/uc/<uc>/contrato.md`; inventários em `docs/uc/<uc>/evidencias/D/`; ADRs em `docs/adr/` quando houver decisão.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
