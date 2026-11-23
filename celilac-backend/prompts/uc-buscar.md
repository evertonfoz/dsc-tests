## 1. PAPEL E OBJETIVO

Atue como especialista em Engenharia de Software, Análise de Requisitos, TypeScript, NestJS, arquitetura em camadas, TDD (*Test-Driven Development*, desenvolvimento guiado por testes), Git e GitHub. Escreva em português técnico-acadêmico, objetivo e sem narrativa gamificada.

Objetivo: levar **um único caso de uso de busca de um item por identificador** (consulta de um registro) de **uma única entidade escolhida pelo estudante** da especificação à implementação verificada, **reaproveitando o processo** executado nos Materiais 01 a 13 (que usaram o UC12 — Cadastrar Produto apenas como exemplo didático) e, quando existir, o padrão consolidado no caso de uso de listagem (`prompts/uc-listar.md`).

> **Antes de usar este prompt:** leia [`uc-buscar-por-que-este-metodo.md`](./uc-buscar-por-que-este-metodo.md) e faça o primeiro passo do módulo 0 do curso (`method/didatico/curso/m00-o-caso-pronto.md` e `m00-pratica.md`): escolher a entidade e escrever, em meia página, quem usa, o caso normal, **duas regras**, **uma situação de falha** e, para cada uma, **como você mostraria** que está certo. Essa descrição é a **entrada** da Etapa 1 (ver pergunta 0 em 3.0). O prompt cobre o ciclo completo; o estudo dos módulos avança gradualmente, e o estudante pode usar o prompt à medida que os módulos correspondentes forem estudados.

**Escopo de cada execução: um caso de uso e uma entidade por vez.** Se o estudante quiser buscar itens de outra entidade, ou criar outro caso de uso, isso é uma **nova execução** deste prompt, com novas respostas em 3.0. Não agrupe entidades nem operações.

### Variáveis do processo (definidas na Etapa 3.0, nunca presumidas)

| Variável | Significado |
|---|---|
| `REF` | UC de referência: molde estrutural e régua de requisitos mínimos. |
| `ENTIDADE` | A única entidade de domínio cujo item será buscado. |
| `CHAVE` | Atributo da `ENTIDADE` usado para localizar o item (normalmente o identificador). Lido da **classe** da entidade, nunca presumido. |
| `CAMPOS` | Dados da `ENTIDADE` que a resposta da busca retorna. |
| `ALVO` | O UC de busca a criar ou validar (`UC<NN> — Buscar <ENTIDADE> por <CHAVE>`). |
| `ARTEFATOS` | Pasta onde todos os artefatos serão gravados. |

Em todo o prompt, `<entidade>`, `<recurso>`, `<chave>` e `<NN>` são **placeholders**: substitua pelos valores reais confirmados. Nunca use um exemplo (como "Product") como se fosse requisito.

Siglas: **UC** (caso de uso), **DTO** (*Data Transfer Object*, objeto de transferência de dados), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural), **DoR** (*Definition of Ready*, critério de prontidão), **CA** (critério de aceite), **RN** (regra de negócio), **RF** (requisito funcional), **FA/FE** (fluxo alternativo / de exceção), **PR** (*Pull Request*), **HTTP** (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), **UUID** (*Universally Unique Identifier*, identificador único universal), **ORM** (*Object-Relational Mapping*, mapeamento objeto-relacional).

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
| `prompts/uc-buscar-por-que-este-metodo.md`, `method/didatico/curso/m00-o-caso-pronto.md` e `m00-pratica.md` (se existirem) | O problema que motiva o método e a **descrição prévia** do UC que o estudante traz (ator, caso normal, duas regras, uma falha e "como eu mostraria"). Entrada da Etapa 1, não requisito aprovado. |
| `prompts/uc-listar.md` e o resumo da execução do UC de listagem (se existirem) | Padrão já aplicado a uma operação de **consulta**: organização dos cenários `.http` por UC, atualização do `run-checks.sh`, substituição de contrato anterior. Use como exemplo de processo, não de requisito. |
| `docs/uc/`, `docs/adr/`, `project-profile.md`, `method/` (se existirem) | Estado real dos UCs existentes, decisões já tomadas (ADRs) e playbooks por fase. |

### 2.1. Localizar as fontes no workspace em execução

A tabela acima descreve o workspace de origem deste prompt (o projeto CeliLac). Os caminhos são **referências**, não suposições: o workspace em execução pode ter outra estrutura. Logo **depois** de receber as respostas de 3.0 e **antes** de 3.1 (a primeira resposta continua sendo só as perguntas, ver seção 6), verifique onde cada fonte está:

1. Para cada linha da tabela, procure no workspace atual, em modo somente leitura (`ls`, busca por nome), aceitando variações de nome: os Materiais `prompts/01` a `prompts/13` podem ter sufixo (ex.: `01-planejamento-....md`, `10A-....md`) e as pastas `docs/`, `method/` e o `project-profile.md` podem estar em outro nível. Nada é criado nem alterado.
2. Monte uma tabela curta: **fonte esperada · encontrada? · caminho real**.
3. Se todas foram encontradas, siga e use os **caminhos reais** encontrados, não os da tabela.
4. Se faltar alguma fonte (principalmente o modelo de especificação e os Materiais), **pare e pergunte em uma única mensagem**: liste o que foi achado e o que não foi, e peça ao estudante que informe o caminho de cada fonte ausente ou diga que ela não existe. Se não existir, ofereça as saídas: usar só o `REF` informado em 3.0, usar o modelo de 13 seções descrito neste prompt, ou receber o documento anexado. **Não reconstrua o conteúdo de uma fonte ausente de memória.**
5. As fontes marcadas "(se existirem)" (`prompts/uc-listar.md`, `docs/uc/`, `docs/adr/`, `project-profile.md`, `method/`) não bloqueiam a execução quando faltam. Registre como **Observação** que ADRs, estado dos UCs e playbooks não puderam ser verificados e pergunte, na mesma mensagem do passo 4, se existe um equivalente em outro caminho.
6. Se o estudante informar um caminho fora do workspace aberto, avise e peça confirmação antes de ler.
7. Grave o mapa **fonte → caminho real** em `00-uc-referencia.md` (pasta `ARTEFATOS`) e use-o em todo o restante da execução.

### Regras herdadas que continuam valendo

1. Não invente requisitos, regras, endpoints, números de Issue/PR, portas, scripts, commits nem resultados de execução. Tudo que não estiver confirmado é **proposta** ou **pergunta**.
2. **Não acrescente atributos** à `ENTIDADE` nem à resposta além dos que existem na classe de domínio ou estão respaldados por especificação/ADR vigente. Consulte os ADRs antes de decidir o formato do item retornado (há decisões que adiam atributos).
3. **Preserve os nomes e assinaturas existentes**: identificadores da entidade (ex.: não trocar `<entidade>Id` por `id`), métodos de criação/listagem e o contrato de gravação do Repository. A busca é **aditiva**.
4. O núcleo (entidade, Service, contrato do Repository) **não** depende de TypeORM nem de HTTP. Não exponha tipos do TypeORM no contrato de Repository.
5. Mantenha a separação entre os **dois mappers**: resposta HTTP (`entidade → DTO de resposta`) e persistência (`entidade ↔ entidade ORM`).
6. Não execute comandos destrutivos, não toque o banco de desenvolvimento, não aplique migration fora do banco de testes e não publique no GitHub (Issues, PRs, Project) sem pedir confirmação antes.
7. Não faça merge nem feche Issues automaticamente.
8. Não crie commits ou alterações artificiais "para ter diff".
9. Diferencie sempre: **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado**.
10. Classifique achados como **Observação**, **Problema**, **Evidência**, **Proposta** ou **Verificação**.
11. **Um UC e uma entidade por execução.** Pedidos que envolvam outra entidade ou outra operação são registrados como **fora de escopo** e tratados em nova execução.

---

## 3. ETAPA 1 — O CASO DE USO DE BUSCA EXISTE?

**Esta etapa não escreve código-fonte.** Ela só produz ou avalia a especificação.

### 3.0. Primeira ação obrigatória: perguntas iniciais

Antes de buscar, criar, gravar ou comparar qualquer coisa, envie **uma única mensagem** com as perguntas 0, 1, 2 e 4 abaixo e **aguarde as respostas**. A pergunta 3 (chave e dados retornados) só é feita **depois** que a entidade for confirmada e a classe dela for lida (ver seção 6). Não responda por conta própria nenhuma delas; se o estudante já tiver informado algo no início da conversa, apenas confirme.

