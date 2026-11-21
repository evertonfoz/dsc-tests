# Prompt de sessão — `method/` portátil (E5, opção i)

> Preparado em 2026-11-21 para ser executado em **nova sessão**, aberta na raiz do `dsc-tests`. Cole o bloco "Prompt" abaixo.
> Origem: decisão da E5, seção 6, opção (i), e seção 6.1 (`etapas/E5-kit-e-github.md`, integrada pelo PR #81). <!-- links:ignore -->
> Escopo fechado: só o que está aqui. Arquivos de prática, gabaritos e o `m02-pratica.md` ficam para a E3, parte 2.

---

## Prompt (copie daqui)

Sessão aberta na raiz do repositório `dsc-tests`. Caminhos relativos a `celilac-backend/`, salvo indicação. Atue em português do Brasil, técnico-acadêmico.

Tarefa: **um PR de conteúdo** que torna a pasta `method/` portátil, para que ela, copiada para o repositório de um aluno (sem `method/didatico/curso/`, `method/didatico/curso-app/` e `method/exemplos/`), passe no `check-links`. Decisão já tomada pelo professor (E5, opção i). Branch e PR autorizados; **merge não delegado**.

### 1. Antes de qualquer coisa
1. Leia `method/AGENTS.md` por inteiro; as regras valem acima deste prompt.
2. Leia `method/didatico/curso-app/estado.md` e as seções 6 e 6.1 de `method/didatico/curso-app/etapas/E5-kit-e-github.md`. <!-- links:ignore -->
3. Confira com `gh pr view 81 --json state,mergedAt` se o PR #81 foi integrado. Se **não** foi, pare e me avise: este trabalho parte dele. Se foi, atualize a `main` local (`git pull --ff-only`).
4. Em até cinco linhas, diga o que vai fazer e espere meu "ok".

### 2. Reproduza a falha antes de mudar
Numa pasta temporária fora do repositório (por exemplo, criada com `mktemp -d`), copie `method/`, remova `didatico/curso/`, `didatico/curso-app/` e `exemplos/`, e rode `node method/scripts/check-links.mjs method` dentro dela. Esperado, obtido em 2026-11-21: `FALHOU: 35 referência(s) quebrada(s) em 29 documento(s).` e código 1. Se o número for outro, mostre a diferença antes de seguir.

### 3. O que mudar
Duas ações, conforme o grupo de cada referência:

| Grupo | Ação |
|---|---|
| **G1 — arquivo que o kit cria ou que o aluno cria no m04** | **Não marcar.** São eles: `.github/ISSUE_TEMPLATE/` e `.github/ISSUE_TEMPLATE/fatia.yml` (o kit traz), `docs/adr/` (o kit traz) e `scripts/verify.sh` em `orquestrador/prompt-do-estudante.md`, linha 66, e em `perfis/celilac-nest.md`, linha 35 (o m04 cria). | <!-- links:ignore -->
| **G2 — arquivo do CeliLac ou `method/exemplos/`** | Terminar a linha com `<!-- links:ignore -->` **e**, se o texto não deixar claro, acrescentar poucas palavras dizendo que é o exemplo do CeliLac, no repositório do curso. Todo o resto da lista abaixo. |

Referências do G2 (linha de 2026-11-21; confira, porque podem ter mudado):
- `method/exemplos/`: `AGENTS.md`:25, `decisoes/ADR-001-organizacao-do-metodo.md`:15, `didatico/01-por-que-um-metodo-em-duas-camadas.md`:62, `didatico/04-fundacao-do-projeto.md`:33, `perfis/celilac-nest.md`:5, `templates/playbook.md`:5. <!-- links:ignore -->
- Arquivos do CeliLac: `didatico/04-fundacao-do-projeto.md`: 23, 25, 28, 29, 55, 56, 57; `didatico/06-piloto-reconciliando-o-uc12.md`: 10, 51, 72, 73; `perfis/celilac-nest.md`: 29, 32; `templates/caso-de-uso.md`: 4. <!-- links:ignore -->

Cuidados:
- `<!-- links:ignore -->` desliga a verificação da **linha inteira**. Se a linha também cita um caminho que existe no método, avise e proponha dividir a frase, em vez de perder a verificação.
- Não reescreva parágrafos; mude o mínimo. Não mexa em nada fora de `celilac-backend/method/`, exceto o `estado.md`.

**Ajuste do `AGENTS.md`, linha 4** (E5, seção 6.1): hoje diz "Copie-o para a **raiz** do seu repositório". Passa a dizer que o arquivo fica em `method/AGENTS.md`, que não deve ser copiado para a raiz (duas cópias divergem) e que o orquestrador já aponta esse caminho. Mostre o texto proposto e espere meu "ok" antes de gravar.

### 4. Critério de aceite (com saída real)
1. Simulação do kit, na pasta temporária: `method/` como no passo 2 **mais** `.github/ISSUE_TEMPLATE/fatia.yml`, `.github/ISSUE_TEMPLATE/fase.yml` (copiados da raiz do `dsc-tests`) e `docs/adr/` (pasta vazia com um `README.md`). `check-links` deve falhar **só** com as 2 referências a `scripts/verify.sh` do G1.
2. Acrescente um `scripts/verify.sh` vazio na simulação: `check-links` com código **0**.
3. No repositório, em `celilac-backend/`: `node method/scripts/check-links.mjs method docs/uc` e `node method/scripts/check-links.mjs` com código 0.
4. `git diff --stat` só com arquivos de `celilac-backend/method/` (e o `estado.md`).

### 5. Branch, commit e PR
- Branch `docs/method-portatil`. Commit e PR referenciando a etapa: "(curso-app E5, opção i)". Só os arquivos desta tarefa (há mudanças locais alheias no `dsc-tests`: não as inclua). <!-- links:ignore -->
- No PR: o que muda, a tabela G1 e G2, as saídas reais dos passos 2 e 4, e o efeito para o aluno (comentários invisíveis no GitHub e, no `AGENTS.md`, uma frase nova).
- Inclua no mesmo PR este arquivo, `method/didatico/curso-app/prompt-sessao-method-portatil.md`, que foi deixado fora do git, na `main` local, de propósito (decisão do professor em 2026-11-21).
- Atualize o `estado.md`: a integração do PR #81 (com a data obtida pelo `gh`), este prompt na tabela "Histórico de sessões", o PR novo, a divergência da E5 sobre `check-links` como "correção em PR", e as etapas que isso pode invalidar (nenhuma esperada; diga se encontrar alguma).
- **Não faça merge.** Termine com: o que foi feito, o que não foi verificado e o que eu preciso decidir.
