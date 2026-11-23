---
id: m02-pratica
tipo: pratica
titulo: 'Prática do módulo 2 — O estado do seu caso de uso'
pratica_de: m02
---

# Prática do módulo 2 — O estado do seu caso de uso

> **Para quê:** criar o `state.yaml` do **seu** caso de uso (UC, *Use Case*: caso de uso) e ver o validador conferir o que ele diz. Este arquivo detalha a seção "Pratique no seu domínio" de `m02-estado-como-fonte.md`.
> **Onde:** no **seu** repositório, não no repositório do curso.
> **Antes de começar:** o seu repositório precisa ter a pasta `method/` (com `method/templates/state.yaml` e `method/scripts/check-state.sh`) e o documento do seu caso de uso. Se ainda não tiver a pasta `method/`, copie-a do repositório do curso.
> **Sobre os prompts:** são para o seu assistente de IA (inteligência artificial). O que ele disser é hipótese até você ver a saída real de um comando.

Os textos entre chaves duplas, como `{{uc}}`, são os dados do seu projeto. A aplicação do curso não coleta esses dados. Ao usar o arquivo no seu repositório, substitua cada variável pelos dados que você decidiu para o seu projeto; os exemplos são apenas ilustrativos.

| Variável | O que é | Exemplo |
|---|---|---|
| `{{uc}}` | código do caso de uso | `UC01` |
| `{{uc_pasta}}` | o mesmo código, em minúsculas | `uc01` |
| `{{uc_nome}}` | nome do caso de uso | `Registrar Doação` |
| `{{documento_uc}}` | caminho do documento do caso de uso, **relativo a `docs/uc/{{uc_pasta}}/`** | `../../planejamento/uc01.md` | <!-- links:ignore -->
| `{{issue_principal}}` | número da issue principal do caso de uso (apoio A) | `3` |
| `{{login}}` | seu login no GitHub | `seu-login` |

---

### Passo 1 — Criar a pasta e copiar o modelo
<!-- passo: tipo=comando -->

**Para quê:** cada caso de uso tem a própria pasta, com o código em **minúsculas**. O modelo já traz os campos que o validador exige.

**Onde:** na raiz do seu repositório, no terminal.

```bash arquivo="(terminal)"
mkdir -p docs/uc/{{uc_pasta}}
cp method/templates/state.yaml docs/uc/{{uc_pasta}}/state.yaml
```

```prompt
Estou no meu repositório. Crie a pasta docs/uc/{{uc_pasta}} e copie method/templates/state.yaml para docs/uc/{{uc_pasta}}/state.yaml.
Antes de copiar, confira se o arquivo de destino já existe; se existir, pare e me avise, sem sobrescrever.
Depois, rode `ls docs/uc/{{uc_pasta}}` e me mostre a saída real.
```

**Como saber que funcionou**
- [ ] `ls docs/uc/{{uc_pasta}}` mostra `state.yaml`.

---

### Passo 2 — Preencher o estado com duas fatias planejadas
<!-- passo: tipo=criar-arquivo -->

**Para quê:** o arquivo passa a dizer **onde** o seu caso de uso está: fase A, nenhuma fatia começada.

**Onde:** `docs/uc/{{uc_pasta}}/state.yaml` (substitua o conteúdo copiado no passo 1).

**O que observar ao preencher:**
- `documento` é relativo **a este arquivo**, e o validador confere se ele existe.
- Fatia `planejada` ainda não tem issue, branch nem PR (*pull request*): deixe `null`. Cada mudança de status exige campos novos (seção 4.3 do módulo).
- Escreva o comportamento das fatias com o seu domínio, e os critérios com os identificadores do **seu** documento (`RN01`, `FA01`, `CA01`...).
- Nenhum gate fica `aprovado` agora. Quem aprova é você, mais tarde, com o seu login em `por:`.

