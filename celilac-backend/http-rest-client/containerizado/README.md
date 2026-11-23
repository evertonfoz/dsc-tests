# Coleção HTTP e Verificação Automatizada em Ambiente Containerizado

## 1. Título e Finalidade
Esta pasta reúne a suíte de requisições HTTP e o script de verificação automatizada voltados à validação da API CeliLac operando em ambiente containerizado com Docker Compose. 

Como a API publica sua porta no host (`http://localhost:3200`), as requisições e o script funcionam de forma idêntica tanto para a API rodando em contêiner quanto para a API executando localmente fora do Docker.

---

## 2. Pré-requisitos
Antes de executar as requisições ou o script, certifique-se de que a stack containerizada esteja ativa e saudável:

```bash
# Subir a API e o banco de desenvolvimento
docker compose up -d --build api

# Conferir o estado dos serviços (API em Up e banco postgres em Up (healthy))
docker compose ps
```

As checagens do UC13 leem a coluna `deletedAt`: a migration `AddDeletedAtToProducts` precisa estar aplicada no banco de desenvolvimento antes de rodar o `run-checks.sh` (o script só lê e não aplica migrations; ver `pnpm migration:show:prod`).

---

## 3. Conteúdo da Pasta

| Arquivo | Papel e Uso |
|---|---|
| `00-smoke.http` | Testes de sanidade da API (`GET /` retornando 200 e rota inexistente retornando 404). |
| `01-products-cadastrar-produto.http` | Cenários do caso de uso principal `UC12 — Cadastrar Produto`, com encadeamento de identificador via `# @name`. |
| `03-products-listar-produtos.http` | Cenários do caso de uso `UC13 — Listar Produtos` (`GET /products`): listagem padrão, `page` e `limit`, página além do fim, parâmetros inválidos (`400`) e rota inexistente (`404`). Somente leitura. |
| `04-products-buscar-produto.http` | Cenários do caso de uso `UC14 — Buscar Produto por Identificador` (`GET /products/:productId`): produto existente, UUID sem produto (`404`), identificador inválido (`400`) e rota inexistente. Somente leitura. |
| `02-orders-fronteira.http` | Cenários de fronteira HTTP do recurso de apoio `orders` sem dependência de dados (Grupo A). |
| `run-checks.sh` | Script bash automatizado com asserções, contadores `pass`/`fail` e código de saída semântico. |
| `README.md` | Este guia de referência operacional e segurança. |

---

## 4. Aviso Sobre os Arquivos `.http`
Os arquivos `.http` são destinados ao uso com a extensão **REST Client** (Huachao Mao) no VS Code ou VSCodium.
* **Inspeção manual:** Os arquivos `.http` **não realizam asserções automáticas**. O desenvolvedor deve comparar visualmente o código e o corpo da resposta com o resultado esperado indicado no título de cada requisição.
* **Encadeamento de resposta:** No arquivo `01-products-cadastrar-produto.http`, a diretiva `# @name criarProduto` permite capturar o identificador retornado na resposta através da variável `@produtoId = {{criarProduto.response.body.productId}}`.

---

## 5. Verificação Automatizada (`run-checks.sh`)
Para executar verificações determinísticas com validação programática de códigos HTTP e integridade de persistência, utilize o script `run-checks.sh`:

```bash
# Execução padrão (smoke, migrations, contratos do UC12, apoio e persistência SQL)
./http-rest-client/containerizado/run-checks.sh

# Execução completa com teste de durabilidade (reinicia somente a API e valida integridade)
./http-rest-client/containerizado/run-checks.sh --durability

# Execução apontando para outra porta ou host
BASE_URL="http://localhost:3200" ./http-rest-client/containerizado/run-checks.sh
```

