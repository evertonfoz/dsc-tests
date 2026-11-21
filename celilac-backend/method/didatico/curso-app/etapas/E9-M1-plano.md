# E9 — Plano do marco M1 (leitura do curso, mínimo útil)

> Etapa E9, marco M1, do plano da aplicação web do curso. Data: 2026-11-21. Situação: **aprovado pelo professor em 2026-11-21** (todas as decisões; instalação, branch e PR do M1a autorizados; merge não delegado).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar na implementação.
> Nenhuma dependência foi instalada e nenhum arquivo do curso, do método ou de `curso-app/` foi alterado nesta sessão. As simulações citadas rodaram com um script na pasta temporária da sessão, fora do repositório.

---

## 1. Entradas
- **Escopo do M1** (E7, seção 4): os 18 arquivos de leitura (13 módulos, 4 apoios, projeto final) e a prática do m02 como texto; mapa na ordem de `ordem`; "anterior" e "próximo"; grafo de pré-requisitos clicável, com os condicionais (`prerequisitos_se_precisar`) tracejados; siglas do README com definição ao tocar, focar ou passar o mouse; avisos de honestidade; mascotes em ordem aleatória sem repetição até esgotar; avisos de construção (sigla fora do quadro). **Gabaritos não são gerados** (a liberação é do M3).
- **Critérios de aceite** (E7, seção 4.1, M1): (1) uma página por arquivo de leitura, na ordem de `ordem`; (2) toda sigla do quadro tem definição acessível por teclado e toque; (3) o grafo bate com o front matter (teste compara arestas); (4) nenhuma requisição a outro endereço em nenhuma página; (5) nenhum gabarito publicado; (6) avisos de honestidade visíveis no índice e no projeto final; (7) axe-core sem violação de nível A ou AA.
- **Acréscimo da E8 (P7):** o CI confere que os commits citados no curso existem; falha impede a imagem.
- **Herdado do M0** (plano do M0, seções 4.3 e 10): comparar o front matter com a linha "Pré-requisito" do corpo; decidir o realce de código; Playwright e axe-core entram agora.
- **Decisões que este plano segue:** E2, seção 4 (siglas: fonte única no quadro do README; cada ocorrência ganha definição; avisos sem falhar); P7 da E0 (o restante do método entra como link); decisão dos mascotes (ordem aleatória, minimizando repetição); E7, seção 8 (WCAG 2.2 AA, 320 pixels, grafo com lista equivalente).
- **Fora do M1:** UC12 navegável (M2); "lido", tentativas, gabaritos e checklists marcáveis (M3); prática guiada com variáveis e botão de copiar (M4).

## 2. Dependências a instalar (pede autorização)

[Recomendação] Mesma regra do M0: versão exata, a mais nova publicada há pelo menos 14 dias (R19).

| Pacote | Versão | Para quê | [Fato] consultado nesta sessão (`npm view`) |
|---|---|---|---|
| `@playwright/test` | 1.65.0 | testes no navegador contra a imagem construída | publicada em 2026-11-05; `engines.node >=20`; a 1.65.1 (2026-11-13) ainda não tem 14 dias |
| `@axe-core/playwright` | 4.14.0 | acessibilidade automática (critério 7) | publicada em 2026-10-15; depende de `axe-core ~4.14.0` |
| `axe-core` (fixado por `pnpm.overrides`) | 4.14.0 | o `~4.14.0` resolveria para a 4.14.1, publicada em 2026-11-16 (5 dias) | 4.14.0 publicada em 2026-10-05 |

Também é instalação: o **Chromium do Playwright** (`pnpm exec playwright install chromium`), na máquina local e no CI. [Suposição] Firefox e WebKit ficam fora do M1; o comportamento neles fica "a confirmar".

**Nenhuma dependência nova para o realce de código:** [Fato] o realce por Prism já vem com o Astro instalado (`@astrojs/prism` 4.1.2 e `prismjs` 1.30.0 em `curso-app/node_modules/.pnpm`). Ver seção 4.3. <!-- links:ignore -->

## 3. Páginas e navegação

