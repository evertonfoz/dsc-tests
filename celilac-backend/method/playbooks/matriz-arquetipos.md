# Matriz de aplicabilidade por arquétipo de caso de uso

> **Grau de validação.** Os arquétipos **criar** (UC12), **consultar** (UC13 e UC14) e **atualizar** (UC15), todos no CeliLac, foram exercitados em prática. Os demais são **esboços**: hipóteses fundamentadas no que cada tipo costuma exigir, **ainda não executadas**. Cada esboço deve ser validado no primeiro caso de uso real daquele tipo e então promovido (ou corrigido) com evidências.
> Legenda: `=` igual ao `criar` · `±` muda parcialmente (ver nota) · `+` fase ganha passos · `−` fase simplificada.

## 1. Visão geral por fase

| Fase | criar *(validado)* | consultar *(validado, UC13 e UC14)* | atualizar *(validado, UC15)* | excluir *(esboço)* | autenticar *(esboço)* |
|---|---|---|---|---|---|
| **A** Planejar e publicar | referência | = | = | = | + segurança como item de planejamento |
| **B** Fatias (núcleo) | ver seção 2 | ± fatias de leitura (sem efeito colateral) | + estado anterior e conflitos | + integridade e política de remoção | + hash, política de credenciais |
| **C1** Fronteira HTTP | `POST`, 201/400 | `GET`, 200/404, parâmetros e filtros | `PUT`/`PATCH`, 200/404/409 | `DELETE`, 204/404 | `POST` de login, 200/401, sem vazar detalhes |
| **C2** Persistência real | gravar e reler | + consultas, índices, paginação | + atualização, concorrência | + remoção física ou lógica, integridade referencial | + armazenamento seguro de credenciais |
| **D** Contrato de resposta | DTO de resposta, não exposição | **peso maior**: formato de lista, paginação, campos | ± | − (corpo costuma ser vazio) | **peso maior**: o que nunca sai na resposta |
| **E** Verificação reprodutível | cadastro + durabilidade | leitura de dado conhecido; sem durabilidade a provar | alteração + releitura | remoção + confirmação de ausência | login válido/inválido; sem registrar segredos |
| **F** Auditoria e encerramento | = | = | = | = | + revisão de segurança dedicada |

## 2. Arquétipo `criar` — validado (UC12)

| Aspecto | Conteúdo |
|---|---|
| Catálogo de fatias | ver `guia-decomposicao-em-fatias.md`, seção 5 |
| Resposta de sucesso | `201 Created` com DTO público |
| Erros típicos | `400` (entrada inválida); `409` se houver unicidade |
| Prova de persistência | consulta SQL de leitura antes e depois de reiniciar **só a API** |
| Atenção | cobertura **real** de RN/FA/FE na Fase F (lição do UC12) |

## 3. Esboços dos demais arquétipos

### 3.1. `consultar` *(validado, UC13 e UC14)*
- **Fatias típicas (confirmadas):**
  - *Listagem (UC13):* listar só itens ativos com os campos aprovados; removidos fora da lista e do total; lista vazia é sucesso com total 0; paginação com limite padrão e navegação entre páginas; ordenação estável (campo e, em empate, o identificador); paginação inválida rejeitada no núcleo sem consultar o Repository; falha ao consultar informada sem vazar detalhes.
  - *Busca por identificador (UC14):* item ativo (200); inexistente (404); removido tratado como inexistente (404, sem revelar que existiu); falha de persistência (500 genérico); identificador malformado rejeitado por pipe com exceção específica (400), antes do Service.
- **Muda:** não há escrita, então "inválido não é persistido" não se aplica e a Fase E não precisa de prova de durabilidade. A prova de que a consulta não grava vira teste (a busca compara o estado antes e depois, no PostgreSQL de testes).
- **Riscos observados:** (1) **vazar campo interno** (`deletedAt`): a Fase D prova que a resposta traz exatamente os campos aprovados; (2) a **ordenação pode divergir** entre o Repository em memória e o banco (collation): o UC13 fixou a collation no banco e escreveu teste de paridade, que passou sem RED e só vale para os 23 nomes testados e a imagem `postgres:17`; (3) consulta sem limite: o UC13 definiu padrão e máximo (limite 101 responde 400); (4) o **soft delete** ("removido não aparece") exige atributo novo e decisão própria (ADR-005 do projeto, migration reversível e testada); (5) RED que não falha: F03 do UC13 e F03 e C2 do UC14 nasceram sem RED e foram validadas por mutação.
- **Como resolveu "dado conhecido" na Fase E:** sem script de seed, o `run-checks.sh` cria o próprio dado pela rota do UC12 (`POST`) e consulta esse item; a listagem compara o total da API com a contagem SQL de ativos. Isso grava no banco de desenvolvimento (1 a 2 `POST` por execução).
- **Ajuste ao método:** um PR para várias fatias exigiu o campo opcional `pr_compartilhado` (`method/decisoes/ADR-005-pr-compartilhado-entre-fatias.md`).
- **Decisões que o UC precisa tomar:** formato da lista (`items`, `page`, `limit`, `total`) e campos; removido como inexistente; erro de identificador malformado (`400`) distinto de inexistente (`404`).
- **Ainda não exercitado:** filtros por atributo, consulta por atributo que não é chave (vários resultados), índices, ordenação escolhida pelo cliente e consulta sobre outra entidade.

