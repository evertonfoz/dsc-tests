# ARTEFATO 03 — MATRIZ DE DISTRIBUIÇÃO DAS SUB-ISSUES

> **Aviso de Rastreabilidade:**
> - **Informação proveniente do planejamento anterior:** Foram preservadas integralmente e sem alterações a Issue principal (`EPIC-UC12`) e as **8 Sub-Issues (`SUB-01` a `SUB-08`)** com seus títulos, objetivos, escopos e dependências originais. Nenhuma Sub-Issue extra foi criada para representar revisões ou tarefas administrativas.
> - **Decisão proposta pela IA (Provisória para Teste):** Alocação de *Assignees* (responsáveis pela execução) e *Revisores* (responsáveis pela revisão cruzada da Issue) entre os 4 integrantes simulados, garantindo que **em 100% das Sub-Issues o Revisor seja diferente do Assignee**.
> - **Status no GitHub:** Os campos *Assignee* no GitHub continuam pendentes de preenchimento real (`A definir` no sistema até a execução do Artefato 07 pela equipe).

---

## 3.1 Critérios Utilizados para Estimativa de Complexidade e Alocação

Para evitar medir o equilíbrio de trabalho apenas pela contagem bruta de Issues, cada Sub-Issue foi classificada em três níveis de complexidade técnica no contexto do projeto CeliLac (NestJS + TypeORM + PostgreSQL + Vitest):

- **Baixa (Peso 1):** Definição de estruturas de dados isoladas ou atualização documental com baixa lógica condicional (`SUB-01`, `SUB-02`, `SUB-08`).
- **Média (Peso 2):** Implementação de componentes em uma camada específica com integração localizada ou regras delimitadas (`SUB-03`, `SUB-04`, `SUB-06`).
- **Alta (Peso 3):** Componentes de convergência arquitetural com múltiplas dependências ou verificação abrangente de todos os fluxos e critérios de aceite (`SUB-05`, `SUB-07`).

---

## 3.2 Matriz de Distribuição das Sub-Issues (`SUB-01` a `SUB-08`)