| Rota | Conteúdo |
|---|---|
| `/` | corpo do `README.md` do curso, com os avisos de honestidade (seção 8) e um link para o mapa |
| `/mapa/` | mapa na ordem de `ordem`, grafo e lista equivalente (seção 6) |
| `/<id>/` (18 páginas) | um por arquivo de `tipo` `modulo`, `apoio` ou `projeto`; `/m00/` continua no mesmo endereço do M0 |
| `/m02-pratica/` | a prática do m02 como texto, ligada a partir do m02 pelo campo `pratica` |

- **Cabeçalho de cada página**, gerado do front matter: tipo, duração (com "estimativa, não testada com turmas"), pré-requisitos e "se precisar" como links, e o link para a prática quando houver. O corpo do Markdown vem depois, sem mudança de texto.
- **"Anterior" e "próximo"** pela `ordem`, no fim da página. A prática não entra na sequência; tem "voltar ao módulo 2".
- **A prática do m02** abre com uma nota: nesta versão ela é só leitura; os campos, as variáveis do seu projeto e o botão de copiar chegam no M4. Os `{{variavel}}` aparecem como estão no arquivo.
- **Gabaritos:** nenhuma rota. [Fato] Os 14 arquivos `*-gabarito.md` são lidos e validados (o M0 já faz isso), mas não viram página.
- **Código-fonte das páginas:** o `m00.astro` do M0 é substituído por uma rota única gerada da coleção. <!-- links:ignore -->

## 4. Conversão do conteúdo

### 4.1. Referências entre arquivos
[Fato] O curso **não tem nenhum link Markdown** (`](` aparece 0 vezes nos 33 arquivos). As referências a outros arquivos são trechos de código com o nome do arquivo, por exemplo `` `m02-pratica.md` `` (`m02-estado-como-fonte.md`, linha 93) e `` `m01-cobertura-real.md` `` (`m00-o-caso-pronto.md`, linha 105). [Fato] O `check-links.mjs` já confere os caminhos com `/` citados entre crases (linhas 41 a 50), e o CI da aplicação já roda `check-links` sobre `method/`, que inclui o curso.

[Recomendação] Um passo da conversão do Markdown (escrito no próprio `curso-app/`, sem dependência nova) transforma o trecho de código em link, **mantendo a aparência de código**:

| O que está entre crases | Vira | Exemplo |
|---|---|---|
| nome de arquivo do curso com página | link interno | `m02-pratica.md` → `/m02-pratica/` |
| `README.md` sozinho, dentro do curso | link para o índice | m00, linhas 12 e 83 |
| nome de gabarito | **texto, sem link** (sem página no M1) | — |
| caminho de `docs/uc/uc12/` | texto no M1; página própria no M2 | `docs/uc/uc12/state.yaml` |
| caminho de `method/`, `docs/`, `src/` ou `test/` do `celilac-backend` | **decisão 3**: link para o GitHub no commit de origem, ou texto | `method/templates/state.yaml` |
| nome solto (`state.yaml`, `verify.sh`), modelo (`{{uc_pasta}}`) ou comando | texto, sem mudança | — |

### 4.2. Tabelas e celular
[Fato] 19 dos 20 arquivos que viram página (incluindo o README e a prática) têm tabela, até 4 por arquivo; só o m03 não tem. [Recomendação] Cada tabela fica dentro de um contêiner com rolagem própria e rótulo para leitor de tela, para a página não rolar na horizontal a 320 pixels (E7, seção 8.3). Blocos de código já rolam dentro do bloco (M0).

### 4.3. Realce de código
[Fato] Linguagens dos blocos de código nos arquivos de leitura: sem linguagem (54), `ts` (12), `bash` (10), `yaml` (6), `prompt` (5), `json`, `sql` e `text` (1 cada). No M0 o realce foi desligado porque o Shiki grava `style=""`, bloqueado pela política de segurança.
[Recomendação] **Prism** (`syntaxHighlight: 'prism'`), que marca os trechos por classe, com cores próprias no CSS, em tema claro e escuro e com contraste AA. `prompt` e `text` ficam sem realce. [Suposição] O Prism do Astro não grava `style=""`; um teste confere. Se gravar, o realce continua desligado e isso não bloqueia o marco.

## 5. Siglas

