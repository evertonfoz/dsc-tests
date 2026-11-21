# E5 — Kit do repositório do aluno e integração com o GitHub

> Etapa E5 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **validada pelo professor em 2026-11-21** (todas as recomendações aprovadas, incluindo a opção (i) da seção 6).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso nem do método foi alterado nesta etapa. A simulação da seção 6 foi feita numa cópia, fora do repositório.

---

## 1. Entradas desta etapa (decisões já tomadas)
- Site estático numa imagem Docker; a aplicação **nunca lê** o repositório do aluno e não faz chamadas a serviços externos (E1, seção 7; E4, seção 7, regra 3).
- Kit entregue como **`.zip`**, gerado no navegador a partir dos modelos embutidos na imagem (E1, decisão B′).
- Sem login e sem contas (E0, P3). A aplicação não guarda token de nenhum serviço.
- Stack do aluno igual à do CeliLac, perfil `celilac-nest` (E0, P5). Modos `individual` e `equipe` (E4, seção 2).
- Variáveis do projeto: lista consolidada da E4, seção 3.1. O caso de uso do aluno é um Markdown escolhido no navegador (E2, seção 7).
- Requisito de 2026-11-21: cada passo de prática mostra o conteúdo copiável e um prompt (E2, seção 5).

## 2. O que é o kit, e o que ele não deve ser

O prompt do plano pede um kit com "project-profile preenchido, state.yaml inicial, AGENTS.md, templates, issues, prompt do orquestrador ajustado ao domínio". Há uma tensão com o próprio curso:

| Artefato | Onde o curso manda o aluno criá-lo |
|---|---|
| `state.yaml` do caso de uso | [Fato] `m02-pratica.md`, passos 1 e 2 (copiar o modelo e preencher, vendo o validador recusar) |
| `project-profile.md` | [Fato] `m04-fundacao-ambiente-reprodutivel.md`, prática, passo 2 ("copie o modelo e preencha com os comandos reais") |
| `ci.yml` | [Fato] `apoio-c-integracao-continua.md`, prática, passo 1 |
| Issue do caso de uso | [Fato] `apoio-a-github-alem-do-basico.md`, prática, passo 1 |

Se o kit trouxer esses arquivos prontos, a prática desses módulos perde o sentido: o aluno recebe a resposta antes da atividade, o que contradiz a estrutura "problema antes da solução".

**[Recomendação] O kit é o ponto de partida, não o resultado.** Ele entrega o que o aluno **não** deveria escrever do zero (o método, os modelos, as regras, os formulários do GitHub) e o que vem dos dados que ele já informou (perfil com a identidade preenchida e o resto "a confirmar", caso de uso, prompts). O que o curso ensina a construir continua sendo construído nos passos de prática, com o conteúdo copiável de cada passo (requisito de 2026-11-21).

## 3. Formas de entrega

| Forma | Como funciona | Prós | Contras | Compatível com as decisões? |
|---|---|---|---|---|
| (a) **`.zip` gerado no navegador** | O aluno clica, baixa e aplica no próprio repositório | Sem token, sem rede, igual localmente e na internet; o aluno vê cada arquivo antes de versionar | Aplicar é manual (copiar arquivos); risco de sobrescrever | **Sim** (decisão B′) |
| (b) PR aberto pela aplicação no GitHub | A aplicação cria branch, commits e PR no repositório do aluno | Um clique; o PR já é a revisão | Exige token ou aplicativo OAuth do GitHub no navegador, chamadas à API (serviço externo) e escrita no repositório do aluno | **Não**: contradiz "nunca lê o repositório", "sem login" e "sem chamadas externas" |
| (c) Só instruções | A aplicação lista cada arquivo com botão de copiar | Nada para baixar | Cerca de 50 arquivos (seção 4) copiados um a um; erro de cópia é provável | Sim, mas trabalhoso |
| (d) Repositório-modelo no GitHub ("Use this template") | Um repositório público com o kit; o aluno cria o dele a partir do modelo | Recurso nativo do GitHub; zero código na aplicação | Não é personalizado (sem variáveis); é mais um repositório para manter igual ao conteúdo; publicá-lo é ação externa sua | Possível no futuro |

**[Recomendação] (a), acompanhada de instruções e de um prompt de aplicação** dentro do próprio `.zip` (seção 5). A (c) fica como alternativa na tela para quem quiser um arquivo só. A (d) fica registrada para a versão na internet, se você quiser.

## 4. Conteúdo do kit

