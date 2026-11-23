# curso-app — Aplicação web do curso

Aplicação estática para orientar o aluno pelo curso "Implementando um caso de uso com evidência". As atividades e os artefatos ficam no caderno, editor, terminal, repositório e GitHub do próprio aluno. O site não solicita respostas, registra progresso, usa armazenamento do navegador nem transmite dados do aluno.

## Estado
M0 a M3 foram integrados. Esta revisão substitui no fluxo do aluno o registro de progresso e tentativas por leitura livre e divulgação nativa dos gabaritos. A tentativa continua sendo uma orientação pedagógica: o aluno pode trabalhar no local indicado antes de abrir o gabarito, sem bloqueio, submissão ou registro.

- Plano e histórico da aplicação: `celilac-backend/method/didatico/curso-app/estado.md`
- Auditoria de artefatos e lacunas: `celilac-backend/method/didatico/curso-app/auditoria-experiencia-e-artefatos.md`

## Como construir e executar
Requisitos: Docker e o repositório `dsc-tests` clonado (enquanto a imagem não for publicada).

```bash
curso-app/scripts/construir.sh
curso-app/scripts/executar.sh
```

Abra `http://127.0.0.1:4321`. O rodapé mostra o commit e a data do conteúdo. Se houver mudanças não commitadas, a construção avisa. Ela falha se os metadados ou pré-requisitos do conteúdo divergirem, ou se um commit citado no curso não existir no histórico.

## Como desenvolver
Node 24.21.0 e pnpm 12.8.1.

```bash
cd curso-app
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm check
pnpm exec playwright install chromium
```

Verificações da imagem:

```bash
curso-app/scripts/testar-imagem.sh "$(git rev-parse HEAD)"
curso-app/scripts/testar-construcao-negativa.sh
curso-app/scripts/testar-navegador.sh
curso-app/scripts/testar-conferir-commits.sh
```

## Arquitetura
- Astro gera páginas estáticas dos Markdown em `celilac-backend/method/didatico/curso/`; nginx sem privilégios serve os arquivos, sem Node na imagem final.
- O app não acessa a internet nem lê o repositório do aluno.
- A navegação do curso é uma sequência linear com anterior/próximo; o grafo de pré-requisitos fica disponível como complemento.
- Gabaritos usam `<details>` e `<summary>` nativos. As rotas são públicas e o conteúdo não é protegido; a instrução para tentar primeiro não é uma barreira de acesso.
- O mapa, o índice, a apresentação, o caso real UC12 e os links entre páginas têm navegação explícita de retorno.