### 5.1. Fonte e validação
- [Fato] O quadro "Siglas usadas no curso" (`method/didatico/curso/README.md`, linhas 61 a 85) tem **21** siglas. A E2, seção 4, fala em 22; diferença registrada na seção 12.
- [Fato] As 21 aparecem no texto de algum arquivo de leitura (contagem desta sessão, fora de blocos e trechos de código).
- **Falha a construção:** quadro ausente, com sigla repetida ou com definição vazia (sem isso, o critério 2 passaria com zero siglas).

### 5.2. Onde a definição aparece
- **Cada ocorrência**, em palavra inteira, fora de código, títulos, links e do próprio quadro (E2, seção 4). Formas com número e plural contam como a sigla: `UC12`, `CA01`, `RF02`, `PRs`.
- **Comportamento** (E7, seção 8.1): a definição abre ao passar o mouse, ao focar pelo teclado e ao tocar; fecha com Esc e ao tocar fora; o leitor de tela lê a sigla com a definição como descrição; sem JavaScript, o mouse e o foco continuam funcionando. Um script pequeno, em arquivo próprio (a política não aceita script embutido), cuida do toque e do Esc.

### 5.3. Paradas de teclado (decisão 2)
[Fato, contagem aproximada desta sessão] Se **toda** ocorrência for um botão focável, o m01 terá cerca de 55 paradas de Tab só de siglas, o m12 cerca de 51 e o índice cerca de 51. Se só a primeira de cada seção de nível 2 for focável, são cerca de 29, 27 e 31.
[Recomendação] Manter a E2 (toda ocorrência tem definição ao passar o mouse, tocar e no leitor de tela), mas só a **primeira ocorrência de cada sigla em cada seção** entra na ordem do Tab. Cumpre o critério 2 e não obriga quem usa teclado a atravessar dezenas de paradas por página. As demais continuam acessíveis por toque, mouse e leitor de tela.

### 5.4. Avisos de construção (não falham)
- **Sigla fora do quadro** (E2, seção 4): palavra de 2 a 6 maiúsculas, fora de código. Exceções na própria aplicação, numa lista revisável: identificadores como `F03` e `A7`, e palavras que não são siglas (`README`, `OK`). [Fato, contagem desta sessão] Restariam hoje **`RED`, `GREEN`, `SUB` e `NUL`** como avisos.
- **Sigla usada antes de ser explicada no módulo** (E2, seção 4): [Recomendação] heurística simples (a primeira ocorrência no arquivo tem parênteses colados, como "integração contínua (CI)" ou "UC (UC, *Use Case*: ...)"); como a própria E2 diz, o reconhecimento é impreciso, por isso só avisa.
- Os avisos saem no registro da construção e no CI; nenhum é exibido ao aluno.

## 6. Mapa e grafo de pré-requisitos

- **Lista equivalente** (o caminho principal para teclado e leitor de tela, E7, seção 8.1): na ordem de `ordem`, cada item com título, duração, "pede" (links) e "se precisar" (links).
- **Grafo** gerado na construção como desenho vetorial (SVG), sem biblioteca: camadas de cima para baixo pela profundidade no grafo, e dentro da camada pela `ordem`. [Fato, calculado do front matter] São 12 camadas e no máximo 3 itens por camada (camada 0: `m00`, `apoio-a`, `apoio-b`), o que cabe em 320 pixels sem rolagem horizontal. Arestas obrigatórias contínuas, condicionais tracejadas, com legenda em texto (não só por estilo de linha).
- **Clicável:** cada caixa do desenho é um link para a página. O desenho fica fora da ordem do Tab e oculto do leitor de tela, porque a lista acima é o equivalente completo; assim ninguém atravessa 18 links duas vezes. [Suposição] O axe-core aceita essa combinação (links com `tabindex="-1"` dentro de desenho oculto); o teste do critério 7 confirma.
- **Todas as arestas declaradas** são desenhadas, sem simplificar as transitivas, porque o critério 3 compara arestas com o front matter. [Suposição] A legibilidade com as 13 arestas do projeto final é julgamento seu na demonstração.
- O "que falta" para o aluno entra no M3, com o progresso.

## 7. Mascotes (decisão 4)
[Fato] `mascotes/web/` tem 23 PNG (1,9 MB). O M1 gera 21 páginas (índice, mapa, 18 de leitura e a prática).
[Recomendação] **Sorteio na construção**, com a semente tirada do commit de origem: cada página recebe um mascote diferente, sem repetição enquanto houver mascote sobrando (no M1 não há nenhuma repetição); a ordem muda a cada commit e é reproduzível, o que permite testar. Sem JavaScript e sem guardar nada no navegador. Imagens decorativas, com texto alternativo vazio (E7, seção 8.1). A alternativa (sorteio no navegador a cada visita) exige guardar o que já saiu, e o modelo de dados só nasce no M3.

