# Um lugar só para dizer em que ponto você está: o `state.yaml`

> **Público:** estudantes de Ciência da Computação com Git e GitHub em nível básico, que vão trabalhar um caso de uso do próprio domínio com ajuda de um assistente de IA (inteligência artificial).
> **Documento de apoio de:** [`uc-remover.md`](./uc-remover.md), o prompt do UC16 (Remover Produto). O método vale para qualquer caso de uso; o UC16 é o exemplo desta execução.
> **Continua:** [`uc-alterar-cobertura-real.md`](../uc-15/uc-alterar-cobertura-real.md). Lá você aprendeu a registrar **provas** (a tabela de cobertura) e **decisões** (a ADR). Aqui você aprende a registrar **onde o caso de uso está**, em um único arquivo que um programa consegue conferir.
> **Você vai:** entender por que a mesma informação em vários documentos diverge, conhecer o `state.yaml` e o validador que o confere, e **criar o arquivo de estado do seu caso de uso**.

---

## 1. Onde paramos

Você já sabe que um caso de uso (UC, do inglês *use case*) só está pronto quando cada item da sua especificação termina em prova ou em decisão registrada, e sabe guardar isso em uma tabela de cobertura e em ADRs (*Architecture Decision Record*, registros de decisão arquitetural).

Falta uma pergunta mais simples, que a tabela não responde: **em que ponto o trabalho está agora?** O que já foi feito, o que está em revisão, o que ainda nem começou, e qual proposta de mudança trouxe cada parte para o projeto.

## 2. O problema: o plano diz uma coisa, o GitHub diz outra

O projeto CeliLac, usado como caso de referência no curso, viveu isto no UC12 (Cadastrar Produto). O documento de planejamento afirmava **6 sub-issues** (as tarefas filhas de uma issue principal, no GitHub). No GitHub existiam **9**:

| O planejamento dizia | O que existia no GitHub |
|---|---|
| 6 sub-issues | 9 sub-issues |
| A persistência era a SUB-03 | A persistência era a SUB-04 |
| Os testes eram a SUB-06 | Os testes eram a SUB-07 |
| (nada sobre isso) | Duas sub-issues acrescentadas depois do planejamento |

Além disso, os números de issues, de branches e de PRs (*pull requests*, as propostas de mudança que se abrem no GitHub para serem revisadas antes de entrar na `main`) estavam copiados em **dezenas de arquivos Markdown**, cada um com a sua versão.

Ninguém mentiu, e ninguém foi descuidado de propósito. Mas quem entrasse no projeto não conseguia responder depressa a três perguntas:

1. **Em que fase estamos?**
2. **Quais partes já estão integradas?**
3. **Qual PR trouxe cada uma?**

É o mesmo defeito do módulo anterior, em outro lugar: afirmações que ninguém conferiu contra a realidade. Lá, "100% coberto". Aqui, "6 sub-issues".

## 3. Antes de ler adiante: tente você

Escolha um projeto seu (da disciplina, de estágio ou pessoal) que tenha um planejamento escrito e um repositório no GitHub. Em quinze minutos, **usando só os documentos de planejamento**, responda:

1. Quantas tarefas (issues) existem para o trabalho atual?
2. Quais já foram integradas e por qual PR?
3. Qual é o próximo passo?

Agora confira cada resposta no GitHub (`gh issue list --state all` lista as issues; o `gh` é a ferramenta de linha de comando do GitHub). Anote **onde as duas fontes divergem** e **quantos arquivos você teria de editar** para corrigir uma única divergência.

Guarde o papel. Você vai relê-lo no fim.

## 4. A tentativa ingênua: atualizar todos os documentos

A reação natural é combinar: "a cada mudança, atualizamos todos os documentos".

Isso funciona na primeira semana. Depois alguém esquece um arquivo, outra pessoa copia o número da issue de um documento já desatualizado, e a mesma informação passa a existir em **versões diferentes**.

O erro não é falta de disciplina. É **ter a mesma informação em muitos lugares**. Com cinco lugares, existem cinco chances de esquecer; e, quando dois deles discordam, ninguém sabe qual está certo.

## 5. A solução: um lugar só, e o resto aponta para ele

