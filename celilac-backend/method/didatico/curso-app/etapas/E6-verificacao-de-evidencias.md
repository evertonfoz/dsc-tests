# E6 — Verificação de evidências e seus limites

> Etapa E6 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **validada pelo professor em 2026-11-21** (todas as recomendações aprovadas, com a opção (a) da seção 4.3).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso nem do método foi alterado nesta etapa. Os testes da seção 4 foram feitos numa cópia, fora do repositório.

---

## 1. Entradas desta etapa (decisões já tomadas)
- A aplicação **nunca lê** o repositório do aluno, não tem token e não chama serviços externos (E1, seção 7; E4, seção 7, regra 3; E5, seção 7).
- Fases A a F aparecem só como **declaração do aluno**, com link opcional; sem link, "a confirmar". Aceitar o `state.yaml` colado ficou para esta etapa (E4, seção 3.3).
- Checklists "Como saber que funcionou" são declarações do aluno; a aplicação não confere (E2, seção 6).
- A aplicação não aprova gate. Quem atesta é o aluno ou o CI (prompt, seção 2, item 6; regra 21 do `AGENTS.md`).

## 2. Divergência com o texto do prompt
O prompt (seção 2, item 7) cita como exemplos de conferência automática "link de PR ou de execução do CI, leitura somente do estado do repositório". **Com as decisões da E1, a aplicação não pode fazer nenhuma das três**: abrir o link, consultar o GitHub ou ler o repositório exigiriam rede, e no caso de repositório privado, token. Vale a decisão da E1. O que sobra para a aplicação é conferir **a forma** do que o aluno informa. A conferência do **conteúdo** fica com as ferramentas que rodam no repositório do aluno (validadores, `gh`, CI).

## 3. Quatro níveis de verificação
| Nível | Quem confere | O que confere | Exemplo |
|---|---|---|---|
| N0 — Declaração | ninguém além do aluno | nada | caixa marcada no checklist, fase "declarada concluída" |
| N1 — Forma | **a aplicação**, no navegador, sem rede | estrutura e coerência interna do que o aluno colou ou digitou | `state.yaml` colado sem campo obrigatório; link que não é de PR; link de outro repositório |
| N2 — Ferramenta | validadores, `gh` e CI, **no repositório do aluno** | existência de arquivos, estado de issues e PRs, testes passando | `check-state.sh --remote`, `check-links.mjs`, `scripts/verify.sh`, CI verde |
| N3 — Julgamento | o aluno, um colega da equipe ou quem for responsável | se a evidência prova o que afirma | o RED falhou pelo motivo certo? o teste prova a regra? a ADR justifica a decisão? |

**A aplicação só executa N1.** Para N2, ela mostra o comando e o prompt e explica a saída; quem executa é o aluno. Para N3, ela oferece o checklist e, depois da tentativa, o gabarito para comparar.

## 4. O `state.yaml` colado (pendência da E4)

### 4.1. O que foi testado
[Fato, executado nesta sessão] `node method/scripts/check-state.mjs docs/uc/uc12/state.yaml`, no repositório: `OK ... válido (local)`, com 6 avisos "revisor igual ao responsável", saída 0.

[Fato, executado nesta sessão] O mesmo arquivo copiado sozinho para uma pasta temporária (sem `relatorios/` e `evidencias/` ao lado): `FALHOU: 40 erro(s)`, saída 1. **Os 40 erros são todos "arquivo não encontrado".** Nenhum erro de estrutura.

Conclusão: a validação do `check-state.mjs` tem duas partes separáveis.

| Parte | Exemplos de regra (`method/scripts/check-state.mjs`) | Precisa do repositório? |
|---|---|---|
| Estrutura e coerência | campos obrigatórios; arquétipo; `fase_atual` coerente com as fases; fase concluída exige gate todo `aprovado` e `relatorio`; `aprovado` exige `por`; fatia `integrada` exige issue, branch, PR, evidências e revisor; issue ou PR repetidos; critérios no formato `CA01`, `RN02` | **Não** (linhas 161 a 254, exceto a função `arquivo`) |
| Arquivos citados | `documento`, `relatorio`, `evidencias` existem | **Sim** (função `arquivo`, linhas 156 a 159) |
| GitHub (`--remote`) | Epic, issues e PRs existem e batem com o arquivo | **Sim**, e com `gh` autenticado (linhas 260 a 293) |

