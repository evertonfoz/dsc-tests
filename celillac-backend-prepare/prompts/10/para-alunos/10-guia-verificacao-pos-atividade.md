# Guia de Verificação Pós-Atividade — Material 10

**Containerização do Backend NestJS com Docker Compose (no projeto da sua equipe)**

Use este guia **depois** de executar o prompt do Material 10, para conferir por conta própria, com evidências reais, se o seu ambiente containerizado funciona. Todos os comandos são **não destrutivos**. Execute-os na pasta raiz do backend, na branch de trabalho da containerização.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Antes de começar: preencha a tabela do seu projeto

Os exemplos deste guia usam placeholders `<...>`. Descubra os valores reais no seu `compose.yaml`, `.env` e `package.json` e anote-os aqui. Depois, substitua nos comandos.

| Placeholder | O que é | Valor no seu projeto | Exemplo (CeliLac) |
|---|---|---|---|
| `<API>` | nome do serviço da API no Compose | | `api` |
| `<DB>` | nome do serviço do PostgreSQL de desenvolvimento | | `postgres` |
| `<DB_TEST>` | nome do serviço do PostgreSQL de testes | | `postgres_test` |
| `<PORTA_HTTP>` | porta HTTP da API publicada no host | | `3200` |
| `<ROTA>` | rota do seu caso de uso | | `POST /products` |
| `<SCHEMA.TABELA>` | tabela da funcionalidade (com schema, se houver) | | `products.products` |
| `<COLUNA_ID>` | coluna do identificador | | `"productId"` |
| `<CONTAINER_TESTE>` | nome do contêiner do banco de testes | | `celilac-postgres-test` |
| `<PROJETO_COMPOSE>` | valor de `COMPOSE_PROJECT_NAME` | | `celilac-backend` |
| `<BRANCH>` | branch de trabalho da containerização | | `feature/uc12-09-backend-containerization` |

---

## 1. Pré-requisitos

| Verificação | Comando | Esperado |
|---|---|---|
| Branch | `git branch --show-current` | o valor de `<BRANCH>` |
| `.env` existe e **não** é versionado | `git check-ignore .env` | imprime `.env` |
| `.env` tem todas as chaves do `.env.example` | compare os **nomes** das chaves (nunca os valores) | todas presentes, incluindo `COMPOSE_PROJECT_NAME` |
| Docker disponível | `docker --version` e `docker compose version` | versões exibidas |

`COMPOSE_PROJECT_NAME` é importante: ele define o prefixo da rede e dos volumes (`<PROJETO_COMPOSE>_*`). Sem ele, o Compose usa o nome da pasta e pode criar bancos e volumes duplicados.

---

## 2. Compose e imagem

```bash
docker compose config --quiet && echo OK
docker compose build <API>
docker image ls
```

**Esperado:** `OK`; build concluído sem erro; a imagem do projeto aparece na listagem com a tag definida no Compose (por exemplo, `<nome>:dev`).

> ⚠️ Não use `docker compose config` **sem** `--quiet` ao compartilhar a saída: ele imprime as senhas interpoladas.

**Se o build falhar** com `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE`: veja a seção 9, item 1.

---

## 3. Subir o ambiente

```bash
docker compose up -d --build <API>
docker compose ps
docker compose logs <API> | tail -20
```

**Esperado:**

- o contêiner do PostgreSQL com status `healthy`;
- o contêiner da API com status `Up`;
- nos logs, a **rota do seu caso de uso mapeada** e a mensagem de servidor ouvindo na porta HTTP;
- nenhuma linha de erro.

Ao nomear a API, o Compose inicia também o PostgreSQL de desenvolvimento (dependência) e **não** inicia o serviço do banco de testes.

> **Contêiner `Up` não significa aplicação pronta.** Leia os logs.

---

## 4. Migrations (somente leitura)

Use o script de migrations do **runtime compilado** existente no seu `package.json` (no CeliLac, `migration:show:prod`):

```bash
docker compose run --rm --no-deps <API> pnpm <SCRIPT_MIGRATION_SHOW>
```

**Esperado:** todas as migrations do seu projeto aparecem com `[X]` (executadas), incluindo a migration da sua funcionalidade.