O método guarda os **fatos de rastreabilidade** (fase, tarefas, issues, branches, PRs, evidências) em **um único arquivo por caso de uso**: o `state.yaml`. Todos os outros documentos **apontam** para ele, em vez de copiar o que ele diz.

YAML é um formato de texto para dados estruturados: legível por pessoas e fácil de conferir por programas. A extensão `.yaml` indica isso.

> **Regra do método:** se um documento e o `state.yaml` divergirem, **o `state.yaml` vence** e o documento é corrigido.

Isso só é justo porque o `state.yaml` tem uma propriedade que os outros documentos não têm: **um programa o confere** (seção 8). Um texto livre pode dizer qualquer coisa; o `state.yaml` é recusado se disser algo incoerente.

### 5.1. Dois arquivos, duas perguntas

| Arquivo | Pergunta que responde | Muda quando |
|---|---|---|
| `project-profile.md` | **Como** este projeto funciona? Comandos, portas, versões, convenções. | Raramente (troca de tecnologia ou de infraestrutura). |
| `docs/uc/<uc>/state.yaml` | **Onde** este caso de uso está? Fase, tarefas, issues, PRs, evidências. | A cada fase e a cada tarefa. |

Se uma informação responde "como o projeto funciona", ela vai no perfil. Se responde "onde o caso de uso está", vai no estado. As duas não se misturam.

### 5.2. O que mora onde

| Tipo de informação | Onde mora | Os outros documentos... |
|---|---|---|
| Número de issue, de PR e nome de branch | `state.yaml` | apontam para ele |
| Fase atual e situação de cada tarefa | `state.yaml` | apontam para ele |
| Quem aprovou cada fase | `state.yaml` (campo `por`) | apontam para ele |
| O que o caso de uso deve fazer | especificação (`docs/planejamento/<uc>.md`) | citam os identificadores (RN01, CA02...) |
| O que está provado e o que falta | relatório com a tabela de cobertura | citam os testes pelo nome |
| Uma decisão de adiar ou excluir | ADR (`docs/adr/`) | citam o número da ADR |
| A saída real de um comando | arquivo de evidência | o `state.yaml` guarda o **caminho** |

Repare: o `state.yaml` **não** repete a especificação, a tabela nem a ADR. Ele guarda o **caminho** de cada uma e os números que ligam o trabalho ao GitHub.

## 6. Anatomia do `state.yaml`

Fragmento real do UC15 (Alterar Produto) do CeliLac, resumido:

```yaml
uc: UC15
nome: Alterar Produto
documento: ../../../prompts/uc-15/artefatos/03-uc-15-alterar-produto.md
arquetipo: atualizar
epic: { issue: 141, estado: closed }
fase_atual: concluido

fases:
  A:
    status: concluida
    relatorio: relatorios/A.md
    gate:
      - { item: "Epic e Sub-Issues criadas e reconciliadas com este arquivo", resultado: aprovado, por: evertonfoz }
    evidencias: [evidencias/A/publicacao.txt]
  # ... fases B a F, com a mesma forma

fatias:
  - id: F02
    comportamento: "Produto inexistente lança ProductNotFoundException na alteração"
    criterios: [CA05, FA01, RF03]
    issue: 143
    branch: feature/uc15-alterar-produto
    pr: 153
    status: integrada
    responsavel: evertonfoz
    revisor: evertonfoz
    evidencias: [evidencias/B/f02-f05-red.txt, evidencias/B/f02-f05-green.txt]
```

### 6.1. Campo a campo

| Campo | O que diz | Observação |
|---|---|---|
| `uc`, `nome` | Código e nome do caso de uso. | O código vem da especificação. |
| `documento` | Caminho da especificação. | Relativo ao **próprio** `state.yaml`; se informado, o arquivo precisa existir. |
| `arquetipo` | O tipo do caso de uso: `criar`, `consultar`, `atualizar`, `excluir` ou `autenticar`. | Define que tipo de tarefas e de testes se espera. |
| `epic` | A issue principal do caso de uso e se está aberta ou fechada. | Epic é a issue "mãe" das tarefas (apoio A). |
| `fase_atual` | Em qual das seis fases (A a F) o trabalho está, ou `concluido`. | Seção 6.2. |
| `fases` | Para cada fase: situação, relatório, gate e evidências. | Seção 6.3. |
| `fatias` | As unidades de trabalho. | Seção 6.4. |

