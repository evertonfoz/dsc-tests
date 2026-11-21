# E1 — Plano de arquitetura

> Etapa E1 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **aguardando a escolha do professor**.
> Convenção: **[Fato]** lido no repositório (com caminho); **[Recomendação]** proposta minha; **[Suposição]** a confirmar.

---

## 1. O que a arquitetura precisa respeitar (decisões da E0)

| Decisão | Efeito na arquitetura |
|---|---|
| Roda **localmente**, sem login, acesso aberto | Não há servidor central nem contas. Custo de hospedagem: zero em qualquer alternativa. |
| Curso **autônomo**, sem área do professor | Um único papel: o aluno (sozinho ou em equipe). O progresso é só dele. |
| As atividades acontecem **no repositório do aluno** | O ponto central é como a aplicação **enxerga** esse repositório (ler o `state.yaml` e as evidências) e como entrega o **kit inicial**. |
| Stack do aluno igual à do CeliLac | [Fato] Node 24.21.0 e pnpm 12.8.1 (`project-profile.md`, seção 2). O aluno já terá Node instalado; uma aplicação em Node não exige ferramenta nova. |
| Conteúdo lido dos Markdown de `celilac-backend/` (fonte única) | A aplicação, em `curso-app/` na raiz do `dsc-tests`, lê `../celilac-backend/method/...`. Quem tem o curso tem o conteúdo. |
| Gabarito exibido **como etapa do curso** | Precisa de um registro local de "tentei a atividade" antes de liberar o gabarito (formato na E2). |
| A aplicação **nunca** executa comandos no banco do aluno | Vale para todas as alternativas; nenhuma delas precisa de acesso a banco. |

**[Fato] Reaproveitável:** `method/scripts/check-state.mjs` não tem dependências e exporta `parseYaml`, `validar` e `validarRemoto`. `method/scripts/check-links.mjs` exporta `extrairReferencias` e `verificarArquivo`. Ambos importam `node:fs`, ou seja, **rodam em Node, não no navegador**.

## 2. As alternativas

### A. Site estático gerado dos Markdown, progresso no navegador
Um gerador lê os Markdown e produz páginas HTML. O aluno abre essas páginas no navegador. O progresso fica no armazenamento do navegador.
- **Repositório do aluno:** o site não lê arquivos do disco por conta própria. Há três caminhos: o aluno cola o conteúdo do `state.yaml`; o aluno escolhe a pasta pelo seletor do navegador (API de acesso a arquivos, que só existe em navegadores baseados no Chromium); ou o aluno roda o validador no terminal e informa o resultado.
- **Kit inicial:** gerado no navegador e baixado como `.zip`.
- **Validadores:** não rodam no navegador como estão (dependem de `node:fs`). Seria preciso adaptar uma cópia, criando duas versões da mesma regra.

### B. Aplicação local com servidor Node (uma peça só)
O aluno roda `pnpm install` e `pnpm dev` (ou equivalente) em `curso-app/` e abre `http://localhost:<porta>`. O servidor lê os Markdown **ao vivo** e, se o aluno informar o caminho do próprio repositório, lê esse repositório **somente para leitura**.
- **Repositório do aluno:** leitura direta do `state.yaml`, da existência das evidências e de `git log` e `git status`. A verificação reusa `validar` do `check-state.mjs` **sem cópia**. A conferência com o GitHub (`validarRemoto`) usa o `gh` do próprio aluno, se ele estiver autenticado; a aplicação nunca guarda token.
- **Kit inicial:** mostra a lista de arquivos, avisa quais **já existem** (regra 5 do `AGENTS.md`: inspecionar antes de criar) e só grava após confirmação explícita, sem sobrescrever. O `.zip` fica como alternativa.
- **Segurança:** o servidor escuta só em `127.0.0.1`. Não executa comando no repositório do aluno além de leituras (`git log`, `git status`, validador). Nunca toca o banco.

