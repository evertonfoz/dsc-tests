# ARTEFATO 04 — REGISTRO DE IMPEDIMENTOS E GARGALOS

> **Aviso de Rastreabilidade e Governança:**
> - **Caso de Uso:** `UC12 — Cadastrar Produto` (Backend CeliLac).
> - **Rigor de Governança:** Não classificar automaticamente toda dependência como impedimento.
> - **Classificações Válidas:** `Impedimento confirmado`, `Risco identificado`, `Pendência de decisão`, `Dependência controlada`, `Situação hipotética`.
> - **Natureza dos Dados:** Distinção explícita entre itens reais originados da revisão cruzada e exemplos puramente didáticos.

---

## 4.1 Distinção Conceitual Obrigatória

Para uma gestão operacional precisa no GitHub, estabelece-se a distinção entre quatro conceitos frequentemente confundidos:

- **Dependência:** Relação técnica natural e esperada entre componentes ou definições da arquitetura (ex.: o Repositório depende da Entidade). Por si só, **não constitui problema**, desde que haja planejamento para seu atendimento.
- **Impedimento:** Condição concreta, externa ou interna, que **está atualmente bloqueando o início ou a continuidade** do trabalho em uma tarefa que já deveria estar em andamento ou pronta para execução.
- **Risco:** Evento ou incerteza futura que, caso se materialize, provocará impactos adversos em custo, prazo, qualidade ou escopo (ex.: possibilidade de refatoração se o contrato do banco mudar).
- **Gargalo:** Ponto de restrição de capacidade operacional no fluxo que limita a vazão (*throughput*) de todo o time (ex.: um único integrante concentrar todas as tarefas críticas ou revisões de código).

---

## 4.2 Matriz de Análise de Impedimentos, Riscos e Gargalos

| Issue Afetada | Problema Identificado | Classificação | Evidência Disponível | Impacto Técnico no Projeto | Decisão ou Informação Necessária | Responsável pela Resolução | Próxima Ação Recomendada | Situação Atual |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SUB-01** e **SUB-02** | Atributos e tipos detalhados do produto não constam de forma exaustiva no documento do caso de uso. | **Pendência de Decisão** *(Bloqueante para Ready)* | Relatório de Revisão Cruzada (`Artefato 04` da Etapa 2) e avaliação DoR-05. | Risco de modelar a entidade `Product` e o DTO de forma divergente dos requisitos da aplicação de produção. | Validação pelo Product Owner / Professor da lista formal de atributos (ex.: `name`, `sku`, `price`, `description`, etc.). | `Ana Clara` (Resp. Técnica) e `Carla` (Coordenadora) | Apresentar proposta de atributos na Reunião de Coordenação e validar com o PO. | **Aberta** *(Aguardando alinhamento)* |
| **SUB-03** | Critérios numéricos e de formatação das regras `RN01` e `RN02` estão descritos de forma genérica. | **Pendência de Decisão** *(Bloqueante para Ready)* | Apontamento na Revisão Cruzada da Etapa 2 sobre limites de strings e faixas de valores válidos. | Impossibilidade de escrever asserções determinísticas nos testes unitários e de validação (`CA02`). | Formalização dos limites: tamanho mínimo/máximo de caracteres, se preço pode ser zero, formato de SKU. | `Bruno` (Executor) e `Ana Clara` (Revisora) | Elaborar especificação técnica detalhada das regras para aprovação da equipe. | **Aberta** *(Aguardando detalhamento)* |
| **SUB-06** | Incerteza sobre padrão de retorno HTTP (`201` com header `Location` vs. body) e controle de acesso do ator (Guards/RBAC). | **Risco Identificado** | Análise técnica na revisão cruzada de `SUB-06`. | Se não padronizado, os controllers da API terão comportamentos heterogêneos e os testes E2E falharão. | Decisão arquitetural de padronização REST adotada no backend CeliLac. | `Carla` (Executora) e `Ana Clara` (Líder Técnica) | Definir padrão de resposta e registrar no comentário técnico da Issue. | **Mapeado** *(Controlável antes da codificação)* |
| **SUB-04** e **SUB-05** | Fluxo de exceção `FE01` (Falha de Persistência no Banco) sem padronização de tratamento de erro e código HTTP. | **Risco Identificado** | Exceções de banco (`TypeORMError`) vazando detalhes da base de dados para o cliente HTTP (`CA04`). | Vulnerabilidade de segurança por exposição de stack trace e violação do critério `CA04`. | Definição de `ExceptionFilter` global do NestJS ou tratamento explícito no Service. | `Ana Clara` e `Bruno` | Definir padrão de exceção de infraestrutura e converter em erro HTTP 500 amigável. | **Mapeado** *(Solução arquitetural conhecida)* |
| **Equipe Geral** | Bruno é responsável por `SUB-03` (Média) e `SUB-04` (Média), ambas no caminho crítico de liberação do Service `SUB-05`. | **Gargalo Operacional** | Matriz de Distribuição das Sub-Issues (`Artefato 03` da Etapa 2). | Se Bruno for alocado em ambas simultaneamente, haverá divisão de foco; se for sequencial, pode ditar o ritmo da onda 2. | Definição clara de ordem de execução interna para Bruno e política de WIP individual = 1. | `Carla` (Coordenadora) | Sequenciar Bruno primeiro em `SUB-04` (com foco na interface) e depois `SUB-03`. | **Controlado** *(Administrado pela Política de WIP)* |
| **SUB-07** | Atraso dos testes para o final da entrega do caso de uso (anti-pattern de cascata). | **Risco Identificado** | Tendência comum de concentrar testes automatizados após todos os componentes prontos. | Descoberta tardia de bugs conceituais, bloqueando o fechamento do épico às vésperas da entrega. | Adotar estratégia de testes contínuos: Diego inicia testes unitários assim que contratos existirem. | `Diego` (Qualidade) e `Carla` (Coordenação) | Estabelecer acompanhamento de testes unitários a cada entrega de Sub-Issue. | **Mitigado** *(Estratégia progressiva definida)* |