### 6.2. As fases

O método divide **um** caso de uso em seis fases, sempre na mesma ordem. Você as estudará uma a uma nos próximos módulos; por ora, basta saber que existem e que o `state.yaml` diz em qual você está:

| Fase | Em uma frase |
|---|---|
| A | Planejar e publicar (especificação, tabela de cobertura, issues). |
| B | Implementar o comportamento no núcleo, fatia por fatia. |
| C | Ligar o núcleo ao mundo: entrada HTTP e banco de dados. |
| D | Documentar e testar o contrato da resposta. |
| E | Verificar de um jeito que outra pessoa consegue repetir. |
| F | Auditar e encerrar. |

Cada fase tem uma situação (`pendente`, `em_andamento` ou `concluida`). Não se está na fase C se a B ainda não terminou: isso é uma regra do validador (seção 8).

### 6.3. Gate: a condição para fechar uma fase

**Gate** (do inglês, "portão") é uma condição **verificável** que precisa ser verdadeira para a fase ser considerada concluída. Cada item do gate tem um resultado: `pendente`, `aprovado` ou `reprovado`.

Um gate `aprovado` só vale com o campo `por:`, que registra **quem validou**: uma pessoa (o seu login no GitHub) ou o `CI`.

CI (*Continuous Integration*, integração contínua) é o robô que roda os testes e as verificações a cada mudança enviada ao GitHub. Ele pode constar em `por:` quando o gate é objetivo ("CI verde"). Quando o gate pede julgamento ("a arquitetura está em conformidade"), quem aprova é uma pessoa.

Por que exigir `por:`? Porque "aprovado" sem nome é uma afirmação sem dono, o mesmo problema do relatório que dizia "100%": ninguém pode ser perguntado, e ninguém assumiu.

### 6.4. Fatia e o seu ciclo de vida

**Fatia** é a unidade de trabalho do método: **um** comportamento observável do caso de uso, com **uma** issue, **uma** branch (linha de trabalho própria no Git) e **um** PR. O módulo 3 do curso trata de como cortar um caso de uso em fatias; aqui interessa apenas como o arquivo as acompanha.

Uma fatia passa por quatro situações, e **cada seta exige campos novos**:

```text
planejada ──► em_andamento ──► em_revisao ──► integrada
 (sem issue)   (issue + branch)  (PR aberto)    (PR integrado, revisor, evidências)
```

| Situação | O que precisa constar |
|---|---|
| `planejada` | Nada além do comportamento e dos critérios. `issue`, `branch` e `pr` ficam `null`. |
| `em_andamento` | `issue` e `branch`. |
| `em_revisao` | `pr`, além do anterior. |
| `integrada` | `revisor` e `evidencias`, além do anterior. |

É assim que o arquivo **impede** uma afirmação sem prova: não dá para escrever `integrada` sem dizer qual PR, quem revisou e onde está a evidência.

Os `criterios` de cada fatia são identificadores da **especificação**: RN (regra de negócio), RF (requisito funcional), FA (fluxo alternativo), FE (fluxo de exceção) e CA (critério de aceite), cada um seguido de número (`RN01`, `CA02`). É o elo entre o que foi pedido e o que foi entregue: uma fatia que cita um `CA07` que não existe na especificação é um erro de rastreabilidade. **Atenção:** o validador confere só o **formato** do identificador (letras e número, como `CA07`), não se ele existe na sua especificação. Essa conferência é sua (e da tabela de cobertura).

## 7. Um exemplo hipotético: o começo do estado do UC16

*Exemplo para orientar a escrita; não é a especificação do UC16. Os comportamentos e os identificadores abaixo só valem se a **sua** especificação os tiver.*

No início da fase A, a especificação e o `A.md` já existem (vêm do módulo 1) e a issue principal já foi criada (apoio A), mas nenhuma fatia começou. O estado diz isso com honestidade:

```yaml
uc: UC16
nome: Remover Produto
documento: ../../planejamento/uc16.md   # a especificação do módulo 1; o caminho é relativo a ESTE arquivo
arquetipo: excluir
epic: { issue: 3, estado: open }        # a issue principal criada no apoio A (o número é do SEU repositório)
fase_atual: A

fases:
  A:
    status: em_andamento
    relatorio: relatorios/A.md          # a tabela de cobertura do módulo 1
    gate:
      - { item: "Epic e Sub-Issues criadas e reconciliadas com este arquivo", resultado: pendente }
      - { item: "GitHub Project configurado com os 5 estados", resultado: pendente }
    evidencias: []
  B: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  C: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  D: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  E: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  F: { status: pendente, relatorio: null, gate: [], evidencias: [] }

fatias:
  - id: F01
    comportamento: "<o item existente é removido>"
    criterios: [CA01]
    issue: null
    branch: null
    pr: null
    status: planejada
    responsavel: seu-login
    revisor: null
    evidencias: []
```

Três escolhas merecem atenção:

- **`documento` e `relatorio` apontam para arquivos que já existem.** O validador confere a existência de cada caminho. O campo `documento` é opcional (`null` é aceito), mas, como a especificação já existe, o caminho deve entrar.
- **`epic.issue` recebe o número da issue principal** (a "Epic", criada no apoio A). Quem ainda não a criou pode deixar `null`, mas **só enquanto a fase A está em andamento**: depois disso o `null` deixa de valer e o validador acusa.
- **Nenhum gate está `aprovado`.** Quem aprova é uma pessoa, mais tarde, com o nome em `por:`.

Observe também o que o exemplo **não** decide: se a remoção apaga o registro de vez ou só o marca como removido, o que responde um produto já removido, o que acontece com pedidos que o citam. São decisões de negócio, e quem as toma é você (ou o professor), registrando-as na especificação e, se algo ficar de fora, em uma ADR. O arquétipo `excluir` traz perguntas que os outros tipos não têm, justamente por isso.

## 8. O validador: o arquivo é conferido por programa

O comando abaixo lê o `state.yaml` e verifica regras, **sem precisar de internet**:

```bash
method/scripts/check-state.sh docs/uc/<uc>/state.yaml
```

| O que ele confere | Exemplo de erro que ele pega |
|---|---|
| Campos obrigatórios e valores permitidos | Um arquétipo que não existe. |
| Coerência entre fase e situação | Estar na fase C com a B pendente; Epic fechada com o caso de uso ainda não `concluido`. |
| Fase concluída | Fase `concluida` sem relatório ou com algum item do gate não aprovado. |
| Unicidade | A mesma issue atribuída a duas fatias. O mesmo PR em duas fatias só é aceito se todas declararem `pr_compartilhado: true` (um PR que entrega várias fatias, caso raro). |
| Existência dos arquivos citados | Um relatório ou uma evidência que não está no repositório. |
| Formato dos identificadores | Um critério escrito como `C01` em vez de `CA01`. |
| Gates aprovados com nome | `aprovado` sem `por:`. |
| Campos exigidos por cada situação da fatia | `integrada` sem PR, sem revisor ou sem evidências. |

### 8.1. Veja o validador recusar uma afirmação sem prova

Saída **executada**: o validador rodado sobre um arquivo de exemplo, propositalmente quebrado (uma fatia marcada `integrada` sem nada que a sustente e um gate `aprovado` sem `por:`):

```text
ERRO   fases.A.gate[0]: "aprovado" exige "por" (quem validou)
ERRO   fatias[0] (integrada) exige issue
ERRO   fatias[0] (integrada) exige branch
ERRO   fatias[0] (integrada) exige pr
ERRO   fatias[0] (integrada) exige evidencias
ERRO   fatias[0] (integrada) exige revisor

FALHOU: 6 erro(s).
```

O código de saída foi `1`. Em terminal, o código de saída `0` significa "deu certo" e qualquer outro valor significa "falhou". Um programa que se encerra com `0` é o que o CI aceita como verde.

### 8.2. Com `--remote`: perguntar ao GitHub

Com a opção `--remote`, o validador também **consulta o GitHub**, só lendo, por meio do `gh` (que precisa estar instalado e autenticado):

