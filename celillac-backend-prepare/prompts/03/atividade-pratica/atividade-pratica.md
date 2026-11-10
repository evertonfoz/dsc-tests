# 📋 Atividade Prática 03: Planejamento Operacional e Priorização do Desenvolvimento no GitHub

---

## 🎯 Objetivo da Atividade
Após decompor o caso de uso (Etapa 01) e organizar o repositório, papéis e *Definition of Ready* no GitHub (Etapa 02), a equipe agora deve responder: **"O backlog está pronto; por onde começar?"**.

O objetivo desta etapa é definir e fundamentar a **estratégia inicial de execução**, analisando prioridades técnicas, dependências reais, oportunidades de paralelismo, impedimentos e limites de trabalho em progresso (WIP), sem codificar prematuramente.

---

## ⚠️ Regras e Restrições Obrigatórias (Leia antes de iniciar)
* **Nenhum código deve ser escrito nesta etapa:** proibido criar *branches*, *commits* ou *Pull Requests*.
* **Respeite o fluxo oficial do GitHub Project:** `Backlog` ➔ `Ready` ➔ `In Progress` ➔ `In Review` ➔ `Done`.
* **Não mova Issues para "In Progress", "In Review" ou "Done"** apenas para simulação. Se a tarefa não começou a ser desenvolvida, ela não deve sair de `Ready` ou `Backlog`.
* **Não invente status ou labels redundantes** (ex.: label `status:in-progress` ou coluna `Blocked`).
* **Conceito-chave:**
  * *Prioridade* ≠ *Ordem de execução* (uma tarefa de menor prioridade pode ser executada primeiro se desbloquear outras).
  * *Dependência* ≠ *Impedimento* (dependência prevista não é impedimento; impedimento é um bloqueio ativo).

---

## 🧭 Roteiro da Atividade (Passo a Passo)

A atividade está dividida em etapas que acompanham os tópicos e intervenções práticas do PDF didático:

### Passo 1: Priorização Técnica das Sub-Issues (PDF, pág. 1 a 3)
A equipe deve analisar todas as Sub-Issues do caso de uso e determinar o grau de atenção inicial com base em **critérios técnicos**, e não apenas preferência pessoal.
* Avalie para cada Sub-Issue:
  1. **Dependências:** Ela produz contratos/interfaces que outros precisam?
  2. **Valor para a implementação:** Habilita comportamentos centrais?
  3. **Risco técnico:** Envolve incertezas que devem ser mitigadas logo?
  4. **Complexidade:** Qual o esforço previsto?
  5. **Disponibilidade:** A equipe tem capacidade para realizá-la agora?
  6. **Impacto:** O término dela desbloqueia o fluxo?
* **Entrega parcial:** Justificativa técnica indicando qual(is) Sub-Issue(s) receberá(ão) atenção inicial prioritária.

---

### Passo 2: Mapeamento de Dependências e Paralelismo (PDF, pág. 3 e 4)
Nem tudo precisa seguir o fluxo tradicional linear (*Entidade ➔ Repository ➔ Service ➔ Controller ➔ Testes*). Abstrações e contratos permitem que várias partes avancem juntas.
* Classifique as dependências entre suas Sub-Issues em:
  * **Dependência de Contrato:** Precisa apenas da interface, assinatura de método ou DTO.
  * **Dependência de Implementação:** Precisa do código/comportamento concreto funcionando.
  * **Dependência de Integração:** Precisa juntar dois módulos para testar de ponta a ponta.
  * **Dependência de Decisão:** Depende de uma escolha arquitetural formalizada.
* **Identifique o paralelismo:** Indique quais Sub-Issues podem ser desenvolvidas em paralelo assim que um contrato básico for acordado.
* **Diagrama:** Esboce um diagrama simples de dependências (diagrama Mermaid ou fluxo em tópicos).

---

### Passo 3: Impedimentos e Políticas de WIP (PDF, pág. 5 a 8)
1. **Diferencie Dependência de Impedimento:**
   * Se algo já está bloqueando a equipe (ex.: falta de decisão sobre qual lib de banco usar ou contrato indefinido), registre como impedimento.
