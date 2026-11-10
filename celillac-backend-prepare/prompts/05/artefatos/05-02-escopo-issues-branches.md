# ARTEFATO 05-02 — ESCOPO, ISSUES E ESTRATÉGIA DE BRANCHES

## 1. Identificação das Issues Relacionadas

| Dimensão | Issue de Testes (`SUB-07`) | Issue de Implementação (`SUB-05`) |
| :--- | :--- | :--- |
| **Identificador no Planejamento** | `SUB-07` | `SUB-05` |
| **Número e URL no GitHub** | [Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10) | [Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8) |
| **Título Real** | `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` | `SUB-05 — [UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` |
| **Estado da Issue no GitHub** | `OPEN` | `OPEN` |
| **Estado no GitHub Project (#6)** | `In Progress` (`PVTI_lAHOAJgJDc4Bp2afzhFac0U`) | `Ready` (`PVTI_lAHOAJgJDc4Bp2afzhFacwo`) → passará a `In Progress` |
| **Responsável (Assignee)** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel didático: Diego Costa Almeida)* | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel didático: Ana Clara Souza)* |
| **Revisor Designado** | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Bruno Oliveira Santos)* | Everton Coimbra de Araújo (`@evertonfoz`) *(Papel simulado: Carla Mendes Ferreira)* |
| **Escopo Principal** | Especificar e implementar os testes automatizados (Vitest) para o cadastro de produto (`CA01`, `CA02`, `CA03`, `CA04`, `FE01`), iniciando pela Fase RED do TDD. | Implementar o serviço de aplicação `ProductsService.createProduct(name: string): Promise<Product>` em `src/modules/products/services/products.service.ts`, coordenando a criação da entidade `Product` e a persistência via `ProductsRepository.save`. |

---

## 2. Verificação de Escopo e Prontidão (Definition of Ready) da `SUB-05` (Issue #8)