---

## 4.3 Comentários Técnicos Prontos para Publicação no GitHub

Abaixo estão os comentários objetivos preparados para publicação nas Issues afetadas para registrar as pendências reais identificadas na revisão cruzada.

### Comentário 1: Para a Issue `SUB-01` (`[UC12][Domínio] Modelar entidade Product`)

```markdown
### ⚠️ Registro de Pendência de Decisão Técnica (DoR-05)

- **Issue Afetada:** SUB-01 (`[UC12][Domínio] Modelar entidade Product`)
- **Problema:** O documento do caso de uso não lista os atributos e restrições formais da entidade `Product` (ex.: quais campos são obrigatórios, se haverá SKU, unidade de medida, categorização de glúten/lactose).
- **Impacto:** A modelagem da entidade sem esses dados consolidados provocará retrabalho em cascata no DTO (`SUB-02`), no repositório TypeORM (`SUB-04`) e nas validações (`SUB-03`).
- **Decisão Necessária:** Formalização do catálogo de atributos da entidade `Product` em conformidade com o modelo de domínio do CeliLac.
- **Responsável:** @anaclara-dev (Responsável Técnica)
- **Próxima Ação:** Pautar a aprovação da lista de atributos na Reunião Técnica de Coordenação e registrar o resultado na descrição desta Issue para liberação da Definition of Ready.
```

---

### Comentário 2: Para a Issue `SUB-03` (`[UC12][Validação] Implementar validações de dados e regras de negócio do produto`)

```markdown
### ⚠️ Registro de Pendência de Decisão Técnica (DoR-02 / DoR-05)

- **Issue Afetada:** SUB-03 (`[UC12][Validação] Implementar validações de dados e regras de negócio do produto`)
- **Problema:** As regras de negócio `RN01` (validação de dados obrigatórios e formatos) e `RN02` (critérios específicos do produto) carecem de especificações de limites objetivos (ex.: tamanho mín/máx de strings, formato de campos numéricos).
- **Impacto:** Impossibilita o fechamento de testes unitários determinísticos e compromete a garantia do critério de aceite `CA03` (não persistência de dados inválidos).
- **Decisão Necessária:** Especificação precisa dos valores limites aceitos e definição da camada de validação (DTO via `class-validator` vs. regras no núcleo de domínio).
- **Responsável:** @bruno-oliveira (Executor) com apoio de @anaclara-dev (Revisora)
- **Próxima Ação:** Registrar na Issue a tabela exata com as regras de validação e casos de borda aceitos antes de iniciar a codificação.
```

---

### Comentário 3: Exemplo Didático de Impedimento Técnico (Simulação de Ambiente)

> [!NOTE]
> **EXEMPLO DIDÁTICO — NÃO REPRESENTA IMPEDIMENTO REAL CONFIRMADO.**
> O comentário abaixo é fornecido estritamente para demonstrar a estrutura de reporte quando surgir um impedimento real externo ou de ambiente durante a implementação. **Não deve ser registrado nas Issues reais dos estudantes sem que o fato tenha ocorrido.**

```markdown
<!-- EXEMPLO DIDÁTICO — NÃO REPRESENTA IMPEDIMENTO REAL CONFIRMADO -->
### 🛑 Registro de Impedimento Técnico Confirmado (Ambiente de Testes)

- **Issue Afetada:** SUB-07 (`[UC12][Testes] Implementar testes automatizados para o cadastro de produto`)
- **Problema:** O contêiner Docker do PostgreSQL em ambiente de integração contínua (CI) não está iniciando devido a conflito de portas no runner local.
- **Impacto:** Os testes de integração E2E com Supertest estão bloqueados, impossibilitando a verificação dos critérios de aceite CA01 e CA04.
- **Decisão Necessária:** Atualizar a configuração do `docker-compose.test.yml` para alocar portas dinâmicas ou utilizar um banco em memória/schema isolado para testes.
- **Responsável:** Integrante responsável pela infraestrutura/ambiente (@bruno-oliveira)
- **Próxima Ação:** Ajustar script de inicialização do banco de testes e revalidar o pipeline de CI.
<!-- FIM DO EXEMPLO DIDÁTICO -->
```

