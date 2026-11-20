# ARTEFATO 10-05 — REDE E VARIÁVEIS DE AMBIENTE NO AMBIENTE CONTAINERIZADO

## 1. Contexto e Conceito Arquitetural de Rede no Docker

Ao transitar de uma execução onde a aplicação roda localmente no sistema operacional hospedeiro (host) para uma execução onde a aplicação roda dentro de contêineres Docker gerenciados pelo Compose, as regras de resolução de nomes e portas mudam:

1. **Aplicação rodando no Host:**
   - O host enxerga o contêiner através da porta **publicada** no `localhost` (ou `127.0.0.1`).
   - Por exemplo: `DB_HOST=127.0.0.1` e `DB_PORT=5432` (para desenvolvimento) ou `TEST_DB_PORT=5435` (para testes).
2. **Aplicação rodando no Contêiner da API via Compose:**
   - O contêiner da API possui sua própria interface de rede em namespace isolado. Dentro do contêiner da API, `localhost` ou `127.0.0.1` **é o próprio contêiner da API**, e não o host nem o PostgreSQL!
   - Portanto, a comunicação entre contêineres irmãos na mesma rede gerenciada pelo Compose ocorre pelo **nome do serviço** (`DB_HOST=postgres`).
   - A porta a ser utilizada é a **porta interna** do PostgreSQL (`5432`), independentemente de qual porta esteja mapeada para o host.

---

## 2. Mapeamento e Comparação das Variáveis de Ambiente

| Variável | Valor no Host (`.env`) | Valor no Contêiner API (`compose.yaml`) | Função no Sistema |
| :--- | :--- | :--- | :--- |
| `PORT` | `3200` | `3200` | Porta HTTP onde a API NestJS escuta. |
| `DB_HOST` | `127.0.0.1` | `postgres` | Host de destino da conexão TypeORM com o banco. |
| `DB_PORT` | `5432` | `5432` | Porta interna do serviço PostgreSQL. |
| `DB_USERNAME` | `celilac_user` | `${DB_USERNAME:-celilac_user}` | Usuário do banco de dados `celilac_db`. |
| `DB_PASSWORD` | `[PROTEGIDO]` | `${DB_PASSWORD:-celilac_dev_password}` | Senha de autenticação no PostgreSQL. |
| `DB_NAME` | `celilac_db` | `${DB_NAME:-celilac_db}` | Base de dados de desenvolvimento. |
| `TEST_DB_HOST` | `127.0.0.1` | *(não injetada na API)* | Isolada exclusivamente para execução dos testes. |
| `TEST_DB_PORT` | `5435` | *(não injetada na API)* | Porta publicada no host para o contêiner `celilac-postgres-test`. |
| `COMPOSE_PROJECT_NAME` | `celilac-backend` | `celilac-backend` | Prefixo determinístico das redes e volumes. |

---

## 3. Isolamento e Proteção do Banco de Testes

- O serviço `postgres_test` (`celilac-postgres-test`, porta `5435:5432`) é mantido estritamente isolado da API de desenvolvimento.
- A API containerizada **nunca** aponta para o banco de testes. Suas variáveis de ambiente referenciam única e exclusivamente o serviço `postgres` (`celilac_db`).
- As rotinas de teste automatizado executadas no host conectam-se a `127.0.0.1:5435` através do `src/database/test-data-source.ts`, preservando a integridade dos dados cadastrados em desenvolvimento.

---

## 4. Segurança e Tratamento de Credenciais

- Nenhuma senha ou credencial sensível foi escrita diretamente no repositório Git.
- O arquivo `.env` está explicitamente ignorado tanto pelo `.gitignore` quanto pelo `.dockerignore`.
- O arquivo `.env.example` fornece as chaves necessárias sem expor senhas reais.
