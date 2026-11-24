# Como registrar uma prova: a tabela de cobertura

> **Público:** estudantes de Ciência da Computação com Git e GitHub em nível básico, que vão trabalhar um caso de uso do próprio domínio com ajuda de um assistente de IA (inteligência artificial).
> **Documento de apoio de:** [`uc-alterar.md`](./uc-alterar.md), o prompt do UC15 (Alterar Produto). O método vale para qualquer caso de uso; o UC15 é o exemplo desta execução.
> **Continua:** [`uc-buscar-por-que-este-metodo.md`](../uc-14/uc-buscar-por-que-este-metodo.md). Lá você viu **por que** afirmações sem prova são um problema. Aqui você aprende **como** se escreve uma prova que outra pessoa consegue conferir.
> **Você vai:** conhecer a tabela de cobertura, as regras para preenchê-la, a forma de registrar o que **não** será feito e **a estrutura de documentação que vai criar** no seu repositório.

---

## 1. Onde paramos

Você já sabe que um caso de uso (UC, do inglês *use case*) só está pronto quando cada item termina em prova ou em decisão registrada. Falta o formato para **guardar** essa prova e, depois da implementação, confrontá-la com o que foi construído.

## 2. O problema: "N% coberto" não se confere

Um relatório costuma resumir tudo em um número: "90% coberto". Duas coisas escapam desse número:

- **Ele não diz o que ficou de fora.** Os 10% restantes podem ser a regra mais importante.
- **Ele pode medir a coisa errada.** Ferramentas de cobertura contam **linhas de código executadas** por algum teste. Isso não equivale a **requisitos provados**: uma linha pode rodar sem que nenhum teste verifique o que ela deveria garantir.

Um número não tem onde ser conferido. Uma **lista** tem: para cada item, o que o prova.

## 3. Antes de ler adiante: tente você

Use a especificação do caso de uso que você vai trabalhar (nesta execução, o UC15, "Alterar Produto"; no seu projeto, o seu caso). Em cinco minutos:

1. **Liste três itens** dela: pode ser um fluxo, uma regra ou uma situação de falha.
2. Para cada um, escreva o **comando** que você rodaria para mostrar o resultado e o que a **saída** precisaria dizer para você considerá-lo provado.
3. Para cada um, escreva também um jeito de o teste **passar sem provar nada** (por exemplo, ele nunca chega a executar a regra).

Guarde o papel. Você vai relê-lo no fim.

## 4. Três atalhos que não dão uma prova

| Atalho | Por que falha |
|---|---|
| **Citar o nome de um teste** | O teste pode não existir, não ser executado ou estar falhando. |
| **Mostrar a porcentagem da ferramenta** | Mede linhas executadas, não requisitos provados. |
| **Dizer "rodei e funcionou"** | Outra pessoa não consegue repetir nem conferir. |

## 5. A tabela de cobertura

Uma linha por item da especificação. Três colunas:

| Coluna | O que vai nela |
|---|---|
| **Item** | O identificador do fluxo, regra, requisito ou critério (por exemplo, RN01, FE01, CA03). |
| **Teste que prova** | O **nome exato** do teste, como está escrito no código. |
| **Situação** | Um destes valores: *Coberto*, *Parcial*, *A implementar*, *Não implementado* ou *Aguardando decisão*. |

### 5.1. As regras de preenchimento

1. **Uma linha por item.** Nenhum item da especificação fica de fora.
2. **O nome do teste é conferido no código.** Não vale reproduzir de memória.
3. **O teste foi executado agora**, e a saída ficou guardada. Um nome que existe, mas não passa, não conta como prova.
4. **"Parcial" diz qual parte falta.** Um item que cobre só parte do que a especificação pede não vira "Coberto".
5. **Item sem teste tem duas saídas:** ser implementado, ou ter uma **decisão registrada** de adiamento ou exclusão (seção 7).
6. **Enquanto ninguém decidir, o item é "Aguardando decisão".** Quem decide é uma pessoa, não o assistente.

### 5.2. Exemplo hipotético

*Exemplo para orientar a escrita; não é a especificação do UC15.*

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal | `should update the product when the data is valid` | Coberto |
| Regra do nome | `should reject a blank name` (só na entrada HTTP) | **Parcial:** o serviço não é testado |
| Falha de persistência | nenhum | **Aguardando decisão** |

