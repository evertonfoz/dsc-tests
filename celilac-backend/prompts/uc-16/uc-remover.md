## 1. PAPEL E OBJETIVO

Atue como especialista em Engenharia de Software, Análise de Requisitos, TypeScript, NestJS, arquitetura em camadas, TDD (*Test-Driven Development*, desenvolvimento guiado por testes), Git e GitHub. Escreva em português técnico-acadêmico, objetivo e sem narrativa gamificada.

Objetivo: levar **um único caso de uso de remoção de um item existente** (tornar um registro identificado por uma chave indisponível ao sistema) de **uma única entidade escolhida pelo estudante** da especificação à implementação verificada, **reaproveitando o processo** executado nos Materiais 01 a 13 (que usaram o UC12 — Cadastrar Produto apenas como exemplo didático) e o padrão já consolidado nos casos de uso de **listagem** (`prompts/uc-13/uc-listar.md`), de **busca** (`prompts/uc-14/uc-buscar.md`) e de **alteração** (`prompts/uc-15/uc-alterar.md`), quando existirem.

> **Antes de usar este prompt**, leia os três documentos de apoio:
> 1. [`uc-buscar-por-que-este-metodo.md`](../uc-14/uc-buscar-por-que-este-metodo.md): por que um método, e o primeiro passo (módulo 0 do curso: a descrição prévia do caso de uso).
> 2. [`uc-alterar-cobertura-real.md`](../uc-15/uc-alterar-cobertura-real.md): como registrar uma prova (módulo 1 do curso: a tabela de cobertura, a ADR e a estrutura de documentação).
> 3. [`uc-remover-estado-como-fonte.md`](./uc-remover-estado-como-fonte.md): onde registrar em que ponto o caso de uso está (módulo 2 do curso: o `state.yaml`, o validador e quem atualiza o arquivo).
>
> O prompt cobre o ciclo completo; o estudo dos módulos avança gradualmente, e o estudante pode usar o prompt à medida que os módulos correspondentes forem estudados.

**Execução de referência (CeliLac):** UC16 — Remover Produto, arquétipo `excluir`. O projeto já tem a marca de remoção lógica `deletedAt` no `Product` (ADR-005, UC13), e a listagem, a busca e a alteração já tratam o produto removido como inexistente. **Mas nenhum caso de uso remove produtos hoje.** As decisões sobre **como** remover (lógica ou física, resposta, tratamento de item já removido) **não foram tomadas** e são perguntas da Etapa 1: isso é o exemplo desta execução, **não** um requisito do método. Em outro projeto, as respostas de 3.0 definem o que vale.

**O arquétipo `excluir` é um esboço no método** (`method/playbooks/matriz-arquetipos.md`, seção 3.3). Esta execução é a que o **valida ou corrige**: registre, ao encerrar, o que foi diferente do esboço (ver 4.6).

**Escopo de cada execução: um caso de uso e uma entidade por vez.** Se o estudante quiser **restaurar** itens removidos, **apagar de vez** itens já marcados como removidos (*purge*), remover vários itens de uma vez ou remover itens de outra entidade, isso é uma **nova execução** deste prompt (ou de outro). Não agrupe entidades nem operações.

### Variáveis do processo (definidas na Etapa 3.0, nunca presumidas)

| Variável | Significado |
|---|---|
| `REF` | UC de referência: molde estrutural e régua de requisitos mínimos. |
| `ENTIDADE` | A única entidade de domínio cujo item será removido. |
| `CHAVE` | Atributo da `ENTIDADE` usado para localizar o item a remover (normalmente o identificador). Lido da **classe** da entidade, nunca presumido. |
| `POLITICA` | Como o item deixa de existir para o sistema: **remoção lógica** (o registro permanece, marcado como removido) ou **remoção física** (o registro é apagado). Decisão do estudante. |
| `MARCA` | Só na remoção lógica: o atributo que registra a remoção (ex.: `deletedAt`). Precisa **existir** na classe, ou a sua criação exige decisão própria. |
| `RESPOSTA` | O que a remoção devolve em caso de sucesso (ex.: `204` sem corpo). |
| `ALVO` | O UC de remoção a criar ou validar (`UC<NN> — Remover <ENTIDADE>`). |
| `ARTEFATOS` | Pasta onde os artefatos desta execução serão gravados. |

Em todo o prompt, `<entidade>`, `<recurso>`, `<chave>` e `<NN>` são **placeholders**: substitua pelos valores reais confirmados. Nunca use um exemplo (como "Product") como se fosse requisito.

Siglas: **UC** (caso de uso), **DTO** (*Data Transfer Object*, objeto de transferência de dados), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural), **DoR** (*Definition of Ready*, critério de prontidão), **CA** (critério de aceite), **RN** (regra de negócio), **RF** (requisito funcional), **FA/FE** (fluxo alternativo / de exceção), **PR** (*Pull Request*), **CI** (*Continuous Integration*, integração contínua), **HTTP** (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), **UUID** (*Universally Unique Identifier*, identificador único universal), **ORM** (*Object-Relational Mapping*, mapeamento objeto-relacional), **DELETE** (método HTTP para remover um recurso), **FK** (*Foreign Key*, chave estrangeira: coluna que referencia a chave de outra tabela), **YAML** (formato de texto do `state.yaml`).

---

## 2. O QUE O PROCESSO DO UC12 JÁ ENSINOU (BASE DE REFERÊNCIA)

Antes de agir, **leia** estes materiais. Eles definem o padrão de processo; os nomes do domínio (produto, pedido etc.) são exemplos, não requisitos.