### 4.1. Estrutura do `.zip`
```
kit-{{uc_pasta}}-<commit curto>.zip
├── LEIA-ME.md                     para você; não vai para o repositório
├── manifesto.json                 lista de arquivos, impressão digital de cada um, commit de origem, versão do kit
├── para-voce/                     não vai para o repositório
│   ├── prompt-aplicar-kit.md      prompt para o seu assistente aplicar o kit sem sobrescrever nada
│   ├── prompt-orquestrador.md     o prompt do orquestrador com {{uc}} e {{documento_uc}} preenchidos
│   └── issues/                    rascunhos de issues, com o comando `gh` para criar cada uma
│       ├── fundacao.md
│       └── caso-de-uso.md
└── repositorio/                   espelha a raiz do seu repositório
    ├── method/                    o método, sem curso, aplicação do curso e exemplos (seção 4.2)
    ├── project-profile.md         identidade preenchida; o resto "a confirmar"
    ├── .github/
    │   ├── ISSUE_TEMPLATE/fatia.yml
    │   ├── ISSUE_TEMPLATE/fase.yml
    │   └── pull_request_template.md
    └── docs/
        ├── adr/README.md          pasta prevista pelos playbooks
        └── planejamento/{{uc_pasta}}.md   o caso de uso que você enviou (se enviou)
```

A separação entre `repositorio/` e `para-voce/` evita que rascunhos e prompts acabem versionados por engano.

### 4.2. Arquivo por arquivo

| Arquivo | Origem no `dsc-tests` | Adaptado? | Quando o aluno precisa |
|---|---|---|---|
| `method/AGENTS.md`, `glossario.md`, `README.md` | `celilac-backend/method/` | Não | m00 em diante |
| `method/playbooks/`, `decisoes/`, `templates/`, `perfis/`, `orquestrador/` | idem | Não | m02 em diante |
| `method/scripts/` (validadores e testes) | idem | Não | m02, passo 3 |
| `method/didatico/01` a `06` | idem | Não; ver seção 6 | leitura de apoio | <!-- links:ignore -->
| `project-profile.md` | `method/templates/project-profile.md` | **Sim**: seção 1 com `{{repositorio}}` e perfil `celilac-nest`; seção 2 com os nomes da stack do perfil e origem "perfil `celilac-nest`, confirmar no seu `package.json`"; seção 8 com `{{login}}` e `{{logins_equipe}}`; todo o resto `a confirmar` | m04, passo 2 (o aluno confirma e completa) |
| `.github/ISSUE_TEMPLATE/fatia.yml`, `fase.yml` | `.github/ISSUE_TEMPLATE/` (raiz do `dsc-tests`) | **Sim**: o exemplo "UC12 - Cadastrar Produto" do `fatia.yml` (linha 14) vira `{{uc}} - {{uc_nome}}` | Fase A |
| `.github/pull_request_template.md` | `.github/` (raiz do `dsc-tests`) | Não | apoio A, passo 3 |
| `docs/adr/README.md` | novo, uma frase | — | primeira ADR | <!-- links:ignore -->
| `docs/planejamento/{{uc_pasta}}.md` | o Markdown enviado pelo aluno, **sem alteração** | Não | m02 (`{{documento_uc}}` = `../../planejamento/{{uc_pasta}}.md`, o exemplo já usado no `m02-pratica.md`) |
| `para-voce/prompt-orquestrador.md` | `method/orquestrador/prompt-do-estudante.md` | **Sim**: `<UC>` e `<DOCUMENTO>` | Fase A | <!-- links:ignore -->
| `para-voce/issues/*.md` | novos, a partir do apoio A, prática, passo 1, e do m04, passo 1 | **Sim** | apoio A e m04 |

### 4.3. O que fica fora, de propósito
| Fica fora | Motivo |
|---|---|
| `state.yaml` | É a prática do m02. [Recomendação] Não incluir nem como rascunho. |
| `ci.yml`, `compose.yaml`, `Dockerfile`, `scripts/verify.sh`, `.env.example` | São a prática do apoio C, do apoio D e do m04, e o conteúdo copiável vem nos passos desses módulos. |
| `method/didatico/curso/` e `method/didatico/curso-app/` | O curso é lido na aplicação; no repositório do aluno, ele só traria referências ao UC12 que não existem lá (seção 6). |
| `method/exemplos/` | O próprio `method/exemplos/README.md` diz: "Ao copiar o método para o seu projeto, não copie esta pasta". |
| Qualquer `.env`, segredo ou senha | Regra 10 do `AGENTS.md`. O kit não pede nem gera nenhum. |
| Código-fonte do CeliLac | O aluno escreve o dele; trechos de referência vêm nos passos de prática, adaptados. |

