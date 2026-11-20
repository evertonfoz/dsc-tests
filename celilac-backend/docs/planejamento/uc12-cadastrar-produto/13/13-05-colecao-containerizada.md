# ARTEFATO 13-05 — COLEÇÃO CONTAINERIZADA E DOCUMENTAÇÃO OPERACIONAL

## 1. Visão Geral da Pasta `http-rest-client/containerizado/`
A pasta `http-rest-client/containerizado/` agrupa a documentação operacional e a suíte de validação voltada para a execução da aplicação em contêineres Docker Compose:

```text
http-rest-client/containerizado/
├── README.md
├── 00-smoke.http
├── 01-products-cadastrar-produto.http
├── 02-orders-fronteira.http
└── run-checks.sh
```

---

## 2. Conteúdo e Papel dos Arquivos

### 2.1. `00-smoke.http`
Contém requisições imediatas de sanidade:
* `GET {{baseUrl}}/`: retorna `200 OK` comprovando que a camada de roteamento e bootstrap da API estão operantes.
* `GET {{baseUrl}}/rota-inexistente...`: retorna `404 Not Found` comprovando o tratamento nativo do NestJS para rotas inexistentes.

### 2.2. `01-products-cadastrar-produto.http`
Cobre o caso de uso `UC12 — Cadastrar Produto` com a particularidade do encadeamento do identificador gerado:
* Usa a diretiva `# @name criarProduto` no cenário de cadastro válido.
* Extrai o identificador via `@produtoId = {{criarProduto.response.body.productId}}`.
* Permite ao desenvolvedor copiar e colar o `@produtoId` diretamente na consulta SQL no contêiner do PostgreSQL.

### 2.3. `02-orders-fronteira.http`
Valida o comportamento de fronteira do recurso de apoio `orders`:
* Identificador malformado rejeitado com `400 Bad Request` pelo `ParseUUIDPipe`.
* Identificador UUID inexistente devolvendo `404 Not Found` via filtro global de exceções.

### 2.4. `README.md`
Manual de referência contendo rigorosamente as 8 seções obrigatórias:
1. Título e finalidade.
2. Pré-requisitos (`docker compose up -d --build api` e `docker compose ps`).
3. Tabela de conteúdo e uso dos arquivos.
4. Aviso de ausência de asserções nos arquivos `.http`.
5. Guia de execução do `run-checks.sh` (com e sem `--durability`).
6. Declaração do que o script grava e proibição estrita de ações destrutivas.
7. Comandos de consulta SQL manual e prova de durabilidade com restart da API.
8. Delimitação fora da pasta (cenários com seed e segurança de testes E2E).

---

## 3. Comprovação da Consulta SQL Manual e Durabilidade

### 3.1. Consulta Manual Realizada
Ao executar a requisição `POST /products` com payload `{"name": "Bolo de Milho Sem Glúten e Sem Lactose"}`, a API retornou o UUID `b12fd567-542e-4bca-8eb1-7e3c1532f741`.

Executou-se a consulta SQL direta no contêiner via:
```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT \"productId\", name FROM products.products WHERE \"productId\" = '\''b12fd567-542e-4bca-8eb1-7e3c1532f741'\'';"'
```

### 3.2. Prova de Durabilidade (Restart da API)
1. **Antes do Restart:** Registro presente com nome `Bolo de Milho Sem Glúten e Sem Lactose`.
2. **Restart:** Executou-se `docker compose restart api`.
3. **Após o Restart:** A mesma consulta SQL retornou exatamente o mesmo registro, comprovando que o ciclo de vida dos dados persiste no volume gerenciado `celilac_postgres_data`, desacoplado do ciclo de vida dos contêineres de aplicação.

---

## 4. Diretrizes de Segurança Aplicadas
* **Sem Credenciais Hardcoded:** Todas as consultas no contêiner utilizam variáveis de ambiente (`$POSTGRES_USER` e `$POSTGRES_DB`).
* **Proteção de Volumes:** Nenhuma instrução utiliza `down -v`, `volume rm` ou `prune`.
* **Isolamento de Bancos:** O banco de testes (`celilac_test`, porta 5435) não é tocado pela coleção.