Muda a imagem: `mascotes/web/` entra no contexto de construção (`Dockerfile.dockerignore`), como o M0 já previa.

## 8. Avisos de honestidade (critério 6)
Textos em `curso-app/src/textos.ts`, para você revisar o tom sem ler código: <!-- links:ignore -->
1. **Só o tipo "criar" foi validado** em um caso real (UC12); consultar, atualizar, excluir e autenticar são esboços.
2. **Durações e esforço são estimativas** do material, ainda não testadas com turmas.
3. **Docker é necessário** na sua máquina para a prática.

Aparecem no índice e no projeto final (critério 6). O item 2 também acompanha a duração no cabeçalho de cada página. [Fato] O projeto final já tem o limite do item 1 no corpo (`projeto-final.md`, linha 46) e o m12 o do item 2 (`m12-quem-aprova.md`, linha 91); o aviso da aplicação não altera esses textos. O aviso "versão em construção" do M0 passa a dizer o que ainda falta (progresso, gabaritos, prática guiada, kit).

## 9. Validações na construção

| Regra | Efeito | Onde roda |
|---|---|---|
| Regras do M0 (esquema, `id`, reciprocidade, ciclo) | falha | construção do Astro (já existe) |
| **Linha "Pré-requisito" × front matter** (herdado do M0) | falha | construção do Astro |
| Quadro de siglas ausente, repetido ou com definição vazia | falha | construção do Astro |
| **Commits citados existem** (E8, P7) | falha | `construir.sh`, antes do `docker build`, e trabalho de qualidade do CI |
| Sigla fora do quadro; sigla usada antes de explicada | aviso | construção do Astro |

**Comparação da linha "Pré-requisito".** Regra proposta: os `id` citados na linha (como "módulos 4 a 7 e apoio D") têm de conter todos os `prerequisitos` e não podem citar nada fora de `prerequisitos` ∪ `prerequisitos_se_precisar`; texto entre parênteses e entre crases é ignorado; arquivo sem a linha precisa ter `prerequisitos: []`; se a linha tiver "Duração sugerida", ela contém o valor de `duracao`.
[Fato, executado nesta sessão] A simulação dessa regra nos 18 arquivos de leitura deu **0 divergências** (código de saída 0). Ela trata os casos reais: faixa ("módulos 4 a 7", m08; "módulos 0 a 12", projeto final), condicional em prosa (m01: "e o apoio B ..., se você ainda não escreveu um teste"), linha sem `id` (apoio A: "saber fazer commit") e arquivo sem a linha (apoio B; m00 usa "Antes de começar"). Os testes de unidade terão um caso quebrado por regra.

**Commits citados.** [Fato, executado nesta sessão] Trechos de código com 7 a 40 caracteres hexadecimais no curso: `b71f5e1` (m01, linha 59) e `8aeef61` (m10, linha 60) nos arquivos de leitura, e `5081158` só nos gabaritos. `git cat-file -t` respondeu `commit` para os três. [Recomendação] Conferir **todos os arquivos do curso, inclusive gabaritos** (que serão publicados no M3). Como o Docker não recebe o histórico do git, a conferência roda fora dele; no CI, o `checkout` passa a trazer o histórico inteiro (`fetch-depth: 0`). Um hexadecimal que não seja commit (um exemplo inventado) teria de ser marcado na linha; hoje não há nenhum.

## 10. Imagem e CI
- **`Dockerfile`:** copia `mascotes/web/`; o resto igual ao M0.
- **Trabalho de qualidade:** acrescenta a conferência de commits e um passo que mostra os avisos da seção 5.4.
- **Trabalho de imagem:** depois dos testes de fumaça do M0, instala Node, as dependências e o Chromium, sobe o contêiner com o comando documentado e roda o Playwright **contra a imagem** (E7, seção 6), em duas larguras (320 e 1280 pixels; a de 320 com toque).
- `testar-imagem.sh` ganha: nenhuma pasta ou arquivo com `gabarito` no site gerado; as 21 páginas respondem 200. <!-- links:ignore -->
- Continua sem publicar nada e com `contents: read`.

