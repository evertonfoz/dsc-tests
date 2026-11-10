# Artefato 02 — Matriz de Permissões do GitHub e Governança de Acesso

## 1. Princípios de Governança e Segurança

Para proteger a integridade do código-fonte, evitar ações acidentais destrutivas e assegurar a rastreabilidade do trabalho colaborativo, a equipe adota rigorosamente o **Princípio do Menor Privilégio (*Least Privilege*)**:
- A cada membro da equipe é atribuído exclusivamente o nível de permissão estritamente indispensável para o cumprimento de suas atribuições práticas cotidianas.
- O privilégio administrativo (`Admin`) é restrito ao mínimo necessário para a configuração inicial e gestão institucional do repositório, não sendo concedido indistintamente por conveniência ou hierarquia.

---

## 2. Níveis Formais de Permissão no Repositório GitHub

O GitHub disponibiliza cinco níveis formais de controle de acesso para colaboradores de repositórios:

1. **`Read` (Leitura):** Permite clonar o repositório, visualizar código, Issues, Discussions e Pull Requests, mas não autoriza a abertura direta de branches ou modificação de arquivos.
2. **`Triage` (Triagem):** Permite gerenciar Issues e Pull Requests (aplicar labels, designar milestones, fechar/reabrir discussões) sem permissão de gravação/push de código.
3. **`Write` (Escrita):** Permite clonar, criar branches de trabalho, efetuar push e abrir Pull Requests. É a permissão padrão para desenvolvedores no dia a dia. Não autoriza alteração de configurações estruturais do repositório.
4. **`Maintain` (Manutenção):** Permite gerenciar branches protegidas, configurar automações (GitHub Actions), editar regras de merge e gerenciar labels e colaboradores sem ter acesso a operações destrutivas ou exclusão do repositório.
5. **`Admin` (Administração):** Acesso irrestrito a todas as capacidades do repositório, incluindo gestão de segredos, deleção de repositório, alteração de visibilidade e concessão de privilégios.

---

## 3. Matriz de Permissões Recomendada por Integrante

A tabela a seguir consolida as atribuições, o escopo operacional e as permissões recomendadas para os integrantes da equipe no repositório e no GitHub Project.

| Nome do Integrante | Papel Funcional na Equipe | Operações Práticas Necessárias no Repositório | Permissão Recomendada no Repositório | Permissão Recomendada no GitHub Project (Board) | Justificativa Técnica e de Segurança |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Ana Silva**<br>(`@anasilva-dev`) | Responsável Técnica (Tech Lead) / Dev Backend | - Criar branches de funcionalidade (`feat/...`);<br>- Submeter Pull Requests e realizar Code Review;<br>- Revisar e configurar regras de branch protection e validações de CI;<br>- Gerenciar labels e marcos técnicos. | **`Maintain`** | **`Admin`** / **`Write`** | O nível `Maintain` concede à liderança técnica autoridade para gerenciar branches protegidas, revisar PRs e supervisionar fluxos sem risco de deleção acidental ou alteração indevida de proprietários do repositório. |
| **Bruno Souza**<br>(`@brunosouza-tech`) | Coordenador de Equipe / Dev Backend | - Gestão inicial e governança de acessos do repositório da equipe;<br>- Criação e ordenação de branches de trabalho;<br>- Submissão de PRs e acompanhamento de revisões;<br>- Governança integral do GitHub Project (Board). | **`Admin`** | **`Admin`** | O nível `Admin` no repositório é restrito ao Coordenador para viabilizar o gerenciamento acadêmico de colaboradores, webhooks e integrações. No Project, o papel `Admin` permite configurar visualizações, campos personalizados e fluxos Kanban. |
| **Carla Mendes**<br>(`@carlamendes-qa`) | Desenvolvedora Backend & QA | - Clonar repositório e rodar suíte de testes;<br>- Criar branches específicas de tarefas (`feat/...`, `test/...`);<br>- Efetuar commits e abrir Pull Requests;<br>- Comentar e validar critérios de aceite em Issues e PRs. | **`Write`** | **`Write`** | Conforme o princípio do menor privilégio, o nível `Write` fornece todas as capacidades necessárias para o ciclo de desenvolvimento, abertura de branches e criação de PRs, blindando o repositório contra edições acidentais em configurações centrais. |

---

## 4. Diferenciação entre Permissões de Repositório e Permissões do GitHub Project

É fundamental destacar a separação de escopos de segurança entre os dois ambientes:

- **Permissões de Repositório:**
  - Controlam o acesso aos artefatos de código, branches, tags, segredos (Secrets), ambientes de deploy e permissões de merge.
  - Regidas pelas regras de *Branch Protection* (ex.: obrigatoriedade de aprovação prévia em PR antes de mesclar em `main`).

- **Permissões do GitHub Project (Projects v2):**
  - Controlam a visualização, movimentação e edição de cartões, colunas e campos customizados na visualização em quadro (Kanban).
  - Um colaborador com permissão de `Write` no repositório necessita de permissão de `Write` no Project para mover cartões de `Backlog` para `Ready`, `In Progress`, etc.

---

## 5. Recomendações de Governança para Branches e Pull Requests

Para salvaguardar a estabilidade do branch principal (`main`):

1. **Proteção da Branch `main`:**
   - Desabilitar push direto na branch `main` para todos os colaboradores.
   - Exigir obrigatoriamente a abertura de Pull Request para integração de qualquer alteração.
2. **Revisão Obrigatória de Código:**
   - Exigir pelo menos 1 aprovação formal (*Code Review*) antes da realização do merge.
   - O autor do PR não pode aprovar seu próprio Pull Request.
3. **Verificação de Status (Status Checks):**
   - Configurar o GitHub Actions para exigir que a suíte de testes e o linter passem com 100% de sucesso antes de liberar o botão de merge.

> **Nota de Governança:**
> Este documento constitui uma recomendação técnica formal de boas práticas de Engenharia de Software. Sua eficácia depende da configuração efetiva das políticas de permissão e regras de branch protection nas abas *Settings* do repositório pelo usuário administrador (`@brunosouza-tech`).