> **0. Descrição prévia (módulo 0).** Você já tem a descrição de meia página do módulo 0 (quem usa, caso normal, duas regras, uma situação de falha e "como eu mostraria" cada uma)?
> - (a) **sim** — informe o caminho (ex.: `docs/planejamento/<uc>.md`) ou cole o texto;
> - (b) **ainda não** — recomendo fazê-la antes; informe se prefere seguir mesmo assim. Nesse caso, as perguntas da Etapa 1 (3.2) cobrirão o que faltar, mas o assistente **não redige a descrição em seu lugar** sem as suas respostas.
>
> **1. UC de referência (`REF`).** Qual caso de uso devo usar como base para criar, comparar ou validar o UC de busca?
> - (a) **UC12 — Cadastrar Produto** (`docs/planejamento/uc12-cadastrar-produto/uc-12.md`), o padrão deste curso (sugerido);
> - (b) **outro UC já documentado** (por exemplo, o de listagem) — informe código e caminho;
> - (c) **especificação original própria** — anexe ou informe o caminho.
>
> **2. Entidade (`ENTIDADE`).** Em **qual entidade** o item será buscado? Escolha **apenas uma**:
> - (a) **a mesma entidade do UC de referência** (eu a identifico a partir do documento e do código e peço sua confirmação);
> - (b) **outra entidade** — informe o nome (e o módulo, se houver mais de um).
>
> **3. Chave e dados retornados (`CHAVE` e `CAMPOS`).** *(feita só depois de a entidade ser confirmada.)* Mostrarei a **estrutura da classe** da entidade (atributos, tipos, identificador) lida do código/ADR, e você escolherá:
> - **por qual atributo** o item será buscado (por padrão, o identificador da entidade; outro atributo exige decisão própria, por exemplo sobre unicidade);
> - quais dados retornar: todos os atributos atuais ou apenas um subconjunto;
> - se algum dado desejado **não existe** na classe, avise: isso exige decisão e requisito próprios (ver regra 2) e não será criado em silêncio.
>
> **4. Destino dos artefatos (`ARTEFATOS`).** Em qual pasta gravo os artefatos (documento do UC, parecer, planejamento, relatórios, evidências, roteiro de encerramento)? Mostrarei apenas as sugestões que existirem de fato no repositório, por exemplo `docs/planejamento/uc<NN>-buscar-<entidade>/`, `docs/uc/uc<NN>/`, `prompts/<NN>/artefatos/` ou outro caminho. Informe também se devo **versionar** (commit) os artefatos ou deixá-los só no working tree.

Se a entidade ou o código do UC não forem conhecidos, **proponha** (não imponha) o próximo código livre para o `ALVO`. A operação por padrão é **buscar um item por identificador**; se o estudante quiser outra (ex.: busca por filtro que retorna vários itens), ele indicará e o escopo será ajustado (listagem com filtro pertence ao UC de listagem).

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

#### Regras sobre a `ENTIDADE`, a `CHAVE` e os `CAMPOS`

1. Uma única entidade. Se o estudante citar duas ou mais, peça que escolha uma e registre as demais como execuções futuras.
2. Se a resposta for "a mesma do `REF`", identifique-a no documento e no código (entidade de domínio, módulo, Repository, DTOs) e **confirme** nome, módulo e identificador antes de seguir.
3. Se for outra entidade, **inspecione o código** para saber se ela existe, onde está e quais atributos tem. Se não existir (ainda não modelada), registre como **pendência bloqueante**: a busca não pode ser implementada sobre entidade inexistente; proponha que a entidade seja especificada antes.
4. **Baseie-se na estrutura da classe.** Leia a classe de domínio (e, para contraste, a entidade ORM e os DTOs existentes) e apresente uma tabela **atributo · tipo · obrigatório? · origem (domínio, ORM, ADR) · identificador? · aparece hoje em alguma resposta HTTP?**. A `CHAVE` e os `CAMPOS` só podem ser escolhidos entre os atributos dessa tabela.
5. Para a `CHAVE`, registre: o tipo do identificador (ex.: UUID, inteiro), como ele é gerado, se é único e como o formato inválido será tratado. Se o estudante escolher um atributo que **não** é o identificador, registre como pendência: é preciso confirmar unicidade, índice e o que acontece com mais de um resultado.
6. Para os `CAMPOS`, atributos internos ou sensíveis (ex.: notas internas, dados de outro módulo) **não** são retornados sem confirmação explícita.
7. Registre a decisão numa tabela `campo → retornado? → justificativa` que será usada no DTO de resposta, nos critérios de aceite e nos testes de contrato. Se a listagem da mesma entidade já retorna um conjunto de campos, mostre-o e pergunte se a busca deve retornar o mesmo conjunto ou outro.

#### Regras sobre os `ARTEFATOS`

