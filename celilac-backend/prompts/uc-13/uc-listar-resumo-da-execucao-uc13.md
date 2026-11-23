# Resumo da execução do prompt `uc-listar.md` no UC13 (Listar Produtos)

Este texto conta, em linguagem corrida, tudo o que foi feito entre 2026-11-23 e o fim da sessão: o que o prompt pediu, o que foi entregue, o que deu errado no caminho e onde cada coisa está. Os números de issues, PRs e commits são os reais, obtidos durante a execução.

## 1. Ponto de partida

O prompt `prompts/uc-listar.md` pede que um caso de uso de **listagem** seja levado da especificação à implementação verificada, reaproveitando o processo que o UC12 (Cadastrar Produto) já tinha ensinado. Ele funciona em duas etapas: primeiro especificar e parar para validação; só depois implementar.

A primeira regra do prompt é não fazer nada antes de quatro perguntas: qual UC serve de referência, qual a entidade, quais dados a listagem devolve e onde gravar os artefatos. Respondi apenas essas perguntas, sem buscar nem escrever arquivos, como o prompt exige.

## 2. Decisões que você tomou

- **Referência:** o próprio UC12 (`docs/planejamento/uc12-cadastrar-produto/uc-12.md`).
- **Entidade:** a mesma do UC12, o `Product` (identificador `productId`).
- **Dados retornados:** todos os atuais, ou seja `productId` e `name`. Não existe preço no produto (a ADR-002 adiou o preço), então ele ficou de fora.
- **Código do caso de uso:** UC13.
- **Ator:** consumidor da API, consulta pública, sem permissão específica (minha sugestão, que você confirmou).
- **Paginação:** padrão de 20 itens; o cliente pode pedir mais. Como "pedir mais" exige um teto, propus 100 e você confirmou.
- **Lista vazia:** é sucesso (`200` com lista vazia).
- **Soft delete:** a entidade ganha o conceito de remoção lógica com `deletedAt`, e a listagem traz só os produtos ativos.
- **Rota:** `GET /products`, que até então era um contrato de 404 testado. Você confirmou a troca.
- **Ordenação:** por nome e, em empate, por `productId`.
- **Versionamento:** tudo versionado, com um único PR para a implementação.

## 3. Etapa 1: a especificação

Procurei no repositório e no GitHub se o UC13 já existia. Não existia: não havia documento, método de listagem no código nem issue. Concluí pela "Decisão A" do prompt (criar o UC a partir da referência).

Criei três documentos em `docs/planejamento/uc13-listar-produtos/`: a página das variáveis (`00-uc-referencia.md`), o resultado da busca (`01-existencia-do-uc.md`) e o caso de uso em 13 seções (`02-uc-listar-produtos.md`), com 13 critérios de aceite, uma tabela de rastreabilidade e as perguntas em aberto. Você validou o UC e respondeu às perguntas pendentes.

## 4. Planejamento no GitHub

Com sua autorização, publiquei o planejamento. O processo seguiu o playbook da Fase A do método do projeto.

- **Epic #104** e **Sub-Issues #105 a #117**, todas vinculadas ao Epic: a Fase A (#105), sete fatias (#106 a #112) e as fases C1 (#113), C2 (#114), D (#115), E (#116) e F (#117).
- Todos os itens entraram no GitHub Project #6, com a primeira fatia em `Ready` e o resto em `Backlog`.
- Criei o `docs/uc/uc13/state.yaml`, que é a fonte da verdade do estado do caso de uso, e o relatório da Fase A.

As sete fatias, cada uma com um comportamento observável: listar os ativos (F01), excluir os removidos (F02), lista vazia (F03), paginação (F04), ordenação (F05), paginação inválida (F06) e falha de persistência na consulta (F07).

## 5. Etapa 2: a implementação

Trabalhei numa branch separada, num worktree isolado, para não tocar nas suas alterações do curso. Cada fatia seguiu o ciclo teste que falha (RED), implementação mínima (GREEN) e, quando havia evidência, refatoração.

**Núcleo (F01 a F07).** O repositório de produtos ganhou a operação de listar a página de produtos ativos, sem alterar o que já existia. O serviço ganhou `listProducts`, com `page` e `limit` (padrão 1 e 20), validação (rejeita `page` menor que 1, `limit` fora de 1 a 100 e não inteiros) e tratamento de falha sem vazar detalhes internos. A entidade `Product` ganhou `deletedAt` (nulo significa ativo). Registrei a decisão na ADR-005.

**Adaptador HTTP (Fase C1).** `GET /products` devolve `{ items, page, limit, total }`, com cada item só `productId` e `name`. Parâmetros inválidos dão `400` no mesmo formato de erro que o projeto já usava; falha de persistência dá `500` com mensagem genérica.

**Persistência real (Fase C2).** Acrescentei a coluna `deletedAt` (migration reversível, produtos existentes permanecem ativos), o mapeamento no ORM e a consulta paginada no PostgreSQL.

**Contrato, verificação e auditoria (fases D, E e F).** Documentei o contrato em `docs/uc/uc13/contrato.md`, criei os cenários `.http` e as checagens do UC13 no `run-checks.sh` e fiz a auditoria arquitetural. A auditoria achou um problema menor: o objeto de entrada da consulta importava uma constante do serviço. Movi as constantes de paginação para o arquivo de regras da entidade, sem mudar o comportamento.

