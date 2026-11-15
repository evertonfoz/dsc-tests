# ARTEFATO 07-07 — VERSIONAMENTO, PULL REQUEST E ATUALIZAÇÃO DO GITHUB PROJECT

## 1. Inspeção de Alterações e Versionamento Git

Antes de realizar o commit na branch `feature/uc12-06-products-http`, as alterações foram inspecionadas com `git status` e `git diff --staged --stat` para assegurar que apenas arquivos pertinentes ao escopo da atividade fossem versionados (descartando artefatos temporários de build como `tsconfig.build.tsbuildinfo`):

### 1.1 Arquivos Incluídos no Commit
```text
 celillac-backend-prepare/package.json              |  2 +
 celillac-backend-prepare/pnpm-lock.yaml            | 83 ++++++++++++++++------
 celillac-backend-prepare/src/app.module.ts         |  3 +-
 celillac-backend-prepare/src/main.ts               |  7 ++
 .../controllers/products.controller.spec.ts        | 77 ++++++++++++++++++++
 .../products/controllers/products.controller.ts    | 14 ++++
 .../modules/products/dtos/create-product.dto.ts    |  7 ++
 .../src/modules/products/products.module.ts        | 18 +++++
 .../repositories/in-memory-products.repository.ts  | 13 ++++
 9 files changed, 201 insertions(+), 23 deletions(-)
```

### 1.2 Registro do Commit e Publicação Remota (`git push`)
| Parâmetro | Valor Real Registrado |
| :--- | :--- |
| **Branch Publicada** | `feature/uc12-06-products-http` |
| **Branch-Base** | `feature/uc12-05-products-service` |
| **Hashes Completos dos Commits** | 1. `49118d9ef825ec2983c6cbac5baf0fc05e1bc060` (`49118d9`)<br>2. `fd00b5a3213b94e8e60fccc6531bdf698fcf4e83` (`fd00b5a`) |
| **Mensagens dos Commits** | 1. `feat(products): add HTTP endpoint for product registration (refs #9, refs #5, refs #10)`<br>2. `chore(products): add REST Client .http files for POST /products (refs #9)` |
| **Upstream Configurado** | `origin/feature/uc12-06-products-http` (`git push -u origin feature/uc12-06-products-http`) |

### 1.3 Diferenciação entre Commits Exclusivos e Commits Herdados
```text
main (cb70436)
  └── feature/uc12-07-product-registration-test (2724b97 — Herdado da SUB-07 / PR #12)
        └── feature/uc12-05-products-service (facb3ca — Herdado da SUB-05 / PR #13)
              └── feature/uc12-06-products-http (49118d9 — Exclusivo da SUB-06 / PR #14)
```

---

## 2. Pull Request Criado para a `SUB-06`