### 4.4. Regras de geração
1. **Mínimo para gerar:** modo, domínio, código e nome do UC. Sem eles, o botão fica desabilitado e diz o que falta.
2. **Variável vazia:** nos arquivos do kit, vira o texto `a confirmar`, nunca `{{variavel}}` solta (que quebraria YAML e confundiria o validador). Exceção: os prompts, onde o campo vazio aparece como `<preencha: ...>`, para o aluno perceber.
3. **Nomes de arquivo:** `{{uc_pasta}}` só com letras minúsculas, dígitos e hífen. Qualquer outro caractere é recusado na tela "Meu projeto", porque ele vira caminho dentro do `.zip` (evita caminhos como `../`).
4. **Conteúdo do aluno é dado:** o Markdown do caso de uso entra no `.zip` como veio, sem interpretação.
5. **Rastreio:** o `manifesto.json` registra o commit do conteúdo e a impressão digital de cada arquivo. Isso permite, mais tarde, dizer ao aluno quais arquivos do kit mudaram numa imagem nova (tratamento na E8).
6. **Sem bibliotecas de fora:** a geração do `.zip` usa uma biblioteca embutida na imagem (E4, seção 7, regra 3). A escolha fica para a E7.

## 5. Como o aluno aplica o kit

**[Recomendação] Sequência mostrada na aplicação e repetida no `LEIA-ME.md`:**
1. Descompactar **numa pasta separada**, nunca direto sobre o repositório.
2. Criar a branch `chore/kit-inicial` no repositório (convenção do `project-profile.md`, seção 7).
3. Copiar o conteúdo de `repositorio/`. Se algum arquivo já existir, **não sobrescrever**: comparar e decidir (regra 5 do `AGENTS.md`).
4. Rodar `node method/scripts/check-links.mjs` e ler a saída (ver a seção 6: hoje ela falha).
5. Commit, PR, revisão e merge **pelo aluno**.

**Prompt de aplicação** (`para-voce/prompt-aplicar-kit.md`), com as regras da E2, seção 5.3: <!-- links:ignore -->
- listar os arquivos de `repositorio/` e, para cada um, dizer se já existe no repositório;
- copiar só os que não existem; para os que existem, mostrar a diferença e perguntar;
- não fazer commit, push, PR nem merge sem confirmação;
- rodar `check-links` e mostrar a saída real;
- terminar com "o que verifiquei de fato e o que estou presumindo".

**Repositório que já tem código** (aluno que chega com um projeto em andamento): o mesmo caminho serve. A comparação do passo 3 é o ponto crítico, e é por isso que o kit não é aplicado por cima.

## 6. Divergência encontrada: o método copiado sozinho não passa no `check-links`

[Fato, executado nesta sessão] Copiei `celilac-backend/method/` para uma pasta vazia, fora do repositório, removi `didatico/curso/`, `didatico/curso-app/` e `exemplos/`, e rodei `node method/scripts/check-links.mjs method`:

```text
FALHOU: 35 referência(s) quebrada(s) em 29 documento(s).
```
Código de saída `1`. Removendo também `didatico/` inteiro, continuam 35 referências quebradas (em 23 documentos), porque `AGENTS.md`, `README.md`, orquestrador e playbooks citam `method/didatico/01` a `06`. <!-- links:ignore -->

As 35 referências caem em três grupos:

| Grupo | Exemplos (arquivo: caminho citado) | Existirá no repositório do aluno? |
|---|---|---|
| Criado mais tarde pela Fundação ou pelo kit | `fase-A-planejar-e-publicar.md`: `.github/ISSUE_TEMPLATE/`; playbooks: `docs/adr/`; `orquestrador/prompt-do-estudante.md`: `scripts/verify.sh` | Sim, depois do m04 (o kit da seção 4 já cria `.github/ISSUE_TEMPLATE/` e `docs/adr/`) | <!-- links:ignore -->
| Arquivos do CeliLac | `perfis/celilac-nest.md`: `test/database-isolation.e2e-spec.ts`; `didatico/06-...`: `docs/uc/uc12/state.yaml`; `templates/caso-de-uso.md`: `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | **Nunca** | <!-- links:ignore -->
| A pasta que não se copia | `AGENTS.md`, `ADR-001`, `perfis/celilac-nest.md`, `templates/playbook.md`: `method/exemplos/` | **Nunca** | <!-- links:ignore -->

**Consequência:** o CI do aluno, que roda `check-links` (como o `scripts/verify.sh` do CeliLac faz, linha 90), fica vermelho por causa do método, não do trabalho dele. E o `m02-pratica.md` hoje manda "copie a pasta `method/` do repositório do curso", o que traria também o curso inteiro, com ainda mais referências ao UC12.

**Propostas (sua decisão; são mudança de conteúdo, em PR próprio):**
| Opção | O que é | Prós | Contras |
|---|---|---|---|
| (i) **Tornar `method/` portátil** | Nas linhas que citam arquivos do CeliLac ou `method/exemplos/`, acrescentar `<!-- links:ignore -->` e dizer no texto que é um exemplo do CeliLac | Corrige na fonte; quem copia o método sem a aplicação também ganha | PR de conteúdo em cerca de 15 arquivos do método |
| (ii) O gerador do kit marca as linhas na hora | A aplicação acrescenta `<!-- links:ignore -->` ao montar o `.zip` | Nada muda no repositório | Duas versões do mesmo texto: a do repositório e a do kit |
| (iii) Não resolver | O `LEIA-ME.md` explica as falhas | Zero trabalho | CI vermelho desde o primeiro dia; contradiz "`main` sempre verde" (regra 12) |

**[Recomendação] (i)**, num PR pequeno, antes do marco da aplicação que gera o kit. O grupo "criado mais tarde" não precisa de marcação: o kit cria `.github/ISSUE_TEMPLATE/` e `docs/adr/`, e `scripts/verify.sh` aparece no m04. Até lá, a falha dessa única referência é esperada e o `LEIA-ME.md` avisa.

### 6.1. Outras divergências (não corrigidas)
- **`AGENTS.md` na raiz ou em `method/`:** [Fato] a linha 4 de `method/AGENTS.md` diz "Copie-o para a **raiz** do seu repositório", mas o projeto de referência não tem `AGENTS.md` na raiz (`celilac-backend/AGENTS.md` não existe), e o orquestrador manda ler `method/AGENTS.md`. **[Recomendação]** O kit não cria cópia na raiz (duas cópias divergem com o tempo) e a frase da linha 4 é ajustada no mesmo PR da opção (i). Alguns assistentes de IA procuram `AGENTS.md` na raiz; o prompt do orquestrador já aponta o caminho, o que resolve isso. Decisão sua. <!-- links:ignore -->
- **`m02-pratica.md`**, "Antes de começar": "copie a pasta `method/` do repositório do curso" passa a ser "aplique o kit inicial (aplicação do curso) ou copie `method/` sem `didatico/curso/`, `didatico/curso-app/` e `exemplos/`". Entra na E3, parte 2.

## 7. Integração com o GitHub e permissões mínimas

**A aplicação do curso não se integra ao GitHub.** Ela não tem token, não chama a API e não abre página do GitHub por conta própria. Toda operação no GitHub é feita **pelo aluno**, no terminal ou no site, com o comando que a aplicação mostra.

### 7.1. Quem tem qual permissão

| Quem | Permissão | De onde vem | Observação |
|---|---|---|---|
| Aplicação do curso | **Nenhuma** | — | Nada a configurar |
| CI do aluno (GitHub Actions) | `contents: read` | [Fato] `.github/workflows/celilac-backend-ci.yml`, linha 16 | O passo do apoio C deve trazer essa linha; hoje o exemplo do apoio C não traz (pendência para a prática do apoio C) |
| `gh` do aluno | escopo `repo`; `project` para usar o GitHub Project | [Suposição, conhecimento da ferramenta, não testado aqui] `gh auth login` pede `repo` por padrão; Projects exigem `gh auth refresh -s project` | A aplicação mostra os dois comandos e `gh auth status` para conferir |
| Assistente de IA do aluno | **As mesmas do `gh` do aluno**, se ele rodar comandos no terminal do aluno | consequência do item acima | Ver 7.3 |

### 7.2. Operações no GitHub ao longo do curso
| Onde no curso | Operação | Lê ou escreve | Quem executa |
|---|---|---|---|
| apoio A | criar issue, branch, PR em rascunho | escreve | aluno |
| m02, passo 5 | `check-state.sh --remote` (`gh issue view`, `gh pr view`) | **só lê** ([Fato] `method/scripts/check-state.mjs`, linhas 260 a 283) | aluno |
| m04 | issue de fundação, PR | escreve | aluno |
| Fase A | rótulos, Epic, Sub-Issues, Project | escreve | aluno, após aprovar o plano |
| Fases B a F | PRs, comentários, merge | escreve | aluno; **merge e fechamento sempre humanos** (regras 9 e 14) |

### 7.3. O limite honesto sobre o assistente de IA
Se o assistente roda comandos com o `gh` do aluno, ele **pode** fazer tudo o que o aluno pode, inclusive merge e fechar issue. As regras do `AGENTS.md` e os prompts pedem que ele pare e pergunte, mas **isso não é uma trava técnica**.
- **[Suposição, não testado]** Uma regra de proteção da branch `main` no GitHub (exigir PR e CI verde) impede push direto e merge com CI vermelho, mas não impede o merge de um PR verde. Exigir aprovação de outra pessoa trava o aluno individual, que não pode aprovar o próprio PR. A disponibilidade dessas regras em repositórios privados de contas gratuitas precisa ser conferida.
- **[Recomendação]** A aplicação diz isso na tela do kit, em tom neutro: "as regras orientam o assistente; quem impede o merge indevido é você, revisando o que ele propõe". E sugere a proteção da `main` como passo opcional do m04, com o comando ou o caminho no site.

### 7.4. Visibilidade do repositório
- Repositório **público**: qualquer pessoa vê o login, o caso de uso e as evidências. Reforça o aviso da E4 (não escrever dados pessoais de terceiros no caso de uso).
- Repositório **privado**: os links de evidência só abrem para quem tem acesso. Para o curso autônomo isso não muda nada, porque a aplicação não abre os links.
- A aplicação não pergunta nem guarda a visibilidade.

## 8. Riscos

| Risco | Efeito | Mitigação proposta |
|---|---|---|
| O aluno descompacta por cima do repositório | Arquivos dele sobrescritos | Pasta separada, prompt de aplicação que compara antes, `LEIA-ME.md` em destaque |
| Kit gerado de uma imagem antiga | Método desatualizado no repositório do aluno | Commit e impressões digitais no `manifesto.json`; comparação na E8 |
| CI do aluno vermelho por causa do método | Desânimo; "verde" perde valor | Opção (i) da seção 6 |
| Assistente faz merge ou fecha issue | Viola as regras 9 e 14 | Seção 7.3: aviso honesto e proteção opcional da `main` |
| Caso de uso com dados pessoais num repositório público | Exposição | Aviso no envio (E4, seção 7) e no kit |
| `{{variavel}}` sem preencher no kit | YAML inválido, prompt confuso | Regra 2 da seção 4.4 |
| Nome de pasta perigoso no `.zip` | Arquivo gravado fora da pasta ao descompactar | Regra 3 da seção 4.4 |

---

## Fechamento

**O que foi feito:**
- Proposta do kit (estrutura do `.zip`, arquivo por arquivo, o que fica fora e por quê, regras de geração), comparação de quatro formas de entrega, sequência de aplicação, permissões mínimas e operações no GitHub, riscos.
- Simulação, numa pasta temporária fora do repositório, de `method/` copiado sem o curso: `check-links` falha com 35 referências (saída 1). As duas execuções estão citadas na seção 6.
- Leitura de `method/templates/` (perfil, `state.yaml`, issue de fatia), do orquestrador, do `m02-pratica.md`, do perfil `celilac-nest`, do playbook da fase A, das práticas do m00, m04, apoio A e apoio C, dos formulários de issue e do modelo de PR na raiz do `dsc-tests`, e das linhas de `check-state.mjs` que chamam o `gh`.

**O que não foi verificado:**
- Escopos do `gh` (`repo`, `project`) e regras de proteção de branch em repositórios privados gratuitos: vêm do meu conhecimento, não testei.
- Se `fatia.yml` e `fase.yml` funcionam num repositório novo sem os rótulos que eles citam (por exemplo, `type:feature`). Não testei.
- O tamanho do `.zip` e a biblioteca para gerá-lo no navegador.
- Não rodei `check-links` sobre a simulação **com** os arquivos que o kit acrescenta (`.github/`, `docs/adr/`); a contagem de 35 é do método sozinho.

**O que você precisa decidir:**
1. **Kit como ponto de partida** (seção 2): sem `state.yaml`, `ci.yml` e Compose prontos, porque são prática. Isso diverge do texto do prompt, que pedia "state.yaml inicial".
2. **Forma de entrega:** `.zip` com instruções e prompt de aplicação (seção 3). Se quer registrar o repositório-modelo (d) para o futuro.
3. **Conteúdo do kit** (seção 4.2 e 4.3), em especial incluir `method/didatico/01` a `06` e excluir curso, aplicação e exemplos. <!-- links:ignore -->
4. **Método portátil** (seção 6): opção (i), (ii) ou (iii). Se (i), autorizar a branch e o PR (o merge **não** está delegado nesta sessão).
5. **`AGENTS.md`** só em `method/`, com ajuste da linha 4 (seção 6.1).
6. **Proteção da `main`** como passo opcional do m04 e o texto sobre o limite do assistente (seção 7.3).
