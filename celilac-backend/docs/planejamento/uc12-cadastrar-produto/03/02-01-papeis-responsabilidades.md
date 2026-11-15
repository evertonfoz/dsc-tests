# Artefato 01 — Matriz de Papéis e Responsabilidades da Equipe

## 1. Identificação do Projeto e Contexto
- **Projeto / Sistema:** CeliLac (Backend)
- **Módulo:** Gerenciamento de Produtos
- **Caso de Uso:** UC12 — Cadastrar Produto
- **Issue Principal (Epic):** `[UC12] Cadastrar Produto`
- **Origem dos Dados da Equipe:** Simulação estruturada representativa para equipe de desenvolvimento acadêmico.

---

## 2. Definição das Funções Organizacionais da Metodologia

Para assegurar governança, clareza operacional e rastreabilidade ao longo do ciclo de vida das Issues no GitHub, a equipe adota quatro funções formais:

1. **Coordenador:**
   - Responsável pelo fluxo do processo, comunicação geral da equipe, monitoramento dos prazos de entrega e remoção de impedimentos contextuais ou operacionais.
   - Conduz os alinhamentos e garante a sincronização do GitHub Project (Board).

2. **Responsável Técnico (Tech Lead / Arquiteto):**
   - Responsável pela integridade e padronização arquitetural da solução em NestJS/TypeScript.
   - Orienta decisões de design (DDD, modularidade, contratos), esclarece ambiguidades técnicas e assegura consistência entre contratos de entrada, modelo de domínio e infraestrutura.

3. **Desenvolvedor:**
   - Responsável pela implementação técnica das Sub-Issues atribuídas como *Assignee*, respeitando escopo, critérios de aceite e boas práticas de codificação orientada a testes (TDD).

4. **Revisor de Issues (Reviewer de Planejamento):**
   - Responsável por realizar a revisão cruzada formal das Sub-Issues no GitHub antes do início da codificação.
   - Valida se os critérios de aceite são mensuráveis, se as dependências estão claras, se o escopo está delimitado e se a *Definition of Ready (DoR)* foi satisfeita.

> **Diretriz de Separação de Conceitos:**
> - **Papel Funcional:** Função organizacional assumida pelo integrante no processo de engenharia de software (ex.: Tech Lead, Revisor).
> - **Permissão Técnica no GitHub:** Nível de privilégio concedido ao perfil no repositório (ex.: `Maintain`, `Write`).
> - **Atribuição de Atividades:** Vínculo formal a uma Issue específica no GitHub (*Assignee* para quem executa; *Reviewer* para quem valida).

---

## 3. Composição da Equipe e Alocação dos Papéis

### Integrante 1: Ana Silva
- **Nome Completo:** Ana Silva
- **Usuário GitHub:** `@anasilva-dev`
- **Função Principal:** Responsável Técnica (Tech Lead)
- **Funções Secundárias:** Desenvolvedora Backend (Domínio e Serviços) e Revisora de Issues
- **Perfil Técnico e Habilidades:** Experiência com TypeScript, NestJS, Domain-Driven Design (DDD), modelagem de invariantes de negócio e arquitetura limpa.
- **Disponibilidade Estimada:** 15 horas semanais.
- **Atividades sob sua Responsabilidade Direta (*Assignee*):**
  - `[SUB-01]` Modelar a Entidade de Domínio `Product` e Invariantes
  - `[SUB-04]` Implementar o Serviço de Aplicação para Cadastro de Produto
- **Atividades sob sua Revisão Técnica (*Reviewer*):**
  - `[SUB-02]` Implementar DTOs de Entrada e Saída com Validações de Contrato
  - `[SUB-06]` Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
- **Justificativa da Designação:** Seu domínio em modelagem e regras de negócio capacita-a para guiar as decisões estruturais de arquitetura do UC12, programar as camadas de domínio e aplicação (`SUB-01` e `SUB-04`), e revisar os contratos externos (`SUB-02`) e a suíte global de testes (`SUB-06`).

---

