# Artefato 11 — Checklist de Validação

## 1. Visão Geral
Este checklist deve ser utilizado pelos estudantes para inspecionar e garantir a conformidade formal e técnica do planejamento do **UC12 — Cadastrar Produto** antes da entrega ou submissão da atividade acadêmica.

---

## 2. Itens de Verificação de Conformidade

### 2.1 Estrutura e Escopo das Issues
- [ ] **Issue Principal (Épico) documentada:** A Issue `[UC12] Cadastrar Produto` contém objetivo geral, contexto, referência formal, requisitos contemplados e Definition of Done.
- [ ] **Quantidade mínima de Sub-Issues atendida:** Foram planejadas 6 Sub-Issues tecnicamente justificadas (atendendo ao requisito mínimo de 5 unidades de trabalho).
- [ ] **Ausência de tarefas artificiais ou redundantes:** Cada Sub-Issue representa uma responsabilidade arquitetural legítima, sem fragmentação artificial de TDD (ex.: sem separação forçada de tarefa exclusiva para RED e outra para GREEN).
- [ ] **Critérios de aceite testáveis:** Todas as Sub-Issues possuem critérios de aceite objetivos, verificáveis por meio de asserções funcionais ou testes automatizados.

### 2.2 Dependências e Rastreabilidade
- [ ] **Rastreabilidade total garantida:** Todos os requisitos funcionais (RF01 a RF05), regras de negócio (RN01 a RN04) e fluxos (Principal, FA01, FA02, FE01) estão mapeados na Matriz de Rastreabilidade.
- [ ] **Ausência de dependências circulares:** A Matriz de Dependências define um grafo acíclico coerente (`SUB-01` e `SUB-02` na base, convergindo em `SUB-04` e finalizando em `SUB-06`).
- [ ] **Caminho crítico identificado:** O gargalo técnico e a ordem de desbloqueio entre as camadas estão claramente sinalizados.

### 2.3 Taxonomia e Gestão no GitHub
- [ ] **Labels configuradas e associadas:** O esquema de labels contempla domínio (`module:products`), tipo de atividade (`type:*`), camada arquitetural (`layer:*`) e prioridade (`priority:*`), estando aplicado em todas as issues.
- [ ] **GitHub Project configurado estritamente com 5 estados:** O campo Status do quadro Kanban possui unicamente os estados `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`, sem uso de "Todo" ou estados não padronizados.
- [ ] **Estado inicial condizente com planejamento:** Nenhuma issue está marcada como `In Progress`, `In Review` ou `Done`. Os itens estão distribuídos exclusivamente entre `Ready` (desbloqueados) e `Backlog` (aguardando pré-requisitos).
- [ ] **Tasklist vinculada:** A Issue principal referencia diretamente as Sub-Issues via `#número`, permitindo ao GitHub calcular a barra de progresso do Épico.

### 2.4 Restrições Metodológicas
- [ ] **Ausência de código-fonte prematuro:** Nenhum código de produção foi implementado durante esta fase de planejamento.
- [ ] **Ausência de branches ou PRs prematuros:** Não foram criadas branches de feature nem abertos Pull Requests antecipadamente.
- [ ] **Fidelidade à documentação do caso de uso:** Não foram inventadas regras de negócio estranhas à especificação original; todas as suposições técnicas foram devidamente sinalizadas como hipóteses/propostas.

