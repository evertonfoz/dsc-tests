# ARTEFATO 07-07 — VERSIONAMENTO, PULL REQUEST E GOVERNANÇA NO GITHUB PROJECT

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Identificação do Escopo e Rastreabilidade Git

- **Sub-Issue Atendida:** `SUB-06 — [UC12][HTTP] Criar endpoint POST /products` ([#9](https://github.com/evertonfoz/dsc-tests/issues/9)).
- **Sub-Issues Relacionadas:**
  - `SUB-02 — [UC12][DTO] Criar DTO para cadastro de produto` ([#5](https://github.com/evertonfoz/dsc-tests/issues/5)).
  - `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` ([#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Issue Principal (Epic):** `EPIC-UC12 — [UC12] Cadastrar Produto` ([#1](https://github.com/evertonfoz/dsc-tests/issues/1)).

---

## 2. Estrutura de Branches e Histórico de Commits

A branch dedicada para o endpoint HTTP foi estruturada na topologia de PRs dependentes:

- **Branch de Origem:** `feature/uc12-06-products-http`
- **Branch-Base de Ramificação:** `feature/uc12-05-products-service` (preservando o serviço GREEN e contratos anteriores)

### Histórico Real de Commits na Branch HTTP:

```text
* 6c5d7d4 Merge pull request #14 from evertonfoz/feature/uc12-06-products-http
* ee76412 test(products): add integrated HTTP tests (refs #10, refs #9)
* fd00b5a chore(products): add REST Client .http files for POST /products (refs #9)
* 49118d9 feat(products): add HTTP endpoint for product registration (refs #9, refs #5, refs #10)
```

### Análise Atômica dos Commits:
1. `49118d9`: Introduziu o `ProductsController`, o `CreateProductDto`, o `InMemoryProductsRepository`, o `ProductsModule`, a configuração do `ValidationPipe` e o primeiro teste automatizado com Supertest.
2. `fd00b5a`: Adicionou os cenários de teste manual via REST Client (`.http`).
3. `ee76412`: Adicionou os testes de integração HTTP abrangendo o módulo completo.

---

## 3. Dados Formais do Pull Request #14

- **Identificador:** [Pull Request #14](https://github.com/evertonfoz/dsc-tests/pull/14)
- **Título:** `feat(uc12): add POST /products HTTP endpoint, DTO validation and HTTP tests`
- **Branch de Origem (Head):** `feature/uc12-06-products-http`
- **Branch de Destino (Base):** `main` (após consolidação sequencial dos PRs #12 e #13)
- **Estado Atual:** **Merged (Estado D — Integrado)**

### Conteúdo da Descrição do Pull Request:
- **Resumo:** Disponibilização da interface HTTP para o caso de uso UC12, delegando chamadas ao `ProductsService` com validação de entrada estrita.
- **Componentes Incluídos:** `ProductsController`, `CreateProductDto`, `ProductsModule`, `InMemoryProductsRepository`, `products.controller.spec.ts` e `products.integration.spec.ts`.
- **Evidências de Teste:** Execução com 5 testes verdes e requisições HTTP manuais anexadas.
- **Ressalvas de Arquitetura:** Registro explícito de que a persistência utiliza repositório em memória didático e que as regras de domínio adicionais do critério `CA02` serão introduzidas em etapas posteriores.

---

## 4. Governança e Atualização do GitHub Project

Sincronização no GitHub Project [#6](https://github.com/users/evertonfoz/projects/6):

| Item de Trabalho | Estado no Início da Etapa | Estado Atual no Board | Justificativa de Governança |
| :--- | :---: | :---: | :--- |
| **`SUB-06` (Endpoint HTTP #9)** | `Ready` / `In Progress` | **`Done`** | Endpoint implementado, testado e aprovado em revisão técnica. |
| **`SUB-02` (DTO #5)** | `Ready` / `In Progress` | **`Done`** | Contrato `CreateProductDto` implementado com decorators de validação. |
| **`SUB-07` (Testes #10)** | `In Progress` | **`In Progress`** | Testes HTTP de `CA01` concluídos; mantém-se aberto para novos critérios (`CA02`, persistência). |
| **`EPIC-UC12` (Epic #1)** | `In Progress` | **`In Progress`** | **Permanece aberto.** Os critérios `CA02` (validação de domínio), `CA03` e a persistência real ainda não foram concluídos. |

> ⛔ **Alerta Metodológico de Conclusão:** A conclusão da Sub-Issue HTTP não autoriza o encerramento da Issue Principal (Epic), garantindo que a rastreabilidade do projeto permaneça fidedigna.
