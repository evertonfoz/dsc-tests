# ARTEFATO 01 — MATRIZ DE PRIORIZAÇÃO TÉCNICA

> **Aviso de Rastreabilidade e Governança:**
> - **Caso de Uso:** `UC12 — Cadastrar Produto` (Backend CeliLac: NestJS, TypeORM, PostgreSQL, Vitest, Supertest).
> - **Natureza dos Dados de Equipe:** Os integrantes alocados (`Ana Clara`, `Bruno`, `Carla` e `Diego`) são **provisórios e simulados** para fins didáticos, devendo ser confirmados pelos estudantes antes do registro oficial no GitHub.
> - **Estado no GitHub:** Nenhuma label de prioridade foi alterada compulsoriamente no repositório; as avaliações abaixo constituem recomendações técnicas fundamentadas para validação pela equipe.

---

## 1.1 Critérios e Fatores de Priorização

A priorização técnica não deve ser confundida com a ordem cronológica estrita de codificação nem com a numeração sequencial das Issues (`SUB-01` a `SUB-08`). Para estabelecer a relevância de cada atividade, foram ponderados seis fatores:

1. **Dependências (Geração de Desbloqueio):** Avalia se a atividade fornece definições, interfaces, contratos ou componentes pré-requisitos para outras tarefas.
2. **Valor para a Implementação:** Avalia a contribuição direta para viabilizar as regras de negócio e os fluxos centrais do caso de uso (`UC12`).
3. **Risco Técnico:** Incertezas conceituais, ausência de contratos formalizados ou risco de retrabalho em cascata caso a atividade seja mal definida.
4. **Complexidade Técnica:** Grau de esforço cognitivo e extensão da implementação (Baixa = Peso 1, Média = Peso 2, Alta = Peso 3).
5. **Disponibilidade e Competência do Responsável:** Alinhamento entre as habilidades do executor e a carga horária semanal declarada (Alta: 8h/sem; Média: 6h/sem).
6. **Impacto sobre Outras Tarefas:** Potencial de mitigar bloqueios em tarefas subsequentes ou possibilitar paralelismo.

---

## 1.2 Distinção Conceitual de Prioridades

Para evitar equívocos operacionais comuns na gestão de projetos ágeis, distinguem-se três conceitos:

- **Prioridade de Atenção (Refinamento / Governança):** Atividades que exigem esclarecimento conceitual imediato da equipe e do Product Owner antes de qualquer esforço de código (ex.: saneamento de pendências de especificação em `SUB-01`, `SUB-02` e `SUB-03`).
- **Prioridade de Execução (Valor Arquitetural):** Relevância intrínseca da entrega para o funcionamento do sistema (ex.: o serviço de aplicação `SUB-05` possui valor altíssimo para o caso de uso, mas não pode ser o primeiro executado).
- **Ordem Inicial de Execução (Sequenciamento Lógico):** Sequência temporal viável de desenvolvimento, orientada pela liberação de contratos e dependências técnicas.

---

## 1.3 Matriz de Priorização Técnica das Sub-Issues

