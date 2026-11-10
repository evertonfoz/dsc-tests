# ARTEFATO 10-05 — REDE DOCKER E VARIÁVEIS DE AMBIENTE ENTRE SERVIÇOS

## 1. Diferença Estrutural de Comunicação: Host vs. Contêiner

| Contexto de Execução do Backend | Valor de `DB_HOST` | Valor de `DB_PORT` | Como a Conexão TCP Ocorre |
| :--- | :---: | :---: | :--- |
| **Backend executado no Host (Material 09)** | `127.0.0.1` | `5432` | O processo Node.js na máquina hospedeira conecta-se à porta `5432` publicada no loopback do host (`0.0.0.0:5432->5432/tcp`). |
| **Backend executado em Contêiner (`celilac-api` — Material 10)** | `postgres` | `5432` | Dentro do contêiner `celilac-api`, `127.0.0.1` (`localhost`) refere-se ao namespace de rede do próprio contêiner da API (onde não há PostgreSQL rodando). Para alcançar o contêiner `celilac-postgres` na rede bridge compartilhada (`celilac-backend_default`), utiliza-se o **nome do serviço Compose (`postgres`)**, resolvido pelo DNS interno do Docker (`127.0.0.11`) para o IP interno `172.24.0.2:5432`. |

---

## 2. Isolamento do Banco de Testes (`postgres_test`)

| Serviço | Contêiner | Porta no Host | Porta Interna | Banco | Uso pela API de Desenvolvimento (`celilac-api`) |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **`postgres`** | `celilac-postgres` | `5432` | `5432` | `celilac_db` | **Sim** (`DB_HOST=postgres`, `DB_PORT=5432`, `DB_NAME=celilac_db`). |
| **`postgres_test`** | `celilac-postgres-test` | `5435` | `5432` | `celilac_test` | **Não.** Exclusivo para a suíte `pnpm test:integration` executada contra `127.0.0.1:5435`. |

---

## 3. Distinção Técnica entre os Mecanismos de Variáveis de Ambiente

1. **`.env` usado para interpolação pelo Docker Compose:**
   - Lido automaticamente pelo CLI `docker compose` no host para substituir expressões `${VAR}` dentro do `compose.yaml` (ex.: `${DB_USERNAME}`, `${DB_PASSWORD}`, `${DB_NAME}`, `${PORT:-3200}`).
   - **Importante:** O simples fato de uma variável existir no `.env` do host **não** a injeta automaticamente dentro do contêiner; apenas as variáveis explicitamente declaradas em `environment:` (ou `env_file:`) do serviço são repassadas ao processo do contêiner.
2. **Bloco `environment:` do serviço `api` no `compose.yaml`:**
   - Define explicitamente as variáveis entregues ao processo Node.js dentro do contêiner `celilac-api`:
     - `PORT: 3200`
     - `DB_HOST: postgres` *(sobrescreve o `127.0.0.1` do `.env` local!)*
     - `DB_PORT: 5432`
     - `DB_USERNAME: ${DB_USERNAME}`
     - `DB_PASSWORD: ${DB_PASSWORD}`
     - `DB_NAME: ${DB_NAME}`
3. **`env_file:`:**
   - Mecanismo alternativo que carregaria todas as chaves de um arquivo diretamente no contêiner. Não foi utilizado de forma cega para evitar que `DB_HOST=127.0.0.1` ou `TEST_DB_*` do `.env` local entrassem indevidamente no contêiner `api`.
4. **`.env.example`:**
   - Modelo versionado no Git contendo apenas os nomes das variáveis (`PORT=3200`, `DB_HOST=`, `DB_PORT=`, `DB_USERNAME=`, `DB_PASSWORD=`, `DB_NAME=`, `TEST_DB_*`), sem segredos reais.

---

## 4. Coerência dos Nomes de Variáveis com NestJS (`AppModule`, `main.ts`) e TypeORM (`data-source.ts`)

| Variável | `src/main.ts` | `src/app.module.ts` (`ConfigService`) | `src/database/data-source.ts` | Serviço `api` (`compose.yaml`) |
| :--- | :--- | :--- | :--- | :--- |
| **`PORT`** | `process.env.PORT \|\| 3200` | — | — | `PORT: 3200` |
| **`DB_HOST`** | — | `config.getOrThrow<string>('DB_HOST')` | `process.env.DB_HOST` | `DB_HOST: postgres` |
| **`DB_PORT`** | — | `Number(config.getOrThrow<string>('DB_PORT'))` | `Number(process.env.DB_PORT)` | `DB_PORT: 5432` |
| **`DB_USERNAME`** | — | `config.getOrThrow<string>('DB_USERNAME')` | `process.env.DB_USERNAME` | `DB_USERNAME: ${DB_USERNAME}` |
| **`DB_PASSWORD`** | — | `config.getOrThrow<string>('DB_PASSWORD')` | `process.env.DB_PASSWORD` | `DB_PASSWORD: ${DB_PASSWORD}` |
| **`DB_NAME`** | — | `config.getOrThrow<string>('DB_NAME')` | `process.env.DB_NAME` | `DB_NAME: ${DB_NAME}` |

> Preservou-se `DB_USERNAME` (e não `DB_USER`), mantendo compatibilidade total com `AppModule` e `data-source.ts`.

---

## 5. Verificação Empírica de Resolução DNS e Variáveis no Contêiner

Como a imagem `node:24.21.0-bookworm-slim` é enxuta e não inclui utilitários como `ping`, `curl` ou `psql` (e não devemos poluir a imagem de produção instalando pacotes de diagnóstico desnecessários), utilizou-se o próprio runtime Node.js (`node:dns/promises`) em um contêiner temporário do serviço `api`:

- **Comando executado:**
  ```bash
  docker compose run --rm api node -e "import('node:dns/promises').then(async d => { const r = await d.lookup('postgres'); console.log({ PORT: process.env.PORT, DB_HOST: process.env.DB_HOST, DB_PORT: process.env.DB_PORT, DB_USERNAME: process.env.DB_USERNAME, DB_NAME: process.env.DB_NAME, resolvedPostgresIp: r.address }); })"
  ```
- **Resultado real observado:**
  ```text
  {
    PORT: '3200',
    DB_HOST: 'postgres',
    DB_PORT: '5432',
    DB_USERNAME: 'celilac_user',
    DB_NAME: 'celilac_db',
    resolvedPostgresIp: '172.24.0.2'
  }
  ```
- **Inspeção da rede do contêiner `celilac-postgres` (`docker inspect celilac-postgres`):**
  - Rede: `celilac-backend_default`
  - IPv4: `172.24.0.2`
  - Aliases DNS: `["celilac-postgres", "postgres", "544f5f92d334"]`
- **Conclusão:** O contêiner `api` resolve `postgres` exatamente para `172.24.0.2` na rede `celilac-backend_default` e recebe todas as variáveis esperadas sem expor `DB_PASSWORD` nos logs.

---

## 6. Pendências

- Nenhuma pendência na configuração de rede ou variáveis de ambiente.

