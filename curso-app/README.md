# curso-app — Aplicação web do curso

Aplicação interativa que conduz o aluno pelo curso "Implementando um caso de uso com evidência" e o ajuda a produzir, no **seu** repositório, os mesmos artefatos e evidências do UC12 do CeliLac.

## Situação
**Em planejamento.** Ainda não há código: a implementação só começa na etapa E9, depois que o plano (etapas E0 a E8) for validado pelo professor.

- Prompt e etapas do plano: `celilac-backend/method/didatico/curso-app/prompt-plano-da-aplicacao.md`
- Estado do trabalho: `celilac-backend/method/didatico/curso-app/estado.md`
- Documentos de cada etapa: `celilac-backend/method/didatico/curso-app/etapas/`

## Decisões já tomadas
- Projeto próprio, nesta pasta, na raiz do repositório `dsc-tests`.
- Execução **local**, na máquina de quem usa, a partir de uma **imagem Docker** (publicação na internet prevista para o futuro).
- O conteúdo é embutido na imagem quando ela é construída, e a aplicação mostra o commit de origem.
- A aplicação **nunca lê** o repositório do aluno. O kit inicial é entregue como `.zip`, e o progresso fica no navegador.
- Sem login: acesso aberto.
- Curso **autônomo**: sem área do professor; o aluno registra o progresso só para si.
- As atividades acontecem no repositório do aluno; os gabaritos são exibidos como uma etapa do curso.
- Conteúdo lido dos Markdown de `celilac-backend/` (fonte única) e mascotes de `mascotes/`.
