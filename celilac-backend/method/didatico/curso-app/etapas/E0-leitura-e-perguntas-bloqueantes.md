# E0 — Leitura do material e perguntas bloqueantes

> Etapa E0 do plano da aplicação web do curso (ver `method/didatico/curso-app/prompt-plano-da-aplicacao.md`).
> Data: 2026-11-21. Situação: **aguardando respostas do professor**. Nenhum código foi escrito e nenhum arquivo do curso foi alterado.
> Convenção deste documento: **[Fato]** foi lido no repositório (com caminho); **[Recomendação]** é proposta minha; **[Suposição]** precisa de confirmação.

---

## 1. O que foi lido

| Material | Caminho | Observação |
|---|---|---|
| Regras do método | `method/AGENTS.md` | Lido por inteiro; regras 3, 8, 9, 19 e 21 condicionam este trabalho |
| Estado da aplicação | `method/didatico/curso-app/estado.md` | Etapa E0, nada decidido |
| README do curso | `method/didatico/curso/README.md` | Mapa dos módulos, regra de siglas, quadro com 22 siglas |
| Módulos e apoios | `method/didatico/curso/` | Lidos por inteiro: m02 e projeto final; demais lidos pelos títulos de seção e pré-requisitos |
| Orquestrador | `method/orquestrador/prompt-do-estudante.md` | Lido por inteiro |
| Modelo de estado | `method/templates/state.yaml` | Lido por inteiro |
| Modelo de perfil | `method/templates/project-profile.md` | Lido o início |
| Validador de links | `method/scripts/check-links.mjs` | Lido o cabeçalho (uso e códigos de saída) |
| Caso real | `docs/uc/uc12/` | Apenas listado: `state.yaml`, `contrato.md`, `relatorios/` A a F, `evidencias/` A a F |
| Mascotes | `mascotes/` na raiz do repositório `dsc-tests` (fora de `celilac-backend`) | 23 imagens PNG; ver 2.6 |

**Não lidos por inteiro nesta etapa:** os módulos m00, m01, m03 a m12, os apoios, os gabaritos, os playbooks, as ADRs e os relatórios do UC12. Serão lidos na etapa em que forem necessários (E2 para o conteúdo, E5 para o kit, E6 para as evidências).

## 2. Fatos relevantes para o planejamento

### 2.1. Inventário do curso
- **[Fato]** 33 arquivos Markdown em `method/didatico/curso/`, 2.563 linhas no total: README, 13 módulos (m00 a m12), 4 apoios (A a D), projeto final e **14 gabaritos** (m01 a m12, apoio C e projeto final).
- **[Fato]** O README diz que m00 e os apoios A, B e D não têm gabarito; os arquivos confirmam.

### 2.2. A estrutura dos módulos é regular, mas não padronizada para programa
- **[Fato]** Os pré-requisitos estão em texto livre, numa linha de citação no topo, com três formas: `> **Pré-requisito:** ...` (m01 a m12, apoios A, C e D, projeto final), `> **Antes de começar:** ...` (m00) e só `> **Para quem:** ...` (apoio B). Exemplo: `m12-quem-aprova.md` exige "módulos 1, 2, 3, 7, 10 e 11". Dá para extrair por padrão de texto, mas é frágil.
- **[Fato]** 16 de 17 arquivos (módulos e apoios) têm a seção com o título exato "Pratique no seu domínio"; o apoio B usa "Pratique (qualquer linguagem)".
- **[Fato]** O título da seção sobre IA tem quatro variações ("neste módulo", "aqui", "no projeto", e uma sem a expansão da sigla).
- **[Fato]** 18 arquivos têm a seção "Como saber que funcionou", com checklists no formato `- [ ]`.
- **[Fato]** A numeração das seções varia entre módulos (a prática é a seção 5, 6, 7 ou 8). Só m05 a m12 têm "Exercícios".
- **[Fato]** Nenhum arquivo do curso tem metadados estruturados (*front matter*, o bloco de dados no topo de um Markdown).
- **[Recomendação]** Isso aponta para uma etapa E3 provável: front matter com id, tipo, pré-requisitos e duração; não é bloqueante agora, será proposto em E2.

