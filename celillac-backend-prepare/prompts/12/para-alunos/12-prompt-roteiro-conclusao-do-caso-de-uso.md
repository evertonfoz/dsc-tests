# Assistente de Governança e Encerramento do Caso de Uso (Pós-Material 12)

## Objetivo da Solicitação

Após concluir o **Material 12 — Auditoria Arquitetural e Refatoração Orientada por Evidências**, avalie o estado completo do **caso de uso do meu projeto** e gere, no diretório que eu informar, o arquivo:

`roteiro-conclusao-<caso-de-uso>.md` (por exemplo, `12-roteiro-conclusao-uc12.md`)

Esse documento deve responder com precisão **se o meu caso de uso já está concluído** e fornecer um **roteiro prático, sequencial e detalhado** (com comandos `gh` / `git` e instruções para a interface Web do GitHub) para que eu realize o fechamento formal de governança **sem perder rastreabilidade e sem fechar Pull Requests acidentalmente**.

> **Referência didática:** no projeto CeliLac (`evertonfoz/dsc-tests`, UC12 — Cadastrar Produto) a Epic é a Issue #1 e há uma pilha de Draft PRs. Esses números são **exemplos**. O meu projeto tem **os seus próprios** números de Issues, PRs e branches, que você deve **descobrir no meu repositório**.

---

## 0. Antes de começar — peça-me estas informações (se ainda não as tiver)

1. **Repositório** (`dono/nome`) e a branch atual de trabalho.
2. **Diretório** onde devo gravar o roteiro e onde estão os artefatos `12-01` a `12-08`.
3. Confirmação de que a CLI `gh` está instalada e autenticada (`gh auth status`) — **ou** me diga que farei tudo pela interface Web.

---

## 1. Inspeção obrigatória antes de gerar o roteiro

Inspecione o ambiente **real** para que todos os números de Issues, PRs e nomes de branches estejam exatos. **Não invente números.**

1. **Especificação e Epic do caso de uso:**
   - Leia o documento de especificação do caso de uso do meu projeto.
   - Consulte a Issue principal (Epic): `gh issue view <N>`; identifique as **Sub-Issues planejadas**, os **Critérios Gerais de Aceite** e as **Condições de Conclusão**.
2. **Artefatos do Material 12:** leia os oito arquivos `12-01` a `12-08` e identifique o cenário concluído (A — refatoração, ou B — preservação).
3. **Estado real no GitHub:**
   ```bash
   gh issue list --limit 50 --state all
   gh pr list --state all --json number,title,headRefName,baseRefName,isDraft,state,mergedAt
   ```
   Reconstrua a **cadeia real** de branches e PRs (quem aponta para quem).
4. **GitHub Project:** identifique o quadro e as colunas efetivamente usadas pela equipe.

---

## 2. Estrutura obrigatória do arquivo gerado

### Seção 1 — Visão geral: o caso de uso já está concluído?
Explique as **duas dimensões**:
1. **Dimensão técnica e didática (Materiais 01 a 12):** tabela que relaciona cada Critério de Aceite (`CA..`), a persistência/containerização e a auditoria do Material 12 com as **evidências concretas já validadas** no repositório. **Marque como concluído apenas o que tiver evidência real.**
2. **Dimensão de governança no GitHub (Epic):** explique por que a Epic **não deve ser encerrada automaticamente** antes da revisão humana, da integração dos PRs na branch principal e do fechamento rastreável das Sub-Issues.

### Seção 2 — Mapa atual da cadeia de Pull Requests
Represente visualmente a árvore real a partir da branch principal (ex.: `main ← PR #A ← PR #B ← PR #C`), identificando a qual Material/etapa cada PR pertence. Se **não houver** PRs empilhados (por exemplo, tudo já está na `main`, ou há um único PR), **adapte o roteiro** a essa realidade e diga isso explicitamente.

### Seção 3 — Passo a passo operacional (6 passos)
Para cada passo, explique **o que fazer**, **por que fazer** e **como fazer** (CLI `gh`/`git` **e** interface Web):

- **Passo 1 — Publicar o parecer arquitetural do Material 12** (e decidir sobre versionar os artefatos): `gh pr comment <PR> --body-file <12-08>`; `git add/commit/push` opcionais.
- **Passo 2 — Retirar os PRs do modo Draft** (`gh pr ready <N>` / botão *Ready for review*).
- **Passo 3 — Realizar a revisão técnica humana:** aba *Files changed*, checar ausência de `.env`/segredos, *Review changes*. Lembrar que o GitHub **não permite auto-aprovação**.
- **Passo 4 — Merge sequencial seguro da cadeia de PRs até a branch principal.** Inclua um alerta `> [!WARNING]` sobre o risco de *Stacked PRs*: **não usar `--delete-branch` antes de redirecionar o PR seguinte para a branch principal**, pois apagar a branch base fecha automaticamente o PR dependente. Dê a sequência exata (`gh pr merge <N> --merge` seguido de `gh pr edit <N+1> --base <principal>`), a atualização da branch local e a bateria final de validação na branch principal (build, lint, testes — usando os **scripts reais** do meu `package.json`).
- **Passo 5 — Concluir e fechar as Sub-Issues e atualizar o GitHub Project:** tabela mapeando cada Sub-Issue à entrega e ao PR; comandos `gh issue close <ID> --comment "..."` com mensagens de rastreabilidade; conferência da coluna **Done**.
- **Passo 6 — Marcar os checkboxes e encerrar formalmente a Epic:** marcar as Sub-Issues e os `CA..` na Epic, `gh issue close <Epic> --comment "..."` e confirmar o card em **Done**.

---

## 3. Restrições

- **Não execute** merges reais nem feche Issues durante a geração: o objetivo é **produzir o documento orientador** para que eu conduza e compreenda o fechamento.
- Utilize **apenas dados reais** verificados no meu repositório e no GitHub. Se algo não puder ser verificado, marque como **"a confirmar"** em vez de supor.
- Não presuma que meu projeto tem a mesma cadeia de PRs, os mesmos números de Issues ou o mesmo nome de branch principal do CeliLac.
- Não declare aprovação humana, merge ou conclusão que ainda não aconteceram.
- Não exponha segredos nos comandos ou no documento.