| Fonte | O que extrair |
|---|---|
| `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | **Modelo de especificação padrão** (pode ser substituído pelo `REF` escolhido em 3.0): as 13 seções (identificação, objetivo, atores, pré e pós-condições, fluxo principal, FA/FE, RN, validações, RF, considerações arquiteturais, CA, escopo). Itens não confirmados são marcados como proposta. |
| `prompts/01` | Planejamento: Issue principal (Epic) + no mínimo 5 Sub-Issues, rastreabilidade, labels, GitHub Project com os estados `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`. Sem inventar requisitos. |
| `prompts/02` e `03` | Papéis, DoR, revisão cruzada, priorização, dependências, paralelismo, WIP (limite de trabalho em progresso). |
| `prompts/04` e `05` | Branch por Issue, teste **RED** (falha) antes do código, implementação mínima **GREEN** (passa), evidências reais. |
| `prompts/06` | Refatoração só com evidência, revisão técnica, merge **só com autorização explícita**. |
| `prompts/07` e `08` | Fronteira HTTP (Controller + DTOs + validação), teste integrado sem mocks de Service/Repository. |
| `prompts/09` e `10` | Persistência real (PostgreSQL + TypeORM), migrations, Docker Compose. |
| `prompts/11` | Contrato HTTP estável: DTO de resposta, semântica de status e erros, testes de contrato. |
| `prompts/12` | Auditoria arquitetural; **não alterar código sem evidência**; encerramento de governança (roteiro de conclusão). |
| `prompts/13` | Coleção REST Client (`.http`) e verificação automatizada (`run-checks.sh`) com **Esperado × Obtido**. |
| `prompts/uc-14/uc-buscar-por-que-este-metodo.md`, `prompts/uc-15/uc-alterar-cobertura-real.md`, `prompts/uc-16/uc-remover-estado-como-fonte.md`, `method/didatico/curso/m00-o-caso-pronto.md`, `m01-cobertura-real.md` e `m02-estado-como-fonte.md` (e as práticas `m00-pratica.md`, `m01-pratica.md` e `m02-pratica.md`), se existirem | O problema que motiva o método, a **descrição prévia** do UC que o estudante traz (ator, caso normal, duas regras, uma falha e "como eu mostraria"), a **tabela de cobertura**, a **ADR**, a estrutura de documentação e o **`state.yaml`** com o seu validador. A descrição é a entrada da Etapa 1, não requisito aprovado. |
| `prompts/uc-13/uc-listar.md`, `prompts/uc-14/uc-buscar.md`, `prompts/uc-15/uc-alterar.md` e os resumos de execução dos UCs anteriores (se existirem) | Padrão já aplicado a consulta e a alteração: organização dos cenários `.http` por UC, atualização do `run-checks.sh`, substituição de contrato anterior, operação própria no Repository, atualização condicionada ao estado ativo, lições registradas (seção 7 dos resumos). Use como exemplo de processo, não de requisito. |
| `docs/adr/` (em especial a ADR de soft delete do UC13 e as de erros e de falta de autenticação), `docs/uc/`, `project-profile.md`, `method/` (se existirem) | Estado real dos UCs existentes, decisões já tomadas (ADRs) e playbooks por fase. O esboço do arquétipo `excluir` está em `method/playbooks/matriz-arquetipos.md`. |

### 2.1. Localizar as fontes no workspace em execução

A tabela acima descreve o workspace de origem deste prompt (o projeto CeliLac). Os caminhos são **referências**, não suposições: o workspace em execução pode ter outra estrutura. Logo **depois** de receber as respostas de 3.0 e **antes** de 3.1 (a primeira resposta continua sendo só as perguntas, ver seção 6), verifique onde cada fonte está:

1. Para cada linha da tabela, procure no workspace atual, em modo somente leitura (`ls`, busca por nome), aceitando variações de nome: os Materiais `prompts/01` a `prompts/13` podem ter sufixo (ex.: `01-planejamento-....md`, `10A-....md`) e as pastas `docs/`, `method/` e o `project-profile.md` podem estar em outro nível. Nada é criado nem alterado.
2. Monte uma tabela curta: **fonte esperada · encontrada? · caminho real**.
3. Se todas foram encontradas, siga e use os **caminhos reais** encontrados, não os da tabela.
4. Se faltar alguma fonte (principalmente o modelo de especificação e os Materiais), **pare e pergunte em uma única mensagem**: liste o que foi achado e o que não foi, e peça ao estudante que informe o caminho de cada fonte ausente ou diga que ela não existe. Se não existir, ofereça as saídas: usar só o `REF` informado em 3.0, usar o modelo de 13 seções descrito neste prompt, ou receber o documento anexado. **Não reconstrua o conteúdo de uma fonte ausente de memória.**
5. As fontes marcadas "(se existirem)" não bloqueiam a execução quando faltam. Registre como **Observação** que ADRs, estado dos UCs e playbooks não puderam ser verificados e pergunte, na mesma mensagem do passo 4, se existe um equivalente em outro caminho.
6. Se o estudante informar um caminho fora do workspace aberto, avise e peça confirmação antes de ler.
7. Grave o mapa **fonte → caminho real** em `00-uc-referencia.md` (pasta `ARTEFATOS`) e use-o em todo o restante da execução.

### 2.2. Estrutura de documentação (módulos 0, 1 e 2 do curso)

Na mesma verificação, de forma **somente leitura**, confira quais destes itens existem no workspace: `docs/planejamento/`, `docs/uc/<uc>/relatorios/A.md`, `docs/uc/<uc>/state.yaml`, `docs/adr/` e a pasta `method/` (com `method/templates/` e `method/scripts/check-state.sh`). Registre o resultado na tabela do passo 2 de 2.1.

- **Nada é criado agora.** A criação do que faltar acontece conforme a seção 3.5, **com autorização**.
- Se `method/templates/` existir, os modelos de lá (incluindo `state.yaml`) são a **versão de referência**; se não existir, use os modelos dos documentos [`uc-alterar-cobertura-real.md`](../uc-15/uc-alterar-cobertura-real.md) (especificação, tabela de cobertura, ADR e evidência) e [`uc-remover-estado-como-fonte.md`](./uc-remover-estado-como-fonte.md) (`state.yaml`). Nunca copie arquivos de outro projeto.

### Regras herdadas que continuam valendo

1. Não invente requisitos, regras, endpoints, números de Issue/PR, portas, scripts, commits nem resultados de execução. Tudo que não estiver confirmado é **proposta** ou **pergunta**.
2. **Não acrescente atributos** à `ENTIDADE` nem à resposta além dos que existem na classe de domínio ou estão respaldados por especificação/ADR vigente. Consulte os ADRs antes de decidir como a remoção é registrada. Se a `POLITICA` for lógica e a `MARCA` já existir (ex.: `deletedAt`, ADR do UC13), **reaproveite-a**; criar outra exige decisão própria.
3. **Preserve os nomes e assinaturas existentes**: identificadores da entidade (ex.: não trocar `<entidade>Id` por `id`), métodos de cadastro, listagem, busca e alteração e o contrato de gravação do Repository. A remoção é **aditiva**: nenhum UC anterior muda de comportamento, **exceto** pelo efeito esperado e documentado de que o item removido deixa de aparecer neles.
4. O núcleo (entidade, Service, contrato do Repository) **não** depende de TypeORM nem de HTTP. Não exponha tipos do TypeORM no contrato de Repository.
5. Mantenha a separação entre os **dois mappers**: resposta HTTP (`entidade → DTO de resposta`) e persistência (`entidade ↔ entidade ORM`).
6. **Remover é uma operação destrutiva.** Não execute comandos destrutivos, não toque o banco de desenvolvimento, não aplique migration fora do banco de testes e não publique no GitHub (Issues, PRs, Project) sem pedir confirmação antes. Testes e verificações que removem dados rodam **somente** no banco de testes, com a variável de proteção do projeto.
7. Não faça merge nem feche Issues automaticamente.
8. Não crie commits ou alterações artificiais "para ter diff".
9. Diferencie sempre: **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado**.
10. Classifique achados como **Observação**, **Problema**, **Evidência**, **Proposta** ou **Verificação**.
11. **Um UC e uma entidade por execução.** Pedidos que envolvam outra entidade ou outra operação (restaurar, *purge*, remover em lote) são registrados como **fora de escopo** e tratados em nova execução.
12. **Reaproveite o conceito de "ativo × removido" já definido.** Se o projeto já decidiu que o item removido é tratado como inexistente na listagem, na busca e na alteração (ADRs do UC13 e do UC15), a remoção **produz exatamente esse estado**, sem criar um segundo critério. Registre quais regras foram reaproveitadas e de qual ADR.
13. **A tabela de cobertura é verificável** (ver 3.5): uma linha por item, nome exato do teste conferido no código, teste executado agora e situação explícita. Nenhum item fica "Coberto" sem teste, e item sem teste termina em implementação ou em ADR.
14. **Remoções simultâneas e repetidas são decisão registrada.** Duas remoções ao mesmo tempo do mesmo item não precisam de controle de versão: a remoção deve ser **uma única instrução condicionada ao item ativo**, de modo que **exatamente uma** tenha sucesso e a outra encontre o item "não encontrado". Trate isso como **regra candidata** (RN), com teste. Controle de concorrência mais elaborado (versão do item, bloqueio) é UC próprio.
15. **Não construa o que o UC não pede.** Restaurar um item removido, apagar de vez os já removidos e remover em lote **não** são implementados aqui. Se o estudante os quiser, registre como **fora de escopo** com ADR de exclusão (3.5).

---

## 3. ETAPA 1 — O CASO DE USO DE REMOÇÃO EXISTE?

**Esta etapa não escreve código-fonte.** Ela só produz ou avalia a especificação (e, com autorização, a estrutura de documentação da seção 3.5).

### 3.0. Primeira ação obrigatória: perguntas iniciais

Antes de buscar, criar, gravar ou comparar qualquer coisa, envie **uma única mensagem** com as perguntas 0, 1, 2 e 4 abaixo e **aguarde as respostas**. A pergunta 3 (chave, política de remoção e resposta) só é feita **depois** que a entidade for confirmada e a classe dela for lida (ver seção 6). Não responda por conta própria nenhuma delas; se o estudante já tiver informado algo no início da conversa, apenas confirme.

> **0. Descrição prévia (módulo 0).** Você já tem a descrição de meia página do módulo 0 (quem usa, caso normal, duas regras, uma situação de falha e "como eu mostraria" cada uma)?
> - (a) **sim** — informe o caminho (ex.: `docs/planejamento/<uc>.md`) ou cole o texto;
> - (b) **ainda não** — recomendo fazê-la antes; informe se prefere seguir mesmo assim. Nesse caso, as perguntas da Etapa 1 (3.2) cobrirão o que faltar, mas o assistente **não redige a descrição em seu lugar** sem as suas respostas.
>
> **1. UC de referência (`REF`).** Qual caso de uso devo usar como base para criar, comparar ou validar o UC de remoção?
> - (a) **UC12 — Cadastrar Produto** (`docs/planejamento/uc12-cadastrar-produto/uc-12.md`), o padrão deste curso (sugerido);
> - (b) **outro UC já documentado** — informe código e caminho. O UC15 (alteração) é o mais próximo no comportamento: também **grava**, localiza o item ativo pela chave e trata o removido como inexistente;
> - (c) **especificação original própria** — anexe ou informe o caminho.
>
> **2. Entidade (`ENTIDADE`).** De **qual entidade** o item será removido? Escolha **apenas uma**:
> - (a) **a mesma entidade do UC de referência** (eu a identifico a partir do documento e do código e peço sua confirmação);
> - (b) **outra entidade** — informe o nome (e o módulo, se houver mais de um).
>
> **3. Chave, política de remoção e resposta (`CHAVE`, `POLITICA`, `MARCA` e `RESPOSTA`).** *(feita só depois de a entidade ser confirmada.)* Mostrarei a **estrutura da classe** da entidade (atributos, tipos, identificador, marca de remoção, se houver) lida do código/ADR, e você escolherá:
> - **por qual atributo** o item a remover será localizado (por padrão, o identificador da entidade);
> - a **política de remoção**: lógica (o registro permanece, marcado) ou física (o registro é apagado). Mostrarei o que o código e os ADRs **já** assumem sobre itens removidos;
> - se a política for lógica, qual atributo é a **marca** (existente ou novo; novo exige decisão e requisito próprios, ver regra 2);
> - o que a **resposta de sucesso** devolve (com ou sem corpo).
>
> **4. Destino dos artefatos (`ARTEFATOS`).** Em qual pasta gravo os artefatos (documento do UC, parecer, planejamento, relatórios, evidências, roteiro de encerramento)? Sugestões típicas, **ainda não verificadas** no repositório: `docs/planejamento/uc<NN>-remover-<entidade>/`, `docs/uc/uc<NN>/`, `prompts/uc-<NN>/artefatos/` ou outro caminho. Depois da verificação de 2.1 e 2.2, confirmo quais existem de fato e **nada é gravado antes da sua confirmação**. Informe também se devo **versionar** (commit) os artefatos ou deixá-los só no working tree.

Se a entidade ou o código do UC não forem conhecidos, **proponha** (não imponha) o próximo código livre para o `ALVO`. A operação por padrão é **remover um item existente identificado pela chave**; criar, alterar, restaurar, apagar de vez ou remover vários itens pertencem a outros UCs.

#### Regras sobre a descrição prévia (pergunta 0)

1. Se o estudante informar a descrição, leia-a **integralmente** e a trate como **proposta do estudante**: ela é a fonte do ator, do fluxo, das regras e das falhas em 3.2, e o assistente **não repergunta** o que ela já responde.
2. Confronte-a com a classe (regra 4 abaixo): regra que cita atributo inexistente, ou falha sem "como eu mostraria", é registrada como **pendência** e devolvida ao estudante, nunca corrigida em silêncio.
3. Se ela não existir e o estudante preferir seguir, registre como **Observação** que a Etapa 1 partiu sem descrição prévia.

#### Regras sobre o `REF`

1. Não assuma o UC12 mesmo sendo a sugestão: espere a resposta.
2. Leia **integralmente** o documento de referência. Se o arquivo não existir ou estiver ilegível, **pare** e peça o caminho correto; não reconstrua de memória.
3. Extraia do `REF` a **estrutura de seções** e os **requisitos mínimos** que ele cumpre. Apresente essa lista em uma tabela curta e **peça confirmação** de que ela é a régua desejada.
4. Se o `REF` tiver seções ausentes ou fracas, informe; a régua pode ser complementada com o modelo completo de 13 seções do UC12 somente se o estudante concordar.
5. Se o `REF` for de outro domínio, adapte **a estrutura**, nunca as regras de negócio dele.
6. Se o `REF` for o UC de cadastro, alteração ou outro, aproveite o que servir (ex.: tradução de erros, tratamento do item removido), mas **não** copie fluxos que só fazem sentido nele (ex.: gerar identificador, validar o valor de um atributo alterável).

#### Regras sobre a `ENTIDADE`, a `CHAVE`, a `POLITICA`, a `MARCA` e a `RESPOSTA`

1. Uma única entidade. Se o estudante citar duas ou mais, peça que escolha uma e registre as demais como execuções futuras.
2. Se a resposta for "a mesma do `REF`", identifique-a no documento e no código (entidade de domínio, módulo, Repository, DTOs) e **confirme** nome, módulo e identificador antes de seguir.
3. Se for outra entidade, **inspecione o código** para saber se ela existe, onde está e quais atributos tem. Se não existir (ainda não modelada), registre como **pendência bloqueante**: a remoção não pode ser implementada sobre entidade inexistente; proponha que a entidade seja especificada antes.
4. **Baseie-se na estrutura da classe.** Leia a classe de domínio (e, para contraste, a entidade ORM e os DTOs existentes) e apresente uma tabela **atributo · tipo · obrigatório? · origem (domínio, ORM, ADR) · identificador? · é marca de remoção? · aparece hoje em alguma resposta HTTP?**. A `CHAVE` e a `MARCA` só podem ser escolhidas entre os atributos dessa tabela (ou, para a `MARCA` nova, registradas como decisão própria).
5. Para a `CHAVE`, registre: o tipo do identificador (ex.: UUID, inteiro), como o formato inválido será tratado e, se não for o identificador, a unicidade e o que acontece com mais de um resultado (pendência).
6. **Mapeie o que o projeto já assume sobre itens removidos**, lendo código e ADRs: quais operações (listagem, busca, alteração) filtram os removidos, qual ADR registrou isso e se **algum caminho do código já cria itens removidos** (ex.: só testes). Apresente em uma tabela **operação · trata o removido como · onde está (arquivo, ADR)**. A remoção deve produzir exatamente esse estado (regra 12).
7. Para a `POLITICA`, apresente **as duas opções com o custo de cada uma** e o que muda no código. Não escolha pelo estudante. A remoção **lógica** reaproveita a marca e não muda os UCs anteriores; a **física** apaga o registro e exige tratar o que o código e o banco já assumem (itens removidos nos testes, migrations, integridade referencial).
8. **Investigue dependências.** Procure no código e nas migrations o que **referencia** a `ENTIDADE` (relações, colunas de identificador em outras tabelas, chaves estrangeiras). Se existir, registre e pergunte: remover um item com dependentes é permitido, recusado (ex.: conflito) ou fora de escopo? Não presuma.
9. Para a `RESPOSTA`, registre a decisão numa tabela `status → corpo → justificativa`, que será usada no DTO de resposta (se houver), nos critérios de aceite e nos testes de contrato.

#### Regras sobre os `ARTEFATOS`

1. **Nenhum arquivo é gravado antes da resposta.** Não crie pasta antes dela.
2. Use o caminho escolhido em **todas** as etapas, inclusive na Etapa 2.
3. Se o caminho já existir, **inspecione** e **nunca sobrescreva** arquivo existente sem mostrar a diferença e obter autorização; em conflito de nome, proponha sufixo.
4. Se o caminho estiver fora do repositório ou ignorado pelo `.gitignore`, avise.
5. Nomeie os arquivos com prefixo ordenado e finalidade clara (ex.: `00-uc-referencia.md`, `01-existencia-do-uc.md`, `02-uc-remover-<entidade>.md`, `03-planejamento-github.md`, `10-relatorio-final.md`).
6. Commit só se o estudante tiver pedido; push e PR continuam exigindo confirmação.

### 3.1. Verificar a existência do UC `ALVO`

Faça uma busca real no repositório e no GitHub (não responda de memória), usando a `ENTIDADE` confirmada. Exemplo (substitua os termos):

```bash
# Documentos de caso de uso
ls prompts/ docs/ docs/uc/ docs/planejamento/ 2>/dev/null
grep -rIil --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
  -E 'remover <entidade>|excluir <entidade>|apagar <entidade>|DELETE /<recurso>/:|UC[0-9]+' \
  prompts docs method 2>/dev/null

