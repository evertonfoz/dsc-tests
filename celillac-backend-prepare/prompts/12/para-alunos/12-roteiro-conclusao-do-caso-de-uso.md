# Roteiro Passo a Passo para Conclusão Formal do Caso de Uso

**Modelo para o projeto da sua equipe** · Pós-Material 12 (encerramento técnico, revisão humana, integração de Pull Requests e governança no GitHub)

> Este roteiro é um **modelo**. Os valores entre `<...>` devem ser substituídos pelos **números e nomes reais do seu repositório**. Para gerar uma versão já preenchida com os dados do seu projeto, use o prompt `12-prompt-roteiro-conclusao-do-caso-de-uso.md`.
> Como referência, o projeto CeliLac (UC12 — Cadastrar Produto, Epic #1) tem uma pilha de 6 PRs; o seu projeto pode ter outra quantidade.

---

## 0. Preencha a tabela do seu projeto

| Placeholder | O que é | Valor no seu projeto | Exemplo (CeliLac) |
|---|---|---|---|
| `<EPIC>` | nº da Issue principal (Epic) | | `1` |
| `<SUBS>` | nºs das Sub-Issues | | `4` a `11` e `16` |
| `<PRS>` | nºs dos PRs, **da base ao topo** da pilha | | `12, 13, 14, 15, 17, 19` |
| `<PRINCIPAL>` | branch principal | | `main` |
| `<PR_TOPO>` | último PR da pilha | | `19` |
| `<PROJECT>` | GitHub Project da equipe | | `Project #6` |

Descubra os números reais com:
```bash
gh issue list --limit 50 --state all
gh pr list --state all --json number,title,headRefName,baseRefName,isDraft,state
```

---

## 1. Visão geral: o caso de uso já está concluído?

A resposta divide-se em **duas dimensões**.

### 1.1. Dimensão técnica e didática (Materiais 01 a 12)
Está **concluída** quando todo o código, infraestrutura, contratos e testes exigidos estão implementados **e comprovados com evidências reais**. Monte a sua tabela:

| Critério / Entrega | Status | Evidência no repositório |
| :--- | :---: | :--- |
| `CA01` … `CA0N` (um por critério de aceite da Epic) | | |
| Persistência e infraestrutura containerizada | | |
| Contrato HTTP estabilizado e testado | | |
| Auditoria arquitetural (Material 12) | | `12-01` a `12-08` (Cenário A ou B) |

> Marque como concluído **somente o que tiver evidência**. Se algo estiver pendente, registre como pendente.

### 1.2. Dimensão de governança no GitHub (Epic): pendente de encerramento formal
A Epic **não deve ser encerrada automaticamente**. O trabalho técnico costuma estar distribuído em branches com **PRs ainda em rascunho (Draft)**. Para o caso de uso passar a **Done / Closed** com rastreabilidade completa, siga os 6 passos abaixo, **um a um**.

---

## 2. Mapa da cadeia de Pull Requests (*Stacked PRs*)

Em fluxos de PRs empilhados, cada PR aponta para a branch do anterior. Desenhe a **sua** pilha a partir do resultado de `gh pr list`:

```text
<PRINCIPAL>
 └── PR #<A>: <branch-A>   (Material <x> — <o que entrega>)
      └── PR #<B>: <branch-B>   (Material <y> — <o que entrega>)
           └── PR #<C>: <branch-C>   (Material <z> — <o que entrega>)
```

> Se o seu projeto **não** tem PRs empilhados (por exemplo, há um único PR, ou tudo já foi integrado), **pule o Passo 4 em cadeia** e faça apenas o merge do PR existente, mantendo os Passos 1 a 3, 5 e 6.
> PRs independentes da cadeia (por exemplo, de manutenção) devem ser tratados à parte.

---

## 3. Passo a passo para o encerramento formal

### Passo 1 — Publicar o parecer arquitetural do Material 12 (e decidir sobre versionar os artefatos)

**O que e por quê:** registrar o resultado da auditoria no histórico do GitHub, para que o revisor encontre a fundamentação da decisão (refatorar ou preservar).

**CLI (`gh`):**
```bash
gh pr comment <PR_TOPO> --body-file <DIR_M12>/12-08-revisao-github-checklist.md
```
*(Ou cole a seção de parecer técnico do `12-08` como comentário na página do PR.)*

**Opcional — versionar os artefatos dos Materiais 11 e 12** (se o professor/equipe quiser que façam parte do repositório):
```bash
git checkout <branch-do-PR-topo>
git status -sb
git add <DIR_M11> <DIR_M12>
git commit -m "docs: add Material 11 and 12 artifacts (refs #<SUB-docs>, refs #<EPIC>)"
git push origin <branch-do-PR-topo>
```
> Inspecione `git status` e **não versione `.env`, senhas ou dumps**.

---

### Passo 2 — Retirar os PRs do modo Draft (*Ready for review*)

**O que e por quê:** os PRs foram criados como rascunho para impedir merges prematuros durante as aulas. O primeiro ato da revisão final é marcá-los como prontos.

**CLI (`gh`)** — um comando por PR da pilha:
```bash
gh pr ready <PR-1>
gh pr ready <PR-2>
# ... até o último PR da pilha
```
**Interface Web:** abra cada PR, role até a caixa de merge e clique em **"Ready for review"**.

---

### Passo 3 — Realizar a revisão técnica humana (*Code Review*)

**O que e por quê:** o fluxo colaborativo exige que uma pessoa revise código, contratos e evidências. **Nunca declare uma aprovação que não aconteceu.**

**Interface Web (em cada PR):**
1. Aba **"Files changed"**.
2. Confira que **não há** `.env`, senhas expostas ou alterações fora do escopo.
3. Clique em **"Review changes"** (canto superior direito).
4. Escreva o parecer (contratos e testes confirmados) e selecione **"Approve"** — ou **"Comment"** se você for o autor do PR (o GitHub **não permite auto-aprovação**) — e clique em **"Submit review"**.

---

### Passo 4 — Merge sequencial seguro da cadeia de PRs até a branch principal

> [!WARNING]
> **Cuidado crítico com *Stacked PRs*:** ao fazer merge de um PR, **NÃO apague a branch dele (`--delete-branch`) antes de redirecionar o PR seguinte para a branch principal.** Se a branch **base** de um PR aberto for apagada, o GitHub **fecha automaticamente** o PR seguinte.

Siga a ordem **da base ao topo**. Para cada elo `N` com seguinte `N+1`:

```bash
# 1. Integra o PR N na branch principal (SEM deletar a branch)
gh pr merge <N> --merge

# 2. Redireciona o PR seguinte para a branch principal
gh pr edit <N+1> --base <PRINCIPAL>
```

Para o **último** PR da pilha, faça apenas o merge e atualize sua cópia local:
```bash
gh pr merge <PR_TOPO> --merge
git checkout <PRINCIPAL>
git pull origin <PRINCIPAL>
```

**Valide a branch principal** com os **scripts reais** do seu `package.json`:
```bash
pnpm build
pnpm lint
pnpm test
pnpm test:integration     # exige o banco de TESTES ativo
```
**Esperado:** build e lint sem erros; testes aprovados com os números **obtidos agora**. Só depois dessa validação é seguro apagar as branches antigas, se desejar.

> Não execute `test:e2e` se ele conectar ao banco de desenvolvimento sem ter confirmado o impacto (veja o guia de verificação do Material 12).

---

### Passo 5 — Fechar as Sub-Issues e atualizar o GitHub Project

**O que e por quê:** com o código na branch principal, cada Sub-Issue deve ser fechada com um comentário de **rastreabilidade** que aponte para o PR correspondente, e o cartão deve estar em **Done**.

Monte a **sua** tabela:

| Sub-Issue | Escopo | PR / evidência de conclusão |
| :--- | :--- | :--- |
| `#<n>` | entidade de domínio | PR `#<x>` |
| `#<n>` | DTO de entrada/saída | PR `#<x>` |
| `#<n>` | validações | PR `#<x>` |
| `#<n>` | persistência e repositório | PR `#<x>` |
| `#<n>` | serviço de aplicação | PR `#<x>` |
| `#<n>` | endpoint HTTP | PR `#<x>` |
| `#<n>` | testes automatizados | PRs `#<x>`, `#<y>` |
| `#<n>` | documentação | artefatos dos Materiais 01 a 12 |
| `#<n>` | containerização | PR `#<x>` |

**CLI (`gh`)** — um comando por Sub-Issue, com mensagem real:
```bash
gh issue close <SUB> --comment "Concluído: <entrega> integrada à <PRINCIPAL> (PR #<x>)."
```
Depois, confira no **GitHub Project** se todos os cartões das Sub-Issues estão na coluna **Done**.

> Feche **somente** Sub-Issues cujos critérios de aceite foram atendidos e cujo PR **já foi integrado**.

---

### Passo 6 — Marcar os checkboxes e encerrar formalmente a Epic

Somente **após** os Passos 1 a 5:

1. Abra a Epic (`#<EPIC>`) no navegador.
2. Marque todos os checkboxes: as **Sub-Issues planejadas** e os **Critérios Gerais de Aceite** (`CA..`).
3. Registre o comentário final e feche a Epic:
```bash
gh issue close <EPIC> --comment "Epic concluída após os Materiais 01 a 12: Sub-Issues (#<...>) implementadas, revisadas e integradas à <PRINCIPAL>; critérios CA01 a CA0N verificados por testes automatizados e auditoria arquitetural documentada."
```
4. No **GitHub Project**, confirme que o cartão da Epic foi movido para **Done**.

---

## 4. Lista de conferência final

- [ ] Parecer arquitetural publicado no PR (Passo 1)
- [ ] Todos os PRs fora do modo Draft (Passo 2)
- [ ] Revisão humana realizada e registrada (Passo 3)
- [ ] Merge sequencial **sem apagar branches base antes do redirecionamento** (Passo 4)
- [ ] Branch principal validada (build, lint, testes) (Passo 4)
- [ ] Sub-Issues fechadas com comentário de rastreabilidade (Passo 5)
- [ ] Cartões em **Done** no GitHub Project (Passos 5 e 6)
- [ ] Checkboxes da Epic marcados e Epic encerrada (Passo 6)

> Em qualquer passo, **não** execute merge, feche Issues ou declare aprovações que ainda não aconteceram.
