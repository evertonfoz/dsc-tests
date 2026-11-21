# E4 — Modelo de dados, papel e privacidade

> Etapa E4 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **validada pelo professor em 2026-11-21** (todas as recomendações aprovadas).
> Convenção: **[Fato]** lido no repositório (com caminho); **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso foi alterado nesta etapa.

---

## 1. Entradas desta etapa (decisões já tomadas)
- Site estático servido por uma imagem Docker. Não há servidor de aplicação e a aplicação **nunca lê** o repositório do aluno (E1, seção 7).
- Sem login e sem área do professor. O curso é autônomo e o aluno registra o progresso só para si (E0, P3 e P4′).
- Alunos individuais e equipes de 2 ou mais pessoas (E0, P6).
- Progresso no navegador, com exportar e importar (E1, decisão B′).
- O caso de uso do aluno entra como arquivo Markdown escolhido no navegador e não sai dele (E2, seção 7).
- Gabarito liberado depois da tentativa registrada (E2, seção 8). Texto dos gabaritos: opção (c), reescrita para autoestudo, adiada para a E3, parte 2.

## 2. Papel: um só, o aluno

Há um único papel. A aplicação não distingue pessoas: quem abre o navegador **é** o aluno daquele navegador.

| Modo (informado em "Meu projeto") | O que muda na aplicação |
|---|---|
| `individual` | Passos do tipo `revisao-por-outra-pessoa` (E2, seção 5.2) mostram a variante "sozinho": refazer a verificação numa pasta nova e **declarar a ausência de revisão independente**, como o UC12 declarou (`method/didatico/curso/m12-quem-aprova.md`). |
| `equipe` | Os mesmos passos mostram a variante "em equipe": um colega revisa. Os prompts usam o login de quem escreveu em `responsavel` e o de um colega em `revisor`. |

**Equipe sem servidor.** Cada integrante usa o próprio navegador, com progresso próprio. Não há sincronização: a referência comum da equipe é o **repositório** e o `state.yaml` dele, não a aplicação. **[Recomendação]** Separar a exportação em duas partes (seção 5): os **dados do projeto**, que a equipe compartilha para que todos tenham as mesmas variáveis nos prompts, e o **progresso pessoal**, que é de cada um.

## 3. Modelo de dados

Um único documento JSON por navegador, com versão de esquema. Escopos:

| Escopo | Conteúdo | Origem | Compartilhável na equipe |
|---|---|---|---|
| `meta` | versão do esquema; commit do conteúdo quando os dados foram criados e na última gravação; datas | aplicação | — |
| `projeto` | modo, domínio, UC, entidade, repositório, bancos, logins (seção 3.1) | aluno digita | **sim** |
| `casoDeUso` | nome do arquivo, texto Markdown enviado, itens extraídos (`RF`, `RN`, `CA`, `FA`, `FE`), avisos, data | arquivo escolhido pelo aluno | **sim** |
| `conteudos` | por `id` do front matter (`m05`, `apoio-c`...): lido, tentativa da atividade "Antes de ler a solução", liberação do gabarito, itens do checklist "Como saber que funcionou" | aluno | não |
| `passos` | por passo de prática (`m02-pratica#3`): feito, itens do checklist, anotações, impressão digital do texto do passo | aluno | não |
| `fases` | fases A a F do caso de uso: o que o aluno **declara**, com link de evidência opcional (seção 3.3) | aluno | não |
| `preferencias` | tema e sequência de mascotes (para evitar repetição) | aplicação | não |

### 3.1. Variáveis do projeto
União do que a E2 (seção 7) listou com o que `method/didatico/curso/m02-pratica.md` já usa:

| Campo | Variável nos textos | Obrigatório | Observação |
|---|---|---|---|
| modo | — | sim | `individual` ou `equipe` |
| domínio | `{{dominio}}` | sim | texto curto, por exemplo "doações de alimentos" |
| código do UC | `{{uc}}` | sim | `uc_pasta` é **derivada** (minúsculas), não digitada |
| nome do UC | `{{uc_nome}}` | sim | |
| entidade principal e campos | `{{entidade}}`, `{{campos}}` | depois do m00 | podem ser sugeridos a partir do caso de uso enviado, sempre com confirmação do aluno |
| repositório | `{{repositorio}}` | não | `dono/nome`; só aparece em textos copiados |
| banco de desenvolvimento e de testes | `{{banco_dev}}`, `{{banco_teste}}` | depois do apoio D | |
| caminho do documento do UC | `{{documento_uc}}` | depois do m02 | relativo a `docs/uc/{{uc_pasta}}/`, como no m02 |
| issue principal | `{{issue_principal}}` | depois do apoio A | número |
| login no GitHub | `{{login}}` | não | ver privacidade (seção 7) |
| logins dos colegas | `{{logins_equipe}}` | não | só no modo `equipe` |

Campo vazio: a variável aparece destacada como "preencha em Meu projeto" (E2, seção 5.2). Nada é inventado.

### 3.2. Exemplo de formato (ilustrativo e incompleto)
```json
{
  "versao": 1,
  "meta": { "commitConteudoCriacao": "<hash>", "commitConteudoUltimaGravacao": "<hash>", "atualizadoEm": "2026-11-21T10:00:00Z" },
  "projeto": { "modo": "equipe", "dominio": "...", "uc": "UC01", "ucNome": "...", "login": null },
  "casoDeUso": { "arquivo": "uc01.md", "texto": "...", "itens": [{ "id": "RN01", "texto": "..." }], "avisos": [] },
  "conteudos": {
    "m05": { "lido": true, "tentativa": { "texto": "...", "em": "..." },
             "gabarito": { "liberadoEm": "...", "motivo": "tentativa" }, "checklist": { "0": true } }
  },
  "passos": { "m02-pratica#3": { "feito": true, "checklist": { "0": true }, "anotacao": "...", "impressaoDoPasso": "<hash do texto>" } },
  "fases": { "A": { "declaracao": "concluida", "evidencia": "https://...", "em": "..." } }
}
```

### 3.3. O que o modelo **não** guarda, de propósito
- **Aprovação de gate.** Em `fases`, a aplicação guarda só uma **declaração do aluno**, exibida como "declarado por você", e um link opcional. Sem link, aparece "a confirmar". O estado oficial é o `state.yaml` do repositório do aluno (regra 15 do `AGENTS.md`). Se a aplicação deve ainda aceitar o `state.yaml` **colado** pelo aluno, para exibir as fases, é assunto da E6.
- **Avaliação da tentativa.** O texto é guardado e não é julgado.
- **Nada sobre o repositório do aluno além do que ele digitou.**

### 3.4. Conteúdo que muda entre versões da imagem
Os progressos são chaveados por `id` do front matter e pelo número do passo. Isso é estável, mas um passo pode ser reescrito e manter o número. **[Recomendação]** Guardar a impressão digital (hash) do texto do passo no momento em que ele é marcado. Se o texto mudar numa imagem nova, a marcação continua, com o aviso "este passo mudou desde que você o marcou". O tratamento completo da divergência fica na E8.

## 4. Onde e como os dados ficam no navegador

**[Recomendação] `localStorage`, uma chave só**, com o documento JSON da seção 3. Motivos: o volume é pequeno (textos curtos e um Markdown), a leitura e a gravação são simples e o comportamento é igual em todos os navegadores. A alternativa, IndexedDB, só se justificaria com arquivos grandes, e não há arquivos grandes.

**[Fato, conhecimento da plataforma web, não testado aqui] Limites que o aluno precisa conhecer (a aplicação os mostra na tela "Seus dados"):**

