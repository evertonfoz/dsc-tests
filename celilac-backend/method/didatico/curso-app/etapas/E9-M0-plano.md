# E9 — Plano do marco M0 (esqueleto e esteira)

> Etapa E9, marco M0, do plano da aplicação web do curso. Data: 2026-11-21. Situação: **aprovado pelo professor em 2026-11-21** (todos os itens; instalação, branch e PR autorizados; merge não delegado).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar na implementação.
> Nenhuma dependência foi instalada, nenhuma imagem foi baixada e nenhum arquivo do curso, do método ou de `curso-app/` foi alterado nesta sessão. As versões abaixo foram **consultadas** no registro npm e no Docker Hub (somente leitura).

---

## 1. Entradas
- **Escopo do M0** (E7, seção 4): projeto em `curso-app/`; `Dockerfile` em dois estágios (gerar e servir); duas páginas (índice do curso e `m00`); commit de origem no rodapé; validação do front matter que **impede a imagem** se falhar; CI próprio da aplicação.
- **Critérios de aceite** (E7, seção 4.1, M0): (1) a imagem não é gerada se um arquivo tiver campo obrigatório ausente, `prerequisitos` apontando para `id` inexistente ou ciclo no grafo; (2) o rodapé mostra o commit passado na construção; (3) a imagem final não contém Node nem o código-fonte; (4) o contêiner responde só em `127.0.0.1:4321` no comando documentado; (5) o CI da aplicação roda em PR e não publica nada.
- **Acréscimos da E8:** a **data** do commit no rodapé (P3); auditoria de dependências no CI sem bloquear por baixa severidade (R19, aprovada).
- **Tecnologia aprovada** (E7, seção 2): Astro, servidor estático sem privilégios, Vitest; Node 24.21.0 e pnpm 12.8.1. [Fato] Executado nesta sessão: `node --version` → `v24.21.0`; `pnpm --version` → `12.8.1`; `docker --version` → `29.4.0`.
- **Fora do M0** (entra no marco indicado): demais páginas, links entre arquivos, siglas, grafo e mascotes (M1); Playwright e axe-core (M1, primeiro marco com critério no navegador); `fflate` (M5); página "Sobre esta versão" (M7, critério 3 da E8, seção 6).

## 2. Dependências a instalar (pede autorização)

[Recomendação] Versões **exatas**, a mais nova publicada há pelo menos 14 dias (reduz o risco de versão recém-publicada e comprometida; R19).

| Pacote | Versão | Para quê | [Fato] consultado nesta sessão |
|---|---|---|---|
| `astro` | 7.4.7 | gerador do site; valida o front matter por esquema (Zod embutido, `astro/zod`, sem instalar Zod à parte) | publicada em 2026-11-05; `engines.node >=22.23.4` (a mais nova, 7.4.13, é de 2026-11-18) |
| `@astrojs/check` | 0.9.12 | verificação de tipos das páginas | `peerDependencies`: `typescript ^5 \|\| ^6` |
| `typescript` | 6.0.3 | linguagem | a 7.0.2 existe, mas **não** é aceita pelo `@astrojs/check` (peer acima) |
| `vitest` | 5.1.0 | testes de unidade do validador | publicada em 2026-11-02; `engines.node` inclui `^24.0.0` |

Imagens base (baixadas pelo `docker build`, também "instalação"):

| Imagem | Estágio | [Fato] |
|---|---|---|
| `node:24.21.0-alpine` | gerar | tag existe (`docker manifest inspect`) |
| `nginxinc/nginx-unprivileged:1.31-alpine` | servir; roda sem privilégios, escuta na 8080 | tag existe (`docker manifest inspect`) |

[Recomendação] Fixar as duas imagens também pelo *digest* (resumo criptográfico que identifica o conteúdo exato da imagem), anotado no PR. [Suposição] A compatibilidade do Astro 7.4.7 com o Node 24.21.0 vem só do campo `engines`; só a construção confirma.

## 3. O que será criado