Não se considerou que a prontidão da `SUB-07` (#10) autorizava automaticamente a execução da `SUB-05` (#8). Por isso, a [Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8) foi inspecionada diretamente no GitHub contra os critérios da *Definition of Ready*:

| Código | Condição da DoR | Situação na Issue #8 (`SUB-05`) | Evidência Verificada |
| :--- | :--- | :---: | :--- |
| **DoR-01** | **Objetivo claramente definido** | **Atende** | Seção `1. Objetivo` da Issue #8: *"Implementar o serviço de aplicação (`ProductsService`) responsável por coordenar o fluxo de cadastro de produtos..."* |
| **DoR-02** | **Escopo delimitado** | **Atende** | Seções `2. Descrição Detalhada` e `4. Escopo e Responsabilidades`: delimitam o arquivo `src/modules/products/services/products.service.ts` e o método `createProduct(name: string): Promise<Product>`. |
| **DoR-03** | **Critérios de aceite verificáveis** | **Atende** | Seção `5. Critérios de Aceite Verificáveis`: primeiro item verifica diretamente o **CA01 / RN04** (*"Quando acionado com dados válidos, o serviço valida os dados, aciona o repositório para persistir o produto e retorna o resultado de sucesso"*). |
| **DoR-04** | **Dependências identificadas** | **Atende** | Seção `6. Dependências` e Artefato `03-02-dependencias-refinadas.md`: para início da implementação e passagem do teste unitário de `CA01`, a `SUB-05` possui apenas **Dependência de Contrato** em relação a `SUB-01` (#4 — `Product`) e `SUB-04` (#7 — `ProductsRepository`). |
| **DoR-05** | **Informações e contratos disponíveis** | **Atende** | Os contratos `Product(productId, name)`, `PRODUCTS_REPOSITORY`, `ProductsRepository.save(product)` e a assinatura `ProductsService.createProduct(name)` já estão presentes e validados na branch RED. |
| **DoR-06** | **Responsável definido** | **Atende** | Assignee `@evertonfoz` registrado na Issue #8 (papel didático: Ana Clara Souza). |
| **DoR-07** | **Revisão de planejamento e Estado Ready** | **Atende** | A Issue #8 encontra-se classificada na coluna **`Ready`** do GitHub Project #6 (`CeliLac — UC12 Cadastrar Produto`). |

### Política de WIP (Work In Progress)
- No planejamento da equipe (Material 03), o limite global da coluna `In Progress` no quadro Kanban é de no máximo **3 itens** simultâneos, com limite de $WIP = 1$ por papel técnico (Diego Costa Almeida em `SUB-07` e Ana Clara Souza em `SUB-05`).
- No contexto do ciclo TDD em que `SUB-07` aguarda a implementação mínima de `SUB-05` para transitar de RED para GREEN no critério `CA01`, ter `SUB-07` (#10) e `SUB-05` (#8) em `In Progress` (totalizando 2 itens no board, abaixo do limite global de 3) respeita integralmente a política de WIP e reflete com transparência o trabalho real em execução.

---

## 3. Definição da Estratégia de Branches e Pull Requests

### 3.1 Cenário Adotado: Cenário B — Teste e implementação pertencem a Issues diferentes

No projeto CeliLac (`UC12`), as responsabilidades foram modeladas em Issues distintas:
- **Teste automatizado (Fase RED):** `SUB-07` ([Issue #10](https://github.com/evertonfoz/dsc-tests/issues/10)) → branch `feature/uc12-07-product-registration-test` ([Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12)).
- **Implementação do Serviço (Fase GREEN):** `SUB-05` ([Issue #8](https://github.com/evertonfoz/dsc-tests/issues/8)).

### 3.2 Relação de Dependência entre Branches (Stacked / Dependent Branches)

Como o teste RED (`src/modules/products/services/products.service.spec.ts`) e os contratos base (`product.entity.ts`, `products.repository.interface.ts`) foram criados no commit `2724b97` dentro da branch `feature/uc12-07-product-registration-test` e **não** estão na `main` (pois não se deve integrar teste falhando na `main`), criar a branch da `SUB-05` a partir da `main` impediria a execução do teste RED.

Portanto, a decisão técnica adotada é derivar a branch de implementação da `SUB-05` diretamente a partir da branch RED da `SUB-07`:

```text
main (cb70436)
  |
  +-- feature/uc12-07-product-registration-test (2724b97 — SUB-07 / Issue #10 / Draft PR #12)
        |
        +-- feature/uc12-05-products-service (SUB-05 / Issue #8 — Implementação GREEN de CA01)
```

| Parâmetro da Estratégia | Definição |
| :--- | :--- |
| **Branch RED (Existente)** | `feature/uc12-07-product-registration-test` |
| **Branch GREEN (Nova)** | `feature/uc12-05-products-service` |
| **Branch-base da Branch GREEN** | `feature/uc12-07-product-registration-test` |
| **Pull Request RED (Preservado)** | [Draft PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) (`feature/uc12-07-product-registration-test` → `main`) — mantido aberto como Draft, sem merge prematuro. |
| **Pull Request GREEN (A criar na Fase 8)** | PR da `SUB-05` com `head: feature/uc12-05-products-service` e `base: feature/uc12-07-product-registration-test`, referenciando `Refs #8` e `Refs #10`. |

### 3.3 Cuidados Operacionais com Pull Requests Dependentes e Riscos

1. **Diferenciação de Commits:** Ao apontar a branch-base do novo PR (`feature/uc12-05-products-service`) para `feature/uc12-07-product-registration-test` (e não para `main`), o diff do PR da `SUB-05` exibirá **exclusivamente** o commit da implementação GREEN (`src/modules/products/services/products.service.ts`), sem misturar o commit `2724b97` do teste RED como se fosse alteração exclusiva da `SUB-05`.
2. **Preservação do Draft PR #12:** O Draft PR #12 da `SUB-07` permanece intacto e aberto.
3. **Riscos Mapeados e Mitigação:**
   - *Risco 1:* Realizar merge prematuro na `main` antes de concluir os demais critérios (`CA02`, `CA03`) e a etapa de refatoração. **Mitigação:** Manter PRs abertos (em Draft / revisão) e não executar merge nesta unidade.
   - *Risco 2:* Perda de rastreabilidade entre os PRs #12 (`SUB-07`) e o novo PR da `SUB-05`. **Mitigação:** Documentar explicitamente no corpo do PR da `SUB-05` a branch-base `feature/uc12-07-product-registration-test` e o vínculo cruzado com a Issue #8 (`SUB-05`), a Issue #10 (`SUB-07`) e o Draft PR #12.
4. **Planejamento de Futura Integração:** Nas unidades posteriores (após refatoração e revisão final), o PR da `SUB-05` poderá ser integrado à branch da `SUB-07` (ou ter sua base atualizada após a consolidação) para que o incremento completo e verde seja integrado de forma limpa à `main`.

---

## 4. Decisões da Equipe e Pendências

- **Decisão registrada:** Adotar o **Cenário B** com a branch `feature/uc12-05-products-service` baseada em `feature/uc12-07-product-registration-test`.
- **Pendências:**
  1. Elaborar o Plano de Implementação Mínima GREEN (`05-03-plano-implementacao-green.md`) na Fase 4.
  2. Criar a branch `feature/uc12-05-products-service` e codificar o comportamento mínimo de `ProductsService.createProduct` na Fase 5.