## 6. O que deu errado ou ficou diferente do planejado

Registro tudo, porque o prompt manda separar o que foi provado do que foi presumido.

- **A F03 não teve RED.** O comportamento (lista vazia é sucesso) já era satisfeito pela F01. O teste passou de primeira e foi registrado como teste de caracterização.
- **Um GREEN saiu incompleto.** Na F05 criei a função de ordenação mas não a usei, e commitei mesmo assim. Percebi ao rodar a suíte inteira, consertei num commit próprio e guardei a saída que falhou como evidência.
- **A ordenação divergia do banco.** Ao testar nomes com maiúsculas e acentos, o PostgreSQL ordenava `abacaxi, Ácido, arroz, Banana, Zebra`, enquanto o adaptador em memória ordenava por bytes. Corrigi o adaptador (`Intl.Collator('pt-BR')`). Depois, por sua autorização, fixei `COLLATE "pt-BR-x-icu"` na consulta, para a ordem não depender da collation padrão do banco. Um teste de paridade com 23 nomes passou na primeira execução.
- **O validador do método não aceitava um PR para várias fatias.** Como você escolheu um PR único, o `check-state.sh` acusava "PR já usado". Com sua autorização criei o campo opcional `pr_compartilhado`, com a ADR-005 do método e testes do validador.
- **Esqueci de atualizar dois documentos.** O README da pasta `containerizado` e a árvore do `13-02` não citavam o novo arquivo `03-products-listar-produtos.http`. Corrigi agora, junto com este resumo.

## 7. Autorizações que você deu e que afetaram seu ambiente

- Aplicar a migration no **banco de desenvolvimento** e reconstruir a API no contêiner, para rodar a verificação containerizada. O `run-checks.sh` também grava produtos no banco de desenvolvimento, como já fazia no UC12.
- Rodar `migration:revert` no **banco de testes**, para provar que a migration é reversível.
- Fazer os merges dos PRs, fechar as issues e o Epic, aprovar os gates das fases A a F no `state.yaml` em seu nome e apagar as branches e worktrees temporários.

## 8. Resultados verificados

- `pnpm test`: 47 testes passam e 4 falham. As 4 são as falhas conhecidas de `orders` (ADR-001), fora do escopo.
- `pnpm test:integration` (PostgreSQL de testes): 9 testes passam, inclusive down e up da migration e a paridade de collation.
- `pnpm test:e2e`: 5 passam e 1 falha, a conhecida de `orders`.
- `run-checks.sh --durability` no contêiner: 30 checagens ok, 0 falhas.
- CI do GitHub verde em todos os PRs (qualidade, integração e E2E, smoke do Docker Compose e GitGuardian).

## 9. O que ainda não tem prova

- A falha real de consulta no PostgreSQL (o `500`) foi testada só com repositório simulado.
- A paridade de ordenação cobre 23 nomes; outros casos de borda não foram exercitados.
- Se um PostgreSQL vier sem suporte a ICU, a consulta falha em vez de ordenar diferente. Foi uma escolha deliberada.

## 10. O que aconteceu além do prompt

- **Índice do UC.** Criei `docs/uc/uc13/README.md`, que aponta para todos os documentos, o código, os testes, as ADRs e os itens do GitHub (PR #121).
- **O prompt foi versionado.** O `prompts/uc-listar.md` só existia na sua máquina. Versionei (PR #122) e corrigi o caminho do UC12 dentro dele, que apontava para um arquivo inexistente.
- **Cenários `.http` do desenvolvimento.** Acrescentei a listagem a `http-rest-client/products/` e separei os arquivos em subpastas por caso de uso, `uc12-cadastrar-produto` e `uc13-listar-produtos` (PR #123). Os caminhos citados nos documentos do UC12 foram atualizados.
- **Sincronização da sua pasta.** Seu repositório estava 57 commits atrás do `main`. Atualizei o `main` local e, para você ver o UC13 sem worktree, restaurei na sua pasta só os 90 arquivos do UC13 e os commitei na sua branch (`e93315b`). Seu trabalho do curso ficou intacto.
- **Push da sua branch:** não foi feito. O remoto tinha um commit a mais que você não tinha, e você preferiu deixar o commit só local.

## 11. Onde está tudo

- **No GitHub, no `main`:** especificação, estado, evidências, ADRs, código, testes e cenários. O ponto de entrada é `celilac-backend/docs/uc/uc13/README.md`.
- **Issues e PRs:** Epic #104, issues #105 a #117, PRs #118 a #123, todos fechados ou integrados, e o Project #6 em `Done`.
- **Na sua máquina:** o UC13 está na pasta de trabalho e no commit `e93315b`, só local, na branch `docs/curso-app-prompt-codex-m1b`.

## 12. O que ficou pendente

- O commit `e93315b` não está no remoto. Se quiser enviá-lo, é preciso rebasear sobre o commit que o remoto tem a mais.
- As alterações do curso continuam sem commit na sua branch.
- Há um link quebrado no seu trabalho do curso (`method/didatico/curso/m00-o-caso-pronto.md` aponta para `/m00-pratica/`), que o `check-links.mjs` acusa. Não toquei nele.