# Indícios no código
grep -rIn --exclude-dir=node_modules --exclude-dir=dist \
  -E "@Delete\(|remove[A-Z]\w*\(|delete[A-Z]\w*\(|softDelete|deletedAt" src/modules/<modulo> src/infrastructure test 2>/dev/null

# Estado no GitHub (se `gh` estiver autenticado; caso contrário, avise que esta parte foi pulada)
gh issue list --state all --limit 50 --search "remover <entidade>"
```

Considere que o UC existe se houver **especificação documentada** (arquivo de UC, seção em planejamento, Issue Epic). Um `@Delete()` ou método de remoção solto no código **sem** especificação **não** é o caso de uso: registre como "implementação sem especificação" e trate como **Problema**. A existência da **marca** de remoção (`deletedAt`) **não** é o caso de uso de remoção: é só a base dele (registre como **Observação**). **Leia todas as implementações do Repository** (banco e memória) antes de concluir: o que uma faz com um item removido pode divergir da outra. Registre o resultado de cada implementação separadamente.

Apresente o resultado em uma tabela: **o que procurei · onde · o que encontrei**. Conclua com exatamente uma decisão:

- **Decisão A — Não existe** → siga para 3.2.
- **Decisão B — Existe** → siga para 3.3.

Se o resultado for ambíguo (ex.: especificação parcial em outro formato), **pergunte** antes de decidir.

### 3.2. Decisão A — Criar o caso de uso a partir do `REF`

1. Defina o código do `ALVO` (confirmado em 3.0; se não houver, proponha o próximo livre e peça confirmação). Se o estudante tiver a especificação original, **use-a como fonte** e pare de inferir.
2. **Parta da descrição prévia** (pergunta 0), se houver, e **pergunte só o que falta** (em lote, curto). Onde houver **padrão sugerido**, apresente-o junto com o motivo e peça apenas a **confirmação ou a troca**; o assistente **não** o adota sem a resposta do estudante. Sugestões, ajustadas à `ENTIDADE` e à `POLITICA`:
   - **Ator e permissão.** Quem remove? A remoção é pública ou exige permissão? **Padrão sugerido (a confirmar):** pública **por enquanto**, porque o projeto ainda não tem autenticação, **com ADR própria** que registre o risco (qualquer cliente que conheça um identificador pode remover o item) e a **condição para retomar** (quando existir autenticação). Isso repete, para a remoção, a decisão já tomada para a alteração. Como remover é mais grave que alterar, **peça confirmação explícita**.
   - **Política de remoção (`POLITICA`).** **Padrão sugerido (a confirmar):** remoção **lógica**, reaproveitando a marca existente. Motivos: a entidade já a tem; a listagem, a busca e a alteração já tratam o removido como inexistente (conferir no código antes de afirmar); não destrói o registro nem as referências a ele; é reversível por um UC futuro de restauração. Custos: o registro continua ocupando o banco; apagar de verdade seria outro UC (*purge*); itens removidos precisam ser filtrados em **toda** consulta futura. Se o estudante escolher remoção **física**, isso muda os UCs anteriores e a integridade referencial: registre cada efeito e a necessidade de migration.
   - **Método e rota:** `DELETE /<recurso>/:<chave>`, sem corpo. **Padrão sugerido (a confirmar).** Pergunte o que acontece se a requisição trouxer um corpo: é ignorado? (**Padrão sugerido:** ignorado.)
   - **Resposta de sucesso (`RESPOSTA`):** `204` sem corpo, ou `200` com algum conteúdo? **Padrão sugerido (a confirmar):** `204`, porque não há o que devolver. Como não há corpo para conferir, a **prova** de que a remoção ocorreu é **reler o item**: a busca responde "não encontrado" e a listagem não o traz. Registre isso como critério de aceite.
   - Identificador com formato inválido (ex.: UUID malformado) é erro de requisição (`400`) ou "não encontrado" (`404`)? **Padrão sugerido:** `400`, coerente com a busca e a alteração (conforme os ADRs de erros do projeto).
   - Item **inexistente:** qual status e qual corpo de erro, conforme os ADRs de erros do projeto?
   - **Item já removido** (a segunda remoção do mesmo item): é tratado como inexistente (`404`, coerente com a busca e a alteração) ou como sucesso idempotente (`204`)? **Padrão sugerido (a confirmar):** `404`. Registre a consequência: o **estado** final é o mesmo, mas o **status** da segunda chamada difere da primeira. A decisão vira regra de negócio, critério de aceite e, se o estudante preferir o contrário, ADR.
   - **Dependências:** se 3.0 encontrou outras entidades que referenciam a `ENTIDADE`, remover é permitido, recusado (`409`) ou fora de escopo? Se não encontrou, registre "nenhuma dependência encontrada" como **Observação**, com o que foi buscado.
   - **Efeito nos UCs existentes:** depois da remoção, a listagem não traz o item, a busca responde "não encontrado" e a alteração o trata como inexistente. **Não pergunte** se isso vale (é a regra 12); **confirme** que cada um desses UCs já se comporta assim, lendo o código, e registre a evidência. Se algum não se comportar, é **Problema** e vira decisão do estudante.
   - **Falha ao gravar:** o que garante que **nada foi removido pela metade**? Qual status e corpo?
   - **Remoções simultâneas ou repetidas:** o padrão deste prompt é a regra candidata *"entre remoções simultâneas do mesmo item, exatamente uma tem sucesso e as demais encontram o item como inexistente"* (regra 14). Apenas **peça confirmação**; não pergunte "dentro ou fora".
   - **Restaurar, apagar de vez (*purge*) e remover em lote:** **fora de escopo** (regra 15). Peça apenas a confirmação e proponha as ADRs de exclusão de escopo.
3. **Crie o documento** usando o `REF` confirmado como **molde estrutural**, com as mesmas seções (no UC12, as 13), adaptadas à remoção da `ENTIDADE`. Não copie regras do `REF` que não se apliquem. Salve na pasta `ARTEFATOS` e informe o nome do arquivo.
4. **Conteúdo mínimo esperado** (espelha o `REF`; a lista abaixo é a do UC12):
   - Identificação (código, nome, sistema, módulo, tipo: excluir).
   - Objetivo.
   - Atores e observação do que precisa ser confirmado.
   - Pré-condições (o item existe e está ativo) e pós-condições (sucesso **e** falha, incluindo "o item continua ativo e nenhum outro item foi afetado").
   - Fluxo principal numerado.
   - Pelo menos **3 fluxos não felizes**: **1 alternativo** (item inexistente), **1 alternativo** (item já removido) e **1 de exceção** (falha ao gravar na persistência). Acrescente o identificador inválido e as dependências (se existirem) como fluxos alternativos, conforme decidido.
   - Regras de negócio numeradas (RN01…), cada uma marcada como **confirmada** ou **candidata**.
   - Validações e restrições (incluindo o que **não** está definido).
   - Requisitos funcionais (RF01…), incluindo a `CHAVE`, a `POLITICA`, a `MARCA` e a `RESPOSTA` (tabela da 3.0).
   - Considerações arquiteturais com as unidades de trabalho possíveis (ver 4.2).
   - Critérios de aceite (CA01…), **verificáveis**, cada um ligado a um RF/RN. Inclua: um CA que prove que **o item removido some da listagem e a busca o trata como inexistente**; um que prove que **a alteração o trata como inexistente**; um que prove que **os outros itens permanecem ativos e inalterados**; e um que prove que **uma remoção que falha não deixa o item removido pela metade**.
   - Escopo do trabalho e o que está **fora** do escopo (inclusive as demais entidades e operações, a restauração, o *purge*, a remoção em lote e a autenticação, com a referência às ADRs de 3.5).
5. Marque tudo o que é proposta com "precisa ser confirmado na especificação original", como faz o UC12.
6. Gere junto uma **tabela de rastreabilidade** (RN/RF/FA/FE → CA) e uma **lista de perguntas em aberto**.

### 3.3. Decisão B — Comparar com os requisitos mínimos do `REF`

Se o UC já existir, **não reescreva**. Avalie-o contra a régua confirmada em 3.0 e emita um parecer item a item. A tabela abaixo é a régua padrão (derivada do UC12); **ajuste as linhas ao `REF` escolhido**, removendo as que ele não tem e acrescentando as que ele tem a mais, e mostre a tabela ajustada ao estudante antes de preencher.

| # | Requisito mínimo | Atende? | Evidência (arquivo/seção) | Lacuna / ação |
|---|---|---|---|---|
| 1 | Identificação completa (código, nome, sistema, módulo, tipo) | | | |
| 2 | Objetivo claro e verificável | | | |
| 3 | Ator(es) e permissões, com pendências sinalizadas | | | |
| 4 | Pré-condições | | | |
| 5 | Pós-condições de sucesso **e** de falha | | | |
| 6 | Fluxo principal numerado | | | |
| 7 | ≥ 1 fluxo alternativo (ex.: item inexistente) | | | |
| 8 | ≥ 1 fluxo de exceção (falha de persistência/infra) | | | |
| 9 | Regras de negócio numeradas e distinguindo confirmada × candidata | | | |
| 10 | Validações e restrições, com o que está indefinido | | | |
| 11 | Requisitos funcionais numerados | | | |
| 12 | Considerações arquiteturais / unidades de trabalho | | | |
| 13 | Critérios de aceite verificáveis, cada um ligado a RF/RN | | | |
| 14 | Escopo do trabalho (incluindo o que está fora) | | | |
| 15 | Rastreabilidade (requisito → critério de aceite) | | | |
| 16 | Não inventa regras: itens não confirmados estão marcados | | | |
| 17 | **Entidade, `CHAVE`, `POLITICA`, `MARCA` e `RESPOSTA`** explícitas e coerentes com a classe de domínio/ADRs (item específico da remoção) | | | |
| 18 | **Tratamento de identificador inválido, item inexistente e item já removido** definido (status e corpo de erro) | | | |
| 19 | **Efeito da remoção nos UCs existentes** (listagem, busca, alteração) definido e conferido no código | | | |
| 20 | **Garantia de que uma remoção que falha não deixa o item removido pela metade** e **não afeta outros itens** | | | |
| 21 | **Dependências** da entidade investigadas e decididas (ou "nenhuma encontrada", com o que foi buscado) | | | |

Depois da tabela:

- Classifique o UC como **Completo**, **Completo com ressalvas** ou **Incompleto**.
- Liste as lacunas por prioridade e **proponha** os ajustes (texto sugerido). **Não edite o documento sem autorização**; mostre o diff proposto.
- Aponte **conflitos** com o código/ADRs existentes (ex.: o UC pressupõe uma marca de remoção que não existe na classe, ou cita outra entidade).

### 3.4. Planejamento no GitHub (apenas proposta)

Seguindo `prompts/01`, `02` e `03`, **proponha** (sem criar nada):

- Issue principal `[UC<NN>] Remover <Entidade>` e ≥ 5 Sub-Issues justificadas (cada uma um **comportamento verificável**: remoção com sucesso, item inexistente, item já removido, falha de persistência, identificador inválido, efeito nos UCs existentes), sem criar Sub-Issue por fase RED/GREEN/REFACTOR.
- Labels, dependências reais (distinguindo obrigatória × contexto), responsáveis ("A definir" se não informados), estados iniciais no Project.
- Se o projeto tiver `docs/uc/<uc>/state.yaml` e `method/`, siga o playbook da Fase A em vez de duplicar o processo, e valide com `method/scripts/check-state.sh`. Para um UC de **excluir**, o campo `arquetipo` do estado é `excluir`; os materiais do curso registram que os arquétipos `criar`, `consultar` e `atualizar` já foram exercitados em caso real e que `excluir` é um **esboço**. Informe isso e anote como **limite declarado**.
- **Quantos PRs.** O padrão do método é **um PR por fatia**. Se o estudante preferir **um PR para várias fatias** (como no UC15), isso exige `pr_compartilhado: true` em **todas** as fatias desse PR no `state.yaml` (ADR-005 do método). **Pergunte** e registre a escolha; com um PR único, **cada fatia continua precisando ter o seu estado atualizado** quando for integrada.

### 3.5. Estrutura de documentação, tabela de cobertura, ADRs e estado

Esta seção aplica o que os módulos 0, 1 e 2 do curso ensinam. **Proponha antes de criar** e peça autorização.

1. **Mostre o que existe e o que falta** da lista de 2.2 (`docs/planejamento/<uc>.md`, `docs/uc/<uc>/relatorios/A.md`, `docs/uc/<uc>/state.yaml`, `docs/adr/`). **Pergunte** se pode criar o que faltar. Sem autorização, registre como **Aguardando decisão** e siga somente com os artefatos da pasta `ARTEFATOS`.
   - **Uma única fonte para a especificação.** A especificação criada em 3.2 é o `docs/planejamento/<uc>.md`. Se o estudante escolheu outra pasta em `ARTEFATOS`, **não mantenha duas cópias**: pergunte qual é a oficial e faça a outra apenas apontar para ela.
2. **Criação, com autorização:**
   - Se existir `method/templates/`, copie o modelo correspondente (`caso-de-uso.md` para a especificação, `adr.md` para as ADRs, `state.yaml` para o estado) para o lugar indicado e preencha. Se não existir, crie o arquivo com os modelos de [`uc-alterar-cobertura-real.md`](../uc-15/uc-alterar-cobertura-real.md), seções 7.4 e 8, e de [`uc-remover-estado-como-fonte.md`](./uc-remover-estado-como-fonte.md), seções 6 e 7.
   - O `A.md` com a tabela de cobertura usa **sempre** o esqueleto da seção 8.5 do documento do módulo 1: `method/templates/relatorio-de-fase.md` é o modelo do relatório formal da fase e **não** substitui esse esqueleto.
   - **Nunca sobrescreva** arquivo existente: acrescente a ele (ex.: uma seção em um `A.md` que já exista) ou use o próximo número livre de ADR.
3. **Tabela de cobertura** em `docs/uc/<uc>/relatorios/A.md`, com as colunas **Item · Teste que prova · Situação** e **uma linha por item** do UC (fluxos, RN, RF, CA). Na Etapa 1 ainda não há testes: a maioria das linhas é **A implementar** ou **Aguardando decisão**. Valores de situação: *Coberto*, *Parcial* (diga o que falta), *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.
4. **ADRs.** Para cada item que o estudante **decidir adiar ou excluir**, **proponha** uma ADR em `docs/adr/` com as partes: contexto, decisão, **condição para retomar**, consequências e alternativas consideradas. Quem decide é o estudante; o assistente só redige a proposta. Proponha, sem esperar o estudante lembrar:
   - **Remoção sem autenticação**, com linha **Autorização · nenhum · Não implementado (ADR)** na tabela. Contexto: o projeto não tem autenticação e remover é mais grave que alterar; decisão: `DELETE` público por enquanto; **condição para retomar**: quando o projeto introduzir autenticação (UC próprio); consequências: (+) UC simples e coerente com os anteriores; (−) qualquer cliente que conheça um identificador pode remover o item, adequado apenas ao ambiente didático.
   - **Restauração, *purge* e remoção em lote fora do escopo**, em ADRs de exclusão, cada uma com a condição para retomar (um UC próprio, se um dia for especificado).
   - **Política de remoção**, se o estudante escolher uma que **mude** decisões anteriores (por exemplo, a remoção física).
5. **Estado do UC (`state.yaml`).** Crie ou atualize `docs/uc/<uc>/state.yaml` conforme o módulo 2 do curso: a pasta usa o código do UC em **minúsculas**; `arquetipo: excluir`; nenhum gate `aprovado` pelo assistente; `por:` é sempre uma pessoa ou o `CI`. Rode `method/scripts/check-state.sh` e **mostre a saída real e o código de saída**.
6. **Atualização na Etapa 2:** a cada unidade concluída, atualize a tabela com o **nome exato do teste** (conferido no código) e a situação, **somente depois de executar o teste** e guardar a saída real (ver 4.5). O `state.yaml` também muda **a cada mudança de situação de uma fatia** (`planejada` → `em_andamento` → `em_revisao` → `integrada`), com os números reais; rode o validador depois de cada edição.

### 3.6. GATE — pare aqui

Termine a Etapa 1 com:

1. A decisão (A ou B) e o documento criado ou o parecer de comparação.
2. Os valores confirmados de `REF`, `ENTIDADE`, `CHAVE`, `POLITICA`, `MARCA`, `RESPOSTA`, `ALVO` e `ARTEFATOS`.
3. A tabela de cobertura inicial, as ADRs propostas (3.5) e o `state.yaml` validado (3.5, passo 5).
4. A lista de perguntas ainda abertas.
5. A frase: **"Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação."**

**Não inicie a Etapa 2 sem aprovação explícita do estudante.** Se houver pergunta crítica sem resposta (ator, `CHAVE`, `POLITICA`, `MARCA`, `RESPOSTA`, tratamento de item inexistente e de item já removido, dependências, entidade inexistente), a implementação **não** começa.

---

## 4. ETAPA 2 — IMPLEMENTAÇÃO (somente após o gate)

### 4.1. Pré-requisitos

- UC `ALVO` aprovado (Decisão A) ou ajustado e aprovado (Decisão B), com `ENTIDADE`, `CHAVE`, `POLITICA`, `MARCA` e `RESPOSTA` confirmados.
- Working tree limpo ou com alterações explicadas; branch principal atualizada.
- Ambiente verificado de verdade: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm test`. Registre a saída real; se algo falhar antes de você mexer, é **linha de base**, não culpa sua.
- Confirme portas, containers e scripts **lendo** `compose.yaml`, `package.json` e `project-profile.md`. Não presuma.

