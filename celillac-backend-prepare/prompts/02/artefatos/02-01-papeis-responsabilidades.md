# ARTEFATO 01 — MATRIZ DE PAPÉIS E RESPONSABILIDADES

> **Aviso de Rastreabilidade e Escopo:**
> - **Natureza dos dados de equipe:** Os quatro integrantes abaixo (`Integrante 01` a `Integrante 04`) foram definidos **em caráter provisório e simulado (dados de teste)**, mediante solicitação explícita para continuidade do exercício, alinhados à stack tecnológica do projeto CeliLac (TypeScript, NestJS, TypeORM, PostgreSQL, Vitest e Supertest). Devem ser substituídos pelos dados reais dos estudantes antes da oficialização no GitHub.
> - **Informação proveniente do planejamento anterior:** Caso de uso `UC12 — Cadastrar Produto`, Issue principal (`EPIC-UC12`) e 8 Sub-Issues (`SUB-01` a `SUB-08`).
> - **Status no GitHub:** Nenhuma atribuição ou permissão foi efetivamente cadastrada no GitHub até a confirmação manual pela equipe.

---

## 1.1 Dados da Equipe (Proposta Provisória para Teste)

| Identificador | Nome (Simulado / Provisório) | Usuário GitHub (Simulado) | Conhecimentos e Experiências Técnicas (Alinhados ao CeliLac) | Disponibilidade Relativa | Funções Previamente Definidas | Autorização Administrativa no Repositório |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Integrante 1** | Ana Clara Souza | `@anaclara-dev` *(provisório)* | Arquitetura em camadas com NestJS, modelagem de domínio em TypeScript, serviços de aplicação e regras de negócio. | Alta (8h/semana) | Responsável Técnica | Não informada (Não possui por padrão) |
| **Integrante 2** | Bruno Oliveira Santos | `@bruno-oliveira` *(provisório)* | Banco de dados PostgreSQL, mapeamento objeto-relacional com TypeORM, repositórios, migrações e validações de domínio. | Alta (8h/semana) | Desenvolvedor | Sim (Proprietário / Admin autorizado do repositório do grupo) |
| **Integrante 3** | Carla Mendes Ferreira | `@carlamendes` *(provisório)* | Construção de APIs REST com NestJS (Controllers, DTOs, contratos HTTP), documentação técnica de APIs e organização de projetos/boards. | Média (6h/semana) | Coordenadora | Não possui |
| **Integrante 4** | Diego Costa Almeida | `@diego-almeida` *(provisório)* | Testes automatizados unitários e E2E com Vitest e Supertest, verificação de critérios de aceite e qualidade de software. | Média (6h/semana) | Desenvolvedor | Não possui |

---

## 1.2 Definição das Funções Organizacionais

Para organizar a execução e a revisão do planejamento do **UC12 — Cadastrar Produto**, estabelecem-se quatro funções organizacionais complementares:

1. **Coordenador(a):** Responsável pela organização do fluxo de trabalho da equipe, acompanhamento do andamento das Issues no GitHub Project (`Backlog` → `Ready` → `In Progress` → `In Review` → `Done`), controle de pendências documentais, verificação do cumprimento dos prazos e garantia de que todas as Sub-Issues passem por revisão cruzada e verificação da *Definition of Ready* (DoR).
2. **Responsável Técnico(a):** Responsável por zelar pela coesão arquitetural da solução no projeto CeliLac (aderência entre camada de domínio, DTOs, serviço de aplicação, repositório TypeORM e controller HTTP), conduzir o esclarecimento das dúvidas técnicas pendentes na especificação original do UC12 e apoiar a resolução de conflitos de integração entre Sub-Issues dependentes.
3. **Desenvolvedor(a) (Executor de Sub-Issue / *Assignee*):** Responsável direto pela futura implementação técnica da(s) Sub-Issue(s) sob sua atribuição, bem como por realizar os ajustes documentais solicitados durante a etapa de revisão do planejamento.
4. **Revisor(a) de Issues:** Responsável por inspecionar criticamente o planejamento de Sub-Issues atribuídas a outros colegas (revisão cruzada), verificando clareza de objetivo, delimitação de escopo, verificabilidade dos critérios de aceite, dependências, labels e atendimento à *Definition of Ready* (DoR), registrando parecer técnico formal na Issue.

---

## 1.3 Distinção Conceitual: Papel Funcional vs. Permissão Técnica vs. Atribuição de Trabalho

| Conceito | Definição no Contexto do Projeto | Exemplo Prático no UC12 |
| :--- | :--- | :--- |
| **Papel Funcional** | Função organizacional exercida pelo estudante dentro da dinâmica da equipe (coordenação, liderança técnica, desenvolvimento ou revisão). **Não concede nem exige automaticamente privilégios administrativos no GitHub.** | `Carla Mendes Ferreira` atua como **Coordenadora** do grupo e `Ana Clara Souza` atua como **Responsável Técnica**, mas nenhuma das duas precisa de permissão `Admin` no repositório. |
| **Permissão Técnica** | Nível de acesso configurado no GitHub (repositório e GitHub Project) que define quais operações o usuário pode executar na plataforma (`Read`, `Triage`, `Write`, `Maintain`, `Admin`), regido pelo **princípio do menor privilégio**. | Todos os integrantes que editarão Issues, aplicarão labels e participarão da implementação futura necessitam de permissão `Write` no repositório e no GitHub Project, reservando-se `Admin` exclusivamente a quem detém autorização formal sobre o repositório (`Bruno Oliveira Santos`). |
| **Atribuição de Trabalho** | Vínculo operacional específico entre um integrante e uma unidade de trabalho (`SUB-01` a `SUB-08`), dividindo-se em **Assignee** (quem executa a atividade) e **Revisor Designado** (quem audita o planejamento daquela Issue). | Na `SUB-01`, `Ana Clara Souza` possui a atribuição de **Assignee**, enquanto `Bruno Oliveira Santos` possui a atribuição de **Revisor Designado**. |

