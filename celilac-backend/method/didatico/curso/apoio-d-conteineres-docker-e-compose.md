---
id: apoio-d
tipo: apoio
titulo: 'Apoio D — Contêineres: Docker e Compose'
ordem: 8
prerequisitos: [apoio-c]
duracao: '2 aulas'
gabarito: m04-gabarito
pratica: apoio-d-pratica
---

# Apoio D — Contêineres: Docker e Compose

> **Para quem:** quem nunca usou contêineres. Duração sugerida: 2 aulas.
> **Pré-requisito:** apoio C (integração contínua) e noção de banco de dados.
> **Você vai:** subir, com um comando, a sua aplicação e um banco de dados idênticos em qualquer máquina, sem apagar dados por engano.

---

## 1. O problema
Para a aplicação funcionar, é preciso um banco de dados PostgreSQL (sistema de banco de dados relacional), na versão certa, com o usuário certo, na porta certa. Cada pessoa instala de um jeito: uma tem a versão 14, outra a 17; uma já tem outro banco na porta, outra criou o usuário com outro nome. O código é o mesmo, **o ambiente não é**.

## 2. Antes de ler a solução
Peça a um colega para rodar o seu projeto do zero em outro computador, seguindo só o que está escrito no seu README. Anote cada pergunta que ele fizer. Cada pergunta é uma informação que existia só na sua cabeça ou no seu computador.

## 3. A tentativa ingênua
**Escrever um README longo** com os passos de instalação. Falha porque instruções escritas envelhecem, são interpretadas de modos diferentes e não garantem que a versão instalada seja a mesma.

## 4. A solução: contêineres
Um **contêiner** é um processo isolado que leva dentro dele tudo de que precisa para rodar: programa, bibliotecas e configuração. **Docker** é a ferramenta que cria e executa contêineres.

| Conceito | O que é | Exemplo neste projeto |
|---|---|---|
| **Imagem** | modelo pronto e imutável de um contêiner | `postgres:17` (o banco, na versão 17) |
| **Contêiner** | uma imagem em execução | `celilac-postgres` |
| **Dockerfile** | a receita para **construir** uma imagem | o `Dockerfile` da aplicação |
| **Volume** | um espaço de disco que **sobrevive** ao contêiner | `celilac_postgres_data`, onde ficam os dados |
| **Compose** | descreve **vários** contêineres e como se ligam, em um arquivo | `compose.yaml` |

### 4.1. A receita da aplicação (Dockerfile)
O `Dockerfile` do CeliLac tem dois estágios:
1. **Build:** instala as dependências completas e compila o TypeScript.
2. **Runtime:** parte de uma imagem nova, instala só as dependências de produção e copia o resultado compilado.

O segundo estágio gera uma imagem menor e sem as ferramentas de desenvolvimento.

### 4.2. O arquivo Compose, lido linha a linha
Trecho real do `compose.yaml`:
```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: ${DB_USERNAME:-celilac_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?Defina DB_PASSWORD no arquivo .env}
    ports:
      - "5432:5432"
    volumes:
      - celilac_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
```

| Parte | Significado |
|---|---|
| `services` | os contêineres que fazem parte do sistema |
| `ports: "5432:5432"` | porta da **sua máquina** : porta **dentro** do contêiner |
| `volumes` | liga o contêiner ao volume que guarda os dados |
| `healthcheck` | pergunta periodicamente se o serviço está saudável (aqui, se o banco aceita conexões) |
| `${DB_USERNAME:-celilac_user}` | usa a variável `DB_USERNAME`; se não existir, usa `celilac_user` |
| `${DB_PASSWORD:?mensagem}` | usa `DB_PASSWORD` e **recusa subir** se ela não existir |

Na aplicação, `depends_on` com `condition: service_healthy` faz a API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema) esperar o banco ficar saudável.

### 4.3. O arquivo `.env`
As variáveis ficam em um arquivo `.env`, **ignorado pelo Git**, e o repositório traz só um `.env.example` com valores de exemplo, sem segredo. A senha **não tem valor padrão** no `compose.yaml`: quem esquecer de defini-la recebe a mensagem de erro, em vez de subir um banco com a senha `postgres` conhecida por todos.

### 4.4. Comandos do dia a dia
| Comando | O que faz |
|---|---|
| `docker compose up -d --build` | constrói as imagens e sobe tudo em segundo plano |
| `docker compose ps` | lista os contêineres e o estado deles |
| `docker compose logs api` | mostra o que a API escreveu |
| `docker compose stop` | **para** os contêineres, sem apagar nada |
| `docker compose restart api` | reinicia **só a API** |

### 4.5. O comando que apaga seus dados
> **`docker compose down -v` remove também os volumes, ou seja, apaga o banco de dados.**

Neste curso, o `-v` está proibido sem autorização explícita, e o mesmo vale para `DROP` e `TRUNCATE` (comandos SQL que apagam tabelas e dados). Para parar sem perder nada, use `docker compose stop`.

## 5. Pratique no seu domínio

Faça a atividade passo a passo em [`apoio-d-pratica.md`](./apoio-d-pratica.md). Produza os artefatos no seu repositório e confira cada resultado no caminho e nos critérios indicados no arquivo de prática.

## 6. Como saber que funcionou
- [ ] Um colega clona o repositório, copia o `.env.example` para `.env`, define a senha e sobe tudo sem me perguntar nada.
- [ ] Os dados sobrevivem a `stop` e a um novo `up`.
- [ ] Não há senha em nenhum arquivo versionado.
- [ ] Sei dizer por que nunca usar `down -v` sem decidir antes.

## 7. Armadilhas comuns
- **Porta ocupada.** Se a 5432 já está em uso na sua máquina, o contêiner não sobe; mude o lado esquerdo da porta (por exemplo `5433:5432`).
- **Confundir "parar" com "apagar".** `stop` guarda os dados; `down -v` não.
- **Subir o banco e a aplicação ao mesmo tempo sem esperar a saúde do banco.** Use `healthcheck` e `depends_on`.
- **Commitar o `.env`.**

## 8. Como lidar com a IA (inteligência artificial) neste módulo
A IA gera um `compose.yaml` completo em segundos. Confira:
1. **Senha com valor padrão** (`postgres`, `123456`): recuse e use a forma `${DB_PASSWORD:?}`.
2. **Comandos destrutivos** sugeridos "para limpar tudo": **não execute** sem entender o que remove.
3. **Versões sem número** (`image: postgres`): fixe a versão (`postgres:17`).

Próximo: módulo 4, `m04-fundacao-ambiente-reprodutivel.md`.
