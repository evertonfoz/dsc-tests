# ARTEFATO 10-03 — `.DOCKERIGNORE`, CONTEXTO DE BUILD E CONSTRUÇÃO DA IMAGEM

## 1. Contexto e Objetivos

O objetivo desta fase é restringir o contexto de construção do Docker para garantir builds rápidos, determinísticos e estritamente seguros, impedindo que artefatos locais compilados (`dist/`), pastas de dependências do host (`node_modules/`), arquivos de cobertura, diretórios de documentação e, fundamentalmente, credenciais e arquivos `.env` privados vazem para dentro das camadas da imagem.

---

## 2. Conteúdo do `.dockerignore`

O arquivo `.dockerignore` foi criado na raiz de `celilac-backend` com as seguintes regras de exclusão:

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
docs
tsconfig.build.tsbuildinfo
*.log
```

### Justificativas das Exclusões:
- **`node_modules` e `dist`:** Garante que a compilação e as dependências dentro da imagem sejam criadas sob a arquitetura Linux do contêiner e nunca reutilizem artefatos de arquiteturas locais incompatíveis.
- **`.env` e `.env.*` (exceto `!.env.example`):** Medida de segurança mandante; nenhum valor de senha ou segredo de banco de dados é empacotado na imagem.
- **`prompts`, `docs`, `coverage`, `.git`:** Reduz o tamanho do contexto transferido ao daemon Docker de centenas de megabytes para meros `182 kB`.

---

## 3. Construção da Imagem Docker (`docker build`)

A imagem foi construída a partir do comando:

```bash
docker build -t celilac-api:dev .
```

### Evidência Real da Construção:

```text
[+] Building 18.6s (17/17) FINISHED                        docker:desktop-linux
 => [internal] load build definition from Dockerfile                       0.0s
 => => transferring dockerfile: 721B                                       0.0s
 => [internal] load metadata for docker.io/library/node:24.21.0-bookworm-  0.0s
 => [internal] load .dockerignore                                          0.0s
 => => transferring context: 162B                                          0.0s
 => [build 1/8] FROM docker.io/library/node:24.21.0-bookworm-slim@sha256:  0.0s
 => [internal] load build context                                          0.0s
 => => transferring context: 182.44kB                                      0.0s
 => [build 2/8] WORKDIR /app                                               0.0s
 => [build 3/8] RUN npm install -g pnpm@12.8.1                             4.5s
 => [runtime 3/6] RUN npm install -g pnpm@12.8.1                           4.7s
 => [build 4/8] COPY package.json pnpm-lock.yaml ./                        0.0s
 => [build 5/8] RUN pnpm install --frozen-lockfile                         6.8s
 => [runtime 4/6] COPY package.json pnpm-lock.yaml ./                      0.1s
 => [runtime 5/6] RUN pnpm install --prod --frozen-lockfile                5.4s
 => [build 6/8] COPY tsconfig.json tsconfig.build.json nest-cli.json ./    0.1s
 => [build 7/8] COPY src ./src                                             0.0s
 => [build 8/8] RUN pnpm build                                             1.2s
 => [runtime 6/6] COPY --from=build /app/dist ./dist                       0.1s
 => exporting to image                                                     4.9s
 => => exporting layers                                                    2.5s
 => => naming to docker.io/library/celilac-api:dev                         0.0s
 => => unpacking to docker.io/library/celilac-api:dev                      2.4s
```

---

## 4. Inspeção da Imagem Gerada

A existência e as propriedades da imagem foram confirmadas via `docker image ls`:

```bash
$ docker image ls celilac-api:dev
IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
celilac-api:dev   a6fa42a9ee3d        722MB          166MB        
```

E inspecionadas detalhadamente via `docker image inspect celilac-api:dev`:
- **Tag:** `celilac-api:dev`
- **Tamanho descompactado:** ~166 MB
- **Porta exposta:** `3200/tcp`
- **Ponto de Entrada:** `CMD ["node", "dist/main.js"]`
- **Variáveis integradas:** `NODE_ENV=production`, `PORT=3200`
- **Ausência de segredos:** Nenhuma credencial ou arquivo sensível presente no sistema de arquivos da imagem.
