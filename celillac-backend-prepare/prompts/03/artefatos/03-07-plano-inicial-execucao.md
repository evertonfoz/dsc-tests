# ARTEFATO 07 — PLANO INICIAL DE EXECUÇÃO

> **Aviso de Rastreabilidade e Governança:**
> - **Produto Principal da Etapa 3:** Este plano consolida todas as diretrizes operacionais, de dependência, priorização e capacidade formuladas nos artefatos anteriores.
> - **Natureza dos Dados de Equipe:** Planejamento elaborado com base na equipe simulada de 4 integrantes (`Ana Clara`, `Bruno`, `Carla` e `Diego`), devendo ser ajustado com os dados reais dos estudantes antes da oficialização prática.
> - **Compromisso de Transparência:** A preparação documental **não equivale à execução prática**. Nenhuma linha de código foi implementada e nenhum card do GitHub Project foi movido indevidamente para estados de trabalho ativo.

---

## 7.1 Identificação do Projeto e Contexto Operacional

- **Projeto:** CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (Backend API).
- **Stack Tecnológica:** Node.js, TypeScript, NestJS, TypeORM, PostgreSQL, Vitest, Supertest, Swagger/OpenAPI.
- **Caso de Uso:** `UC12 — Cadastrar Produto`.
- **Issue Principal (Épico):** `[UC12] Cadastrar Produto` (`EPIC-UC12`).
- **Equipe Técnica:**
  - **Ana Clara Souza** (`@anaclara-dev`) — *Responsável Técnica* (8h/sem)
  - **Bruno Oliveira Santos** (`@bruno-oliveira`) — *Desenvolvedor / Admin Repositório* (8h/sem)
  - **Carla Mendes Ferreira** (`@carlamendes`) — *Coordenadora* (6h/sem)
  - **Diego Costa Almeida** (`@diego-almeida`) — *Desenvolvedor / Qualidade* (6h/sem)
- **Referência do GitHub Project:** Board estruturado com 5 estados: `Backlog` → `Ready` → `In Progress` → `In Review` → `Done`.

---

## 7.2 Situação Inicial da Entrega

- **Total de Sub-Issues Planejadas:** 8 Sub-Issues (`SUB-01` a `SUB-08`).
- **Issues Comprovadamente em Estado `Ready`:** **0 (zero)**. Nenhuma Sub-Issue atende integralmente à *Definition of Ready* no momento, devido a pendências de especificação (`DoR-05`) e à pendência de realização da revisão cruzada humana registrada no GitHub (`DoR-07`).
- **Issues em Estado `Backlog`:** **8 (100%)** das Sub-Issues (`SUB-01` a `SUB-08`).
- **Pendências Críticas de Especificação:**
  1. Ausência de dicionário formal de atributos e restrições da entidade `Product` (`SUB-01`).
  2. Limites numéricos e critérios formais de validação para as regras `RN01` e `RN02` (`SUB-03`).
  3. Padronização do contrato de retorno HTTP (status code `201` com body vs. header `Location`) e controle de acesso (`SUB-06`).
- **Pendências de Revisão:** Registro dos comentários de revisão técnica e aprovação formal pelos integrantes no GitHub.
- **Decisões Técnicas Necessárias:** Separação entre validação de DTOs e regras de domínio; estratégia de tratamento de erro no PostgreSQL (`FE01`).

---

## 7.3 Prioridades de Atenção Inicial

As seguintes atividades demandam atenção prioritária da equipe antes de qualquer início de codificação:

### 1. `SUB-01: [UC12][Domínio] Modelar entidade Product`
- **Justificativa Técnica:** Define o esquema de tipos fundamental do domínio. Todas as demais Sub-Issues dependem da estabilização de suas propriedades para evitar retrabalho estrutural em cascata.
- **Responsável:** `Ana Clara Souza` (com revisão de `Bruno`).
- **Condições Necessárias:** Formalização e aprovação da lista de atributos do produto com o Product Owner/Professor.
- **Próxima Ação:** Atualizar o corpo da Issue `SUB-01` com os atributos confirmados e colher validação do revisor.