| Caminho (raiz do `dsc-tests`) | Conteúdo |
|---|---|
| `curso-app/package.json`, `pnpm-lock.yaml` | versões exatas da seção 2; `packageManager: pnpm@12.8.1`; scripts `dev`, `build`, `check`, `test` | <!-- links:ignore -->
| `curso-app/astro.config.mjs` | saída estática; sem integrações que acessem a rede | <!-- links:ignore -->
| `curso-app/src/content.config.ts` | coleção `curso` lida de `../celilac-backend/method/didatico/curso/*.md` (exceto `README.md`), com esquema por `tipo`; coleção `indice` só com o `README.md` | <!-- links:ignore -->
| `curso-app/src/conteudo/validar.ts` | regras entre arquivos (seção 4.2), em função pura, sem acesso a disco | <!-- links:ignore -->
| `curso-app/src/textos.ts` | todos os textos da interface num só arquivo (E7, seção 8.2) | <!-- links:ignore -->
| `curso-app/src/layouts/Base.astro` | `lang="pt-BR"`, um título de nível 1, link "pular para o conteúdo", tema claro e escuro, rodapé com commit e data |
| `curso-app/src/pages/index.astro`, `m00.astro` | índice (corpo do `README.md` do curso) e módulo 0 |
| `curso-app/tests/` | testes Vitest do validador, com arquivos de exemplo quebrados de propósito |
| `curso-app/Dockerfile` e `Dockerfile.dockerignore` | dois estágios; contexto = raiz do `dsc-tests`, com lista do que **entra** (seção 5) |
| `curso-app/nginx.conf` | porta 8080, sem versão no cabeçalho, política de segurança de conteúdo `default-src 'self'` (o navegador recusa recurso de fora; reforça a regra 3 da E4, seção 7) |
| `curso-app/scripts/construir.sh`, `executar.sh` | o "comando único" (E7, seção 3, item 5), descritos na seção 5 | <!-- links:ignore -->
| `.github/workflows/curso-app-ci.yml` | CI próprio (seção 6) | <!-- links:ignore -->
| `curso-app/README.md` | atualizado: situação "M0", como construir e executar |

**Limite do M0, declarado na tela:** os links do `README.md` e do `m00` para outros arquivos do curso ainda apontam para `.md` e não funcionam na aplicação; a conversão é do M1. O índice mostra um aviso "versão em construção: só o módulo 0 está disponível".

## 4. Validação do conteúdo (critério 1)

### 4.1. Por arquivo (esquema do front matter)
[Fato] Formato da E2, seção 3, e campos acrescentados na E3, parte 1 (`estado.md`, "Pendências"): `prerequisitos_se_precisar`, `gabarito_de`, `pratica_de`.

| `tipo` | Campos obrigatórios | Opcionais |
|---|---|---|
| `modulo`, `apoio`, `projeto` | `id`, `tipo`, `titulo`, `ordem` (inteiro ≥ 1), `prerequisitos` (lista, pode ser vazia), `duracao` | `prerequisitos_se_precisar`, `gabarito`, `pratica`, `substitui` |
| `gabarito` | `id`, `tipo`, `titulo`, `gabarito_de` (lista não vazia) | — |
| `pratica` | `id`, `tipo`, `titulo`, `pratica_de` | — |

Campo desconhecido também falha (pega erro de digitação como `prerequisito`).

### 4.2. Entre arquivos
1. `id` único e igual ao início do nome do arquivo (`m00` ↔ `m00-o-caso-pronto.md`; `m01-gabarito` ↔ `m01-gabarito.md`).
2. `ordem` única entre módulos, apoios e projeto.
3. Todo `id` citado em `prerequisitos`, `prerequisitos_se_precisar`, `gabarito`, `gabarito_de`, `pratica`, `pratica_de` e `substitui` existe (exceto `substitui`, que aponta para `id` antigo e deve **não** existir).
4. Reciprocidade: `gabarito: X` em A ⇔ `A ∈ X.gabarito_de`; `pratica: Y` em A ⇔ `Y.pratica_de = A`.
5. Sem ciclo no grafo de `prerequisitos` (os condicionais entram no teste de ciclo também).

