# Artefato 04 — Relatório de Revisão Cruzada das Issues

## 1. Visão Geral do Processo de Revisão

Este documento apresenta a análise técnica detalhada de cada uma das 6 Sub-Issues do caso de uso **UC12 — Cadastrar Produto**. 

> **Aviso Metodológico Fundamental:**
> O conteúdo deste artefato consolida uma **pré-análise técnica automatizada de engenharia de software**, projetada para orientar e subsidiar a equipe acadêmica. **Esta pré-análise NÃO substitui a revisão formal e o julgamento crítico do Revisor Humano designado**. Cabe a cada revisor validar os apontamentos no GitHub e registrar seu parecer formal.

---

## 2. Critérios de Avaliação Aplicados na Revisão

Cada Sub-Issue foi submetida ao crivo de sete dimensões técnicas:
1. **Clareza e Especificidade do Título:** O título expressa com precisão a ação técnica a ser executada?
2. **Delimitação de Objetivo e Alinhamento:** O objetivo está focado e restrito à fronteira do caso de uso?
3. **Descrição Técnica e Detalhamento de Arquivos:** Estão especificados os caminhos de arquivos e as convenções do projeto?
4. **Critérios de Aceite Verificáveis e Testáveis:** Os critérios utilizam verbos observáveis e admitem validação objetiva por testes automatizados?
5. **Rastreabilidade de Regras de Negócio e Dependências:** Há vínculo explícito com os RFs, RNs e pré-requisitos técnicos?
6. **Adequação da Taxonomia de Labels:** As labels aplicadas refletem o padrão do repositório (sem misturar status com tipo ou camada)?
7. **Suficiência Informacional:** O desenvolvedor designado dispõe de todos os insumos para iniciar a codificação sem bloqueios conceituais?

---

## 3. Matriz Sintética de Revisão Cruzada por Sub-Issue

| Identificador | Assignee | Revisor Designado | Resultado Global | Principais Apontamentos Técnicos | Situação da Revisão |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **SUB-01** | Ana Silva (`@anasilva-dev`) | Bruno Souza (`@brunosouza-tech`) | **Ajuste Recomendado** | Esclarecer a estratégia de geração do UUID (se via entidade ou banco) e limites de tamanho do atributo `name`. | Pré-análise concluída; aguardando validação por `@brunosouza-tech`. |
| **SUB-02** | Carla Mendes (`@carlamendes-qa`) | Ana Silva (`@anasilva-dev`) | **Ajuste Recomendado** | Incluir sanitização (`trim`) e limites de caracteres (`@MinLength(2)`, `@MaxLength(100)`) em `CreateProductDto`. | Pré-análise concluída; aguardando validação por `@anasilva-dev`. |
| **SUB-03** | Bruno Souza (`@brunosouza-tech`) | Carla Mendes (`@carlamendes-qa`) | **Ajuste Recomendado** | Especificar tipo SQL exato (`DECIMAL(10,2)`), tratamento do retorno de strings numéricas no TypeORM e estratégia de migração. | Pré-análise concluída; aguardando validação por `@carlamendes-qa`. |
| **SUB-04** | Ana Silva (`@anasilva-dev`) | Bruno Souza (`@brunosouza-tech`) | **Ajuste Recomendado** | Padronizar a hierarquia de exceções de domínio/aplicação e mapeamento de erros transacionais. | Pré-análise concluída; aguardando validação por `@brunosouza-tech`. |
| **SUB-05** | Bruno Souza (`@brunosouza-tech`) | Carla Mendes (`@carlamendes-qa`) | **Ajuste Recomendado** | Documentar explicitamente a política de autenticação/guarda da rota (se pública no MVP ou com guard JWT mockado). | Pré-análise concluída; aguardando validação por `@carlamendes-qa`. |
| **SUB-06** | Carla Mendes (`@carlamendes-qa`) | Ana Silva (`@anasilva-dev`) | **Ajuste Recomendado** | Especificar a estratégia de limpeza e isolamento da base de dados PostgreSQL nos testes E2E (`beforeEach` / transações). | Pré-análise concluída; aguardando validação por `@anasilva-dev`. |