### 2.3. O repositório é público, e os gabaritos estão nele
- **[Fato]** `gh repo view` informa que `evertonfoz/dsc-tests` tem visibilidade `PUBLIC`.
- **[Fato]** Os 14 gabaritos estão na mesma pasta dos módulos, no mesmo repositório.
- **Consequência:** o requisito "gabaritos nunca visíveis ao aluno" **não pode ser garantido pela aplicação** enquanto os gabaritos estiverem em repositório público: qualquer aluno pode abri-los no GitHub. Ver pergunta P1.

### 2.4. Outros fatos que condicionam a arquitetura
- **[Fato]** O curso assume um repositório **por aluno**, com `method/` copiado, `AGENTS.md` na raiz, `project-profile.md` e `docs/uc/<uc>/state.yaml` (`projeto-final.md`, seção 2).
- **[Fato]** O `state.yaml` é validado por `method/scripts/check-state.sh`, sem internet; com `--remote`, consulta o GitHub somente para leitura (`m02-estado-como-fonte.md`, seção 5). É o candidato natural para a aplicação ler o progresso real do aluno.
- **[Fato]** O CI do repositório está em `.github/workflows/celilac-backend-ci.yml`, na raiz do `dsc-tests`.
- **[Fato]** O perfil de stack disponível é um só: `method/perfis/celilac-nest.md`.

### 2.5. Limites declarados que a aplicação terá de mostrar
- **[Fato]** Só o arquétipo "criar" foi exercitado em caso real (UC12); os demais são esboços (`projeto-final.md`, seção 2; `method/orquestrador/prompt-do-estudante.md`, "Limites do método hoje").
- **[Fato]** Durações são estimativas não testadas com turmas (`projeto-final.md`, linha de pré-requisito).
- **[Fato]** O UC12 teve revisão solo ou de IA, não independente (mesmo orquestrador).

### 2.6. Mascotes
- **[Fato]** 23 imagens (`mascote_001.png` a `mascote_023.png`) em 1024×1024 e uma cópia de cada em `mascotes/web/` em 512×512 (cerca de 80 KB cada), com fundo transparente. As duas que abri mostram uma coruja com óculos e o símbolo `</>`, em poses diferentes (acenando; regendo).
- **[Fato]** A pasta está fora de `celilac-backend/`, no repositório `dsc-tests`; você autorizou o uso nesta conversa.
- **[Recomendação]** Sorteio sem repetição por sessão (embaralhar a lista e percorrê-la; só repetir depois de usar as 23), com texto alternativo e sem papel de "aprovar" algo: o mascote não comemora gate nem conclusão que a aplicação não pode verificar.

## 3. Perguntas bloqueantes

Cada pergunta muda o que será proposto em E1 (arquitetura) ou E4 (dados e papéis). Indico a minha recomendação, mas a decisão é sua.

