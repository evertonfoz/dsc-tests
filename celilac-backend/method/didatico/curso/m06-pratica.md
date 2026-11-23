---
id: m06-pratica
tipo: pratica
titulo: "Prática do módulo 6"
pratica_de: m06
---

# Prática do módulo 6

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. **Fatia de falha (núcleo):** escreva o teste RED com um repositório simulado que rejeita com uma mensagem cheia de detalhes inventados (endereço, tabela). Ele deve afirmar a exceção esperada **e** a ausência desses detalhes. Veja falhar. Guarde a saída.
2. **GREEN:** o `try/catch` que traduz e guarda o `cause`.
3. **Fronteira HTTP:** crie o filtro (ou o mecanismo do seu framework) que mapeia suas exceções para status. Teste pela API: um erro de validação devolve 400; a falha de persistência devolve 500 **sem** os detalhes.
4. **Escreva a ADR** do mapeamento, com contexto, tabela de status e **uma consequência negativa**.
5. **Banco real:** provoque uma falha verdadeira no seu banco de testes e confirme a tradução. Faça a mutação (remova o `try/catch`) e guarde a saída que mostra o erro bruto.
6. **Registro:** acrescente o log da causa no ponto em que a exceção é tratada e **teste** que ele foi chamado (sem colocar o log na resposta).

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Testes de falha, mapeamento HTTP, ADR, evidência real e teste do log.

**Onde:** código/testes no projeto; ADR em `docs/adr/`; evidências de núcleo em `evidencias/B/` e de API em `evidencias/C/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