1. **Nenhum arquivo é gravado antes da resposta.** Não crie pasta antes dela.
2. Use o caminho escolhido em **todas** as etapas, inclusive na Etapa 2.
3. Se o caminho já existir, **inspecione** e **nunca sobrescreva** arquivo existente sem mostrar a diferença e obter autorização; em conflito de nome, proponha sufixo.
4. Se o caminho estiver fora do repositório ou ignorado pelo `.gitignore`, avise.
5. Nomeie os arquivos com prefixo ordenado e finalidade clara (ex.: `00-uc-referencia.md`, `01-existencia-do-uc.md`, `02-uc-buscar-<entidade>.md`, `03-planejamento-github.md`, `10-relatorio-final.md`).
6. Commit só se o estudante tiver pedido; push e PR continuam exigindo confirmação.

### 3.1. Verificar a existência do UC `ALVO`

Faça uma busca real no repositório e no GitHub (não responda de memória), usando a `ENTIDADE` e a `CHAVE` confirmadas. Exemplo (substitua os termos):

```bash
# Documentos de caso de uso
ls prompts/ docs/ docs/uc/ docs/planejamento/ 2>/dev/null
grep -rIil --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
  -E 'buscar <entidade>|consultar <entidade>|obter <entidade>|GET /<recurso>/:|UC[0-9]+' \
  prompts docs method 2>/dev/null

# Indícios no código
grep -rIn --exclude-dir=node_modules --exclude-dir=dist \
  -E "@Get\(':|findById|findOne|getById|find[A-Z]\w*By\w*\(" src/modules/<modulo> test 2>/dev/null

# Estado no GitHub (se `gh` estiver autenticado; caso contrário, avise que esta parte foi pulada)
gh issue list --state all --limit 50 --search "buscar <entidade>"
```

Considere que o UC existe se houver **especificação documentada** (arquivo de UC, seção em planejamento, Issue Epic). Um `@Get(':id')` ou método `findById` solto no código **sem** especificação **não** é o caso de uso: registre como "implementação sem especificação" e trate como **Problema**. Se o Repository já tiver um método de leitura usado por outro UC (ex.: verificação de duplicidade no cadastro), registre-o como **Observação** e avalie se pode ser reaproveitado sem alterar o contrato existente.

Apresente o resultado em uma tabela: **o que procurei · onde · o que encontrei**. Conclua com exatamente uma decisão:

- **Decisão A — Não existe** → siga para 3.2.
- **Decisão B — Existe** → siga para 3.3.

Se o resultado for ambíguo (ex.: especificação parcial em outro formato), **pergunte** antes de decidir.

### 3.2. Decisão A — Criar o caso de uso a partir do `REF`

1. Defina o código do `ALVO` (confirmado em 3.0; se não houver, proponha o próximo livre e peça confirmação). Se o estudante tiver a especificação original, **use-a como fonte** e pare de inferir.
2. **Parta da descrição prévia** (pergunta 0), se houver, e **pergunte só o que falta** (em lote, curto). Sugestões, ajustadas à `ENTIDADE`:
   - Quem é o ator? A busca é pública ou exige permissão?
   - Rota e parâmetro: o identificador vai no caminho (`/<recurso>/:<chave>`) ou em outro lugar?
   - Identificador com formato inválido (ex.: UUID malformado) é erro de requisição (`400`) ou tratado como "não encontrado" (`404`)?
   - Item inexistente: qual status e qual corpo de erro, conforme os ADRs de erros do projeto?
   - Registros removidos/inativos podem ser buscados? (Se a entidade não tiver esse conceito, registre como fora de escopo.)
   - O item retornado tem o mesmo formato do item da listagem ou formato próprio?
3. **Crie o documento** usando o `REF` confirmado como **molde estrutural**, com as mesmas seções (no UC12, as 13), adaptadas à busca da `ENTIDADE`. Não copie regras do `REF` que não se apliquem (ex.: regras de validação de cadastro não valem para busca). Salve na pasta `ARTEFATOS` e informe o nome do arquivo.
4. **Conteúdo mínimo esperado** (espelha o `REF`; a lista abaixo é a do UC12):
   - Identificação (código, nome, sistema, módulo, tipo).
   - Objetivo.
   - Atores e observação do que precisa ser confirmado.
   - Pré-condições e pós-condições (sucesso e falha).
   - Fluxo principal numerado.
   - Pelo menos **2 fluxos não felizes**: **1 fluxo alternativo** (item inexistente) e **1 fluxo de exceção** (falha ao consultar a persistência). Acrescente o identificador inválido como fluxo alternativo ou de exceção, conforme decidido.
   - Regras de negócio numeradas (RN01…), cada uma marcada como **confirmada** ou **candidata**.
   - Validações e restrições (incluindo o que **não** está definido, como o formato do identificador).
   - Requisitos funcionais (RF01…), incluindo a `CHAVE` e **quais `CAMPOS` são retornados** (tabela da 3.0).
   - Considerações arquiteturais com as unidades de trabalho possíveis (ver 4.2).
   - Critérios de aceite (CA01…), **verificáveis**, cada um ligado a um RF/RN.
   - Escopo do trabalho e o que está **fora** do escopo (inclusive as demais entidades e operações).
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
| 17 | **Entidade, `CHAVE` e dados retornados** explícitos e coerentes com a classe de domínio/ADRs (item específico da busca) | | | |
| 18 | **Tratamento de identificador inválido e de item inexistente** definido (status e corpo de erro) | | | |