### C. Híbrido: site estático + ferramenta de linha de comando
O mesmo site da alternativa A, mais um comando (`node curso-app/cli verificar <repo>`) que o aluno roda no terminal. O comando lê o repositório, reusa os validadores e gera um relatório JSON que o aluno importa no site.
- **Repositório do aluno:** completo, via comando, mas em dois passos (rodar, importar).
- **Kit inicial:** pode ser gerado pelo comando, que grava no disco com confirmação.

### Descartadas
- **Aplicação com backend hospedado e contas:** contradiz as decisões de execução local e sem login.
- **Aplicativo de desktop (por exemplo, Electron):** resolve o mesmo que a alternativa B com muito mais peso de empacotamento.

## 3. Comparação

| Critério | A. Estático | B. Servidor local | C. Híbrido |
|---|---|---|---|
| Leitura dos módulos, grafo de pré-requisitos, siglas | Atende | Atende | Atende |
| Conteúdo sempre igual ao repositório | Só depois de gerar o site de novo. Risco de divergência. | Lê ao vivo. Sem divergência. | Igual à A |
| Ler o repositório do aluno | Limitada: colar texto ou depender do navegador | **Direta**, somente leitura | Completa, mas em dois passos |
| Reusar os validadores do método | Não; exige uma cópia adaptada | **Sim, sem cópia** | Sim, no comando |
| Entregar o kit inicial | `.zip` | Grava com confirmação, ou `.zip` | Grava pelo comando, ou `.zip` |
| Progresso do aluno | Navegador (perde-se se os dados do site forem apagados) | Arquivo local, com exportar e importar | Navegador |
| Navegadores | Todos (a leitura de pasta só nos baseados no Chromium) | Todos | Todos |
| O que o aluno precisa ter | Só navegador (e Node, se for gerar o site) | Node e pnpm, que a stack já exige | Node e pnpm |
| Peças para manter | 1 | **1** | 2, que precisam continuar compatíveis |
| Hospedar no futuro, se mudar a decisão | Trivial (GitHub Pages) | Exige trocar a leitura de disco pela API do GitHub | As páginas, trivial; o comando continua local |
| Custo | Zero | Zero | Zero |
| Esforço relativo | Menor | Médio | Maior |

**Sobre o esforço:** é **relativo**, sem números. A estimativa em faixas, com premissas, fica para a E7, quando os marcos estiverem definidos.

## 4. Recomendação

**[Recomendação] Alternativa B, aplicação local com servidor Node.** Motivos, em ordem de peso:
1. **Ela vê o repositório do aluno**, que é onde o curso acontece. As verificações da E6 dependem disso.
2. **Ela reusa os validadores do método sem cópia.** Uma regra mudada em `check-state.mjs` vale na aplicação no mesmo instante. Isso segue a própria ideia do curso: um lugar só para cada informação (`m02-estado-como-fonte.md`, seção 3).
3. **Ela lê o conteúdo ao vivo**, o que elimina o risco de o site divergir dos Markdown. Esse é um dos riscos que o prompt pede para tratar.
4. **Ela não exige nada novo do aluno:** Node e pnpm já fazem parte da stack.

**Custos que assumo com B:**
- A aplicação não abre com dois cliques: é preciso rodar um comando. Mitigação: um único comando, documentado no README do `curso-app`.
- Se um dia ela for hospedada, a leitura do repositório do aluno terá de passar pela API do GitHub. Mitigação: isolar a leitura do repositório atrás de uma interface própria desde o primeiro marco.

**[Suposição] Tecnologia:** TypeScript (a mesma linguagem do curso), com um framework web que tenha rotas de servidor e processamento de Markdown embutido. A escolha final fica para a E7, junto com a estratégia de testes.

## 5. Pontos que esta escolha deixa para etapas seguintes

| Ponto | Etapa |
|---|---|
| Onde fica o arquivo de progresso: dentro do `curso-app/` (ignorado pelo git) ou dentro do repositório do aluno. E, em equipe, se é um por integrante. | E4 |
| Como o aluno informa o caminho do repositório e o que acontece se ele apontar para a pasta errada | E4 e E5 |
| Quais comandos de leitura são permitidos no repositório do aluno, em lista fechada | E5 e E6 |
| Formato dos metadados, siglas e liberação do gabarito | E2 |

