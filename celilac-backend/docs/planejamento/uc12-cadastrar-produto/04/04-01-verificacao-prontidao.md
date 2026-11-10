# ARTEFATO 04-01 — VERIFICAÇÃO DE PRONTIDÃO (DEFINITION OF READY)

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, TypeORM, PostgreSQL, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01, 02 e 03

---

## 1. Identificação do Projeto e da Demanda

- **Projeto:** CeliLac Backend.
- **Caso de Uso:** `UC12 — Cadastrar Produto`.
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Sub-Issue Selecionada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Critério de Aceite Focal:** `CA01` — Uma solicitação contendo dados válidos deverá resultar no cadastro de um produto.
- **Responsável pela Execução:** Everton Coimbra de Araújo (`@evertonfoz` / Papel simulado no planejamento: Diego Costa Almeida).
- **Revisor Designado:** `@evertonfoz` (Papel simulado no planejamento: Bruno Oliveira Santos).
- **Board do GitHub Project:** Projeto [#6 — CeliLac — UC12 Cadastrar Produto](https://github.com/users/evertonfoz/projects/6).

---

## 2. Matriz de Avaliação da Definition of Ready (DoR)

| Código | Critério da Definition of Ready | Avaliação Técnica | Justificativa e Evidências Documentais |
| :---: | :--- | :---: | :--- |
| **DoR-01** | Objetivo claramente definido | **Atende** | O objetivo da SUB-07 é implementar a cobertura de testes automatizados para o cadastro de produto, iniciando pelo fluxo principal de sucesso com dados válidos (`CA01`). |
| **DoR-02** | Escopo delimitado | **Atende** | Para o início imediato no Material 04, o escopo de implementação técnica é estritamente delimitado ao **primeiro teste unitário na fase RED do TDD**, sem avançar para implementação de produção (GREEN), mantendo os demais critérios (`CA02`, `CA03`, `FE01`) para iterações seguintes da mesma Sub-Issue. |
| **DoR-03** | Critérios de aceite verificáveis | **Atende** | O critério `CA01` possui asserção determinística: ao receber um nome de produto válido (`'Celular XYZ'`), o serviço deve instanciar o produto com identificador gerado, invocar o método de persistência (`save`) e retornar a entidade cadastrada. |
| **DoR-04** | Dependências identificadas | **Atende** | A dependência estrutural primária é de contrato: a interface da entidade de domínio (`Product`), a interface do repositório (`ProductsRepository`) e a assinatura do método do serviço (`ProductsService.createProduct`). Não há dependência de infraestrutura externa física de banco neste momento unitário, pois serão empregados dublês de teste (mocks via Vitest). |
| **DoR-05** | Informações necessárias disponíveis | **Atende** | Contratos de dados de entrada (`name: string`) e interfaces mínimas de domínio definidas na especificação do caso de uso e nos alinhamentos prévios de contrato. |
| **DoR-06** | Responsável definido | **Atende** | Desenvolvedor formalmente atribuído como Assignee da Issue no GitHub (`@evertonfoz`). |
| **DoR-07** | Revisão de planejamento concluída | **Atende** | Revisão de planejamento devidamente documentada no Material 02 e consolidada no plano de execução do Material 03. |

---

## 3. Avaliação de Dependências e Política de WIP

- **Dependências Relevantes:**
  - Interface do repositório e modelo de domínio desacoplados via injeção de dependência do NestJS (`PRODUCTS_REPOSITORY`).
  - Nenhuma dependência externa de rede ou contêiner em execução é exigida para a bateria unitária.
- **Conformidade com a Política de Trabalho em Progresso (WIP):**
  - O desenvolvedor assume a SUB-07 (#10) com $WIP = 1$ para a fase de testes unitários controlados.
  - O card transiciona formalmente para `In Progress` no GitHub Project ao iniciar a branch de trabalho.

---

## 4. Registro de Pendências para Etapas Posteriores da Sub-Issue

A SUB-07 **não será encerrada** ao final desta unidade, permanecendo em aberto para cobrir:
1. Implementação dos testes de validação para ausência de nome obrigatório (`CA02` / `FA01`).
2. Implementação dos testes para garantia de não persistência de dados inválidos (`CA03` / `RN03`).
3. Implementação dos testes de tratamento de falha de persistência (`FE01`).
4. Testes de integração E2E contra banco PostgreSQL real (Onda 4).

---

## 5. Resultado da Verificação e Parecer para Início

- **Classificação Final:** **Apta para Início da Implementação (Fase RED do TDD)**.
- **Condição Obrigatória:** A alteração deve ser isolada estritamente em branch de trabalho dedicada (`feature/uc12-07-product-registration-test`), sem modificações diretas na branch `main`, limitando-se à demonstração comprovada da falha controlada (RED) e publicação em Draft Pull Request.