| # | Pergunta | Por que bloqueia | Opções | Recomendação |
|---|---|---|---|---|
| **P1** | Os gabaritos podem sair do repositório público? | Sem isso, "nunca visíveis ao aluno" é falso (ver 2.3). | (a) mover os 14 gabaritos para um repositório **privado** do professor (mudança de conteúdo, em E3); (b) aceitar que estão públicos e a aplicação apenas não os exibe, declarando o limite; (c) tornar o `dsc-tests` privado. | (a). É a única que torna a regra verdadeira sem depender da aplicação. |
| **P2** | Há infraestrutura ou orçamento para hospedar a aplicação? | Define se é viável ter backend e banco. | (a) só hospedagem estática gratuita (GitHub Pages); (b) serviço gerenciado com plano gratuito (por exemplo, um banco com autenticação embutida); (c) servidor da instituição; (d) não sei, compare em E1. | (d), com (a) como piso obrigatório de comparação. |
| **P3** | Como o aluno se identifica? | Define contas, dados pessoais e privacidade. | (a) sem conta: progresso fica no navegador; (b) login com a conta do GitHub; (c) login institucional (se existir, qual?); (d) e-mail. | (b). O aluno já precisa do GitHub, e evita guardar senha. |
| **P4** | A visão da turma precisa estar **dentro** da aplicação? | Se sim, precisa de backend e contas; se basta ler os repositórios dos alunos, um site estático pode bastar. | (a) sim, painel com progresso de cada aluno; (b) basta uma lista dos repositórios, e a aplicação lê o `state.yaml` de cada um (somente leitura); (c) não precisa nesta versão. | (b) no primeiro marco: usa o que o método já tem como fonte da verdade. |
| **P5** | Em que stack o aluno trabalha? | O kit inicial depende disso (perfil, comandos, CI). | (a) todos em NestJS, com o perfil `celilac-nest`; (b) stack livre, e o kit traz só o método e modelos; (c) poucas stacks pré-definidas. | (a) para a primeira turma, por ser o único perfil existente; registrar (b) como evolução. |
| **P6** | O aluno trabalha sozinho, em dupla, ou ambos? E quantos alunos por turma, aproximadamente? | Muda o modelo de dados (repositório por pessoa ou por dupla) e a regra "quem escreveu não revisa". | Individual / dupla / ambos; número aproximado. | Ambos, com repositório por dupla. Quero o número só para dimensionar. |
| **P7** | Que conteúdo entra na aplicação, além dos módulos e apoios? | Define o escopo do pipeline (E2). | (a) só o curso; (b) curso e o UC12 navegável como exemplo resolvido; (c) também os seis textos numerados de `method/didatico/` (01 a 06), os playbooks e as ADRs. | (b). O UC12 é o "gabarito público" do método; o resto fica como link. |
| **P8** | Onde mora o código da aplicação? | Afeta a "fonte única" (o site precisa ler os Markdown) e o CI. | (a) dentro de `celilac-backend/`; (b) em outra pasta do `dsc-tests`; (c) repositório próprio, que lê o conteúdo daqui no momento da geração. | (c). Separa o ciclo de vida da aplicação do backend de referência e evita misturar CI. |

### 3.1. Respostas do professor (2026-11-21)

| # | Resposta | Situação |
|---|---|---|
| P1 | Sem resposta direta | **Em aberto** (reformulada abaixo como P1′) |
| P2 | A aplicação roda **localmente**, a princípio | Decidida |
| P3 | **Sem login**, acesso aberto | Decidida |
| P4 | Não ficou clara | **Em aberto** (reformulada abaixo como P4′) |
| P5 | Stack do aluno **igual à do CeliLac** (perfil `celilac-nest`) | Decidida |
| P6 | Há alunos **individuais** e **equipes de 2 ou mais** | Decidida; número de alunos não informado |
| P7 | (b) curso e UC12 navegável | Decidida |
| P8 | Projeto novo na **raiz** do repositório (`curso-app/`) | Decidida; pasta criada só com README |

**Consequências das respostas** (recomendação, a confirmar em E1 e E4):
- Sem login e sem servidor, **não há onde a aplicação guardar dados de várias pessoas**. O progresso de cada um fica no navegador da máquina dele, e o progresso "oficial" é o que está no repositório do aluno (`state.yaml`). Isso também simplifica a privacidade: a aplicação não coleta dado pessoal.
- Em equipe, cada integrante vê o próprio progresso local, que pode divergir do dos colegas. O repositório da equipe é a referência comum.
- A "área do professor com controle de acesso" (item 8 do prompt) **não existe** sem login. Ver P1′.

### 3.2. Perguntas reformuladas

**P1′ — O que fazer com os gabaritos?** Com aplicação local e aberta, quem a roda vê tudo o que ela mostra. E os gabaritos já estão no repositório público. Opções:
- (a) A aplicação **não inclui** gabaritos; o professor os lê no repositório. O limite fica declarado. **Recomendação.**
- (b) Além de (a), mover os gabaritos para um repositório privado do professor (mudança de conteúdo, em E3).
- (c) A aplicação mostra os gabaritos em uma área "do professor" sem proteção real (não recomendo: dá a impressão de sigilo que não existe).