### 4.2. Unidades de trabalho (proposta a refinar com o UC aprovado)

Adapte ao que o UC aprovado exigir; não crie unidade sem justificativa nele:

| # | Unidade | Camada | Observação |
|---|---|---|---|
| 1 | Operação do Repository que **remove** um item ativo pela `CHAVE`, **sem alterar** as existentes, e que informa se algum item foi de fato removido | Domínio/Aplicação | Mudança aditiva. **Não reaproveite o `save`**: ele pode inserir em uma implementação e atualizar em outra (no UC15, o `save` em memória acrescentava e duplicaria o item). Leia **as duas** implementações (banco e memória) antes de decidir e registre o resultado como Observação ou Problema. |
| 2 | Caso de uso no Service (ex.: `remover<Entidade>()`): pede a remoção do item **ativo** pela `CHAVE` e, se nenhum item foi removido, lança a exceção de **domínio** de "não encontrado"; sem acoplar a HTTP/ORM | Aplicação | "Não encontrado" (inexistente **ou** já removido) e "falha ao gravar" são exceções de **domínio**, traduzidas para HTTP na fronteira. Reaproveite exceções e regras já existentes (regra 12). Não consulte e depois remova em dois passos: a decisão "ativo ou não" fica na **própria operação** do Repository. |
| 3 | Implementação em memória do Repository | Infraestrutura | Para testes rápidos. Deve reproduzir exatamente o comportamento do banco: remover um item já removido ou inexistente informa que nada foi removido, e a listagem, a busca e a alteração passam a não o encontrar. |
| 4 | Implementação TypeORM do Repository + mapper de persistência | Infraestrutura | **Remoção lógica:** **uma única instrução** (ex.: `UPDATE ... SET <marca> = agora WHERE <chave> = ... AND <marca> IS NULL`), conferindo o número de linhas afetadas, para não haver remoção pela metade nem corrida entre ler e gravar (regra 14). Migration **só** se o esquema mudar (com a marca já existente, normalmente não muda). **Remoção física:** exige tratar integridade referencial e as migrations; confirme com o estudante antes. |
| 5 | Endpoint `DELETE /<recurso>/:<chave>` (rota **conforme o UC**), validação do parâmetro de rota (ex.: pipe de UUID, se o identificador for UUID), **sem DTO de entrada**, resposta conforme a `RESPOSTA`, tradução das exceções para os status do UC | HTTP | Corpo da requisição, se vier, tratado como o UC decidiu (ignorado), com teste. |
| 6 | Testes: unitários (Service), controller, integração (sem mocks de Service/Repository), contrato HTTP | Testes | Cobrir cada CA e cada FA/FE. **Testes específicos:** (a) uma remoção que falha **não** remove o item; (b) **só** o item alvo é removido, e os outros continuam ativos e inalterados; (c) uma segunda remoção do mesmo item responde como o UC decidiu **e não altera o registro** (se lógica, o instante original da remoção é preservado); (d) **ciclo completo**: cadastrar, remover, e então a listagem não traz o item, a busca o trata como inexistente e a alteração também; (e) duas remoções **simultâneas** do mesmo item deixam exatamente um sucesso (regra 14), no banco de testes. |
| 7 | Cenários `.http` (desenvolvimento e contêiner) e checagens no `run-checks.sh` | Verificação | Esperado × Obtido, ambiente containerizado. **Organização obrigatória em pastas por caso de uso**: ver 4.2.1. |
| 8 | ADRs para decisões novas ou adiamentos (ver 3.5) | Documentação | Só se houver decisão real. |

