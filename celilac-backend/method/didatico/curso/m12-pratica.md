---
id: m12-pratica
tipo: pratica
titulo: "Prática do módulo 12"
pratica_de: m12
---

# Prática do módulo 12

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. Releia suas respostas da seção 2 e compare com as regras da seção 4.1. Ajuste o que divergir e explique.
2. Copie `method/templates/AGENTS-aluno.md` para `AGENTS.md` na raiz do seu repositório. Personalize as cinco regras para o uso da IA no seu caso de uso: o que ela pode fazer, o que só você decide e o que exige autorização específica. **Não copie `method/AGENTS.md` para a raiz**: esse arquivo contém regras do método e permanece em `method/`.
3. Peça à IA que revise um PR seu e **registre** no PR que foi revisão por IA. Escolha **uma** afirmação dela, confira-a você e anote o resultado.
4. Faça a **cobertura real** do seu caso de uso: liste cada requisito, regra, critério e fluxo, o **teste que o prova** (rodado) e a classificação (coberto, parcial, não implementado, aguardando decisão).
5. Escreva as **pendências** do seu caso de uso, uma a uma, com etiqueta e destino.
6. Peça a um colega que atue como **revisor independente** e registre o que ele achou que você não viu.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** AGENTS.md próprio na raiz, cobertura, pendências e registro de revisão.

**Onde:** `AGENTS.md` próprio na raiz, matriz/pendências em `docs/uc/<uc>/relatorios/F.md`, evidências em `docs/uc/<uc>/evidencias/F/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