## 11. Testes e critérios de aceite

| Critério | Como é verificado | Onde |
|---|---|---|
| (1) uma página por arquivo, na ordem | Playwright: o mapa lista os 18 na ordem de `ordem`; seguindo "próximo" a partir do m00 passa pelos 18 e para no projeto final; cada página tem um único `h1` | CI, imagem |
| (2) siglas por teclado e toque | Vitest: leitura do quadro, ocorrências e exceções. Playwright: para cada uma das 21 siglas, numa página em que aparece, Tab até ela mostra a definição, Esc fecha; a 320 pixels com toque, tocar abre e tocar fora fecha; a descrição está na árvore de acessibilidade | CI |
| (3) grafo × front matter | Vitest: as arestas do desenho são exatamente as do front matter, com o tipo (obrigatória ou condicional). Playwright: as arestas lidas da página batem com as mesmas listas | CI |
| (4) nenhuma requisição externa | Playwright: em todas as 21 páginas, toda requisição vai para `127.0.0.1:4321`; nenhuma violação da política de segurança no console | CI, imagem |
| (5) nenhum gabarito publicado | `testar-imagem.sh`: nada com `gabarito` no site gerado; Playwright: nenhum título "Gabarito do professor" | CI, imagem |
| (6) avisos no índice e no projeto final | Playwright: os três avisos visíveis nas duas páginas | CI |
| (7) axe-core A e AA | Playwright com axe-core nas 21 páginas, nas duas larguras, tema claro | CI |
| P7: commits existem | script de conferência com um commit inexistente num arquivo de teste: falha | CI, qualidade |
| Linha "Pré-requisito" | Vitest com casos quebrados; construção negativa no CI com a linha do m05 trocada na cópia do executor | CI |
| Celular | Playwright: a 320 pixels, nenhuma página rola na horizontal | CI |
| Manual | só teclado, leitor de tela (VoiceOver), ampliação a 200%, tema escuro | registrado no PR como "executado" ou "a confirmar" |

**Demonstração para você** (E7, seção 4): construir e executar com os dois scripts do M0, abrir `http://127.0.0.1:4321`, ir do índice ao mapa, abrir um módulo pelo grafo, seguir "próximo", tocar numa sigla no celular simulado do navegador, e ver no registro da construção os avisos de sigla. Com a rede desligada, tudo continua funcionando. <!-- links:ignore -->

## 12. Divergências e achados desta sessão
- **Registro do PR #87.** [Fato, executado nesta sessão] `gh pr view 87`: `MERGED` em 2026-11-21T14:40:30Z, commit de merge `f6205a2`, cabeça `967ba62`; `gh pr checks 87`: os seis trabalhos com `pass`; `git ls-remote`: a branch `feat/curso-app-m0` ainda existe no remoto. Registrado no `estado.md`. <!-- links:ignore -->
- **"Próximo" do m01 diverge da `ordem`.** [Fato] `m01-cobertura-real.md`, linha 134: "Próximo: módulo 2"; pela `ordem` (e pelo pré-requisito do m02, que pede o apoio A) o próximo é o apoio A. Nos outros 16 arquivos com "Próximo:", o texto bate com a `ordem`. A aplicação segue a `ordem`. Proposta de texto ("Próximo: apoio A, depois o módulo 2") para a E3, parte 2; não corrigido. O `estado.md` descreve a sequência como "m00 → m01 → apoio A → m02", o que vale para a `ordem`, não para o texto do m01.
- **Quantidade de siglas.** A E2, seção 4, diz "22 siglas hoje"; [Fato] o quadro tem 21. Não muda decisão.
- **Siglas fora do quadro:** `RED`, `GREEN`, `SUB` (`SUB-07`, m03, linha 19) e `NUL` (m06, m07, m09). Incluir no quadro ou tratar como termo é decisão de conteúdo (E3, parte 2); no M1 só geram aviso.
- **Mapa do README × `ordem`.** [Fato] A tabela "Mapa dos módulos" do README lista os quatro apoios antes do módulo 0; a `ordem` os intercala. Não é erro (o README agrupa por tipo); o mapa da aplicação segue a `ordem`.
- **Contagem de commits da E8.** A E8, D6, fala em "3 arquivos do curso" e "2 commits"; [Fato] são 2 commits distintos nos arquivos de leitura e 3 contando os gabaritos (seção 9).