Foi criado o Pull Request correspondente à `SUB-06` (em modo **Draft**, preservando os Draft PRs #12 e #13 intactos):

| Campo | Valor Verificado no GitHub |
| :--- | :--- |
| **Número e URL do PR** | [Draft PR #14 (`https://github.com/evertonfoz/dsc-tests/pull/14`)](https://github.com/evertonfoz/dsc-tests/pull/14) |
| **Título** | `feat(uc12): add POST /products HTTP endpoint, DTO validation and HTTP tests` |
| **Estado** | `OPEN` (`Draft: true`) |
| **Branch de Origem (`head`)** | `feature/uc12-06-products-http` |
| **Branch-Base (`base`)** | `feature/uc12-05-products-service` |
| **Issues Referenciadas** | `Refs #9` (`SUB-06`), `Refs #5` (`SUB-02`), `Refs #8` (`SUB-05`), `Refs #10` (`SUB-07`) |
| **Relação com PRs Anteriores** | Depende hierarquicamente do [Draft PR #13](https://github.com/evertonfoz/dsc-tests/pull/13) (`SUB-05`) e do [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) (`SUB-07`). |

---

## 3. Atualização das Issues e do GitHub Project (#6)

### 3.1 Comentários de Rastreabilidade Publicados nas Issues
- **[Issue #9 (`SUB-06`)](https://github.com/evertonfoz/dsc-tests/issues/9):**
  - [Comentário de Revisão da DoR (`#issuecomment-6723400094`)](https://github.com/evertonfoz/dsc-tests/issues/9#issuecomment-6723400094)
  - [Comentário de Registro de Implementação e PR #14 (`#issuecomment-6723458554`)](https://github.com/evertonfoz/dsc-tests/issues/9#issuecomment-6723458554)
- **[Issue #5 (`SUB-02`)](https://github.com/evertonfoz/dsc-tests/issues/5):**
  - [Comentário de Coordenação do `CreateProductDto` (`#issuecomment-6723458815`)](https://github.com/evertonfoz/dsc-tests/issues/5#issuecomment-6723458815)
- **[Issue #10 (`SUB-07`)](https://github.com/evertonfoz/dsc-tests/issues/10):**
  - [Comentário de Atualização da Suíte de Testes HTTP (`#issuecomment-6723459055`)](https://github.com/evertonfoz/dsc-tests/issues/10#issuecomment-6723459055)

### 3.2 Situação Atualizada no GitHub Project #6 (`CeliLac — UC12 Cadastrar Produto`)

Foram preservados estritamente os cinco estados oficiais (`Backlog → Ready → In Progress → In Review → Done`):

| Issue | Identificador | Papel Simulado Responsável | Status Anterior (Material 06) | Status Atualizado (Material 07) | Justificativa Operacional |
| :---: | :---: | :--- | :---: | :---: | :--- |
| [#1](https://github.com/evertonfoz/dsc-tests/issues/1) | `EPIC-UC12` | Coordenação / Liderança | `Backlog` | **`Backlog`** | Épico guarda-chuva; aguarda conclusão das Sub-Issues. |
| [#4](https://github.com/evertonfoz/dsc-tests/issues/4) | `SUB-01` | Ana Clara Souza | `Ready` | **`Ready`** | Contrato base de `Product` definido; nenhuma Issue encerrada prematuramente. |
| [#5](https://github.com/evertonfoz/dsc-tests/issues/5) | `SUB-02` | Carla Mendes Ferreira | `Ready` | **`Ready`** | `CreateProductDto` criado em coordenação com `SUB-06`; mantida aberta para contratos de resposta. |
| [#6](https://github.com/evertonfoz/dsc-tests/issues/6) | `SUB-03` | Bruno Oliveira Santos | `Ready` | **`Ready`** | Aguarda ciclo TDD de regras de negócio no domínio/aplicação (`CA02`). |
| [#7](https://github.com/evertonfoz/dsc-tests/issues/7) | `SUB-04` | Bruno Oliveira Santos | `Ready` | **`Ready`** | Aguarda implementação da persistência real (TypeORM/PostgreSQL). |
| [#8](https://github.com/evertonfoz/dsc-tests/issues/8) | `SUB-05` | Ana Clara Souza | `In Progress` | **`In Progress`** | Implementação GREEN de `CA01` no Draft PR #13; aguarda ciclos de `CA02`/`CA03`/`FE01`. |
| [#9](https://github.com/evertonfoz/dsc-tests/issues/9) | `SUB-06` | Carla Mendes Ferreira | `Backlog` | **`In Progress`** | DoR regularizada; endpoint `POST /products` implementado e publicado no Draft PR #14. |
| [#10](https://github.com/evertonfoz/dsc-tests/issues/10) | `SUB-07` | Diego Costa Almeida | `In Progress` | **`In Progress`** | Contempla o teste unitário de `CA01` (PR #12) e os 2 testes HTTP (PR #14); aguarda demais cenários. |
| [#11](https://github.com/evertonfoz/dsc-tests/issues/11) | `SUB-08` | Diego Costa Almeida | `Backlog` | **`Backlog`** | Documentação final aguarda consolidação completa do caso de uso. |

*(Observação sobre WIP: A coluna `In Progress` conta com 3 itens ativos — `#8`, `#9` e `#10` — distribuídos entre 3 papéis distintos — Ana Clara, Carla e Diego — respeitando o limite individual $WIP = 1$ por papel e o teto global máximo de 3 itens simultâneos da equipe).*

---

## 4. Pendências e Próximas Ações

1. **Revisão Técnica do Draft PR #14 (`SUB-06`):** Submeter o PR #14 à revisão técnica cruzada.
2. **Desenvolvimento do Critério `CA02` na Camada de Aplicação/Domínio (`SUB-03` / `SUB-05` / `SUB-07`):** Realizar o ciclo TDD (`RED → GREEN → REFACTOR`) para rejeição de nome vazio/inválido diretamente no serviço/entidade.
3. **Implementação da Persistência Real (`SUB-04` — Issue #7):** Substituir `InMemoryProductsRepository` pelo repositório TypeORM conectado ao PostgreSQL.
4. **Proibição de Merge Prematuro:** Manter os PRs #12, #13 e #14 abertos e sem merge na `main` até que os critérios pendentes e a revisão humana estejam concluídos.

