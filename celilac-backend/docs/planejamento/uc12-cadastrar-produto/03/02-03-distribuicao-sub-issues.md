# Artefato 03 — Matriz de Distribuição das Sub-Issues e Revisão Cruzada

## 1. Visão Geral e Critérios de Alocação

Este artefato estabelece a distribuição técnica e a governança de execução das 6 Sub-Issues planejadas para o caso de uso **UC12 — Cadastrar Produto**.

A alocação foi construída com base em três pilares fundamentais de Engenharia de Software:
1. **Segregação Rigorosa de Funções:** Em 100% das Sub-Issues, o Revisor de Planejamento (*Reviewer*) é obrigatoriamente um integrante diferente do Responsável pela Execução (*Assignee*), garantindo independência técnica na validação de escopo e critérios de aceite.
2. **Equilíbrio de Carga de Trabalho:** A carga foi equalizada entre os 3 integrantes (2 Sub-Issues por integrante), balanceando os níveis de complexidade técnica (Baixa, Média e Alta).
3. **Respeito ao Caminho Crítico e Precedências:** Considerou-se o fluxo de dependências técnicas para que as tarefas iniciais e desbloqueadoras sejam conduzidas sem gerar ociosidade ou gargalos operacionais.

---

## 2. Matriz Completa de Distribuição das Sub-Issues

| Identificador | Título da Atividade | Complexidade Técnica | Dependências Técnicas | Responsável (Assignee) | Revisor Designado (Reviewer) | Status Atual Informado | Status Recomendado no Board | Justificativa Técnica da Atribuição |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **SUB-01** | Modelar a Entidade de Domínio `Product` e Invariantes | **Média** | *Nenhuma* | **Ana Silva**<br>(`@anasilva-dev`) | **Bruno Souza**<br>(`@brunosouza-tech`) | `Ready` | `Backlog` *(aguarda validação de revisão)* | Atribuída à líder técnica devido à necessidade de encapsulamento seguro das regras de negócio do produto (RN01 a RN03). A revisão é delegada a Bruno para certificar compatibilidade com a modelagem do banco. |
| **SUB-02** | Implementar DTOs de Entrada e Saída com Validações de Contrato | **Baixa** | *Nenhuma* | **Carla Mendes**<br>(`@carlamendes-qa`) | **Ana Silva**<br>(`@anasilva-dev`) | `Ready` | `Backlog` *(aguarda validação de revisão)* | Atribuída à especialista em QA para assegurar regras estritas de validação sintática (`class-validator`) nos payloads HTTP. A revisão cabe à Tech Lead para assegurar alinhamento aos tipos do domínio. |
| **SUB-03** | Configurar Persistência, Schema de Banco e Repositório de Produtos | **Média** | `SUB-01` | **Bruno Souza**<br>(`@brunosouza-tech`) | **Carla Mendes**<br>(`@carlamendes-qa`) | `Backlog` | `Backlog` *(aguarda SUB-01 e revisão)* | Atribuída a Bruno por seu domínio em PostgreSQL, migrações TypeORM e repositórios. Revisão por Carla para garantir que a interface do repositório permita mocks e testes de integração isolados. |
| **SUB-04** | Implementar o Serviço de Aplicação para Cadastro de Produto | **Alta** | `SUB-01`, `SUB-02`, `SUB-03` | **Ana Silva**<br>(`@anasilva-dev`) | **Bruno Souza**<br>(`@brunosouza-tech`) | `Backlog` | `Backlog` *(aguarda pré-requisitos e revisão)* | É o núcleo de orquestração do caso de uso e ponto de convergência técnica. Conduzida pela Tech Lead para assegurar atomicidade e integridade. Bruno revisa a integração dos fluxos de dados com a persistência. |
| **SUB-05** | Implementar o Controlador HTTP e Rota `POST /products` | **Média** | `SUB-02`, `SUB-04` | **Bruno Souza**<br>(`@brunosouza-tech`) | **Carla Mendes**<br>(`@carlamendes-qa`) | `Backlog` | `Backlog` *(aguarda pré-requisitos e revisão)* | Conduzida por Bruno para configurar rotas NestJS, pipes e documentação Swagger da API. Carla atua como revisora para validar os códigos de retorno HTTP (201, 400, 500) e os contratos da API. |
| **SUB-06** | Implementar Suíte Completa de Testes Automatizados (Unitários e E2E) | **Alta** | `SUB-01` a `SUB-05` | **Carla Mendes**<br>(`@carlamendes-qa`) | **Ana Silva**<br>(`@anasilva-dev`) | `Backlog` | `Backlog` *(aguarda implementação e revisão)* | Atribuída à especialista em QA para cobrir a esteira integrada de testes E2E com Vitest e Supertest. Ana revisa para certificar que todos os cenários de borda e invariantes de negócio foram contemplados. |