## 13. Entrega
- **Branch:** `feat/curso-app-m1`, a partir da `main` atual (`f6205a2`). A cópia local está na branch `feat/curso-app-m0` e tem mudanças alheias ao curso (`celillac-backend-prepare/`, PNG originais em `mascotes/`); **nada disso entra** no PR. <!-- links:ignore -->
- [Recomendação] **Dois PRs**, cada um com demonstração própria:
  - **M1a — leitura e navegação:** páginas, cabeçalho do front matter, links entre arquivos, tabelas, realce, mapa em lista, "anterior" e "próximo", avisos de honestidade, comparação da linha "Pré-requisito", conferência de commits, Playwright e axe-core (critérios 1, 4, 5, 6 e 7).
  - **M1b — siglas, grafo e mascotes** (critérios 2 e 3), sobre o M1a.
- **Estimativa:** 2 a 4 sessões (E7, seção 5), mantida.
- **O que reabre o plano:** o Astro embutir o script das siglas na página (bloqueado pela política; [Suposição] de que não embute, com teste); o axe-core recusar o desenho oculto com links; o Playwright não rodar no CI sem ajuste de permissões.

## 14. Registro da implementação do M1a (2026-11-21)
Plano aprovado por inteiro; instalação, branch e PR do M1a autorizados; merge não delegado.

**[Fato, executado nesta sessão, na máquina local]**
| Critério | Resultado |
|---|---|
| (1) uma página por arquivo, na ordem | 21 páginas geradas; Playwright: o mapa lista os 18 na ordem de `ordem`; seguindo "próximo" a partir do m00 passa pelos 18 com um `h1` cada; todas as páginas e todos os links internos respondem 200 |
| (4) nenhuma requisição externa | Playwright, nas 21 páginas, nas duas larguras: nenhuma requisição fora de `127.0.0.1:4321` e nenhuma violação da política de segurança no console |
| (5) nenhum gabarito | `testar-imagem.sh`: nada com `gabarito` no site gerado; Playwright: os 14 gabaritos respondem 404 e nenhuma página tem link para eles | <!-- links:ignore -->
| (6) avisos no índice e no projeto final | Playwright: os três avisos visíveis nas duas páginas |
| (7) axe-core A e AA | Playwright com axe-core 4.14.0 nas 21 páginas, em 1280 e 320 pixels: nenhuma violação (depois das correções abaixo) |
| P7: commits existem | `conferir-commits.mjs`: 5 citações em 34 arquivos, todas no histórico; caso negativo (`testar-conferir-commits.sh`) sai com 1 | <!-- links:ignore -->
| Linha "Pré-requisito" | 7 testes Vitest; construção negativa com a linha do m05 trocada na cópia: falha com `linha "Pré-requisito": não cita "m03"` |
| Celular | Playwright a 320 pixels: nenhuma página mais larga que a tela |
| Outros | 43 testes Vitest; `pnpm check` sem erros; `pnpm audit --audit-level high` sem vulnerabilidade conhecida; testes da imagem do M0 continuam passando; `check-links` com saída 0; 117 testes no navegador passando (21 pulados: os de largura de celular não rodam no projeto "computador") |

Os critérios 2 (siglas) e 3 (grafo) são do M1b.

