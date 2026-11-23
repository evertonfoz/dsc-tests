## 1. PAPEL E OBJETIVO

Atue como especialista em Engenharia de Software, Análise de Requisitos, TypeScript, NestJS, arquitetura em camadas, TDD (*Test-Driven Development*, desenvolvimento guiado por testes), Git e GitHub. Escreva em português técnico-acadêmico, objetivo e sem narrativa gamificada.

Objetivo: levar um **caso de uso de listagem** de uma **entidade escolhida pelo estudante** da especificação à implementação verificada, **reaproveitando o processo** executado nos Materiais 01 a 13 (que usaram o UC12 — Cadastrar Produto apenas como exemplo didático).

### Variáveis do processo (definidas na Etapa 3.0, nunca presumidas)

| Variável | Significado |
|---|---|
| `REF` | UC de referência: molde estrutural e régua de requisitos mínimos. |
| `ENTIDADE` | Entidade de domínio cuja listagem será especificada (ex.: a do `REF`, ou outra). |
| `CAMPOS` | Dados da `ENTIDADE` que a listagem retorna. |
| `ALVO` | O UC de listagem a criar ou validar (`UC<NN> — Listar <ENTIDADE>`). |
| `ARTEFATOS` | Pasta onde todos os artefatos serão gravados. |

Em todo o prompt, `<entidade>`, `<recurso>` e `<NN>` são **placeholders**: substitua pelos valores reais confirmados. Nunca use um exemplo (como "Product") como se fosse requisito.

Siglas: **UC** (caso de uso), **DTO** (*Data Transfer Object*, objeto de transferência de dados), **ADR** (*Architecture Decision Record*, registro de decisão arquitetural), **DoR** (*Definition of Ready*, critério de prontidão), **CA** (critério de aceite), **RN** (regra de negócio), **RF** (requisito funcional), **FA/FE** (fluxo alternativo / de exceção), **PR** (*Pull Request*).

---

## 2. O QUE O PROCESSO DO UC12 JÁ ENSINOU (BASE DE REFERÊNCIA)

Antes de agir, **leia** estes materiais. Eles definem o padrão de processo; os nomes do domínio (produto, pedido etc.) são exemplos, não requisitos.

| Fonte | O que extrair |
|---|---|
| `prompts/uc-12.md` | **Modelo de especificação padrão** (pode ser substituído pelo `REF` escolhido em 3.0): as 13 seções (identificação, objetivo, atores, pré e pós-condições, fluxo principal, FA/FE, RN, validações, RF, considerações arquiteturais, CA, escopo). Itens não confirmados são marcados como proposta. |
| `prompts/01` | Planejamento: Issue principal (Epic) + no mínimo 5 Sub-Issues, rastreabilidade, labels, GitHub Project com os estados `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`. Sem inventar requisitos. |
| `prompts/02` e `03` | Papéis, DoR, revisão cruzada, priorização, dependências, paralelismo, WIP (limite de trabalho em progresso). |
| `prompts/04` e `05` | Branch por Issue, teste **RED** (falha) antes do código, implementação mínima **GREEN** (passa), evidências reais. |
| `prompts/06` | Refatoração só com evidência, revisão técnica, merge **só com autorização explícita**. |
| `prompts/07` e `08` | Fronteira HTTP (Controller + DTOs + validação), teste integrado sem mocks de Service/Repository. |
| `prompts/09` e `10` | Persistência real (PostgreSQL + TypeORM), migrations, Docker Compose. |
| `prompts/11` | Contrato HTTP estável: DTO de resposta, semântica de status e erros, testes de contrato. |
| `prompts/12` | Auditoria arquitetural; **não alterar código sem evidência**; encerramento de governança (roteiro de conclusão). |
| `prompts/13` | Coleção REST Client (`.http`) e verificação automatizada (`run-checks.sh`) com **Esperado × Obtido**. |
| `docs/uc/`, `docs/adr/`, `project-profile.md`, `method/` (se existirem) | Estado real dos UCs existentes, decisões já tomadas (ADRs) e playbooks por fase. |

### Regras herdadas que continuam valendo

