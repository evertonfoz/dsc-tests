# ARTEFATO 04-03 — PREPARAÇÃO DA BRANCH DE TRABALHO

## 1. Identificação e Rastreabilidade

- **Caso de Uso:** `UC12 — Cadastrar Produto`
- **Issue Relacionada (Planejamento):** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto`
- **Número e URL Real da Issue no GitHub:** **Issue #10** (`https://github.com/evertonfoz/dsc-tests/issues/10`)
- **Nome da Branch de Trabalho:** `feature/uc12-07-product-registration-test`
- **Convenção Utilizada:** `<tipo>/<caso-de-uso>-<sub-issue>-<descricao-curta>` (`feature/uc12-07-product-registration-test`, alinhada à referência didática do Material 04)
- **Branch de Origem (Base):** `main` (commit `cb70436c466de451b5e8d4c261ad863223715d88`)
- **Cenário Executado:** **Cenário A — Branch ainda inexistente localmente e no GitHub.**

---

## 2. Procedimento Executado e Evidências Reais

### 2.1 Criação da Branch Local e Publicação com Configuração de Upstream

Como a branch `feature/uc12-07-product-registration-test` não existia em `origin`, foi executado exclusivamente o procedimento do **Cenário A** a partir da branch `main` sincronizada:

**Comandos executados:**
```bash
git switch -c feature/uc12-07-product-registration-test
git push -u origin feature/uc12-07-product-registration-test
```

**Saída real obtida:**
```text
Switched to a new branch 'feature/uc12-07-product-registration-test'
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
remote: 
remote: Create a pull request for 'feature/uc12-07-product-registration-test' on GitHub by visiting:        
remote:      https://github.com/evertonfoz/dsc-tests/pull/new/feature/uc12-07-product-registration-test        
remote: 
To https://github.com/evertonfoz/dsc-tests.git
 * [new branch]      feature/uc12-07-product-registration-test -> feature/uc12-07-product-registration-test
branch 'feature/uc12-07-product-registration-test' set up to track 'origin/feature/uc12-07-product-registration-test'.
```

### 2.2 Verificação da Branch Ativa, Upstream e Status

**Comandos executados:**
```bash
git branch --show-current
git branch -vv
git status
```

**Saída real obtida:**
```text
feature/uc12-07-product-registration-test
* feature/uc12-07-product-registration-test cb70436 [origin/feature/uc12-07-product-registration-test] Projeto de preparação
  main                                      cb70436 [origin/main] Projeto de preparação
On branch feature/uc12-07-product-registration-test
Your branch is up to date with 'origin/feature/uc12-07-product-registration-test'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	../celilac-backend/.vscode/
	.vscode/
	prompts/

nothing added to commit but untracked files present (use "git add" to track)
```

---

## 3. Explicação Técnica do Upstream

O parâmetro `-u` (ou `--set-upstream`) no comando `git push -u origin feature/uc12-07-product-registration-test` cria o vínculo de rastreamento (*tracking reference*) entre a branch local `feature/uc12-07-product-registration-test` e a branch remota `origin/feature/uc12-07-product-registration-test`.

Conforme comprovado pela saída de `git branch -vv`:
- `* feature/uc12-07-product-registration-test cb70436 [origin/feature/uc12-07-product-registration-test]`

Esse vínculo permite que futuros comandos `git push`, `git pull` e `git status` saibam automaticamente com qual ramificação remota comparar e sincronizar os commits, sem necessidade de repetir os argumentos `origin <nome-da-branch>`.

---

## 4. Situação Final da Preparação da Branch

- **Branch ativa confirmada:** `feature/uc12-07-product-registration-test`
- **Upstream configurado:** `origin/feature/uc12-07-product-registration-test`
- **Integridade da `main` preservada:** A branch `main` permaneceu intacta no commit `cb70436`. Todas as alterações subsequentes da Fase RED ocorrerão isoladamente na branch de trabalho.

