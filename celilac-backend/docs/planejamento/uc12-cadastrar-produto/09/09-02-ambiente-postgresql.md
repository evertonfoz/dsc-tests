# ARTEFATO 09-02 — PREPARAÇÃO E ISOLAMENTO DO AMBIENTE POSTGRESQL (DESENVOLVIMENTO E TESTES)

## 1. Inspeção da Infraestrutura Existente

Antes de qualquer alteração em `compose.yaml` ou `.env`, foi realizada a inspeção completa dos contêineres, portas publicadas, volumes e variáveis de ambiente existentes no host:

| Elemento Inspecionado | Estado Original Encontrado | Observação Técnica |
| :--- | :--- | :--- |
| **`compose.yaml` (Original)** | Definia apenas o serviço `postgres` (`postgres:17`, `container_name: celilac-postgres`, porta `5432:5432`, volume `celilac_postgres_data`, banco `celilac_db`, usuário `celilac_user`). | Atende integralmente ao banco de **desenvolvimento**, mas não possuía serviço dedicado para o banco de **testes**. |
| **Contêiner `celilac-postgres`** | Ativo e saudável (`544f5f92d334`, `Up 13 days (healthy)`), mapeado em `0.0.0.0:5432->5432/tcp`, montando o volume `celilac-backend_celilac_postgres_data`. | Contém o schema `orders` (`orders.orders` com 1 registro) e `public.infraestrutura_check` (1 registro). Deve ser **integralmente preservado**. |
| **Porta `5434` no Host (`docker ps -a`)** | **Ocupada** pelo contêiner externo `classhero-postgres` (`cb1743af87f2`, `postgres:17-alpine`, `0.0.0.0:5434->5432/tcp`). | O exemplo ilustrativo do material didático (`5434:5432`) colidiria com `classhero-postgres` ou conectaria os testes do CeliLac ao banco de outro sistema. |
| **Arquivo `.env` (Original)** | Definia `DB_HOST=127.0.0.1`, `DB_PORT=5432`, `DB_USERNAME=celilac_user`, `DB_PASSWORD=[PROTEGIDO]` e `DB_NAME=celilac_db`. | Preservado sem sobrescrever as variáveis de desenvolvimento. |

---

## 2. Alterações Realizadas para Isolamento entre Desenvolvimento e Testes

Para garantir isolamento físico completo entre o banco de desenvolvimento (`celilac_db`) e o banco de testes automatizados (`celilac_test`), sem tocar no contêiner `celilac-postgres` (`5432`) nem no contêiner externo `classhero-postgres` (`5434`), foi adicionado o serviço exclusivo `postgres_test` na porta livre **`5435`** do host (`5435:5432`).

### 2.1 Configuração Consolidada do `compose.yaml` (Bloco Único e Sintaticamente Válido)

Em conformidade com as restrições do Material 09 (sem blocos YAML duplicados e preservando integralmente o serviço `postgres` existente):

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

volumes:
  celilac_postgres_data:
  celilac_postgres_test_data:
```

### 2.2 Comparação dos Serviços, Portas, Bancos e Volumes

| Parâmetro | Ambiente de Desenvolvimento (`postgres`) | Ambiente Exclusivo de Testes (`postgres_test`) |
| :--- | :--- | :--- |
| **Nome do Contêiner** | `celilac-postgres` (`544f5f92d334`) | `celilac-postgres-test` (`77e722626685`) |
| **Imagem Docker** | `postgres:17` | `postgres:17` |
| **Mapeamento de Porta (`host:container`)** | `5432:5432` | **`5435:5432`** (`${TEST_DB_PORT:-5435}:5432`) |
| **Porta Publicada no Host** | `5432` | `5435` |
| **Porta Interna no Contêiner (`inet_server_port()`)** | `5432` | `5432` |
| **Banco de Dados (`POSTGRES_DB`)** | `celilac_db` | `celilac_test` |
| **Usuário (`POSTGRES_USER`)** | `celilac_user` | `celilac_test` |
| **Credenciais (`POSTGRES_PASSWORD`)** | `[PROTEGIDO — DEV]` | `[PROTEGIDO — EXCLUSIVO DE TESTE, DISTINTO DO DEV]` |
| **Volume Docker** | `celilac-backend_celilac_postgres_data` (preservado) | `celillac-backend-prepare_celilac_postgres_test_data` |

### 2.3 Distinção Técnica sobre Portas Docker (`Host Port` vs. `inet_server_port()`)

No mapeamento `"${TEST_DB_PORT:-5435}:5432"` (ou no exemplo ilustrativo `5434:5432` do material):
- **Porta publicada no host (`5435`):** É a porta TCP na qual o Docker Desktop/Engine escuta na máquina hospedeira (`127.0.0.1:5435`). Quando os testes Vitest rodam no host, o cliente `pg`/TypeORM conecta-se a `127.0.0.1:5435`.
- **Porta interna do contêiner (`5432`):** O NAT do Docker encaminha os pacotes da porta `5435` do host para a porta `5432` dentro do namespace de rede do contêiner `celilac-postgres-test`, onde o processo `postgres` escuta por padrão.
- **Consequência para verificações SQL:** A função `SELECT inet_server_port();` executada no PostgreSQL retorna a porta local vista pelo processo servidor dentro do contêiner (**`5432`**) — ou `NULL` quando conectado via socket Unix local — e **não** a porta publicada no host (`5435`). Portanto, jamais se deve exigir `inet_server_port() === Number(TEST_DB_PORT)` quando há redirecionamento de portas Docker; a verificação correta combina a confirmação dos parâmetros do `DataSource.options` no cliente (`host`, `port: 5435`) com a consulta `SELECT current_database(), current_user, inet_server_port()` no servidor (`celilac_test`, `celilac_test`, `5432`).

---

## 3. Variáveis de Ambiente Configuradas (`.env` e `.env.example`)

As variáveis de desenvolvimento existentes em `.env` foram mantidas intactas e as variáveis de teste foram adicionadas ao final do arquivo (com valores reais protegidos localmente e template documentado em `.env.example`):

```dotenv
# Banco de Desenvolvimento (preservado)
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=celilac_user
DB_PASSWORD=<DEFINIR_LOCALMENTE>
DB_NAME=celilac_db