2. **Defina a Política de WIP (Work in Progress):**
   * Quantas Issues a equipe poderá manter simultaneamente em `In Progress` quando o desenvolvimento começar?
   * *Atenção:* "Uma issue por pessoa" não é regra obrigatória. O foco deve ser fechar tarefas antes de abrir novas (*Stop starting, start finishing*).
3. **Simulação de Comentário de Impedimento (PDF, pág. 6):**
   * Elabore a minuta de um comentário técnico objetivo de impedimento seguindo o modelo: *Issue afetada, Impedimento identificado, Impacto, Decisão necessária, Responsável e Próxima ação*.

---

### Passo 4: Reunião Técnica Breve de Coordenação (PDF, pág. 8 e 9)
Façam uma reunião curta (15 minutos) entre os integrantes da equipe para alinhar:
1. Qual Sub-Issue será puxada primeiro?
2. Quem trabalhará nela e quem trabalhará nas tarefas paralelas?
3. Há alguma pendência de especificação ou *Definition of Ready* antes de começar?
4. Registre uma breve ata com as decisões tomadas.

---

## 📦 Produtos Finais Esperados (O que entregar)

Cada equipe deverá entregar **dois artefatos**:

### 1. Comentário Estruturado na Issue Principal do UC (no GitHub)
Publicar na Issue principal do Caso de Uso um comentário consolidando o **Plano Inicial de Execução**, utilizando a tabela padrão do PDF:

```markdown
## 🚀 Plano Inicial de Execução — UC12

| Campo | Informação |
| :--- | :--- |
| **Issue(s) Prioritária(s)** | #[Número] - [Título da Issue] |
| **Justificativa Técnica** | [Por que ela recebe atenção inicial: fornece contrato, reduz risco, etc.] |
| **Dependências Críticas** | [Contratos ou definições que precisam ser alinhadas antes] |
| **Atividades em Paralelo** | [Quais Issues avançarão simultaneamente e por quê] |
| **Impedimentos Atuais** | [Nenhum ou problemas pendentes de decisão] |
| **Responsável Inicial** | @[usuário_github] |
| **Próxima Ação Concreta** | [Ex: Formalizar interface do repositório / Definir DTO] |
| **Limite de WIP Definido** | Máximo de [X] Issues simultâneas em In Progress |
```

---

### 2. Relatório Sintético de Planejamento Operacional (Documento Markdown ou PDF)
Um arquivo único (ou pasta no repositório em `docs/planejamento-operacional.md`) contendo:
1. **Matriz de Priorização Técnica:** Tabela analisando as Sub-Issues com os 6 fatores (dependência, valor, risco, complexidade, disponibilidade e impacto).
2. **Mapeamento de Dependências e Paralelismo:** Classificação dos tipos de dependência e diagrama de precedência/paralelismo.
3. **Política de WIP e Mitigação de Gargalos:** Justificativa da capacidade de trabalho simultâneo da equipe.
4. **Ata da Reunião de Coordenação:** Decisões tomadas e papéis distribuídos.
5. **Link direto para o comentário publicado na Issue principal.**

---

## 🔍 Critérios de Avaliação (Checklist de Qualidade)

A avaliação da atividade considerará os critérios da página 11 do material:

* [ ] **Justificativa Técnica da Priorização:** As prioridades foram fundamentadas tecnicamente (risco, contratos, impacto) e não por "achar mais fácil"?
* [ ] **Compreensão de Dependências:** Souberam diferenciar dependência de contrato de dependência de implementação?
* [ ] **Paralelismo Viável:** Reconheceram oportunidades reais de desenvolvimento simultâneo sem gerar conflito?
* [ ] **Distinção entre Dependência e Impedimento:** Não confundiram relação técnica com bloqueio operacional.
* [ ] **Limite de WIP Realista:** A capacidade de execução definida é compatível com o tamanho da equipe e a complexidade do caso de uso.
* [ ] **Rastreabilidade e Integridade:** Nenhuma branch ou código foi criado antecipadamente, e os estados do GitHub Project foram preservados fielmente.

