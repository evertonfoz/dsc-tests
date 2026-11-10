# Artefato 10 — Roteiro Operacional de Configuração no GitHub

## 1. Visão Geral
Este guia passo a passo orienta a equipe de estudantes na configuração manual e precisa de todo o planejamento técnico dentro do repositório no GitHub, abrangendo a criação de Labels, Issues, Sub-Issues, vínculos de tasklists e o quadro do GitHub Projects.

---

## 2. Passo a Passo Sequencial de Configuração

### Passo 1: Configuração das Labels do Repositório
1. Acesse o repositório no GitHub: `https://github.com/<organizacao-ou-usuario>/celilac-backend`.
2. Navegue até a aba **Issues** e clique no botão **Labels** (ao lado da barra de pesquisa).
3. Clique em **New label** e cadastre cada uma das labels mapeadas no **Artefato 7**:
   - `module:products` (Cor: `#0E8A16`, Descrição: `Módulo de gerenciamento de produtos`)
   - `type:epic` (Cor: `#3E2723`, Descrição: `Agrupador macro de caso de uso`)
   - `type:feature` (Cor: `#1D76DB`, Descrição: `Desenvolvimento de funcionalidade`)
   - `type:test` (Cor: `#FBCA04`, Descrição: `Implementação de testes automatizados`)
   - `layer:domain` (Cor: `#5319E7`, Descrição: `Camada de domínio e entidades`)
   - `layer:application` (Cor: `#0052CC`, Descrição: `Camada de aplicação, serviços e DTOs`)
   - `layer:infrastructure` (Cor: `#D93F0B`, Descrição: `Infraestrutura, repositórios e banco`)
   - `layer:api` (Cor: `#1D76DB`, Descrição: `Controladores HTTP, rotas e documentação REST`)
   - `priority:high` (Cor: `#B60205`, Descrição: `Prioridade alta`)
   - `priority:medium` (Cor: `#E99695`, Descrição: `Prioridade média`)

---

### Passo 2: Criação da Issue Principal (Epic)
1. Na aba **Issues**, clique no botão **New issue**.
2. No campo **Title**, insira:
   ```text
   [UC12] Cadastrar Produto
   ```
3. No corpo da issue, copie e cole integralmente o conteúdo em Markdown disponível no **Artefato 3 (`01-03-issue-principal-epic.md`)**.
4. No painel lateral direito:
   - Em **Labels**, atribua: `type:epic`, `module:products`, `priority:high`.
5. Clique em **Submit new issue** e anote o número gerado para esta issue (ex.: `#10`).

---

### Passo 3: Criação de Cada uma das Sub-Issues
Crie individualmente as 6 Sub-Issues utilizando o conteúdo detalhado no **Artefato 4 (`01-04-sub-issues.md`)**:

1. **Sub-Issue 1:**
   - **Title:** `[SUB-01] Modelar a Entidade de Domínio Product e Invariantes`
   - **Labels:** `module:products`, `type:feature`, `layer:domain`, `priority:high`
   - Anote o número gerado (ex.: `#11`).
2. **Sub-Issue 2:**
   - **Title:** `[SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato`
   - **Labels:** `module:products`, `type:feature`, `layer:application`, `priority:high`
   - Anote o número gerado (ex.: `#12`).
3. **Sub-Issue 3:**
   - **Title:** `[SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos`
   - **Labels:** `module:products`, `type:feature`, `layer:infrastructure`, `priority:high`
   - Anote o número gerado (ex.: `#13`).
4. **Sub-Issue 4:**
   - **Title:** `[SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto`
   - **Labels:** `module:products`, `type:feature`, `layer:application`, `priority:high`
   - Anote o número gerado (ex.: `#14`).
5. **Sub-Issue 5:**
   - **Title:** `[SUB-05] Implementar o Controlador HTTP e Rota POST /products`
   - **Labels:** `module:products`, `type:feature`, `layer:api`, `priority:medium`
   - Anote o número gerado (ex.: `#15`).
6. **Sub-Issue 6:**
   - **Title:** `[SUB-06] Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)`
   - **Labels:** `module:products`, `type:test`, `priority:medium`
   - Anote o número gerado (ex.: `#16`).

---

### Passo 4: Vinculação das Sub-Issues na Issue Principal
1. Abra a Issue Principal criada no Passo 2 (`[UC12] Cadastrar Produto`).
2. Clique nos três pontinhos no canto superior direito do comentário principal e selecione **Edit**.
3. Na seção `## 4. Relação de Sub-Issues Planejadas`, substitua os marcadores genéricos pelas referências reais às issues criadas no Passo 3, utilizando `#número`:
   ```markdown
   ## 4. Relação de Sub-Issues Planejadas
   - [ ] #11 — [SUB-01] Modelar a Entidade de Domínio Product e Invariantes
   - [ ] #12 — [SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato
   - [ ] #13 — [SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos
   - [ ] #14 — [SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto
   - [ ] #15 — [SUB-05] Implementar o Controlador HTTP e Rota POST /products
   - [ ] #16 — [SUB-06] Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
   ```
4. Salve as alterações. O GitHub reconhecerá a lista como uma **Tasklist** vinculada nativamente.

---

### Passo 5: Criação e Configuração do GitHub Project (Board)
1. No menu superior do repositório (ou da organização), acesse a aba **Projects**.
2. Clique em **New project**, selecione o template **Board** e nomeie como:
   `CeliLac — Planejamento de Implementação`.
3. Abra as opções do campo **Status** (Settings do campo Status):
   - Configure estritamente os **5 estados formais da metodologia**:
     1. `Backlog`
     2. `Ready`
     3. `In Progress`
     4. `In Review`
     5. `Done`
   - Exclua quaisquer outras colunas padrão (como "Todo").
4. Clique em **+ Add item** no rodapé de cada coluna ou utilize a barra de busca para adicionar as issues criadas:
   - Adicione na coluna **`Ready`**:
     - `[SUB-01]`
     - `[SUB-02]`
   - Adicione na coluna **`Backlog`**:
     - `[UC12] Cadastrar Produto` (Epic)
     - `[SUB-03]`
     - `[SUB-04]`
     - `[SUB-05]`
     - `[SUB-06]`

---

### Passo 6: Atribuição de Responsáveis e Conferência Final
1. No board, clique sobre cada cartão e atribua o respectivo membro da equipe no campo **Assignees** (conforme definido no **Artefato 9**).
2. Verifique se todas as labels e status correspondem à matriz de distribuição inicial.
3. Certifique-se de que nenhum item permaneceu sem status ou fora do quadro de gestão.

