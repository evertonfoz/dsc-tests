## 1. PAPEL E OBJETIVO

Atue como especialista em Engenharia de Software, Análise de Requisitos, TypeScript, NestJS, arquitetura em camadas, TDD (*Test-Driven Development*, desenvolvimento guiado por testes), Git e GitHub. Escreva em português técnico-acadêmico, objetivo e sem narrativa gamificada.

Objetivo: levar **um único caso de uso de alteração de um item existente** (atualizar um registro identificado por uma chave) de **uma única entidade escolhida pelo estudante** da especificação à implementação verificada, **reaproveitando o processo** executado nos Materiais 01 a 13 (que usaram o UC12 — Cadastrar Produto apenas como exemplo didático) e o padrão já consolidado nos casos de uso de **listagem** (`prompts/uc-listar.md`) e de **busca** (`prompts/uc-14/uc-buscar.md`), quando existirem.

> **Antes de usar este prompt**, leia os dois documentos de apoio:
> 1. [`uc-buscar-por-que-este-metodo.md`](../uc-14/uc-buscar-por-que-este-metodo.md): por que um método, e o primeiro passo (módulo 0 do curso: a descrição prévia do caso de uso).
> 2. [`uc-alterar-cobertura-real.md`](./uc-alterar-cobertura-real.md): como registrar uma prova (módulo 1 do curso: a tabela de cobertura, a ADR e a estrutura de documentação).
>
> O prompt cobre o ciclo completo; o estudo dos módulos avança gradualmente, e o estudante pode usar o prompt à medida que os módulos correspondentes forem estudados.

**Execução de referência (CeliLac):** UC15 — Alterar Produto. Decisão do professor: **somente o atributo `name`** é alterável. Isso é o exemplo desta execução, **não** um requisito do método: em outro projeto, as respostas de 3.0 definem o que vale. Mesmo na execução de referência, **confirme** os `ALTERAVEIS` na pergunta 3; não os presuma.

**Escopo de cada execução: um caso de uso e uma entidade por vez.** Se o estudante quiser alterar itens de outra entidade, ou criar outro caso de uso (remover, restaurar, alterar em lote), isso é uma **nova execução** deste prompt, com novas respostas em 3.0. Não agrupe entidades nem operações.

### Variáveis do processo (definidas na Etapa 3.0, nunca presumidas)

| Variável | Significado |
|---|---|
| `REF` | UC de referência: molde estrutural e régua de requisitos mínimos. |
| `ENTIDADE` | A única entidade de domínio cujo item será alterado. |
| `CHAVE` | Atributo da `ENTIDADE` usado para localizar o item a alterar (normalmente o identificador). Lido da **classe** da entidade, nunca presumido. |
| `ALTERAVEIS` | Atributos que o UC permite **alterar**. Só podem ser atributos que existem na classe e que não sejam o identificador nem atributos internos. |
| `CAMPOS` | Dados da `ENTIDADE` que a resposta da alteração retorna. |
| `ALVO` | O UC de alteração a criar ou validar (`UC<NN> — Alterar <ENTIDADE>`). |
| `ARTEFATOS` | Pasta onde os artefatos desta execução serão gravados. |

Em todo o prompt, `<entidade>`, `<recurso>`, `<chave>` e `<NN>` são **placeholders**: substitua pelos valores reais confirmados. Nunca use um exemplo (como "Product") como se fosse requisito.

Siglas: **UC** (caso de uso), **DTO** (*Data Transfer Object*, objeto de transferência de dados), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural), **DoR** (*Definition of Ready*, critério de prontidão), **CA** (critério de aceite), **RN** (regra de negócio), **RF** (requisito funcional), **FA/FE** (fluxo alternativo / de exceção), **PR** (*Pull Request*), **HTTP** (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), **UUID** (*Universally Unique Identifier*, identificador único universal), **ORM** (*Object-Relational Mapping*, mapeamento objeto-relacional), **PUT/PATCH** (métodos HTTP para substituir/alterar parcialmente um recurso).

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
| `prompts/uc-14/uc-buscar-por-que-este-metodo.md`, `prompts/uc-15/uc-alterar-cobertura-real.md`, `method/didatico/curso/m00-o-caso-pronto.md`, `m00-pratica.md`, `m01-cobertura-real.md` e `m01-pratica.md` (se existirem) | O problema que motiva o método, a **descrição prévia** do UC que o estudante traz (ator, caso normal, duas regras, uma falha e "como eu mostraria"), a **tabela de cobertura**, a **ADR** e a estrutura de documentação. A descrição é a entrada da Etapa 1, não requisito aprovado. |
| `prompts/uc-listar.md`, `prompts/uc-14/uc-buscar.md` e os resumos de execução dos UCs de listagem e de busca (se existirem) | Padrão já aplicado a operações de **consulta**: organização dos cenários `.http` por UC, atualização do `run-checks.sh`, substituição de contrato anterior. Use como exemplo de processo, não de requisito. |
| `docs/uc/`, `docs/adr/`, `project-profile.md`, `method/` (se existirem) | Estado real dos UCs existentes, decisões já tomadas (ADRs) e playbooks por fase. |

### 2.1. Localizar as fontes no workspace em execução

A tabela acima descreve o workspace de origem deste prompt (o projeto CeliLac). Os caminhos são **referências**, não suposições: o workspace em execução pode ter outra estrutura. Logo **depois** de receber as respostas de 3.0 e **antes** de 3.1 (a primeira resposta continua sendo só as perguntas, ver seção 6), verifique onde cada fonte está:

1. Para cada linha da tabela, procure no workspace atual, em modo somente leitura (`ls`, busca por nome), aceitando variações de nome: os Materiais `prompts/01` a `prompts/13` podem ter sufixo (ex.: `01-planejamento-....md`, `10A-....md`) e as pastas `docs/`, `method/` e o `project-profile.md` podem estar em outro nível. Nada é criado nem alterado.
2. Monte uma tabela curta: **fonte esperada · encontrada? · caminho real**.
3. Se todas foram encontradas, siga e use os **caminhos reais** encontrados, não os da tabela.
4. Se faltar alguma fonte (principalmente o modelo de especificação e os Materiais), **pare e pergunte em uma única mensagem**: liste o que foi achado e o que não foi, e peça ao estudante que informe o caminho de cada fonte ausente ou diga que ela não existe. Se não existir, ofereça as saídas: usar só o `REF` informado em 3.0, usar o modelo de 13 seções descrito neste prompt, ou receber o documento anexado. **Não reconstrua o conteúdo de uma fonte ausente de memória.**
5. As fontes marcadas "(se existirem)" não bloqueiam a execução quando faltam. Registre como **Observação** que ADRs, estado dos UCs e playbooks não puderam ser verificados e pergunte, na mesma mensagem do passo 4, se existe um equivalente em outro caminho.
6. Se o estudante informar um caminho fora do workspace aberto, avise e peça confirmação antes de ler.
7. Grave o mapa **fonte → caminho real** em `00-uc-referencia.md` (pasta `ARTEFATOS`) e use-o em todo o restante da execução.

### 2.2. Estrutura de documentação (módulos 0 e 1 do curso)

Na mesma verificação, de forma **somente leitura**, confira quais destes itens existem no workspace: `docs/planejamento/`, `docs/uc/<uc>/relatorios/A.md`, `docs/adr/` e a pasta `method/` (com `method/templates/`). Registre o resultado na tabela do passo 2 de 2.1.

- **Nada é criado agora.** A criação do que faltar acontece conforme a seção 3.5, **com autorização**.
- Se `method/templates/` existir, os modelos de lá são a **versão de referência**; se não existir, use os modelos do documento [`uc-alterar-cobertura-real.md`](./uc-alterar-cobertura-real.md). Nunca copie arquivos de outro projeto.

### Regras herdadas que continuam valendo

1. Não invente requisitos, regras, endpoints, números de Issue/PR, portas, scripts, commits nem resultados de execução. Tudo que não estiver confirmado é **proposta** ou **pergunta**.
2. **Não acrescente atributos** à `ENTIDADE` nem à resposta além dos que existem na classe de domínio ou estão respaldados por especificação/ADR vigente. Consulte os ADRs antes de decidir o que pode ser alterado e o formato do item retornado (há decisões que adiam atributos).
3. **Preserve os nomes e assinaturas existentes**: identificadores da entidade (ex.: não trocar `<entidade>Id` por `id`), métodos de criação, listagem e busca e o contrato de gravação do Repository. A alteração é **aditiva**: nenhum UC anterior muda de comportamento.
4. O núcleo (entidade, Service, contrato do Repository) **não** depende de TypeORM nem de HTTP. Não exponha tipos do TypeORM no contrato de Repository.
5. Mantenha a separação entre os **dois mappers**: resposta HTTP (`entidade → DTO de resposta`) e persistência (`entidade ↔ entidade ORM`).
6. Não execute comandos destrutivos, não toque o banco de desenvolvimento, não aplique migration fora do banco de testes e não publique no GitHub (Issues, PRs, Project) sem pedir confirmação antes.
7. Não faça merge nem feche Issues automaticamente.
8. Não crie commits ou alterações artificiais "para ter diff".
9. Diferencie sempre: **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado**.
10. Classifique achados como **Observação**, **Problema**, **Evidência**, **Proposta** ou **Verificação**.
11. **Um UC e uma entidade por execução.** Pedidos que envolvam outra entidade ou outra operação são registrados como **fora de escopo** e tratados em nova execução.
12. **Reaproveite as regras de validação já existentes.** Se um atributo alterável já tem regra de validação no cadastro (ex.: tamanho do nome), a alteração usa **a mesma regra**, sem duplicá-la. Registre qual regra foi reaproveitada.
13. **A tabela de cobertura é verificável** (ver 3.5): uma linha por item, nome exato do teste conferido no código, teste executado agora e situação explícita. Nenhum item fica "Coberto" sem teste, e item sem teste termina em implementação ou em ADR.
14. **Concorrência é decisão registrada, não implementação.** Controlar alterações simultâneas (por exemplo, bloqueio otimista com versão do item) exige atributo novo, migration e mudança de contrato, e fica **fora** do UC de alteração. Trate-a como regra candidata (*last write wins*), linha da tabela de cobertura em *Não implementado* e ADR de adiamento (3.5). Só implemente se o estudante decidir criar um UC próprio para isso.

---

## 3. ETAPA 1 — O CASO DE USO DE ALTERAÇÃO EXISTE?

**Esta etapa não escreve código-fonte.** Ela só produz ou avalia a especificação (e, com autorização, a estrutura de documentação da seção 3.5).

### 3.0. Primeira ação obrigatória: perguntas iniciais

Antes de buscar, criar, gravar ou comparar qualquer coisa, envie **uma única mensagem** com as perguntas 0, 1, 2 e 4 abaixo e **aguarde as respostas**. A pergunta 3 (chave, atributos alteráveis e dados retornados) só é feita **depois** que a entidade for confirmada e a classe dela for lida (ver seção 6). Não responda por conta própria nenhuma delas; se o estudante já tiver informado algo no início da conversa, apenas confirme.