### Integrante 2: Bruno Souza
- **Nome Completo:** Bruno Souza
- **Usuário GitHub:** `@brunosouza-tech`
- **Função Principal:** Coordenador de Equipe
- **Funções Secundárias:** Desenvolvedor Backend (Persistência e API) e Revisor de Issues
- **Perfil Técnico e Habilidades:** Experiência em modelagem relacional, PostgreSQL, TypeORM, migrations, controllers NestJS e facilidade em organização de tarefas ágeis.
- **Disponibilidade Estimada:** 15 horas semanais.
- **Atividades sob sua Responsabilidade Direta (*Assignee*):**
  - `[SUB-03]` Configurar Persistência, Schema de Banco e Repositório de Produtos
  - `[SUB-05]` Implementar o Controlador HTTP e Rota `POST /products`
- **Atividades sob sua Revisão Técnica (*Reviewer*):**
  - `[SUB-01]` Modelar a Entidade de Domínio `Product` e Invariantes
  - `[SUB-04]` Implementar o Serviço de Aplicação para Cadastro de Produto
- **Justificativa da Designação:** Sua experiência em infraestrutura de dados e transporte HTTP viabiliza a execução da persistência (`SUB-03`) e dos endpoints REST (`SUB-05`), enquanto seu perfil organizador garante a governança do repositório e o acompanhamento das entregas. Como revisor de `SUB-01` e `SUB-04`, valida se as entidades e serviços estão adequadamente preparados para integração com banco de dados.

---

### Integrante 3: Carla Mendes
- **Nome Completo:** Carla Mendes
- **Usuário GitHub:** `@carlamendes-qa`
- **Função Principal:** Desenvolvedora Backend & Engenheira de Qualidade (QA)
- **Funções Secundárias:** Revisora de Contratos e Infraestrutura
- **Perfil Técnico e Habilidades:** Foco em validação de contratos de API (`class-validator`), testes unitários e de integração E2E com Vitest/Supertest, automação e inspeção de código.
- **Disponibilidade Estimada:** 15 horas semanais.
- **Atividades sob sua Responsabilidade Direta (*Assignee*):**
  - `[SUB-02]` Implementar DTOs de Entrada e Saída com Validações de Contrato
  - `[SUB-06]` Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
- **Atividades sob sua Revisão Técnica (*Reviewer*):**
  - `[SUB-03]` Configurar Persistência, Schema de Banco e Repositório de Produtos
  - `[SUB-05]` Implementar o Controlador HTTP e Rota `POST /products`
- **Justificativa da Designação:** A centralização dos testes integrados e validações de borda (`SUB-02` e `SUB-06`) sob responsabilidade da especialista em QA garante rigor na verificação dos critérios de aceite. Sua atuação como revisora de `SUB-03` e `SUB-05` assegura que a camada de dados e os controladores disponham de contratos testáveis e tratamentos adequados de erro antes da codificação.

---

## 4. Matriz Resumo de Papéis e Acúmulo de Funções

| Integrante | Usuário GitHub | Coordenação | Liderança Técnica | Execução (Assignee) | Revisão Cruzada (Reviewer) |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Ana Silva** | `@anasilva-dev` | Não | **Sim** | `SUB-01`, `SUB-04` | `SUB-02`, `SUB-06` |
| **Bruno Souza** | `@brunosouza-tech` | **Sim** | Não | `SUB-03`, `SUB-05` | `SUB-01`, `SUB-04` |
| **Carla Mendes** | `@carlamendes-qa` | Não | Não | `SUB-02`, `SUB-06` | `SUB-03`, `SUB-05` |

---

## 5. Regras de Conduta e Governança da Equipe
1. **Segregação Estrita de Revisão:** Nenhum integrante está autorizado a aprovar ou conduzir a revisão de planejamento de uma Sub-Issue atribuída a si mesmo.
2. **Resolução de Impasses:** Casos de divergência conceitual sobre regras de negócio ou limites de camada serão arbitrados pela Liderança Técnica (`@anasilva-dev`), em alinhamento com a especificação funcional do UC12.
3. **Comunicação no GitHub:** Todas as deliberações técnicas, dúvidas e aprovações devem ser registradas publicamente nos comentários das Issues e Sub-Issues correspondentes no GitHub.