Uma tabela como essa mostra o que está pronto, o que está pela metade e o que falta decidir. Ela não tem 100%, e não precisa ter.

## 6. De onde vem cada afirmação

Ao escrever o relatório, marque a origem de cada afirmação:

| Etiqueta | Significa |
|---|---|
| *Documentado* | Está escrito em um documento (issue, PR, especificação). |
| *Confirmado no código* | Alguém abriu o arquivo e viu. |
| *Executado* | O comando foi rodado agora e a saída existe. |
| *Hipótese* | É uma suposição ainda sem prova. |

(PR é *Pull Request*, a proposta de mudança que se abre no GitHub para ser revisada antes de entrar na `main`.) Só *Executado* prova comportamento.

## 7. Registrar o que não será feito: a ADR

Esta é a primeira vez que o curso usa a sigla **ADR** (*Architecture Decision Record*, registro de decisão arquitetural). Ela é o formato que a seção 5.1 pede na regra 5.

### 7.1. Fundamentação

Decisões acontecem o tempo todo em um projeto: "não vamos validar isso agora", "o produto removido responde como inexistente". Sem registro, elas têm três destinos ruins:

- **Se perdem.** Meses depois, ninguém lembra se algo foi esquecido ou decidido.
- **São refeitas.** A equipe discute de novo, sem saber que já havia um acordo.
- **São tomadas em silêncio**, por quem codifica ou pelo assistente de IA, sem que ninguém tenha aprovado.

Uma ADR resolve isso guardando **uma** decisão em um documento curto, com data e responsável. Quem chegar depois consegue ler o que foi decidido, **por quê** e **o que precisaria mudar** para decidir de novo.

### 7.2. Objetivo

Para este curso, a ADR serve a um propósito específico: **dar um destino legítimo a um item que não terá teste**. Com ela, "não implementado" deixa de ser uma lacuna escondida e passa a ser uma decisão com dono.

### 7.3. Quando escrever (e quando não)

| Escreva uma ADR quando... | Não escreva quando... |
|---|---|
| Um item da especificação **não será implementado agora**. | O item será implementado normalmente. |
| A especificação **não define** a regra e você decidiu **não assumir** uma. | Você só quer anotar uma dúvida (isso é uma pergunta, não uma decisão). |
| Você decidiu **excluir** um item do escopo. | A decisão é pequena e local, sem efeito sobre a especificação. |

### 7.4. Modelo

Cada ADR é um arquivo com estas partes:

```markdown
# ADR-NNN — <título curto da decisão>

- **Status:** Proposta | Aceita | Substituída por ADR-NNN
- **Data:** AAAA-MM-DD
- **Decisores:** <quem decidiu>
- **Caso de uso / fase:** <código e nome; fase, se houver>

## Contexto
<Por que o item existe e por que surgiu a dúvida? Que evidências existem?>

## Decisão
<O que foi decidido, de forma direta: adiar ou excluir, e o quê.>

## Condição para retomar
<O que precisa acontecer para o item voltar ao escopo?>

## Consequências
- (+) <benefício>
- (−) <custo ou risco>

## Alternativas consideradas
- <alternativa> — descartada porque <motivo>.
```

### 7.5. Exemplos

**Exemplo A, adiamento** *(hipotético, no estilo do UC15)*:

```markdown
# ADR-001 — Alteração de preço adiada no UC15

- **Status:** Aceita
- **Data:** 2026-12-01
- **Decisores:** estudante responsável pelo UC15
- **Caso de uso / fase:** UC15 — Alterar Produto, Fase A

## Contexto
A especificação cita "alterar o valor do produto", mas o produto só tem o
atributo `name`. Não há regra de preço definida (faixa, formato, moeda).

## Decisão
A alteração de preço fica fora do escopo atual. O item consta na tabela de
cobertura como "Não implementado (ADR-001)".

## Condição para retomar
Quando a especificação definir o atributo de preço e suas restrições.

## Consequências
- (+) Evita implementar uma regra inventada.
- (+) A tabela deixa de afirmar o que não tem prova.
- (−) O UC15 não cobre alteração de preço até a especificação ser completada.

## Alternativas consideradas
- Implementar com regras assumidas — descartada: a hipótese viraria
  requisito sem confirmação.
```

**Exemplo B, exclusão** *(hipotético)*:

```markdown
# ADR-002 — Restauração de produto removido fora do UC15

- **Status:** Aceita
- **Data:** 2026-12-01
- **Decisores:** estudante responsável pelo UC15
- **Caso de uso / fase:** UC15 — Alterar Produto, Fase A

## Contexto
Alguém pode esperar que "alterar" também reative um produto removido.
A especificação não pede isso.

## Decisão
Reativar produto removido está **excluído** do UC15. Alterar um produto
removido responde como produto inexistente.

## Condição para retomar
Um caso de uso próprio de restauração, se um dia for especificado.

## Consequências
- (+) O UC15 fica pequeno e verificável.
- (−) Quem precisar restaurar produtos terá de esperar outro UC.

## Alternativas consideradas
- Reativar ao alterar — descartada: mistura duas operações em um UC.
```

**Exemplo C, adiamento de uma preocupação técnica** *(hipotético)*. Nem todo adiamento é de uma regra de negócio: às vezes é de um cuidado técnico que o caso de uso poderia ter, mas que não compensa agora.

```markdown
# ADR-003 — Controle de alterações simultâneas adiado no UC15

- **Status:** Aceita
- **Data:** 2026-12-01
- **Decisores:** estudante responsável pelo UC15
- **Caso de uso / fase:** UC15 — Alterar Produto, Fase A

## Contexto
Duas pessoas podem alterar o mesmo produto quase ao mesmo tempo. Sem
controle, a última gravação sobrescreve a anterior sem aviso. O UC15
altera um único atributo (`name`), e perder uma alteração simultânea tem
custo baixo.

## Decisão
Não haverá controle de concorrência no UC15: vale a **última gravação**.
O item consta na tabela de cobertura como "Não implementado (ADR-003)".
Um teste documenta a regra: duas alterações em sequência deixam o valor da
última. Ele não prova comportamento sob concorrência real.

## Condição para retomar
Quando houver mais de um atributo alterável, ou dados em que perder uma
alteração tenha custo. O controle (por exemplo, uma versão do item) seria
um caso de uso próprio, com migration e mudança de contrato.

## Consequências
- (+) O UC15 fica simples, sem atributo novo nem migration.
- (+) A limitação está escrita, em vez de escondida.
- (−) Uma alteração pode sobrescrever outra sem aviso.

## Alternativas consideradas
- Controlar com versão do item agora — descartada: exige atributo novo,
  migration e novo formato de erro para um ganho pequeno neste UC.
```

**Exemplo real:** o projeto CeliLac, usado como caso de referência no curso, tem uma ADR equivalente ao Exemplo A (`docs/adr/ADR-002-validacao-de-preco-adiada-uc12.md`). Ela serve de leitura; **você não copia esse arquivo**: cria a sua, com o modelo da seção 7.4.

## 8. A estrutura de documentação que você vai criar

### 8.1. Fundamentação: por que uma estrutura

Até aqui, as decisões e as provas do seu caso de uso poderiam ficar em qualquer lugar: no chat com a IA, em anotações, na cabeça de alguém. O método pede o contrário: **cada tipo de informação tem um lugar fixo no repositório**, versionado junto com o código. Isso traz três vantagens:

- **Quem chega depois encontra tudo.** Uma colega, o professor ou você mesmo, meses depois, sabe onde olhar.
- **O histórico acompanha o código.** Como os arquivos estão no Git, cada mudança de uma decisão ou de uma tabela tem data e autor.
- **A IA trabalha sobre o que está escrito.** O assistente consegue ler a especificação e a tabela, em vez de depender do que você lembrar de contar.

### 8.2. Como criar os arquivos

Em qualquer caso, cada arquivo é preenchido com os dados do **seu** caso de uso. Os nomes e exemplos do CeliLac servem para ilustrar, não para reaproveitar. Se um arquivo já existir no seu repositório, **não o sobrescreva**: acrescente a ele, ou use o próximo número livre.

Há dois caminhos, conforme o seu repositório:

| Se o seu repositório... | Então... |
|---|---|
| **já tem** a pasta `method/` | Copie o modelo de `method/templates/` para o lugar indicado e preencha com o seu caso de uso. Esses modelos são a **versão de referência** do curso: em caso de diferença com este documento, siga os de lá. |
| **não tem** a pasta `method/` | Crie o arquivo a partir dos modelos deste documento. Não copie arquivos de outro projeto. |

### 8.3. O mapa

