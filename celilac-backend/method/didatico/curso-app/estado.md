# Estado do trabalho — Aplicação web do curso

> Fonte da verdade para retomar o trabalho em qualquer sessão. A IA lê este arquivo no início e o atualiza no fim. Em caso de divergência com o repositório, vale o repositório e a divergência é registrada aqui.

| Campo | Valor |
|---|---|
| Etapa atual | E3, parte 1 (em andamento) |
| Última atualização | 2026-11-21 |
| Responsável pelas decisões | o professor |

## Etapas
| Etapa | Assunto | Situação | Documento | Validada por |
|---|---|---|---|---|
| E0 | Leitura e perguntas bloqueantes | respondida e registrada | [E0-leitura-e-perguntas-bloqueantes.md](etapas/E0-leitura-e-perguntas-bloqueantes.md) | professor (respostas de 2026-11-21) |
| E1 | Plano de arquitetura | concluída | [E1-plano-de-arquitetura.md](etapas/E1-plano-de-arquitetura.md) | professor (2026-11-21) |
| E2 | Pipeline de conteúdo e metadados | concluída (revisável ao ver a aplicação em execução) | [E2-pipeline-de-conteudo.md](etapas/E2-pipeline-de-conteudo.md) | professor (2026-11-21) |
| E3 | Atualização do repositório de conteúdo (se necessária) | parte 1 em andamento; parte 2 depois de ver a aplicação | | |
| E4 | Modelo de dados, papéis e privacidade | pendente | | |
| E5 | Kit do repositório do aluno e GitHub | pendente | | |
| E6 | Verificação de evidências e limites | pendente | | |
| E7 | Marcos, testes e critérios de aceite | pendente | | |
| E8 | Riscos e perguntas em aberto | pendente | | |
| E9 | Implementação por marcos | não iniciada | | |

## Decisões
| Data | Decisão | Origem |
|---|---|---|
| 2026-11-21 | Os mascotes da pasta `mascotes/` (raiz do `dsc-tests`, fora deste projeto) podem ser usados na aplicação, em ordem aleatória e minimizando repetição. Qualquer outro conteúdo de fora de `celilac-backend/` exige pedido prévio. | Professor, na sessão de 2026-11-21 |
| 2026-11-21 | P2: a aplicação roda localmente, a princípio. | E0 |
| 2026-11-21 | P3: sem login, acesso aberto. | E0 |
| 2026-11-21 | P5: a stack do aluno é igual à do CeliLac (perfil `celilac-nest`). | E0 |
| 2026-11-21 | P6: há alunos individuais e equipes de 2 ou mais. | E0 |
| 2026-11-21 | P7: a aplicação inclui o curso e o UC12 navegável; o restante do método entra como link. | E0 |
| 2026-11-21 | P1′: os gabaritos podem ser exibidos ao aluno, como uma etapa do curso. | E0 |
| 2026-11-21 | P4′: sem acompanhamento pelo professor; curso autônomo, o aluno registra só para si; sem área do professor. | E0 |
| 2026-11-21 | Escopo: as atividades acontecem no projeto do aluno; o curso o ajuda a obter nele o que se obteve no projeto base (`celilac-backend`). | E0 |
| 2026-11-21 | E1: arquitetura B′ confirmada: imagem Docker executada localmente, conteúdo embutido na construção com o commit de origem visível, kit em `.zip`, progresso no navegador com exportar e importar, preparada para publicação futura na internet. | E1, seção 7 |
| 2026-11-21 | E1: a aplicação do curso **nunca lê** o repositório do aluno; o repositório da aplicação do aluno é independente. | E1, seção 7 |
| 2026-11-21 | E1: o código da aplicação fica em `curso-app/` no `dsc-tests`; "independente" significa independente na execução. | E1, seção 7 |
| 2026-11-21 | E1: confirmada a simplificação: site estático gerado na construção da imagem e servido no contêiner, sem servidor de aplicação. | E1, seção 7.1 |
| 2026-11-21 | Autorizado usar `.github/workflows/celilac-backend-ci.yml` (raiz do `dsc-tests`) como referência de conteúdo. | Professor |
| 2026-11-21 | Quando o curso pedir o caso de uso do aluno, ele envia um arquivo Markdown. | Professor |
| 2026-11-21 | E2: aceitas todas as recomendações: front matter da seção 3; passo de prática da seção 5.2; prática em arquivo próprio por módulo (5.1 b); gabaritos reescritos para autoestudo (8 c); propostas da seção 9; canal para sigla sem explicação: abrir issue no repositório do curso. **O professor pode rever qualquer uma ao ver a aplicação em execução.** | E2 |
| 2026-11-21 | E3 dividida em duas partes. **Parte 1 (agora):** PR de títulos de seção, PR de front matter, PR do modelo `caso-de-uso.md` e PR do módulo piloto m02 com arquivo de prática. **Parte 2 (depois de ver a aplicação em execução):** demais arquivos de prática, reescrita dos gabaritos e textos da seção 9 da E2. | Professor |
| 2026-11-21 | **Delegação registrada:** o professor autorizou a IA a abrir branches e PRs da E3, parte 1, e do plano, **e a fazer o merge** deles. Condição mantida pela IA: só integrar com o CI verde. Apagar branches não foi autorizado. | Professor |
| 2026-11-21 | P8: projeto próprio em `curso-app/`, na raiz do `dsc-tests`; criado só com README (sem código até a E9). | E0 |

