# ARTEFATO 02 — MATRIZ DE PERMISSÕES DO GITHUB

> **Aviso de Rastreabilidade e Governança:**
> - **Informação proveniente do planejamento anterior:** Necessidade de gerenciar 1 Issue principal (`EPIC-UC12`), 8 Sub-Issues (`SUB-01` a `SUB-08`), 14 labels padronizadas e 1 GitHub Project com 5 estados (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`).
> - **Decisão proposta pela IA:** Recomendação de níveis de acesso fundamentada no **Princípio do Menor Privilégio** (*Principle of Least Privilege*), diferenciando permissões do repositório e permissões do GitHub Project.
> - **Status real no GitHub:** Nenhuma permissão foi concedida ou alterada automaticamente. Qualquer ajuste depende de ação manual por usuário devidamente autorizado.

---

## 2.1 Referência dos Níveis de Acesso no Repositório GitHub

| Nível de Permissão | Capacidades Principais no Repositório | Aplicação segundo o Princípio do Menor Privilégio |
| :--- | :--- | :--- |
| **Read** | Visualizar código, Issues, Pull Requests, labels e projetos públicos/internos; criar Issues e comentar. Não permite gerenciar labels, atribuir *Assignees* de terceiros ou enviar código (*push*). | Indicado para observadores externos, professores/avaliadores em modo consulta ou partes interessadas que apenas acompanham o andamento. |
| **Triage** | Todas as capacidades de `Read` + gerenciar Issues e Pull Requests (aplicar/remover labels, atribuir *Assignees*, definir milestones, fechar/reabrir Issues). **Não permite criar branches ou alterar código-fonte.** | Indicado para integrantes ou colaboradores cuja atuação restrinja-se exclusivamente à organização e revisão documental de Issues, sem participação na codificação. |
| **Write** | Todas as capacidades de `Triage` + criar branches, realizar *push* em branches de trabalho, abrir e revisar Pull Requests, criar/editar labels e gerenciar vínculos de Sub-Issues. | Indicado para os membros da equipe que atuam na organização/revisão de Issues **e** participarão da futura implementação técnica do caso de uso. |
| **Maintain** | Todas as capacidades de `Write` + gerenciar configurações operacionais do repositório (como regras de proteção de branch não críticas, páginas e tópicos) sem acesso a ações destrutivas ou exclusão do repositório. | Indicado apenas quando há necessidade operacional específica de manutenção de configurações sem conceder controle total (`Admin`). |
| **Admin** | Controle total sobre o repositório, incluindo gerenciamento de colaboradores/permissões, configurações de segurança, integrações e exclusão do repositório. | Restrito **exclusivamente** ao proprietário do repositório ou pessoa formalmente autorizada para administração. Não deve ser concedido por conveniência a coordenadores ou líderes técnicos. |

---

## 2.2 Diferenciação entre Permissões de Repositório e Permissões do GitHub Project

No ecossistema do GitHub (Projects v2), as permissões do **Repositório** e as permissões do **GitHub Project** são independentes:

1. **Permissão no Repositório (`celillac-backend`):** Controla ações sobre os objetos do repositório: criação/edição de Issues, vínculo de Sub-Issues, criação/aplicação de labels, atribuição de *Assignees* e, futuramente, *push* de branches e abertura de Pull Requests.
2. **Permissão no GitHub Project (Quadro do UC12):** Controla ações sobre a visualização e estrutura do quadro Kanban/Table:
   - **Read (Project):** Apenas visualiza os cards e colunas do Project.
   - **Write (Project):** Permite adicionar Issues ao Project, mover cards entre as colunas de `Status` (`Backlog` → `Ready` → `In Progress` → `In Review` → `Done`) e atualizar campos dos itens.
   - **Admin (Project):** Permite criar/alterar campos customizados (como configurar as 5 opções exatas do campo `Status`), gerenciar automações do Project e controlar o acesso de membros ao quadro.

---

## 2.3 Matriz de Permissões Recomendadas por Integrante

| # | Nome (Provisório) | Papel Funcional | Operações Necessárias no Ciclo do UC12 | Permissão de Repositório Recomendada | Necessidade de Acesso ao GitHub Project | Justificativa Técnica (Menor Privilégio) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Ana Clara Souza** (`@anaclara-dev`) | Responsável Técnica; Desenvolvedora; Revisora de Issues | - Editar descrições e critérios de aceite de Issues.<br>- Registrar comentários de revisão técnica (`SUB-03`, `SUB-04`).<br>- Vincular Sub-Issues e atualizar dependências.<br>- Futuramente: criar branches, realizar *commits/push* (`SUB-01`, `SUB-05`) e revisar PRs. | **Write** *(Nota: durante a fase estritamente documental, `Triage` seria suficiente para revisar Issues, mas recomenda-se `Write` por ser também Desenvolvedora das `SUB-01` e `SUB-05`).* | **Write no Project** | Possui todas as permissões necessárias para revisar Issues, ajustar artefatos técnicos, movimentar seus cards no Project e implementar suas tarefas futuras, **sem** necessidade de privilégios `Maintain` ou `Admin` por ser Responsável Técnica. |
| **2** | **Bruno Oliveira Santos** (`@bruno-oliveira`) | Desenvolvedor; Revisor de Issues; Administrador autorizado | - Gerenciar acesso da equipe ao repositório e vincular o GitHub Project ao repositório (operações administrativas autorizadas).<br>- Revisar Issues (`SUB-01`, `SUB-07`) e implementar `SUB-03` e `SUB-04`. | **Admin** *(exclusivamente por já deter autorização prévia de administração do repositório; para suas atividades de desenvolvimento e revisão, `Write` seria suficiente).* | **Admin no Project** *(para criação/vinculação inicial)* ou **Write no Project** *(em operação normal)* | Como detentor autorizado da administração do repositório, mantém `Admin` apenas para configurar colaboradores e vincular o Project. Suas tarefas técnicas de desenvolvimento e revisão utilizam apenas capacidades de nível `Write`. |
| **3** | **Carla Mendes Ferreira** (`@carlamendes`) | Coordenadora; Desenvolvedora; Revisora de Issues | - Organizar Issues, aplicar labels, atribuir *Assignees* e cobrar revisões.<br>- Configurar e manter os 5 estados do campo `Status` no GitHub Project (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`) e posicionar as Issues.<br>- Revisar `SUB-05` e `SUB-08` e implementar `SUB-02` e `SUB-06`. | **Write** *(Não necessita de `Admin` nem `Maintain` no repositório para coordenar a equipe).* | **Admin no Project** *(caso seja a responsável por configurar as 5 colunas do campo `Status`)* ou **Write no Project** *(caso as colunas já estejam criadas)* | O papel de Coordenadora exige gerenciar Issues, labels e *Assignees* no repositório (atendido por `Triage`/`Write`) e organizar o quadro do Project. Não há justificativa técnica para conceder `Admin` no repositório à coordenação. |
| **4** | **Diego Costa Almeida** (`@diego-almeida`) | Desenvolvedor; Revisor de Issues | - Registrar comentários de revisão técnica nas Issues `SUB-02` e `SUB-06`.<br>- Atualizar descrições/critérios das Issues sob sua responsabilidade (`SUB-07`, `SUB-08`).<br>- Futuramente: criar branches e enviar código de testes e documentação. | **Write** | **Write no Project** | `Write` no repositório e no Project atende integralmente à revisão de Issues, atualização de status dos seus itens e futura implementação dos testes (`SUB-07`) e documentação (`SUB-08`), sem privilégios excedentes. |

---

## 2.4 Cenários Alternativos de Menor Privilégio (Caso um Integrante Não Implemente Código)

Para fins de clareza metodológica, caso a equipe decida que algum participante atue **exclusivamente** em funções de gestão, acompanhamento ou revisão de Issues (sem realizar *push* de código ou criação de branches):

- **Apenas Acompanhamento / Consulta:** Permissão **`Read`** no repositório e **`Read`** no GitHub Project.
- **Apenas Organização de Triagem e Revisão de Issues (sem código):** Permissão **`Triage`** no repositório e **`Write`** no GitHub Project.

> **Restrição Operacional Importante:** Nenhum estudante deve tentar alterar configurações administrativas do repositório ou do GitHub Project caso não possua autorização explícita. Se a equipe não tiver acesso `Admin` para configurar colaborações ou campos do Project, deverá solicitar a operação ao administrador autorizado do repositório (ou professor responsável).