---

## 6. Revisão: alternativa B em contêiner (proposta do professor, 2026-11-21)

**Proposta:** a aplicação é **independente**, distribuída como **imagem Docker**. O aluno a executa em um contêiner na própria máquina. No futuro, ela será publicada na internet.

**[Fato] Encaixe com o curso:** o Docker já é necessário nas máquinas dos alunos (regra da seção 3 do prompt; apoio D, `method/didatico/curso/apoio-d-conteineres-docker-e-compose.md`). Não é uma ferramenta nova.

### 6.1. O que muda em relação à B original

| Aspecto | B original | B em contêiner (B′) |
|---|---|---|
| O que o aluno precisa ter | Clone do `dsc-tests`, Node e pnpm | Só Docker e a imagem |
| De onde vem o conteúdo | Lido ao vivo de `../celilac-backend/` | **Copiado para dentro da imagem** na construção (Markdown do curso, UC12, validadores e mascotes) |
| Conteúdo igual ao repositório | Sempre | Igual ao commit de onde a imagem foi construída. A aplicação **mostra esse commit**, e o CI constrói a imagem de novo a cada mudança de conteúdo. |
| Leitura do repositório do aluno | Caminho informado na tela | Pasta do aluno **montada no contêiner somente para leitura** (`:ro`). O próprio Docker impede a escrita. |
| Kit inicial | Gravado com confirmação, ou `.zip` | **`.zip` para baixar**, já que a pasta montada é só de leitura. [Recomendação] Manter assim: é mais seguro e funciona igual na versão da internet. |
| Validadores | Importados do repositório | Os mesmos arquivos, copiados na construção da imagem (cópia de build, não versão paralela) |
| Conferência com o GitHub (`--remote`) | `gh` do aluno | O contêiner não tem o login do `gh` do aluno. [Recomendação] Nesta versão, mostrar "a confirmar" e o comando para o aluno rodar no terminal dele. A alternativa seria passar um token ao contêiner; não recomendo. Detalhes na E6. |
| Progresso | Arquivo local | [Recomendação] No **navegador**, com exportar e importar. Funciona igual localmente e na versão da internet; um volume Docker funcionaria só localmente. Decisão na E4. |
| Caminho para a internet | Exigia reescrever a leitura do repositório | Previsto desde já: a leitura do repositório do aluno fica atrás de uma interface com duas implementações, **pasta montada** (agora) e **API do GitHub** (futuro, para repositórios públicos). |

### 6.2. Como o aluno usaria (formato ilustrativo)
```
docker run --rm -p 127.0.0.1:4321:4321 -v "<caminho-do-seu-repositorio>:/repo:ro" <imagem-do-curso>
```
Depois, ele abre `http://localhost:4321`. Sem a montagem (`-v`), a aplicação funciona só para leitura do curso, e as verificações aparecem como "a confirmar". A porta e o nome da imagem são exemplos, não decisões.

### 6.3. Pontos que ainda não sei e ficam registrados
- **[Suposição]** Ler o `.git` de uma pasta montada dentro do contêiner exige configurar o git como "diretório confiável", porque o dono dos arquivos é outro usuário. Não testei.
- **[Suposição]** Montagem de pastas no Windows (caminhos e desempenho) precisa ser testada; o curso não diz quais sistemas operacionais os alunos usam.
- **Distribuição da imagem:** construída pelo aluno a partir do `dsc-tests` ou publicada em um registro (por exemplo, o do GitHub). Publicar é uma ação externa e depende da sua autorização. Fica para a E5 ou a E7.
- **"Independente":** entendi como independente **na execução** (o aluno não precisa do repositório do curso). O código continua em `curso-app/`, na raiz do `dsc-tests` (decisão P8), porque a imagem precisa do conteúdo ao lado para ser construída. Se você quis dizer **repositório separado**, avise.