```bash
method/scripts/check-state.sh docs/uc/<uc>/state.yaml --remote
```

Ele confere, por exemplo: a Epic está aberta ou fechada como o arquivo diz? Cada issue e cada PR existe? A fatia `integrada` tem um PR realmente integrado? A branch registrada é a do PR?

Saída **executada** sobre o estado do UC15 do CeliLac (os avisos dizem que, nesse projeto, o revisor e o responsável são a mesma pessoa; o final é o que importa):

```text
OK: docs/uc/uc15/state.yaml válido (local + GitHub).
```

Quando o GitHub contradiz o arquivo, a mensagem tem esta forma: `epic #<n>: state.yaml diz open, GitHub diz closed`. **Quem corrige é uma pessoa**, decidindo qual dos dois está certo: o validador aponta a divergência, não escolhe o lado.

### 8.3. Aviso: o que o `OK` não diz

O validador confere a **coerência** do arquivo. Ele **não** prova que o caso de uso funciona.

- Ele confirma que o arquivo de evidência **existe**. Não confirma que o teste citado nele passou de verdade, nem que o comando era o certo.
- Ele confirma que um PR **foi integrado**. Não julga se a revisão foi boa.
- Ele confere o formato dos identificadores, não se eles existem na sua especificação.
- Um `OK` com todas as fatias `planejada` é válido, e o caso de uso está no começo.

Por isso o `state.yaml` não substitui a tabela de cobertura do módulo anterior: **um diz onde o trabalho está; o outro diz o que está provado**. Os dois se completam.

### 8.4. Avisos não são erros

Quando a mesma pessoa é autora e revisora (o chamado "modo solo"), o validador emite um **aviso**, não um erro: a revisão não é independente, e o arquivo deve dizer isso com honestidade, como papel e não como aprovação de uma segunda pessoa. O método não finge que existe uma equipe.

## 9. Quem atualiza o `state.yaml`, e quando

O `state.yaml` só serve se acompanhar o trabalho. Por isso convém deixar claro **quem** o muda e **em que momento**.

### 9.1. Quem escreve

- **Uma pessoa** edita o arquivo, à mão. A IA pode redigir a alteração a seu pedido, mas você a confere e a grava (seção 14).
- **Nenhum script ou robô altera o arquivo.** O validador (seção 8) **só lê**; mesmo com `--remote`, ele consulta o GitHub sem gravar nada, nem lá nem aqui.
- **Quem aprova um gate** é uma pessoa, que escreve o próprio nome em `por:`. O `CI` só pode constar em gates objetivos, como "testes verdes", e quem o registra é você.

### 9.2. Quando

A regra do método: o arquivo muda **a cada fase e a cada fatia**, no momento em que a situação muda, e não só no fim. A cada edição, rode o validador **antes** de considerar a mudança feita.

| Momento | O que muda no `state.yaml` | Neste módulo? |
|---|---|---|
| Você começa o caso de uso | Cria o arquivo a partir do modelo e preenche nome, arquétipo e fatias `planejada`. | Sim |
| A especificação e o `A.md` já existem | Preenche `documento` e `fases.A.relatorio` com os caminhos. | Sim |
| A issue principal existe (apoio A) | Preenche `epic.issue` com o número **real**. Roda o validador com `--remote` para o GitHub confirmar. | Sim |
| As issues das fatias são criadas | Preenche a `issue` de cada fatia com o número **real** que o GitHub devolveu. | Não (mais adiante) |
| A fase A termina | Marca os itens do gate como `aprovado`, com `por:`; a fase passa a `concluida`; `fase_atual` avança para B. | Não |
| Uma fatia começa | `planejada` passa a `em_andamento`, com `issue` e `branch`. | Não (módulo 3) |
| Abre-se o PR da fatia | Passa a `em_revisao`, com `pr`. | Não (módulo 3) |
| O PR é integrado | Passa a `integrada`, com `revisor` e `evidencias`. | Não (módulo 3) |
| Cada fase de B a F termina | Gate aprovado, `status: concluida`, `fase_atual` avança. | Não |
| O caso de uso termina | Epic `closed` e `fase_atual: concluido`. O validador recusa a Epic fechada antes disso. | Não |