### 4.2. Proposta
**[Recomendação]** A tela de fases aceita, como opção, que o aluno **cole ou escolha** o `state.yaml` do repositório dele. A aplicação então:
1. roda a parte de **estrutura e coerência** e mostra os erros e avisos com o texto do próprio validador;
2. lista os caminhos citados (relatórios, evidências, documento) como **"a confirmar no seu repositório"**, sem dizer se existem;
3. mostra as fases e os gates **como o arquivo os registra** ("registrado no seu `state.yaml`: aprovado, por `<login>`"), nunca como aprovação da aplicação;
4. termina com o comando N2 para conferir o resto: `method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml --remote`.

Se o aluno colar o `state.yaml`, ele passa a ser a fonte das fases na tela, como a regra 15 do `AGENTS.md` pede. A declaração manual da E4 continua disponível para quem não colar. Se as duas divergirem, a tela mostra as duas e diz que vale o arquivo.

### 4.3. Como reaproveitar o validador sem duplicá-lo
[Fato] `check-state.mjs` importa `node:fs`, `node:path` e `node:child_process` no topo (linhas 12 a 14). Não roda no navegador como está, embora `parseYaml` e `validar` sejam exportados.

| Opção | Como é | Prós | Contras |
|---|---|---|---|
| (a) **Separar o núcleo** | Um PR de método move `parseYaml` e `validar` para um arquivo sem dependências de Node; `validar` recebe a função que diz se um caminho existe. O `check-state.mjs` continua com a mesma interface de linha de comando e o mesmo comportamento | Uma só implementação no terminal, no CI e na aplicação; testável com `method/scripts/testes/` | PR de conteúdo em `method/scripts/`, que vai no kit do aluno |
| (b) Substituir os módulos de Node na construção | O empacotador da aplicação troca `node:fs` por uma versão falsa | Nada muda no método | Truque frágil; um `existsSync` falso que responde "existe" esconde o erro em vez de marcá-lo "a confirmar" |
| (c) Reescrever na aplicação | Validador próprio | Independência | Duas versões das regras, que vão divergir |

**[Recomendação] (a)**, em PR próprio antes do marco que exibir as fases (E7). Decisão sua; o merge não está delegado.

### 4.4. Cuidados
- **Privacidade:** o `state.yaml` tem logins. Fica no navegador, como o resto (E4, seção 7). [Recomendação] Guardar o último texto colado e a data num campo novo do escopo `fases`, para não pedir de novo a cada visita. A E4 não muda de estrutura, só ganha esse campo.
- **Arquivo do UC12 colado por engano:** se `uc` for `UC12` e `nome` for "Cadastrar Produto", a tela avisa que esse é o caso de exemplo, não o do aluno.
- **Conteúdo colado é dado** (E4, seção 5): exibido como texto, nunca executado. O leitor de YAML do validador não executa nada; recusa o que não entende (linhas 16 a 20).

## 5. Links de evidência
[Recomendação] Conferência só de forma, no navegador:

| Tipo | Forma aceita | Conferências N1 |
|---|---|---|
| PR | `https://github.com/<dono>/<repo>/pull/<n>` | forma; `<dono>/<repo>` igual a `{{repositorio}}`, se preenchido; número igual ao `pr` da fatia no `state.yaml` colado, se houver |
| Issue | `.../issues/<n>` | idem, com `issue` |
| Execução do CI | `.../actions/runs/<id>` (com ou sem `/job/<id>`) | forma e repositório |
| Commit | `.../commit/<hash de 40 caracteres>` | forma e repositório |
| Arquivo no repositório | `.../blob/<ref>/<caminho>` | forma e repositório; ref igual a um hash completo é sugerido, porque `main` muda |

A aplicação **não abre** o link. Ele aparece clicável; se o aluno clicar, quem acessa o GitHub é o navegador dele, por escolha dele. Para repositório privado, o link só abre para quem tem acesso (E5, seção 7.4).

O comando N2 para cada tipo vem junto: `gh pr view <n> --json state,mergedAt,headRefOid`, `gh pr checks <n>`, `gh issue view <n> --json state`. [Fato, executado nesta sessão] `gh pr checks 82` lista os quatro trabalhos do CI do PR #82 com `pass` e o link de cada execução; é esse tipo de saída que o aluno vê.

## 6. Saídas de comandos coladas
O aluno poderia colar a saída do `check-state`, do `check-links` ou dos testes, e a aplicação procuraria a linha final (`OK: ... válido (local + GitHub).`, `FALHOU: N erro(s).`).

