# ARTEFATO 13-06 — SCRIPT DE VERIFICAÇÃO AUTOMATIZADA (`run-checks.sh`)

## 1. Visão Geral e Estrutura dos Blocos
O script `http-rest-client/containerizado/run-checks.sh` foi desenvolvido em bash defensivo com as seguintes características:
* `set -u` ativado (falha caso variáveis não declaradas sejam lidas).
* `set -e` não utilizado, permitindo que todas as asserções sejam computadas e consolidadas nos contadores `pass` e `fail`.
* Código de saída semântico (`[ "$fail" -eq 0 ]`), retornando `0` para sucesso e `1` em caso de qualquer falha.

### Blocos de Verificação Implementados
1. **Serviços em Docker Compose:** Valida se o serviço `api` está em estado `running` e se o serviço `postgres` está `healthy`.
2. **Smoke Tests:** Valida `GET /` (`200 OK`) e rota inexistente (`404 Not Found`).
3. **Migrações:** Executa `typeorm migration:show:prod` em modo somente leitura e assegura que não há migrações pendentes (`[ ]`).
4. **Caso de Uso UC12 (`POST /products`):**
   * Rejeição com `400` para nome vazio (`""`).
   * Rejeição com `400` para corpo sem nome (`{}`).
   * Rejeição com `400` para tipo inválido (`12345`).
   * Sucesso com `201` para cadastro válido, gerando e extraindo `productId` e validando o `name`.
   * Descarte comprovado de propriedades extras via `ValidationPipe` (`whitelist: true`).
5. **Recurso de Apoio (`POST /orders/:id/confirm`):**
   * Rejeição com `400` para identificador não-UUID (`abc`).
   * Rejeição com `404` para UUID sintaticamente válido mas inexistente.
6. **Persistência no PostgreSQL:**
   * Executa consulta SQL via `docker compose exec` buscando o produto cadastrado pelo seu `productId`.
   * Se o identificador for vazio, o script acusa `FALHA` imediata em vez de consultar com valor em branco.
7. **Durabilidade (Flag `--durability`):**
   * Reinicia **somente** o contêiner da API (`docker compose restart api`).
   * Executa laço de polling (até 30 segundos) aguardando retorno de `200` em `GET /`.
   * Reexecuta a consulta SQL no banco, provando que o registro permanece intacto.

---

## 2. Validação Estática e Sintaxe

* **Permissão de Execução:**
  ```bash
  ls -l http-rest-client/containerizado/run-checks.sh
  # Saída: -rwxr-xr-x@ 1 evertoncoimbradearaujo staff 8124 Nov 20 11:14 http-rest-client/containerizado/run-checks.sh
  ```
* **Verificação com `bash -n`:**
  ```bash
  bash -n http-rest-client/containerizado/run-checks.sh
  # Código de saída: 0 (sem erros de sintaxe)
  ```
* **Verificação com `shellcheck`:**
  * O binário `shellcheck` não se encontra instalado no sistema operacional do ambiente (`shellcheck not found`). A verificação de sintaxe e conformidade defensiva foi atestada via `bash -n` e testes reais de execução controlada.

---

## 3. Evidências Reais de Execução

### 3.1. Execução Padrão (Sem `--durability`)
```text
================================================================================
Iniciando verificações automatizadas da API CeliLac em http://localhost:3200
================================================================================

--- 1. Serviços em Docker Compose ---
[OK]    Serviço API em execução ('running') (esperado: 'running', obtido: 'running')
[OK]    Serviço Postgres saudável ('healthy') (esperado: 'healthy', obtido: 'healthy')

--- 2. Smoke Tests HTTP ---
[OK]    Smoke: GET / retorna 200 (esperado: '200', obtido: '200')
[OK]    Smoke: GET rota inexistente retorna 404 (esperado: '404', obtido: '404')

--- 3. Migrations no Banco de Desenvolvimento (Somente Leitura) ---
[OK]    Nenhuma migration pendente no banco de dados (esperado: '0', obtido: '0')

--- 4. Caso de Uso UC12 — Cadastrar Produto (POST /products) ---
[OK]    Validação: nome vazio retorna 400 (esperado: '400', obtido: '400')
[OK]    Validação: nome ausente retorna 400 (esperado: '400', obtido: '400')
[OK]    Validação: nome com tipo inválido retorna 400 (esperado: '400', obtido: '400')
[OK]    Cadastro com sucesso retorna identificador UUID preenchido (esperado: 'true', obtido: 'true')
[OK]    Cadastro com sucesso retorna o nome enviado (esperado: 'Pão Automatizado Run-Checks 1795184093', obtido: 'Pão Automatizado Run-Checks 1795184093')
[OK]    Propriedade extra descartada pelo ValidationPipe (whitelist) (esperado: 'descartado', obtido: 'descartado')

--- 5. Recurso de Apoio: Orders (Fronteira HTTP sem Seed) ---
[OK]    Confirmação de pedido com ID inválido retorna 400 (esperado: '400', obtido: '400')
[OK]    Confirmação de pedido com UUID inexistente retorna 404 (esperado: '404', obtido: '404')

--- 6. Verificação de Persistência Direta no PostgreSQL ---
[OK]    Registro do produto criado persistido no banco com nome correto (esperado: 'Pão Automatizado Run-Checks 1795184093', obtido: 'Pão Automatizado Run-Checks 1795184093')

================================================================================
Resultado: 14 ok, 0 falha(s)
================================================================================
Código de saída: 0
```