### 2. `SUB-02: [UC12][Contratos] Criar DTO de cadastro de produto`
- **Justificativa Técnica:** Estabelece a fronteira externa de entrada e saída de dados. Desbloqueia o desenvolvimento desacoplado do Controller (`SUB-06`) e o alinhamento com a camada de transporte.
- **Responsável:** `Carla Mendes Ferreira` (com revisão de `Diego`).
- **Condições Necessárias:** Alinhamento direto com a lista de atributos de `SUB-01`.
- **Próxima Ação:** Registrar a especificação dos DTOs (`CreateProductDto` e `ProductResponseDto`) na Issue `SUB-02`.

### 3. `SUB-03: [UC12][Validação] Implementar validações de dados e regras de negócio do produto`
- **Justificativa Técnica:** Garante o cumprimento do critério de aceite crítico `CA03` (não persistência de dados inválidos).
- **Responsável:** `Bruno Oliveira Santos` (com revisão de `Ana Clara`).
- **Condições Necessárias:** Definição objetiva dos limites de dados aceitos para `RN01` e `RN02`.
- **Próxima Ação:** Estruturar tabela de casos de teste de validação e registrá-la na Issue `SUB-03`.

---

## 7.4 Sequência Inicial de Desenvolvimento (Ondas de Execução)

A sequência não impõe uma cascata cega, mas organiza o trabalho em 4 ondas orientadas a contratos e desacoplamento:

```
[ Onda 1: Contratos e Domínio ] ---> [ Onda 2: Infra e Validação ] ---> [ Onda 3: Orquestração e API ] ---> [ Onda 4: E2E e Docs ]
  SUB-01 (Entidade)                    SUB-04 (Repositório)              SUB-05 (Serviço Aplicação)        SUB-07 (Testes E2E)
  SUB-02 (DTOs)                        SUB-03 (Regras Negócio)           SUB-06 (Controller HTTP)          SUB-08 (OpenAPI Docs)
```

1. **Onda 1 — Contratos e Domínio (Foco Imediato de Esclarecimento e Preparação):**
   - Atividades: `SUB-01` e `SUB-02`.
   - Dinâmica: Execução paralela por Ana Clara e Carla após a Reunião Técnica de Coordenação.
2. **Onda 2 — Infraestrutura de Persistência e Regras de Negócio:**
   - Atividades: `SUB-04` e `SUB-03`.
   - Dinâmica: Bruno implementa primeiramente o mapeamento e interface do repositório (`SUB-04`) e em seguida as validações (`SUB-03`), mantendo seu WIP individual em 1. Concomitantemente, Diego inicia os testes unitários preliminares (`SUB-07` parcial).
3. **Onda 3 — Orquestração de Aplicação e Exposição HTTP:**
   - Atividades: `SUB-05` e `SUB-06`.
   - Dinâmica: Ana Clara implementa o `ProductService` utilizando dublês de teste/mocks da interface do repositório. Carla desenvolve o `ProductController` e os pipes de validação.
4. **Onda 4 — Verificação de Integração de Sistema e Fechamento:**
   - Atividades: `SUB-07` (Parte E2E com Supertest) e `SUB-08` (Documentação Swagger).
   - Dinâmica: Diego valida todos os fluxos (`CA01` a `CA04`) contra o ambiente de testes integrado e finaliza a documentação técnica da API.

---

## 7.5 Dependências Críticas da Estratégia

- **Dependência de Decisão (Requisitos):** A especificação formal dos atributos do produto e das regras de negócio é pré-requisito indispensável para mover qualquer Issue para `Ready`.
- **Dependência de Contrato:** `SUB-04`, `SUB-05` e `SUB-06` dependem apenas de interfaces TypeScript (`IProductRepository`, DTOs) para iniciar, permitindo desacoplar a codificação da persistência física no banco.
- **Dependência de Integração:** `SUB-07` (E2E) é a única atividade que depende estritamente da conclusão de todos os componentes integrados no módulo do NestJS.

---

## 7.6 Potencial de Execução Paralela

- **Grupo 1 (`SUB-01` e `SUB-02`):** Totalmente paralelizável entre Ana Clara e Carla na Onda 1.
- **Grupo 4 (`SUB-05` e `SUB-07` Testes Unitários):** Paralelizável entre Ana Clara e Diego na Onda 3, viabilizando desenvolvimento guiado por testes (TDD).

