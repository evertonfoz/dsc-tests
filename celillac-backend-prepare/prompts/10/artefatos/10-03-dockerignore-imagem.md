# ARTEFATO 10-03 — CONFIGURAÇÃO DO `.dockerignore` E CONSTRUÇÃO DA IMAGEM DOCKER

## 1. Configuração do Arquivo `.dockerignore`

Arquivo criado na raiz do projeto: `.dockerignore`

```text
node_modules
dist
coverage
.git
.env
.env.*
!.env.example
.DS_Store
.vscode
prompts
tsconfig.build.tsbuildinfo
*.log
```

### Papel Técnico de Cada Regra do `.dockerignore`:
1. **`node_modules` e `dist`:** Impedem que binários ou artefatos compilados no host macOS (arquitetura/SO do desenvolvedor) sejam transferidos no contexto de build ou sobrescrevam as dependências Linux instaladas dentro do contêiner.
2. **`coverage`, `tsconfig.build.tsbuildinfo`, `.DS_Store`, `.vscode`, `prompts`, `*.log`:** Eliminam artefatos locais de teste, cache incremental do TypeScript, metadados do sistema operacional/IDE e documentos didáticos, reduzindo o contexto enviado ao Docker daemon para apenas **224,47 kB**.
3. **`.git`:** Evita enviar o histórico do repositório Git para o contexto da imagem.
4. **`.env`, `.env.*` e `!.env.example`:** Bloqueiam estritamente a inclusão de qualquer arquivo `.env` local com senhas ou credenciais reais na imagem Docker, permitindo apenas o arquivo modelo `.env.example` (que não contém segredos).

---

## 2. Construção da Imagem Docker (`celilac-api:dev`)

### 2.1 Comando e Contexto de Construção
- **Diretório de execução (Contexto `.`):** `/Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celillac-backend-prepare`
- **Comando executado:**
  ```bash
  docker build -t celilac-api:dev .
  ```

### 2.2 Log Real de Construção Observado
```text
[+] Building 41.8s (17/17) FINISHED                        docker:desktop-linux
 => [internal] load build definition from Dockerfile                       0.0s
 => => transferring dockerfile: 761B                                       0.0s
 => [internal] load metadata for docker.io/library/node:24.21.0-bookworm-  4.1s
 => [internal] load .dockerignore                                          0.0s
 => => transferring context: 157B                                          0.0s
 => [build 1/8] FROM docker.io/library/node:24.21.0-bookworm-slim@sha256  13.0s
 => [internal] load build context                                          0.1s
 => => transferring context: 224.47kB                                      0.0s
 => [build 2/8] WORKDIR /app                                               0.5s
 => [build 3/8] RUN npm install -g pnpm@12.8.1                             8.1s
 => [runtime 3/6] RUN npm install -g pnpm@12.8.1                           7.8s
 => [runtime 4/6] COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./  0.1s
 => [runtime 5/6] RUN pnpm install --prod --frozen-lockfile                9.9s
 => [build 4/8] COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./    0.0s
 => [build 5/8] RUN pnpm install --frozen-lockfile                         9.7s
 => [build 6/8] COPY tsconfig.json tsconfig.build.json nest-cli.json ./    0.2s
 => [build 7/8] COPY src ./src                                             0.0s
 => [build 8/8] RUN pnpm build                                             1.4s
 => [runtime 6/6] COPY --from=build /app/dist ./dist                       0.1s
 => exporting to image                                                     4.1s
 => => exporting layers                                                    2.2s
 => => exporting manifest sha256:12f0bc940650d32b6cdb172c9245632b9dbab239  0.0s
 => => exporting config sha256:192c75bd628ff72bb3e9d41359a752250a81d5049a  0.0s
 => => exporting attestation manifest sha256:59dc4cdf792158b70e6f084acbc5  0.0s
 => => exporting manifest list sha256:7e2f32857fb77cd18b7d7f1a4bc00b29af9  0.0s
 => => naming to docker.io/library/celilac-api:dev                         0.0s
 => => unpacking to docker.io/library/celilac-api:dev                      1.9s
```

---

## 3. Inspeção da Imagem Construída e dos Arquivos Incluídos

### 3.1 Listagem da Imagem (`docker image ls`)
- **Comando executado:**
  ```bash
  docker image ls celilac-api
  ```