> **0. Descrição prévia (módulo 0).** Você já tem a descrição de meia página do módulo 0 (quem usa, caso normal, duas regras, uma situação de falha e "como eu mostraria" cada uma)?
> - (a) **sim** — informe o caminho (ex.: `docs/planejamento/<uc>.md`) ou cole o texto;
> - (b) **ainda não** — recomendo fazê-la antes; informe se prefere seguir mesmo assim. Nesse caso, as perguntas da Etapa 1 (3.2) cobrirão o que faltar, mas o assistente **não redige a descrição em seu lugar** sem as suas respostas.
>
> **1. UC de referência (`REF`).** Qual caso de uso devo usar como base para criar, comparar ou validar o UC de alteração?
> - (a) **UC12 — Cadastrar Produto** (`docs/planejamento/uc12-cadastrar-produto/uc-12.md`), o padrão deste curso (sugerido);
> - (b) **outro UC já documentado** (por exemplo, o de busca ou o de listagem) — informe código e caminho;
> - (c) **especificação original própria** — anexe ou informe o caminho.
>
> **2. Entidade (`ENTIDADE`).** Em **qual entidade** o item será alterado? Escolha **apenas uma**:
> - (a) **a mesma entidade do UC de referência** (eu a identifico a partir do documento e do código e peço sua confirmação);
> - (b) **outra entidade** — informe o nome (e o módulo, se houver mais de um).
>
> **3. Chave, atributos alteráveis e dados retornados (`CHAVE`, `ALTERAVEIS` e `CAMPOS`).** *(feita só depois de a entidade ser confirmada.)* Mostrarei a **estrutura da classe** da entidade (atributos, tipos, identificador) lida do código/ADR, e você escolherá:
> - **por qual atributo** o item a alterar será localizado (por padrão, o identificador da entidade);
> - **quais atributos podem ser alterados** (`ALTERAVEIS`). O identificador e os atributos internos não são alteráveis sem decisão própria;
> - quais dados a resposta retorna (todos os atributos atuais ou um subconjunto);
> - se algum dado desejado **não existe** na classe, avise: isso exige decisão e requisito próprios (ver regra 2) e não será criado em silêncio.
>
> **4. Destino dos artefatos (`ARTEFATOS`).** Em qual pasta gravo os artefatos (documento do UC, parecer, planejamento, relatórios, evidências, roteiro de encerramento)? Sugestões típicas, **ainda não verificadas** no repositório: `docs/planejamento/uc<NN>-alterar-<entidade>/`, `docs/uc/uc<NN>/`, `prompts/<NN>/artefatos/` ou outro caminho. Depois da verificação de 2.1 e 2.2, confirmo quais existem de fato e **nada é gravado antes da sua confirmação**. Informe também se devo **versionar** (commit) os artefatos ou deixá-los só no working tree.

Se a entidade ou o código do UC não forem conhecidos, **proponha** (não imponha) o próximo código livre para o `ALVO`. A operação por padrão é **alterar um item existente identificado pela chave**; criar, remover, restaurar ou alterar vários itens de uma vez pertencem a outros UCs.

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
6. Se o `REF` for o UC de cadastro, aproveite as **regras de validação dos atributos** (elas podem valer também para a alteração, ver regra 12), mas **não** copie fluxos que só fazem sentido na criação (ex.: gerar identificador, conflito de unicidade na criação).

#### Regras sobre a `ENTIDADE`, a `CHAVE`, os `ALTERAVEIS` e os `CAMPOS`

1. Uma única entidade. Se o estudante citar duas ou mais, peça que escolha uma e registre as demais como execuções futuras.
2. Se a resposta for "a mesma do `REF`", identifique-a no documento e no código (entidade de domínio, módulo, Repository, DTOs) e **confirme** nome, módulo e identificador antes de seguir.
3. Se for outra entidade, **inspecione o código** para saber se ela existe, onde está e quais atributos tem. Se não existir (ainda não modelada), registre como **pendência bloqueante**: a alteração não pode ser implementada sobre entidade inexistente; proponha que a entidade seja especificada antes.
4. **Baseie-se na estrutura da classe.** Leia a classe de domínio (e, para contraste, a entidade ORM e os DTOs existentes) e apresente uma tabela **atributo · tipo · obrigatório? · origem (domínio, ORM, ADR) · identificador? · tem regra de validação hoje? · alterável? · aparece hoje em alguma resposta HTTP?**. A `CHAVE`, os `ALTERAVEIS` e os `CAMPOS` só podem ser escolhidos entre os atributos dessa tabela.
5. Para a `CHAVE`, registre: o tipo do identificador (ex.: UUID, inteiro), como o formato inválido será tratado e, se não for o identificador, a unicidade e o que acontece com mais de um resultado (pendência).
6. Para os `ALTERAVEIS`, registre, atributo a atributo: a regra de validação aplicável (reaproveitada do cadastro ou nova) e o que acontece ao enviar um valor inválido. **Identificador e atributos internos** (ex.: marca de remoção lógica, datas de controle) **não são alteráveis** sem confirmação explícita; se o estudante os quiser, registre como pendência.
7. Para os `CAMPOS`, atributos internos ou sensíveis **não** são retornados sem confirmação explícita. Se a listagem ou a busca da mesma entidade já retornam um conjunto de campos, mostre-o e pergunte se a alteração deve retornar o mesmo conjunto ou outro.
8. Registre a decisão numa tabela `atributo → alterável? → retornado? → justificativa` que será usada nos DTOs, nos critérios de aceite e nos testes de contrato.

#### Regras sobre os `ARTEFATOS`

1. **Nenhum arquivo é gravado antes da resposta.** Não crie pasta antes dela.
2. Use o caminho escolhido em **todas** as etapas, inclusive na Etapa 2.
3. Se o caminho já existir, **inspecione** e **nunca sobrescreva** arquivo existente sem mostrar a diferença e obter autorização; em conflito de nome, proponha sufixo.
4. Se o caminho estiver fora do repositório ou ignorado pelo `.gitignore`, avise.
5. Nomeie os arquivos com prefixo ordenado e finalidade clara (ex.: `00-uc-referencia.md`, `01-existencia-do-uc.md`, `02-uc-alterar-<entidade>.md`, `03-planejamento-github.md`, `10-relatorio-final.md`).
6. Commit só se o estudante tiver pedido; push e PR continuam exigindo confirmação.

### 3.1. Verificar a existência do UC `ALVO`

Faça uma busca real no repositório e no GitHub (não responda de memória), usando a `ENTIDADE` confirmada. Exemplo (substitua os termos):

```bash
# Documentos de caso de uso
ls prompts/ docs/ docs/uc/ docs/planejamento/ 2>/dev/null
grep -rIil --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
  -E 'alterar <entidade>|atualizar <entidade>|editar <entidade>|PUT /<recurso>/:|PATCH /<recurso>/:|UC[0-9]+' \
  prompts docs method 2>/dev/null

# Indícios no código
grep -rIn --exclude-dir=node_modules --exclude-dir=dist \
  -E "@Put\(|@Patch\(|update[A-Z]\w*\(|alterar[A-Z]\w*\(" src/modules/<modulo> test 2>/dev/null

# Estado no GitHub (se `gh` estiver autenticado; caso contrário, avise que esta parte foi pulada)
gh issue list --state all --limit 50 --search "alterar <entidade>"
```

