---
id: m11-pratica
tipo: pratica
titulo: "Prática do módulo 11"
pratica_de: m11
---

# Prática do módulo 11

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. Faça o **diagnóstico**: liste cada linha do seu contrato e marque se tem cenário e verificação. Guarde.
2. Escreva a coleção `.http` e as verificações no script (um só script).
3. Faça o **controle negativo**: rode o script contra uma versão **errada** do seu código (por exemplo, a de antes de uma correção, ou uma mutação do módulo 7). Guarde a saída com os `[FALHA]` esperados.
4. Prove a **durabilidade**: reinicie só a aplicação e releia o registro. Guarde.
5. Troque com um colega (seção 2): ele roda **o seu** roteiro em uma máquina que não é a sua. Anote o que ele precisou adivinhar e corrija o roteiro.
6. Confirme que o script roda no CI e **leia o log** do job.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Coleção HTTP, script, controle negativo, durabilidade, repetição e log do CI.

**Onde:** coleção HTTP e script versionados no projeto; diagnóstico e saídas em `docs/uc/<uc>/evidencias/E/`; URL/log do CI no relatório E.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
