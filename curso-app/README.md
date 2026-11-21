# curso-app — Aplicação web do curso

Aplicação interativa que conduz o aluno pelo curso "Implementando um caso de uso com evidência" e o ajuda a produzir, no **seu** repositório, os mesmos artefatos e evidências do UC12 do CeliLac.

## Situação
**M3 (progresso e gabaritos) integrado no PR #96.** A aplicação registra leituras, tentativas e checklists como declarações pessoais neste navegador; libera gabaritos após tentativa ou abertura antecipada; e oferece exportação, importação com backup, exclusão e pedido de persistência na tela “Seus dados”. O curso não avalia essas declarações.

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
- A primeira marcação de progresso mostra onde os dados ficam; a tela “Seus dados” permite exportar e apagar o registro.
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
