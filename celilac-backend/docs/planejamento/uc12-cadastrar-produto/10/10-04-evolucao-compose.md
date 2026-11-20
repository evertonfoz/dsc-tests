# ARTEFATO 10-04 — EVOLUÇÃO E VALIDAÇÃO DO DOCKER COMPOSE

## 1. Contexto e Objetivos

O objetivo desta fase é integrar o serviço da API NestJS ao ecossistema existente gerenciado pelo Docker Compose (`compose.yaml`), assegurando que:
1. Os serviços do PostgreSQL de desenvolvimento (`postgres`) e de testes (`postgres_test`) sejam preservados intactos, com seus dados e volumes históricos mantidos.
2. A API dependa do estado de saúde do banco de desenvolvimento (`condition: service_healthy`).
3. O nome do projeto (`COMPOSE_PROJECT_NAME`) seja estabelecido de forma determinística para evitar duplicidade de volumes ou redes.

---

## 2. Conteúdo Consolidado do `compose.yaml`

O arquivo `compose.yaml` foi atualizado de forma não destrutiva, mantendo as configurações estabelecidas no Material 09 e incorporando o serviço `api`:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: celilac-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: celilac_user
      POSTGRES_PASSWORD: celilac_dev_password
      POSTGRES_DB: celilac_db
    ports:
      - "5432:5432"
    volumes:
      - celilac_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U celilac_user -d celilac_db"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    container_name: celilac-api
    restart: unless-stopped
    build:
      context: .
      dockerfile: Dockerfile
    image: celilac-api:dev
    ports:
      - "${PORT:-3200}:3200"
    environment:
      PORT: 3200
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME:-celilac_user}
      DB_PASSWORD: ${DB_PASSWORD:-celilac_dev_password}
      DB_NAME: ${DB_NAME:-celilac_db}
    depends_on:
      postgres:
        condition: service_healthy

  postgres_test:
    image: postgres:17
    container_name: celilac-postgres-test
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${TEST_DB_USERNAME:-celilac_test}
      POSTGRES_PASSWORD: ${TEST_DB_PASSWORD:-celilac_test_password}
      POSTGRES_DB: ${TEST_DB_NAME:-celilac_test}
    ports:
      - "${TEST_DB_PORT:-5435}:5432"
    volumes:
      - celilac_postgres_test_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  celilac_postgres_data:
  celilac_postgres_test_data:
```

---

## 3. Análise Arquitetural do Serviço `api`

- **Build Context:** Aponta para a raiz do projeto (`.`) usando o `Dockerfile` multi-stage.
- **Porta:** Publica a porta `3200` no host, mapeando para a porta interna `3200` onde o NestJS escuta.
- **Resolução de Rede:** `DB_HOST: postgres` aponta diretamente para o nome do serviço PostgreSQL na rede padrão bridge criada pelo Compose. A porta interna utilizada é a padrão do PostgreSQL (`5432`), não dependendo da porta mapeada no host.
- **Dependência de Inicialização:** `depends_on` com `condition: service_healthy` garante que a API só inicialize após o PostgreSQL responder positivamente ao `pg_isready`.
- **Preservação de Volumes:** Os volumes `celilac_postgres_data` e `celilac_postgres_test_data` foram preservados sem qualquer exclusão ou comando destrutivo.

---

## 4. Nome do Projeto Compose (`COMPOSE_PROJECT_NAME`)

Para assegurar consistência e evitar que volumes ou redes recebam prefixos aleatórios com base no nome do diretório corrente, a variável `COMPOSE_PROJECT_NAME` foi configurada:
- No `.env`: `COMPOSE_PROJECT_NAME=celilac-backend`
- No `.env.example`: documentada como `COMPOSE_PROJECT_NAME=`

Comprovado pela inspeção dos volumes do Docker:
```bash
$ docker volume ls | grep celilac
local     celilac-backend_celilac_postgres_data
local     celilac-backend_celilac_postgres_test_data
```

---

## 5. Validação Sintática do Compose

A integridade do arquivo foi validada com a flag `--quiet` para prevenir a impressão inadvertida de senhas interpoladas no terminal:

```bash
$ docker compose config --quiet && echo OK
OK
```

O comando retornou código de saída `0`, confirmando que a sintaxe YAML e as interpolações estão estritamente válidas.