Considere que o UC existe se houver **especificação documentada** (arquivo de UC, seção em planejamento, Issue Epic). Um `@Patch()` ou método de atualização solto no código **sem** especificação **não** é o caso de uso: registre como "implementação sem especificação" e trate como **Problema**. Se o Repository já tiver uma operação de gravação que serve também para atualizar (ex.: `save` que insere ou atualiza), registre como **Observação** e avalie se pode ser reaproveitada sem alterar o contrato existente. **Leia todas as implementações do Repository** (banco e memória) antes de concluir: uma gravação que atualiza no banco pode apenas *acrescentar* na implementação em memória e duplicaria o item. Registre o resultado de cada implementação separadamente.

Apresente o resultado em uma tabela: **o que procurei · onde · o que encontrei**. Conclua com exatamente uma decisão:

- **Decisão A — Não existe** → siga para 3.2.
- **Decisão B — Existe** → siga para 3.3.

Se o resultado for ambíguo (ex.: especificação parcial em outro formato), **pergunte** antes de decidir.

### 3.2. Decisão A — Criar o caso de uso a partir do `REF`

1. Defina o código do `ALVO` (confirmado em 3.0; se não houver, proponha o próximo livre e peça confirmação). Se o estudante tiver a especificação original, **use-a como fonte** e pare de inferir.
2. **Parta da descrição prévia** (pergunta 0), se houver, e **pergunte só o que falta** (em lote, curto). Onde houver **padrão sugerido**, apresente-o junto com o motivo e peça apenas a **confirmação ou a troca**; o assistente **não** o adota sem a resposta do estudante. Sugestões, ajustadas à `ENTIDADE` e aos `ALTERAVEIS`:
   - Quem é o ator? A alteração é pública ou exige permissão?
   - **Método e rota:** `PUT /<recurso>/:<chave>` (substitui o recurso) ou `PATCH /<recurso>/:<chave>` (altera parcialmente)? A escolha muda o corpo aceito e deve ser **decidida pelo estudante**.
     - **Padrão sugerido (a confirmar):** `PUT`, com o atributo alterável **obrigatório** no corpo. Quando há **um único** atributo alterável, `PUT` e `PATCH` têm o mesmo corpo; o `PUT` gera menos decisões (não existe o caso "corpo vazio") e reaproveita as regras de validação do cadastro (regra 12). O custo aparece se a entidade ganhar mais atributos alteráveis: acrescentar um atributo **obrigatório** a um `PUT` quebra clientes existentes. Registre isso como **condição para reavaliar**, e o `PATCH` como alternativa documentada. Se o estudante tiver **mais de um** atributo alterável, o `PATCH` passa a ser a recomendação.
   - **Corpo da requisição:** quais atributos podem vir? O que acontece se vier um atributo **não alterável** (ex.: o identificador): é rejeitado ou ignorado?
   - **Somente se o estudante escolher `PATCH`:** o que acontece com um corpo **vazio** (`{}`) ou sem nenhum atributo alterável? **Padrão sugerido (a confirmar):** `400` com a mesma forma de erro de validação do projeto, exigindo **ao menos um** atributo alterável. Essa decisão gera um fluxo alternativo, uma regra de negócio e um critério de aceite próprios, com linha na tabela de cobertura e teste. Com `PUT` esta pergunta **não se aplica**, porque o atributo é obrigatório.
   - O identificador da rota e o do corpo, se ambos existirem, podem divergir? Qual vence?
   - Atributo alterável com valor **inválido** (ex.: vazio, só espaços, acima do limite): qual status e qual corpo de erro, conforme os ADRs de erros e a regra já usada no cadastro?
   - Identificador com formato inválido (ex.: UUID malformado) é erro de requisição (`400`) ou "não encontrado" (`404`)?
   - Item inexistente: qual status e qual corpo de erro, conforme os ADRs de erros do projeto?
   - Registros removidos/inativos podem ser alterados? (Se a entidade não tiver esse conceito, registre como fora de escopo.)
   - Alterar para o **mesmo valor** já existente é sucesso, ou erro? **Padrão sugerido (a confirmar):** sucesso (`200`), coerente com a repetição idempotente do `PUT`.
   - **Resposta de sucesso:** status (`200` com o item atualizado, ou `204` sem corpo) e formato do item (o mesmo da busca/listagem ou próprio)? **Padrão sugerido (a confirmar):** `200` com o item atualizado, contendo os mesmos `CAMPOS` da busca. Motivos: o cliente confirma o valor gravado sem um `GET` extra; o teste de contrato consegue provar que o corpo traz **exatamente** os campos aprovados e que os atributos internos não vazam (com `204` não há corpo para verificar); é coerente com o cadastro, que devolve o item criado. Escolha `204` só se o estudante decidir que a resposta nunca será usada.
   - **Falha ao gravar:** o que garante que **nada foi alterado pela metade**? Qual status e corpo?
   - **Concorrência** (duas alterações ao mesmo tempo no mesmo item): o padrão deste prompt é **fora do escopo**, com a regra candidata *"em alterações simultâneas vale a última gravação (*last write wins*)"*. Apenas **peça confirmação** dessa regra; não pergunte "dentro ou fora". Se o estudante quiser controlar a concorrência (por exemplo, com versão do item), isso é um **UC próprio**, não parte desta execução (regra 14).