| Situação | Efeito | Mitigação |
|---|---|---|
| Outra **porta** ou outro endereço (`localhost:4321` versus `127.0.0.1:4321` ou outra porta) | O navegador trata como outro site: o progresso **some** (fica no outro) | Documentar um único comando e endereço; a tela inicial mostra o endereço em uso |
| Outro navegador ou outro computador | Progresso não aparece | Exportar e importar |
| Janela anônima ou limpeza de dados do site | Progresso perdido | Aviso na primeira gravação; lembrete de exportar ao concluir cada módulo |
| Computador compartilhado (laboratório) | Quem usar o mesmo perfil do navegador vê os textos | Botão "apagar meus dados", com confirmação, e recomendação de exportar e apagar ao sair |
| Cota de armazenamento esgotada | Gravação falha | A aplicação avisa e oferece exportar; nunca descarta em silêncio |

**[Recomendação]** Pedir ao navegador armazenamento persistente (`navigator.storage.persist()`) quando disponível. Isso reduz a chance de limpeza automática, mas não garante nada, e a tela não promete o contrário.

## 5. Exportar e importar
- **Formato:** o mesmo JSON da seção 3, em arquivo `.json`, com `versao` e o commit do conteúdo.
- **Duas exportações:** "projeto" (`projeto` e `casoDeUso`, para a equipe) e "tudo" (backup pessoal).
- **Importar "tudo"** substitui os dados atuais. Antes disso, a aplicação baixa automaticamente uma cópia do estado atual e pede confirmação. **Importar "projeto"** substitui só os dois escopos compartilháveis.
- **Validação na importação:** versão conhecida (ou migrável), estrutura conforme o esquema, tamanho máximo. Arquivo inválido é recusado com o motivo; nada é gravado pela metade.
- **Segurança:** o conteúdo importado e o Markdown do caso de uso são **dados**. São exibidos como texto, ou como Markdown com o HTML embutido removido, nunca executados. Isso vale também para o arquivo que um colega envia.
- **Migração:** cada versão nova do esquema traz uma função de migração da anterior. Dado que não pode ser migrado é mantido em `legado` e mostrado ao aluno, nunca descartado.

## 6. Liberação dos gabaritos

[Fato] Há 14 arquivos de gabarito, ligados pelo front matter (`gabarito` no módulo, `gabarito_de` no gabarito). m00, apoio A e apoio B não têm gabarito. O `m04-gabarito.md` cobre `m04` e `apoio-d` (`gabarito_de: [m04, apoio-d]`).

| Estado | Como se chega | O que o aluno vê |
|---|---|---|
| bloqueado | início | Botão "registrar minha tentativa" e, discreto, "abrir mesmo assim" |
| liberado por tentativa | o aluno grava uma tentativa **não vazia** da atividade "Antes de ler a solução" | Gabarito, com a tentativa dele ao lado para comparar |
| liberado antecipadamente | o aluno confirma "abrir mesmo assim" depois do aviso de que perde o exercício | Gabarito, com a marca "aberto antes da tentativa" registrada no progresso dele |

- **[Recomendação]** Não exigir tamanho mínimo nem palavras-chave na tentativa: qualquer regra assim é contornável e daria uma falsa impressão de verificação. A aplicação não avalia a tentativa e diz isso na tela.
- **[Recomendação]** As seções "A solução" dos módulos **não** são escondidas. O conteúdo é aberto no GitHub, e esconder dentro da aplicação só criaria atrito. Em vez disso, a atividade "Antes de ler a solução" aparece com o campo de tentativa logo abaixo dela.
- **Gabarito compartilhado (m04 e apoio D):** **[Recomendação]** liberar o arquivo inteiro com a tentativa de **qualquer um** dos dois, avisando que ele contém as respostas do outro.
- **Texto, até a reescrita (E3, parte 2):** os gabaritos ainda dizem "Uso exclusivo do professor" e "não distribua antes da atividade". **[Recomendação]** Exibir com uma nota fixa no topo: "texto escrito originalmente para o professor; será adaptado para autoestudo". Isso é a opção (a) da E2, seção 8, como solução provisória até a (c).

## 7. Privacidade

**Princípio:** nenhum dado sai do navegador do aluno. A aplicação não tem servidor de aplicação, banco, contas, cookies, análise de uso (*analytics*) nem chamadas a serviços externos.

