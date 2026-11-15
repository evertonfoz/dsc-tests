# ARTEFATO 07 — PLANO DE ATUALIZAÇÃO DO GITHUB

> **Regras Operacionais Obrigatórias:**
> 1. **Preservação da Estrutura Existente:** Não crie um novo GitHub Project, não recrie a Issue principal (`[UC12] Cadastrar Produto`) e não recrie as 8 Sub-Issues (`SUB-01` a `SUB-08`) caso já tenham sido cadastradas na etapa anterior.
> 2. **Estados Exclusivos do Board:** Utilize única e exclusivamente os 5 estados no campo `Status` do GitHub Project: **`Backlog` → `Ready` → `In Progress` → `In Review` → `Done`**. Nesta etapa de organização e revisão do planejamento, **todas as Issues devem permanecer estritamente em `Backlog` ou `Ready`** (nenhuma Issue deve ser movida para `In Progress`, `In Review` ou `Done`).
> 3. **Proibição de Labels de Status:** **Não crie nem aplique labels para representar estado de andamento** (são expressamente proibidas labels como `status:draft`, `status:ready-for-dev`, `status:in-progress`, `status:review` etc.). Utilize exclusivamente as 14 labels de natureza/classificação definidas na Etapa 1 (`uc12`, `type:*`, `layer:*`, `priority:*`).
> 4. **Transparência sobre Execução Real:** Este roteiro orienta a execução manual pela equipe. **Nenhuma alteração descrita abaixo foi executada automaticamente no GitHub.**

---

## 7.1 Roteiro Operacional Sequencial de Atualização no GitHub (12 Etapas)

### Etapa 1 — Conferir a existência das Issues no GitHub
1. Acesse a aba **Issues** do repositório do projeto CeliLac no GitHub.
2. Verifique se a Issue principal (`[UC12] Cadastrar Produto`) e todas as 8 Sub-Issues (`SUB-01` a `SUB-08`) definidas na Etapa 1 já estão criadas:
   - `[UC12] Cadastrar Produto` (`EPIC-UC12`)
   - `[UC12][Domínio] Modelar entidade Product` (`SUB-01`)
   - `[UC12][Contratos] Criar DTO de cadastro de produto` (`SUB-02`)
   - `[UC12][Validação] Implementar validações de dados e regras de negócio do produto` (`SUB-03`)
   - `[UC12][Persistência] Configurar persistência e implementar repositório de produtos` (`SUB-04`)
   - `[UC12][Aplicação] Implementar serviço de aplicação para cadastro de produto` (`SUB-05`)
   - `[UC12][HTTP] Criar endpoint POST /products` (`SUB-06`)
   - `[UC12][Testes] Implementar testes automatizados para o cadastro de produto` (`SUB-07`)
   - `[UC12][Documentação] Atualizar documentação técnica do cadastro de produtos` (`SUB-08`)
3. Anote o número real (`#ID`) gerado pelo GitHub para cada uma das 9 Issues. *(Caso alguma ainda não tenha sido cadastrada pela equipe na etapa anterior, cadastre-a usando exatamente o texto do Artefato 3 e Artefato 4 da Etapa 1, sem duplicar Issues já existentes).*

### Etapa 2 — Conferir o vínculo das Sub-Issues à Issue principal
1. Abra a Issue principal `[UC12] Cadastrar Produto`.
2. Verifique se as 8 Sub-Issues (`SUB-01` a `SUB-08`) estão vinculadas como **Sub-issues** nativas do GitHub ou referenciadas na seção `Relação das Sub-Issues Planejadas` com seus números reais (ex.: `- [ ] #11 [UC12][Domínio] Modelar entidade Product`).
3. Caso ainda constem apenas os códigos provisórios (`SUB-01` a `SUB-08`), edite o corpo da Issue principal para incluir o `#ID` real ao lado de cada identificador preservado (ex.: `- [ ] **SUB-01 (#11):** [UC12][Domínio] Modelar entidade Product`).

### Etapa 3 — Verificar as permissões necessárias (Sem excesso de privilégios)
1. O administrador autorizado do repositório (no cenário de teste, `Bruno Oliveira Santos / @bruno-oliveira`, ou o professor/proprietário real do repositório) deve verificar em **Settings > Collaborators and teams** se todos os 4 integrantes possuem acesso **`Write`** ao repositório e acesso **`Write`** ao GitHub Project (conforme **Artefato 02**).
2. Certifique-se de que **nenhum integrante receba permissão `Admin` sem necessidade ou autorização**. Estudantes sem permissão administrativa não devem tentar alterar configurações restritas.