### 3.2. `atualizar` *(validado, UC15)*
- **Fatias típicas (confirmadas no UC15):** atualização válida com a resposta contendo o item atualizado; recurso inexistente (404); removido logicamente tratado como inexistente e **não alterado**; entrada inválida (400) sem gravar; falha de persistência (500) sem alteração parcial. Identificador malformado (400) é da fase C1 (pipe), não do núcleo.
- **Muda:** o teste RED parte de um **estado anterior** (item já cadastrado). Cada recusa precisa provar que **nada foi gravado** (reler o item). A fase C2 precisa de teste de reescrita sem perda de campos não enviados e de falha real do banco com nome anterior preservado.
- **Riscos observados:** (1) a gravação existente (`save`) pode **inserir** em uma implementação e **atualizar** em outra: no UC15 o `save` em memória acrescentava e duplicaria o item, então o Repository ganhou uma operação própria (`updateActiveName`), sem mudar o contrato anterior; (2) a atualização deve ser **uma única instrução** condicionada ao estado ativo (`UPDATE ... WHERE ... AND deletedAt IS NULL RETURNING`), para não haver alteração pela metade nem corrida entre ler e gravar; (3) o corte em fatias pode esconder RED que não falha: se o GREEN da primeira fatia já traduz exceções, as fatias seguintes passam sem RED (aconteceu em F02, F03 e F05 do UC15).
- **Decisões que o UC precisa tomar (viram ADR ou seção do UC):** `PUT` ou `PATCH` (no UC15, `PUT` por haver um único atributo alterável; reavaliar quando houver mais de um); campo não alterável no corpo ignorado ou rejeitado (no UC15, ignorado, conforme ADR-004); alterar para o mesmo valor (no UC15, sucesso); concorrência (no UC15, *last write wins*, ADR-006, com condição para retomar).
- **Fase E:** a verificação em contêiner **grava** no banco de desenvolvimento; o `run-checks.sh` deve alterar apenas um produto criado por ele mesmo e a execução exige autorização expressa.
- **Ainda não exercitado:** `PATCH` e o caso de corpo vazio; atualização parcial de vários atributos; conflito `409` e controle de concorrência.

### 3.3. `excluir` *(esboço)*
- **Fatias típicas:** exclusão de item existente (204); inexistente (404 ou 204 idempotente — decisão do UC); item com dependências (409 ou cascata — decisão); exclusão lógica vs. física.
- **Muda:** a prova de durabilidade vira **prova de ausência**; ações destrutivas ganham atenção redobrada (regra 8 do `AGENTS.md`): verificações **somente** em banco de testes.
- **Riscos:** apagar dados reais; integridade referencial.
- **A validar:** política de remoção e idempotência (ADR obrigatória).

### 3.4. `autenticar` *(esboço)*
- **Fatias típicas:** credenciais válidas; inválidas (401 sem revelar qual campo falhou); usuário inexistente (mesma resposta do anterior); bloqueio/limite de tentativas (se o UC definir); emissão e expiração de token.
- **Muda:** segurança passa a ser requisito de primeira classe: armazenamento de credenciais, segredos fora do repositório e dos relatórios, mensagens de erro uniformes. A Fase F inclui revisão de segurança.
- **Riscos:** vazamento de segredos em logs/evidências; enumeração de usuários.
- **A validar:** o que as evidências podem registrar sem expor segredos (regra 10 do `AGENTS.md`).

## 4. Como promover um esboço a "validado"
1. Executar um UC real do arquétipo seguindo o playbook.
2. Registrar o que foi diferente do esboço (ADR ou nota no relatório da Fase F).
3. Atualizar esta matriz: trocar *esboço* por *validado (UCxx)*, com evidências.
4. Atualizar o catálogo de fatias do arquétipo no guia de decomposição.