1. Não invente requisitos, regras, endpoints, números de Issue/PR, portas, scripts, commits nem resultados de execução. Tudo que não estiver confirmado é **proposta** ou **pergunta**.
2. **Não acrescente atributos** à `ENTIDADE` nem à resposta além dos que existem no domínio ou estão respaldados por especificação/ADR vigente. Consulte os ADRs antes de decidir o formato do item listado (há decisões que adiam atributos).
3. **Preserve os nomes e assinaturas existentes**: identificadores da entidade (ex.: não trocar `<entidade>Id` por `id`), métodos de criação e o contrato de gravação do Repository. A listagem é **aditiva**.
4. O núcleo (entidade, Service, contrato do Repository) **não** depende de TypeORM nem de HTTP. Não exponha tipos do TypeORM no contrato de Repository.
5. Mantenha a separação entre os **dois mappers**: resposta HTTP (`entidade → DTO de resposta`) e persistência (`entidade ↔ entidade ORM`).
6. Não execute comandos destrutivos, não toque o banco de desenvolvimento, não aplique migration fora do banco de testes e não publique no GitHub (Issues, PRs, Project) sem pedir confirmação antes.
7. Não faça merge nem feche Issues automaticamente.
8. Não crie commits ou alterações artificiais "para ter diff".
9. Diferencie sempre: **Planejado × Documentado × Proposto × Confirmado × Efetivamente executado**.
10. Classifique achados como **Observação**, **Problema**, **Evidência**, **Proposta** ou **Verificação**.

---

## 3. ETAPA 1 — O CASO DE USO DE LISTAGEM EXISTE?

**Esta etapa não escreve código-fonte.** Ela só produz ou avalia a especificação.

### 3.0. Primeira ação obrigatória: perguntas iniciais

Antes de buscar, criar, gravar ou comparar qualquer coisa, envie **uma única mensagem** com as quatro perguntas abaixo e **aguarde as respostas**. Não responda por conta própria nenhuma delas; se o estudante já tiver informado algo no início da conversa, apenas confirme.

> **1. UC de referência (`REF`).** Qual caso de uso devo usar como base para criar, comparar ou validar o UC de listagem?
> - (a) **UC12 — Cadastrar Produto** (`prompts/uc-12.md`), o padrão deste curso (sugerido);
> - (b) **outro UC já documentado** — informe código e caminho;
> - (c) **especificação original própria** — anexe ou informe o caminho.
>
> **2. Entidade (`ENTIDADE`).** A listagem se refere a qual entidade?
> - (a) **a mesma entidade do UC de referência** (eu a identifico a partir do documento e do código e peço sua confirmação);
> - (b) **outra entidade** — informe o nome (e o módulo, se houver mais de um).
>
> **3. Dados retornados (`CAMPOS`).** Quais dados da entidade a listagem deve retornar? Mostrarei os atributos que a entidade realmente possui hoje (lidos do código/ADR) para você escolher:
> - todos os atributos atuais, ou apenas um subconjunto (indique quais);
> - se algum dado desejado **não existe** na entidade, avise: isso exige decisão e requisito próprios (ver regra 2) e não será criado em silêncio.
>
> **4. Destino dos artefatos (`ARTEFATOS`).** Em qual pasta gravo os artefatos (documento do UC, parecer, planejamento, relatórios, evidências, roteiro de encerramento)? Mostrarei apenas as sugestões que existirem de fato no repositório, por exemplo `docs/planejamento/uc<NN>-listar-<entidade>/`, `docs/uc/uc<NN>/`, `prompts/<NN>/artefatos/` ou outro caminho. Informe também se devo **versionar** (commit) os artefatos ou deixá-los só no working tree.

Se a entidade ou o código do UC não forem conhecidos, **proponha** (não imponha) o próximo código livre para o `ALVO`. A operação por padrão é **listar**; se o estudante quiser outra (ex.: consulta por identificador), ele indicará e o escopo será ajustado.

#### Regras sobre o `REF`

1. Não assuma o UC12 mesmo sendo a sugestão: espere a resposta.
2. Leia **integralmente** o documento de referência. Se o arquivo não existir ou estiver ilegível, **pare** e peça o caminho correto; não reconstrua de memória.
3. Extraia do `REF` a **estrutura de seções** e os **requisitos mínimos** que ele cumpre. Apresente essa lista em uma tabela curta e **peça confirmação** de que ela é a régua desejada.
4. Se o `REF` tiver seções ausentes ou fracas, informe; a régua pode ser complementada com o modelo completo de 13 seções do UC12 somente se o estudante concordar.
5. Se o `REF` for de outro domínio, adapte **a estrutura**, nunca as regras de negócio dele.

#### Regras sobre a `ENTIDADE` e os `CAMPOS`