---

## 7.7 Impedimentos e Riscos Mapeados

- **Impedimentos Confirmados:** Não existem impedimentos externos de infraestrutura no momento. O principal fator impeditivo é de natureza documental: ausência de aprovação formal dos requisitos detalhados e pendência de conclusão da revisão humana no GitHub.
- **Riscos Principais:** Risco de vazamento de erros de banco para a API (`FE01` / `CA04`) e risco de sobrecarga de Bruno caso tente executar `SUB-03` e `SUB-04` simultaneamente.

---

## 7.8 Responsabilidades e Próximas Ações por Integrante

| Integrante | Papel Funcional | Carga Alocada | Próxima Ação Imediata | Prazo Sugerido |
| :--- | :--- | :---: | :--- | :---: |
| **Ana Clara Souza** (`@anaclara-dev`) | Responsável Técnica | 4 pts (Exec) + Liderança | Conduzir discussão técnica sobre os atributos de `Product` e redigir a especificação na Issue `SUB-01`. | Reunião Técnica (D+1) |
| **Bruno Oliveira Santos** (`@bruno-oliveira`) | Desenvolvedor / Admin | 4 pts (Exec) + Admin | Revisar `SUB-01` e detalhar os limites numéricos para a validação das regras em `SUB-03`. | Reunião Técnica (D+1) |
| **Carla Mendes Ferreira** (`@carlamendes`) | Coordenadora | 3 pts (Exec) + Gestão Board | Convocar a Reunião Técnica, alinhar a estrutura de DTOs de `SUB-02` e auditar a transição de DoR no Board. | Reunião Técnica (D+1) |
| **Diego Costa Almeida** (`@diego-almeida`) | Desenvolvedor / Qualidade | 4 pts (Exec) + Testes | Revisar `SUB-02` (DTOs), preparar esqueleto da suíte de testes no Vitest e alinhar cenários de `CA01` a `CA04`. | Reunião Técnica (D+1) |

---

## 7.9 Política de Trabalho em Progresso (WIP)

- **Regra de Ouro:** $WIP = 1$ por integrante (máximo de 1 tarefa ativa em `In Progress` por pessoa).
- **Limite Global no Board:** Máximo de 3 tarefas simultâneas em `In Progress` e no máximo 2 em `In Review`.
- **Transição de Estados:** Uma nova tarefa só é puxada quando a anterior for entregue para revisão ou concluída.

---

## 7.10 Acompanhamento no GitHub Project

A governança do projeto será acompanhada estritamente pelo fluxo de estados no board Kanban:
- **`Backlog`:** Todas as 8 Sub-Issues permanecem aqui até a Reunião Técnica e saneamento das pendências.
- **`Ready`:** Apenas Issues com 100% dos critérios `DoR-01` a `DoR-07` atendidos e comentários de revisão humana publicados serão movidas para cá.
- **`In Progress`:** Ativado somente no momento em que um desenvolvedor iniciar fisicamente a criação da branch e a escrita do código (respeitando o limite de WIP).
- **`In Review`:** Ativado quando o Pull Request for aberto e estiver aguardando aprovação do revisor designado.
- **`Done`:** Ativado após merge na branch principal, comprovação dos critérios de aceite nos testes automatizados e fechamento formal da Issue.

---

## 7.11 Tabela Consolidada de Próximas Ações

