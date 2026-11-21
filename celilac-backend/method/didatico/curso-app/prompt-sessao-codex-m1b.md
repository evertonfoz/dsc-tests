# Prompt da sessão: merge do M1a e implementação do M1b (para o Codex)

> Escrito em 2026-11-21, ao fim da sessão do M1a. Cole o bloco abaixo no Codex, aberto na raiz do repositório `dsc-tests`.
> A delegação de merge registrada aqui vale **só para o PR #88** e **só para a sessão aberta com este prompt**.

```text
Sessão aberta na raiz do repositório dsc-tests. Os caminhos são relativos a celilac-backend/,
salvo curso-app/ e mascotes/, que ficam na raiz. Atue em português do Brasil, técnico-acadêmico.

1. Protocolo (antes de qualquer coisa)
- Leia por inteiro method/AGENTS.md: as regras valem acima desta conversa (nunca inventar
  evidência, nada destrutivo sem autorização, merge e fechamento de issue são humanos salvo
  delegação registrada, o agente não se autoavalia).
- Leia method/didatico/curso-app/prompt-plano-da-aplicacao.md (seção 0 em diante) e siga-o.
- Leia method/didatico/curso-app/estado.md. Se divergir do repositório, vale o repositório
  e você registra a divergência.
- Em até cinco linhas: etapa atual, decisões tomadas, próximo passo.

2. Merge do PR #88 (M1a), DELEGADO pelo professor
- O professor autorizou você a fazer o merge SÓ do PR #88, com esta condição: CI verde no
  último commit do PR. Antes de integrar, confira com gh pr view 88 e gh pr checks 88
  (o último commit conhecido é 3975d87; se houver outro, confira o CI dele).
  Não apague a branch. Não vale para nenhum outro PR.
- Depois do merge, registre no estado.md a data, o commit de merge, o commit da cabeça e
  o resultado dos trabalhos do CI, obtidos de fato com gh (nunca invente).

3. PR do registro desta passagem (docs/curso-app-prompt-codex-m1b)
- Há um PR de documentação aberto a partir da branch docs/curso-app-prompt-codex-m1b, com
  este prompt e o registro da delegação. O merge dele NÃO está delegado: diga ao professor
  o número e o estado do CI e espere a decisão dele.

4. M1b: siglas, grafo e mascotes (plano já aprovado)
- Plano: method/didatico/curso-app/etapas/E9-M1-plano.md, seções 5, 6, 7 e 11
  (critérios 2 e 3), e a seção 14, que registra como o M1a foi feito.
- Antes de criar a branch feat/curso-app-m1b e o PR, peça autorização ao professor.
  Merge do M1b não delegado.
- Decisões já aprovadas: definição em toda ocorrência de sigla do quadro do README do curso,
  mas só a primeira de cada seção de nível 2 entra na ordem do Tab; mascotes sorteados na
  construção, com semente no commit de origem, sem repetição enquanto houver mascote;
  grafo em SVG gerado na construção, sem biblioteca, com a lista do mapa como equivalente
  acessível (desenho oculto do leitor de tela, links com tabindex -1); arestas condicionais
  tracejadas, com legenda em texto; avisos de construção (sem falhar) para siglas fora do
  quadro (hoje: RED, GREEN, SUB, NUL) e para sigla usada antes de ser explicada.
- A construção FALHA se o quadro de siglas estiver ausente, tiver sigla repetida ou
  definição vazia.

5. O que a sessão anterior aprendeu (use; confira no código antes de confiar)
- O Astro 7.4.7 usa o processador Sätteri. A conversão do Markdown é um plugin do Sätteri em
  curso-app/src/conteudo/conversao.ts (visitante por elemento; ctx.parent, replaceNode,
  wrapNode, setProperty). As siglas entram aí ou num plugin irmão. Não instale
  @astrojs/markdown-remark.
- A política de segurança do nginx bloqueia script e estilo embutidos. O script das siglas
  (toque e Esc) tem de sair em arquivo próprio; astro.config.mjs já tem
  vite.build.assetsInlineLimit 0. Teste que nenhuma página tem script embutido nem
  violação de CSP no console.
- Mascotes: copiar mascotes/web/ no Dockerfile e liberar em Dockerfile.dockerignore.
  Imagens decorativas, alt vazio.
- O teste de celular compara a largura com os 320 pixels configurados, não com innerWidth
  (o celular alarga a janela junto com o conteúdo). Elemento com position absolute dentro de
  contêiner com rolagem precisa de contêiner posicionado.
- Fixações de versão do pnpm 12 ficam em curso-app/pnpm-workspace.yaml, não no package.json.
- e2e/ e playwright.config.ts estão fora do astro check (sem @types/node, que não está
  autorizado). Vitest só em tests/; Playwright em e2e/*.e2e.ts.
- Rodar localmente: curso-app/scripts/construir.sh, testar-imagem.sh "$(git rev-parse HEAD)",
  testar-construcao-negativa.sh, testar-navegador.sh e testar-conferir-commits.sh;
  em curso-app/: pnpm test, pnpm check, pnpm audit --audit-level high;
  em celilac-backend/: node method/scripts/check-links.mjs method docs/uc (confira o código
  de saída antes de qualquer commit).
- O CI não envia artefatos (repositório público) e não publica imagem. Não mude o nome dos
  trabalhos do CI.

6. Preferências do professor
- Material em Markdown; tom neutro sobre IA (orientar a lidar com ela, sem promover nem
  desencorajar); toda sigla ou termo em inglês explicado na primeira aparição em cada
  módulo e em cada tela; textos da interface só em curso-app/src/textos.ts.
- Não altere arquivos do curso (method/didatico/curso/) sem pedir; achados de conteúdo vão
  para o estado.md como pendência da E3, parte 2.
- Ao fim de cada etapa: o que foi feito, o que NÃO foi verificado e o que o professor
  precisa decidir. Atualize o estado.md antes de encerrar.
```
