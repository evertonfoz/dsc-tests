# Guia de Verificação Pós-Atividade — Material 13

**Coleção REST Client e Verificação Automatizada da API (no projeto da sua equipe)**

Use este guia **depois** de executar o prompt do Material 13, para conferir por conta própria, com evidências reais, se a coleção `http-rest-client/`, o README e o `run-checks.sh` foram criados, executados e registrados corretamente. Execute os comandos na raiz do backend, na branch de trabalho desta atividade.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.
>
> Todos os comandos são **não destrutivos**, exceto o passo 5, que grava até dois registros por execução em tabela do caso de uso (via `POST`) e, com `--durability`, reinicia **somente a API**.

---

## 0. Antes de começar: preencha a tabela do seu projeto

| Placeholder | O que é | Valor no seu projeto | Exemplo (CeliLac) |
|---|---|---|---|
| `<BRANCH>` | branch de trabalho | | `feature/uc12-13-http-rest-client-verification` |
| `<DIR_M12>` / `<DIR_M13>` | diretórios dos artefatos 12 e 13 | | `prompts/12/artefatos/` / `prompts/13/artefatos/` |
| `<PORTA>` | porta publicada da API | | `3200` |
| `<API>` / `<DB>` | serviços Compose da API e do banco | | `api` / `postgres` |
| `<ROTA>` | rota do caso de uso | | `/products` |
| `<TABELA>` | tabela onde o caso de uso grava | | `products.products` |

---

## 1. Pré-requisitos e estado do repositório

| Verificação | Comando | Esperado |
|---|---|---|
| Branch atual | `git branch --show-current` | o valor de `<BRANCH>` |
| Código-fonte intacto | `git diff -- src/ test/` | **saída vazia** (este material não altera código da aplicação) |
| `.env` não versionado | `git check-ignore .env` | imprime `.env` |
| Artefatos do Material 12 | `ls <DIR_M12>/12-*.md` | 8 arquivos (`12-01` a `12-08`) |
| Artefatos do Material 13 | `ls <DIR_M13>/13-*.md` | 8 arquivos (`13-01` a `13-08`) |

---

## 2. Os arquivos existem no repositório (não só nos Markdown)

```bash
find http-rest-client -type f | sort
ls -l http-rest-client/containerizado/run-checks.sh
git ls-files -s http-rest-client/containerizado/run-checks.sh
```

**Esperado:**
- Existem `tests/hello-world.http`, os `.http` do caso de uso, os `.http` de apoio (se aplicável) e a pasta `containerizado/` com `README.md`, `00-smoke.http`, `01-...http`, `02-...http` e `run-checks.sh`.
- O script tem permissão de execução (`-rwxr-xr-x`) e, uma vez adicionado ao Git, modo `100755`.
- **Se só os Markdown existem, o Material 13 não foi concluído.**

---

## 3. Conteúdo dos `.http`

```bash
grep -rn "@baseUrl" http-rest-client
grep -rn "→ esperado" http-rest-client | wc -l
grep -rniE "password|senha|token|secret|authorization" http-rest-client
```

**Esperado:**
- Todo `.http` declara `@baseUrl` com a porta `<PORTA>` real.
- Cada requisição tem um título `### ... → esperado: <status>`.
- O último `grep` **não retorna linhas** (nenhum segredo versionado). Se retornar, é um **achado a corrigir**, não um detalhe.
- O corpo de cadastro **não** envia identificador gerado pelo sistema. Um campo extra só aparece no cenário que demonstra descarte/rejeição.
- Não há requisições para rotas que não existem no seu código:
  ```bash
  grep -rhoE "^(GET|POST|PUT|PATCH|DELETE) [^ ]+" http-rest-client | sort -u
  ```
  Compare cada método + rota da lista com os controllers reais.

---

## 4. Encadeamento e cenários com dados

```bash
grep -n "@name" http-rest-client/containerizado/01-*.http
grep -n "response.body" http-rest-client/containerizado/01-*.http
```

**Esperado:** o cenário de cadastro válido tem `# @name <nome>` e uma variável que referencia `{{<nome>.response.body.<campoId>}}`.

Cenários que dependem de seed (`200`, `409`, `422` etc.):
- Os IDs vieram da **saída real** do seed, com o cabeçalho `# Gerado por ... em <data>`.
- Se o seed não foi executado, o cenário está marcado como **Não foi possível verificar** (e **não** tem UUID inventado).

---

## 5. Execução do script

### 5.1 Sintaxe e análise estática
```bash
bash -n http-rest-client/containerizado/run-checks.sh && echo "sintaxe OK"
shellcheck http-rest-client/containerizado/run-checks.sh   # se instalado
```
**Esperado:** `sintaxe OK`; `shellcheck` sem erros (ou registro de que não está instalado).

### 5.2 Ambiente de pé
```bash
docker compose up -d --build <API>
docker compose ps
```
**Esperado:** `<API>` `Up` e `<DB>` `healthy`.

### 5.3 Execução completa
```bash
./http-rest-client/containerizado/run-checks.sh
echo "código de saída: $?"
```
**Esperado:**
- Todas as linhas `ok`; última linha `Resultado: N ok, 0 falha(s)`.
- Código de saída `0`.

### 5.4 Durabilidade
```bash
./http-rest-client/containerizado/run-checks.sh --durability
echo "código de saída: $?"
```
**Esperado:** além do passo anterior, `API voltou (200)` e `registro após restart` com `ok`. O PostgreSQL **não** é reiniciado.