| Ordem de Atenção | Issue / Item | Ação Concreta a Executar | Responsável | Dependência Prévia | Resultado Esperado | Condição para Prosseguir para Implementação |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Reunião Técnica** | Realizar alinhamento da equipe com a pauta do Artefato 06. | Todos os integrantes | Pauta do Artefato 06 | Consenso da equipe e ata preenchida. | Aprovação mútua dos integrantes. |
| **2** | `SUB-01` | Atualizar descrição com atributos confirmados e postar revisão humana. | Ana Clara (Exec) / Bruno (Rev) | Reunião Técnica | Issue refinada e critérios `DoR-01` a `DoR-07` atendidos. | Mover para `Ready` no Project. |
| **3** | `SUB-02` | Atualizar descrição com schemas de DTOs e postar revisão humana. | Carla (Exec) / Diego (Rev) | Alinhamento com `SUB-01` | Issue refinada e DoR atendida. | Mover para `Ready` no Project. |
| **4** | `SUB-03` | Especificar limites de `RN01` e `RN02` e camada de validação. | Bruno (Exec) / Ana Clara (Rev) | `SUB-01` e `SUB-02` definidos | Regras formalmente testáveis. | Mover para `Ready` no Project. |
| **5** | `SUB-04` | Definir interface `IProductRepository` e mapeamento TypeORM. | Bruno (Exec) / Ana Clara (Rev) | `SUB-01` refinada | Contrato de banco pronto para o Service. | Mover para `Ready` após conclusão de Onda 1. |
| **6** | `SUB-05` | Desenvolver lógica de negócio e orquestração do caso de uso. | Ana Clara (Exec) / Carla (Rev) | Contratos de `SUB-01` a `SUB-04` | Caso de uso implementado com mocks. | Mover para `Ready` na Onda 3. |
| **7** | `SUB-06` | Implementar rota POST, pipes e mapeamento de exceções HTTP. | Carla (Exec) / Diego (Rev) | `SUB-02` e contrato de `SUB-05` | API consumível via HTTP. | Mover para `Ready` na Onda 3. |
| **8** | `SUB-07` | Implementar suíte de testes unitários e E2E com Vitest/Supertest. | Diego (Exec) / Bruno (Rev) | Componentes de `SUB-01` a `SUB-06` | Comprovação formal de `CA01` a `CA04`. | Suíte 100% aprovada no pipeline. |
| **9** | `SUB-08` | Documentar contratos OpenAPI/Swagger e guia de consumo. | Diego (Exec) / Carla (Rev) | `SUB-02` e `SUB-06` finalizados | Documentação da API atualizada. | Revisão da Coordenadora aprovada. |

---

## 7.12 Comentário Consolidado Pronto para Publicação na Issue Principal (`EPIC-UC12`)

O texto a seguir deve ser copiado e publicado como comentário na Issue principal `[UC12] Cadastrar Produto` para oficializar a estratégia perante toda a equipe:

```markdown
## 📋 Estratégia Inicial de Execução e Priorização do Desenvolvimento (Etapa 3)

A equipe realizou o planejamento operacional da implementação do caso de uso **UC12 — Cadastrar Produto**, estabelecendo as seguintes diretrizes de governança técnica:

### 1. Foco Imediato de Atenção
- **Atividades Prioritárias:** `SUB-01` (Entidade `Product`) e `SUB-02` (DTOs de Entrada/Saída).
- **Justificativa:** São os componentes definidores de contrato. Sua estabilização inicial desbloqueia as camadas de persistência (`SUB-04`), validação (`SUB-03`), controllers (`SUB-06`) e testes (`SUB-07`), evitando retrabalho em cascata.

### 2. Estrutura de Execução em Ondas e Paralelismo
- **Onda 1 (Contratos e Domínio):** `SUB-01` (@anaclara-dev) e `SUB-02` (@carlamendes) em paralelo.
- **Onda 2 (Persistência e Regras):** `SUB-04` e `SUB-03` sequenciadas por @bruno-oliveira, com início concomitante de testes unitários por @diego-almeida.
- **Onda 3 (Aplicação e API):** `SUB-05` (Serviço por @anaclara-dev) e `SUB-06` (Controller por @carlamendes).
- **Onda 4 (Verificação e Docs):** Testes E2E (`SUB-07`) e Swagger (`SUB-08`) conduzidos por @diego-almeida.

### 3. Governança, Limite de WIP e Definition of Ready
- **Limite de WIP:** Estritamente **1 tarefa ativa por integrante** ($WIP = 1$) e no máximo 3 simultâneas no board em `In Progress`.
- **Situação no Board:** Todas as 8 Sub-Issues permanecem em `Backlog` até que as pendências de especificação sejam sanadas e a revisão cruzada humana seja concluída na Reunião Técnica de Coordenação.
- **Próximo Marco:** Realização da Reunião Técnica de Coordenação para aprovar a lista de atributos da entidade e limites numéricos das regras de negócio.
```