### Etapa 4 — Atualizar os Assignees (Responsáveis pela Execução)
1. Em cada uma das 8 Sub-Issues, selecione no painel lateral direito o campo **Assignees** e atribua o integrante responsável conforme o **Artefato 03**:
   - `SUB-01` e `SUB-05` → **Ana Clara Souza** (`@anaclara-dev`) *(ou integrante real 1)*
   - `SUB-03` e `SUB-04` → **Bruno Oliveira Santos** (`@bruno-oliveira`) *(ou integrante real 2)*
   - `SUB-02` e `SUB-06` → **Carla Mendes Ferreira** (`@carlamendes`) *(ou integrante real 3)*
   - `SUB-07` e `SUB-08` → **Diego Costa Almeida** (`@diego-almeida`) *(ou integrante real 4)*
   - `EPIC-UC12` → **Carla Mendes Ferreira** (`@carlamendes`) e **Ana Clara Souza** (`@anaclara-dev`)
2. Edite o item `8. Responsável` no corpo Markdown de cada Sub-Issue, substituindo `"A definir"` pelo nome e `@usuario` do responsável pela execução.

### Etapa 5 — Registrar os Revisores Designados em cada Sub-Issue
1. Como o campo *Reviewers* nativo do GitHub existe apenas em Pull Requests (e **não se deve confundir revisão de Issue com revisão de Pull Request**), registre o **Revisor Designado da Issue** diretamente no item `8. Responsável` da descrição de cada Sub-Issue, logo abaixo do *Assignee*, utilizando o seguinte padrão:
   ```markdown
   ## 8. Responsáveis
   - **Responsável pela execução (Assignee):** [Nome (@usuario)]
   - **Revisor designado da Issue:** [Nome (@usuario)]
   ```
2. Aplique a distribuição de revisores definida no **Artefato 03**:
   - `SUB-01` e `SUB-07` → Revisor: **Bruno Oliveira Santos** (`@bruno-oliveira`)
   - `SUB-03` e `SUB-04` → Revisora: **Ana Clara Souza** (`@anaclara-dev`)
   - `SUB-05` e `SUB-08` → Revisora: **Carla Mendes Ferreira** (`@carlamendes`)
   - `SUB-02` e `SUB-06` → Revisor: **Diego Costa Almeida** (`@diego-almeida`)

### Etapa 6 — Registrar os comentários técnicos de revisão preliminar
1. Acesse cada Sub-Issue (`SUB-01` a `SUB-08`) no GitHub.
2. Copie o bloco correspondente da **Seção 5.1 do Artefato 05** (`02-05-comentarios-github.md`) e publique-o como comentário na respectiva Issue para documentar formalmente os pontos de revisão levantados na pré-análise.

### Etapa 7 — Corrigir descrições e critérios de aceite (Atendimento aos pontos de revisão)
1. A equipe (liderada tecnicamente por `Ana Clara` e coordenada por `Carla`) deve consultar a especificação original do projeto CeliLac para esclarecer as 4 pendências documentais:
   - Lista completa de atributos e tipos de `Product`;
   - Critérios exatos de validação de `nome` (`RN01`) e `preço` (`RN02`);
   - Regra de autorização do ator principal na rota `POST /products`;
   - Códigos de status HTTP e formato JSON de resposta/erro (`RF05`, `FA01`, `FA02`, `FE01`).
2. Cada *Assignee* deve editar a descrição e os critérios de aceite de suas Sub-Issues (`SUB-01` a `SUB-08`) incorporando essas confirmações, conforme recomendado no **Artefato 04**.

### Etapa 8 — Atualizar dependências com referências reais (`#ID`)
1. Edite a seção `6. Dependências` das Sub-Issues `SUB-03` a `SUB-08` para acrescentar os números reais das Issues no GitHub (ex.: `Depende de SUB-01 (#11) e SUB-02 (#12)`).
2. Na `SUB-03`, registre explicitamente a camada definida para as validações (Domínio e/ou Aplicação), eliminando a ambiguidade `"e/ou"`.

### Etapa 9 — Executar a revisão cruzada humana e aplicar a Definition of Ready (DoR)
1. Após o *Assignee* concluir os ajustes das Etapas 7 e 8 em uma Sub-Issue, o **Revisor Designado** (sempre diferente do *Assignee*) deve inspecionar a Issue atualizada.
2. O Revisor Designado deve copiar o **Modelo da Seção 5.2 do Artefato 05**, preenchê-lo com sua avaliação real e publicá-lo como comentário na Issue.
3. Confira se as 7 condições da **Definition of Ready (`DoR-01` a `DoR-07`)** do **Artefato 06** passaram a ser integralmente atendidas (`Atende`).

