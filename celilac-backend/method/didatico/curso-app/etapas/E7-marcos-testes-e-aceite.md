# E7 — Marcos, testes e critérios de aceite

> Etapa E7 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **validada pelo professor em 2026-11-21** (todas as recomendações aprovadas).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso nem do método foi alterado nesta etapa. Nenhuma dependência foi instalada e nenhuma tecnologia citada aqui foi testada.

---

## 1. Entradas desta etapa (decisões já tomadas)
- **Arquitetura B′ simplificada:** site estático gerado na construção de uma imagem Docker e servido por ela; conteúdo embutido com o commit de origem visível; sem servidor de aplicação; a aplicação **nunca lê** o repositório do aluno e não chama serviços externos (E1, seção 7; E4, seção 7, regra 3).
- **Conteúdo:** front matter em 32 arquivos, prática no formato da E2, seção 5.2, e uma prática piloto (`method/didatico/curso/m02-pratica.md`) (E3, parte 1).
- **Dados:** um documento JSON no `localStorage`, por escopos, com exportar "projeto" e "tudo", importação validada e migração por versão (E4).
- **Kit:** `.zip` com `repositorio/` e `para-voce/`, sem `state.yaml`, CI, Compose e `Dockerfile` prontos (E5).
- **Verificação:** a aplicação só confere a forma (N1); `state.yaml` colado validado pelo núcleo do método; saídas coladas não são interpretadas (E6).
- [Fato] Os dois PRs de método que a E5 e a E6 exigiam antes dos marcos já estão integrados: [#82](https://github.com/evertonfoz/dsc-tests/pull/82) (`method/` portátil) e [#84](https://github.com/evertonfoz/dsc-tests/pull/84) (núcleo `method/scripts/check-state-core.mjs`, que exporta `parseYaml` e `validar` sem importar nada).
- A **E3, parte 2** (demais práticas, gabaritos para autoestudo, textos que pressupõem professor) acontece **depois de o professor ver a aplicação em execução** (decisão registrada no `estado.md`).

## 2. Tecnologia proposta (a E1, seção 4, deixou para cá)

Requisitos que a escolha precisa cumprir: gerar páginas a partir de Markdown com front matter; **falhar a construção** quando o conteúdo não estiver conforme; ter pouco JavaScript no navegador; **nenhum recurso de fora da imagem** (E4, seção 7, regra 3); TypeScript, a linguagem do curso.

| Opção | Como seria | Prós | Contras |
|---|---|---|---|
| (a) **Astro** (gerador de sites estáticos) | Coleções de conteúdo lidas de `celilac-backend/method/didatico/curso/`, com esquema do front matter; páginas interativas só onde há estado (progresso, kit, fases) | Front matter validado por esquema na construção; Markdown e TypeScript nativos; gera HTML puro por padrão | Mais uma ferramenta para manter atualizada |
| (b) Eleventy | Modelos de página e JavaScript à parte | Simples e estável | Validação de front matter e TypeScript precisam ser montados à mão |
| (c) Gerador próprio (Vite e bibliotecas de Markdown) | Um script lê os Markdown e escreve HTML | Controle total, nada de "mágica" | Navegação, rotas e recarga durante o desenvolvimento escritos do zero |

**[Recomendação] (a) Astro**, com:
- **Servidor da imagem:** servidor web estático mínimo, executado sem privilégios de administrador (por exemplo, a imagem do nginx sem privilégios). Nada de Node na imagem final.
- **Geração do `.zip`:** uma biblioteca pequena e sem dependências, empacotada na construção (por exemplo, `fflate`).
- **Markdown do aluno** (caso de uso enviado): exibido com HTML embutido **desligado**, não "limpo depois" (E4, seção 5).
- **Testes:** Vitest (o mesmo do curso) e Playwright para o navegador; axe-core para acessibilidade (seção 6).
- **Node na construção:** 24.21.0 e pnpm 12.8.1, os mesmos do projeto de referência ([Fato] `project-profile.md`, seção 2, e `.github/workflows/celilac-backend-ci.yml`, linhas 28 e 29).

[Suposição] Versões exatas, compatibilidade do Astro com o Node 24 e o tamanho final da imagem são conferidos no plano do M0. Instalar dependências exige sua autorização (prompt, seção 0, item 6).

## 3. Princípios dos marcos
1. **Cada marco é demonstrável**: termina com `docker build` e `docker run` e algo que você vê no navegador.
2. **Um marco, um ou poucos PRs pequenos**, com o próprio plano, testes e critérios de aceite (E9). Merge seu, salvo delegação registrada.
3. **Nenhum marco depende de conteúdo ainda não escrito.** Onde a prática ainda não existe, o marco é demonstrado com `m02-pratica.md` e funciona sem mudança de código quando as outras chegarem.
4. **A aplicação nunca diz mais do que prova.** Os rótulos da E6, seção 9, valem desde o primeiro marco que guardar algo do aluno.
5. **Comando único** para o aluno, com endereço fixo (E4, seção 4: outra porta "perde" o progresso). [Recomendação] `127.0.0.1:4321`. [Fato] O `compose.yaml` do projeto de referência publica as portas 5432, 3200 e 5435 (linhas 11, 28 e 49); nenhuma coincide. As do projeto do aluno podem ser outras.

## 4. Os marcos

| Marco | O que entrega | Depende de | Demonstração |
|---|---|---|---|
| **M0** Esqueleto e esteira | Projeto em `curso-app/`; `Dockerfile` em dois estágios (gerar e servir); duas páginas (índice do curso e `m00`); commit de origem no rodapé; validação do front matter que **impede a imagem** se falhar; CI próprio da aplicação | autorização para instalar dependências | `docker build` com um front matter quebrado de propósito falha com a mensagem do arquivo e do campo; corrigido, a imagem sobe e mostra o commit |
| **M1** Leitura do curso (**mínimo útil**) | Os 18 arquivos de leitura (13 módulos, 4 apoios, projeto final) e a prática do m02 como texto; mapa na ordem do front matter (`ordem`); "anterior" e "próximo"; grafo de pré-requisitos clicável, com os condicionais (`prerequisitos_se_precisar`) tracejados; siglas do README com definição ao tocar, focar ou passar o mouse; avisos de honestidade (só "criar" validado; durações não testadas; Docker necessário); mascotes em ordem aleatória sem repetição até esgotar; avisos de construção (sigla fora do quadro) | M0 | Ler o curso inteiro, sem rede, no computador e no celular. **Gabaritos ainda não são gerados**: sem a liberação do M3 eles estariam abertos |
| **M2** UC12 navegável (decisão P7) | Páginas de `docs/uc/uc12/` (`state.yaml`, contrato, relatórios A a F, evidências) e do documento do UC12, ligadas a partir dos módulos que as citam | M1 | Do m00, abrir o `state.yaml` do UC12 e dele um relatório e uma evidência |
| **M3** Progresso e gabaritos | Modelo de dados versão 1 com `meta`, `conteudos` e `preferencias`; "lido"; tentativa da atividade "Antes de ler a solução"; liberação dos 14 gabaritos (E4, seção 6, com a nota provisória); checklists "Como saber que funcionou" com o rótulo "declarado por você"; grafo mostrando o que falta; tela **"Seus dados"** (exportar "tudo", importar com cópia automática antes, apagar); aviso de armazenamento e pedido de armazenamento persistente | M1 | Registrar tentativa no m01, ver o gabarito liberado ao lado dela; exportar, apagar, importar e ver tudo de volta |
| **M4** Meu projeto e prática guiada | Escopos `projeto` e `casoDeUso`; envio do Markdown do caso de uso, com extração de `RF`, `RN`, `CA`, `FA` e `FE` e avisos; variáveis da E4, seção 3.1; passo de prática renderizado (arquivo de destino, botão de copiar, prompt, `{{variavel}}` substituída ou destacada); variantes "sozinho" e "em equipe"; escopo `passos` com impressão digital do texto; exportar e importar "projeto" | M3 | Com o modelo `method/templates/caso-de-uso.md` preenchido, percorrer os 5 passos do `m02-pratica.md` e copiar um `state.yaml` já com o UC do aluno |
| **M5** Kit inicial | `.zip` conforme a E5, seção 4 (`LEIA-ME.md`, `manifesto.json`, `para-voce/`, `repositorio/`), regras da E5, seção 4.4, e a tela com o limite do assistente de IA (E5, seção 7.3) | M4 | Baixar o kit, descompactar numa pasta vazia com `git init`, aplicar e rodar `check-links` |
| **M6** Fases e evidências | Tela de fases: declaração (E4) ou `state.yaml` colado validado por `check-state-core.mjs`; links conferidos pela forma (E6, seção 5); cobertura cruzada caso de uso × fatias (E6, seção 7); lista "o que a aplicação não prova"; aviso do UC12 colado por engano | M4 | Colar o `state.yaml` do UC12 (aviso), um inválido (erros iguais aos do terminal) e um válido do aluno |
| **M7** Acabamento e publicação | Divergência de conteúdo entre imagens (passo mudou; kit de imagem antiga), conforme a E8; revisão de acessibilidade manual; documentação do aluno; distribuição da imagem (seção 7) | M6 e E8 | Roteiro completo, do m00 ao kit e às fases, em navegador limpo, no computador e no celular |

**Por que esta ordem:**
- **M1 é o mínimo útil:** com ele o aluno já estuda o curso inteiro sem o GitHub, com siglas e pré-requisitos. Também é o ponto em que você pode ver a aplicação em execução e liberar a E3, parte 2.
- **M3 antes de M4:** o modelo de dados nasce pequeno (o que é pessoal) e cresce com o que é compartilhável. A migração por versão é testada já na primeira ampliação.
- **M5 antes de M6:** o aluno precisa do kit no m02 (o `m02-pratica.md` manda copiar `method/`), e das fases só na Fase A, no projeto final.
- **M2 separado de M1:** o UC12 tem outro tipo de página (YAML, evidências em texto) e não deve atrasar o mínimo útil.

### 4.1. Critérios de aceite por marco
Cada um é verificável por teste automatizado, salvo onde está escrito "manual".

| Marco | Critérios |
|---|---|
| M0 | (1) a imagem não é gerada se um arquivo tiver campo obrigatório ausente, `prerequisitos` apontando para `id` inexistente ou ciclo no grafo; (2) o rodapé mostra o commit passado na construção; (3) a imagem final não contém Node nem o código-fonte; (4) o contêiner responde só em `127.0.0.1:4321` no comando documentado; (5) o CI da aplicação roda em PR e não publica nada |
| M1 | (1) uma página por arquivo de leitura, na ordem de `ordem`; (2) toda sigla do quadro do README tem definição acessível por teclado e toque; (3) o grafo bate com o front matter (teste compara arestas); (4) **nenhuma requisição a outro endereço** em nenhuma página (teste no navegador registra as requisições); (5) nenhum gabarito publicado; (6) avisos de honestidade visíveis no índice e no projeto final; (7) axe-core sem violação de nível A ou AA nas páginas testadas |
| M2 | (1) todo arquivo citado em `docs/uc/uc12/state.yaml` tem página; (2) links internos entre UC12 e módulos funcionam (teste percorre os links) |
| M3 | (1) gabarito bloqueado até tentativa não vazia ou abertura antecipada registrada; (2) m04 e apoio D liberam o mesmo gabarito; (3) importar arquivo inválido não grava nada e mostra o motivo; (4) importar "tudo" baixa antes a cópia do estado atual; (5) dado da versão 1 lido sem perda depois da migração para a versão 2 (do M4); (6) nenhum rótulo "verificado" ou cor de sucesso em declaração |
| M4 | (1) extração dos identificadores do caso de uso testada com o modelo e com o documento do UC12; identificador repetido ou ausente gera aviso; (2) variável vazia aparece destacada, nunca em branco; (3) HTML embutido no Markdown do aluno é exibido como texto; (4) passo com texto mudado mostra "este passo mudou desde que você o marcou"; (5) `{{uc_pasta}}` com caractere fora de `[a-z0-9-]` é recusado |
| M5 | (1) o `.zip` tem só os caminhos da E5, seção 4.1, sem `..` nem caminho absoluto; (2) nenhum `{{` sobra nos arquivos de `repositorio/`; vazio vira `a confirmar`; (3) `manifesto.json` com commit e impressão digital de cada arquivo; (4) **o kit aplicado numa pasta vazia, mais um `scripts/verify.sh` vazio, passa no `check-links` com saída 0, e sem ele falha só nas 2 referências a `scripts/verify.sh`** (o mesmo resultado da simulação registrada no `estado.md` para o PR #82) |
| M6 | (1) para cada arquivo de `method/scripts/testes/fixtures/`, os erros na tela são os mesmos que `check-state.mjs` imprime no terminal (teste compara); (2) caminhos citados aparecem como "a confirmar no seu repositório"; (3) links fora da forma ou de outro repositório recebem aviso; (4) itens do caso de uso sem fatia são listados com "confira se há ADR ou pergunta registrada"; (5) a lista "o que a aplicação não prova" está na tela |
| M7 | Definidos na E8 e no plano do marco; manual: roteiro com leitor de tela e só teclado |

### 4.2. Pendências de conteúdo que tocam os marcos
| Pendência (do `estado.md`) | Marco afetado | Bloqueia? |
|---|---|---|
| 16 seções de prática ainda sem arquivo próprio | M4 | Não: M4 é demonstrado com o m02; as outras entram pela E3, parte 2, sem código novo |
| Gabaritos escritos para o professor | M3 | Não: nota provisória (E4, seção 6) |
| `m02-pratica.md`, "Antes de começar", manda copiar `method/` do curso | M5 | Não, mas o texto deve apontar para o kit quando o M5 for integrado |
| README do curso diz que o apoio D não tem gabarito | M3 | Não: a aplicação segue o front matter (`gabarito_de: [m04, apoio-d]`) |
| `ci.yml` do apoio C sem `permissions: contents: read` | — | Não toca a aplicação; entra na prática do apoio C |

## 5. Estimativa em faixa

**Unidade:** sessão de trabalho como as desta série (a IA prepara o PR, o CI roda, você revisa). Uma sessão por PR pequeno, em média.

| Marco | Faixa (sessões) | O que mais pesa |
|---|---|---|
| M0 | 1 a 2 | Montar a esteira (Docker, CI) sem surpresa de versão |
| M1 | 2 a 4 | Grafo acessível e siglas no toque |
| M2 | 1 a 2 | Páginas de YAML e evidências em texto |
| M3 | 2 a 3 | Importar, migrar e testar os estados do gabarito |
| M4 | 2 a 4 | Leitura do formato de passo e extração do caso de uso |
| M5 | 2 a 3 | Teste do kit aplicado com `check-links` |
| M6 | 2 a 3 | Equivalência entre a tela e o terminal |
| M7 | 1 a 3 | Depende da E8 e da decisão de distribuição |
| **Total da aplicação** | **13 a 24** | |
| Conteúdo da E3, parte 2 (fora da aplicação) | 8 a 16 | 16 práticas, gabaritos e textos; uma prática por sessão, algumas juntas |

**Premissas (se uma falhar, a faixa não vale):**
1. A tecnologia da seção 2 funciona com o Node 24.21.0 sem contorno.
2. O formato do conteúdo (front matter, passo de prática) não muda durante os marcos. Mudança aprovada por você reabre o marco que a lê.
3. Revisão de cada PR na mesma sessão ou na seguinte.
4. Sem teste com alunos reais: a estimativa não inclui ajustes vindos de uso em turma.
5. [Suposição] A faixa vem da comparação com o volume das etapas anteriores, não de medição. Ela é tão pouco testada quanto as durações do curso.

## 6. Estratégia de testes

| Camada | O que testa | Ferramenta | Onde roda |
|---|---|---|---|
| Conteúdo (contrato) | Front matter conforme o esquema; pré-requisitos apontam para `id` existente; grafo sem ciclo; siglas; `node method/scripts/check-links.mjs method docs/uc` com saída 0 | o próprio gerador e o validador do método | na construção da imagem; **falha impede a imagem** |
| Unidade | Leitura do passo de prática, substituição de variáveis, extração do caso de uso, migração e validação dos dados, forma dos links, nomes do `.zip` | Vitest | CI e máquina de quem desenvolve |
| Equivalência com o método | Tela de fases e `check-state.mjs` dão os mesmos erros nas mesmas entradas | Vitest, com os arquivos de `method/scripts/testes/fixtures/` | CI |
| Navegador | Roteiro de cada marco contra a **imagem construída**, não contra o servidor de desenvolvimento; registro de requisições para provar que nada sai do endereço local | Playwright | CI |
| Kit | Gerar, descompactar numa pasta temporária, rodar `check-links` | Playwright e Node | CI |
| Acessibilidade automática | Violações de nível A e AA detectáveis por ferramenta | axe-core dentro do Playwright | CI |
| Acessibilidade manual | Teclado, leitor de tela, ampliação a 200% | pessoa | por marco, registrado no PR como "executado" ou "a confirmar" |

**CI da aplicação.** [Recomendação] Um workflow próprio, ao lado do `celilac-backend-ci.yml`, disparado por mudanças em `curso-app/`, em `celilac-backend/method/`, em `celilac-backend/docs/uc/uc12/` e em `mascotes/web/`; com `permissions: contents: read`, como o de referência ([Fato] linha 16); constrói a imagem e roda as camadas acima. **Não publica imagem**: publicar é ação externa e decisão sua (seção 7). Mudança só de conteúdo do curso passa a disparar os dois workflows, e é isso que garante que o conteúdo continua gerando a aplicação.

**O que os testes não garantem:** que o texto é bom, que o aluno aprende, que a tela é clara para quem nunca viu o método, nem acessibilidade completa (ferramentas automáticas pegam só uma parte dos problemas). Isso é julgamento humano, seu ou de quem usar.

## 7. Distribuição da imagem
A E1, seção 6.3, deixou em aberto: o aluno **constrói** a imagem a partir do `dsc-tests` ou **baixa** de um registro (por exemplo, o registro de contêineres do GitHub).

| Opção | Prós | Contras |
|---|---|---|
| Construir localmente | Nada publicado; nenhuma decisão externa | O aluno precisa do `dsc-tests` inteiro, o que contradiz "independente na execução" (E1, seção 7) |
| Baixar de um registro | Um comando; independente de fato | Publicação externa; registro público expõe a imagem; precisa de CI com permissão de escrita só nesse trabalho |

**[Recomendação]** Construir localmente de M0 a M6, para as demonstrações a você; decidir a publicação no M7, depois da E8. Nenhuma das duas muda o código dos marcos.

## 8. Acessibilidade, idioma e celular

### 8.1. Acessibilidade
**[Recomendação] Meta: WCAG 2.2 nível AA** (*Web Content Accessibility Guidelines*, diretrizes de acessibilidade para conteúdo web do W3C, consórcio que mantém os padrões da web). Requisitos concretos que entram nos critérios dos marcos:
- **Siglas:** a definição abre ao tocar, ao focar pelo teclado e ao passar o mouse; fecha com Esc; é lida por leitor de tela. Passar o mouse **não** pode ser o único caminho (o prompt pede "passar o mouse ou tocar").
- **Grafo de pré-requisitos:** além do desenho, uma **lista equivalente** (módulo, o que pede, o que falta). Um desenho clicável sozinho é inacessível a quem usa leitor de tela.
- **Botões de copiar:** anunciam "copiado" para o leitor de tela; área de toque de pelo menos 24 por 24 pixels (critério 2.5.8 da WCAG 2.2).
- **Mascotes:** decorativos, com texto alternativo vazio, salvo se algum carregar informação.
- **Estrutura:** um título de nível 1 por página, títulos em ordem, link "pular para o conteúdo", foco visível, contraste AA, tema claro e escuro conforme a preferência do sistema, sem animação quando o sistema pede movimento reduzido.
- **Estados não dependem só de cor:** "declarado por você", "a confirmar" e "forma conferida" têm texto, não só cor (E6, seção 10).

### 8.2. Idioma
- Só **português do Brasil**, com o atributo de idioma da página definido. [Recomendação] Sem biblioteca de tradução: não há pedido de outro idioma, e ela complicaria todos os textos.
- Textos da interface num único arquivo, para você revisar o tom (neutro sobre IA) sem ler código.
- Datas mostradas no formato brasileiro e guardadas em UTC (*Coordinated Universal Time*, tempo universal coordenado), como as evidências do UC12.
- Termos em inglês na interface seguem a regra do curso: explicados na primeira aparição de cada tela.

### 8.3. Celular
- Funciona a partir de 320 pixels de largura, sem rolagem horizontal da página. Blocos de código rolam dentro do próprio bloco.
- Teste no navegador em duas larguras (celular e computador) em todo marco.
- **Limite honesto:** o curso é feito no repositório do aluno, com terminal e Docker. No celular dá para **ler, revisar e registrar tentativas**; a prática acontece no computador. A tela de prática diz isso.
- [Suposição] O aluno acessa pelo celular a imagem que roda no próprio computador só se ela escutar na rede local, o que a decisão de `127.0.0.1` impede. O uso real no celular depende da versão na internet (M7 ou depois).

## 9. Divergências e pendências encontradas nesta etapa
- **Registro do PR #84 (pendência do prompt).** [Fato, executado nesta sessão] `gh pr view 84`: `MERGED` em 2026-11-21T13:14:25Z, commit de merge `538723c`. `gh pr checks 84`: os quatro trabalhos com `pass`, na execução 44907757434; `gh run view 44907757434`: `success` no commit `28423e5`. `git ls-remote`: a branch `refactor/check-state-nucleo` ainda existe no remoto. Registrado no `estado.md`.
- **Celular e endereço local** (seção 8.3): o "celular" do prompt só se realiza plenamente na versão na internet. Não é divergência com decisão, mas é um limite a declarar.
- **"Independente na execução" e construção local** (seção 7): enquanto a imagem não for publicada, o aluno precisa do `dsc-tests`. Fica para o M7.

---

## Fechamento

**O que foi feito:**
- Proposta de tecnologia, oito marcos (M0 a M7) com dependências, demonstração e critérios de aceite, estimativa em faixa com premissas, estratégia de testes em sete camadas, distribuição da imagem, e requisitos de acessibilidade, idioma e celular.
- Conferidos nesta sessão: estado do PR #84 e do CI dele (somente leitura, com `gh`); exportações de `method/scripts/check-state-core.mjs`; versão do Node e do pnpm no perfil e no workflow; portas do `compose.yaml`; contagem de arquivos do curso e de mascotes.

**O que não foi verificado:**
- Nenhuma ferramenta da seção 2 foi instalada ou testada; a compatibilidade com o Node 24.21.0 é suposição.
- Que `check-state-core.mjs` roda num navegador: a ausência de importações foi lida, não executada num navegador.
- A estimativa da seção 5 não vem de medição.
- O alcance real do axe-core e o comportamento das siglas em leitores de tela.

**O que você precisa decidir:**
1. A **ordem e o escopo dos marcos** (seção 4), com o **M1 como mínimo útil** e ponto para liberar a E3, parte 2.
2. A **tecnologia** (seção 2): Astro, servidor estático sem privilégios, `fflate`, Vitest, Playwright e axe-core. A instalação será pedida no plano do M0.
3. A **meta de acessibilidade** WCAG 2.2 AA (seção 8.1) e o limite declarado para o celular (seção 8.3).
4. **Distribuição:** construir localmente até o M6 e decidir a publicação no M7 (seção 7).
5. Autorizar **branch e PR da E7**, que leva este documento, o registro do PR #84 no `estado.md` e a remoção do parágrafo pendente do prompt. O merge não está delegado, salvo decisão sua.

## 12. Revisão da política do aluno (2026-11-21)

O professor determinou que a aplicação é um guia, sem coleta de dados pessoais ou conteúdo de respostas e sem registro de leitura, tentativas ou progresso. Esta direção substitui as propostas anteriores de E1/E4 e os critérios dependentes delas. M0–M3 continuam sendo histórico válido da implementação; a experiência que segue não depende de M3 para guardar dados.

| Marco afetado | Critério substitutivo |
|---|---|
| M3 — gabaritos e curso sem estado pessoal | Gabaritos em páginas públicas, com `<details>/<summary>` nativo e convite para tentar primeiro no editor, caderno ou repositório. Sem campos, declaração, verificação ou gate de tentativa. O teste deve confirmar divulgação por teclado e nenhum acesso a `localStorage`. |
| M4 — práticas guiadas | Instruções estáticas por passo: destino no repositório do aluno, ação no editor/terminal/GitHub, saída ou artefato esperado e critério verificável. Não enviar caso de uso, preencher campos, interpolar dados pessoais nem guardar progresso. Botões de copiar podem copiar texto estático do curso. |
| M5 — kit inicial | `.zip` estático construído dos modelos do repositório, sem personalização baseada em respostas do aluno. O estudante baixa e personaliza os arquivos no próprio repositório; os artefatos ensinados continuam sendo construídos nas etapas indicadas. |
| M6 — fases e evidências | Guia e comandos para o estudante executar `check-state` no próprio repositório e interpretar a saída. Não colar nem enviar `state.yaml`, links, relatório ou evidências para a aplicação; não afirmar que a aplicação verificou o trabalho. |
| M7 — acabamento | Verificar fluxo completo sem dados de navegador, navegação por teclado e celular, honestidade sobre gabaritos públicos, limites e ferramentas locais. |

O índice do README é uma página interna contextual, não uma incorporação de conteúdo externo: URL própria, navegação comum, retorno explícito e histórico nativo. Não há requisito para iframe ou painel de leitura estreito.

As especificações detalhadas de dados de E4 e os critérios antigos de E7 são preservados como documentação histórica. O [estado vigente](../estado.md) aponta as decisões atuais e a [auditoria da experiência e dos artefatos](../auditoria-experiencia-e-artefatos.md) registra os fatos e lacunas.