---

## 1.4 Matriz de Papéis e Responsabilidades por Integrante

| Nome | GitHub (Provisório) | Função Principal | Funções Adicionais | Responsabilidades Específicas no UC12 | Atividades sob sua Execução (*Assignee*) | Atividades sob sua Revisão ou Coordenação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ana Clara Souza** | `@anaclara-dev` | **Responsável Técnica** | Desenvolvedora; Revisora de Issues | - Garantir a consistência arquitetural entre Domínio (`Product`), Contratos (DTO), Serviço de Aplicação e Persistência.<br>- Conduzir a confirmação técnica dos atributos de `Product` e das regras `RN01` e `RN02` junto à especificação original.<br>- Executar as Sub-Issues de modelagem de domínio e orquestração do serviço de aplicação.<br>- Revisar tecnicamente as Sub-Issues de validação e persistência. | `SUB-01` (Entidade `Product`)<br>`SUB-05` (Serviço de Aplicação) | **Apoio Técnico Geral:** `EPIC-UC12`<br>**Revisora Designada:** `SUB-03`, `SUB-04` |
| **Bruno Oliveira Santos** | `@bruno-oliveira` | **Desenvolvedor** | Revisor de Issues; Administrador autorizado do repositório | - Implementar as regras de validação de dados/negócio (`RN01`, `RN02`, `RN03`) e a camada de persistência/repositório TypeORM.<br>- Revisar o modelo da entidade de domínio e a suíte de testes automatizados.<br>- Executar exclusivamente as configurações administrativas estritamente necessárias no repositório quando solicitadas pela equipe. | `SUB-03` (Validações)<br>`SUB-04` (Persistência e Repositório) | **Revisor Designado:** `SUB-01`, `SUB-07` |
| **Carla Mendes Ferreira** | `@carlamendes` | **Coordenadora** | Desenvolvedora; Revisora de Issues | - Coordenar o GitHub Project, mantendo os estados (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`) íntegros e atualizados.<br>- Acompanhar o registro das revisões cruzadas e a verificação da *Definition of Ready* (DoR).<br>- Executar a definição dos DTOs e a criação do endpoint HTTP `POST /products`.<br>- Revisar o serviço de aplicação e a documentação técnica. | `SUB-02` (DTO de Cadastro)<br>`SUB-06` (Endpoint `POST /products`) | **Coordenação Geral:** `EPIC-UC12` e Board do GitHub Project<br>**Revisora Designada:** `SUB-05`, `SUB-08` |
| **Diego Costa Almeida** | `@diego-almeida` | **Desenvolvedor** | Revisor de Issues | - Planejar e implementar os testes automatizados (unitários e E2E com Vitest/Supertest) cobrindo `CA01` a `CA04`, `FP`, `FA01`, `FA02` e `FE01`.<br>- Atualizar a documentação técnica da operação `POST /products`.<br>- Revisar os contratos de entrada/saída (DTO) e o endpoint HTTP para assegurar testabilidade. | `SUB-07` (Testes Automatizados)<br>`SUB-08` (Documentação Técnica) | **Revisor Designado:** `SUB-02`, `SUB-06` |

---

## 1.5 Justificativa da Distribuição de Papéis

1. **Separação entre Coordenação Organizacional e Liderança Técnica:** A atribuição da coordenação a **Carla Mendes Ferreira** (que possui disponibilidade média e foco nas interfaces e contratos de entrada/saída) e da responsabilidade técnica a **Ana Clara Souza** (que atua no núcleo de domínio e serviço de aplicação, com disponibilidade alta) evita sobrecarregar um único membro com toda a gestão burocrática e arquitetural do caso de uso.
2. **Alinhamento entre Conhecimento Técnico e Camada Arquitetural:**
   - **Ana Clara Souza** assume o modelo de domínio (`SUB-01`) e o ponto central de orquestração (`SUB-05`), condizentes com seu papel de Responsável Técnica.
   - **Bruno Oliveira Santos** assume `SUB-03` (validações) e `SUB-04` (persistência/repositório TypeORM), aproveitando sua experiência em banco de dados e regras de integridade.
   - **Carla Mendes Ferreira** assume `SUB-02` (DTOs) e `SUB-06` (Controller HTTP `POST /products`), garantindo total coesão nos contratos de entrada e saída HTTP.
   - **Diego Costa Almeida** assume `SUB-07` (testes automatizados em Vitest/Supertest) e `SUB-08` (documentação técnica), atuando transversalmente na verificação de qualidade e registro final dos contratos.
3. **Independência na Revisão Cruzada:** Todos os quatro integrantes atuam tanto como **Desenvolvedores** (2 Sub-Issues cada) quanto como **Revisores de Issues** (2 Sub-Issues cada), garantindo que nenhum integrante revise a própria atividade e que os revisores possuam afinidade direta com as interfaces das tarefas que revisam.
4. **Não Associação Automática de Permissão Admin:** Conforme as boas práticas de segurança e governança no GitHub, nem a Coordenadora (`Carla`) nem a Responsável Técnica (`Ana Clara`) recebem permissão `Admin` por conta de seus papéis funcionais; a administração do repositório permanece restrita a quem já detém autorização formal (`Bruno`).

