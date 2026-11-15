# ARTEFATO 05 — POLÍTICA DE TRABALHO EM PROGRESSO (WIP)

> **Aviso de Rastreabilidade e Governança:**
> - **Caso de Uso:** `UC12 — Cadastrar Produto` (Backend CeliLac).
> - **Princípio Fundamental:** *"Pare de começar e comece a terminar"* (*Stop starting, start finishing*).
> - **Diferenciação Crítica:** Limite de WIP **não é** o mesmo que distribuição de responsabilidades. Cada integrante possui 2 Sub-Issues atribuídas ao longo de todo o ciclo de vida do épico, mas **jamais deverá executá-las concomitantemente**.

---

## 5.1 Análise da Capacidade Operacional da Equipe

A definição da política de Trabalho em Progresso (*Work In Progress* - WIP) baseia-se na capacidade técnica e temporal da equipe (dados provisórios de teste):

- **Tamanho da Equipe:** 4 integrantes.
- **Disponibilidade Semanal Total:** 28 horas/semana (Ana Clara: 8h; Bruno: 8h; Carla: 6h; Diego: 6h).
- **Atividades e Complexidade:** 8 Sub-Issues (`SUB-01` a `SUB-08`), totalizando 15 pontos de esforço (3 Baixas, 3 Médias, 2 Altas).
- **Sobrecarga de Gestão e Qualidade:** Carla absorve a coordenação do GitHub Project; Ana Clara lidera decisões arquiteturais; Diego atua de forma transversal na suíte de testes e qualidade.

---

## 5.2 Proposta da Política de Limites de WIP

### 1. Limites Numéricos Sugeridos no GitHub Project
- **Limite Geral da Equipe em `In Progress`:** **No máximo 2 a 3 atividades simultâneas** em toda a coluna `In Progress`.
- **Limite Individual por Integrante:** **Estritamente 1 atividade em `In Progress` por pessoa** ($WIP = 1$).
- **Limite na Coluna `In Review`:** **No máximo 2 atividades** aguardando validação cruzada para evitar represamento de entregas.

### 2. Justificativa da Capacidade Proposta
1. **Redução do Custo de Troca de Contexto (*Context Switching*):** Em equipes de desenvolvimento com dedicação de 6h a 8h semanais, dividir a atenção entre duas tarefas técnicas distintas reduz drasticamente a produtividade e aumenta a probabilidade de erros conceituais e de tipagem.
2. **Minimização do *Lead Time* (Tempo de Ciclo):** Limitar o WIP garante que uma atividade seja levada do início (`Ready`) até a conclusão (`Done`) no menor intervalo de tempo possível, liberando os contratos necessários para os colegas.
3. **Equilíbrio entre Execução e Revisão Cruzada:** Quando um integrante conclui a codificação e move o item para `In Review`, ele deve priorizar revisar o trabalho de um colega antes de puxar uma nova tarefa do `Ready`.

### 3. Critérios Rígidos para Iniciar Novas Atividades
- Uma nova Sub-Issue só pode ser movida de `Ready` para `In Progress` se:
  1. Atender a 100% dos critérios da *Definition of Ready* (DoR).
  2. O integrante responsável não possuir nenhuma outra tarefa ativa em `In Progress`.
  3. A coluna `In Progress` do GitHub Project não ultrapassar o teto global de 3 tarefas.
  4. Não houver tarefas em `In Review` designadas para o integrante que estejam pendentes de revisão há mais de 24 horas.

### 4. Procedimentos em Caso de Impedimento Técnico
- Se uma tarefa em `In Progress` for bloqueada por um impedimento técnico:
  1. O responsável **não deve** simplesmente puxar outra tarefa para iniciar em paralelo.
  2. O integrante deve aplicar a label `blocked`, registrar um comentário técnico com a causa raiz e o responsável pelo desbloqueio.
  3. A prioridade imediata do integrante passa a ser auxiliar na resolução do bloqueio, realizar revisões de código pendentes (`In Review`) ou atuar em pareamento com outro integrante.

### 5. Estratégia contra Concentração de Atividades
- O integrante `Bruno` possui duas tarefas de complexidade média no caminho crítico (`SUB-04` - Repositório e `SUB-03` - Validação). A política de WIP estabelece que Bruno executará primeiro `SUB-04` (focando na interface de persistência) e apenas após movê-la para `In Review` iniciará a implementação de `SUB-03`.

### 6. Acompanhamento Visual no GitHub Project
- A Coordenadora (`Carla`) acompanhará o board em visualização de quadro Kanban (*Board View*):
  - Inserir nos cabeçalhos das colunas o indicativo visual: `In Progress (Max: 3)` e `In Review (Max: 2)`.
  - Utilizar o agrupamento (*Group by*) por `Assignee` para identificar visualmente qualquer violação da regra $WIP = 1$.

---

## 5.3 Cenário Didático: O Risco do Excesso de WIP

> [!NOTE]
> **SIMULAÇÃO DIDÁTICA — CENÁRIO HIPOTÉTICO DE ALERTA.**
> Este cenário é apresentado exclusivamente para fins educativos, visando demonstrar aos estudantes o colapso de fluxo provocado pelo excesso de trabalho em progresso. Os estados reais do GitHub Project **não foram alterados**.

### 1. Descrição do Cenário Hipotético
Imagine que a equipe, entusiasmada para demonstrar rapidez, decida iniciar **todas as 8 Sub-Issues simultaneamente** no primeiro dia de trabalho. Cada integrante move suas 2 tarefas atribuídas para a coluna `In Progress`. O board passa a exibir 8 tarefas ativas para 4 pessoas ($WIP = 2$ por pessoa; $WIP_{total} = 8$).

### 2. Consequências Técnicas e Operacionais Imediatas
1. **Inferno de Integração (*Merge Conflicts* Massivos):** Carla implementa o endpoint `POST /products` (`SUB-06`) supondo uma estrutura para o DTO; Diego escreve testes E2E (`SUB-07`) baseando-se em suposições próprias; Bruno modela o TypeORM (`SUB-04`) com nomes de colunas diferentes do que Ana Clara está criando na entidade `Product` (`SUB-01`). Ao tentarem integrar no final da sprint, nenhuma parte se conecta, gerando dias de refatoração pura e desperdício de código.
2. **Branches Órfãs e Desatualizadas:** Com 8 branches abertas ao mesmo tempo, nenhuma entrega é finalizada. As branches sofrem desvio contínuo (*drift*) em relação à branch principal `main`, tornando os Pull Requests gigantescos e quase impossíveis de serem revisados com rigor.
3. **Ilusão de Progresso (*99% Done Syndrome*):** A equipe tem a falsa sensação de que 8 tarefas estão quase prontas ("está 90% feito"), mas nenhuma funcionalidade está comprovadamente testada, integrada ou apta para ser apresentada ao usuário. O fluxo congela.

### 3. Reorganização Recomendada do Fluxo
Caso a equipe caia nesse cenário, a intervenção imediata da Coordenação deve ser:
1. **Congelar (*Stop New Work*):** Interromper a codificação de todas as tarefas de camadas superiores (`SUB-05`, `SUB-06`, `SUB-07` E2E e `SUB-08`), retornando-as para `Backlog` ou mantendo-as pausadas.
2. **Foco Estrito na Base (Onda 1):** Concentrar toda a capacidade da equipe em concluir e integrar `SUB-01` (Entidade) e `SUB-02` (DTO).
3. **Fechamento em Fila Controlada:** Mover uma tarefa por vez para `In Review`, garantindo que o revisor aprove o PR antes que novas frentes de código sejam abertas.

