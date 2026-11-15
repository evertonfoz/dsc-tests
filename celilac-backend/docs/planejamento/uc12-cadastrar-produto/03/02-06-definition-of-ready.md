# Artefato 06 — Aplicação da Definition of Ready (DoR)

## 1. Conceito e Regras da Definition of Ready (DoR)

A **Definition of Ready (DoR)** estabelece o patamar mínimo de qualidade, maturidade técnica e consenso exigido para que uma Sub-Issue seja promovida do estado de planejamento (**`Backlog`**) para o estado de aptidão para desenvolvimento (**`Ready`**).

### Regras Mandatórias de Engenharia:
1. **Atendimento Cumulativo:** Uma Sub-Issue **somente** é promovida para `Ready` se cumprir simultaneamente **todos os 7 critérios** estabelecidos.
2. **Impedimento pela Revisão Humana (DoR-07):** A realização da pré-análise automatizada não encerra o critério DoR-07. Enquanto o colega revisor não publicar no GitHub o comentário formal de aprovação da Issue, o critério DoR-07 permanece como `Não atende (Pendente de revisão humana)`, retendo a atividade em `Backlog`.
3. **Dependências Não Implementadas:** Uma dependência técnica de código ainda não implementada (ex.: banco ainda não criado) não impede o status `Ready` em nível de especificação, desde que as interfaces, contratos e regras estejam totalmente especificados e prontos para codificação quando a precedência for liberada.

---

## 2. Critérios Formais da Definition of Ready

| Código | Critério Formal | Descrição e Verificação |
| :---: | :--- | :--- |
| **DoR-01** | **Objetivo claramente definido** | O propósito técnico e funcional da atividade é inequívoco e compreendido por todos. |
| **DoR-02** | **Escopo delimitado** | As fronteiras do trabalho estão explícitas (o que está dentro e o que está fora do escopo da tarefa). |
| **DoR-03** | **Critérios de aceite verificáveis** | Critérios objetivos, binários e passíveis de verificação direta por testes automatizados ou inspeção. |
| **DoR-04** | **Dependências identificadas** | Pré-requisitos técnicos, predecessores imediatos e ordem de precedência estão totalmente mapeados. |
| **DoR-05** | **Informações disponíveis** | Contratos de interface, DTOs, schemas de banco ou definições de tipos necessários estão acessíveis. |
| **DoR-06** | **Responsável definido** | Há um desenvolvedor (*Assignee*) formalmente atribuído e com disponibilidade declarada. |
| **DoR-07** | **Revisão concluída** | A revisão cruzada humana foi realizada, os ajustes foram aplicados no corpo da Issue e o registro formal foi feito no GitHub. |

---

## 3. Avaliação Detalhada por Sub-Issue

### 3.1 Tabela Consolidada de Avaliação dos 7 Critérios

| Sub-Issue | DoR-01<br>(Objetivo) | DoR-02<br>(Escopo) | DoR-03<br>(Critérios) | DoR-04<br>(Dependências) | DoR-05<br>(Informações) | DoR-06<br>(Responsável) | DoR-07<br>(Revisão Humana) | Resultado Consolidado |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **SUB-01** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@anasilva-dev`) | **Não atende**<br>*(Aguardando `@brunosouza-tech`)* | **Não Pronta (Backlog)** |
| **SUB-02** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@carlamendes-qa`) | **Não atende**<br>*(Aguardando `@anasilva-dev`)* | **Não Pronta (Backlog)** |
| **SUB-03** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@brunosouza-tech`) | **Não atende**<br>*(Aguardando `@carlamendes-qa`)* | **Não Pronta (Backlog)** |
| **SUB-04** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@anasilva-dev`) | **Não atende**<br>*(Aguardando `@brunosouza-tech`)* | **Não Pronta (Backlog)** |
| **SUB-05** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@brunosouza-tech`) | **Não atende**<br>*(Aguardando `@carlamendes-qa`)* | **Não Pronta (Backlog)** |
| **SUB-06** | Atende | Atende | Atende | Atende | Atende | **Atende**<br>(`@carlamendes-qa`) | **Não atende**<br>*(Aguardando `@anasilva-dev`)* | **Não Pronta (Backlog)** |

---

## 4. Diagnóstico Individual e Pendências de Prontidão

### Sub-Issue [SUB-01]: Modelar a Entidade de Domínio `Product` e Invariantes
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. O revisor `@brunosouza-tech` deve validar a especificação no GitHub e assinar o comentário de aprovação.
  2. Aplicar no corpo da Issue o refinamento do Factory Method e limite mínimo de tamanho do nome.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana)*.

### Sub-Issue [SUB-02]: Implementar DTOs de Entrada e Saída com Validações de Contrato
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. A revisora `@anasilva-dev` deve validar os decorators no GitHub e registrar seu parecer formal.
  2. Ajustar a descrição com decorators `@Transform` (trim) e `@MaxLength(150)`.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana)*.

### Sub-Issue [SUB-03]: Configurar Persistência, Schema de Banco e Repositório de Produtos
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. A revisora `@carlamendes-qa` deve homologar o parecer no GitHub.
  2. Formalizar na descrição a estratégia de conversão do tipo numérico PostgreSQL (`decimal`) para evitar divergências de tipo em tempo de execução.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana e SUB-01)*.

### Sub-Issue [SUB-04]: Implementar o Serviço de Aplicação para Cadastro de Produto
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. O revisor `@brunosouza-tech` deve validar e registrar aprovação da especificação de serviço.
  2. Alinhar a taxonomia das exceções de aplicação e garantia de não-persistência em caso de erro.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana e SUB-01/02/03)*.

### Sub-Issue [SUB-05]: Implementar o Controlador HTTP e Rota `POST /products`
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. A revisora `@carlamendes-qa` deve registrar parecer na Issue.
  2. Deixar documentada a política de permissão pública temporária da rota REST e documentação Swagger.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana e SUB-02/04)*.

### Sub-Issue [SUB-06]: Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
- **Avaliação Geral:** 6 critérios atendidos (DoR-01 a DoR-06); 1 critério pendente (DoR-07).
- **Pendência Específica para Liberação:**
  1. A revisora `@anasilva-dev` deve validar a estratégia de testes e assinar aprovação no GitHub.
  2. Definir explicitamente na descrição a rotina de limpeza de banco relacional (`TRUNCATE`) para execução dos testes E2E com Vitest.
- **Status Recomendado no GitHub Project:** **`Backlog`** *(Aguardando Revisão Humana e conclusão funcional)*.

---

## 5. Roteiro para Promoção de Sub-Issues para o Estado `Ready`

Assim que o revisor designado de cada Sub-Issue publicar o comentário formal de aprovação (usando o template do Artefato 05):
1. O critério **DoR-07** passará para `Atende`.
2. A Sub-Issue completará cumulativamente os 7 critérios da DoR.
3. O integrante responsável ou o coordenador poderá arrastar o cartão da atividade da coluna **`Backlog`** para a coluna **`Ready`** no GitHub Project (Board).
4. Sub-Issues sem dependências bloqueantes imediatas (`SUB-01` e `SUB-02`) tornam-se as primeiras candidatas para início do desenvolvimento (`In Progress`).