No módulo 2 você faz as três primeiras linhas e o exercício de quebrar de propósito (seção 11). As demais acontecem à medida que o trabalho avança, a partir do módulo 3.

### 9.3. A ordem de cada atualização

1. **Faça o trabalho** (abrir o PR, integrar, rodar o teste).
2. **Edite o `state.yaml`** para dizer o que aconteceu, com os números reais, nunca com os esperados.
3. **Rode o validador.** Se houver `ERRO`, corrija **o arquivo**: a mensagem diz o campo e a fatia.
4. **Só então** considere a atualização feita.

Se o GitHub e o arquivo divergirem, o `state.yaml` vence, **mas quem decide qual dos dois está certo é uma pessoa**: o validador aponta a divergência e não escolhe o lado. Por exemplo, se um PR foi fechado sem integração e o arquivo dizia `integrada`, o erro está no arquivo, e você o corrige.

### 9.4. Esquecer de atualizar

Como só uma pessoa atualiza, o risco real é **esquecer**: o arquivo continua válido, mas desatualizado. O validador só acusa o que contradiz regras ou o GitHub **no momento em que é rodado**. Por isso, por ora, quem o roda é você, a cada atualização e antes de dizer a alguém "em que ponto estamos".

## 10. A estrutura que você vai criar

Você já tem, do módulo anterior, a especificação, o `A.md` (a tabela de cobertura) e ao menos uma ADR. Agora acrescenta o arquivo de estado:

```text
seu-repositorio/
├── project-profile.md              ← já existe ou será criado: "como o projeto funciona"
└── docs/
    ├── planejamento/
    │   └── <uc>.md                 ← especificação (módulo 1)
    ├── adr/
    │   └── ADR-001-<titulo>.md     ← decisões (módulo 1)
    └── uc/
        └── <uc>/                   ← o código do UC em MINÚSCULAS, por exemplo uc16
            ├── state.yaml          ← NOVO: onde o caso de uso está
            ├── relatorios/
            │   └── A.md            ← tabela de cobertura (módulo 1)
            └── evidencias/         ← saídas reais (mais adiante)
```

Detalhes que costumam dar erro:

- **O nome da pasta usa o código do UC em minúsculas** (`uc16`, não `UC16`). É a convenção do método. O validador não a confere, mas, em alguns sistemas, `UC16` e `uc16` são pastas diferentes, e os caminhos escritos nos documentos deixariam de bater.
- **Os caminhos de `documento`, `relatorio` e `evidencias` são relativos ao `state.yaml`**, não à raiz do repositório.
- **Se o arquivo já existir, não o sobrescreva.** Compare e acrescente.
- **O validador lê um subconjunto estrito do YAML**: sem tabulações, sem blocos multilinha (`|` e `>`), sem âncoras. É uma troca consciente: com isso, ele roda em qualquer máquina, sem instalar nada. Se o arquivo reclamar de "tabulação", troque os tabs por espaços.

Se o seu repositório já tem a pasta `method/`, copie o modelo de `method/templates/state.yaml` e o validador de `method/scripts/check-state.sh`. Se não tem, copie a pasta `method/` do repositório do curso; não reescreva o validador.

## 11. Seu próximo passo

Ainda sem programar:

1. **Crie** `docs/uc/<uc>/state.yaml` a partir do modelo, com o código em minúsculas.
2. **Preencha**: nome, `documento`, `arquetipo`, `epic` (o número da issue principal do apoio A) e **duas fatias** `planejada`, com `criterios` que existam na sua especificação.
3. **Rode o validador** e leia **cada** mensagem que ele imprimir.
4. **Quebre de propósito**: troque uma fatia para `integrada` sem preencher mais nada, rode de novo, leia os erros e **desfaça**.
5. Se já tiver uma Epic no GitHub, rode com `--remote` e veja o que o GitHub confirma ou contradiz.

O passo a passo detalhado, com o conteúdo para copiar e um prompt para cada passo, está em `method/didatico/curso/m02-pratica.md`.

## 12. Como saber que funcionou

