# Estado do trabalho — Aplicação web do curso

> Fonte da verdade para retomar o trabalho em qualquer sessão. A IA lê este arquivo no início e o atualiza no fim. Em caso de divergência com o repositório, vale o repositório e a divergência é registrada aqui.

| Campo | Valor |
|---|---|
| Etapa atual | E5 concluída; **próxima: E6** (verificação de evidências e limites) |
| Última atualização | 2026-11-21 |
| Responsável pelas decisões | o professor |

## Etapas
| Etapa | Assunto | Situação | Documento | Validada por |
|---|---|---|---|---|
| E0 | Leitura e perguntas bloqueantes | respondida e registrada | [E0-leitura-e-perguntas-bloqueantes.md](etapas/E0-leitura-e-perguntas-bloqueantes.md) | professor (respostas de 2026-11-21) |
| E1 | Plano de arquitetura | concluída | [E1-plano-de-arquitetura.md](etapas/E1-plano-de-arquitetura.md) | professor (2026-11-21) |
| E2 | Pipeline de conteúdo e metadados | concluída (revisável ao ver a aplicação em execução) | [E2-pipeline-de-conteudo.md](etapas/E2-pipeline-de-conteudo.md) | professor (2026-11-21) |
| E3 | Atualização do repositório de conteúdo (se necessária) | parte 1 concluída (PRs #73 a #76); parte 2 depois de ver a aplicação | [E3-atualizacao-do-conteudo.md](etapas/E3-atualizacao-do-conteudo.md) (registro retroativo, 2026-11-21); PRs [#73](https://github.com/evertonfoz/dsc-tests/pull/73), [#74](https://github.com/evertonfoz/dsc-tests/pull/74), [#75](https://github.com/evertonfoz/dsc-tests/pull/75), [#76](https://github.com/evertonfoz/dsc-tests/pull/76) | merge delegado à IA, com CI verde; registro retroativo aprovado pelo professor (2026-11-21) |
| E4 | Modelo de dados, papéis e privacidade | concluída | [E4-modelo-de-dados-e-privacidade.md](etapas/E4-modelo-de-dados-e-privacidade.md) | professor (2026-11-21) |
| E5 | Kit do repositório do aluno e GitHub | concluída | [E5-kit-e-github.md](etapas/E5-kit-e-github.md) | professor (2026-11-21) |
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
| 2026-11-21 | Versionar `mascotes/web/` (23 PNG de 512×512, 1,9 MB) para a imagem Docker poder ser construída pelo CI. Os originais de 1024×1024 em `mascotes/` continuam fora do git. | Professor |
| 2026-11-21 | Caminho até a aplicação em execução: seguir o protocolo, etapa por etapa (opção a); a E4 começa em nova sessão. | Professor |
| 2026-11-21 | E4: aprovado o modelo de dados por escopos (compartilháveis na equipe: `projeto` e `casoDeUso`; pessoais: `conteudos`, `passos`, `fases`, `preferencias`) e a lista de variáveis da seção 3.1. | E4, seção 3 |
| 2026-11-21 | E4: `localStorage` em uma chave, com exportar "projeto" e "tudo", cópia automática antes de importar, validação e migração por versão de esquema. | E4, seções 4 e 5 |
| 2026-11-21 | E4: gabarito liberado por tentativa não vazia ou abertura antecipada com aviso e registro; "A solução" não é escondida; m04 e apoio D liberam o gabarito comum com a tentativa de qualquer um; nota provisória "escrito originalmente para o professor" até a reescrita. | E4, seção 6 |
| 2026-11-21 | E4: fases A a F só como declaração do aluno, "a confirmar" sem link; colar o `state.yaml` fica para a E6. | E4, seção 3.3 |
| 2026-11-21 | E4: trocar "individual ou em dupla" por "individual ou em equipe" em `projeto-final.md`, na E3, parte 2. | E4, seção 8 |
| 2026-11-21 | Autorizado abrir branch e PR da E4 ("tudo aprovado"). Merge **não** delegado nesta sessão. | Professor |
| 2026-11-21 | E3: registro retroativo da parte 1 aprovado. | E3 |
| 2026-11-21 | E5: o kit é ponto de partida, não resultado: **sem** `state.yaml`, `ci.yml`, Compose, `Dockerfile` e `verify.sh` prontos (são prática do m02, apoio C, apoio D e m04). Diverge do texto do prompt ("state.yaml inicial"); vale esta decisão. | E5, seção 2 |
| 2026-11-21 | E5: entrega em `.zip` com `repositorio/` e `para-voce/`, `LEIA-ME.md`, `manifesto.json` e prompt de aplicação que não sobrescreve; cópia arquivo a arquivo como alternativa na tela; repositório-modelo do GitHub registrado como possibilidade futura (publicação é decisão do professor). | E5, seção 3 |
| 2026-11-21 | E5: conteúdo do kit conforme as seções 4.2 a 4.4 (inclui os documentos 01 a 06 de `method/didatico/`; exclui `didatico/curso/`, `didatico/curso-app/` e `exemplos/`). | E5, seção 4 |
| 2026-11-21 | E5: tornar `method/` portátil (opção i), marcando com `<!-- links:ignore -->` e explicando as referências ao CeliLac e a `method/exemplos/`, em **PR de conteúdo próprio**, antes do marco que gera o kit. Branch e PR autorizados; merge **não** delegado. | E5, seção 6 |
| 2026-11-21 | E5: `AGENTS.md` só em `method/`; ajustar a linha 4 no mesmo PR da opção (i). | E5, seção 6.1 |
| 2026-11-21 | E5: proteção da `main` como passo opcional do m04, com o aviso de que as regras orientam o assistente mas não o travam. | E5, seção 7.3 |
| 2026-11-21 | Autorizado abrir branch e PR da E5 (com o registro da E3). Merge **não** delegado nesta sessão. | Professor |
| 2026-11-21 | P8: projeto próprio em `curso-app/`, na raiz do `dsc-tests`; criado só com README (sem código até a E9). | E0 |

## Requisitos acrescentados pelo professor
| Data | Requisito | Etapas afetadas |
|---|---|---|
| 2026-11-21 | Em **cada etapa que exija prática**, o curso exibe **tudo o que o aluno precisará criar no repositório dele**, com explicações, com **botão de copiar** o conteúdo e com um **prompt** que ele possa executar no próprio projeto. | E2 (formato do passo de prática), E3 (escrever o conteúdo), E5 (kit e prompts), E7 (marcos) |

## Pendências e divergências
- Requisito de 2026-11-21: hoje as seções "Pratique no seu domínio" (17 seções, 91 passos) dizem **o que** criar, mas quase nunca trazem o conteúdo pronto para copiar; as exceções são o `ci.yml` do apoio C e o modelo de `state.yaml` citado no m02. O conteúdo de referência existe no `celilac-backend` (templates, Dockerfile, compose, scripts, código e testes do UC12, documentos de `docs/uc/uc12/`), mas precisa ser **escrito** para cada passo. Formato na E2, escrita na E3.
- Passos de prática que dependem de outra pessoa (m11, passo 5; m12, passo 6) conflitam com o curso autônomo para quem estuda sozinho; tratar com a revisão do texto (E2 e E3).
- O texto do curso pressupõe professor: os 14 gabaritos abrem com "Uso exclusivo do professor" e há passagens que mandam o aluno recorrer ao professor (lista na E0, seção 3.3). Num curso autônomo, isso pede revisão de conteúdo: **discutir e decidir na E2** (proposta trecho a trecho), **aplicar na E3** (PRs pequenos). O texto dos gabaritos depende de decisão do professor.
- Títulos de seção: na E3 verificou-se que as quatro seções que a aplicação usa ("Antes de ler a solução", "Pratique no seu domínio", "Como saber que funcionou", "Como lidar com a IA") existem em todos os módulos e apoios e são reconhecíveis **pelo início do título**. Só o apoio B precisou mudar (PR da E3, parte 1). Diferença em relação à E2, seção 10, item 1: os demais títulos **não** serão uniformizados; o gerador da aplicação reconhece pelo prefixo. As seções "A tentativa ingênua" e "A solução" faltam ou têm outro nome em m00, m03, apoio A e apoio B; isso não afeta a aplicação.
- **Inconsistência encontrada (não corrigida):** `method/didatico/curso/m04-gabarito.md` tem título "Módulo 4 e Apoio D" e uma seção "Apoio D", mas o `README.md` do curso (linha 19) diz que o apoio D não tem gabarito. Proposta: corrigir o README na parte 2 da E3 (texto dos gabaritos). Decisão do professor.
- **Inconsistência encontrada (não corrigida):** o m01 pede o apoio B "se você ainda não escreveu um teste com `it(...)`", mas a sequência "Próximo:" dos módulos só leva ao apoio B depois do m02 (m00 → m01 → apoio A → m02 → apoio B → m03). O front matter registra isso como pré-requisito condicional (`prerequisitos_se_precisar`), sem mudar o texto.
- Front matter (E3, parte 1, PR 2): inserido em 32 arquivos (13 módulos, 4 apoios, projeto final, 14 gabaritos); o `README.md` do curso fica sem, por ser o índice. Campos além da E2, seção 3: `prerequisitos_se_precisar` (m01 e projeto final) e `gabarito_de` (gabaritos); `pratica` só entra quando o arquivo de prática existir. O apoio D aponta para `m04-gabarito`, porque é esse arquivo que o cobre.
- Modelo de caso de uso (E3, parte 1, PR 3): `method/templates/caso-de-uso.md`, com a estrutura de `docs/planejamento/uc12-cadastrar-produto/uc-12.md` e os identificadores RF, RN, FA, FE e CA. Listado em `method/README.md`. **Ainda não é citado por nenhum módulo**: a referência no m00 (prática, passo 2) entra com o arquivo de prática do m00, na parte 2.
- Prática piloto (E3, parte 1, PR 4): `method/didatico/curso/m02-pratica.md`, com 5 passos no formato da E2, seção 5.2. As saídas esperadas dos passos 3 e 4 foram obtidas executando `check-state.sh` sobre o modelo do passo 2 preenchido com valores de exemplo (OK com saída 0; 5 erros com saída 1). As mensagens do passo 5 (`--remote`) foram tiradas do código de `method/scripts/check-state.mjs`, **sem execução** contra um repositório. O m02 ganhou `pratica: m02-pratica` e uma linha apontando para o arquivo.
- As referências de linha da E2, seção 9, valem para o commit `9e47c34`; o front matter desloca as linhas dos arquivos.
- Aluno individual não tem revisão independente; o curso deve orientar a declarar isso, como fez o UC12.
- **Divergência encontrada na E4 (não corrigida ainda):** `method/didatico/curso/projeto-final.md`, linha 14, diz "trabalho individual ou em dupla"; a decisão P6 diz equipes de 2 ou mais. Troca por "individual ou em equipe" **aprovada**, a aplicar na E3, parte 2.
- E4, seção 3.1: lista consolidada das variáveis do projeto (inclui `documento_uc`, `issue_principal` e `login`, usadas no `m02-pratica.md` e ausentes da E2, seção 7).

- **Divergência (2026-11-21, apontada pelo professor):** a E3 não tinha documento em `etapas/`, embora o prompt peça um por etapa de E0 a E8. Corrigido com um **registro retroativo** da parte 1 ([E3](etapas/E3-atualizacao-do-conteudo.md)), sem decisão nova, a partir deste arquivo e dos PRs #73 a #76 conferidos com `gh pr view` e `gh pr checks`.
- **Divergência encontrada na E5 (não corrigida):** `method/` copiado para um repositório novo, sem `didatico/curso/`, `didatico/curso-app/` e `exemplos/`, **falha** no `check-links` com 35 referências quebradas (executado numa pasta temporária). Referências a arquivos do CeliLac e a `method/exemplos/` nunca existirão no repositório do aluno. Correção aprovada (E5, seção 6, opção i): PR de conteúdo próprio, ainda não aberto.
- **Divergência encontrada na E5 (não corrigida):** `method/AGENTS.md`, linha 4, manda copiar o arquivo para a raiz; o projeto de referência não tem `AGENTS.md` na raiz e o orquestrador lê `method/AGENTS.md`. Ajuste aprovado (E5, seção 6.1), no mesmo PR da opção (i).
- **Pendência da E5:** o exemplo de `ci.yml` do apoio C não tem `permissions: contents: read`, que o CI de referência tem (linha 16). Entra no arquivo de prática do apoio C.
- **Pendência da E5:** `m02-pratica.md`, "Antes de começar", manda copiar `method/` do repositório do curso; passa a apontar para o kit (E3, parte 2).

**Decisão para a próxima sessão:** seguir o protocolo, **uma etapa por vez**. A E5 foi validada; a próxima etapa é a **E6**. O PR de `method/` portátil (E5, opção i) está autorizado e pode ser feito antes ou depois da E6, por escolha do professor.

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
| 2026-11-21 | Plano | PR #72 (E0 a E2) integrado | [#72](https://github.com/evertonfoz/dsc-tests/pull/72) |
| 2026-11-21 | E3 | Parte 1: título do apoio B (#73), front matter em 32 arquivos (#74), modelo de caso de uso (#75), prática piloto do m02 (#76) | PRs #73 a #76 |
| 2026-11-21 | — | `mascotes/web/` versionado; sessão encerrada; E4 marcada para 2026-11-22 | PR de mascotes (ver git log) |
| 2026-11-21 | — | Escolhido seguir o protocolo etapa por etapa; próxima sessão começa pela E4 | este PR |
| 2026-11-21 | — | Prompt atualizado: sessão na raiz do `dsc-tests`; item 8 (sem área do professor; gabaritos como etapa); E4 com papel único; merge só com delegação explícita registrada; decisões do `estado.md` prevalecem sobre o prompt | PR do prompt (ver git log) |
| 2026-11-21 | E4 | Modelo de dados por escopos, papel único com modos individual e equipe, `localStorage` com exportar e importar, liberação dos gabaritos, privacidade; divergência "em dupla" registrada | [E4](etapas/E4-modelo-de-dados-e-privacidade.md) (sem PR) |
| 2026-11-21 | E4 | Professor aprovou todas as recomendações da E4; E4 encerrada | [E4](etapas/E4-modelo-de-dados-e-privacidade.md), PR da E4 (ver git log) |
| 2026-11-21 | E3 | Registro retroativo da parte 1, depois de o professor notar a falta do documento | [E3](etapas/E3-atualizacao-do-conteudo.md) (sem PR) |
| 2026-11-21 | E5 | Kit como ponto de partida (`.zip` com `repositorio/` e `para-voce/`), formas de entrega, permissões mínimas, limite do assistente de IA; simulação de `method/` portátil: `check-links` falha com 35 referências | [E5](etapas/E5-kit-e-github.md) (sem PR) |
| 2026-11-21 | E5 | Professor aprovou todas as recomendações da E5 e o registro da E3; E5 encerrada | PR da E5 (ver git log) |