# Banco Exclusivo de Testes (adicionado)
TEST_DB_HOST=127.0.0.1
TEST_DB_PORT=5435
TEST_DB_USERNAME=celilac_test
TEST_DB_PASSWORD=<DEFINIR_LOCALMENTE_DIFERENTE_DO_DEV>
TEST_DB_NAME=celilac_test
TEST_DB_ALLOW_DESTRUCTIVE=true
```

---

## 4. Comandos Executados e Evidências Reais de Conexão

### 4.1 Inicialização Seletiva do Serviço de Testes
Para não reiniciar nem interferir no contêiner `celilac-postgres` existente, foi iniciado exclusivamente o serviço `postgres_test`:
- **Comando executado:**
  ```bash
  docker compose up -d postgres_test
  ```
- **Saída real observada:**
  ```text
  [+] up 3/3
   ✔ Network celillac-backend-prepare_default                   Created       0.0s
   ✔ Volume celillac-backend-prepare_celilac_postgres_test_data Created       0.0s
   ✔ Container celilac-postgres-test                            Started       0.2s
  ```

### 4.2 Verificação dos Contêineres Ativos e Saudáveis
- **Comando executado:**
  ```bash
  docker ps --filter "name=celilac-postgres"
  ```
- **Saída real observada:**
  ```text
  CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                    PORTS                                         NAMES
  77e722626685   postgres:17   "docker-entrypoint.s…"   16 seconds ago   Up 14 seconds (healthy)   0.0.0.0:5435->5432/tcp, [::]:5435->5432/tcp   celilac-postgres-test
  544f5f92d334   postgres:17   "docker-entrypoint.s…"   13 days ago      Up 13 days (healthy)      0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   celilac-postgres
  ```

### 4.3 Verificação de Identidade de Conexão nos Dois Bancos
1. **Banco de Desenvolvimento (`celilac-postgres`):**
   - **Comando:**
     ```bash
     docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT current_database() AS name, current_user AS usuario, inet_server_port() AS porta;"
     ```
   - **Resultado:**
     ```text
         name    |   usuario    | porta 
     ------------+--------------+-------
      celilac_db | celilac_user |      
     (1 row)
     ```
2. **Banco Exclusivo de Testes via TCP (`celilac-postgres-test`):**
   - **Comando:**
     ```bash
     docker exec celilac-postgres-test psql -h 127.0.0.1 -U celilac_test -d celilac_test -c "SELECT current_database() AS name, current_user AS usuario, inet_server_port() AS porta;"
     ```
   - **Resultado:**
     ```text
          name     |   usuario    | porta 
     --------------+--------------+-------
      celilac_test | celilac_test |  5432
     (1 row)
     ```

---

## 5. Salvaguardas Aplicadas e Pendências

### 5.1 Salvaguardas Confirmadas
- **Zero remoção de volumes:** `docker compose down -v` não foi executado; os volumes existentes (`celilac-backend_celilac_postgres_data` e demais volumes do host) permanecem intactos.
- **Isolamento de credenciais e bancos:** `celilac_db` (`celilac_user`, porta `5432`) e `celilac_test` (`celilac_test`, porta `5435`) possuem usuários, senhas, bancos, contêineres e volumes distintos.
- **Proteção de segredos:** `.env` está listado no `.gitignore` e nenhuma senha real foi exposta nos artefatos Markdown.

### 5.2 Pendências para a Próxima Fase (Fase 4 — Configuração do TypeORM)
- Inspecionar `AppModule` e `src/database/data-source.ts` para registrar `ProductOrmEntity` quando criada e alinhar o histórico de migrations de `celilac_db`.