1. Se a resposta for "a mesma do `REF`", identifique-a no documento e no código (entidade de domínio, módulo, Repository, DTOs) e **confirme** nome, módulo e identificador antes de seguir.
2. Se for outra entidade, **inspecione o código** para saber se ela existe, onde está e quais atributos tem. Se não existir (ainda não modelada), registre como **pendência bloqueante**: a listagem não pode ser implementada sobre entidade inexistente; proponha que a entidade seja especificada antes.
3. Para os `CAMPOS`, liste atributo por atributo: nome, tipo, origem (entidade de domínio, ORM, ADR) e se aparece hoje em alguma resposta HTTP. Atributos internos ou sensíveis (ex.: notas internas, dados de outro módulo) **não** são retornados sem confirmação explícita.
4. Registre a decisão numa tabela `campo → retornado? → justificativa` que será usada no DTO de resposta, nos critérios de aceite e nos testes de contrato.

#### Regras sobre os `ARTEFATOS`

1. **Nenhum arquivo é gravado antes da resposta.** Não crie pasta antes dela.
2. Use o caminho escolhido em **todas** as etapas, inclusive na Etapa 2.
3. Se o caminho já existir, **inspecione** e **nunca sobrescreva** arquivo existente sem mostrar a diferença e obter autorização; em conflito de nome, proponha sufixo.
4. Se o caminho estiver fora do repositório ou ignorado pelo `.gitignore`, avise.
5. Nomeie os arquivos com prefixo ordenado e finalidade clara (ex.: `00-uc-referencia.md`, `01-existencia-do-uc.md`, `02-uc-listar-<entidade>.md`, `03-planejamento-github.md`, `10-relatorio-final.md`).
6. Commit só se o estudante tiver pedido; push e PR continuam exigindo confirmação.

### 3.1. Verificar a existência do UC `ALVO`

Faça uma busca real no repositório e no GitHub (não responda de memória), usando a `ENTIDADE` confirmada. Exemplo (substitua os termos):

```bash
# Documentos de caso de uso
ls prompts/ docs/ docs/uc/ docs/planejamento/ 2>/dev/null
grep -rIil --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
  -E 'listar <entidade>|list(ar)? <entidade>|GET /<recurso>|UC[0-9]+' \
  prompts docs method 2>/dev/null

# Indícios no código
grep -rIn --exclude-dir=node_modules --exclude-dir=dist \
  -E '@Get\(|findAll|list[A-Z]\w*\(' src/modules/<modulo> test 2>/dev/null

# Estado no GitHub (se `gh` estiver autenticado; caso contrário, avise que esta parte foi pulada)
gh issue list --state all --limit 50 --search "listar <entidade>"
```

Considere que o UC existe se houver **especificação documentada** (arquivo de UC, seção em planejamento, Issue Epic). Um `@Get` ou método `findAll` solto no código **sem** especificação **não** é o caso de uso: registre como "implementação sem especificação" e trate como **Problema**.

Apresente o resultado em uma tabela: **o que procurei · onde · o que encontrei**. Conclua com exatamente uma decisão:

- **Decisão A — Não existe** → siga para 3.2.
- **Decisão B — Existe** → siga para 3.3.

Se o resultado for ambíguo (ex.: especificação parcial em outro formato), **pergunte** antes de decidir.

### 3.2. Decisão A — Criar o caso de uso a partir do `REF`

1. Defina o código do `ALVO` (confirmado em 3.0; se não houver, proponha o próximo livre e peça confirmação). Se o estudante tiver a especificação original, **use-a como fonte** e pare de inferir.
2. **Pergunte só o que falta** (em lote, curto). Sugestões, ajustadas à `ENTIDADE`:
   - Quem é o ator? A listagem é pública ou exige permissão?
   - Há paginação, ordenação, filtro ou busca? Qual limite máximo?
   - Lista vazia é sucesso (`200` com `[]`) ou erro?
   - Registros removidos/inativos entram na lista? (Se a entidade não tiver esse conceito, registre como fora de escopo.)
