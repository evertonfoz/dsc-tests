# E9 — Plano do marco M2 (UC12 navegável)

> Plano aprovado pelo professor em 2026-11-21. Implementação do M2 em andamento na branch `codex/curso-app-m2`; conteúdo-fonte do curso e do UC12 não foi alterado.
>
> Convenção: **[Confirmado no repositório]** leitura desta cópia local; **[Confirmado no GitHub]** consulta ao GitHub nesta sessão; **[Proposta]** decisão técnica para aprovação; **[Aguardando aprovação]** escolha do professor.

## 1. Estado de entrada

- **[Confirmado no GitHub]** PR [#90](https://github.com/evertonfoz/dsc-tests/pull/90) foi integrado pelo commit `9c71fcba21e009f8bc10d6879b75f421cce6d1e6`. O commit identificado pelo GitHub como merge do PR é esse SHA.
- **[Confirmado no GitHub]** Os seis checks do PR concluíram com sucesso no último commit testado, `721b5bcd5427aee8a24a00fcaeeaad2a68423ec6`.
- **[Confirmado no GitHub]** A branch `feat/curso-app-m1b` continua existente. O repositório informa `main` como branch padrão; ao buscar `curso-app/src/conteudo/siglas.ts` em `main`, o arquivo do M1b estava presente. O checkout local desta sessão está na branch `docs/curso-app-prompt-codex-m1b`, não em `main`; `gh` e `git ls-remote` não conseguiram acessar a API/servidor por restrição de rede local. <!-- links:ignore -->
- **[Confirmado no repositório]** E7 define M2 como páginas de todos os arquivos citados em `docs/uc/uc12/state.yaml`, mais o documento do UC12, com links a partir dos módulos que os citam. O aceite é: cada arquivo citado tem página e os links internos entre UC12 e módulos funcionam.
- **[Confirmado no repositório]** `state.yaml` cita 33 arquivos dentro de `docs/uc/uc12/` (6 relatórios e 27 evidências); somados `state.yaml`, `contrato.md` e o documento indicado pelo campo `documento`, são **36 arquivos**. Os 36 caminhos existem nesta cópia local. O documento é `docs/planejamento/uc12-cadastrar-produto/uc-12.md`, resolvido relativamente a `docs/uc/uc12/`.
- **[Confirmado no repositório]** `curso-app/` já publica o curso via Astro como site estático; M1b incluiu os caminhos UC12 no contexto e o workflow já observa mudanças em `celilac-backend/docs/uc/uc12/**`. O conversor atual deixa referências `docs/uc/uc12/` sem link, aguardando o M2.

## 2. Conteúdo e rotas propostas

**[Proposta]** Construir um inventário a partir do `state.yaml` validado. Cada arquivo listado recebe uma rota estática, e a geração falha se um caminho sair da raiz permitida, não existir, não for um arquivo suportado ou não tiver uma página correspondente.

Rotas legíveis sugeridas:

| Origem | Rota proposta | Apresentação |
|---|---|---|
| `docs/uc/uc12/state.yaml` | `/uc12/state/` | YAML original em bloco de código com rótulo e opção de quebra/rolagem acessível |
| `docs/uc/uc12/contrato.md` | `/uc12/contrato/` | Markdown renderizado |
| `docs/uc/uc12/relatorios/{A-F}.md` | `/uc12/relatorios/{A-F}/` | Markdown renderizado, mantendo o título e contexto do arquivo |
| `docs/uc/uc12/evidencias/**` | `/uc12/evidencias/{fase}/{nome-sem-extensão}/` | `.md` renderizado; `.txt` em texto escapado dentro de bloco de código |
| `docs/planejamento/uc12-cadastrar-produto/uc-12.md` | `/uc12/documento/` | Markdown renderizado, identificado como documento-fonte do caso de uso |

As rotas públicas cobrem os 36 arquivos do inventário do `state.yaml` e três arquivos UC12 adicionais citados diretamente pelos módulos publicados (39 destinos no total). Esses extras são incluídos para que os links do curso também funcionem., não para todos os arquivos potencialmente existentes nas pastas. O `state.yaml` será a navegação principal: os caminhos de `documento`, `relatorio` e `evidencias` serão links internos, com nome de fase e título de evidência quando disponíveis. Todas as páginas terão link de retorno ao índice do curso e ao `/uc12/state/`.

### Links a partir do curso

**[Proposta]** Estender o resolvedor de referências do Markdown para reconhecer caminhos relativos a `celilac-backend/` que, após normalização segura, apontem para os 39 destinos publicados (36 do inventário do `state.yaml` e três citações diretas adicionais). Exemplos já existentes em módulos publicados:

- m00: relatório de consistência e evidências D/contrato-atual e F/cobertura;
- m01: evidência F/cobertura;
- m03 e m05: evidências B de F03;
- m06 e m07: evidências B/C sobre falha de persistência e mutações;
- m08: evidência C/migration-banco-vazio;
- m09: evidências D e contrato;
- m11: evidências E e relatório E;
- m12: relatório F e evidências F/cobertura e auditoria.

O m10 e gabaritos também citam artefatos UC12; os gabaritos permanecem sem página no M2 porque a sua publicação pertence ao M3. O m00 demonstra o fluxo principal: abrir o estado, seguir para um relatório e então para uma evidência.

**[Proposta]** Mostrar em cada página UC12 uma pequena lista de “Módulos que citam este arquivo”, derivada das referências dos módulos que já são publicados. Isso fecha o percurso de volta sem editar conteúdo do curso. Não criar links de curso para rotas de gabarito.

## 3. Demonstração e testes do aceite E7

| Critério M2 da E7 | Evidência planejada | Nível |
|---|---|---|
| (1) Todo arquivo citado por `state.yaml` tem página | Teste unitário do inventário: exatamente os 36 destinos citados pelo estado, mais três referências diretas dos módulos existem e têm rota; retirar temporariamente um destino da cópia de teste ou apontar para caminho ausente deve falhar a construção. Playwright visita cada rota e confirma resposta 200, título e origem esperados. | CI e construção |
| (2) Links internos UC12 ↔ módulos funcionam | Teste unitário normaliza e resolve cada referência para o destino esperado; Playwright percorre os links de todos os módulos publicados que citam UC12 e valida status/rota, percorre os links do `state.yaml` para relatório, evidência e documento, e retorna do UC12 ao módulo relacionado. Nenhum destino interno deve ser externo. | CI e navegador |
| Demonstração pedida na E7 | Abrir `/m00/`; seguir o link para `/uc12/state/`; no estado abrir um relatório, e no relatório abrir uma evidência; retornar ao módulo citado. Mostrar também um link ao documento UC12. | Manual |

**[Proposta]** Adicionar testes de navegação em ambas as larguras que já são usadas pelo M1 (320 e 1280 px), conferir foco de teclado nas páginas com YAML/log longo e rodar axe-core nas 39 rotas. O aceite formal M2 não pede leitura de tela manual; testar VoiceOver/zoom continuará registrado como manual executado ou a confirmar.

## 4. Mudanças técnicas necessárias

### `curso-app/`

- **[Proposta]** Novo carregador/inventário UC12 que lê `state.yaml`, resolve caminhos relativos à pasta correta, valida a lista e liga os metadados às rotas. Sem aceitar caminho absoluto, `..` após resolução, symlink escapando da raiz ou extensão fora da lista permitida.
- **[Proposta]** Rotas Astro para índice `/uc12/` e páginas individuais, mais componentes para navegação hierárquica e conteúdo YAML/texto. Renderizar `.md` pela pipeline Astro; escapar YAML e `.txt` como texto, nunca como HTML.
- **[Proposta]** Ampliar `src/conteudo/referencias.ts` e os testes de unidade para os links UC12; hoje essa família de caminhos é deliberadamente excluída do link para GitHub. Resolver por mapa de rotas permitidas em vez de concatenar caminho não confiável à URL. <!-- links:ignore -->
- **[Proposta]** Definir nome e resumo de cada rota em português; páginas com um `h1`, estrutura consistente, links com nome compreensível e retorno ao módulo relacionado.
- **Dependência a decidir:** a árvore já contém `yaml` como dependência transitiva, mas `curso-app/package.json` não a declara diretamente. **Recomendação:** declarar explicitamente a versão já existente no lockfile e usar parser YAML mantido para ler a fonte de verdade, com esquema restrito e validação dos caminhos. Alternativa: escrever parser limitado a este formato; reduz dependência direta, mas aumenta risco de interpretar incorretamente mudanças válidas em comentários, arrays inline e estruturas YAML. Declarar a dependência exige atualizar o manifesto e o lockfile; não é autorização para instalar agora.

### Docker e contexto

- **[Confirmado no repositório]** O `Dockerfile` já constrói o site num estágio Node e copia apenas `dist/` para a imagem final nginx sem Node ou fontes.
- **[Proposta]** Permitir no `curso-app/Dockerfile.dockerignore` os caminhos necessários de `celilac-backend/docs/uc/uc12/` e do documento `celilac-backend/docs/planejamento/uc12-cadastrar-produto/uc-12.md`, respeitando a lista de permissão do contexto. Não abrir a árvore toda de `docs/planejamento/`.
- **[Proposta]** Copiar esses arquivos só no estágio de geração do `Dockerfile`. Nenhum Markdown/YAML-fonte deve ser copiado à imagem final. Ampliar `testar-imagem.sh` para verificar páginas UC12 esperadas e ausência de fontes originais na imagem servida.

### CI

- **[Confirmado no repositório]** `.github/workflows/curso-app-ci.yml` já dispara para mudanças em `curso-app/**`, `method/**` e `docs/uc/uc12/**`, roda build, Vitest, Playwright, auditoria e o verificador de links do método/UC12.
- **[Proposta]** Incluir o caminho do documento do planejamento na lista `paths` de `pull_request` e `push` (em `docs/planejamento/uc12-cadastrar-produto/uc-12.md`). Incluir testes de inventário, conteúdo escapado e links cruzados no job de qualidade/navegador; manter `fetch-depth: 0`, `contents: read` e não publicar imagem.
- **[Proposta]** Garantir que o script de links ou um teste específico confira as referências do inventário sem obrigar o CI do backend a validar novos destinos fora do escopo do M2.

## 5. Riscos e respostas

| Área | Risco | Resposta proposta |
|---|---|---|
| Navegação | Referências são relativas a raízes distintas: as do curso são caminhos no repositório; `documento` em YAML é relativo a `docs/uc/uc12/`; `.md`, `.txt` e `.yaml` exigem renderizações diferentes. | Um único inventário com caminhos canônicos e rotas explícitas; testes para cada referência; erro na construção para destino ausente ou ambíguo. |
| Navegação | Novos links no site podem revelar gabaritos ou páginas fora do inventário. | Só destinos citados pelo estado e aprovados no M2 recebem rota; excluir arquivos `*-gabarito.md`; teste negativo confirma ausência de rotas de gabarito. |
| Acessibilidade | YAML e evidências grandes podem criar rolagem horizontal, blocos sem foco ou links sem contexto. | Texto semântico, `<pre>` focável com rótulo/descrição, quebra de linhas quando não prejudica cópia, foco visível, axe-core e teclado em 320/1280 px. |
| Segurança | YAML ou evidência podem ser interpretados como HTML; caminho malformado pode escapar da pasta de conteúdo; renderização pode gerar link externo. | Escapar fontes não Markdown, renderizador Markdown sem HTML cru (ou sanitização explícita), caminhos normalizados e allowlist, teste com payload HTML inerte; revisar CSP e confirmar que não surgem requisições externas. |
| Conteúdo | Relatórios históricos descrevem o estado à época; o relatório A pode divergir do estado final. | Preservar a fonte sem reescrita e marcar visualmente data/fase; manter `state.yaml` como estado atual; linkar relatório como registro histórico. |
| Conteúdo | O documento UC12 contém trechos que qualificam pré-condições, regras e critérios como propostas ainda sujeitas à confirmação. | Mostrar sem adaptar ou apresentar como requisitos atuais; manter contexto de que o documento é a fonte de referência do exercício. |

## 6. Decisões para aprovação

| Decisão | Recomendação | Alternativa | Consequência da alternativa |
|---|---|---|---|
| Publicar o documento `uc-12.md` indicado em `state.yaml` | Sim, como `/uc12/documento/`, conforme escopo explícito do M2 na E7. | Só link externo para o GitHub. | Evita incluir esse conteúdo no site, mas não cumpre o escopo/página prometido pela E7 para o documento UC12. |
| Formato das rotas | Rotas sem extensão, hierárquicas e legíveis: `/uc12/state/`, `/uc12/relatorios/A/`, etc. | Manter o nome de arquivo/extensão na URL. | Facilita relacionar rota e fonte, mas expõe detalhes de implementação e produz URLs menos naturais. |
| Apresentação de YAML e evidências `.txt` | Fonte literal escapada em bloco de código, com navegação por links renderizados ao redor; `.md` como Markdown. | Fazer uma tela-resumo e esconder o fonte literal. | Exige transformar/interpretar o conteúdo e pode ocultar a evidência original que o aluno deve consultar. |
| Parser YAML | Declarar `yaml` diretamente, usando versão já presente no lockfile, e validar esquema e destinos. | Parser específico escrito no projeto. | Evita dependência direta, mas passa a manter código próprio de parsing e risco de incompatibilidade com YAML válido. |
| Navegação de retorno UC12 → módulos | Lista automática de módulos publicados que citam cada artefato, calculada na construção. | Apenas link de retorno ao índice/mapa. | Menos código, mas os links testados seriam essencialmente curso→UC12 e não um percurso cruzado nos dois sentidos. |

## 7. Estimativa, sequência e gate

- **Estimativa da E7:** 1 a 2 sessões para páginas YAML e evidências em texto. A proposta preserva essa faixa; a quantidade de 39 rotas é pequena, mas a validação de referências e renderizações é a parte de maior incerteza.
- **Sequência após aprovação:** (1) implementar inventário e renderizadores; (2) resolver links bidirecionais; (3) adicionar testes de build, unidade, navegador e imagem; (4) revisar a demonstração e registrar evidências no PR.
- **Gate proposto:** apresentar rotas e demonstração do m00; provar em CI os dois critérios da E7 e mostrar que nenhuma fonte foi parar na imagem nginx final. Acessibilidade manual fica identificada como executada ou a confirmar, sem afirmar evidência não obtida.
- **Aprovações necessárias para prosseguir:** aprovação deste plano e das escolhas da seção 6; autorização explícita para a implementação do M2, incluindo branch e PR; autorização explícita para declarar/atualizar a dependência `yaml` se essa recomendação for aceita. O merge do futuro PR não está autorizado por esta sessão.

## 8. Atualização registrada

O arquivo `estado.md` foi reconciliado nesta sessão: M1b consta como integrado pelo #90, com SHA de merge, SHA testado, seis checks verdes e branch mantida; o próximo marco consta como M2, com plano aprovado e implementação iniciada na branch `codex/curso-app-m2`. Os registros anteriores de M1a/M1b foram preservados como histórico.