3. **Crie o documento** usando o `REF` confirmado como **molde estrutural**, com as mesmas seções (no UC12, as 13), adaptadas à alteração da `ENTIDADE`. Não copie regras do `REF` que não se apliquem. Salve na pasta `ARTEFATOS` e informe o nome do arquivo.
4. **Conteúdo mínimo esperado** (espelha o `REF`; a lista abaixo é a do UC12):
   - Identificação (código, nome, sistema, módulo, tipo: atualizar).
   - Objetivo.
   - Atores e observação do que precisa ser confirmado.
   - Pré-condições (o item existe e está ativo) e pós-condições (sucesso **e** falha, incluindo "nada foi alterado").
   - Fluxo principal numerado.
   - Pelo menos **3 fluxos não felizes**: **1 alternativo** (item inexistente), **1 alternativo** (valor de atributo alterável inválido) e **1 de exceção** (falha ao gravar na persistência). Acrescente o identificador inválido e o item removido como fluxos alternativos, conforme decidido. Se o estudante escolheu `PATCH`, acrescente também o **corpo vazio ou sem atributo alterável** como fluxo alternativo (são então, no mínimo, 4 fluxos não felizes, mais os acrescentados).
   - Regras de negócio numeradas (RN01…), cada uma marcada como **confirmada** ou **candidata**.
   - Validações e restrições (incluindo o que **não** está definido).
   - Requisitos funcionais (RF01…), incluindo a `CHAVE`, os `ALTERAVEIS` e **quais `CAMPOS` são retornados** (tabela da 3.0).
   - Considerações arquiteturais com as unidades de trabalho possíveis (ver 4.2).
   - Critérios de aceite (CA01…), **verificáveis**, cada um ligado a um RF/RN. Inclua um CA que prove que **os atributos não alterados continuam iguais** e um que prove que **uma alteração recusada não grava nada**.
   - Escopo do trabalho e o que está **fora** do escopo (inclusive as demais entidades e operações e o **controle de concorrência**, com a regra candidata *last write wins* e a referência à ADR de 3.5).
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
| 17 | **Entidade, `CHAVE`, `ALTERAVEIS` e dados retornados** explícitos e coerentes com a classe de domínio/ADRs (item específico da alteração) | | | |
| 18 | **Tratamento de identificador inválido, item inexistente e valor inválido** definido (status e corpo de erro) | | | |
| 19 | **Garantia de que uma alteração recusada ou que falha não deixa o item alterado pela metade** | | | |

Depois da tabela:

- Classifique o UC como **Completo**, **Completo com ressalvas** ou **Incompleto**.
- Liste as lacunas por prioridade e **proponha** os ajustes (texto sugerido). **Não edite o documento sem autorização**; mostre o diff proposto.
- Aponte **conflitos** com o código/ADRs existentes (ex.: o UC permite alterar um atributo que não existe na classe, ou cita outra entidade).

### 3.4. Planejamento no GitHub (apenas proposta)

Seguindo `prompts/01`, `02` e `03`, **proponha** (sem criar nada):

- Issue principal `[UC<NN>] Alterar <Entidade>` e ≥ 5 Sub-Issues justificadas (cada uma um **comportamento verificável**: sucesso, item inexistente, valor inválido, falha de persistência, identificador inválido), sem criar Sub-Issue por fase RED/GREEN/REFACTOR.
- Labels, dependências reais (distinguindo obrigatória × contexto), responsáveis ("A definir" se não informados), estados iniciais no Project.
- Se o projeto tiver `docs/uc/<uc>/state.yaml` e `method/`, siga o playbook da Fase A em vez de duplicar o processo, e valide com `method/scripts/check-state.sh`. Para um UC de **atualizar**, o campo `arquetipo` do estado é `atualizar`; os materiais do curso registram que, de início, só `criar` tinha sido exercitado em caso real (a consulta já foi feita no UC14), então informe que `atualizar` é um **esboço** e anote isso como limite declarado.

### 3.5. Estrutura de documentação, tabela de cobertura e ADRs

Esta seção aplica o que os módulos 0 e 1 do curso ensinam. **Proponha antes de criar** e peça autorização.

1. **Mostre o que existe e o que falta** da lista de 2.2 (`docs/planejamento/<uc>.md`, `docs/uc/<uc>/relatorios/A.md`, `docs/adr/`). **Pergunte** se pode criar o que faltar. Sem autorização, registre como **Aguardando decisão** e siga somente com os artefatos da pasta `ARTEFATOS`.
   - **Uma única fonte para a especificação.** A especificação criada em 3.2 é o `docs/planejamento/<uc>.md`. Se o estudante escolheu outra pasta em `ARTEFATOS`, **não mantenha duas cópias**: pergunte qual é a oficial e faça a outra apenas apontar para ela.
2. **Criação, com autorização:**
   - Se existir `method/templates/`, copie o modelo correspondente (`caso-de-uso.md` para a especificação, `adr.md` para as ADRs) para o lugar indicado e preencha. Se não existir, crie o arquivo com os modelos de [`uc-alterar-cobertura-real.md`](./uc-alterar-cobertura-real.md), seções 7.4 e 8.
   - O `A.md` com a tabela de cobertura usa **sempre** o esqueleto da seção 8.5 desse documento: `method/templates/relatorio-de-fase.md` é o modelo do relatório formal da fase e **não** substitui esse esqueleto.
   - **Nunca sobrescreva** arquivo existente: acrescente a ele (ex.: uma seção em um `A.md` que já exista) ou use o próximo número livre de ADR.
3. **Tabela de cobertura** em `docs/uc/<uc>/relatorios/A.md`, com as colunas **Item · Teste que prova · Situação** e **uma linha por item** do UC (fluxos, RN, RF, CA). Na Etapa 1 ainda não há testes: a maioria das linhas é **A implementar** ou **Aguardando decisão**. Valores de situação: *Coberto*, *Parcial* (diga o que falta), *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.
4. **ADRs.** Para cada item que o estudante **decidir adiar ou excluir**, **proponha** uma ADR em `docs/adr/` com as partes: contexto, decisão, **condição para retomar**, consequências e alternativas consideradas. Quem decide é o estudante; o assistente só redige a proposta.
   - **ADR e linha padrão para a concorrência.** Proponha, sem esperar o estudante lembrar, a linha **Concorrência · nenhum · Não implementado (ADR)** na tabela e uma ADR de adiamento com: contexto (a alteração muda poucos atributos e perder uma alteração simultânea tem custo baixo), decisão (vale a última gravação; sem controle de versão), **condição para retomar** (por exemplo, quando houver mais de um atributo alterável ou dados em que perder uma alteração tenha custo) e consequências (+ UC simples, sem migration; − uma alteração pode sobrescrever outra sem aviso). Se o estudante discordar, ele decide; o assistente não escolhe por ele.