---

## 4. Análise Individual Detalhada das Sub-Issues

### 4.1 Sub-Issue [SUB-01]: Modelar a Entidade de Domínio `Product` e Invariantes
- **Responsável (Assignee):** Ana Silva (`@anasilva-dev`)
- **Revisor Designado (Reviewer):** Bruno Souza (`@brunosouza-tech`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Claro e conciso; expressa o modelo central de domínio. | Manter conforme redigido. |
| **Descrição Técnica** | Ajuste Necessário | O texto menciona `id: string/UUID`, mas não explicita se a entidade gera seu próprio UUID no construtor (ex.: `crypto.randomUUID()`) ou se aceita ID pré-existente (para recriação a partir do repositório). | Incluir método de fábrica estático (`Product.create(...)`) para novas instâncias com geração de UUID e construtor direto para hidratação vinda do repositório. |
| **Critérios de Aceite** | Ajuste Necessário | Critério 2 diz "composto unicamente por espaços deve lançar erro". Falta estipular tamanho mínimo de caracteres (ex.: no mínimo 2 caracteres válidos). | Complementar o critério: "Instanciação com nome contendo menos de 2 caracteres após trim deve lançar exceção de domínio". |
| **Dependências** | Conforme | Zero dependências de código; independente. | Manter status. |
| **Labels e Prioridade** | Conforme | `layer:domain`, `type:feature`, `priority:high`. Coerentes com o plano. | Manter labels taxonômicas. |

---

### 4.2 Sub-Issue [SUB-02]: Implementar DTOs de Entrada e Saída com Validações de Contrato
- **Responsável (Assignee):** Carla Mendes (`@carlamendes-qa`)
- **Revisor Designado (Reviewer):** Ana Silva (`@anasilva-dev`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Foco claro em contratos de transferência e validação sintática. | Manter conforme redigido. |
| **Descrição Técnica** | Ajuste Necessário | Falta prever o tratamento de espaços em branco nas extremidades da string (`trim`) e delimitação superior do preço. | Adicionar decorador `@Transform(({ value }) => typeof value === 'string' ? value.trim() : value)` e `@MaxLength(150)` para o campo `name`. |
| **Critérios de Aceite** | Ajuste Necessário | O critério menciona rejeição de preço menor ou igual a zero, mas não explicita o formato de mensagem de retorno de erro para o cliente. | Adicionar critério: "A mensagem de erro retornada pelo `ValidationPipe` deve indicar claramente o campo causador e a violação cometida (ex.: 'price must be a positive number')". |
| **Dependências** | Conforme | Desacoplada e apta ao início imediato. | Manter. |
| **Labels e Prioridade** | Conforme | `layer:application`, `type:feature`, `priority:high`. | Manter labels. |

---

### 4.3 Sub-Issue [SUB-03]: Configurar Persistência, Schema de Banco e Repositório de Produtos
- **Responsável (Assignee):** Bruno Souza (`@brunosouza-tech`)
- **Revisor Designado (Reviewer):** Carla Mendes (`@carlamendes-qa`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Bem delimitado em relação à camada de infraestrutura. | Manter. |
| **Descrição Técnica** | Ajuste Necessário | O TypeORM no PostgreSQL mapeia colunas `numeric`/`decimal` para o tipo `string` em JavaScript por padrão para evitar perda de precisão flutuante. | Definir na entidade de persistência/TypeORM um `transformer` numérico ou explicitar no DTO/Entity como será convertida a representação do valor monetário. |
| **Critérios de Aceite** | Conforme | Cobertura clara de migration, método `create` e tratamento de exceções de banco. | Adicionar verificação de rollback caso a transação falhe. |
| **Dependências** | Conforme | Dependência explícita de `SUB-01` (Entidade de Domínio). | Manter em `Backlog` até conclusão de `SUB-01`. |
| **Labels e Prioridade** | Conforme | `layer:infrastructure`, `type:feature`, `priority:high`. | Manter. |

---

### 4.4 Sub-Issue [SUB-04]: Implementar o Serviço de Aplicação para Cadastro de Produto
- **Responsável (Assignee):** Ana Silva (`@anasilva-dev`)
- **Revisor Designado (Reviewer):** Bruno Souza (`@brunosouza-tech`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Foco na orquestração da regra de negócio (RN01–RN04). | Manter. |
| **Descrição Técnica** | Ajuste Necessário | O texto não especifica como as exceções de domínio serão capturadas pelo serviço para repassar à camada de apresentação sem vazamento de detalhes internos. | Definir convenção de exceções da aplicação (ex.: `DomainException` tratada por Exception Filter global do NestJS). |
| **Critérios de Aceite** | Conforme | Critérios objetivos cobrindo fluxo feliz e rejeições. | Manter. |
| **Dependências** | Conforme | Ponto de convergência: depende de `SUB-01`, `SUB-02` e `SUB-03`. | Manter status `Backlog`. |
| **Labels e Prioridade** | Conforme | `layer:application`, `type:feature`, `priority:high`. | Manter. |

---

### 4.5 Sub-Issue [SUB-05]: Implementar o Controlador HTTP e Rota `POST /products`
- **Responsável (Assignee):** Bruno Souza (`@brunosouza-tech`)
- **Revisor Designado (Reviewer):** Carla Mendes (`@carlamendes-qa`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Rota REST bem definida (`POST /products`). | Manter. |
| **Descrição Técnica** | Ajuste Necessário | Não está explícito se a rota terá segurança ativada (Guards de autenticação) de imediato ou se permanecerá aberta neste momento acadêmico. | Documentar na descrição: "Nesta etapa do UC12, a rota funcionará em modo público/aberto, com ponto de extensão documentado para aplicação de `@UseGuards(JwtAuthGuard)` assim que o módulo de auth for integrado". |
| **Critérios de Aceite** | Conforme | Abrange código 201, 400, documentação Swagger e injeção do módulo. | Manter. |
| **Dependências** | Conforme | Depende de `SUB-02` e `SUB-04`. | Manter em `Backlog`. |
| **Labels e Prioridade** | Conforme | `layer:api`, `type:feature`, `priority:medium`. | Manter. |

---

### 4.6 Sub-Issue [SUB-06]: Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
- **Responsável (Assignee):** Carla Mendes (`@carlamendes-qa`)
- **Revisor Designado (Reviewer):** Ana Silva (`@anasilva-dev`)

| Elemento Avaliado | Resultado | Apontamento / Ambiguidade | Recomendação Exata de Correção |
| :--- | :---: | :--- | :--- |
| **Título e Objetivo** | Conforme | Abrange todas as camadas e níveis de teste requeridos. | Manter. |
| **Descrição Técnica** | Ajuste Necessário | Falta estipular a gestão de estado do banco de dados relacional para os testes E2E executados contra o PostgreSQL. | Adicionar orientação técnica: "Utilizar banco de teste isolado ou rotina de truncagem de tabelas (`TRUNCATE products CASCADE`) no bloco `afterEach`/`beforeEach` dos testes E2E". |
| **Critérios de Aceite** | Conforme | 100% de aprovação e asserções explícitas de não-persistência em caso de falha. | Manter. |
| **Dependências** | Conforme | Fechamento da cadeia (depende de `SUB-01` a `SUB-05`). | Manter em `Backlog`. |
| **Labels e Prioridade** | Conforme | `type:test`, `priority:medium`. | Manter. |

---

## 5. Próximos Passos Obrigatórios da Revisão Humana
1. Cada revisor designado (`@anasilva-dev`, `@brunosouza-tech` e `@carlamendes-qa`) deve acessar as Sub-Issues no GitHub.
2. Publicar o comentário técnico de revisão estruturado (disponibilizado no **Artefato 05**).
3. O responsável pela Sub-Issue deve efetuar os pequenos ajustes de especificação no texto da Issue.
4. Após o consenso, o revisor assina a aprovação no GitHub, viabilizando o preenchimento da *Definition of Ready (DoR)*.