### Etapa 10 — Atualizar o campo Status do GitHub Project (`Backlog` vs. `Ready`)
1. Acesse o **GitHub Project** existente criado na Etapa 1.
2. **Enquanto a revisão humana (`DoR-07`) e as confirmações da especificação (`DoR-05`) ainda estiverem pendentes:**
   - Posicione/mantenha `EPIC-UC12` e **todas as 8 Sub-Issues (`SUB-01` a `SUB-08`)** na coluna **`Backlog`** (corrigindo a posição de `SUB-01` e `SUB-02` caso estivessem em `Ready` sem revisão humana).
3. **Somente após uma Sub-Issue atender 100% de `DoR-01` a `DoR-07` (com comentário de revisão humana publicado e especificações confirmadas):**
   - Mova a Sub-Issue aprovada da coluna **`Backlog`** para a coluna **`Ready`** (iniciando por `SUB-01` e `SUB-02`, e avançando as demais conforme seus contratos e revisões forem concluídos).
4. **Não mova nenhuma Issue para `In Progress`, `In Review` ou `Done` nesta etapa.**

### Etapa 11 — Conferir a consistência do Board e das Labels
1. No GitHub Project, verifique se existem **exatamente as 5 colunas**: `Backlog`, `Ready`, `In Progress`, `In Review` e `Done` (sem colunas `Todo` ou `No Status`).
2. Verifique se todas as 9 Issues possuem exclusivamente as labels de natureza da atividade (`uc12`, `type:*`, `layer:*`, `priority:*`) e confirme a **ausência total de labels de status** (`status:*`).

### Etapa 12 — Registrar as pendências restantes na Issue Principal
1. Caso alguma confirmação da especificação original ainda dependa de validação externa (ex.: esclarecimento com o professor da disciplina), adicione um comentário na Issue principal (`EPIC-UC12`) listando as pendências remanescentes e mantendo as Sub-Issues afetadas em `Backlog` até a resolução.

---

## 7.2 Quadro Resumo de Estado Atual vs. Ação Requerida no GitHub Project

| ID da Issue | Assignee a Cadastrar | Revisor a Cadastrar na Descrição | Labels a Preservar (Sem Labels de Status) | Status no Project ANTES da Revisão Humana | Condição para Mover para `Ready` |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **EPIC-UC12** | `@carlamendes`, `@anaclara-dev` | Equipe | `uc12`, `type:epic`, `priority:high` | **`Backlog`** | Permanece em `Backlog` como item agrupador até o início da implementação. |
| **SUB-01** | `@anaclara-dev` | `@bruno-oliveira` | `uc12`, `type:feature`, `layer:domain`, `priority:high` | **`Backlog`** | Confirmar atributos de `Product` (`DoR-05`) + Comentário de revisão humana de `@bruno-oliveira` (`DoR-07`). |
| **SUB-02** | `@carlamendes` | `@diego-almeida` | `uc12`, `type:feature`, `layer:application`, `priority:high` | **`Backlog`** | Confirmar campos do DTO de entrada/saída (`DoR-05`) + Comentário de revisão humana de `@diego-almeida` (`DoR-07`). |
| **SUB-03** | `@bruno-oliveira` | `@anaclara-dev` | `uc12`, `type:feature`, `layer:domain`, `layer:application`, `priority:high` | **`Backlog`** | Confirmar limites de `RN01`/`RN02` e camada (`DoR-05`) + Revisão humana de `@anaclara-dev` (`DoR-07`). |
| **SUB-04** | `@bruno-oliveira` | `@anaclara-dev` | `uc12`, `type:feature`, `layer:persistence`, `priority:high` | **`Backlog`** | Confirmar atributos/colunas de `Product` (`DoR-05`) + Revisão humana de `@anaclara-dev` (`DoR-07`). |
| **SUB-05** | `@anaclara-dev` | `@carlamendes` | `uc12`, `type:feature`, `layer:application`, `priority:high` | **`Backlog`** | Definir contrato de falhas/exceções (`DoR-05`) + Revisão humana de `@carlamendes` (`DoR-07`). |
| **SUB-06** | `@carlamendes` | `@diego-almeida` | `uc12`, `type:feature`, `layer:http`, `priority:medium` | **`Backlog`** | Confirmar status HTTP e permissão do ator (`DoR-05`) + Revisão humana de `@diego-almeida` (`DoR-07`). |
| **SUB-07** | `@diego-almeida` | `@bruno-oliveira` | `uc12`, `type:test`, `layer:tests`, `priority:high` | **`Backlog`** | Confirmar parâmetros de teste de `RN01`/`RN02`/HTTP (`DoR-05`) + Revisão humana de `@bruno-oliveira` (`DoR-07`). |
| **SUB-08** | `@diego-almeida` | `@carlamendes` | `uc12`, `type:docs`, `layer:docs`, `priority:low` | **`Backlog`** | Definir arquivo alvo e contratos finais (`DoR-05`) + Revisão humana de `@carlamendes` (`DoR-07`). |

