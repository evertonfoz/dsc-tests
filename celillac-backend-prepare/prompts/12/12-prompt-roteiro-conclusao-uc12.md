# ASSISTENTE DE GOVERNANÇA E ENCERRAMENTO DO CASO DE USO (PÓS-MATERIAL 12)

## Objetivo da Solicitação
Após a conclusão do **Material 12 — Auditoria Arquitetural e Refatoração Orientada por Evidências** (`prompts/12/artefatos/12-01` a `12-08`), avalie o estado completo do caso de uso **`UC12 — Cadastrar Produto`** no projeto **CeliLac** (`evertonfoz/dsc-tests`) e gere o arquivo:

`prompts/12/12-roteiro-conclusao-uc12.md`

Esse documento deve responder com precisão se o `UC12` já está concluído e fornecer um **roteiro prático, sequencial e detalhado** (com comandos de terminal `gh` / `git` e instruções para a interface Web do GitHub) para que o estudante realize o fechamento formal de governança sem perder rastreabilidade nem fechar Pull Requests acidentalmente.

---

## 1. Inspeção Obrigatória Antes de Gerar o Roteiro

Antes de redigir o arquivo `prompts/12/12-roteiro-conclusao-uc12.md`, inspecione o ambiente real para garantir que todos os números de Issues, Pull Requests e nomes de branches estejam exatos:

1. **Especificação e Epic do Caso de Uso:**
   - Leia `prompts/uc-12.md`.
   - Consulte a Issue principal `EPIC-UC12` (`gh issue view 1`) e identifique as Sub-Issues planejadas (`SUB-01` a `SUB-08`, além da `SUB-09` de containerização), os Critérios Gerais de Aceite (`CA01` a `CA05`) e as **Condições de Conclusão**.
2. ** Artefatos do Material 12:**
   - Verifique os arquivos em `prompts/12/artefatos/12-01-diagnostico-arquitetura.md` a `12-08-revisao-github-checklist.md`.
3. **Estado real no GitHub:**
   - Liste as Issues (`gh issue list --limit 30 --state all`).
   - Liste os Pull Requests abertos com suas branches de origem (`headRefName`) e destino (`baseRefName`), bem como o status de rascunho (`isDraft`):
     ```bash
     gh pr list --state open --json number,title,headRefName,baseRefName,isDraft
     ```

---

## 2. Estrutura Obrigatória do Arquivo `prompts/12/12-roteiro-conclusao-uc12.md`

O arquivo gerado deverá conter obrigatoriamente as seguintes seções:

### Seção 1 — Visão Geral: O UC12 já está concluído?
Explique a distinção entre as duas dimensões do projeto:
1. **Dimensão Técnica e Didática (Materiais 01 a 12 — Concluída):**
   - Apresente uma tabela relacionando `CA01`, `CA02`, `CA03`, `CA04`, `CA05`, a persistência/containerização e a auditoria arquitetural do Material 12 com as evidências concretas já validadas no repositório.
2. **Dimensão de Governança no GitHub (`EPIC-UC12` Issue #1 — Pendente de Encerramento Formal):**
   - Explique por que a Epic não deve ser encerrada automaticamente antes da revisão humana, da integração sequencial dos Draft PRs na `main` e do fechamento rastreável das Sub-Issues.

### Seção 2 — Mapa Atual da Cadeia de Pull Requests (*Stacked PRs*)
- Represente visualmente a árvore/pilha real de branches e Pull Requests abertos a partir da `main` (ex.: `main ← PR #12 ← PR #13 ← PR #14 ← PR #15 ← PR #17 ← PR #19`), identificando a qual etapa/material cada PR pertence.

### Seção 3 — Passo a Passo Operacional para o Aluno (6 Passos)
Detalhe cada passo explicando **o que fazer**, **por que fazer** e **como fazer** (tanto via CLI `gh`/`git` quanto via interface Web do GitHub):

- **Passo 1 — Publicar o Parecer Arquitetural do Material 12 e decidir sobre o versionamento dos artefatos:**
  - Comando `gh pr comment` para registrar o parecer técnico de `12-08-revisao-github-checklist.md` no PR do Material 11/12 (`#19`).
  - Comandos `git add`, `git commit` e `git push` opcionais caso o aluno/professor deseje versionar `prompts/11` e `prompts/12` na branch antes do merge.
- **Passo 2 — Retirar os Pull Requests do modo `Draft` (*Ready for Review*):**
  - Comandos `gh pr ready` para cada PR da pilha e instruções equivalentes no botão *"Ready for review"* da interface Web.
- **Passo 3 — Realizar a Revisão Técnica Humana (*Code Review*):**
  - Instruções passo a passo para inspecionar a aba *"Files changed"*, verificar a ausência de `.env` ou segredos e submeter o parecer em *"Review changes"*.
- **Passo 4 — Executar o Merge Sequencial Seguro da Cadeia de PRs até a `main`:**
  - Inclua um alerta de destaque (`> [!WARNING]`) explicando o risco clássico de *Stacked PRs* no GitHub: **não deletar a branch base (`--delete-branch`) antes de redirecionar o PR seguinte para a `main`**, pois deletar a branch base fecha automaticamente o PR dependente.
  - Forneça a sequência exata de comandos para cada elo da cadeia (`gh pr merge <N> --merge` seguido de `gh pr edit <N+1> --base main`), a atualização da `main` local (`git checkout main && git pull origin main`) e a bateria final de validação na `main` (`pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:integration`).
- **Passo 5 — Concluir e Fechar as Sub-Issues e Atualizar o GitHub Project:**
  - Apresente uma tabela mapeando cada Sub-Issue (`#4` a `#11` e `#16`) à sua entrega e ao PR correspondente.
  - Forneça os comandos `gh issue close <ID> --comment "..."` com mensagens de rastreabilidade claras e oriente a conferência da coluna **`Done`** no GitHub Project.
- **Passo 6 — Marcar os Checkboxes e Encerrar Formalmente a `EPIC-UC12` (Issue #1):**
  - Oriente a marcação dos checkboxes de `SUB-01..08` e `CA01..05` na Issue #1, o comando `gh issue close 1 --comment "..."` e a confirmação do card da Epic em **`Done`** no GitHub Project.

---

## 3. Restrições
- **Não** execute merges reais nos Pull Requests nem feche Issues automaticamente durante a geração do guia; o objetivo é produzir o documento orientador para que o estudante conduza e compreenda o fechamento.
- Utilize apenas dados reais verificados no repositório e no GitHub.