```text
seu-repositorio/
└── docs/
    ├── planejamento/
    │   └── <uc>.md                ← 1) a especificação do caso de uso
    ├── uc/
    │   └── <uc>/                  ← por exemplo, uc15
    │       ├── relatorios/
    │       │   └── A.md           ← 2) a tabela de cobertura
    │       └── evidencias/
    │           └── <fase>/        ← 4) saídas reais de comandos (mais adiante)
    └── adr/
        └── ADR-001-<titulo>.md    ← 3) uma ADR por decisão
```

| # | Item | O que é | Para que serve | Quando criar |
|---|---|---|---|---|
| 1 | `docs/planejamento/<uc>.md` | A especificação do caso de uso: objetivo, ator, fluxos, regras, critérios de aceite. | É a **lista de itens** que a tabela de cobertura vai conferir. Sem ela, não há o que provar. | Agora, se ainda não existir. |
| 2 | `docs/uc/<uc>/relatorios/A.md` | O relatório da fase A, onde mora a tabela de cobertura. | Mostra, item a item, o que está provado, parcial ou pendente. | Agora; você o atualiza ao longo do caso de uso. |
| 3 | `docs/adr/ADR-NNN-<titulo>.md` | Uma decisão registrada (seção 7). | Dá destino legítimo a um item que não terá teste. | Agora, para ao menos um item. |
| 4 | `docs/uc/<uc>/evidencias/<fase>/` | Um arquivo por execução de comando, com a saída real. | É a prova de que um teste foi **executado agora** (regra 3 da seção 5.1). | Mais adiante, quando houver testes. |

**Por que a pasta `adr/` fica fora de `uc/<uc>/`?** Uma decisão pode valer para vários casos de uso (por exemplo, "produto removido responde como inexistente" afeta busca, alteração e listagem). Por isso as ADRs são do projeto, enquanto planejamento, relatório e evidências são de **um** caso de uso.

### 8.4. Item 1: a especificação do caso de uso

**O que é:** o documento que diz o que o caso de uso deve fazer. **Para que serve:** é a fonte dos identificadores (`RF01`, `RN01`, `FA01`, `FE01`, `CA01`...) que a tabela de cobertura usa como linhas. Mantenha esse formato de identificador.

Crie `docs/planejamento/<uc>.md` com esta estrutura:

```markdown
# <UC> — <Nome do caso de uso>

## 1. Identificação
**Código:** <UC>
**Nome:** <nome>
**Sistema:** <nome do seu sistema>
**Módulo:** <parte do sistema a que pertence>
**Tipo:** <criar | consultar | atualizar | excluir>

## 2. Objetivo
<Uma ou duas frases: o que o caso de uso permite fazer e por quê.>

## 3. Atores
**Ator principal:** <quem inicia o caso de uso>

## 4. Pré-condições
1. <O que precisa ser verdade antes de começar.>

## 5. Pós-condições
### Em caso de sucesso
1. <O que passa a ser verdade.>
### Em caso de falha
1. <O que **não** pode acontecer.>

## 6. Fluxo principal
1. O ator <...>.
2. O sistema <...>.

## 7. Fluxos alternativos e de exceção
### FA01 — <nome curto>
1. <Passos de um caminho diferente do principal.>
### FE01 — <nome curto>
1. <Passos de quando algo dá errado.>

## 8. Regras de negócio
**RN01 — <nome curto>:** <a regra, de modo verificável: qual entrada a viola e o que acontece>.

## 9. Requisitos funcionais
**RF01 — <nome curto>:** <o que o sistema deve fazer>.

## 10. Critérios de aceite
**CA01:** <dado X, quando Y, então Z>.

## 11. O que ainda não está definido
- <Item vago ou sem decisão, e quem decide.>
```

Onde você não souber, escreva `a confirmar`. Uma regra que ninguém definiu é uma **pendência**, não um requisito.

### 8.5. Item 2: o relatório A

**O que é:** o relatório da primeira fase do método (planejar e publicar); por ora, trate `A` apenas como o nome do arquivo. **Para que serve:** guardar a tabela de cobertura da seção 5.

```markdown
# Relatório A — <código e nome do caso de uso>

## Tabela de cobertura

| Item | Teste que prova | Situação |
|---|---|---|
| <ex.: fluxo principal> | — | A implementar |
| <ex.: RN01> | — | Aguardando decisão |
```

### 8.6. Item 3: as ADRs