5. **Atualização na Etapa 2:** a cada unidade concluída, atualize a tabela com o **nome exato do teste** (conferido no código) e a situação, **somente depois de executar o teste** e guardar a saída real (ver 4.5).

### 3.6. GATE — pare aqui

Termine a Etapa 1 com:

1. A decisão (A ou B) e o documento criado ou o parecer de comparação.
2. Os valores confirmados de `REF`, `ENTIDADE`, `CHAVE`, `ALTERAVEIS`, `CAMPOS`, `ALVO` e `ARTEFATOS`.
3. A tabela de cobertura inicial e as ADRs propostas (3.5).
4. A lista de perguntas ainda abertas.
5. A frase: **"Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação."**

**Não inicie a Etapa 2 sem aprovação explícita do estudante.** Se houver pergunta crítica sem resposta (ator, `CHAVE`, `ALTERAVEIS`, método HTTP, campos retornados, tratamento de item inexistente e de valor inválido, entidade inexistente), a implementação **não** começa.

---

## 4. ETAPA 2 — IMPLEMENTAÇÃO (somente após o gate)

### 4.1. Pré-requisitos

- UC `ALVO` aprovado (Decisão A) ou ajustado e aprovado (Decisão B), com `ENTIDADE`, `CHAVE`, `ALTERAVEIS` e `CAMPOS` confirmados.
- Working tree limpo ou com alterações explicadas; branch principal atualizada.
- Ambiente verificado de verdade: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm test`. Registre a saída real; se algo falhar antes de você mexer, é **linha de base**, não culpa sua.
- Confirme portas, containers e scripts **lendo** `compose.yaml`, `package.json` e `project-profile.md`. Não presuma.

### 4.2. Unidades de trabalho (proposta a refinar com o UC aprovado)

Adapte ao que o UC aprovado exigir; não crie unidade sem justificativa nele:

| # | Unidade | Camada | Observação |
|---|---|---|---|
| 1 | Operação do Repository que **grava a alteração** de um item existente. Se a operação de gravação atual já atualiza, **reaproveite-a** sem alterar o contrato existente; se não, acrescente uma operação nova, **sem alterar** as existentes | Domínio/Aplicação | Mudança aditiva. Deve ser possível provar que uma falha **não deixa o item alterado pela metade**. **Confira o reaproveitamento em *todas* as implementações do Repository (banco e memória): uma gravação que atualiza no banco pode apenas *acrescentar* na implementação em memória, e duplicaria o item. Leia as duas antes de decidir e registre o resultado como Observação ou Problema.** |
| 2 | Caso de uso no Service (ex.: `alterar<Entidade>()`): localiza o item ativo pela `CHAVE`, aplica a **mesma regra de validação** do cadastro aos `ALTERAVEIS` e grava; sem acoplar a HTTP/ORM | Aplicação | "Não encontrado", "valor inválido" e "falha ao gravar" são exceções de **domínio**, traduzidas para HTTP na fronteira. Reaproveite exceções e regras já existentes (regra 12). |
| 3 | Implementação em memória do Repository | Infraestrutura | Para testes rápidos. Deve reproduzir o comportamento de "item removido não é alterável", se o UC decidir assim. |
| 4 | Implementação TypeORM do Repository + mapper de persistência | Infraestrutura | Migration **apenas** se o esquema mudar. Para alterar atributos que já existem, normalmente **não** muda. |
| 5 | Endpoint `PUT` ou `PATCH /<recurso>/:<chave>` (método e rota **conforme o UC**), validação do parâmetro de rota (ex.: pipe de UUID, se o identificador for UUID), **DTO de entrada** com apenas os `ALTERAVEIS`, DTO de resposta com exatamente os `CAMPOS`, tradução das exceções para os status do UC | HTTP | Reutilizar o DTO/mapper de resposta existentes quando coincidirem com os `CAMPOS`. Atributo não alterável no corpo: tratar como o UC decidir (rejeitar ou ignorar), com teste. |
| 6 | Testes: unitários (Service), controller, integração (sem mocks de Service/Repository), contrato HTTP | Testes | Cobrir cada CA e cada FA/FE. **Três testes específicos:** (a) uma alteração recusada não grava nada; (b) os atributos não alterados permanecem iguais; (c) duas alterações em **sequência** no mesmo item deixam o valor da última (documenta a regra *last write wins*; não é teste de concorrência real). |
| 7 | Cenários `.http` (desenvolvimento e contêiner) e checagens no `run-checks.sh` | Verificação | Esperado × Obtido, ambiente containerizado. **Organização obrigatória em pastas por caso de uso**: ver 4.2.1. |
| 8 | ADRs para decisões novas ou adiamentos (ver 3.5) | Documentação | Só se houver decisão real. |

#### 4.2.1. Cenários `.http`: o que criar e como organizar

Os cenários `.http` fazem parte da entrega (unidade 7) e seguem a coleção do Material 13. Antes de criar, **leia** `http-rest-client/` e o `README.md` de `containerizado/`; reproduza a convenção que já existe, sem inventar outra.

```text
http-rest-client/
├── <recurso>/                              (ex.: products)
│   ├── uc<NN>-alterar-<entidade>/          (ex.: uc15-alterar-produto)
│   │   ├── <recurso>-controller.http       requisições do ciclo de implementação
│   │   └── test-scenarios.http             matriz de cenários, um por CA/FA/FE
│   └── uc<MM>-.../                         UCs anteriores, cada um na sua subpasta
└── containerizado/
    ├── NN-<recurso>-<operacao>.http        ex.: 05-products-alterar-produto.http
    ├── README.md                           atualizar a tabela de arquivos e a lista do que o script confere
    └── run-checks.sh                       acrescentar as checagens do UC (Esperado × Obtido)