```yaml arquivo="docs/uc/{{uc_pasta}}/state.yaml"
# state.yaml — fonte da verdade do caso de uso {{uc}}.
# Valide com:  method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml [--remote]

uc: {{uc}}
nome: {{uc_nome}}
documento: {{documento_uc}}
arquetipo: criar
epic: { issue: {{issue_principal}}, estado: open }
fase_atual: A

fases:
  A:
    status: em_andamento
    relatorio: null
    gate:
      - { item: "Epic e Sub-Issues criadas e reconciliadas com este arquivo", resultado: pendente }
      - { item: "GitHub Project configurado com os 5 estados", resultado: pendente }
    evidencias: []
  B:
    status: pendente
    relatorio: null
    gate:
      - { item: "Todas as fatias integradas na branch principal", resultado: pendente }
      - { item: "CI verde na branch principal", resultado: pendente }
    evidencias: []
  C: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  D: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  E: { status: pendente, relatorio: null, gate: [], evidencias: [] }
  F: { status: pendente, relatorio: null, gate: [], evidencias: [] }

fatias:
  - id: F01
    comportamento: "<o caso de uso dá certo com dados válidos>"
    criterios: [CA01]
    issue: null
    branch: null
    pr: null
    status: planejada
    responsavel: {{login}}
    revisor: null
    evidencias: []
  - id: F02
    comportamento: "<uma regra rejeita a entrada inválida, sem gravar nada>"
    criterios: [RN01, FA01]
    issue: null
    branch: null
    pr: null
    status: planejada
    responsavel: {{login}}
    revisor: null
    evidencias: []
```

```prompt
Estou no meu repositório, no caso de uso {{uc}} ({{uc_nome}}). Leia o documento do caso de uso em docs/uc/{{uc_pasta}}/{{documento_uc}} e o modelo docs/uc/{{uc_pasta}}/state.yaml.
Preencha o state.yaml com: uc {{uc}}, nome "{{uc_nome}}", documento {{documento_uc}}, arquetipo criar, epic com a issue {{issue_principal}} e estado open, fase_atual A.
Proponha DUAS fatias com status planejada: F01 (o caso de uso dá certo com dados válidos) e F02 (uma regra do documento rejeita uma entrada inválida sem gravar nada). Use nos critérios só identificadores que EXISTEM no documento; se faltar algum, me diga em vez de inventar.
Regras: issue, branch e pr ficam null; nenhum gate fica "aprovado"; responsavel {{login}}; não use blocos multilinha (| ou >) nem tabulações, porque o validador não os aceita.
Mostre o arquivo completo e espere a minha confirmação antes de gravar. No fim, diga o que você conferiu no documento e o que está presumindo.
```

**Como saber que funcionou**
- [ ] O comportamento de cada fatia está escrito com termos do **seu** domínio, não com os do exemplo.
- [ ] Cada critério citado existe no seu documento do caso de uso.

---

### Passo 3 — Rodar o validador
<!-- passo: tipo=comando -->

**Para quê:** o arquivo é conferido por programa, e não pela sua leitura (seção 5 do módulo).

**Onde:** na raiz do seu repositório.

```bash arquivo="(terminal)"
method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml
echo "código de saída: $?"
```

**O que você deve ver:** uma linha `OK: docs/uc/{{uc_pasta}}/state.yaml válido (local).` e `código de saída: 0`. Se aparecer `ERRO`, leia **cada** linha: ela diz o campo e a fatia. Um erro comum é o caminho de `documento` não existir.

```prompt
Rode `method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml` e depois `echo $?`. Mostre as duas saídas reais, sem resumir.
Se houver ERRO, explique cada linha e proponha a correção, mas não altere o arquivo sem a minha confirmação.
Não diga que o arquivo está válido se o código de saída não for 0.
```

**Como saber que funcionou**
- [ ] O validador terminou com `OK` e código de saída `0`, e foi **você** quem viu a saída.

---