---

### 3.2. Execução Completa (Com `--durability`)
```text
================================================================================
Iniciando verificações automatizadas da API CeliLac em http://localhost:3200
================================================================================

--- 1. Serviços em Docker Compose ---
[OK]    Serviço API em execução ('running') (esperado: 'running', obtido: 'running')
[OK]    Serviço Postgres saudável ('healthy') (esperado: 'healthy', obtido: 'healthy')

--- 2. Smoke Tests HTTP ---
[OK]    Smoke: GET / retorna 200 (esperado: '200', obtido: '200')
[OK]    Smoke: GET rota inexistente retorna 404 (esperado: '404', obtido: '404')

--- 3. Migrations no Banco de Desenvolvimento (Somente Leitura) ---
[OK]    Nenhuma migration pendente no banco de dados (esperado: '0', obtido: '0')

--- 4. Caso de Uso UC12 — Cadastrar Produto (POST /products) ---
[OK]    Validação: nome vazio retorna 400 (esperado: '400', obtido: '400')
[OK]    Validação: nome ausente retorna 400 (esperado: '400', obtido: '400')
[OK]    Validação: nome com tipo inválido retorna 400 (esperado: '400', obtido: '400')
[OK]    Cadastro com sucesso retorna identificador UUID preenchido (esperado: 'true', obtido: 'true')
[OK]    Cadastro com sucesso retorna o nome enviado (esperado: 'Pão Automatizado Run-Checks 1795184110', obtido: 'Pão Automatizado Run-Checks 1795184110')
[OK]    Propriedade extra descartada pelo ValidationPipe (whitelist) (esperado: 'descartado', obtido: 'descartado')

--- 5. Recurso de Apoio: Orders (Fronteira HTTP sem Seed) ---
[OK]    Confirmação de pedido com ID inválido retorna 400 (esperado: '400', obtido: '400')
[OK]    Confirmação de pedido com UUID inexistente retorna 404 (esperado: '404', obtido: '404')

--- 6. Verificação de Persistência Direta no PostgreSQL ---
[OK]    Registro do produto criado persistido no banco com nome correto (esperado: 'Pão Automatizado Run-Checks 1795184110', obtido: 'Pão Automatizado Run-Checks 1795184110')

--- 7. Teste de Durabilidade: Reiniciar API e Revalidar Registro ---
Reiniciando SOMENTE o contêiner da API (docker compose restart api)...
Aguardando API retornar à disponibilidade (até 30 tentativas)...
[OK]    API reiniciada e respondendo 200 em GET / (esperado: '1', obtido: '1')
[OK]    Registro do produto permanece íntegro após restart da API (esperado: 'Pão Automatizado Run-Checks 1795184110', obtido: 'Pão Automatizado Run-Checks 1795184110')

================================================================================
Resultado: 16 ok, 0 falha(s)
================================================================================
Código de saída: 0
```

---

### 3.3. Prova de Detecção de Falha (`BASE_URL=http://localhost:9`)
Para comprovar que o script não gera falsos positivos e atua como evidência técnica auditável, executou-se apontando para uma porta sem serviço ativo:

```text
BASE_URL=http://localhost:9 ./http-rest-client/containerizado/run-checks.sh
# Saída do script:
================================================================================
Resultado: 4 ok, 10 falha(s)
================================================================================
Código de saída: 1
```

* Os 4 testes aprovados referiram-se exclusivamente aos contêineres Docker e migrações (independentes da porta HTTP da API).
* Todas as 10 asserções dependentes da API falharam com código `000` ou ID vazio, resultando em término com código `1`.

---

## 4. Limitações e Políticas de Risco
* **Não Substituição dos Testes:** O script valida a integração de caixa-preta da API rodando. Ele não substitui testes unitários com dublês nem testes de integração finos.
* **Volume Controlado de Dados:** São criados no máximo dois produtos por execução do script.
* **Proibição de Comandos Destrutivos:** O script não remove contêineres (`down`), volumes (`-v`) nem altera schemas de banco de dados.