3. **Crie o documento** usando o `REF` confirmado como **molde estrutural**, com as mesmas seções (no UC12, as 13), adaptadas à listagem da `ENTIDADE`. Não copie regras do `REF` que não se apliquem (ex.: regras de validação de cadastro não valem para listagem). Salve na pasta `ARTEFATOS` e informe o nome do arquivo.
4. **Conteúdo mínimo esperado** (espelha o `REF`; a lista abaixo é a do UC12):
   - Identificação (código, nome, sistema, módulo, tipo).
   - Objetivo.
   - Atores e observação do que precisa ser confirmado.
   - Pré-condições e pós-condições (sucesso e falha).
   - Fluxo principal numerado.
   - Pelo menos **1 fluxo alternativo** (ex.: lista vazia) e **1 fluxo de exceção** (ex.: falha ao consultar a persistência).
   - Regras de negócio numeradas (RN01…), cada uma marcada como **confirmada** ou **candidata**.
   - Validações e restrições (incluindo o que **não** está definido).
   - Requisitos funcionais (RF01…), incluindo **quais `CAMPOS` são retornados** (tabela da 3.0).
   - Considerações arquiteturais com as unidades de trabalho possíveis (ver 4.2).
   - Critérios de aceite (CA01…), **verificáveis**, cada um ligado a um RF/RN.
   - Escopo do trabalho e o que está **fora** do escopo.
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
| 7 | ≥ 1 fluxo alternativo | | | |
| 8 | ≥ 1 fluxo de exceção (falha de persistência/infra) | | | |
| 9 | Regras de negócio numeradas e distinguindo confirmada × candidata | | | |
| 10 | Validações e restrições, com o que está indefinido | | | |
| 11 | Requisitos funcionais numerados | | | |
| 12 | Considerações arquiteturais / unidades de trabalho | | | |
| 13 | Critérios de aceite verificáveis, cada um ligado a RF/RN | | | |
| 14 | Escopo do trabalho (incluindo o que está fora) | | | |
| 15 | Rastreabilidade (requisito → critério de aceite) | | | |
| 16 | Não inventa regras: itens não confirmados estão marcados | | | |
| 17 | **Entidade e dados retornados** explícitos e coerentes com o domínio/ADRs (item específico da listagem) | | | |

Depois da tabela:

- Classifique o UC como **Completo**, **Completo com ressalvas** ou **Incompleto**.
- Liste as lacunas por prioridade e **proponha** os ajustes (texto sugerido). **Não edite o documento sem autorização**; mostre o diff proposto.
- Aponte **conflitos** com o código/ADRs existentes (ex.: o UC exige um campo que não existe na entidade, ou cita outra entidade).

### 3.4. Planejamento no GitHub (apenas proposta)

Seguindo `prompts/01`, `02` e `03`, **proponha** (sem criar nada):

- Issue principal `[UC<NN>] Listar <Entidade>` e ≥ 5 Sub-Issues justificadas, sem criar Sub-Issue por fase RED/GREEN/REFACTOR.
- Labels, dependências reais (distinguindo obrigatória × contexto), responsáveis ("A definir" se não informados), estados iniciais no Project.
- Se o projeto tiver `docs/uc/<uc>/state.yaml` e `method/`, siga o playbook da Fase A em vez de duplicar o processo, e valide com `method/scripts/check-state.sh`.

### 3.5. GATE — pare aqui

Termine a Etapa 1 com:

1. A decisão (A ou B) e o documento criado ou o parecer de comparação.
2. Os valores confirmados de `REF`, `ENTIDADE`, `CAMPOS`, `ALVO` e `ARTEFATOS`.
3. A lista de perguntas ainda abertas.
4. A frase: **"Etapa 1 concluída. Aguardo sua validação do caso de uso para iniciar a implementação."**

**Não inicie a Etapa 2 sem aprovação explícita do estudante.** Se houver pergunta crítica sem resposta (ator, campos retornados, paginação, entidade inexistente), a implementação **não** começa.

---

## 4. ETAPA 2 — IMPLEMENTAÇÃO (somente após o gate)

### 4.1. Pré-requisitos