#### 4.2.1. Cenários `.http`: o que criar e como organizar

Os cenários `.http` fazem parte da entrega (unidade 7) e seguem a coleção do Material 13. Antes de criar, **leia** `http-rest-client/` e o `README.md` de `containerizado/`; reproduza a convenção que já existe, sem inventar outra.

```text
http-rest-client/
├── <recurso>/                              (ex.: products)
│   ├── uc<NN>-remover-<entidade>/          (ex.: uc16-remover-produto)
│   │   ├── <recurso>-controller.http       requisições do ciclo de implementação
│   │   └── test-scenarios.http             matriz de cenários, um por CA/FA/FE
│   └── uc<MM>-.../                         UCs anteriores, cada um na sua subpasta
└── containerizado/
    ├── NN-<recurso>-<operacao>.http        ex.: 06-products-remover-produto.http
    ├── README.md                           atualizar a tabela de arquivos e a lista do que o script confere
    └── run-checks.sh                       acrescentar as checagens do UC (Esperado × Obtido)
```

Regras:

1. **Uma subpasta por caso de uso** dentro da pasta do recurso, como nos UCs anteriores. **Pergunte antes de mover** qualquer arquivo existente.
2. Cada cenário traz, no título, o resultado esperado (`→ esperado: 204 No Content ...`) e o CA/FA/FE que cobre. Cubra, no mínimo: remoção com sucesso, **releitura** que prova a remoção (busca e listagem), item inexistente (identificador válido, mas sem registro), item já removido, identificador com formato inválido e rota inexistente (`404`).
3. Os arquivos `.http` não fazem asserções; a prova automatizada fica no `run-checks.sh`. Atualize ali qualquer checagem que fixe o **contrato anterior** (ex.: o método `DELETE` na rota `/<recurso>/:<chave>` respondendo `404` porque ainda não existe; confirme o status real antes de alterar a checagem) e acrescente as do UC.
4. **Atenção:** a remoção **destrói ou oculta dados**. Os cenários que removem registros **não se executam sem autorização** (regra 6). O `run-checks.sh` deve remover **apenas um item criado por ele mesmo**, nunca um item que já estava no banco. Se o UC exigir um item criado para provar o sucesso, **peça autorização** para criar um item de teste, ou registre como **Aguardando evidência** e deixe o CI provar.
5. Atualize o `README.md` de `containerizado/` e a documentação que desenha a árvore da coleção, para os arquivos novos não ficarem fora dos índices.