**Mensagem de erro** (uma linha por problema, todas de uma vez, não só a primeira):
```
conteúdo inválido: m05-onde-mora-a-regra.md: prerequisitos: "m3" não existe
conteúdo inválido: ciclo em prerequisitos: m03 → m05 → m03
```
[Suposição] As mensagens do esquema por arquivo vêm do próprio Astro (que cita o arquivo e o campo); se não forem claras, o validador da seção 4.2 repete a checagem com mensagem própria.

### 4.3. Fica para o M1
A E2, seção 3, prevê comparar o front matter com a linha "Pré-requisito" do corpo e falhar se divergirem. [Fato] Essa linha é texto livre e varia (`m00` usa "Antes de começar"; o `m01` traz um pré-requisito condicional em prosa). [Recomendação] Tratar no plano do M1, com a lista de casos reais à frente, e não no M0.

## 5. Imagem e comando único

**Construir** (`curso-app/scripts/construir.sh`, executado na raiz do `dsc-tests`): <!-- links:ignore -->
```
docker build -f curso-app/Dockerfile \
  --build-arg ORIGEM_COMMIT=$(git rev-parse HEAD) \
  --build-arg ORIGEM_DATA=$(git show -s --format=%cI HEAD) \
  -t curso-app:local .
```
**Executar** (`curso-app/scripts/executar.sh`): `docker run --rm -p 127.0.0.1:4321:8080 curso-app:local`, e abrir `http://127.0.0.1:4321`. <!-- links:ignore -->

- **Estágio "gerar"** (`node:24.21.0-alpine`): instala com `--frozen-lockfile`, roda o validador e `astro build`. Sem `ORIGEM_COMMIT`, a construção **falha** (o rodapé nunca fica sem origem). No servidor de desenvolvimento, sem o argumento, o rodapé mostra "commit a confirmar".
- **Estágio "servir"** (`nginx-unprivileged`): recebe só a pasta gerada. Sem Node, sem `src/`, sem os Markdown.
- **O que entra no contexto** (`Dockerfile.dockerignore`, lista de permissão): `curso-app/` (sem `node_modules` e `dist`) e `celilac-backend/method/didatico/curso/`. `mascotes/web/` e `docs/uc/uc12/` entram nos marcos que os usam (M1 e M2). [Suposição] O arquivo `<Dockerfile>.dockerignore` ao lado do `Dockerfile` é reconhecido pelo BuildKit, o que evita um `.dockerignore` na raiz que afetaria outros projetos; confirmar na construção.
- **Rodapé:** "Conteúdo do commit `abc1234` (21/11/2026, 14:20 UTC)", com o commit completo no atributo de título. Data guardada em UTC e exibida no formato brasileiro (E7, seção 8.2).

## 6. CI da aplicação (critério 5)

`.github/workflows/curso-app-ci.yml`, seguindo o de referência ([Fato] `.github/workflows/celilac-backend-ci.yml`: `permissions: contents: read`, linha 16; `concurrency`, linhas 19 a 21; Node e pnpm, linhas 28 e 29). <!-- links:ignore -->

| Item | Valor |
|---|---|
| Dispara em | `pull_request` e `push` na `main`, com mudança em `curso-app/**`, `celilac-backend/method/**`, `celilac-backend/docs/uc/uc12/**`, `mascotes/web/**` ou no próprio workflow (E7, seção 6) |
| Permissões | `contents: read`; sem `docker login`, sem `push`, sem `packages: write` |
| Trabalho 1 — qualidade | `pnpm install --frozen-lockfile`; `pnpm check`; `pnpm test`; `pnpm build`; `node method/scripts/check-links.mjs method docs/uc` (em `celilac-backend/`); `pnpm audit --audit-level high` (falha só em alta ou crítica; R19) |
| Trabalho 2 — imagem | construção com o commit do PR; construção **negativa** (um `id` de pré-requisito trocado com `sed` na cópia do executor: a construção tem de falhar com a mensagem da seção 4.2); execução e testes de fumaça da seção 7 |