| Opção | Prós | Contras |
|---|---|---|
| (a) Interpretar a saída colada | Retorno imediato na tela | Texto colado não prova execução; um "OK" na tela da aplicação **parece** verificação e não é; o lugar da saída é `evidencias/`, no repositório |
| (b) **Não interpretar** | Nenhuma falsa sensação de verificação; a evidência fica onde o método manda | O aluno não recebe "OK" da aplicação |

**[Recomendação] (b).** O passo de prática diz qual linha final procurar (como o `m02-pratica.md`, passo 5, já faz) e onde guardar a saída. A exceção é o `state.yaml` (seção 4), porque ali a aplicação aplica as **mesmas regras** do validador do método, não lê o resultado de uma execução.

## 7. Cada evidência do UC12 e o que a aplicação pode fazer com ela
Os tipos vêm de `docs/uc/uc12/state.yaml` e de `docs/uc/uc12/evidencias/`. [Fato] Os 31 arquivos `.txt` de evidência do UC12 abrem com uma linha de cabeçalho que diz o que foi executado; 28 trazem data e hora em UTC e 13 trazem o commit de base (por exemplo, `# RED da F03 em 2026-11-20T17:27:22Z, base 3c38fc5...`). A convenção não está escrita no método e não foi seguida por inteiro nem no UC12; ver seção 9.

| Evidência | Nível que a prova | O que a aplicação faz (N1) | O que a aplicação não prova |
|---|---|---|---|
| `state.yaml` válido | N2 (`check-state.sh`, CI) | regras de estrutura (seção 4) | que os arquivos citados existem; que bate com o GitHub; que é o arquivo da `main` |
| RED antes do GREEN | N2 (commits separados, saída guardada) e N3 (falhou pelo motivo certo) | nada | que o teste falhou antes; que a falha era a esperada |
| Fatia integrada | N2 (`gh pr view`, `--remote`) | forma do link; número igual ao do `state.yaml` | que o PR existe e foi integrado |
| CI verde na `main` | N2 (GitHub Actions) | forma do link da execução | que a execução passou, nem em qual commit |
| Migration em banco vazio | N2 (CI ou execução local guardada) | nada | tudo |
| Verificação HTTP com controle negativo | N2 (`run-checks`) e N3 (o controle falhou como devia) | nada | tudo |
| Durabilidade | N2 e N3 (o banco não foi reiniciado) | nada | tudo |
| Mutação (o teste prova algo) | N2 e N3 | nada | tudo |
| Cobertura de cada item do UC | N3 (auditoria da fase F) | lista os `RF`, `RN`, `CA`, `FA` e `FE` do caso de uso enviado e os `criterios` das fatias do `state.yaml` colado, e mostra **quais itens não aparecem em nenhuma fatia** | que o teste citado prova o item |
| Revisão independente | N3 | aviso se `revisor` igual a `responsavel` (o mesmo do validador) | que `revisor` diferente é outra pessoa, ou que revisou de fato |
| Nenhum segredo versionado | N2 (ferramenta de varredura, como a do CI do `dsc-tests`) e N3 | nada | tudo |
| Issues e Epic fechados | N2 (`--remote`) | nada além do `state.yaml` colado | que o GitHub concorda |

A linha "Cobertura" é a única conferência cruzada útil que a aplicação faz sozinha: ela já tem os dois lados (o caso de uso enviado, E2, seção 7, e o `state.yaml` colado). Item sem fatia não é erro: pode estar coberto por ADR ou pergunta, como no UC12 (gate da fase A). A tela diz "sem fatia: confira se há ADR ou pergunta registrada".

## 8. O que a aplicação **não** consegue provar
A aplicação mostra esta lista na tela de fases e na tela "Seus dados", em tom neutro:
1. Que um comando foi executado, ou que uma saída é real e não foi editada ou gerada por um assistente de IA.
2. Que um link existe, é do repositório do aluno, ou aponta para algo integrado e verde.
3. Que o `state.yaml` colado é o da `main`, nem que os arquivos que ele cita existem.
4. Que um teste falhou pelo motivo certo no RED, ou que ele prova a regra que diz provar.
5. Que o revisor é outra pessoa e que revisou.
6. Que o aluno fez o passo que marcou, ou que a tentativa antes do gabarito foi sincera.
7. Que o repositório não tem segredo.

O que dá confiança a cada um desses itens é a ferramenta no repositório (N2) ou uma pessoa (N3). A aplicação aponta o caminho, sem substituí-lo.

## 9. Como a tela fala
**[Recomendação]** Rótulos fixos, nunca um "✓ verificado" genérico:

| Rótulo na tela | Quando | Relação com as etiquetas da regra 4 do `AGENTS.md` |
|---|---|---|
| "declarado por você" | N0 | nenhuma: é registro pessoal |
| "forma conferida pela aplicação" | N1 sem erro | nenhuma: não é evidência |
| "registrado no seu `state.yaml`" | conteúdo do arquivo colado | o que o arquivo afirma, com a etiqueta que o aluno der |
| "a confirmar no seu repositório" | tudo o que depende de N2 | equivale a `Aguardando evidência` até o aluno rodar o comando |
| "a confirmar" | sem link, sem arquivo | regra 3 do `AGENTS.md` |

E uma frase por tela de fase, conforme a regra 21 do `AGENTS.md` e o tom neutro do curso: "A aplicação confere a forma do que você informa. Quem prova é o seu repositório, e quem decide é você ou o CI."

**Convenção de cabeçalho das evidências.** [Recomendação] Os passos de prática que pedem para guardar uma saída (m02 em diante) ensinam o cabeçalho que o UC12 usa: o que foi executado, data UTC e commit de base, obtido com `git rev-parse HEAD`. A aplicação **não** confere esse cabeçalho, porque recebe o arquivo só se o aluno colar. Registrar a convenção no método (por exemplo, no `AGENTS.md`, regra 17, ou no modelo de relatório) é mudança de conteúdo e decisão sua; entra na E3, parte 2, se aprovada.

## 10. Riscos
| Risco | Efeito | Mitigação proposta |
|---|---|---|
| "Forma conferida" lida como "aprovado" | Falsa confiança | Rótulos da seção 9; nenhuma cor verde de sucesso em N1, só neutra |
| Divergência entre a regra no navegador e o validador do método | A tela diz uma coisa, o CI outra | Opção (a) da seção 4.3: mesma implementação |
| Aluno cola o `state.yaml` do UC12 | Progresso falso | Aviso da seção 4.4 |
| Assistente de IA gera saídas plausíveis | Evidência inventada | Os prompts pedem saída real (E2, seção 5.3); a aplicação lista o limite 1 da seção 8; o CI reexecuta |
| Aluno marca "feito" sem fazer | Progresso que não corresponde ao repositório | Fica para a E8, como o prompt pede |

---

## Fechamento

**O que foi feito:**
- Proposta dos quatro níveis de verificação, do uso do `state.yaml` colado, da conferência de forma dos links, da recusa em interpretar saídas coladas, da tabela evidência por evidência, da lista do que a aplicação não prova e dos rótulos da tela.
- Executados nesta sessão: `check-state.mjs` no `state.yaml` do UC12, no repositório (saída 0) e isolado numa pasta temporária (40 erros, todos de arquivo não encontrado, saída 1); `gh pr checks 82` e `gh pr view 82` (somente leitura).
- Lidos: `method/scripts/check-state.mjs` inteiro, `docs/uc/uc12/state.yaml`, as primeiras linhas das 31 evidências `.txt` do UC12, o modelo de relatório de fase, o passo 5 do `m02-pratica.md`, o checklist do m11 e as etapas E2, E4 e E5.

**O que não foi verificado:**
- Que o núcleo do validador, separado como na opção (a), roda no navegador. A conclusão vem da leitura dos imports e das funções, não de execução num navegador.
- As formas de URL do GitHub da seção 5 vêm do meu conhecimento e dos links vistos em `gh pr checks 82`; não conferi todas as variações (por exemplo, links de execução repetida).
- Não li os playbooks das fases B a F por inteiro; a tabela da seção 7 parte do `state.yaml` e das evidências do UC12.
- Não verifiquei se outro tipo de caso de uso (consultar, atualizar, excluir, autenticar) pede evidências diferentes. O método só foi validado em "criar".

**O que você precisa decidir:**
1. Os **quatro níveis** e a regra de que a aplicação só executa N1 (seção 3), incluindo a divergência com o texto do prompt (seção 2).
2. **`state.yaml` colado** como fonte opcional das fases (seção 4.2), e a forma de reaproveitar o validador: (a), (b) ou (c) (seção 4.3). Se (a), autorizar branch e PR de método.
3. **Não interpretar saídas coladas** (seção 6).
4. Os **rótulos da tela** (seção 9) e se a convenção de cabeçalho das evidências vai para o método (E3, parte 2).
5. Autorizar **branch e PR da E6**, que leva este documento e o registro do PR #82 no `estado.md` (merge não delegado, salvo decisão sua).