- Se todas estiverem `[X]`, **não execute** o script de `run`. Registre que não havia pendências.
- Só aplique migrations se houver pendência **e** o destino for o banco de **desenvolvimento**.
- Nunca use `synchronize: true` nem `migration:revert` automático.

---

## 5. Cadastro HTTP

Envie uma requisição válida para a rota do seu caso de uso:

```bash
curl -i -X POST http://localhost:<PORTA_HTTP>/<rota> \
  -H "Content-Type: application/json" \
  -d '<payload válido, com um campo extra que não pertence ao contrato>'
```

**Esperado:** `201 Created` (ou o status definido no seu contrato) e corpo com o identificador gerado e os atributos do seu domínio. Anote o identificador.

Verificações extras:

- o campo extra fora do contrato deve ser **descartado**, se o seu `ValidationPipe` usa `whitelist: true`;
- um corpo inválido (por exemplo, sem um campo obrigatório) deve ser **rejeitado** pela validação.

---

## 6. Consulta SQL e durabilidade

Substitua `<ID>` pelo identificador anotado.

```bash
# antes
docker compose exec -T <DB> sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM <SCHEMA.TABELA> WHERE <COLUNA_ID> = '<ID>';
SQL

docker compose restart <API>        # reinicia SOMENTE a API

# depois (aguarde alguns segundos): repita a mesma consulta
docker compose exec -T <DB> sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM <SCHEMA.TABELA> WHERE <COLUNA_ID> = '<ID>';
SQL
```

**Esperado:** 1 linha antes e 1 linha depois, com o **mesmo** identificador e os **mesmos** atributos.

- A API voltar a responder **não** prova durabilidade. A prova é o registro idêntico antes e depois.
- Se a sua tabela está em um schema próprio, use o nome qualificado (`schema.tabela`). Consultar só `tabela` falharia com `relation "..." does not exist`.
- Não crie endpoint GET apenas para essa verificação.

---

## 7. Testes automatizados

Confira os scripts reais do seu `package.json` e execute os que existirem:

```bash
pnpm test                              # suíte rápida (unitários, HTTP com mock, integrados em memória)
docker compose up -d <DB_TEST>         # necessário para o próximo
pnpm test:integration                  # adaptador do repositório contra o banco de TESTES
```

**Esperado:** todos os testes aprovados. Registre os números **obtidos agora**. Números de materiais anteriores são históricos e **não valem como evidência**.

### Cuidado com suítes E2E legadas

Antes de rodar `pnpm test:e2e`, abra o script e os arquivos de teste. Se forem suítes geradas pelo scaffold do Nest ou de outros módulos, que sobem o `AppModule` completo, elas conectam ao banco configurado no `.env` (o de **desenvolvimento**). Nesse caso **não as execute**: registre como *"não executado — fora do escopo e risco ao banco de desenvolvimento"*. A simples existência do script não prova que há testes implementados.

### Banco de testes

- Serviço `<DB_TEST>`, banco distinto do de desenvolvimento, porta publicada no host **diferente** da do banco de desenvolvimento (interna 5432).
- A API de desenvolvimento usa o serviço `<DB>` na porta interna `5432` e **nunca** o banco de testes.
- Confirme que o contêiner pertence ao mesmo projeto Compose:

```bash
docker ps --filter name=<CONTAINER_TESTE> \
  --format '{{.Names}} {{.Status}} project={{.Label "com.docker.compose.project"}}'
```

**Esperado:** `project=<PROJETO_COMPOSE>`.

---

## 8. Checklist de evidências para o Pull Request

Cole no PR a saída real (**sem senhas**):

- [ ] `docker compose config --quiet` → `OK`
- [ ] Build da imagem da API
- [ ] `docker compose ps` com os serviços saudáveis
- [ ] Logs da API com a rota do caso de uso e a porta HTTP
- [ ] Histórico de migrations com todas `[X]` (ou pendências aplicadas e registradas)
- [ ] Cadastro HTTP com o status e o identificador
- [ ] SQL antes do restart
- [ ] SQL depois do restart (mesmo registro)
- [ ] `pnpm test` e `pnpm test:integration` com os números obtidos agora
- [ ] Suítes E2E legadas registradas como não executadas, com o motivo (se aplicável)
- [ ] `git status` limpo, sem `.env` nem senhas no diff

