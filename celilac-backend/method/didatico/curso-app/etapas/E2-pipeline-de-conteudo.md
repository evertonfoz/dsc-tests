# E2 — Pipeline de conteúdo e metadados

> Etapa E2 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **aguardando validação do professor**.
> Convenção: **[Fato]** lido no repositório (com caminho); **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso foi alterado nesta etapa. O que precisa mudar está listado na seção 9, para a E3.

---

## 1. Entradas desta etapa (decisões já tomadas)
- Site estático, gerado na construção de uma imagem Docker e servido dentro dela; nunca lê o repositório do aluno (E1, seção 7).
- Gabaritos exibidos ao aluno, como uma etapa do curso (E0, P1′). Curso autônomo, sem professor (E0, P4′).
- Cada passo de prática mostra o que criar, com explicação, botão de copiar e um prompt (requisito de 2026-11-21).
- Quando o curso pede o caso de uso do aluno, ele **envia um arquivo Markdown** (decisão de 2026-11-21).
- Autorizado usar `.github/workflows/celilac-backend-ci.yml`, na raiz do `dsc-tests`, como referência.

## 2. O pipeline, de ponta a ponta

```
Repositório dsc-tests                          Imagem Docker
─────────────────────                          ─────────────
celilac-backend/method/didatico/curso/*.md ─┐
celilac-backend/method/templates/          ─┤  estágio 1: gerar      estágio 2: servir
celilac-backend/method/AGENTS.md, orquestr.─┼─► validar ─► páginas ─► servidor web mínimo
celilac-backend/docs/uc/uc12/, planejamento─┤   (falha =   HTML,JS     (só arquivos)
.github/workflows/celilac-backend-ci.yml   ─┤   imagem     + mascotes
mascotes/web/*.png                         ─┘   não sai)   + commit de origem
```

1. **Coletar:** só os caminhos listados acima entram na construção. O resto do repositório não entra.
2. **Validar** (a imagem não é gerada se algo falhar): metadados de cada arquivo conforme a seção 3; todo pré-requisito aponta para um `id` existente; o grafo não tem ciclo; toda sigla usada no quadro do README tem definição; `node method/scripts/check-links.mjs` com saída 0.
3. **Gerar:** uma página por arquivo, o mapa, o grafo, o quadro de siglas e as páginas do UC12. O commit de origem (`git rev-parse HEAD`, passado na construção) aparece no rodapé de todas as páginas.
4. **Servir:** a segunda etapa da imagem contém só os arquivos gerados e um servidor web estático.

**Conteúdo que muda depois da imagem gerada:** a imagem fica presa ao commit de origem, que fica visível. O CI reconstrói a imagem quando um desses caminhos muda (detalhes na E7).

## 3. Metadados por arquivo (front matter)

[Fato] Hoje nenhum arquivo do curso tem metadados. Pré-requisitos e duração estão em texto livre, numa linha de citação com três formas diferentes (E0, seção 2.2).

**[Recomendação] Formato** (bloco YAML no topo de cada módulo, apoio, gabarito e projeto final):

```yaml
---
id: m05                       # m00..m12 | apoio-a..apoio-d | projeto-final | <id>-gabarito
tipo: modulo                  # modulo | apoio | projeto | gabarito | pratica
titulo: "Onde mora a regra de negócio?"
ordem: 9                      # posição no percurso recomendado (apoios intercalados)
prerequisitos: [m03, apoio-b]
duracao: "2 aulas"            # estimativa do material, não testada com turmas
gabarito: m05-gabarito        # só em módulos que têm gabarito
pratica: m05-pratica          # arquivo de prática (seção 5)
---
```

- O GitHub mostra esse bloco como uma tabela pequena no topo do arquivo; a leitura direta no repositório continua possível.
- **A linha de texto "Pré-requisito" continua no corpo** para quem lê no GitHub. A construção compara as duas e falha se divergirem.
- `ordem` resolve a ordem recomendada, que hoje está espalhada no fim dos módulos (por exemplo, "Próximo: apoio B, depois o módulo 3", em `method/didatico/curso/m02-estado-como-fonte.md`).
- **Fora do front matter:** siglas (seção 4) e checklists (seção 6), que são extraídos do corpo.

## 4. Siglas
- **Fonte única:** o quadro "Siglas usadas no curso" de `method/didatico/curso/README.md` (22 siglas hoje).
- Na página, cada ocorrência de uma sigla do quadro (palavra inteira, fora de blocos de código) ganha a definição ao passar o mouse ou tocar.
- **Não substitui** a regra de explicar a sigla na primeira aparição de cada módulo. **[Recomendação]** A construção **avisa**, sem falhar, quando uma sigla aparece em um módulo antes de ser explicada. Avisar e não falhar porque o reconhecimento da explicação é heurístico.
- Sigla usada que não está no quadro também gera aviso. Sigla nova vai para o quadro em PR de conteúdo (E3).