### Passo 4 — Quebrar de propósito
<!-- passo: tipo=comando -->

**Para quê:** ver o validador recusar uma afirmação sem prova. Uma fatia `integrada` precisa de issue, branch, PR, revisor e evidências.

**Onde:** `docs/uc/{{uc_pasta}}/state.yaml`.

1. Na fatia F01, troque `status: planejada` por `status: integrada`.
2. Rode o validador de novo:

```bash arquivo="(terminal)"
method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml
echo "código de saída: $?"
```

**Exemplo didático ilustrativo** (saída esperada ao provocar este erro; não é uma execução no seu repositório):

```text
ERRO   fatias[0] (integrada) exige issue
ERRO   fatias[0] (integrada) exige branch
ERRO   fatias[0] (integrada) exige pr
ERRO   fatias[0] (integrada) exige evidencias
ERRO   fatias[0] (integrada) exige revisor

FALHOU: 5 erro(s).
```

e `código de saída: 1`.

3. **Desfaça** a mudança e confirme:

```bash arquivo="(terminal)"
git diff --stat docs/uc/{{uc_pasta}}/state.yaml
method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml
```

```prompt
Quero ver o validador recusar uma afirmação sem prova. Em docs/uc/{{uc_pasta}}/state.yaml, troque o status da fatia F01 de planejada para integrada, rode `method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml; echo $?` e mostre a saída real.
Em seguida DESFAÇA a mudança (volte para planejada), rode o validador de novo e mostre que voltou a OK com código 0.
Não preencha issue, pr ou evidencias para "consertar" o erro: o objetivo é ver o erro, não fazê-lo sumir.
```

**Como saber que funcionou**
- [ ] Você viu os erros e o código de saída `1`.
- [ ] Depois de desfazer, o validador voltou a `OK`.

---

### Passo 5 — Conferir com o GitHub
<!-- passo: tipo=github -->

**Para quê:** o arquivo diz coisas sobre o GitHub (a issue principal está aberta?). Com `--remote`, o validador **pergunta ao GitHub**, só lendo.

**Onde:** na raiz do seu repositório, com o `gh` (a ferramenta de linha de comando do GitHub, apoio A) instalado e autenticado.

```bash arquivo="(terminal)"
gh auth status
method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml --remote
echo "código de saída: $?"
```

**O que pode aparecer** (mensagens do validador, em `method/scripts/check-state.mjs`):
- `OK: ... válido (local + GitHub).`: o GitHub confirma o que o arquivo diz.
- `epic #{{issue_principal}}: não encontrado no GitHub (...)`: o número da issue está errado ou ela é de outro repositório.
- `epic #{{issue_principal}}: state.yaml diz open, GitHub diz closed`: o arquivo e o GitHub divergem. **Quem corrige é você**, decidindo qual dos dois está certo.
- ``--remote exige `gh` instalado e autenticado (gh auth status)``: rode `gh auth login` antes.

```prompt
Rode `gh auth status` e depois `method/scripts/check-state.sh docs/uc/{{uc_pasta}}/state.yaml --remote; echo $?`. Mostre as saídas reais.
Se o GitHub contradisser o state.yaml, explique a divergência e pergunte o que eu decido. Não feche, reabra nem edite issues ou PRs, e não altere o state.yaml sem a minha confirmação.
```

**Como saber que funcionou**
- [ ] O validador terminou com `OK ... (local + GitHub)`, ou você entendeu e registrou a divergência que ele apontou.

---

## Ao terminar
Volte ao módulo e confira a seção "Como saber que funcionou" de `m02-estado-como-fonte.md`.


## Formato para guardar saídas reais

Quando a prática pedir para guardar uma execução, use `method/templates/evidencia-de-comando.md` em `docs/uc/{{uc_pasta}}/evidencias/<fase>/`. Os blocos de saída deste arquivo são exemplos didáticos; substitua-os pela saída realmente obtida no seu projeto.