| Identificador | Título da Sub-Issue (Preservado) | Complexidade Estimada | Dependências Técnicas | Assignee Proposto (Execução) | Revisor Designado (Revisão da Issue) | Status Atual Informado (Etapa 1) | Status Recomendado (Após DoR / Etapa 2) | Justificativa Técnica da Atribuição (Execução e Revisão) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SUB-01** | `[UC12][Domínio] Modelar entidade Product` | **Baixa** (Peso 1) | Nenhuma *(depende de confirmação documental dos atributos)* | **Ana Clara Souza** (`@anaclara-dev`) | **Bruno Oliveira Santos** (`@bruno-oliveira`) | `Ready` *(no plano anterior, com ressalva de confirmação de atributos)* | **`Backlog`** *(aguarda confirmação dos atributos na especificação original e conclusão da revisão humana — DoR-05 e DoR-07)* | **Execução:** Ana Clara é a Responsável Técnica e domina modelagem de domínio em TypeScript.<br>**Revisão:** Bruno implementará o repositório (`SUB-04`) e as validações (`SUB-03`), que dependem diretamente da entidade `Product`, tornando-o o revisor ideal para validar se a entidade atende às necessidades de persistência e regras. |
| **SUB-02** | `[UC12][Contratos] Criar DTO de cadastro de produto` | **Baixa** (Peso 1) | Nenhuma *(relação de contexto com `SUB-01`)* | **Carla Mendes Ferreira** (`@carlamendes`) | **Diego Costa Almeida** (`@diego-almeida`) | `Ready` *(no plano anterior)* | **`Backlog`** *(aguarda confirmação do contrato de entrada/saída na especificação original e revisão humana — DoR-05 e DoR-07)* | **Execução:** Carla tem experiência em contratos HTTP e DTOs no NestJS.<br>**Revisão:** Diego escreverá os testes automatizados (`SUB-07`) e a documentação (`SUB-08`) baseados nesses DTOs, garantindo uma revisão focada na clareza e testabilidade dos contratos de entrada e saída. |
| **SUB-03** | `[UC12][Validação] Implementar validações de dados e regras de negócio do produto` | **Média** (Peso 2) | `SUB-01` e/ou `SUB-02` | **Bruno Oliveira Santos** (`@bruno-oliveira`) | **Ana Clara Souza** (`@anaclara-dev`) | `Backlog` | **`Backlog`** *(aguarda especificação exata de `RN01` e `RN02` e revisão humana)* | **Execução:** Bruno possui foco em regras de integridade e validações de dados.<br>**Revisão:** Ana Clara consumirá diretamente essas validações dentro do serviço de aplicação (`SUB-05`), assegurando que o contrato de retorno/exceção das validações esteja bem definido. |
| **SUB-04** | `[UC12][Persistência] Configurar persistência e implementar repositório de produtos` | **Média** (Peso 2) | `SUB-01` | **Bruno Oliveira Santos** (`@bruno-oliveira`) | **Ana Clara Souza** (`@anaclara-dev`) | `Backlog` | **`Backlog`** *(aguarda definição dos atributos de `Product` e revisão humana)* | **Execução:** Bruno domina TypeORM e PostgreSQL, sendo o mais indicado para configurar o mapeamento e o repositório.<br>**Revisão:** Ana Clara integrará o repositório no serviço de aplicação (`SUB-05`) e verificará o suporte ao tratamento da falha de persistência (`FE01`). |
| **SUB-05** | `[UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` | **Alta** (Peso 3) | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04` | **Ana Clara Souza** (`@anaclara-dev`) | **Carla Mendes Ferreira** (`@carlamendes`) | `Backlog` | **`Backlog`** *(aguarda definições de contrato/regras e revisão humana)* | **Execução:** Atividade central de orquestração (`RN03`, `RN04`, `FP`, `FE01`), atribuída à Responsável Técnica (Ana Clara).<br>**Revisão:** Carla implementará o endpoint `POST /products` (`SUB-06`), que invoca diretamente este serviço, permitindo revisar se as assinaturas e respostas do serviço atendem à camada HTTP. |
| **SUB-06** | `[UC12][HTTP] Criar endpoint POST /products` | **Média** (Peso 2) | `SUB-02`, `SUB-05` | **Carla Mendes Ferreira** (`@carlamendes`) | **Diego Costa Almeida** (`@diego-almeida`) | `Backlog` | **`Backlog`** *(aguarda confirmação de status HTTP, autorização do ator e revisão humana)* | **Execução:** Carla é especialista em Controllers REST no NestJS e já desenvolve o DTO (`SUB-02`), mantendo coesão na camada HTTP.<br>**Revisão:** Diego executará os testes E2E com Supertest sobre a rota `POST /products` (`SUB-07`), revisando os códigos HTTP e cenários de resposta. |
| **SUB-07** | `[UC12][Testes] Implementar testes automatizados para o cadastro de produto` | **Alta** (Peso 3) | `SUB-03`, `SUB-05`, `SUB-06` | **Diego Costa Almeida** (`@diego-almeida`) | **Bruno Oliveira Santos** (`@bruno-oliveira`) | `Backlog` | **`Backlog`** *(aguarda confirmação das regras de negócio/contratos HTTP e revisão humana)* | **Execução:** Diego possui domínio em Vitest e Supertest, ficando responsável pela suíte que comprova `CA01` a `CA04`.<br>**Revisão:** Bruno (responsável pelas validações e persistência) revisará se os cenários de teste cobrem adequadamente a rejeição (`FA01`, `FA02`), a não persistência de inválidos (`CA03`) e a falha de banco (`FE01`). |
| **SUB-08** | `[UC12][Documentação] Atualizar documentação técnica do cadastro de produtos` | **Baixa** (Peso 1) | `SUB-02`, `SUB-06` | **Diego Costa Almeida** (`@diego-almeida`) | **Carla Mendes Ferreira** (`@carlamendes`) | `Backlog` | **`Backlog`** *(aguarda fechamento dos contratos HTTP e revisão humana)* | **Execução:** Diego consolida a documentação técnica após validar os comportamentos nos testes.<br>**Revisão:** Carla (autora do DTO e do endpoint `POST /products`) revisa a Sub-Issue para garantir fidelidade absoluta ao contrato HTTP. |

> **Nota sobre a Issue Principal (`EPIC-UC12 — [UC12] Cadastrar Produto`):**
> - **Acompanhamento / Coordenação:** `Carla Mendes Ferreira` (Coordenadora) em conjunto com `Ana Clara Souza` (Responsável Técnica).
> - **Status atual e recomendado:** `Backlog` (por ser o item guarda-chuva que acompanha o ciclo completo das 8 Sub-Issues).

---

## 3.3 Análise de Equilíbrio e Carga de Trabalho da Equipe

A tabela abaixo demonstra que a distribuição foi balanceada não apenas pelo número de Sub-Issues (2 para cada integrante), mas principalmente pela **soma de complexidade (pontos de esforço)**, pelo **papel adicional de gestão/liderança** e pela **disponibilidade declarada**:

| Integrante | Disponibilidade | Quantidade de Sub-Issues (Execução) | Sub-Issues Atribuídas (Complexidade) | Carga Técnica de Execução (Soma de Pesos) | Quantidade de Sub-Issues (Revisão) | Sub-Issues para Revisar | Carga de Coordenação / Liderança | Avaliação de Equilíbrio |
| :--- | :--- | :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **Ana Clara Souza** (`@anaclara-dev`) | **Alta** (8h/sem) | **2** | `SUB-01` (Baixa: 1) + `SUB-05` (Alta: 3) | **4 pontos** | **2** | `SUB-03` (Média) + `SUB-04` (Média) | **Responsável Técnica** (apoio arquitetural no `EPIC-UC12`) | **Equilibrada:** Combina 1 tarefa inicial simples (`SUB-01`) no início do ciclo com 1 tarefa complexa (`SUB-05`) no meio do ciclo, compatível com sua alta disponibilidade. |
| **Bruno Oliveira Santos** (`@bruno-oliveira`) | **Alta** (8h/sem) | **2** | `SUB-03` (Média: 2) + `SUB-04` (Média: 2) | **4 pontos** | **2** | `SUB-01` (Baixa) + `SUB-07` (Alta) | **Admin do Repositório** (configuração pontual de acessos) | **Equilibrada:** Executa duas tarefas de complexidade média no núcleo técnico (validação e persistência) que podem ocorrer em sequência logo após a `SUB-01`. |
| **Carla Mendes Ferreira** (`@carlamendes`) | **Média** (6h/sem) | **2** | `SUB-02` (Baixa: 1) + `SUB-06` (Média: 2) | **3 pontos** | **2** | `SUB-05` (Alta) + `SUB-08` (Baixa) | **Coordenadora** (gestão do GitHub Project e acompanhamento de DoR) | **Equilibrada:** Possui carga de execução técnica ligeiramente menor (3 pontos vs. 4 pontos) justamente para compensar o esforço contínuo de **Coordenação da equipe e gestão do Board**, respeitando sua disponibilidade média. |
| **Diego Costa Almeida** (`@diego-almeida`) | **Média** (6h/sem) | **2** | `SUB-07` (Alta: 3) + `SUB-08` (Baixa: 1) | **4 pontos** | **2** | `SUB-02` (Baixa) + `SUB-06` (Média) | Sem encargo de gestão (foco 100% técnico em Qualidade e Documentação) | **Equilibrada:** Não acumula funções de coordenação ou liderança técnica, podendo dedicar suas 6h/semana integralmente à suíte de testes (`SUB-07`), à documentação (`SUB-08`) e às revisões da camada HTTP. |
| **TOTAL DA EQUIPE** | **28h/sem** | **8 Sub-Issues** | `SUB-01` a `SUB-08` | **15 pontos** | **8 Revisões** | 100% das Sub-Issues cobertas | Coordenação + Liderança Técnica + Admin distribuídos | **100% de cobertura sem sobrecarga individual e sem auto-revisão.** |

---

## 3.4 Escalonamento Temporal (Ondas de Execução Futura)

A distribuição proposta também evita gargalos de fila por integrante ao longo do tempo:

1. **Onda 1 (Início imediato após confirmação de especificação e DoR):**
   - `Ana Clara` atua na `SUB-01` (Entidade `Product`).
   - `Carla` atua em paralelo na `SUB-02` (DTO de Cadastro).
2. **Onda 2 (Desenvolvimento das regras e infraestrutura):**
   - `Bruno` atua na `SUB-04` (Repositório TypeORM) e na `SUB-03` (Validações).
   - `Diego` já pode preparar a estrutura base de testes unitários de validação (`SUB-07` parcial).
3. **Onda 3 (Integração da aplicação e exposição HTTP):**
   - `Ana Clara` atua na `SUB-05` (Serviço de Aplicação).
   - Em seguida, `Carla` finaliza a integração da `SUB-06` (Endpoint `POST /products`).
4. **Onda 4 (Fechamento de verificação e documentação):**
   - `Diego` conclui os testes E2E (`SUB-07`) e a documentação técnica (`SUB-08`).