### 4.3. Ciclo por unidade (igual aos Materiais 04–06)

Para **cada** unidade:

1. Vincule a unidade à Issue correspondente; **pergunte** antes de criar Issue ou branch no GitHub. Branch no padrão já usado no projeto (ex.: `feature/uc<NN>-<nn>-<descricao>`).
2. **RED:** escreva o teste a partir de um CA; rode e **cole a saída real da falha**. Confirme que falha pelo motivo certo.
3. **GREEN:** implemente o **mínimo** para aquele teste; rode o mesmo teste e a suíte relacionada; **cole a saída real**. **Não antecipe** o tratamento de falhas das fatias seguintes (ex.: traduzir "não encontrado" e "falha de persistência" já na primeira fatia): no UC15 isso fez com que três fatias passassem **sem RED**. Se um comportamento já for satisfeito por uma fatia anterior, registre como **teste de caracterização** (o teste passou de primeira, e por quê), não como RED.
4. **REFACTOR:** só com evidência (duplicação, acoplamento). "Não refatorar" é resultado válido e deve ser justificado.
5. **Regressão:** os UCs existentes da `ENTIDADE` (cadastro, listagem, busca e alteração) mantêm status, corpo e testes, **exceto** pelo efeito documentado da remoção. Compare com o contrato documentado, não com a memória.
6. **Tabela de cobertura:** atualize a linha do item com o nome exato do teste e a situação (3.5, passo 6).
7. **`state.yaml`:** atualize a situação da fatia (e só a ela) e rode `method/scripts/check-state.sh`, mostrando a saída real e o código de saída. Não marque gate como `aprovado`: é decisão do estudante.
8. Commit pequeno e rastreável (mensagem referencia a Issue). Não faça push nem abra PR sem confirmação.