### 5.5 Prova de que o script detecta falha
```bash
BASE_URL=http://localhost:9 ./http-rest-client/containerizado/run-checks.sh
echo "código de saída: $?"
```
**Esperado:** várias linhas `FALHA` e código de saída **diferente de `0`**. Se o script sair com `0` aqui, ele **não** é uma verificação confiável.

---

## 6. Segurança do script

```bash
grep -nE "down|volume|prune|migration:run|migration:revert|schema:drop|set -e" http-rest-client/containerizado/run-checks.sh
grep -nE "restart" http-rest-client/containerizado/run-checks.sh
```

**Esperado:**
- O primeiro `grep` **não retorna** comandos destrutivos (`down -v`, `volume rm`, `prune`, `migration:run`, `migration:revert`, `schema:drop`) nem `set -e`. Menções em **comentários** do cabeçalho ("não usa `down -v`") são aceitáveis.
- O `restart` aparece **somente** para `<API>`.
- O script não imprime senhas nem variáveis de ambiente:
  ```bash
  ./http-rest-client/containerizado/run-checks.sh 2>&1 | grep -iE "password|senha|secret"
  ```
  **Sem saída.**

---

## 7. Consulta SQL manual (confirmação independente do script)

Use o identificador devolvido pelo cenário de cadastro válido:

```bash
docker compose exec -T <DB> sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM <TABELA> WHERE "<colunaId>" = '<ID>';
SQL
docker compose restart <API>
# repita a consulta acima
```

**Esperado:** o registro é **idêntico** antes e depois do restart. Subir a API com sucesso **não** comprova persistência: só o mesmo registro nos dois momentos comprova.

---

## 8. Testes automatizados (outro nível de evidência)

```bash
pnpm test
pnpm test:integration     # banco de testes isolado
```

**Esperado:** aprovados, com os números **obtidos agora** registrados em `13-07`. A suíte E2E só deve ser executada depois de confirmar o banco de destino (veja o guia do Material 12, seção 5.3); caso contrário, deve constar como *"não executado — risco ao banco de desenvolvimento"*.

---

## 9. Checklist de evidências para o Pull Request

Cole no PR a saída real (sem senhas):

- [ ] `find http-rest-client -type f | sort`
- [ ] `git ls-files -s` do `run-checks.sh` com modo `100755`
- [ ] `docker compose ps` com os serviços saudáveis
- [ ] Saída de `run-checks.sh` e código de saída `0`
- [ ] Saída de `run-checks.sh --durability`
- [ ] Execução com `BASE_URL` inválida e código de saída `≠ 0`
- [ ] SQL antes e depois do restart da API (mesmo registro)
- [ ] `pnpm test` e `pnpm test:integration` com os números obtidos
- [ ] Suíte E2E registrada como não executada, com o motivo (ou executada com o banco confirmado)
- [ ] `git status` limpo; `git diff --staged` somente com arquivos de `http-rest-client/`
- [ ] Sem `.env`, senhas ou tokens no diff

---

## 10. Os artefatos do Material 13 registram?

- [ ] Estado inicial da pasta e contrato confirmado no código (`13-01`)
- [ ] Árvore criada, papel dos arquivos e convenções (`13-02`)
- [ ] Tabela de cenários com **esperado × obtido** (`13-03`)
- [ ] Separação entre cenários com e sem seed, ou **Não aplicável** justificado (`13-04`)
- [ ] README operacional e smoke test (`13-05`)
- [ ] Saída real do script, códigos de saída, falha detectada e limitações (`13-06`)
- [ ] Matriz de evidências com o que **não** foi executado e por quê (`13-07`)
- [ ] Issue real, branch, diff inspecionado, PR/parecer e revisão humana como **pendente** até acontecer (`13-08`)

---

## 11. Problemas comuns e armadilhas

1. **Entregar só os Markdown:** descrever requisições em `.md` não cria `http-rest-client/`. Confira o passo 2.
2. **Esperado copiado do exemplo do CeliLac:** `/products`, `productId` e `celilac_db` são exemplos. O "esperado" deve vir do **seu** código.
3. **UUIDs de pedidos inventados:** IDs de cenários com dados vêm do seed real.
4. **Script que nunca falha:** sem o passo 5.5, não há prova de que ele detecta problemas.
5. **`set -e` no script:** ele aborta na primeira falha e esconde as demais; o padrão é contar falhas e continuar.
6. **Confundir `.http` com teste:** o `.http` **não faz asserção**; quem compara é você (ou o `run-checks.sh`).
7. **Considerar o script substituto dos testes:** ele verifica o sistema em execução; Vitest/Supertest verificam o código em ambiente controlado.
8. **Perder a permissão de execução** ao criar o arquivo por editor ou ao copiar: reaplique `chmod +x` e confira `100755`.
9. **Segredos no repositório:** senha do banco em README, `.http` ou saída colada no PR.
10. **Comandos que nunca devem ser usados:** `docker compose down -v`, `prune`, `migration:revert` automático, `synchronize: true`, merge automático.

---

## 12. Distinções que você deve conseguir explicar

- **Requisição descrita ≠ requisição versionada e repetível.**
- **`.http` (inspeção manual) ≠ `run-checks.sh` (asserções e código de saída).**
- **Verificação do sistema em execução ≠ teste automatizado do código.**
- **API reiniciou ≠ dado persistiu.** Durabilidade exige o mesmo registro antes e depois do restart.
- **Esperado (contrato) ≠ obtido (execução de agora).**
- **Cenário não executado ≠ cenário aprovado.** Registre "Não foi possível verificar".
