# Artefato 8 — Planejamento do GitHub Project

## 1. Visão Geral
Este artefato define o planejamento e a configuração do **GitHub Project** (quadro Kanban) para gestão do ciclo de vida da implementação do **UC12 — Cadastrar Produto**.

---

## 2. Configuração das Colunas e Estados do Board
Conforme exigência estrita da metodologia didática, a coluna/campo **Status** do projeto no GitHub deve ser configurada contendo **exclusivamente os 5 estados formais** abaixo (sem inclusão de estados como "Todo", "In Test" ou cartões órfãos em "No Status"):

1. **`Backlog`:** Atividades mapeadas e especificadas que aguardam o atendimento das condições de prontidão (Definition of Ready) ou a conclusão de pré-requisitos bloqueantes.
2. **`Ready`:** Atividades refinadas cujos pré-requisitos técnicos foram satisfeitos e que estão prontas para serem puxadas para desenvolvimento.
3. **`In Progress`:** Atividades com desenvolvimento de código ativamente em andamento por um membro da equipe.
4. **`In Review`:** Atividades com código concluído e submetido a Pull Request, aguardando revisão técnica por pares e validação de pipeline de CI.
5. **`Done`:** Atividades totalmente integradas à branch principal, validadas por testes automatizados e atendendo à Definition of Done.

---

## 3. Matriz de Distribuição Inicial das Issues no Board

Na fase de **planejamento técnico**, nenhuma atividade de codificação foi iniciada. Portanto, todos os itens são distribuídos estritamente entre `Backlog` e `Ready`, conforme a ausência ou presença de impedimentos técnicos prévios.

| Identificador | Título da Issue / Sub-Issue | Status Inicial Recomendado | Justificativa Técnica para o Status |
| :---: | :--- | :---: | :--- |
| **UC12** | `[UC12] Cadastrar Produto` *(Épico Principal)* | **`Backlog`** | Issue guarda-chuva; permanecerá no quadro acompanhando o progresso e só passará a `Done` após o encerramento de todas as Sub-Issues. |
| **SUB-01** | `[SUB-01] Modelar a Entidade de Domínio Product e Invariantes` | **`Ready`** | Atividade independente, com critérios de aceite fechados e sem pré-requisitos bloqueantes. Pronta para desenvolvimento. |
| **SUB-02** | `[SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato` | **`Ready`** | Atividade independente, com especificações de validação sintática definidas. Pronta para desenvolvimento. |
| **SUB-03** | `[SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos` | **`Backlog`** | Bloqueada tecnicamente pela modelagem da entidade (`SUB-01`). Passará para `Ready` assim que `SUB-01` for concluída. |
| **SUB-04** | `[SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto` | **`Backlog`** | Bloqueada por `SUB-01`, `SUB-02` e `SUB-03`. Requer estabilização das camadas base antes de entrar em execução. |
| **SUB-05** | `[SUB-05] Implementar o Controlador HTTP e Rota POST /products` | **`Backlog`** | Bloqueada por `SUB-02` e `SUB-04`. Depende da orquestração de aplicação concluída. |
| **SUB-06** | `[SUB-06] Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)` | **`Backlog`** | Fechamento integrado de qualidade; depende de todos os componentes da API disponíveis para testes ponta a ponta. |

---

## 4. Regras de Transição de Estado no Kanban
- **Puxar para `In Progress`:** Somente quando a issue estiver em `Ready`, houver um responsável alocado e o limite de WIP (Work in Progress) da equipe for respeitado.
- **Mover para `In Review`:** Ao abrir o Pull Request no repositório referenciando a Sub-Issue via palavra-chave (ex.: `Closes #15`).
- **Mover para `Done`:** Automaticamente no merge do PR na branch principal, após aprovação dos revisores e verificação de testes no CI.