```

Regras:

1. **Uma subpasta por caso de uso** dentro da pasta do recurso, como nos UCs anteriores. **Pergunte antes de mover** qualquer arquivo existente.
2. Cada cenário traz, no título, o resultado esperado (`→ esperado: 200 OK ...`) e o CA/FA/FE que cobre. Cubra, no mínimo: alteração com sucesso, item inexistente (identificador válido, mas sem registro), item removido (se o UC o tratar), identificador com formato inválido, valor inválido de cada atributo alterável, atributo não alterável no corpo e rota inexistente (`404`).
3. Os arquivos `.http` não fazem asserções; a prova automatizada fica no `run-checks.sh`. Atualize ali qualquer checagem que fixe o **contrato anterior** (ex.: o método da alteração na rota `/<recurso>/:<chave>` respondendo `404` porque ainda não existe; confirme o status real antes de alterar a checagem) e acrescente as do UC.
4. **Atenção:** diferente da busca, a alteração **grava dados**. Os cenários que alteram registros **não se executam sem autorização** (regra 6). Se o UC exigir um item criado para provar o sucesso, **peça autorização** para criar um item de teste, ou registre como **Aguardando evidência** e deixe o CI provar.
5. Atualize o `README.md` de `containerizado/` e a documentação que desenha a árvore da coleção, para os arquivos novos não ficarem fora dos índices.

### 4.3. Ciclo por unidade (igual aos Materiais 04–06)

Para **cada** unidade:

1. Vincule a unidade à Issue correspondente; **pergunte** antes de criar Issue ou branch no GitHub. Branch no padrão já usado no projeto (ex.: `feature/uc<NN>-<nn>-<descricao>`).
2. **RED:** escreva o teste a partir de um CA; rode e **cole a saída real da falha**. Confirme que falha pelo motivo certo.
3. **GREEN:** implemente o mínimo; rode o mesmo teste e a suíte relacionada; **cole a saída real**.
4. **REFACTOR:** só com evidência (duplicação, acoplamento). "Não refatorar" é resultado válido e deve ser justificado.
5. **Regressão:** os UCs existentes da `ENTIDADE` (ex.: cadastro, listagem e busca) mantêm status, corpo e testes. Compare com o contrato documentado, não com a memória.
6. **Tabela de cobertura:** atualize a linha do item com o nome exato do teste e a situação (3.5, passo 5).
7. Commit pequeno e rastreável (mensagem referencia a Issue). Não faça push nem abra PR sem confirmação.

### 4.4. Contrato HTTP a verificar (ajustar ao UC aprovado)

Documente e teste, comparando **Esperado × Obtido**, no mínimo:

- Sucesso: status e corpo (item contendo **exatamente** os `CAMPOS` aprovados, com o valor novo dos `ALTERAVEIS`). Releia o item (por busca ou listagem) e confirme que **a alteração foi gravada**.
- Atributos **não alterados** permanecem com o valor anterior.
- Item inexistente (identificador válido, sem registro): status e corpo de erro conforme o UC e a semântica já adotada no projeto.
- Item removido (se o UC o tratar como inexistente): mesmo desfecho do item inexistente.
- Identificador com formato inválido: status conforme o UC (tipicamente `400` via validação do parâmetro de rota), distinto do item inexistente.
- Valor inválido de um atributo alterável: status e corpo de erro conforme o UC e a regra reaproveitada do cadastro; **nada é gravado**.
- Atributo não alterável no corpo: comportamento definido pelo UC (rejeitado ou ignorado).
- Falha de persistência: status e corpo de erro conforme a semântica já adotada no projeto, sem expor a causa, e **sem alteração parcial**.
- Vazamento de campos internos: a resposta contém **apenas** os `CAMPOS` definidos.
- **Contrato anterior substituído:** se a rota da alteração já era testada como inexistente (`404`, em testes ou no `run-checks.sh`), esses testes mudam de propósito e cada mudança deve citar o CA que a autoriza.

### 4.5. Verificação e evidências

Execute e registre a saída real de: `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:integration` (banco de testes), `pnpm test:e2e` (se aplicável) e, no ambiente containerizado, o `run-checks.sh` com os novos cenários. Falhas já conhecidas e documentadas devem ser identificadas como tal; falhas novas são **Problema**.

**Evidências:** guarde cada saída em `docs/uc/<uc>/evidencias/<fase>/`, **um arquivo por execução**, com: comando completo, data e hora UTC, commit de base (`git rev-parse HEAD` antes da execução), diretório/ambiente, código de saída, a saída real e a leitura do resultado. Use `method/templates/evidencia-de-comando.md` se existir, ou o modelo de [`uc-alterar-cobertura-real.md`](./uc-alterar-cobertura-real.md), seção 8. **Nunca** cole saída ilustrativa ou esperada como se fosse real; remova segredos e dados pessoais.

**Atenção ao `run-checks.sh`:** ele roda contra a API do contêiner e o banco de **desenvolvimento**, e a alteração **grava**. Isso afeta o ambiente do estudante: **peça autorização expressa** antes de reconstruir a API, aplicar migration no banco de desenvolvimento ou executar o script. Sem autorização, registre como "Aguardando evidência" e deixe o CI (smoke do Compose) provar.

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
3. Para integração, entregue um **roteiro de conclusão** com PRs, ordem de merge e fechamento de Issues. **Não execute** merge nem feche Issues; quem decide é o estudante. O roteiro não depende de nenhum modelo externo; se existir um roteiro de conclusão de UC anterior (ex.: `docs/uc/uc14/roteiro-conclusao-uc14.md`), use-o como referência de formato. A estrutura mínima, em um arquivo na pasta `ARTEFATOS` (ex.: `roteiro-conclusao-uc<NN>.md`), é:
   1. **Tabela de passos**, na ordem de execução, com as colunas **Passo · Ação · Situação** (`Feito`, `Aberto para revisão` ou `Pendente (estudante)`). Inclua: merge de cada PR (e a ordem entre eles), fechamento de cada Issue com link para o PR e para a evidência, fechamento do Epic, movimentação dos itens do Project para `Done` e, se houver `state.yaml`, a aprovação dos gates. Só marque `Feito` o que foi realmente executado, com autorização expressa.
   2. **Provas disponíveis:** caminhos da tabela de cobertura, da auditoria e da verificação no contêiner (ou **Aguardando evidência**).
   3. **Ressalvas:** desvios do método, falhas conhecidas fora do escopo e alterações feitas no ambiente do estudante (banco de desenvolvimento, migrations).
   4. **Encerramento:** seção acrescentada ao final, com data, só quando o estudante confirmar que o UC foi concluído.

---

## 5. FORMATO DAS RESPOSTAS

- Etapa 1: uma seção por item de 3.0 a 3.6, com tabelas.
- Etapa 2: por unidade — objetivo, arquivos tocados, saída RED, saída GREEN, decisão de refatoração, regressão, atualização da tabela de cobertura, commit sugerido.
- Sempre termine cada resposta com **"Próximo passo"** e **"Perguntas em aberto"**.
- Marque a origem das afirmações de um relatório com as etiquetas **Documentado**, **Confirmado no código**, **Executado** e **Hipótese**. Só **Executado** prova comportamento.
- Salve os artefatos em Markdown, organizados por finalidade, **na pasta `ARTEFATOS`**, sem sobrescrever arquivos existentes sem inspecioná-los antes. A estrutura de documentação da seção 3.5 (`docs/planejamento/`, `docs/uc/<uc>/relatorios/`, `docs/adr/`, `docs/uc/<uc>/evidencias/`) é criada **somente com autorização**, nos caminhos indicados. Ao final de cada etapa, liste os arquivos gravados (caminho completo). Os cenários `.http` seguem a organização da seção 4.2.1 e não ficam na pasta `ARTEFATOS`. O resumo final da seção 7 também fica fora dela, na pasta deste prompt.

## 6. PRIMEIRA RESPOSTA

Sua primeira resposta deve ser **apenas** as perguntas 0, 1, 2 e 4 de 3.0 (descrição prévia, UC de referência, entidade e destino dos artefatos), sem busca, sem código e sem documentos. A pergunta 3 (chave, atributos alteráveis e dados retornados) vem na mensagem seguinte, **depois** de a entidade ser confirmada e de a classe dela ser lida: mostre a tabela de atributos da classe (3.0, regra 4) e só então peça a escolha da `CHAVE`, dos `ALTERAVEIS` e dos `CAMPOS`. Só então apresente o resultado de 3.1. **Entre as respostas e o 3.1**, execute a localização das fontes e da estrutura de documentação das seções 2.1 e 2.2 (somente leitura) e, se faltar alguma fonte, pergunte onde estão antes de seguir.

**Se o estudante já tiver respondido tudo na mensagem inicial** (inclusive `CHAVE`, `ALTERAVEIS` e `CAMPOS`): não repergunte o que já foi informado; apenas **confirme** os valores em uma tabela curta. Mesmo assim, **não pule a leitura da classe**: execute 2.1 e 2.2, leia a entidade e mostre a tabela de atributos de 3.0 (regra 4) para **conferir** as respostas contra o código antes de seguir. Atributo informado que não exista na classe, ou que seja o identificador ou um atributo interno, vira **pendência** devolvida ao estudante, nunca corrigida em silêncio.

## 7. RESUMO FINAL DA EXECUÇÃO (arquivo)

Ao concluir a Etapa 2 (depois do roteiro de conclusão de 4.6) ou sempre que o estudante pedir, **gere o resumo final da execução em um arquivo**, escrito para o estudante ler com facilidade: texto corrido, em português, com títulos curtos e poucas tabelas. O relatório de fatos de 4.6 continua existindo; este resumo conta a história inteira em linguagem simples.

**Onde gravar:** na mesma pasta deste prompt, com o nome `uc-alterar-resumo-da-execucao-uc<NN>.md` (substitua `<NN>` pelo código do `ALVO`; ex.: `uc-alterar-resumo-da-execucao-uc15.md`). Se o arquivo já existir, inspecione e mostre a diferença antes de sobrescrever. Não faça commit sem o estudante pedir; push e PR continuam exigindo confirmação.

**Conteúdo, nesta ordem:**

1. **Ponto de partida:** o que o prompt pede e como a execução começou.
2. **Decisões do estudante:** `REF`, `ENTIDADE`, `CHAVE`, `ALTERAVEIS`, `CAMPOS`, `ALVO`, ator, método e rota, tratamento de identificador inválido, de item inexistente e de valor inválido, soft delete (se houver) e o que ele autorizou a versionar.
3. **Etapa 1:** o que foi buscado, a decisão A ou B, os documentos criados (caminhos) e a **estrutura de documentação** criada (com autorização).
4. **Planejamento no GitHub:** Epic, Sub-Issues, Project e `state.yaml`, com os números **reais**.
5. **Etapa 2:** o que foi implementado em cada camada (núcleo, HTTP, persistência), o contrato, os cenários `.http` (com a organização de 4.2.1) e a auditoria.
6. **Cobertura e decisões registradas:** a situação final da tabela de cobertura (quantos itens em cada situação) e as ADRs criadas.
7. **O que deu errado ou ficou diferente do planejado:** cada desvio do método ou do prompt, inclusive RED que não falhou, correção de GREEN, divergências encontradas e ajustes de ferramentas. Registre também o que foi esquecido e corrigido depois.
8. **Autorizações que afetaram o ambiente do estudante:** banco de desenvolvimento, migrations, merges, fechamento de issues, aprovação de gates e remoção de branches ou worktrees.
9. **Resultados verificados:** comandos executados e saídas reais (contagens de testes que passam e falham, falhas conhecidas identificadas como tal, CI).
10. **O que ainda não tem prova:** tudo que ficou **Aguardando evidência**.
11. **O que aconteceu além do prompt:** trabalho extra pedido durante a sessão.
12. **Onde está tudo:** repositório remoto e pasta local, com caminhos e números de issues/PRs/commits; diga se algo existe **só localmente**.
13. **O que ficou pendente**, incluindo outras entidades ou operações que o estudante queira tratar em **novas execuções** deste prompt.

**Regras:** só fatos obtidos de fato nesta execução (regra 1); número de issue, PR e commit só se foi retornado por um comando; diferencie **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado** (regra 9); sem autoavaliação de "aprovado". Termine a resposta com a lista do arquivo gravado (caminho completo), **"Próximo passo"** e **"Perguntas em aberto"**.