- UC `ALVO` aprovado (Decisão A) ou ajustado e aprovado (Decisão B), com `ENTIDADE` e `CAMPOS` confirmados.
- Working tree limpo ou com alterações explicadas; branch principal atualizada.
- Ambiente verificado de verdade: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm test`. Registre a saída real; se algo falhar antes de você mexer, é **linha de base**, não culpa sua.
- Confirme portas, containers e scripts **lendo** `compose.yaml`, `package.json` e `project-profile.md`. Não presuma.

### 4.2. Unidades de trabalho (proposta a refinar com o UC aprovado)

Adapte ao que o UC aprovado exigir; não crie unidade sem justificativa nele:

| # | Unidade | Camada | Observação |
|---|---|---|---|
| 1 | Ampliar o contrato do Repository da `ENTIDADE` com operação de consulta (ex.: listar) **sem alterar** as operações existentes | Domínio/Aplicação | Mudança aditiva, com testes das implementações em memória e TypeORM. |
| 2 | Caso de uso no Service (ex.: `list<Entidade>()`), sem acoplar a HTTP/ORM | Aplicação | Ordenação/limite só se estiverem no UC. |
| 3 | Implementação em memória do Repository | Infraestrutura | Para testes rápidos. |
| 4 | Implementação TypeORM do Repository + mapper de persistência | Infraestrutura | Migration **apenas** se o esquema mudar (ex.: índice de ordenação). |
| 5 | Endpoint `GET /<recurso>` (rota a **confirmar** no UC), DTO de resposta com exatamente os `CAMPOS`, validação de query (se houver paginação/filtro) | HTTP | Reutilizar DTO/mapper de resposta existentes quando coincidirem com os `CAMPOS`; se não coincidirem, criar DTO próprio da listagem. |
| 6 | Testes: unitários (Service), controller, integração (sem mocks de Service/Repository), contrato HTTP | Testes | Cobrir cada CA e cada FA/FE. |
| 7 | Coleção `.http` e `run-checks.sh` | Verificação | Esperado × Obtido, ambiente containerizado. |
| 8 | Documentação técnica/ADR para decisões novas (paginação, ordenação, formato) | Documentação | Só se houver decisão real. |

### 4.3. Ciclo por unidade (igual aos Materiais 04–06)

Para **cada** unidade:

1. Vincule a unidade à Issue correspondente; **pergunte** antes de criar Issue ou branch no GitHub. Branch no padrão já usado no projeto (ex.: `feature/uc<NN>-<nn>-<descricao>`).
2. **RED:** escreva o teste a partir de um CA; rode e **cole a saída real da falha**. Confirme que falha pelo motivo certo.
3. **GREEN:** implemente o mínimo; rode o mesmo teste e a suíte relacionada; **cole a saída real**.
4. **REFACTOR:** só com evidência (duplicação, acoplamento). "Não refatorar" é resultado válido e deve ser justificado.
5. **Regressão:** os UCs existentes da `ENTIDADE` (ex.: o cadastro) mantêm status, corpo e testes. Compare com o contrato documentado, não com a memória.
6. Commit pequeno e rastreável (mensagem referencia a Issue). Não faça push nem abra PR sem confirmação.

### 4.4. Contrato HTTP a verificar (ajustar ao UC aprovado)

Documente e teste, comparando **Esperado × Obtido**, no mínimo:

- Sucesso com registros: status, corpo (item contendo **exatamente** os `CAMPOS` aprovados), ordem.
- Lista vazia: status e corpo conforme o UC.
- Falha de persistência: status e corpo de erro conforme a semântica já adotada no projeto (consulte os ADRs de erros antes de decidir).
- Parâmetros de consulta inválidos (se houver paginação/filtro): `400` via `ValidationPipe`.
- Vazamento de campos internos: a resposta contém **apenas** os `CAMPOS` definidos; o que não foi aprovado não aparece.
- Rota inexistente continua `404`.

### 4.5. Verificação e evidências

Execute e registre a saída real de: `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:integration` (banco de testes), `pnpm test:e2e` (se aplicável) e, no ambiente containerizado, o `run-checks.sh` com os novos cenários. Falhas já conhecidas e documentadas devem ser identificadas como tal; falhas novas são **Problema**.

Confirme também a pureza arquitetural (Material 12): entidade sem imports externos, Service sem TypeORM/DTO HTTP, Controller sem TypeORM, contrato do Repository sem tipos ORM.

### 4.6. Encerramento

1. Atualize `docs/uc/<uc>/state.yaml` (se existir) e rode `method/scripts/check-state.sh` e `node method/scripts/check-links.mjs`.
2. Produza um relatório curto, só com fatos: CAs atendidos (com evidência), CAs pendentes, decisões, riscos, perguntas.
3. Para integração, entregue um **roteiro** (como o `12-roteiro-conclusao-uc12.md`) com PRs, ordem de merge e fechamento de Issues. **Não execute** merge nem feche Issues; quem decide é o estudante.

---

## 5. FORMATO DAS RESPOSTAS

- Etapa 1: uma seção por item de 3.0 a 3.5, com tabelas.
- Etapa 2: por unidade — objetivo, arquivos tocados, saída RED, saída GREEN, decisão de refatoração, regressão, commit sugerido.
- Sempre termine cada resposta com **"Próximo passo"** e **"Perguntas em aberto"**.
- Salve os artefatos em Markdown, organizados por finalidade, **somente na pasta `ARTEFATOS`**, sem sobrescrever arquivos existentes sem inspecioná-los antes. Ao final de cada etapa, liste os arquivos gravados (caminho completo).

## 6. PRIMEIRA RESPOSTA

Sua primeira resposta deve ser **apenas** as quatro perguntas de 3.0 (UC de referência, entidade, dados retornados e destino dos artefatos), sem busca, sem código e sem documentos. Para a pergunta 3, mostre os atributos reais da entidade somente **depois** de a entidade ser confirmada; se necessário, faça as perguntas 1, 2 e 4 primeiro e a 3 na mensagem seguinte. Só então apresente o resultado de 3.1.