### 4.4. Contrato HTTP a verificar (ajustar ao UC aprovado)

Documente e teste, comparando **Esperado × Obtido**, no mínimo:

- Sucesso: status e corpo conforme a `RESPOSTA`. **Releia o item** (busca e listagem) e confirme que **a remoção foi gravada**: a busca o trata como inexistente e a listagem não o traz, com o total ajustado.
- Os **outros itens** permanecem ativos e inalterados.
- Item inexistente (identificador válido, sem registro): status e corpo de erro conforme o UC e a semântica já adotada no projeto.
- Item já removido: status conforme a decisão do UC (tipicamente o mesmo desfecho do inexistente), **sem alterar o registro**.
- Identificador com formato inválido: status conforme o UC (tipicamente `400` via validação do parâmetro de rota), distinto do item inexistente.
- Falha de persistência: status e corpo de erro conforme a semântica já adotada no projeto, sem expor a causa, e **sem remoção parcial** (o item continua ativo).
- Vazamento de campos internos: a resposta, quando houver corpo, contém **apenas** o que o UC definiu (a marca de remoção não aparece).
- Efeito nos UCs existentes: alteração do item removido responde como item inexistente.
- **Contrato anterior substituído:** se a rota da remoção já era testada como inexistente (`404`, em testes ou no `run-checks.sh`), esses testes mudam de propósito e cada mudança deve citar o CA que a autoriza.

### 4.5. Verificação e evidências

Execute e registre a saída real de: `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:integration` (banco de testes), `pnpm test:e2e` (se aplicável) e, no ambiente containerizado, o `run-checks.sh` com os novos cenários. Falhas já conhecidas e documentadas devem ser identificadas como tal; falhas novas são **Problema**.

**Evidências:** guarde cada saída em `docs/uc/<uc>/evidencias/<fase>/`, **um arquivo por execução**, com: comando completo, data e hora UTC, commit de base (`git rev-parse HEAD` antes da execução), diretório/ambiente, código de saída, a saída real e a leitura do resultado. Use `method/templates/evidencia-de-comando.md` se existir, ou o modelo de [`uc-alterar-cobertura-real.md`](../uc-15/uc-alterar-cobertura-real.md), seção 8. **Nunca** cole saída ilustrativa ou esperada como se fosse real; remova segredos e dados pessoais.

**Atenção ao `run-checks.sh`:** ele roda contra a API do contêiner e o banco de **desenvolvimento**, e a remoção **grava**. Isso afeta o ambiente do estudante: **peça autorização expressa** antes de reconstruir a API, aplicar migration no banco de desenvolvimento ou executar o script. Sem autorização, registre como "Aguardando evidência" e deixe o CI (smoke do Compose) provar. Testes que removem dados rodam **somente** no banco de testes (regra 6).

Confirme também a pureza arquitetural (Material 12): entidade sem imports externos, Service sem TypeORM/DTO HTTP, Controller sem TypeORM, contrato do Repository sem tipos ORM.

### 4.6. Encerramento

1. **Verificação de consistência**, conforme o que existe no workspace (mapa da seção 2.1):
   - **Com `method/` e `docs/uc/<uc>/state.yaml`:** atualize o `state.yaml` e rode `method/scripts/check-state.sh` (com `--remote` se o `gh` estiver autenticado) e `node method/scripts/check-links.mjs`.
   - **Sem a pasta `method/`** (ou sem esses scripts): **não** crie nem invente `state.yaml`, scripts ou validadores, e não pare por causa disso. Registre como **Observação** que os validadores do método não estão disponíveis e faça a conferência manual, somente leitura, anotando o resultado real de cada item:
     1. todo arquivo e caminho citado nos artefatos existe (`ls` em cada caminho);
     2. todo número de Issue e PR citado existe (`gh issue view <n>` e `gh pr view <n>`, se o `gh` estiver autenticado; senão marque **Aguardando evidência**);
     3. **cada item da tabela de cobertura** tem a situação correta: nenhum "Coberto" sem teste, e os nomes de testes citados existem nos arquivos de teste (`grep`) e foram executados;
     4. todo item "Não implementado" ou "Aguardando decisão" tem uma ADR ou uma pergunta aberta para o estudante.
   - **Com `method/` mas sem `state.yaml`:** pergunte ao estudante se quer criar o estado do UC a partir do template do método; sem resposta afirmativa, siga a conferência manual acima.