Depois da tabela:

- Classifique o UC como **Completo**, **Completo com ressalvas** ou **Incompleto**.
- Liste as lacunas por prioridade e **proponha** os ajustes (texto sugerido). **Não edite o documento sem autorização**; mostre o diff proposto.
- Aponte **conflitos** com o código/ADRs existentes (ex.: o UC exige um campo que não existe na classe, ou cita outra entidade).

### 3.4. Planejamento no GitHub (apenas proposta)

Seguindo `prompts/01`, `02` e `03`, **proponha** (sem criar nada):

- Issue principal `[UC<NN>] Buscar <Entidade> por <Chave>` e ≥ 5 Sub-Issues justificadas, sem criar Sub-Issue por fase RED/GREEN/REFACTOR.
- Labels, dependências reais (distinguindo obrigatória × contexto), responsáveis ("A definir" se não informados), estados iniciais no Project.
- Se o projeto tiver `docs/uc/<uc>/state.yaml` e `method/`, siga o playbook da Fase A em vez de duplicar o processo, e valide com `method/scripts/check-state.sh`.

### 3.5. GATE — pare aqui

Termine a Etapa 1 com:

1. A decisão (A ou B) e o documento criado ou o parecer de comparação.
2. Os valores confirmados de `REF`, `ENTIDADE`, `CHAVE`, `CAMPOS`, `ALVO` e `ARTEFATOS`.
3. A lista de perguntas ainda abertas.
4. A frase: **"Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação."**

**Não inicie a Etapa 2 sem aprovação explícita do estudante.** Se houver pergunta crítica sem resposta (ator, `CHAVE`, campos retornados, tratamento de item inexistente, entidade inexistente), a implementação **não** começa.

---

## 4. ETAPA 2 — IMPLEMENTAÇÃO (somente após o gate)

### 4.1. Pré-requisitos

- UC `ALVO` aprovado (Decisão A) ou ajustado e aprovado (Decisão B), com `ENTIDADE`, `CHAVE` e `CAMPOS` confirmados.
- Working tree limpo ou com alterações explicadas; branch principal atualizada.
- Ambiente verificado de verdade: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm test`. Registre a saída real; se algo falhar antes de você mexer, é **linha de base**, não culpa sua.
- Confirme portas, containers e scripts **lendo** `compose.yaml`, `package.json` e `project-profile.md`. Não presuma.

### 4.2. Unidades de trabalho (proposta a refinar com o UC aprovado)

Adapte ao que o UC aprovado exigir; não crie unidade sem justificativa nele:

| # | Unidade | Camada | Observação |
|---|---|---|---|
| 1 | Ampliar o contrato do Repository da `ENTIDADE` com operação de consulta por `CHAVE` (ex.: buscar por identificador, retornando a entidade ou ausência) **sem alterar** as operações existentes | Domínio/Aplicação | Mudança aditiva. Se já existir método de leitura equivalente, reaproveite-o em vez de duplicar. |
| 2 | Caso de uso no Service (ex.: `buscar<Entidade>Por<Chave>()`), com o tratamento de item inexistente definido no UC, sem acoplar a HTTP/ORM | Aplicação | O erro de "não encontrado" é do núcleo (exceção de domínio ou equivalente já adotado), traduzido para HTTP na fronteira. |
| 3 | Implementação em memória do Repository | Infraestrutura | Para testes rápidos. |
| 4 | Implementação TypeORM do Repository + mapper de persistência | Infraestrutura | Migration **apenas** se o esquema mudar (ex.: índice na `CHAVE`, caso não seja o identificador). |
| 5 | Endpoint `GET /<recurso>/:<chave>` (rota a **confirmar** no UC), validação do parâmetro de rota (ex.: pipe de UUID, se o identificador for UUID), DTO de resposta com exatamente os `CAMPOS`, tradução do "não encontrado" para o status do UC | HTTP | Reutilizar DTO/mapper de resposta existentes quando coincidirem com os `CAMPOS`; se não coincidirem, criar DTO próprio da busca. |
| 6 | Testes: unitários (Service), controller, integração (sem mocks de Service/Repository), contrato HTTP | Testes | Cobrir cada CA e cada FA/FE. |
| 7 | Cenários `.http` (desenvolvimento e contêiner) e checagens no `run-checks.sh` | Verificação | Esperado × Obtido, ambiente containerizado. **Organização obrigatória em pastas por caso de uso**: ver 4.2.1. |
| 8 | Documentação técnica/ADR para decisões novas (formato do erro, identificador inválido × inexistente) | Documentação | Só se houver decisão real. |

#### 4.2.1. Cenários `.http`: o que criar e como organizar

Os cenários `.http` fazem parte da entrega (unidade 7) e seguem a coleção do Material 13. Antes de criar, **leia** `http-rest-client/` e o `README.md` de `containerizado/`; reproduza a convenção que já existe, sem inventar outra.

```text
http-rest-client/
├── <recurso>/                              (ex.: products)
│   ├── uc<NN>-buscar-<entidade>/           (ex.: uc14-buscar-produto)
│   │   ├── <recurso>-controller.http       requisições do ciclo de implementação
│   │   └── test-scenarios.http             matriz de cenários, um por CA/FA/FE
│   └── uc<MM>-.../                         UCs anteriores, cada um na sua subpasta
└── containerizado/
    ├── NN-<recurso>-<operacao>.http        ex.: 04-products-buscar-produto.http (somente leitura)
    ├── README.md                           atualizar a tabela de arquivos e a lista do que o script confere
    └── run-checks.sh                       acrescentar as checagens do UC (Esperado × Obtido)