## 5. Passo de prática: o formato do requisito novo

[Fato] As 17 seções "Pratique no seu domínio" têm 91 passos. Elas dizem **o que** criar, mas quase nunca trazem o conteúdo. As exceções são o `ci.yml` do apoio C e o modelo de `state.yaml` citado no m02 (levantamento registrado no `estado.md`).

### 5.1. Onde fica o conteúdo
| Opção | Como é | Prós | Contras |
|---|---|---|---|
| (a) Dentro do módulo | A seção "Pratique" cresce com o conteúdo de cada passo | Um arquivo só | O módulo dobra de tamanho; a leitura no GitHub fica pesada |
| (b) **Arquivo de prática por módulo** | `m05-pratica.md` ao lado de `m05-onde-mora-a-regra.md`; a seção "Pratique" do módulo passa a resumir os passos e apontar para ele | Módulo continua legível; a prática pode ser revisada em PR próprio | Mais 17 arquivos |

**[Recomendação] (b).**

### 5.2. Formato de um passo
Markdown comum, legível no GitHub, com convenções que a construção reconhece:

````markdown
### Passo 3 — Compose sem segredos
<!-- passo: tipo=criar-arquivo -->

**Para quê:** subir o banco do seu projeto do mesmo jeito em qualquer máquina, sem senha no repositório.

**Onde:** `compose.yaml` na raiz do seu repositório.

```yaml arquivo="compose.yaml"
services:
  db:
    image: postgres:{{versao_postgres}}
    environment:
      POSTGRES_DB: {{banco_dev}}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ...
```

```prompt
Você está no repositório do meu projeto ({{dominio}}). Crie `compose.yaml` com ...
Regras: não grave senha em nenhum arquivo versionado; não rode `docker compose down -v`;
mostre o arquivo e espere minha confirmação antes de qualquer comando.
Ao final, rode `docker compose ps` e me mostre a saída real.
```

**Como saber que funcionou**
- [ ] `docker compose ps` mostra o banco como `healthy`.
````

| Convenção | O que a aplicação faz |
|---|---|
| `### Passo N — título` | Um passo, com marcação de feito guardada no navegador |
| `<!-- passo: tipo=... -->` | Tipo do passo (invisível no GitHub): `criar-arquivo`, `comando`, `github`, `escrita`, `revisao-por-outra-pessoa` |
| Bloco de código com `arquivo="..."` | Mostra o caminho de destino e o botão de copiar |
| Bloco `prompt` | Mostra o prompt com botão de copiar |
| `{{variavel}}` | Trocada pelos dados do projeto do aluno (seção 7); sem o dado, aparece destacada como "preencha em Meu projeto" |
| `- [ ]` sob "Como saber que funcionou" | Checklist do passo, marcado pelo aluno |

[Fato] O GitHub ignora o texto depois da linguagem no bloco de código e esconde comentários HTML, por isso o arquivo continua legível no repositório. [Fato] `check-links.mjs` ignora caminhos com `{chaves}` e `<placeholder>`, de modo que os modelos não quebram a verificação de links.

### 5.3. Regras para todo prompt
Derivadas de `method/AGENTS.md` e de `method/orquestrador/prompt-do-estudante.md`:
1. Diz em que repositório e em que passo o aluno está.
2. Pede **evidência real**: rodar o comando e mostrar a saída, sem inventar.
3. **Para e pergunta** antes de publicar no GitHub, apagar ou sobrescrever arquivo, e de qualquer ação da regra 8 do `AGENTS.md`.
4. **Não aprova** gate nem marca nada como concluído no lugar do aluno.
5. Termina pedindo "o que você verificou de fato e o que está presumindo".

Tom neutro: o prompt é uma ferramenta, e o texto do passo lembra que a saída é hipótese até o aluno conferir.

### 5.4. De onde vem o conteúdo copiável
Do projeto de referência, **adaptado** com variáveis, nunca copiado com os nomes do CeliLac: `method/templates/` (perfil, `state.yaml`, ADR, relatório, issue de fatia), `compose.yaml`, `Dockerfile`, `scripts/`, `src/` e `test/` do módulo de produtos, `docs/uc/uc12/` e o workflow de CI autorizado. Escrever os passos é trabalho da E3.

