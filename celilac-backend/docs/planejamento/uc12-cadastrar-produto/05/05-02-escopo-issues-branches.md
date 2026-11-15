# ARTEFATO 05-02 — ESCOPO, ISSUES E DEFINIÇÃO DA ESTRATÉGIA DE BRANCHES

> **Material 05 — Do Teste RED à Implementação GREEN com TDD**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 10/11/2026  
> **Rastreabilidade:** Continuidade dos Materiais 01 a 04

---

## 1. Mapeamento e Segregação de Responsabilidades das Issues

| Atributo | Issue de Testes (Origem TDD RED) | Issue de Implementação (Destino TDD GREEN) |
| :--- | :--- | :--- |
| **Identificador Interno** | `SUB-07` | `SUB-05` |
| **GitHub Issue** | [#10 — SUB-07 [UC12][Testes] Implementar testes automatizados para o cadastro de produto](https://github.com/evertonfoz/dsc-tests/issues/10) | [#8 — SUB-05 [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto](https://github.com/evertonfoz/dsc-tests/issues/8) |
| **Issue Principal (Epic)** | [#1 — EPIC-UC12 [UC12] Cadastrar Produto](https://github.com/evertonfoz/dsc-tests/issues/1) | [#1 — EPIC-UC12 [UC12] Cadastrar Produto](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Responsável Técnico** | `@evertonfoz` *(Papel simulado: Diego Costa Almeida)* | `@evertonfoz` *(Papel simulado: Bruno Oliveira Santos / Ana Silva)* |
| **Camada Arquitetural** | Testes (`layer:tests`) | Aplicação (`layer:application`) |
| **Escopo Nesta Iteração** | Especificar e manter o teste unitário de sucesso com dados válidos (`CA01`). | Implementar o comportamento mínimo de produção em `ProductsService.createProduct` para atender `CA01`. |
| **Critério de Aceite Focal** | `CA01` — Cadastro com dados válidos | `CA01` — Cadastro com dados válidos |
| **Status no GitHub Project** | `In Progress` | `In Progress` |

---

## 2. Análise da Definition of Ready (DoR) para Implementação (SUB-05)

A prontidão da Issue de testes (`SUB-07`) não autoriza automaticamente a implementação sem a devida verificação da Issue de produção (`SUB-05`):

1. **Objetivo Claro:** Implementar a lógica de orquestração do serviço de cadastro de produtos.
2. **Escopo Delimitado:** Restrito ao comportamento mínimo necessário para aprovar o teste `CA01`, sem avançar sobre validações de nome em branco (`CA02`) ou persistência HTTP/TypeORM direta nesta iteração.
3. **Critérios de Aceite Verificáveis:** Atendimento determinístico às asserções do teste unitário em Vitest.
4. **Contratos Disponíveis:** Entidade `Product`, interface `ProductsRepository` e token `PRODUCTS_REPOSITORY`.
5. **Política de WIP:** Mantido $WIP = 1$ para o desenvolvedor durante o ciclo GREEN.

---

## 3. Estratégia de Branches e Stacked Pull Requests

### 3.1 Justificativa da Escolha Estratégica (Cenário B — Issues Separadas)
Como a equipe separou a responsabilidade de especificação de testes (`SUB-07`) e de serviço de aplicação (`SUB-05`), o teste falhando da fase RED ainda **não foi integrado à branch `main`** (está isolado no Draft PR #12).

Para que o código de produção da `SUB-05` possa ser testado imediatamente contra o teste RED, a branch de implementação deve derivar diretamente da branch do teste.

### 3.2 Topologia de Branches
```text
main (produção estável)
  │
  └── feature/uc12-07-product-registration-test (Draft PR #12 — Teste RED / SUB-07)
        │   [Commit 2724b97: test: add failing product creation test]
        │
        └── feature/uc12-05-products-service (Draft PR #13 — Implementação GREEN / SUB-05)
              [Commit facb3ca: feat(products): implement product creation behavior for valid data]
```

### 3.3 Configuração dos Pull Requests Dependentes (Stacked PRs)
- **Draft PR #12 (`SUB-07`):**
  - **Head:** `feature/uc12-07-product-registration-test`
  - **Base:** `main`
- **Draft PR #13 (`SUB-05`):**
  - **Head:** `feature/uc12-05-products-service`
  - **Base:** `feature/uc12-07-product-registration-test` *(Branch dependente)*
  - **Benefício Técnico:** O *diff* do PR #13 exibe **exclusivamente** as alterações de código de produção realizadas no serviço (`products.service.ts`), sem duplicar as alterações de contratos e testes do PR #12 na visualização da revisão por pares.

---

## 4. Gestão de Riscos e Decisões da Equipe

| Risco Identificado | Nível de Severidade | Mitigação Técnica Adotada |
| :--- | :---: | :--- |
| **Merge Prematuro na `main`** | Alto | Ambos os Pull Requests permanecem explicitamente na condição de **Draft PR**, bloqueando merges acidentais no GitHub. |
| **Encerramento Precoce de Issues** | Médio | Nenhuma palavra-chave terminativa (`fixes` ou `closes`) é utilizada; usa-se apenas `refs #8` e `refs #10`. |
| **Alteração Acidental da Base do PR** | Médio | O PR #13 foi aberto com a base apontando estritamente para `feature/uc12-07-product-registration-test`. |
| **Contaminação de Escopo** | Baixo | Alterações restritas ao arquivo `products.service.ts`. |

---

## 5. Pendências para Próximas Etapas

1. Conclusão da implementação GREEN e verificação com Vitest.
2. Análise preliminar de qualidade de código (preparação para a fase REFACTOR).
3. Continuidade dos demais cenários do UC12 (`CA02`, `CA03`, `FE01`).

