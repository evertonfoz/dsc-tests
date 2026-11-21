---
id: m10-pratica
tipo: pratica
titulo: "Prática do módulo 10"
pratica_de: m10
---

# Prática do módulo 10

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 5. Pratique no seu domínio
1. Releia suas respostas da seção 2 e compare com a seção 4. Onde divergiu? Você tinha uma razão melhor?
2. Escolha um comportamento que **não** estava no seu plano (por exemplo, um limite de tamanho, uma duplicidade) e simule a descoberta tardia:
   - escreva a nota de reabertura (data, motivo, evidência, fatias);
   - atualize o `state.yaml`: `fase_atual`, status da fase, gate pendente, fatia nova `planejada`;
   - rode o validador do estado e **guarde a saída**.
3. Crie a issue da fatia e siga o ciclo normal (módulo 3): RED, GREEN, PR.
4. Ao integrar, **feche** a reabertura: gates aprovados por quem de direito, relatório com a seção "Fechamento".
5. Responda: quais fases foram **afetadas** e quais só mantiveram o histórico? Justifique.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Nota de reabertura, state validado, issue/PR da nova fatia e relatório de fechamento.

**Onde:** nota e relatório em `docs/uc/<uc>/relatorios/`; estado em `docs/uc/<uc>/state.yaml`; saída em `evidencias/<fase>/`; issue/PR no GitHub.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