## 6. Checklists "Como saber que funcionou"
- [Fato] 18 arquivos têm essa seção, com itens `- [ ]`.
- A aplicação mostra os itens como caixas marcáveis, guardadas no navegador. **Marcar é uma declaração do aluno**, e a tela diz isso: a aplicação não confere.

## 7. O caso de uso do aluno (Markdown enviado)
- **Quando:** o m00 pede para o aluno escrever o caso de uso (passo 2 da prática). A partir daí, o curso pede o arquivo.
- **Como:** o aluno escolhe o arquivo `.md` no navegador. **O arquivo não sai do navegador**: não é enviado a servidor nenhum, porque não existe servidor de aplicação.
- **O que a aplicação extrai:** título e código (`# UC.. — Nome`) e os identificadores `RF`, `RN`, `CA`, `FA` e `FE` seguidos de dois dígitos, com o texto de cada um. [Fato] É o padrão do documento do UC12, `docs/planejamento/uc12-cadastrar-produto/uc-12.md` (por exemplo, `**RN01 — Nome obrigatório:**` e `### FA01 — ...`).
- **Para que serve:** preencher a tabela de cobertura do m01, a lista de critérios das fatias (m02 e m03), as variáveis dos prompts e a tela "Meu projeto".
- **O que a aplicação não faz:** não completa nem corrige o caso de uso. Identificador ausente ou repetido gera aviso; nada é inventado.
- **[Recomendação]** Criar `method/templates/caso-de-uso.md`, com a estrutura do documento do UC12, para o aluno partir dele (E3). <!-- links:ignore -->

**Variáveis do projeto** (tela "Meu projeto", guardadas no navegador, com exportar e importar): domínio, código e nome do UC, entidade principal e campos, repositório (`dono/nome`), banco de desenvolvimento e de testes, e se trabalha sozinho ou em equipe. Nenhum dado pessoal é pedido; o login do GitHub é opcional e só aparece dentro dos textos copiados (por exemplo, `por:` no `state.yaml`).

## 8. Gabarito como etapa do curso

[Fato] Os gabaritos dizem "não distribua antes da atividade da seção 2" (por exemplo, `method/didatico/curso/m01-gabarito.md`) e foram escritos para o professor: "Pontos para discussão em aula", "Critérios de avaliação sugeridos", "Sinais de que o aluno não entendeu".

**Liberação (recomendação):** o gabarito do módulo aparece **depois** que o aluno registra a própria tentativa da atividade "Antes de ler a solução", num campo de texto guardado no navegador. A aplicação não avalia a tentativa. O aluno pode abrir antes, com um aviso de que vai perder o exercício; não há como impedir, já que o conteúdo é aberto.

**Texto dos gabaritos (sua decisão):**
| Opção | O que acontece |
|---|---|
| (a) Exibir como estão | Com uma nota no topo: "escrito originalmente para o professor". Zero trabalho, mas "Uso exclusivo do professor" e "discussão em aula" soam estranhos. |
| (b) Separar | Cada gabarito ganha uma parte para o aluno (respostas esperadas, limites do exemplo) e uma parte de condução de aula, que a aplicação não exibe. |
| (c) **Reescrever para autoestudo** | "Critérios de avaliação sugeridos" vira "Confira sua tarefa"; "Sinais de que o aluno não entendeu" vira "Sinais de que você ainda não entendeu"; "Pontos para discussão" vira "Para pensar". |

**[Recomendação] (c).** O curso agora é autônomo, e nada nos gabaritos depende de sigilo. Os pesos dos critérios são uma rubrica; alterar rubrica é decisão sua (seção 5, item 5, do prompt).

## 9. Texto que pressupõe professor ou colega

Levantamento feito nesta etapa com busca por "professor", "colega", "em aula" e "turma" nos arquivos do curso, exceto gabaritos.