**P4′ — Você quer acompanhar a turma pela aplicação?** A pergunta original era esta: o professor precisa de uma tela que mostre, aluno por aluno ou equipe por equipe, em que módulo e fase cada um está? Como não haverá servidor nem login, a aplicação não "recebe" o progresso dos alunos. Opções:
- (a) Não, nesta versão. O professor acompanha pelos repositórios e pelo GitHub, como hoje.
- (b) Sim, assim: o professor informa na aplicação a lista de repositórios da turma, e ela lê o `state.yaml` de cada um no GitHub, **só leitura**, e monta a tabela. Funciona com repositórios públicos; com privados, exige um token do professor. **Recomendação**, como marco posterior ao mínimo útil.
- (c) Sim, com servidor e contas, o que contradiz as decisões P2 e P3.

### 3.3. Respostas finais (2026-11-21, segunda rodada)

| # | Resposta |
|---|---|
| P1′ | Os gabaritos **podem ser exibidos ao aluno, como uma etapa do curso**. |
| P4′ | **Não** haverá acompanhamento pelo professor. O aluno faz o curso de forma **autônoma**, sem registrar nada para o professor; o registro é só para ele. |
| Escopo | As atividades são executadas **no projeto do aluno**. O curso o ajuda a obter, no projeto dele, tudo o que se obteve no projeto base (`celilac-backend`) durante a criação do curso. |

**Consequências** (recomendação; detalhes nas etapas indicadas):
- **Some a área do professor** (item 8 do prompt): sem papéis, sem contas, sem visão da turma. Os papéis em E4 se reduzem a um: o aluno (individual ou equipe).
- **Gabarito como etapa:** o momento natural é **depois** da tentativa do aluno, já que os próprios gabaritos dizem "não distribua antes da atividade da seção 2" (por exemplo, `method/didatico/curso/m01-gabarito.md`). Proposta para E2: o gabarito fica disponível depois que o aluno registra a própria tentativa (registro local, sem verificação).
- **Os textos pressupõem professor.** [Fato] Os 14 gabaritos abrem com "Uso exclusivo do professor" e têm seções como "Critérios de avaliação sugeridos" e "Sinais de que o aluno não entendeu". E 7 passagens dos módulos mandam o aluno recorrer ao professor ou a um colega: `README.md` (linhas 8 e 19), `m07-seu-teste-prova-algo.md` (linha 145), `projeto-final.md` (linhas 35 e 79), entre outras. Para um curso autônomo, isso precisa de revisão de conteúdo (E3), e a decisão sobre o texto dos gabaritos é sua (seção 5 do prompt, item 5).
- **Revisão independente:** o método pede que quem escreveu não revise (`projeto-final.md`, seção 5, regra 7). Em equipe, os colegas cumprem isso; o aluno individual terá de declarar a ausência de revisão, como o próprio UC12 declarou (`m12-quem-aprova.md`, linha 78).

## 4. O que não é bloqueante agora (fica para etapas seguintes)
- Formato dos metadados e padronização dos títulos de seção (E2 e E3).
- Acessibilidade, uso em celular e idioma (E7). **[Suposição]** apenas português do Brasil.
- Uso dos mascotes em detalhe (E7, junto da interface).
- Como tratar o aluno que marca "feito" sem fazer (E6 e E8).

---

## Fechamento

**O que foi feito:** leitura do material listado na seção 1, inventário do curso, verificação da visibilidade do repositório e dos mascotes, e as oito perguntas acima. Criado este documento e atualizado `estado.md`.

**O que não foi verificado:** o conteúdo completo dos módulos m00, m01 e m03 a m12, dos apoios, dos gabaritos, dos playbooks e do UC12; se o `check-state.sh` roda sobre um repositório de aluno fora do `celilac-backend`; a licença ou autoria das imagens dos mascotes; a existência de login institucional.

**O que você precisa decidir:** responder P1 a P8 (pode ser só a letra da opção). A E1 só começa depois disso.