**Diferença em relação à E7, seção 6** (decisão sua, seção 9, item 3): a E7 põe o `check-links` "na construção da imagem". [Fato] Ele precisa de `method/` e de `docs/uc/` inteiros, e os documentos de `docs/uc/` citam arquivos de código do `celilac-backend`; levá-lo para dentro do `Dockerfile` obrigaria a pôr boa parte do repositório no contexto. [Recomendação] Rodá-lo no trabalho 1 do CI, que já impede o PR de ficar verde. O validador de front matter continua **dentro** da construção.

## 7. Testes e critérios de aceite

| Critério (E7, 4.1) | Como é verificado | Onde |
|---|---|---|
| (1) front matter inválido impede a imagem | Vitest: um arquivo de exemplo por regra das seções 4.1 e 4.2 (campo ausente, campo desconhecido, `id` inexistente, ciclo, `id` duplicado, reciprocidade); construção negativa no CI | CI, trabalhos 1 e 2 |
| (2) rodapé com o commit | `curl` na página inicial e em `/m00/`: contém o commit curto e a data | CI, trabalho 2 |
| (3) sem Node nem código-fonte | `docker run --entrypoint sh ... -c 'command -v node'` falha; a pasta servida não tem `.md`, `.ts` nem `node_modules` | CI, trabalho 2 |
| (4) só em `127.0.0.1:4321` | `docker port` mostra `127.0.0.1:4321`; `curl` em `127.0.0.1:4321` responde 200; `curl` no endereço de rede do executor não responde | CI, trabalho 2 |
| (5) CI em PR, sem publicar | o próprio PR dispara o workflow; conferência por leitura das permissões e passos | revisão do PR (manual) |
| Acessibilidade básica | `lang`, um `h1`, link de pular, foco visível | manual no M0; automático com axe-core a partir do M1 |

**Demonstração para você** (E7, seção 4): `docker build` com um front matter quebrado de propósito falha com a mensagem do arquivo e do campo; corrigido, a imagem sobe e mostra o commit. A alteração de teste é feita numa cópia e **não** é commitada.

## 8. Entrega
- **Branch:** `feat/curso-app-m0`, a partir da `main` atual (`7cb1515`). <!-- links:ignore -->
- **Um PR**, com este plano, o código do M0, o CI e o registro no `estado.md`. Commits separados: plano e estado; esqueleto e validador com testes; `Dockerfile` e scripts; CI.
- **Estimativa:** 1 a 2 sessões (E7, seção 5), sujeita à premissa 1 (Astro com Node 24.21.0 sem contorno).
- **O que reabre o plano:** se a construção mostrar incompatibilidade de versão ou se o Astro não ler conteúdo fora da pasta do projeto ([Suposição]; alternativa: copiar os Markdown para dentro de `curso-app/` na construção, sem versioná-los).

## 9. Divergências e pendências encontradas nesta sessão
- **Registro do PR #86.** O `estado.md` deixou "data e commit de merge a registrar". [Fato, executado nesta sessão] `gh pr view 86`: `MERGED` em 2026-11-21T14:20:54Z, commit de merge `7cb1515`, cabeça `3cae453`; `gh pr checks 86`: os quatro trabalhos com `pass` (execução 44913241318); `git ls-remote`: a branch `docs/curso-app-e8-riscos` ainda existe no remoto. Registrado no `estado.md`. <!-- links:ignore -->
- **`typescript` 7 fora de alcance:** o `@astrojs/check` aceita só as versões 5 e 6 (seção 2). Não muda decisão.
- **`check-links` fora do `Dockerfile`** (seção 6): diferença em relação à E7, seção 6; **aprovada** pelo professor em 2026-11-21.

## 10. Registro da implementação (2026-11-21)
Plano aprovado por inteiro; instalação, branch e PR autorizados; merge não delegado.