---

## 9. Problemas comuns e como resolver

### 1. `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` no build

- **Sintoma:** falha em `RUN pnpm install ... --frozen-lockfile`, com a mensagem "Cannot update packageManagerDependencies with frozen-lockfile".
- **Causa:** o `package.json` define o campo `packageManager` (por exemplo, `pnpm@12.x`), e esse pnpm exige um bloco `packageManagerDependencies` no `pnpm-lock.yaml`. Se o lockfile não o tiver, `--frozen-lockfile` falha.
- **Correção:** `pnpm install --lockfile-only` e depois commit do `pnpm-lock.yaml`. O diff esperado é apenas de acréscimo, no topo do arquivo; nenhuma dependência do projeto muda. **Revise o diff antes de commitar.**

### 2. O `pnpm` do host reescreve o `pnpm-lock.yaml`

Rodar `pnpm` direto na máquina pode alterar o lockfile. Depois de rodar os testes no host, confira `git status`. Se o lockfile aparecer modificado **sem** você ter alterado dependências, investigue antes de commitar. Para validar o build, prefira `docker compose run --rm ...`.

### 3. Conflito de nome do contêiner

- **Sintoma:** `The container name "/<nome>" is already in use`.
- **Causa:** o contêiner foi criado antes de `COMPOSE_PROJECT_NAME` estar definido e pertence a outro projeto Compose (por exemplo, o nome da pasta).
- **Correção:** confirme o projeto com o comando da seção 7. Se for outro, é seguro recriar **somente o contêiner do banco de TESTES**, porque ele guarda dados descartáveis:

```bash
docker stop <CONTAINER_TESTE> && docker rm <CONTAINER_TESTE>
docker compose up -d <DB_TEST>
```

  Isso cria um volume novo sob o projeto atual. O volume antigo permanece como órfão e pode ser removido depois, de forma consciente. **Nunca faça isso com o contêiner do banco de desenvolvimento.**

### 4. Nomes reais de volumes

No Compose os volumes têm um nome lógico (por exemplo, `meu_postgres_data`). No Docker eles recebem o prefixo do projeto (`<PROJETO_COMPOSE>_meu_postgres_data`). Confirme com `docker volume ls`: podem existir volumes de outros projetos na sua máquina.

### 5. `localhost` dentro do contêiner

Dentro do contêiner da API, `localhost` é o **próprio contêiner**, não o banco. O Compose deve definir `DB_HOST=<DB>` e `DB_PORT=5432` para a API. O `.env` com `DB_HOST=127.0.0.1` vale para quem executa a API **no host** e é sobrescrito pela chave `environment` do Compose.

### 6. Credenciais não conferem com o banco

Mudar usuário ou senha no `compose.yaml`/`.env` **não** altera as credenciais de um banco que já foi inicializado: elas ficaram gravadas no volume. Investigue antes de agir; não apague o volume para "resolver".

### 7. Comandos que **nunca** devem ser usados na verificação

- `docker compose down -v` (apaga os volumes e os dados);
- `migration:revert` automático;
- `synchronize: true`;
- qualquer operação destrutiva contra o banco de desenvolvimento.

Para parar o ambiente sem perder dados: `docker compose stop` ou `docker compose down` (**sem** `-v`).

---

## 10. Distinções que você deve conseguir explicar

- **Imagem construída ≠ API funcional.** Só a requisição HTTP e a consulta SQL comprovam o funcionamento.
- **Contêiner ativo ≠ aplicação pronta.** Leia os logs.
- **Banco disponível ≠ esquema atualizado.** O healthcheck não garante que as migrations foram aplicadas.
- **Testes aprovados ≠ ambiente Docker validado.** Cada nível de verificação dá um tipo diferente de evidência.
- **Porta interna ≠ porta publicada.** A API usa `<DB>:5432` na rede do Compose; o host usa a porta publicada de cada banco (desenvolvimento e testes, em portas diferentes).
- **API reiniciar ≠ dados duráveis.** A prova é o mesmo registro antes e depois do restart.