| Arquivo e linha | Trecho | Proposta |
|---|---|---|
| `README.md`, 8 | "avise o professor" (sigla sem explicação) | "abra uma issue no repositório do curso" ou "anote como falha do material" (você escolhe o canal) |
| `README.md`, 19 | "gabarito para o professor" | "gabarito, disponível depois da sua tentativa" |
| `m06-quando-o-banco-falha.md`, 93 | "um item para o professor decidir" | "um item para quem é responsável pelo caso de uso decidir" |
| `m07-seu-teste-prova-algo.md`, 145 | "decidir (com o professor)" | "decidir (e registrar em ADR)" |
| `m09-contrato-real-da-api.md`, 66 e `m10-fatia-descoberta-tarde.md`, 49 | "O professor decidiu" (sobre o UC12) | **Manter**: é fato histórico do caso real |
| `m12-quem-aprova.md`, 78 e 81 | "mesmo professor que conduziu"; "testadas com turmas" | **Manter**: são limites declarados |
| `projeto-final.md`, 3 | "testada com turmas" | **Manter** |
| `projeto-final.md`, 35 | "avise o professor" (arquétipo não validado) | "registre no relatório que está em território não validado" |
| `projeto-final.md`, 79 | "um colega (ou o professor) escolhe três afirmações" | Em equipe, um colega; sozinho, o aluno escolhe três afirmações ao acaso e refaz a evidência numa cópia limpa do repositório, declarando a ausência de revisão independente |
| `m11-verificacao-repetivel.md`, 16 a 21 e 81 | Trocar roteiro com um colega | Em equipe, como está; sozinho, seguir o próprio roteiro em uma pasta nova, sem consultar nada fora do repositório, e declarar o limite |
| `m12-quem-aprova.md`, 91 | Pedir revisão a um colega | Em equipe, como está; sozinho, declarar a ausência de revisão independente (como o UC12 fez) |
| `m01-cobertura-real.md`, 103; `m04-fundacao-ambiente-reprodutivel.md`, 82; `apoio-c-integracao-continua.md`, 18; `apoio-d-conteineres-docker-e-compose.md`, 13 e 90 | "um colega" como teste de clareza | **Manter**, com a alternativa "ou você mesmo, numa pasta nova" |

[Recomendação] Os passos que dependem de outra pessoa recebem o tipo `revisao-por-outra-pessoa` (seção 5.2), e a aplicação mostra a variante "sozinho" ou "em equipe" conforme o que o aluno informou em "Meu projeto".

## 10. Padronização necessária (vai para a E3)
1. **Títulos de seção canônicos**, sem número na comparação: "O problema", "Antes de ler a solução", "A tentativa ingênua", "A solução", "Pratique no seu domínio", "Como saber que funcionou", "Armadilhas comuns", "Exercícios" (opcional), "Como lidar com a IA". [Fato] Hoje há quatro variações do último e o apoio B usa "Pratique (qualquer linguagem)" (E0, seção 2.2). A parte depois de dois-pontos pode continuar livre ("A solução: a regra mora no núcleo").
2. **Front matter** nos 33 arquivos (seção 3).
3. **17 arquivos de prática**, com os 91 passos no formato da seção 5.
4. **Modelo de caso de uso** `method/templates/caso-de-uso.md` (seção 7). <!-- links:ignore -->
5. **Texto dos gabaritos** conforme a opção escolhida (seção 8) e **texto da seção 9**.

**[Recomendação] Ordem dos PRs na E3** (um por assunto, cada um pequeno e com `check-links.mjs` verde): (1) títulos canônicos; (2) front matter; (3) modelo de caso de uso; (4) texto que pressupõe professor; (5) gabaritos; (6) em diante, um PR de prática por módulo, na ordem do curso. Os itens 1 e 2 não mudam o que o aluno lê; os demais mudam e passam pela sua revisão de texto.

**Volume:** a prática (item 3) é a maior parte do trabalho de conteúdo do projeto. **[Recomendação]** Começar pelos módulos do mínimo útil que a E7 definir, e não pelos 17 de uma vez.

---

## Fechamento

**O que foi feito:** proposta do pipeline, do front matter, do formato do passo de prática e dos prompts, do envio do caso de uso, da liberação dos gabaritos e da lista de textos a revisar. Para isso li o documento do UC12, um gabarito inteiro (m01), as 17 seções de prática e fiz a busca por professor e colega.

**O que não foi verificado:**
- Não escrevi nenhum passo de prática real; o exemplo da seção 5.2 é ilustrativo e incompleto (`...`).
- Não testei se o GitHub exibe o front matter e os blocos com `arquivo="..."` como descrevo; vem do meu conhecimento do GitHub.
- A busca da seção 9 é por palavras; um trecho que pressupõe professor sem usar essas palavras pode ter escapado.
- Não li os módulos m03 a m12 por inteiro, só as práticas e os trechos encontrados.

**O que você precisa decidir:**
1. Validar o **formato** do front matter (seção 3) e do passo de prática (seção 5.2).
2. Onde fica a prática: (a) dentro do módulo ou (b) arquivo próprio (seção 5.1).
3. Texto dos gabaritos: (a), (b) ou (c) (seção 8). E o canal para "avise o professor" no README (seção 9, primeira linha).
4. Aceitar ou ajustar as propostas da seção 9, linha a linha se quiser.
