# Roteiro Passo a Passo para Conclusão Formal do UC12 — Cadastrar Produto

**Projeto:** CeliLac (`evertonfoz/dsc-tests`)  
**Caso de Uso:** `UC12 — Cadastrar Produto` ([Issue #1 — EPIC-UC12](https://github.com/evertonfoz/dsc-tests/issues/1))  
**Referência:** Pós-Material 12 (Encerramento Técnico, Revisão Humana, Integração de Pull Requests e Governança no GitHub)

---

## 1. Visão Geral: O UC12 já está concluído?

A resposta divide-se em **duas dimensões**:

### 1.1. Dimensão Técnica e Didática (Materiais 01 a 12): **CONCLUÍDA**
Todo o código, infraestrutura, contratos e testes exigidos para o `UC12 — Cadastrar Produto` já foram implementados e validados:

| Critério / Entrega | Status Técnico | Evidência no Repositório |
| :--- | :---: | :--- |
| **`CA01`** — Cadastro de produto com dados válidos (`201 Created`) | **Concluído** | `ProductsController`, `ProductsService`, `TypeOrmProductsRepository` |
| **`CA02`** — Rejeição de solicitação sem nome obrigatório (`400 Bad Request`) | **Concluído** | `CreateProductDto` (`@IsString()`, `@IsNotEmpty()`) + `ValidationPipe` |
| **`CA03`** — Produto inválido não é armazenado no banco | **Concluído** | Bloqueio na fronteira HTTP antes de acionar `ProductsService` / `ProductsRepository` |
| **`CA04`** — Testes automatizados cobrindo os fluxos especificados | **Concluído** | `pnpm test` (`13 passed`), `pnpm test:integration` (`1 passed` em `celilac_test:5435`), `pnpm test:e2e` (`2 passed`) |
| **`CA05`** — Resposta compatível e contrato público estabilizado | **Concluído** | `ProductResponseDto` e `toProductResponse()` em `product-response.mapper.ts` |
| **Persistência e Infraestrutura Containerizada** | **Concluído** | Migration `1794255600000-CreateProductsTable.ts` + Docker Compose (`api`, `postgres`, `postgres_test`) |
| **Auditoria Arquitetural (Material 12)** | **Concluído** | Artefatos `12-01` a `12-08` (Preservação Arquitetural Justificada — Cenário B) |

### 1.2. Dimensão de Governança no GitHub (`EPIC-UC12` — Issue #1): **PENDENTE DE ENCERRAMENTO FORMAL**
Conforme as **Condições de Conclusão** da [Issue #1 (`EPIC-UC12`)](https://github.com/evertonfoz/dsc-tests/issues/1) e a regra do Material 12 (*"Não encerre a Epic UC12 automaticamente"*), o trabalho técnico encontra-se distribuído em uma cadeia de branches com **Draft Pull Requests abertos**. Para que o `UC12` passe ao estado **`Done` / `Closed`** com 100% de rastreabilidade, o aluno/equipe deve executar os **6 passos abaixo**, um a um.

---

## 2. Mapa Atual da Cadeia de Pull Requests (Stacked PRs)

Atualmente, os Pull Requests do UC12 formam uma pilha sequencial (*stacked PRs*), na qual cada etapa aponta para a branch da etapa anterior:

```text
main
 └── PR #12: feature/uc12-07-product-registration-test          (Material 04 — Teste RED)
      └── PR #13: feature/uc12-05-products-service              (Material 05/06 — Service GREEN/REFACTOR)
           └── PR #14: feature/uc12-06-products-http            (Material 07/08 — Controller HTTP e Integração)
                └── PR #15: feature/uc12-04-products-persistence (Material 09 — Persistência PostgreSQL/TypeORM)
                     └── PR #17: feature/uc12-09-backend-containerization (Material 10 — Docker Compose)
                          └── PR #19: feature/uc12-10-http-contract-stabilization (Material 11/12 — Contrato HTTP e Auditoria)
```

> **Atenção:** Há também o Draft PR `#18` (`chore/ignore-tsbuildinfo` → `main`), independente da cadeia de features.

---

## 3. Passo a Passo para o Aluno Executar o Encerramento Formal

### Passo 1 — Publicar o Parecer Arquitetural do Material 12 (e decidir sobre o versionamento dos artefatos)

Antes de integrar os PRs, registre o resultado da auditoria arquitetural do Material 12 no PR #19 para que fique documentado no histórico do GitHub.

#### Como fazer via terminal (`gh` CLI):
```bash
gh pr comment 19 --body-file prompts/12/artefatos/12-08-revisao-github-checklist.md
```
*(Ou copie a **Seção 2 — Parecer Arquitetural Técnico** de `prompts/12/artefatos/12-08-revisao-github-checklist.md` e cole como comentário na página web do [PR #19](https://github.com/evertonfoz/dsc-tests/pull/19)).*

#### Opcional — Versionar a documentação dos Materiais 11 e 12 na branch atual:
Se o professor/equipe desejar que as pastas `prompts/11/` e `prompts/12/` façam parte do repositório Git (assim como `prompts/01` a `prompts/10`):
```bash
git checkout feature/uc12-10-http-contract-stabilization
git status -sb
git add prompts/11 prompts/12
git commit -m "docs(prompts): add Material 11 and Material 12 artifacts and verification guides (refs #11, refs #10, refs #1)"
git push origin feature/uc12-10-http-contract-stabilization
```

---

### Passo 2 — Retirar os Pull Requests do modo `Draft` (Marcar como *Ready for Review*)

Como os PRs `#12`, `#13`, `#14`, `#15`, `#17` e `#19` foram criados como rascunho (`Draft`) para impedir merges prematuros durante as aulas, o primeiro ato da revisão final é marcá-los como prontos para revisão.

#### Como fazer via terminal (`gh` CLI):
```bash
gh pr ready 12
gh pr ready 13
gh pr ready 14
gh pr ready 15
gh pr ready 17
gh pr ready 19
```

#### Como fazer pela interface Web do GitHub:
1. Abra cada PR (`#12`, `#13`, `#14`, `#15`, `#17`, `#19`).
2. Role até o final da página, próximo à caixa de merge, e clique no botão **"Ready for review"**.

---

### Passo 3 — Realizar a Revisão Técnica Humana (*Code Review*)

Conforme exigido pelo fluxo colaborativo, um integrante revisor (ou o próprio aluno/professor, caso atue individualmente na validação final) deve inspecionar o código, os contratos preservados e as evidências de testes em cada PR.

#### Como fazer pela interface Web do GitHub:
1. Em cada PR, clique na aba **"Files changed"**.
2. Confira se não há arquivos `.env`, senhas expostas ou alterações fora do escopo.
3. Clique no botão verde **"Review changes"** (canto superior direito).
4. Escreva o parecer de revisão (confirmando contratos e testes), selecione **"Approve"** (ou **"Comment"**, caso seja o próprio autor do PR, já que o GitHub não permite auto-aprovação) e clique em **"Submit review"**.

---

### Passo 4 — Executar o Merge Sequencial da Cadeia de PRs até a `main`

> [!WARNING]
> **Cuidado Crítico ao fazer Merge de PRs Empilhados (Stacked PRs):**
> Quando você faz merge do PR `#12` na `main`, **NÃO exclua a branch do PR `#12` (`--delete-branch`) antes de atualizar a branch base do PR `#13` para `main`!** Se a branch base de um PR aberto for deletada antes de o PR seguinte apontar para `main`, o GitHub fecha automaticamente o PR seguinte.

Siga exatamente a sequência segura abaixo (da base `#12` até o topo `#19`):

#### 4.1. Integrar o PR #12 na `main` e apontar o PR #13 para `main`
```bash
# 1. Faz merge do PR #12 na main (SEM deletar a branch ainda)
gh pr merge 12 --merge

# 2. Atualiza a base do PR #13 para apontar diretamente para a main
gh pr edit 13 --base main
```

#### 4.2. Integrar o PR #13 na `main` e apontar o PR #14 para `main`
```bash
gh pr merge 13 --merge
gh pr edit 14 --base main
```

#### 4.3. Integrar o PR #14 na `main` e apontar o PR #15 para `main`
```bash
gh pr merge 14 --merge
gh pr edit 15 --base main
```

#### 4.4. Integrar o PR #15 na `main` e apontar o PR #17 para `main`
```bash
gh pr merge 15 --merge
gh pr edit 17 --base main
```

#### 4.5. Integrar o PR #17 na `main` e apontar o PR #19 para `main`
```bash
gh pr merge 17 --merge
gh pr edit 19 --base main
```

#### 4.6. Integrar o PR #19 na `main` e atualizar sua cópia local
```bash
gh pr merge 19 --merge
git checkout main
git pull origin main
```

#### 4.7. Validar a `main` após todos os merges
Com a branch `main` atualizada localmente, rode a bateria final para comprovar que a `main` está 100% íntegra:
```bash
pnpm build
pnpm lint
pnpm test
pnpm test:integration
```
**Resultado esperado na `main`:** `pnpm build` e `pnpm lint` com `0 errors`; `pnpm test` com `13 passed`; `pnpm test:integration` com `1 passed`.

---

### Passo 5 — Concluir e Fechar as Sub-Issues (`#4` a `#11` e `#16`) e Atualizar o GitHub Project #6

Com todo o código e documentação na `main`, cada Sub-Issue planejada para o UC12 deve ser fechada com um comentário de rastreabilidade apontando para o PR/commit correspondente e movida para a coluna **`Done`** no quadro Kanban (GitHub Project #6):

| Sub-Issue | Escopo | PR / Evidência de Conclusão |
| :--- | :--- | :--- |
| **[#4 — SUB-01](https://github.com/evertonfoz/dsc-tests/issues/4)** | Modelar entidade `Product` | Implementada em `src/modules/products/entities/product.entity.ts` (PR #12 / #13) |
| **[#5 — SUB-02](https://github.com/evertonfoz/dsc-tests/issues/5)** | Criar DTO de cadastro de produto | `CreateProductDto` e `ProductResponseDto` (PR #14 e PR #19) |
| **[#6 — SUB-03](https://github.com/evertonfoz/dsc-tests/issues/6)** | Implementar validações de dados do produto | `@IsString()`, `@IsNotEmpty()` e `ValidationPipe({ whitelist: true, transform: true })` (PR #14 e PR #19) |
| **[#7 — SUB-04](https://github.com/evertonfoz/dsc-tests/issues/7)** | Configurar persistência e repositório de produtos | `ProductsRepository`, `TypeOrmProductsRepository`, `ProductMapper`, `ProductOrmEntity` e migration (PR #15) |
| **[#8 — SUB-05](https://github.com/evertonfoz/dsc-tests/issues/8)** | Implementar serviço de aplicação `ProductsService` | `ProductsService.createProduct(name)` (PR #13) |
| **[#9 — SUB-06](https://github.com/evertonfoz/dsc-tests/issues/9)** | Criar endpoint `POST /products` | `ProductsController` + `toProductResponse()` (PR #14 e PR #19) |
| **[#10 — SUB-07](https://github.com/evertonfoz/dsc-tests/issues/10)** | Implementar testes automatizados para o cadastro | Suítes unitária, HTTP, integração em memória e PostgreSQL real (PRs #12, #14, #15 e #19) |
| **[#11 — SUB-08](https://github.com/evertonfoz/dsc-tests/issues/11)** | Atualizar documentação técnica do cadastro | Artefatos e guias dos Materiais 01 a 12 em `prompts/` |
| **[#16 — SUB-09](https://github.com/evertonfoz/dsc-tests/issues/16)** | Containerizar backend NestJS com Docker Compose | `Dockerfile`, `.dockerignore` e serviço `api` em `compose.yaml` (PR #17) |

#### Como fechar cada Sub-Issue via terminal (`gh` CLI):
```bash
gh issue close 4 --comment "Concluído: entidade Product implementada e integrada à main."
gh issue close 5 --comment "Concluído: CreateProductDto e ProductResponseDto implementados e integrados à main (PRs #14 e #19)."
gh issue close 6 --comment "Concluído: validações de entrada HTTP (@IsString, @IsNotEmpty e ValidationPipe) implementadas e testadas (PRs #14 e #19)."
gh issue close 7 --comment "Concluído: contrato ProductsRepository e persistência TypeORM/PostgreSQL integrados à main (PR #15)."
gh issue close 8 --comment "Concluído: ProductsService.createProduct(name) implementado e integrado à main (PR #13)."
gh issue close 9 --comment "Concluído: endpoint POST /products com contrato estabilizado integrado à main (PRs #14 e #19)."
gh issue close 10 --comment "Concluído: suítes unitária, contrato HTTP, integração em memória e persistência PostgreSQL integradas à main (PRs #12, #14, #15 e #19)."
gh issue close 16 --comment "Concluído: containerização do backend NestJS (serviço api no Docker Compose) integrada à main (PR #17)."
gh issue close 11 --comment "Concluído: documentação técnica e auditoria arquitetural dos Materiais 01 a 12 consolidadas."
```
*(Em seguida, verifique no **GitHub Project #6** se todos os cartões de `#4` a `#11` e `#16` estão na coluna **`Done`**).*

---

### Passo 6 — Marcar os Checkboxes e Encerrar Formalmente a `EPIC-UC12` (Issue #1)

Somente após os Passos 1 a 5 estarem concluídos:

1. Abra a [Issue #1 (`EPIC-UC12 — [UC12] Cadastrar Produto`)](https://github.com/evertonfoz/dsc-tests/issues/1) no navegador.
2. Marque todos os checkboxes das seções:
   - **Relação das Sub-Issues Planejadas:** `[x] SUB-01 (#4)` até `[x] SUB-08 (#11)`.
   - **Critérios Gerais de Aceite:** `[x] CA01` até `[x] CA05`.
3. Registre o comentário final de encerramento e feche a Epic:

```bash
gh issue close 1 --comment "EPIC-UC12 concluída com sucesso após execução dos Materiais 01 a 12: todas as Sub-Issues (#4 a #11 e #16) foram implementadas, revisadas e integradas à main, com os critérios CA01 a CA05 verificados por testes automatizados e auditoria arquitetural documentada."
```
4. No **GitHub Project #6**, confirme que o card da `EPIC-UC12` (#1) foi movido para **`Done`**.