### 6.4. Recomendação revista
**[Recomendação] B′: aplicação com servidor Node, distribuída em imagem Docker**, com:
1. conteúdo embutido na imagem e o commit de origem visível na aplicação;
2. repositório do aluno montado somente para leitura;
3. kit entregue como `.zip`;
4. progresso no navegador, com exportar e importar;
5. leitura do repositório do aluno atrás de uma interface, preparando a versão da internet.

A B′ mantém os motivos que levaram à B (lê o repositório do aluno, reusa os validadores) e acrescenta três ganhos: o aluno não precisa clonar o `dsc-tests`, o modo somente leitura é garantido pelo Docker e não só pelo código, e o caminho para a internet já está previsto. Ela também perde algo: o conteúdo deixa de ser lido ao vivo e fica preso à versão da imagem, o que é tratado pelo item 1.

---

## 7. Decisões do professor e consequência (2026-11-21)

| Pergunta | Resposta |
|---|---|
| A aplicação do curso lê o repositório do aluno? | **Não, nunca.** O repositório da aplicação do aluno é independente da aplicação do curso. |
| Onde fica o código da aplicação do curso? | `curso-app/` no `dsc-tests`; é independente **na execução**. |
| Arquitetura B′ (imagem Docker, conteúdo embutido com commit visível, kit em `.zip`, progresso no navegador, preparada para a internet) | **Confirmada.** |

### 7.1. Consequência: o servidor deixa de ser necessário
Os motivos 1 e 2 da recomendação da seção 4 eram ler o repositório do aluno e rodar os validadores nele. Com a decisão acima, os dois deixam de valer. Tudo o que sobra cabe em páginas geradas na construção da imagem:

| Funcionalidade | Onde roda |
|---|---|
| Leitura dos módulos, siglas, grafo de pré-requisitos, UC12 navegável | Páginas geradas a partir dos Markdown na construção da imagem |
| Progresso, respostas da prática, checklists, liberação do gabarito | No navegador, com exportar e importar |
| Kit inicial | Gerado no navegador a partir dos modelos embutidos e baixado como `.zip` |
| Verificação de evidências | A aplicação **mostra os comandos** (por exemplo, `method/scripts/check-state.sh docs/uc/<uc>/state.yaml`) e o que o aluno deve observar na saída. **Quem roda e quem atesta é o aluno.** A aplicação não confere nada. |
| Mascotes | Imagens embutidas |

**[Recomendação] B′ simplificada:** a imagem Docker constrói o site estático a partir do conteúdo e o serve com um servidor web mínimo. Não há servidor de aplicação nem leitura de disco do aluno, e os validadores não precisam estar na imagem para rodar (o kit os entrega ao aluno). Para ir à internet no futuro, basta publicar a mesma imagem, ou as mesmas páginas, em qualquer hospedagem estática. A interface de leitura do repositório (seção 6.1) deixa de existir.

Isso **não muda nenhum item que você confirmou**: imagem Docker, conteúdo embutido com commit visível, kit em `.zip`, progresso no navegador e caminho para a internet. Muda só o que roda dentro do contêiner.

**Efeito sobre etapas seguintes:**
- E6 (verificação de evidências) passa a ser "o que o aluno roda e como sabe que deu certo". A aplicação não prova nada, e deve dizer isso na tela.
- Nenhuma montagem de pasta, e com isso as suposições da seção 6.3 sobre o `.git` e o Windows deixam de importar.

---

## Fechamento

**O que foi feito:** três alternativas comparadas sob as decisões da E0, com recomendação. Conferi no repositório a versão do Node e do pnpm e as funções exportadas pelos dois validadores.

**O que não foi verificado:**
- Se `validar` do `check-state.mjs` funciona chamado de fora de `celilac-backend/`, apontando para o repositório de outra pessoa. Li a assinatura, não executei.
- O comportamento da API de acesso a arquivos do navegador em cada navegador. A restrição ao Chromium vem do meu conhecimento, não de um teste.
- As alternativas de framework. Nenhuma foi instalada nem testada.

**O que você precisa decidir:** confirmar a B′ da seção 6 (ou ajustar algum dos cinco itens) e esclarecer se "independente" inclui repositório separado. A escolha será registrada como decisão no `estado.md`, e só então começo a E2.
