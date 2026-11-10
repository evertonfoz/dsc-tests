# ARTEFATO 10-04 — EVOLUÇÃO DO `compose.yaml` COM INCLUSÃO DO SERVIÇO `api`

## 1. Configuração Anterior vs. Evolução Implementada

### 1.1 Estado Anterior do `compose.yaml` (Material 09)
No Material 09, o arquivo `compose.yaml` definia dois serviços de banco de dados PostgreSQL 17:
- **`postgres`** (`container_name: celilac-postgres`, porta `5432:5432`, banco `celilac_db`, usuário `celilac_user`, volume `celilac_postgres_data`, healthcheck via `pg_isready -U celilac_user -d celilac_db`).
- **`postgres_test`** (`container_name: celilac-postgres-test`, porta `${TEST_DB_PORT:-5435}:5432`, banco `celilac_test`, usuário `celilac_test`, volume `celilac_postgres_test_data`, healthcheck via `pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}`).

### 1.2 Alterações Realizadas (Preservação Integral + Adição do Serviço `api`)
Sem remover nem simplificar nenhuma linha dos serviços `postgres`, `postgres_test` ou da seção `volumes:`, foi adicionado o serviço `api` dentro de `services:`.

---

## 2. Arquivo `compose.yaml` Completo Resultante

```yaml
services:
  postgres:
    image: postgres:17
    container_name: celilac-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: celilac_user
      POSTGRES_PASSWORD: <DEFINIR_LOCALMENTE>
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

  postgres_test:
    image: postgres:17
    container_name: celilac-postgres-test
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${TEST_DB_USERNAME:-celilac_test}
      POSTGRES_PASSWORD: ${TEST_DB_PASSWORD:-<DEFINIR_LOCALMENTE_DIFERENTE_DO_DEV>}
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

  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: celilac-api:dev
    container_name: celilac-api
    restart: unless-stopped
    ports:
      - "${PORT:-3200}:3200"
    environment:
      PORT: 3200
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  celilac_postgres_data:
  celilac_postgres_test_data:
```

---

## 3. Detalhamento Técnico dos Serviços, Portas, Volumes, Healthchecks e Redes

| Parâmetro | Serviço `postgres` (Preservado) | Serviço `postgres_test` (Preservado) | Novo Serviço `api` (Adicionado) |
| :--- | :--- | :--- | :--- |
| **Contêiner (`container_name`)** | `celilac-postgres` | `celilac-postgres-test` | `celilac-api` |
| **Imagem / Build** | `postgres:17` | `postgres:17` | `celilac-api:dev` (`build: context: ., dockerfile: Dockerfile`) |
| **Mapeamento de Portas (`host:container`)** | `5432:5432` | `${TEST_DB_PORT:-5435}:5432` (`5435:5432`) | `${PORT:-3200}:3200` (`3200:3200`) |
| **Volume Persistente** | `celilac_postgres_data` | `celilac_postgres_test_data` | Sem volume de dados (stateless; código compilado em `/app/dist`) |
| **Healthcheck / Ordem de Subida** | `pg_isready -U celilac_user -d celilac_db` | `pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}` | `depends_on: postgres: condition: service_healthy` |
| **Rede Compose (`celilac-backend_default`)** | Conectado (`DNS alias: postgres`) | Isolado para testes | Conectado à mesma rede de `postgres` |

### 3.1 Alinhamento do Projeto Compose (`COMPOSE_PROJECT_NAME=celilac-backend`)
A inspeção dos rótulos (`com.docker.compose.project`) do contêiner `celilac-postgres` (`544f5f92d334`, ativo há 13 dias) identificou que ele foi criado originalmente sob o projeto Compose `celilac-backend`, utilizando a rede `celilac-backend_default` e o volume `celilac-backend_celilac_postgres_data`. Definindo `COMPOSE_PROJECT_NAME=celilac-backend` no `.env` local (não versionado):
1. O Docker Compose reconhece nativamente o contêiner `celilac-postgres` existente como o serviço `postgres` saudável (`Up 13 days (healthy)`), **sem recriá-lo e sem tocar no volume `celilac-backend_celilac_postgres_data`**.
2. O serviço `api` é conectado automaticamente à mesma rede bridge `celilac-backend_default`, resolvendo `DB_HOST=postgres` diretamente para `celilac-postgres`.

---

## 4. Validação Sintática e de Interpolação do Compose

- **Comandos executados:**
  ```bash
  docker compose config --quiet && docker compose config --services
  ```
- **Resultado real observado:**
  ```text
  postgres
  api
  postgres_test
  ```
  (Código de saída `0` em `docker compose config --quiet`, confirmando sintaxe YAML válida e interpolação correta das variáveis `${DB_USERNAME}`, `${DB_PASSWORD}`, `${DB_NAME}` e `${PORT:-3200}` a partir do `.env` local, sem expor credenciais no terminal).

---

## 5. Pendências

- Verificar a resolução de rede entre contêineres (Fase 6 — Artefato `10-05`), inspecionar o histórico de migrations compiladas (Fase 7 — Artefato `10-06`) e inicializar o serviço `api` (Fase 8).