**[Fato, executado nesta sessão, na máquina local]**
| Critério | Resultado |
|---|---|
| (1) front matter inválido impede a imagem | 19 testes Vitest passando (`pnpm test`); `scripts/testar-construcao-negativa.sh`: o `docker build` com `prerequisitos: [m99, ...]` na **cópia** do `m05` falhou com `conteúdo inválido: m05-onde-mora-a-regra.md: prerequisitos: "m99" não existe`. O curso no repositório não foi alterado (`git status`) | <!-- links:ignore -->
| (2) rodapé com o commit | `scripts/testar-imagem.sh`: `/` e `/m00/` mostram `7cb1515` e a data (construção feita sobre a `main` com mudanças não commitadas, e o `construir.sh` avisou isso) | <!-- links:ignore -->
| (3) sem Node nem código-fonte | `command -v node` falha na imagem final; nenhum `.md`, `.ts`, `.astro`, `package.json` ou `node_modules` |
| (4) só em `127.0.0.1:4321` | `docker port`: `8080/tcp -> 127.0.0.1:4321`; responde em `127.0.0.1:4321`; não responde no endereço de rede da máquina |
| (5) CI em PR, sem publicar | workflow `.github/workflows/curso-app-ci.yml` com `contents: read`, sem login nem `push`; resultado no PR |
| Outros | `pnpm check`: 0 erros; `pnpm audit --audit-level high`: nenhuma vulnerabilidade conhecida; imagem com 91,4 MB; contexto de construção só com `curso-app/` e o curso (conferido no estágio "gerar": nenhum pacote do macOS copiado) |

**Diferenças em relação ao plano** (nenhuma muda decisão):
- **Realce de código desligado** no M0: o Shiki grava cores em atributos `style=""`, bloqueados pela política `style-src 'self'` da seção 3. Os blocos ficam legíveis pelo CSS próprio. Reavaliar no M1 (realce por classes).
- **Telemetria do Astro desligada** (`ASTRO_TELEMETRY_DISABLED=1`) no `Dockerfile` e no CI: ela enviaria dados pela rede durante a construção.
- **`@types/node` não instalado** (não estava na lista autorizada): o rodapé lê as variáveis por `globalThis.process`.
- **Validação dentro da construção do Astro**, não em script à parte: a coleção é lida sem esquema e `src/conteudo/carregar.ts` aplica o esquema e as regras entre arquivos, com mensagens próprias, todas de uma vez. Isso resolve a [Suposição] da seção 4.2. <!-- links:ignore -->
- **Scripts de teste** `testar-imagem.sh` e `testar-construcao-negativa.sh`, usados pelo CI e localmente; `executar.sh` roda o contêiner com sistema de arquivos só de leitura, sem capacidades e com `no-new-privileges`.
- **Digests** das imagens base fixados no `Dockerfile` (`node` `sha256:ebfe2f90…`, `nginx-unprivileged` `sha256:b5047b9b…`).

**A confirmar:** CI no GitHub (resultado no PR); acessibilidade manual (teclado, leitor de tela, ampliação a 200%) não executada; comportamento em Windows.

---

## Fechamento

**O que foi feito:**
- Plano do M0: dependências com versões exatas, estrutura de arquivos, regras de validação do front matter, imagem em dois estágios, comando único, CI, testes por critério de aceite e forma de entrega.
- Executados nesta sessão (somente leitura): `gh pr view 86`, `gh pr checks 86`, `git ls-remote`; `node`, `pnpm` e `docker --version`; `npm view` das versões e datas dos pacotes; `docker manifest inspect` das duas imagens base. Lidos: `method/AGENTS.md`, `estado.md`, E7 e E8 inteiras, E2, seção 3, front matter de cinco arquivos do curso e o CI de referência.

**O que não foi verificado:**
- Nada foi instalado nem construído: a compatibilidade do Astro 7.4.7 com o Node 24.21.0, a leitura de conteúdo fora da pasta do projeto, as mensagens de erro do esquema e o `Dockerfile.dockerignore` são suposições até a construção.
- Os *digests* das imagens base não foram anotados.
- O tamanho final da imagem.

**O que você precisa decidir:**
1. Autorizar **instalar as dependências** da seção 2 em `curso-app/` (gera `pnpm-lock.yaml`) e **baixar as duas imagens base**.
2. Autorizar **branch e PR** do M0 (seção 8). Merge não delegado, salvo decisão sua.
3. **`check-links` no CI e não dentro do `Dockerfile`** (seção 6).
4. Adiar Playwright e axe-core para o M1 e a comparação com a linha "Pré-requisito" do corpo para o plano do M1 (seções 1 e 4.3).