- [ ] Sei explicar por que a mesma informação em muitos documentos diverge, e o que significa "o `state.yaml` vence".
- [ ] Reli o papel da seção 3 e marquei quantos arquivos eu editaria hoje para corrigir uma divergência, e quantos editaria com o `state.yaml`.
- [ ] Existe `docs/uc/<uc>/state.yaml`, com o código do UC em minúsculas.
- [ ] O validador termina com `OK` e código de saída `0`, e foi **eu** quem viu a saída.
- [ ] Já vi o validador **recusar** um arquivo que eu quebrei de propósito, e desfiz.
- [ ] Nenhum gate está `aprovado` sem `por:`.
- [ ] Uma pessoa que nunca viu meu projeto responde, só lendo o arquivo, em que fase estamos e o que falta.

## 13. Armadilhas comuns

- **Marcar `aprovado` sem `por:`**, ou com o nome de quem não validou.
- **Atualizar o arquivo só no fim.** Ele deve acompanhar o trabalho: atualize a cada fase e a cada fatia, ou voltará a ser um documento desatualizado.
- **Guardar opinião no `state.yaml`** ("ficou ótimo", "quase pronto"). Ele guarda **fatos conferíveis**: números, caminhos, situações.
- **Copiar o número da issue para outro documento** em vez de apontar para o `state.yaml`. É a armadilha da seção 4, voltando.
- **Pasta com maiúsculas** (`UC16`). Use sempre o código em minúsculas.
- **Concluir que o `OK` significa "pronto"** (seção 8.3).
- **Corrigir o validador em vez do arquivo.** Se uma regra parece estranha, pergunte antes de contorná-la; ela costuma existir por causa de um erro real.

## 14. Como lidar com a IA neste ponto

A IA pode **preencher** o arquivo a partir do que você disser. Duas regras:

1. **Rode o validador você mesmo.** "Está válido", dito pela IA, não vale; vale a saída do comando e o código de saída `0`.
2. **Nunca deixe a IA marcar como `aprovado` um gate que pede julgamento de pessoa.** Gates objetivos (CI verde) podem constar como `por: CI`; os demais são seus. A IA prepara o arquivo; quem aprova é você.

Uma boa forma de pedir:

> Leia a especificação em `docs/planejamento/<uc>.md` e o modelo `method/templates/state.yaml`. Preencha o `state.yaml` com duas fatias `planejada`, usando nos critérios **só** identificadores que existem na especificação; se faltar algum, diga em vez de inventar. Deixe issue, branch e PR como `null` e nenhum gate `aprovado`. Mostre o arquivo e espere minha confirmação. Depois rode o validador e mostre a saída real e o código de saída.

Se a IA devolver o arquivo sem rodar o validador, ou disser que rodou sem mostrar a saída, trate o arquivo como hipótese até você mesmo rodar o comando.

---

## Siglas usadas neste documento

| Sigla | Significado | Em uma frase |
|---|---|---|
| UC | *Use Case*, caso de uso | Comportamento do sistema do ponto de vista de quem o usa |
| IA | Inteligência Artificial | Aqui, o assistente de código usado no curso |
| ADR | *Architecture Decision Record*, registro de decisão arquitetural | Documento curto que guarda **uma** decisão: contexto, decisão, condição para retomar e consequências |
| PR | *Pull Request* | Proposta de mudança no GitHub, revisada antes de entrar na `main` |
| CI | *Continuous Integration*, integração contínua | Um robô que roda testes e verificações a cada mudança enviada ao GitHub |
| YAML | formato de texto para dados estruturados | Formato do `state.yaml`: legível por pessoas e por programas |
| RN, RF, FA, FE, CA | Regra de Negócio, Requisito Funcional, Fluxo Alternativo, Fluxo de Exceção, Critério de Aceite | Rótulos dos itens de um caso de uso (RN01, RF01, FA01, FE01, CA03) |
| HTTP | *HyperText Transfer Protocol* | O protocolo pelo qual um cliente pede algo a uma API (*Application Programming Interface*, a interface pela qual outros programas usam o seu sistema) |
| CLI | *Command-Line Interface*, interface de linha de comando | Programa usado pelo terminal, como o `gh` do GitHub |

---

Próximo passo: o módulo 3 do curso ("Por que a `main` ficou vermelha?"). Prompt de execução: [`uc-remover.md`](./uc-remover.md).