| Dado | Pessoal? | Por que é pedido | Obrigatório |
|---|---|---|---|
| Domínio, UC, entidade, campos, bancos | não, em princípio | preencher os textos copiáveis e os prompts | conforme a seção 3.1 |
| Caso de uso enviado (Markdown) | não deveria ser | extrair `RF`, `RN`, `CA`, `FA` e `FE` | depois do m00 |
| Repositório `dono/nome` | o dono pode ser um login pessoal | aparecer nos textos copiados | não |
| Login no GitHub (próprio e dos colegas) | sim, é um identificador público | preencher `responsavel`, `revisor` e `por:` nos modelos | não |
| Tentativas, anotações, marcações | podem conter o que o aluno escrever | o progresso dele | não |

Regras de privacidade que viram requisito da implementação (E7):
1. Tela "Seus dados": o que está guardado, onde, como exportar e como apagar.
2. Aviso nos campos de texto e no envio do caso de uso: não escrever dados pessoais de terceiros, senhas nem tokens (regra 10 do `AGENTS.md`).
3. **Nenhum recurso carregado de fora da imagem** (fontes, ícones, bibliotecas). Isso evita expor o endereço de rede (IP) do aluno a terceiros e garante o funcionamento sem internet.
4. O arquivo exportado contém tudo o que o aluno escreveu. A tela diz isso antes de ele enviar o arquivo a um colega.
5. **Versão futura na internet:** o modelo continua o mesmo (nada vai para servidor), mas a hospedagem registra acessos (endereço IP, data). A LGPD (Lei Geral de Proteção de Dados Pessoais) passa então a pedir um aviso sobre esses registros. **[Suposição]** A análise jurídica não foi feita; fica como pendência para quando a publicação for decidida.

## 8. Divergências e pendências encontradas nesta etapa
- **Dupla ou equipe:** `method/didatico/curso/projeto-final.md`, linha 14, diz "trabalho individual ou em dupla", e a decisão P6 diz "equipes de 2 ou mais". Não corrigi. **Proposta:** trocar por "individual ou em equipe" na E3, parte 2. Decisão sua.
- **Variáveis:** a E2, seção 7, não listava `documento_uc`, `issue_principal` e `login`, que o `m02-pratica.md` já usa. A seção 3.1 desta etapa é a lista consolidada; cada novo arquivo de prática que criar uma variável deve acrescentá-la aqui ou na documentação da aplicação.

---

## Fechamento

**O que foi feito:** a proposta de papel único com dois modos, o modelo de dados por escopos com exemplo de formato, o armazenamento e seus limites, a exportação e importação, a máquina de estados da liberação dos gabaritos e a privacidade. Para isso conferi no repositório o front matter dos 32 arquivos (ligação módulo e gabarito, caso do m04 e apoio D), as variáveis do `m02-pratica.md` e as menções a equipe e dupla no curso.

**O que não foi verificado:**
- O comportamento do `localStorage` (isolamento por porta, limpeza, cota) e de `navigator.storage.persist()` vem do meu conhecimento da plataforma web. Não testei em navegadores.
- Se o `parseYaml` do `check-state.mjs` roda no navegador (relevante caso a E6 aceite o `state.yaml` colado). Não executei.
- O tamanho real dos dados de um aluno ao fim do curso. A estimativa de "pequeno" é uma suposição.
- Nenhuma análise jurídica sobre a LGPD.

**O que você precisa decidir:**
1. Validar o **modelo de dados** (seção 3), incluindo a separação entre o que a equipe compartilha e o que é pessoal.
2. Validar `localStorage` com exportar e importar (seções 4 e 5).
3. **Gabaritos:** a regra de liberação (tentativa não vazia, ou abertura antecipada com aviso e registro), não esconder "A solução", o tratamento do m04 com o apoio D e a nota provisória até a reescrita (seção 6).
4. **Fases A a F** só como declaração do aluno, com "a confirmar" sem link. Colar o `state.yaml` fica para a E6 (seção 3.3).
5. A troca de "em dupla" por "em equipe" no projeto final (seção 8).