```

Regras:

1. **Uma subpasta por caso de uso** dentro da pasta do recurso. Se os arquivos do UC anterior estiverem soltos em `<recurso>/`, mova-os com `git mv` para a subpasta do seu UC, **sem alterar o conteúdo**, e atualize todos os documentos que citam os caminhos antigos (`grep -rn "<recurso>/<arquivo>"`). **Pergunte antes de mover.**
2. Cada cenário traz, no título, o resultado esperado (`→ esperado: 200 OK ...`) e o CA/FA/FE que cobre. Cubra, no mínimo: busca de item existente, item inexistente (identificador válido, mas sem registro), identificador com formato inválido, e rota inexistente (`404`).
3. Os arquivos `.http` não fazem asserções; a prova automatizada fica no `run-checks.sh`. Atualize ali qualquer checagem que fixe o **contrato anterior** (ex.: `GET /<recurso>/:<chave>` → `404`) e acrescente as do UC.
4. Para buscar um item existente sem gravar dados, use um identificador **já presente** no banco consultado (obtido por `GET` da listagem, se existir). Cenários com `POST` não se executam sem autorização (regra 6); se o UC exigir um item criado para provar o sucesso, **peça autorização** ou registre como **Aguardando evidência**.
5. Atualize o `README.md` de `containerizado/` e a documentação que desenha a árvore da coleção (ex.: `docs/planejamento/<uc de referência>/.../estrutura-colecao`), para os arquivos novos não ficarem fora dos índices.

### 4.3. Ciclo por unidade (igual aos Materiais 04–06)

Para **cada** unidade:

1. Vincule a unidade à Issue correspondente; **pergunte** antes de criar Issue ou branch no GitHub. Branch no padrão já usado no projeto (ex.: `feature/uc<NN>-<nn>-<descricao>`).
2. **RED:** escreva o teste a partir de um CA; rode e **cole a saída real da falha**. Confirme que falha pelo motivo certo.
3. **GREEN:** implemente o mínimo; rode o mesmo teste e a suíte relacionada; **cole a saída real**.
4. **REFACTOR:** só com evidência (duplicação, acoplamento). "Não refatorar" é resultado válido e deve ser justificado.
5. **Regressão:** os UCs existentes da `ENTIDADE` (ex.: cadastro e listagem) mantêm status, corpo e testes. Compare com o contrato documentado, não com a memória.
6. Commit pequeno e rastreável (mensagem referencia a Issue). Não faça push nem abra PR sem confirmação.

### 4.4. Contrato HTTP a verificar (ajustar ao UC aprovado)

Documente e teste, comparando **Esperado × Obtido**, no mínimo:

- Sucesso com item existente: status, corpo (item contendo **exatamente** os `CAMPOS` aprovados).
- Item inexistente (identificador válido, sem registro): status e corpo de erro conforme o UC e a semântica já adotada no projeto (consulte os ADRs de erros antes de decidir).
- Identificador com formato inválido: status conforme o UC (tipicamente `400` via validação do parâmetro de rota), distinto do caso de item inexistente.
- Falha de persistência: status e corpo de erro conforme a semântica já adotada no projeto.
- Vazamento de campos internos: a resposta contém **apenas** os `CAMPOS` definidos; o que não foi aprovado não aparece.
- Rota inexistente continua `404`.
- **Contrato anterior substituído:** se a rota da busca já era testada como `404` (em testes ou no `run-checks.sh`), esses testes mudam de propósito e cada mudança deve citar o CA que a autoriza.

### 4.5. Verificação e evidências

Execute e registre a saída real de: `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:integration` (banco de testes), `pnpm test:e2e` (se aplicável) e, no ambiente containerizado, o `run-checks.sh` com os novos cenários. Falhas já conhecidas e documentadas devem ser identificadas como tal; falhas novas são **Problema**.

**Atenção ao `run-checks.sh`:** ele roda contra a API do contêiner e o banco de **desenvolvimento**, pode gravar registros via `POST` (como no UC12) e, se o UC mudar o esquema, exige a migration já aplicada nesse banco. Isso afeta o ambiente do estudante: **peça autorização expressa** antes de reconstruir a API, aplicar a migration no banco de desenvolvimento ou executar o script. Sem autorização, registre como "Aguardando evidência" e deixe o CI (smoke do Compose) provar.

Confirme também a pureza arquitetural (Material 12): entidade sem imports externos, Service sem TypeORM/DTO HTTP, Controller sem TypeORM, contrato do Repository sem tipos ORM.

### 4.6. Encerramento

1. **Verificação de consistência**, conforme o que existe no workspace (mapa de fontes da seção 2.1):
   - **Com `method/` e `docs/uc/<uc>/state.yaml`:** atualize o `state.yaml` e rode `method/scripts/check-state.sh` (com `--remote` se o `gh` estiver autenticado) e `node method/scripts/check-links.mjs`.
   - **Sem a pasta `method/`** (ou sem esses scripts): **não** crie nem invente `state.yaml`, scripts ou validadores, e não pare por causa disso. Registre como **Observação** que os validadores do método não estão disponíveis e faça a conferência manual, somente leitura, anotando o resultado real de cada item:
     1. todo arquivo e caminho citado nos artefatos existe (`ls` em cada caminho);
     2. todo número de Issue e PR citado existe (`gh issue view <n>` e `gh pr view <n>`, se o `gh` estiver autenticado; senão marque **Aguardando evidência**);
     3. cada CA da especificação aparece na tabela de cobertura com o teste que o prova, ou como pendente;
     4. os nomes de testes citados existem nos arquivos de teste (`grep`).
   - **Com `method/` mas sem `state.yaml`:** pergunte ao estudante se quer criar o estado do UC a partir do template do método; sem resposta afirmativa, siga a conferência manual acima.
2. Produza um relatório curto, só com fatos: CAs atendidos (com evidência), CAs pendentes, decisões, riscos, perguntas.
3. Para integração, entregue um **roteiro de conclusão** com PRs, ordem de merge e fechamento de Issues. **Não execute** merge nem feche Issues; quem decide é o estudante. O roteiro não depende de nenhum modelo externo; se o `12-roteiro-conclusao-uc12.md` existir (mapa da seção 2.1), use-o como referência de formato. A estrutura mínima, em um arquivo na pasta `ARTEFATOS` (ex.: `roteiro-conclusao-uc<NN>.md`), é:
   1. **Tabela de passos**, na ordem de execução, com as colunas **Passo · Ação · Situação** (`Feito`, `Aberto para revisão` ou `Pendente (estudante)`). Inclua: merge de cada PR (e a ordem entre eles), fechamento de cada Issue com link para o PR e para a evidência, fechamento do Epic, movimentação dos itens do Project para `Done` e, se houver `state.yaml`, a aprovação dos gates. Só marque `Feito` o que foi realmente executado, com autorização expressa.
   2. **Provas disponíveis:** caminhos da tabela de cobertura, da auditoria e da verificação no contêiner (ou **Aguardando evidência**).
   3. **Ressalvas:** desvios do método, falhas conhecidas fora do escopo e alterações feitas no ambiente do estudante (banco de desenvolvimento, migrations).
   4. **Encerramento:** seção acrescentada ao final, com data, só quando o estudante confirmar que o UC foi concluído.

---

## 5. FORMATO DAS RESPOSTAS

- Etapa 1: uma seção por item de 3.0 a 3.5, com tabelas.
- Etapa 2: por unidade — objetivo, arquivos tocados, saída RED, saída GREEN, decisão de refatoração, regressão, commit sugerido.
- Sempre termine cada resposta com **"Próximo passo"** e **"Perguntas em aberto"**.
- Salve os artefatos em Markdown, organizados por finalidade, **somente na pasta `ARTEFATOS`**, sem sobrescrever arquivos existentes sem inspecioná-los antes. Ao final de cada etapa, liste os arquivos gravados (caminho completo). Os cenários `.http` seguem a organização da seção 4.2.1 e não ficam na pasta `ARTEFATOS`. O resumo final da seção 7 também fica fora dela, na pasta deste prompt.

## 6. PRIMEIRA RESPOSTA

Sua primeira resposta deve ser **apenas** as perguntas 0, 1, 2 e 4 de 3.0 (descrição prévia, UC de referência, entidade e destino dos artefatos), sem busca, sem código e sem documentos. A pergunta 3 (chave e dados retornados) vem na mensagem seguinte, **depois** de a entidade ser confirmada e de a classe dela ser lida: mostre a tabela de atributos da classe (3.0, regra 4) e só então peça a escolha da `CHAVE` e dos `CAMPOS`. Só então apresente o resultado de 3.1. **Entre as respostas e o 3.1**, execute a localização das fontes da seção 2.1 (somente leitura) e, se faltar alguma, pergunte onde estão antes de seguir.

## 7. RESUMO FINAL DA EXECUÇÃO (arquivo)

Ao concluir a Etapa 2 (depois do roteiro de conclusão de 4.6) ou sempre que o estudante pedir, **gere o resumo final da execução em um arquivo**, escrito para o estudante ler com facilidade: texto corrido, em português, com títulos curtos e poucas tabelas. O relatório de fatos de 4.6 continua existindo; este resumo conta a história inteira em linguagem simples.

**Onde gravar:** na mesma pasta deste prompt, com o nome `uc-buscar-resumo-da-execucao-uc<NN>.md` (substitua `<NN>` pelo código do `ALVO`; ex.: `uc-buscar-resumo-da-execucao-uc14.md`). Se o arquivo já existir, inspecione e mostre a diferença antes de sobrescrever. Não faça commit sem o estudante pedir; push e PR continuam exigindo confirmação.

**Conteúdo, nesta ordem:**

1. **Ponto de partida:** o que o prompt pede e como a execução começou.
2. **Decisões do estudante:** `REF`, `ENTIDADE`, `CHAVE`, `CAMPOS`, `ALVO`, ator, rota, tratamento de identificador inválido e de item inexistente, soft delete (se houver) e o que ele autorizou a versionar.
3. **Etapa 1:** o que foi buscado, a decisão A ou B e os documentos criados (caminhos).
4. **Planejamento no GitHub:** Epic, Sub-Issues, Project e `state.yaml`, com os números **reais**.
5. **Etapa 2:** o que foi implementado em cada camada (núcleo, HTTP, persistência), o contrato, os cenários `.http` (com a organização de 4.2.1) e a auditoria.
6. **O que deu errado ou ficou diferente do planejado:** cada desvio do método ou do prompt, inclusive RED que não falhou, correção de GREEN, divergências encontradas e ajustes de ferramentas. Registre também o que foi esquecido e corrigido depois.
7. **Autorizações que afetaram o ambiente do estudante:** banco de desenvolvimento, migrations, `migration:revert`, merges, fechamento de issues, aprovação de gates e remoção de branches ou worktrees.
8. **Resultados verificados:** comandos executados e saídas reais (contagens de testes que passam e falham, falhas conhecidas identificadas como tal, CI).
9. **O que ainda não tem prova:** tudo que ficou **Aguardando evidência**.
10. **O que aconteceu além do prompt:** trabalho extra pedido durante a sessão (índice, versionamento do prompt, reorganização de arquivos, sincronização da pasta local).
11. **Onde está tudo:** repositório remoto e pasta local, com caminhos e números de issues/PRs/commits; diga se algo existe **só localmente**.
12. **O que ficou pendente**, incluindo outras entidades ou operações que o estudante queira tratar em **novas execuções** deste prompt.

**Regras:** só fatos obtidos de fato nesta execução (regra 1); número de issue, PR e commit só se foi retornado por um comando; diferencie **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado** (regra 9); sem autoavaliação de "aprovado". Termine a resposta com a lista do arquivo gravado (caminho completo), **"Próximo passo"** e **"Perguntas em aberto"**.