- **Saída real observada:**
  ```text
  IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
  celilac-api:dev   7e2f32857fb7        695MB          164MB
  ```

### 3.2 Verificação do Conteúdo Interno do Estágio `runtime`
- **Comando executado:**
  ```bash
  docker run --rm celilac-api:dev ls -la /app /app/dist /app/dist/database/migrations
  ```
- **Saída real observada:**
  ```text
  /app:
  total 180
  drwxr-xr-x 1 root root   4096 Nov 10 16:35 .
  drwxr-xr-x 1 root root   4096 Nov 10 16:39 ..
  drwxr-xr-x 7 root root   4096 Nov 10 16:35 dist
  drwxr-xr-x 5 root root   4096 Nov 10 16:35 node_modules
  -rw-r--r-- 1 root root   2123 Nov 10 16:32 package.json
  -rw-r--r-- 1 root root 156459 Nov 10 16:33 pnpm-lock.yaml
  -rw-r--r-- 1 root root     61 Sep 29 01:42 pnpm-workspace.yaml

  /app/dist:
  total 76
  drwxr-xr-x 7 root root 4096 Nov 10 16:35 .
  drwxr-xr-x 1 root root 4096 Nov 10 16:35 ..
  -rw-r--r-- 1 root root  184 Nov 10 16:35 app.controller.d.ts
  -rw-r--r-- 1 root root 1428 Nov 10 16:35 app.controller.js
  -rw-r--r-- 1 root root  475 Nov 10 16:35 app.controller.js.map
  -rw-r--r-- 1 root root   35 Nov 10 16:35 app.module.d.ts
  -rw-r--r-- 1 root root 2182 Nov 10 16:35 app.module.js
  -rw-r--r-- 1 root root 1263 Nov 10 16:35 app.module.js.map
  -rw-r--r-- 1 root root   60 Nov 10 16:35 app.service.d.ts
  -rw-r--r-- 1 root root  831 Nov 10 16:35 app.service.js
  -rw-r--r-- 1 root root  287 Nov 10 16:35 app.service.js.map
  drwxr-xr-x 5 root root 4096 Nov 10 16:35 common
  drwxr-xr-x 3 root root 4096 Nov 10 16:35 database
  drwxr-xr-x 3 root root 4096 Nov 10 16:35 infrastructure
  -rw-r--r-- 1 root root   11 Nov 10 16:35 main.d.ts
  -rw-r--r-- 1 root root  513 Nov 10 16:35 main.js
  -rw-r--r-- 1 root root  606 Nov 10 16:35 main.js.map
  drwxr-xr-x 5 root root 4096 Nov 10 16:35 modules
  drwxr-xr-x 2 root root 4096 Nov 10 16:35 scripts

  /app/dist/database/migrations:
  total 68
  drwxr-xr-x 2 root root 4096 Nov 10 16:35 .
  drwxr-xr-x 3 root root 4096 Nov 10 16:35 ..
  -rw-r--r-- 1 root root 1595 Nov 10 16:35 1791738728692-CreateOrdersAndPayments.js
  -rw-r--r-- 1 root root 2104 Nov 10 16:35 1791814820800-AddDomainFieldsToOrdersAndPayments.js
  -rw-r--r-- 1 root root 1504 Nov 10 16:35 1791814929531-UseDatabaseTimestamps.js
  -rw-r--r-- 1 root root 1116 Nov 10 16:35 1791815040413-AddUpdatedAtTriggers.js
  -rw-r--r-- 1 root root  530 Nov 10 16:35 1794255600000-CreateProductsTable.js
  ```

### 3.3 Constatações de Segurança e Higiene da Imagem
- **Ausência de `.env` e de `src/`:** O diretório `/app` no estágio `runtime` contém exclusivamente `dist/`, `node_modules/` (produção), `package.json`, `pnpm-lock.yaml` e `pnpm-workspace.yaml`. Nenhum arquivo `.env` ou código-fonte TypeScript bruto foi incluído na imagem final.
- **Ressalva Metodológica:** A construção bem-sucedida da imagem `celilac-api:dev` (`7e2f32857fb7`) comprova apenas o empacotamento estático dos artefatos; a validação funcional da API depende da integração ao Docker Compose, da rede, das variáveis de ambiente, das migrations e das requisições HTTP nas fases seguintes.

---

## 4. Pendências

- Integrar o serviço `api` ao `compose.yaml` existente na Fase 5 (Artefato `10-04`).

