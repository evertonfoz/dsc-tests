---
id: m05-pratica
tipo: pratica
titulo: "Prática do módulo 5"
pratica_de: m05
---

# Prática do módulo 5

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 5. Pratique no seu domínio
Use o caso de uso e as fatias dos módulos anteriores. Cada item abaixo é **uma fatia**, em branch e PR próprios:
1. **Fatia 1 (regra mais simples):** o seu campo obrigatório não pode ser vazio.
   - RED: teste com o repositório simulado; veja falhar pelo motivo certo e guarde a saída.
   - GREEN: o mínimo.
2. **Fatia 2 (um caso que você não previu):** o mesmo campo só com espaços (ou o equivalente do seu domínio).
3. **Fatia 3 (limite):** um tamanho máximo. Escreva **dois** testes: um acima do limite (RED) e um **exatamente no limite** (deve passar).
4. **Mutação:** troque `>` por `>=` e confirme que o teste do limite falha. Guarde a saída. Desfaça.
5. Garanta que **nenhuma** das fatias importa nada de HTTP ou de banco dentro do serviço.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Testes de regras no núcleo, resultados RED/GREEN e mutação revertida.

**Onde:** código/testes do núcleo no projeto; saídas RED/GREEN e mutação revertida em `docs/uc/<uc>/evidencias/B/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