2. Produza um relatório curto, só com fatos: CAs atendidos (com evidência), CAs pendentes, decisões, riscos, perguntas.
3. **Compare com o esboço do arquétipo.** Se o workspace tiver `method/playbooks/matriz-arquetipos.md`, registre no relatório da fase F **o que foi diferente do esboço `excluir`** (seção 3.3 da matriz): fatias efetivas, riscos que se confirmaram ou não, decisões que o UC precisou tomar e o que ainda não foi exercitado. **Proponha** a atualização da matriz e dos catálogos de fatias (promoção de esboço a validado); **não edite o método sem autorização** e não promova por conta própria.
4. Para integração, entregue um **roteiro de conclusão** com PRs, ordem de merge e fechamento de Issues. **Não execute** merge nem feche Issues; quem decide é o estudante. O roteiro não depende de nenhum modelo externo; se existir um roteiro de conclusão de UC anterior (ex.: `prompts/uc-15/artefatos/roteiro-conclusao-uc15.md`), use-o como referência de formato. A estrutura mínima, em um arquivo na pasta `ARTEFATOS` (ex.: `roteiro-conclusao-uc<NN>.md`), é:
   1. **Tabela de passos**, na ordem de execução, com as colunas **Passo · Ação · Situação** (`Feito`, `Aberto para revisão` ou `Pendente (estudante)`). Inclua: merge de cada PR (e a ordem entre eles), fechamento de cada Issue com link para o PR e para a evidência, fechamento do Epic, movimentação dos itens do Project para `Done` e, se houver `state.yaml`, a aprovação dos gates. Só marque `Feito` o que foi realmente executado, com autorização expressa.
   2. **Provas disponíveis:** caminhos da tabela de cobertura, da auditoria e da verificação no contêiner (ou **Aguardando evidência**).
   3. **Ressalvas:** desvios do método, falhas conhecidas fora do escopo e alterações feitas no ambiente do estudante (banco de desenvolvimento, migrations).
   4. **Encerramento:** seção acrescentada ao final, com data, só quando o estudante confirmar que o UC foi concluído.

---

## 5. FORMATO DAS RESPOSTAS

- Etapa 1: uma seção por item de 3.0 a 3.6, com tabelas.
- Etapa 2: por unidade — objetivo, arquivos tocados, saída RED, saída GREEN, decisão de refatoração, regressão, atualização da tabela de cobertura e do `state.yaml`, commit sugerido.
- Sempre termine cada resposta com **"Próximo passo"** e **"Perguntas em aberto"**.
- Marque a origem das afirmações de um relatório com as etiquetas **Documentado**, **Confirmado no código**, **Executado** e **Hipótese**. Só **Executado** prova comportamento.
- Salve os artefatos em Markdown, organizados por finalidade, **na pasta `ARTEFATOS`**, sem sobrescrever arquivos existentes sem inspecioná-los antes. A estrutura de documentação da seção 3.5 (`docs/planejamento/`, `docs/uc/<uc>/relatorios/`, `docs/uc/<uc>/state.yaml`, `docs/adr/`, `docs/uc/<uc>/evidencias/`) é criada **somente com autorização**, nos caminhos indicados. Ao final de cada etapa, liste os arquivos gravados (caminho completo). Os cenários `.http` seguem a organização da seção 4.2.1 e não ficam na pasta `ARTEFATOS`. O resumo final da seção 7 também fica fora dela, na pasta deste prompt.

## 6. PRIMEIRA RESPOSTA

Sua primeira resposta deve ser **apenas** as perguntas 0, 1, 2 e 4 de 3.0 (descrição prévia, UC de referência, entidade e destino dos artefatos), sem busca, sem código e sem documentos. A pergunta 3 (chave, política de remoção e resposta) vem na mensagem seguinte, **depois** de a entidade ser confirmada e de a classe dela ser lida: mostre a tabela de atributos da classe e o mapa do que o projeto já assume sobre itens removidos (3.0, regras 4 e 6) e só então peça a escolha da `CHAVE`, da `POLITICA`, da `MARCA` e da `RESPOSTA`. Só então apresente o resultado de 3.1. **Entre as respostas e o 3.1**, execute a localização das fontes e da estrutura de documentação das seções 2.1 e 2.2 (somente leitura) e, se faltar alguma fonte, pergunte onde estão antes de seguir.

**Se o estudante já tiver respondido tudo na mensagem inicial** (inclusive `CHAVE`, `POLITICA`, `MARCA` e `RESPOSTA`): não repergunte o que já foi informado; apenas **confirme** os valores em uma tabela curta. Mesmo assim, **não pule a leitura da classe**: execute 2.1 e 2.2, leia a entidade e mostre a tabela de atributos de 3.0 (regra 4) para **conferir** as respostas contra o código antes de seguir. Atributo informado que não exista na classe, ou que seja o identificador, vira **pendência** devolvida ao estudante, nunca corrigida em silêncio.

## 7. RESUMO FINAL DA EXECUÇÃO (arquivo)

Ao concluir a Etapa 2 (depois do roteiro de conclusão de 4.6) ou sempre que o estudante pedir, **gere o resumo final da execução em um arquivo**, escrito para o estudante ler com facilidade: texto corrido, em português, com títulos curtos e poucas tabelas. O relatório de fatos de 4.6 continua existindo; este resumo conta a história inteira em linguagem simples.

**Onde gravar:** na mesma pasta deste prompt, com o nome `uc-remover-resumo-da-execucao-uc<NN>.md` (substitua `<NN>` pelo código do `ALVO`; ex.: `uc-remover-resumo-da-execucao-uc16.md`). Se o arquivo já existir, inspecione e mostre a diferença antes de sobrescrever. Não faça commit sem o estudante pedir; push e PR continuam exigindo confirmação.

**Conteúdo, nesta ordem:**

1. **Ponto de partida:** o que o prompt pede e como a execução começou.
2. **Decisões do estudante:** `REF`, `ENTIDADE`, `CHAVE`, `POLITICA`, `MARCA`, `RESPOSTA`, `ALVO`, ator e permissão, método e rota, tratamento de identificador inválido, de item inexistente e de item já removido, dependências e o que ele autorizou a versionar.
3. **Etapa 1:** o que foi buscado, a decisão A ou B, os documentos criados (caminhos) e a **estrutura de documentação** criada (com autorização).
4. **Planejamento no GitHub:** Epic, Sub-Issues, Project e `state.yaml`, com os números **reais**.
5. **Etapa 2:** o que foi implementado em cada camada (núcleo, HTTP, persistência), o contrato, os cenários `.http` (com a organização de 4.2.1) e a auditoria.
6. **Cobertura e decisões registradas:** a situação final da tabela de cobertura (quantos itens em cada situação) e as ADRs criadas.
7. **O que deu errado ou ficou diferente do planejado:** cada desvio do método ou do prompt, inclusive RED que não falhou, correção de GREEN, divergências encontradas e ajustes de ferramentas. Registre também o que foi esquecido e corrigido depois.
8. **Autorizações que afetaram o ambiente do estudante:** banco de desenvolvimento, migrations, merges, fechamento de issues, aprovação de gates e remoção de branches ou worktrees.
9. **Resultados verificados:** comandos executados e saídas reais (contagens de testes que passam e falham, falhas conhecidas identificadas como tal, CI, saída do `check-state.sh`).
10. **O que ainda não tem prova:** tudo que ficou **Aguardando evidência**.
11. **O que o UC mudou no método:** o que foi diferente do esboço do arquétipo `excluir` e o que foi proposto para a matriz (4.6, passo 3).
12. **O que aconteceu além do prompt:** trabalho extra pedido durante a sessão.
13. **Onde está tudo:** repositório remoto e pasta local, com caminhos e números de issues/PRs/commits; diga se algo existe **só localmente**.
14. **O que ficou pendente**, incluindo outras entidades ou operações que o estudante queira tratar em **novas execuções** (restaurar, *purge*, remover em lote).

**Regras:** só fatos obtidos de fato nesta execução (regra 1); número de issue, PR e commit só se foi retornado por um comando; diferencie **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado** (regra 9); sem autoavaliação de "aprovado". Termine a resposta com a lista do arquivo gravado (caminho completo), **"Próximo passo"** e **"Perguntas em aberto"**.