| Identificador | Título da Sub-Issue | Prioridade Atual (Labels Etapa 1) | Dependências Relevantes | Valor para a Implementação | Risco Técnico | Complexidade Estimada | Disponibilidade do Responsável | Impacto sobre Outras Atividades | Prioridade Recomendada | Justificativa Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SUB-01** | `[Domínio] Modelar entidade Product` | `priority: high` | Nenhuma estrutural *(requer confirmação dos atributos de produto)* | **Alto** (Base estrutural do domínio) | **Médio** (Risco de retrabalho no banco caso atributos mudem) | **Baixa** (Peso 1) | **Alta** (Ana Clara, 8h/sem) | **Crítico** (Desbloqueia repositório, serviço e testes) | **Alta** *(Foco imediato de atenção)* | Fornece a identidade e as propriedades do núcleo de domínio. Sua definição de contrato desbloqueia o repositório (`SUB-04`) e as validações (`SUB-03`). |
| **SUB-02** | `[Contratos] Criar DTO de cadastro de produto` | `priority: medium` | Nenhuma estrutural *(relação contextual com SUB-01)* | **Alto** (Define a interface pública de entrada/saída) | **Médio** (Contrato HTTP instável impacta controller e validação) | **Baixa** (Peso 1) | **Média** (Carla, 6h/sem) | **Crítico** (Desbloqueia DTOs de validação, controller e testes) | **Alta** *(Foco imediato de atenção)* | Recomenda-se elevar a prioridade de atenção de `medium` para `high` porque o DTO define o contrato de entrada do caso de uso, viabilizando o paralelismo do Controller (`SUB-06`) e testes de contrato. |
| **SUB-03** | `[Validação] Implementar validações de dados e regras do produto` | `priority: high` | `SUB-01`, `SUB-02` (Contratos de dados e limites) | **Alto** (Garante integridade de regras RN01 a RN04) | **Alto** (Regras RN01 e RN02 precisam de critérios numéricos formais) | **Média** (Peso 2) | **Alta** (Bruno, 8h/sem) | **Alto** (Desbloqueia fluxos de exceção no Service e Controller) | **Alta** *(Foco de atenção prévia)* | As regras de negócio são essenciais para evitar persistência de dados inválidos (Critério `CA03`). Requer atenção inicial para formalizar critérios ambíguos de validação. |
| **SUB-04** | `[Persistência] Configurar persistência e repositório de produtos` | `priority: medium` | `SUB-01` (Entidade mapeada no TypeORM) | **Médio-Alto** (Garante isolamento de I/O e persistência no PostgreSQL) | **Médio** (Mapeamento ORM e integridade relacional) | **Média** (Peso 2) | **Alta** (Bruno, 8h/sem) | **Médio** (Desbloqueia a persistência real do Service SUB-05) | **Média** *(Mantida)* | Depende da entidade `Product` (`SUB-01`). Pode ser desenvolvida assim que a interface do repositório for estipulada, sem necessidade de esperar o Service. |
| **SUB-05** | `[Aplicação] Implementar serviço de aplicação para cadastro de produto` | `priority: high` | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04` (Contratos de domínio, DTO, regras e repo) | **Crítico** (Coração da lógica da aplicação e orquestração) | **Médio** (Complexidade de orquestração e tratamento de erros) | **Alta** (Peso 3) | **Alta** (Ana Clara, 8h/sem) | **Crítico** (Viabiliza o caso de uso e integração com Controller) | **Alta** *(Prioridade máxima de execução)* | É o componente central do caso de uso. Possui alta prioridade de execução, mas não deve iniciar antes da estabilização dos contratos dos seus colaboradores (`SUB-01` a `SUB-04`). |
| **SUB-06** | `[HTTP] Criar endpoint POST /products` | `priority: medium` | `SUB-02` (DTO de entrada), `SUB-05` (Serviço de aplicação) | **Médio** (Porta de entrada HTTP e adaptação REST) | **Baixo** (Padrão claro de Controller no NestJS) | **Média** (Peso 2) | **Média** (Carla, 6h/sem) | **Médio** (Desbloqueia testes E2E e documentação Swagger) | **Média** *(Mantida)* | Atua como camada de transporte (Controller). Pode ter seu esqueleto e validação de DTO iniciados após `SUB-02`, integrando com `SUB-05` posteriormente. |
| **SUB-07** | `[Testes] Implementar testes automatizados para o cadastro` | `priority: high` | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-05`, `SUB-06` | **Crítico** (Comprova os Critérios de Aceite CA01 a CA04) | **Médio** (Necessidade de mocks de repositório e ambiente Supertest) | **Alta** (Peso 3) | **Média** (Diego, 6h/sem) | **Alto** (Garante cobertura de regressão e prontidão para Done) | **Alta** *(Prioridade contínua e progressiva)* | Não deve ser tratada como atividade de fim de cascata. Seus testes unitários e de validação devem acompanhar a entrega de cada contrato, concluindo com E2E ao final. |
| **SUB-08** | `[Documentação] Atualizar documentação técnica do cadastro` | `priority: low` | `SUB-02`, `SUB-06` (Contratos e endpoints fechados) | **Baixo** (Documentação de consumo da API Swagger / README) | **Baixo** (Baixo risco técnico de implementação) | **Baixa** (Peso 1) | **Média** (Diego, 6h/sem) | **Baixo** (Consumo final da solução) | **Baixa** *(Mantida)* | Atividade de consolidação e fechamento. Não bloqueia o desenvolvimento dos componentes de negócio. |

---

## 1.4 Análise Crítica: Atividades que Merecem Atenção Imediata

Ao analisar a matriz, identifica-se que **a ordem de atenção inicial da equipe deve recair prioritariamente sobre `SUB-01`, `SUB-02` e `SUB-03`**, pelas seguintes razões técnicas:

1. **Desbloqueio de Contratos Fundamentais:** `SUB-01` (Entidade `Product`) e `SUB-02` (DTOs) são definidoras dos esquemas de dados compartilhados por todas as outras 6 Sub-Issues. Se seus atributos, tipos e restrições não forem estabilizados previamente, qualquer codificação em repositório (`SUB-04`), serviço (`SUB-05`), controller (`SUB-06`) ou testes (`SUB-07`) incorrerá em alto risco de retrabalho (*cascading refactoring*).
2. **Resolução de Ambiguidade de Regras:** `SUB-03` carrega o maior risco conceitual do caso de uso, pois as regras `RN01` (limites de caracteres e formato) e `RN02` (regras específicas de preço/unidade) apresentaram pendências na revisão cruzada. Formalizar seus critérios de validação antes de codificar o serviço garante que o comportamento de rejeição (`CA02`) e não persistência (`CA03`) seja testável e preciso.
3. **Desacoplamento entre Alta Prioridade de Valor e Sequência:** Embora `SUB-05` (Serviço de Aplicação) e `SUB-07` (Testes de Aceite) possuam o maior valor final para o negócio, elas representam componentes de convergência que dependem dos contratos gerados por `SUB-01` e `SUB-02`. Portanto, a equipe deve concentrar sua atenção e refinamento inicial nos contratos de entrada e domínio para viabilizar um fluxo contínuo de implementação.

