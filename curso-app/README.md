# curso-app — Aplicação web do curso

Aplicação interativa que conduz o aluno pelo curso "Implementando um caso de uso com evidência" e o ajuda a produzir, no **seu** repositório, os mesmos artefatos e evidências do UC12 do CeliLac.

## Situação
**Marco M1a (leitura e navegação).** O curso inteiro pode ser lido: índice, mapa na ordem sugerida, os 13 módulos, os 4 apoios, o projeto final e a prática do módulo 2 (só leitura). Cada página traz uma ficha gerada do front matter (duração, o que pede antes, prática) e "anterior" e "próximo". Nomes de arquivo do curso citados no texto viram links; caminhos de arquivo do método e do código do CeliLac abrem no GitHub, no commit de origem. Gabaritos **não** são publicados (chegam com o registro de tentativas, no M3). Siglas, grafo e mascotes chegam no M1b.

- Prompt e etapas do plano: `celilac-backend/method/didatico/curso-app/prompt-plano-da-aplicacao.md`
- Estado do trabalho: `celilac-backend/method/didatico/curso-app/estado.md`
- Plano deste marco: `celilac-backend/method/didatico/curso-app/etapas/E9-M1-plano.md`

## Como construir e executar
Requisitos: Docker e o repositório `dsc-tests` clonado (enquanto a imagem não for publicada).

```bash
curso-app/scripts/construir.sh   # constrói a imagem curso-app:local com o commit atual
curso-app/scripts/executar.sh    # abre em http://127.0.0.1:4321
```

- Use sempre esse endereço: o progresso (a partir do M3) fica guardado no navegador **por endereço**; outra porta é outro progresso.
- O rodapé mostra o commit e a data do conteúdo. Se houver mudanças não commitadas, `construir.sh` avisa.
- A construção **falha** se o front matter de algum arquivo do curso não estiver conforme, se o título ou a linha "Pré-requisito" do corpo divergirem do front matter, ou (em `construir.sh`) se um commit citado no curso não existir no histórico.

## Como desenvolver
Node 24.21.0 e pnpm 12.8.1.

```bash
cd curso-app
pnpm install --frozen-lockfile
pnpm dev     # servidor de desenvolvimento em http://127.0.0.1:4321 (rodapé "a confirmar")
pnpm test    # testes de unidade (Vitest)
pnpm check   # verificação de tipos
pnpm exec playwright install chromium   # uma vez, para os testes no navegador
```

Testes da imagem (os mesmos do CI, `.github/workflows/curso-app-ci.yml`):

```bash
curso-app/scripts/testar-imagem.sh "$(git rev-parse HEAD)"
curso-app/scripts/testar-construcao-negativa.sh
curso-app/scripts/testar-navegador.sh          # Playwright e axe-core contra a imagem
curso-app/scripts/testar-conferir-commits.sh
```

## Decisões já tomadas
- Projeto próprio, nesta pasta, na raiz do repositório `dsc-tests`.
- Execução **local**, na máquina de quem usa, a partir de uma **imagem Docker** (publicação na internet prevista para o futuro).
- Site estático gerado com Astro na construção da imagem e servido por nginx sem privilégios; a imagem final não tem Node.
- A aplicação não acessa a internet nem **lê** o repositório do aluno. O kit inicial será entregue como `.zip`, e o progresso fica no navegador.
- Sem login: acesso aberto. Curso **autônomo**: sem área do professor.
- Conteúdo lido dos Markdown de `celilac-backend/method/didatico/curso/` (fonte única) e mascotes de `mascotes/web/`.