Use o modelo da seção 7.4. Crie o arquivo em `docs/adr/`, numerando em sequência (`ADR-001`, `ADR-002`...) e com um título curto no nome (`ADR-001-alteracao-de-preco-adiada.md`).

### 8.7. Item 4: as evidências (mais adiante)

**O que é:** o registro de uma execução real de comando. **Para que serve:** permitir que outra pessoa veja **o que foi rodado, quando, em qual versão do código e com qual resultado**, sem acreditar na sua palavra. Não é hora de criar, porque ainda não há testes. Quando houver, crie `docs/uc/<uc>/evidencias/<fase>/` e, nela, um arquivo por execução:

```markdown
**O que foi executado:** <comando completo, com as opções relevantes>
**Data e hora UTC:** <AAAA-MM-DDThh:mm:ssZ>
**Commit de base:** <hash obtido com `git rev-parse HEAD` antes da execução>
**Diretório/ambiente:** <onde foi rodado e o que afeta o resultado>
**Código de saída:** <código retornado pelo processo>

<saída real do comando, colada sem reescrever>

**Leitura do resultado:** <o que a saída confirma e o que não confirma>
```

Regras: preencha **somente depois** de executar; nunca cole uma saída ilustrativa ou esperada como se fosse real; remova segredos e dados pessoais antes de guardar.

## 9. Seu próximo passo

Ainda sem programar:

1. **Crie a especificação** (`docs/planejamento/<uc>.md`), se ainda não existir, e **liste os itens** do seu caso de uso, cada um com identificador.
2. **Crie o `A.md`** (`docs/uc/<uc>/relatorios/A.md`) e monte a tabela. Como ainda não há testes, quase tudo será "Aguardando decisão" ou "A implementar": é o ponto de partida.
3. **Escolha um item que você suspeita estar vago** e decida: implementar, adiar ou excluir.
4. Se decidiu adiar ou excluir, **crie a ADR** em `docs/adr/`, com o modelo da seção 7.4.

## 10. Como saber que funcionou

- [ ] Sei explicar por que linhas executadas não equivalem a requisitos provados.
- [ ] Reli o papel da seção 3 e marquei o que mudaria hoje.
- [ ] Existe `docs/planejamento/<uc>.md` com os itens do meu caso de uso, cada um com identificador.
- [ ] Existe um `A.md` com uma linha para cada um desses itens.
- [ ] Nenhuma linha diz "Coberto" sem o nome de um teste.
- [ ] Existe ao menos uma ADR com todas as partes preenchidas.
- [ ] Uma colega, lendo só a tabela e a ADR, sabe o que está pronto, o que não está e quem decidiu.

## 11. Armadilhas comuns

- **Copiar a tabela de outro caso de uso.** Refaça do zero, item a item.
- **Chamar de "Coberto" um teste que usa um repositório simulado quando o requisito fala do banco real.**
- **Omitir um item difícil** em vez de registrá-lo como "Aguardando decisão".
- **Escrever uma ADR sem "Condição para retomar".** Sem ela, o adiamento vira exclusão disfarçada.

## 12. Como lidar com a IA neste ponto

A IA pode redigir a tabela e a ADR. Para isso render, faça um pedido que exija o que é conferível:

> Liste cada item do documento, o nome exato do teste que o prova, o arquivo onde ele está e o comando para rodá-lo. Marque como "sem prova" o que não tiver teste.

Depois, **rode você mesmo** pelo menos três dos comandos que ela citar. Se algum não existir ou falhar, trate a tabela inteira como hipótese até conferir o resto.

---

## Siglas usadas neste documento

| Sigla | Significado | Em uma frase |
|---|---|---|
| UC | *Use Case*, caso de uso | Comportamento do sistema do ponto de vista de quem o usa |
| IA | Inteligência Artificial | Aqui, o assistente de código usado no curso |
| ADR | *Architecture Decision Record*, registro de decisão arquitetural | Documento curto que guarda **uma** decisão: contexto, decisão, condição para retomar e consequências |
| PR | *Pull Request* | Proposta de mudança no GitHub, revisada antes de entrar na `main` |
| HTTP | *HyperText Transfer Protocol* | O protocolo pelo qual um cliente pede algo a uma API |
| RN, FE, CA | Regra de Negócio, Fluxo de Exceção, Critério de Aceite | Rótulos dos itens de um caso de uso (RN01, FE01, CA03) |

---

Próximo passo: o módulo 1 do curso ("100% coberto: quem prova?").