**Diferenças em relação ao plano** (nenhuma muda decisão já tomada, salvo a primeira, decidida pelo professor nesta sessão):
- **Processador de Markdown.** [Fato] O Astro 7.4.7 usa por padrão o Sätteri; plugins de conversão pelo campo antigo (`rehypePlugins`) exigiriam instalar `@astrojs/markdown-remark`. **Decisão do professor:** declarar `@astrojs/markdown-satteri` 0.4.7, a mesma versão exata que o Astro já instalava (nenhum código novo no lockfile além da declaração), e escrever a conversão como plugin do Sätteri (`curso-app/src/conteudo/conversao.ts`). <!-- links:ignore -->
- **`axe-core` fixado** em `curso-app/pnpm-workspace.yaml`: o pnpm 12 não lê mais o campo `pnpm` do `package.json`. O `Dockerfile` passa a copiar esse arquivo. <!-- links:ignore -->
- **Título da página do front matter.** O `h1` do corpo é retirado na conversão e a página o gera do `titulo`, com a ficha logo abaixo. [Fato] Os 33 títulos são iguais ao `h1` do corpo; a construção passa a **falhar** se divergirem, para nada se perder.
- **Prism sem `style=""`**: confirmado (seção 4.3); nenhum atributo `style` nas páginas geradas.
- **Achados do axe-core, corrigidos:** blocos de código com rolagem não recebiam foco pelo teclado (agora recebem); as caixas das listas de verificação (`- [ ]`), desabilitadas e sem rótulo, ficam ocultas do leitor de tela no M1, porque o texto do item já diz o que conferir. Viram controles com rótulo no M3.
- **Defeito de layout encontrado pelo teste de celular:** no m08, o texto oculto "(abre no GitHub…)" dentro de uma tabela escapava da rolagem e alargava a página para 524 pixels. Corrigido no CSS. O primeiro teste de largura **não** pegava isso (o celular alarga a janela junto com o conteúdo); o teste passou a comparar com os 320 pixels configurados.
- **Diretórios** citados (`method/`, `method/exemplos/`) ficam como texto: só caminhos de arquivo viram link para o GitHub. <!-- links:ignore -->
- **`e2e/` e `playwright.config.ts` fora do `astro check`**: usam módulos do Node, e `@types/node` não está instalado. O Playwright os executa a cada teste. <!-- links:ignore -->
- **CI:** `fetch-depth: 0` nos dois trabalhos (conferência de commits); o trabalho de imagem instala o Chromium e roda o Playwright contra a imagem; tempo máximo de 15 para 25 minutos. Sem envio de artefato (num repositório público, ele ficaria baixável).

**A confirmar:** CI no GitHub (resultado no PR); acessibilidade manual (teclado, leitor de tela, ampliação a 200%, tema escuro) não executada; Firefox, Safari e Windows.

---

## Fechamento

**O que foi feito:**
- Plano do M1: rotas, conversão das referências entre arquivos, tabelas e realce, siglas (fonte, onde aparecem, teclado, avisos), mapa e grafo com lista equivalente, mascotes, avisos de honestidade, validações na construção, mudanças na imagem e no CI, testes por critério e forma de entrega.
- Executados nesta sessão (somente leitura ou fora do repositório): `gh pr view 87`, `gh pr checks 87`, `git ls-remote`; `npm view` das versões e datas de `@playwright/test`, `@axe-core/playwright` e `axe-core`; `git cat-file -t` dos três commits citados; simulação da comparação da linha "Pré-requisito" (0 divergências); contagens de links, siglas, tabelas, títulos e linguagens de bloco no curso.

**O que não foi verificado:**
- Nada foi instalado nem construído: o Prism sem `style=""`, o script das siglas em arquivo próprio, o desenho do grafo a 320 pixels e o axe-core com o desenho oculto são suposições até a implementação.
- As contagens de paradas de teclado e de siglas fora do quadro vêm de um filtro aproximado por expressão regular, não do gerador real.
- Comportamento em Firefox, Safari e Windows; leitor de tela real.

**O que você precisa decidir:**
1. Autorizar **instalar** `@playwright/test` 1.65.0 e `@axe-core/playwright` 4.14.0 (com `axe-core` fixado em 4.14.0) e **baixar o Chromium** do Playwright, aqui e no CI (seção 2).
2. **Siglas e teclado** (seção 5.3): definição em toda ocorrência (E2), mas só a primeira de cada seção na ordem do Tab; ou toda ocorrência focável, como a E2 sugere ao pé da letra.
3. **Caminhos de `method/` e do código do CeliLac** (seção 4.1): link para o GitHub no commit de origem (abre fora da aplicação, só se o aluno clicar; P7 da E0) ou texto sem link até o M7.
4. **Mascotes** (seção 7): sorteio na construção com semente no commit, ou sorteio no navegador a cada visita.
5. **Realce por Prism** (seção 4.3), e a **regra da linha "Pré-requisito"** (seção 9), que falha a construção como a E2 previa.
6. Autorizar **branch e os dois PRs** do M1 (seção 13). Merge não delegado, salvo decisão sua.
