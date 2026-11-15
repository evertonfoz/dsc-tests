# Guia de Verificação Pós-Atividade — Material 10

**Containerização do Backend NestJS com Docker Compose (CeliLac, UC12 — Cadastrar Produto)**

Use este guia **depois** de executar a atividade do Material 10, para conferir com evidências reais se o ambiente funciona. Todos os comandos são não destrutivos. Execute-os na pasta `celillac-backend-prepare/`, na branch `feature/uc12-09-backend-containerization`.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Pré-requisitos

| Verificação | Comando | Esperado |
|---|---|---|
| Branch | `git branch --show-current` | `feature/uc12-09-backend-containerization` |
| `.env` existe e não é versionado | `git check-ignore .env` | imprime `.env` |
| `.env` tem as chaves de `.env.example` | compare os nomes das chaves | todas presentes, incluindo `COMPOSE_PROJECT_NAME=celilac-backend` |
| Docker disponível | `docker --version` | versão exibida |

`COMPOSE_PROJECT_NAME` é importante: ele define o prefixo da rede e dos volumes (`celilac-backend_*`). Sem ele, o Compose usa o nome da pasta e pode criar bancos duplicados.

---

## 1. Compose e imagem

```bash
docker compose config --quiet && echo OK
docker compose build api
docker image ls celilac-api
```

**Esperado:** `OK`; build concluído sem erro; imagem `celilac-api:dev` listada.

> Não use `docker compose config` sem `--quiet` ao compartilhar saída: ele imprime as senhas interpoladas.

**Se o build falhar** com `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE`: veja a seção 8, item 1.

---

## 2. Subir o ambiente

```bash
docker compose up -d --build api
docker compose ps
docker compose logs api | tail -20
```

**Esperado:**

- `celilac-postgres` com status `healthy`;
- `celilac-api` com status `Up`;
- nos logs, a rota `{/products, POST}` mapeada e `Server is running on http://localhost:3200`;
- nenhuma linha de erro.

Ao nomear `api`, o Compose inicia também o `postgres` (dependência) e **não** inicia o `postgres_test`.

---

## 3. Migrations (somente leitura)

```bash
docker compose run --rm --no-deps api pnpm migration:show:prod
```

**Esperado:** as 5 migrations com `[X]`, incluindo `CreateProductsTable1794255600000`.

- Se todas estiverem `[X]`, **não execute** `migration:run:prod`. Registre que não havia pendências.
- Só execute `pnpm migration:run:prod` se houver migration pendente e o destino for o `celilac_db`.
- Nunca use `synchronize: true` nem `migration:revert` automático.

---

## 4. Cadastro HTTP

```bash
curl -i -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto de teste","price":10}'
```

**Esperado:** `201 Created` e corpo com `productId` e `name`. O campo `price` deve ser **descartado** (o `ValidationPipe` usa `whitelist: true`). Anote o `productId`.

Verificação extra: um corpo sem `name` deve ser rejeitado pela validação.

---

## 5. Consulta SQL e durabilidade

Substitua `<PRODUCT_ID>` pelo valor anotado.

```bash
# antes
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '<PRODUCT_ID>';
SQL

docker compose restart api        # reinicia SOMENTE a API

# depois (aguarde alguns segundos): repita a mesma consulta
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '<PRODUCT_ID>';
SQL
```

**Esperado:** 1 linha antes e 1 linha depois, com o **mesmo** `productId` e o **mesmo** `name`.

A API voltar a responder não prova durabilidade. A prova é o registro idêntico antes e depois.

A tabela é `products.products` (schema `products`). `SELECT * FROM products;` falharia com `relation "products" does not exist`.

---

## 6. Testes automatizados

```bash
pnpm test                          # suíte rápida, em memória
docker compose up -d postgres_test # necessário para o próximo
pnpm test:integration              # TypeOrmProductsRepository contra celilac_test
```

**Esperado:** `pnpm test` aprova todos os testes (referência histórica do Material 09: 12 testes em 5 arquivos). `pnpm test:integration` aprova 1 teste. Registre os números **obtidos agora**; os históricos não valem como evidência.

### Não execute `pnpm test:e2e`

O script roda `test/app.e2e-spec.ts` e `test/orders/confirm-order.e2e-spec.ts`, suítes legadas fora do UC12. Elas sobem o `AppModule` completo, que conecta ao banco do `.env` (`celilac_db`). Registre como "não executado — fora do escopo do UC12 e risco ao banco de desenvolvimento".

### Banco de testes

- Serviço `postgres_test`, banco `celilac_test`, porta publicada **5435** (interna 5432).
- A API de desenvolvimento usa `postgres:5432` e nunca o banco de testes.
- Confirme que o contêiner pertence ao mesmo projeto Compose:

```bash
docker ps --filter name=celilac-postgres-test \
  --format '{{.Names}} {{.Status}} project={{.Label "com.docker.compose.project"}}'
```

**Esperado:** `project=celilac-backend`.

---

## 6.1. Verificação automatizada (opcional)

A pasta `http-rest-client/containerizado/` traz os `.http` do ambiente Docker e o script `run-checks.sh`, que repete os passos 2 a 5 com asserções:

```bash
./http-rest-client/containerizado/run-checks.sh --durability
```

Veja o `README.md` da pasta.

---

## 7. Checklist de evidências para o Pull Request

Cole no PR a saída real (sem senhas):

- [ ] `docker compose config --quiet` → `OK`
- [ ] Build da imagem `celilac-api:dev`
- [ ] `docker compose ps` com os serviços saudáveis
- [ ] Logs da API com a rota `/products` e a porta 3200
- [ ] `migration:show:prod` com as 5 migrations `[X]`
- [ ] `POST /products` → `201` e `productId`
- [ ] SQL antes do restart
- [ ] SQL depois do restart (mesmo registro)
- [ ] `pnpm test` e `pnpm test:integration` com os números obtidos
- [ ] `test:e2e` registrado como não executado, com o motivo
- [ ] `git status` limpo, sem `.env` nem senhas no diff

---

## 8. Problemas conhecidos e como resolver

### 1. `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` no build

- **Sintoma:** falha em `RUN pnpm install --prod --frozen-lockfile`, com a mensagem "Cannot update packageManagerDependencies with frozen-lockfile".
- **Causa:** o `package.json` define `"packageManager": "pnpm@12.8.1"`, e o pnpm 12 exige o bloco `packageManagerDependencies` no `pnpm-lock.yaml`. Se o lockfile não o tiver, o instalador com `--frozen-lockfile` falha.
- **Correção:** `pnpm install --lockfile-only`, depois commit do `pnpm-lock.yaml`. O diff esperado é só de acréscimo, no topo do arquivo; nenhuma dependência do projeto muda.

### 2. `pnpm` no host reescreve o `pnpm-lock.yaml`

Rodar `pnpm` direto na máquina pode alterar o lockfile. Depois de rodar os testes no host, confira `git status`. Se o lockfile aparecer modificado **sem** você ter alterado dependências, investigue antes de commitar. Para validar o build, prefira `docker compose run --rm ...`.

### 3. Conflito de nome do contêiner `celilac-postgres-test`

- **Sintoma:** `The container name "/celilac-postgres-test" is already in use`.
- **Causa:** o contêiner foi criado antes de `COMPOSE_PROJECT_NAME` estar definido e pertence a outro projeto Compose (por exemplo, `celillac-backend-prepare`).
- **Correção:** confirme o projeto com o comando da seção 6. Se for outro, é seguro recriar **somente o contêiner**, porque o banco de testes guarda dados descartáveis:

```bash
docker stop celilac-postgres-test && docker rm celilac-postgres-test
docker compose up -d postgres_test
```

  Isso cria um volume novo sob o projeto atual. O volume antigo permanece como órfão e pode ser removido depois, de forma consciente. **Nunca faça isso com o `celilac-postgres` (banco de desenvolvimento).**

### 4. Nomes reais de volumes

No Compose os volumes se chamam `celilac_postgres_data` e `celilac_postgres_test_data`. No Docker eles recebem o prefixo do projeto (`celilac-backend_...`). Confirme com `docker volume ls`: podem existir volumes de outros nomes de projeto na máquina.

### 5. `localhost` dentro do contêiner

Dentro do contêiner da API, `localhost` é o próprio contêiner, não o banco. O Compose define `DB_HOST=postgres` e `DB_PORT=5432` para o serviço `api`. O `.env` com `DB_HOST=127.0.0.1` vale para quem executa a API no host e é sobrescrito pela chave `environment` do Compose.

### 6. Comandos que nunca devem ser usados na verificação

- `docker compose down -v` (apaga os volumes e os dados);
- `migration:revert` automático;
- `synchronize: true`;
- qualquer operação destrutiva contra `celilac_db`.

Para parar sem perder dados: `docker compose stop` ou `docker compose down` (sem `-v`).

---

## 9. Distinções que o aluno deve conseguir explicar

- **Imagem construída ≠ API funcional.** Só a requisição HTTP e a consulta SQL comprovam o funcionamento.
- **Contêiner ativo ≠ aplicação pronta.** Leia os logs.
- **Banco disponível ≠ esquema atualizado.** O healthcheck não garante migrations aplicadas.
- **Testes aprovados ≠ ambiente Docker validado.** Cada nível de verificação dá um tipo diferente de evidência.
- **Porta interna ≠ porta publicada.** A API usa `postgres:5432` na rede do Compose; o host usa 5432 (desenvolvimento) e 5435 (testes).