## Requisitos acrescentados pelo professor
| Data | Requisito | Etapas afetadas |
|---|---|---|
| 2026-11-21 | Em **cada etapa que exija prática**, o curso exibe **tudo o que o aluno precisará criar no repositório dele**, com explicações, com **botão de copiar** o conteúdo e com um **prompt** que ele possa executar no próprio projeto. | E2 (formato do passo de prática), E3 (escrever o conteúdo), E5 (kit e prompts), E7 (marcos) |

## Pendências e divergências
- Requisito de 2026-11-21: hoje as seções "Pratique no seu domínio" (17 seções, 91 passos) dizem **o que** criar, mas quase nunca trazem o conteúdo pronto para copiar; as exceções são o `ci.yml` do apoio C e o modelo de `state.yaml` citado no m02. O conteúdo de referência existe no `celilac-backend` (templates, Dockerfile, compose, scripts, código e testes do UC12, documentos de `docs/uc/uc12/`), mas precisa ser **escrito** para cada passo. Formato na E2, escrita na E3.
- Passos de prática que dependem de outra pessoa (m11, passo 5; m12, passo 6) conflitam com o curso autônomo para quem estuda sozinho; tratar com a revisão do texto (E2 e E3).
- O texto do curso pressupõe professor: os 14 gabaritos abrem com "Uso exclusivo do professor" e há passagens que mandam o aluno recorrer ao professor (lista na E0, seção 3.3). Num curso autônomo, isso pede revisão de conteúdo: **discutir e decidir na E2** (proposta trecho a trecho), **aplicar na E3** (PRs pequenos). O texto dos gabaritos depende de decisão do professor.
- Títulos de seção e linhas de pré-requisito não são uniformes entre módulos (detalhes na E0, seção 2.2); tratar em E2 e E3.
- Aluno individual não tem revisão independente; o curso deve orientar a declarar isso, como fez o UC12.

## Histórico de sessões
| Data | Etapa | O que foi feito | PR ou documento |
|---|---|---|---|
| 2026-11-21 | E0 | Leitura do material, inventário do curso e dos mascotes, oito perguntas bloqueantes | [E0](etapas/E0-leitura-e-perguntas-bloqueantes.md) (sem PR) |
| 2026-11-21 | E0 | Respostas P2, P3, P5 a P8 registradas; P1 e P4 reformuladas; criada a pasta `curso-app/` na raiz com README | E0, seção 3.1 (sem PR) |
| 2026-11-21 | E0 | P1′ e P4′ respondidas; curso definido como autônomo; E0 encerrada | E0, seção 3.3 (sem PR) |
| 2026-11-21 | E1 | Três alternativas locais comparadas (estático, servidor Node local, híbrido); recomendada a B | [E1](etapas/E1-plano-de-arquitetura.md) (sem PR) |
| 2026-11-21 | E1 | Professor propôs distribuir a aplicação em imagem Docker e publicá-la na internet no futuro; E1 revisada (seção 6) com a alternativa B′ | [E1](etapas/E1-plano-de-arquitetura.md) (sem PR) |
| 2026-11-21 | E1 | B′ confirmada; definido que a aplicação nunca lê o repositório do aluno; proposta a simplificação para site estático no contêiner | [E1](etapas/E1-plano-de-arquitetura.md), seção 7 (sem PR) |
| 2026-11-21 | E1 | Registrado o requisito de artefatos copiáveis e prompt por passo de prática; levantadas as 17 seções de prática (91 passos) | `estado.md`, "Requisitos acrescentados" (sem PR) |
| 2026-11-21 | E1 | Simplificação confirmada; E1 encerrada; autorizado o workflow de CI; caso de uso do aluno via Markdown | [E1](etapas/E1-plano-de-arquitetura.md) (sem PR) |
| 2026-11-21 | E2 | Pipeline, front matter, formato do passo de prática e prompts, envio do caso de uso, liberação dos gabaritos, lista de textos a revisar | [E2](etapas/E2-pipeline-de-conteudo.md) (sem PR) |
| 2026-11-21 | E2 | Recomendações aceitas pelo professor, revisáveis ao ver a aplicação em execução | [E2](etapas/E2-pipeline-de-conteudo.md) (sem PR) |