### O que o script confere
1. **Saúde dos Contêineres:** API em `Up` e banco `postgres` com status `healthy`.
2. **Smoke:** `GET /` devolve `200` e `GET /not-found-route` devolve `404`.
3. **Migrações:** Execução de `typeorm migration:show` esperando `0` migrações pendentes (somente leitura).
4. **Contrato do Caso de Uso (`POST /products`):** Rejeição com `400` para nome vazio, ausente e tipo inválido; sucesso com `201` retornando `productId` e `name`; e descarte de campos extras (`whitelist`).
5. **Contrato do UC13 (`GET /products`):** `200` com `items`, `page`, `limit` e `total`; itens só com `productId` e `name`; limite padrão `20`; `400` para `limit=101`, `page=0` e `limit` não numérico; e `total` igual à contagem de produtos ativos (`deletedAt IS NULL`) no banco.
6. **Contrato do UC14 (`GET /products/:productId`):** `200` com somente `productId` e `name` para o produto cadastrado na própria execução; `404` com `ProductNotFoundException` para UUID sem produto; `400` com `message` em lista para identificador que não é UUID; e `404` para sub-rota inexistente. Somente leitura (reaproveita o produto criado pelo `POST`).
7. **Recurso de Apoio (`POST /orders/:id/confirm`):** Rejeição com `400` para ID malformado e `404` para UUID inexistente.
8. **Persistência no PostgreSQL:** Confere via `psql` no contêiner se o produto cadastrado foi gravado na tabela `products.products`.
9. **Durabilidade (flag `--durability`):** Reinicia **apenas** o contêiner da API (`docker compose restart api`), aguarda a reconexão (health check em polling de até 30s) e comprova que o registro continua intacto no banco de dados.

### Código de Saída
* `0`: Todas as asserções foram aprovadas (`0 falha(s)`).
* `1`: Ao menos uma asserção falhou.

---

## 6. O Que o Script Grava e Políticas de Segurança
* **Volume de Escrita:** Cada execução do script realiza no máximo **dois `POST /products` bem-sucedidos** na base de dados de desenvolvimento (`celilac_db`).
* **Operações Proibidas e Não Realizadas:**
  * **NÃO** remove contêineres, redes ou volumes (`docker compose down` e `down -v` são estritamente proibidos).
  * **NÃO** executa `docker volume rm` ou comandos de `prune`.
  * **NÃO** executa migrações destrutivas (`migration:run`, `migration:revert` ou `schema:drop`).
  * **NÃO** reinicia nem apaga o contêiner do banco de dados (`celilac-postgres`).
  * **NÃO** afeta o banco de testes isolado (`celilac_test`).

---

## 7. Consulta SQL Manual e Prova de Durabilidade
Para auditar manualmente a persistência e durabilidade de um produto cadastrado via REST Client (capturado na variável `@produtoId`), utilize as variáveis do contêiner (`$POSTGRES_USER` e `$POSTGRES_DB`) sem expor credenciais:

```bash
# 1. Consultar o registro do produto criado
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT \"productId\", name FROM products.products WHERE \"productId\" = '\''<ID_DO_PRODUTO>'\''"'

# 2. Reiniciar SOMENTE a API (simulando falha de processo ou novo deploy)
docker compose restart api

# 3. Consultar novamente o banco para comprovar a durabilidade do dado
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT \"productId\", name FROM products.products WHERE \"productId\" = '\''<ID_DO_PRODUTO>'\''"'
```

O registro retornado antes e após o restart deve ser rigorosamente idêntico.

---

## 8. Fora Desta Pasta e Relação com os Testes Automatizados
* **Cenários Dependentes de Seed (Grupo B):** Não estão presentes no `run-checks.sh` porque o projeto CeliLac não possui script determinístico de seed no repositório. Cenários dependentes de dados prévios são classificados como *Não foi possível verificar*, evitando o uso de identificadores artificiais.
* **Testes Automatizados vs. Verificação em Execução:** Esta coleção e o script `run-checks.sh` verificam a aplicação em tempo de execução real na fronteira HTTP e banco. Eles complementam, mas **não substituem** as suítes de testes automatizados unitários, de integração e de persistência (`pnpm test` e `pnpm test:integration`).
* **Aviso de Segurança para Testes E2E:** A suíte E2E existente (`test/orders/confirm-order.e2e-spec.ts`) conecta-se à base de desenvolvimento configurada no `.env` e realiza operações de escrita/remoção. **Não execute a suíte E2E contra o banco de desenvolvimento** sem assegurar o isolamento de base.