---

## 3. Análise de Equilíbrio da Carga de Trabalho

| Integrante | Quantidade de Sub-Issues (Assignee) | Sub-Issues Atribuídas | Soma de Complexidade Ponderada | Quantidade de Revisões Designadas | Sub-Issues sob Revisão |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Ana Silva** (`@anasilva-dev`) | 2 | `SUB-01` (Média), `SUB-04` (Alta) | 1 Média + 1 Alta | 2 | `SUB-02`, `SUB-06` |
| **Bruno Souza** (`@brunosouza-tech`) | 2 | `SUB-03` (Média), `SUB-05` (Média) | 2 Médias | 2 | `SUB-01`, `SUB-04` |
| **Carla Mendes** (`@carlamendes-qa`) | 2 | `SUB-02` (Baixa), `SUB-06` (Alta) | 1 Baixa + 1 Alta | 2 | `SUB-03`, `SUB-05` |
| **Total Consolidado** | **6** | — | **1 Baixa, 3 Médias, 2 Altas** | **6** | — |

*Observação de Balanceamento:* Cada membro possui exatamente 2 Sub-Issues sob desenvolvimento direto e 2 Sub-Issues sob sua responsabilidade de revisão cruzada, resultando em equidade técnica e dedicação balanceada de esforço ao longo da sprint.

---

## 4. Ordem Cronológica de Execução e Liberação de Bloqueios

```text
FASE 1: Início Paralelo Desacoplado
  ├── [SUB-01] Entidade Product (Ana)  ──► [Revisor: Bruno]
  └── [SUB-02] DTOs de Entrada (Carla) ──► [Revisora: Ana]

FASE 2: Persistência Relacional
  └── [SUB-03] Migration & Repositório (Bruno) [Depende de SUB-01] ──► [Revisora: Carla]

FASE 3: Orquestração Central da Regra de Negócio
  └── [SUB-04] Serviço de Aplicação (Ana) [Depende de SUB-01, SUB-02, SUB-03] ──► [Revisor: Bruno]

FASE 4: Exposição e Transporte Web
  └── [SUB-05] Controller & Swagger (Bruno) [Depende de SUB-02, SUB-04] ──► [Revisora: Carla]

FASE 5: Cobertura Integrada e Homologação
  └── [SUB-06] Suíte de Testes E2E (Carla) [Depende de SUB-01 a SUB-05] ──► [Revisora: Ana]
```

---

## 5. Justificativa Técnica para Manutenção Inicial em Backlog

Embora na etapa anterior `SUB-01` e `SUB-02` tenham sido sugeridas no status `Ready` em razão da ausência de dependências técnicas de código, **sob a ótica formal da Engenharia de Software e da Definition of Ready (DoR), nenhuma Issue pode ingressar no estado `Ready` antes da conclusão formal da revisão humana cruzada**.

Portanto, todas as 6 Sub-Issues iniciam formalmente nesta etapa no status **`Backlog`**, até que os revisores designados publiquem seus pareceres e confirmem a prontidão das especificações.

