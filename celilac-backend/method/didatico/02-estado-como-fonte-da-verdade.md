# 02 — Estado como fonte da verdade

> **Público:** estudantes que usarão o método em seus projetos.
> **Objetivo:** entender por que cada caso de uso tem um `state.yaml`, o que ele registra, como é validado e como se relaciona com o perfil do projeto.
> **Pré-requisito:** documento didático 01.

---

## 1. O problema que o `state.yaml` resolve

No UC12, o planejamento dizia 6 Sub-Issues e o GitHub tinha 9. Os números das issues, das branches e dos PRs estavam espalhados por dezenas de arquivos Markdown, cada um com a sua versão. Ninguém conseguia responder rapidamente: **em que fase estamos? quais fatias estão integradas? qual PR corresponde a qual issue?**

Quando a mesma informação mora em muitos lugares, ela diverge. A solução é ter **um lugar só** para os fatos de rastreabilidade, e fazer todo o resto apontar para ele.

> Regra 15 do `AGENTS.md`: divergência entre documento e `state.yaml` → o `state.yaml` vence e o documento é corrigido.

## 2. Dois arquivos, duas perguntas

| Arquivo | Responde | Muda quando |
|---|---|---|
| `project-profile.md` (raiz) | **Como** este projeto funciona? Comandos, portas, versões, proteções, convenções | raramente (mudança de stack ou infraestrutura) |
| `docs/uc/<uc>/state.yaml` | **Onde** este caso de uso está? Fase, fatias, issues, branches, PRs, evidências | a cada fase e a cada fatia |

Os playbooks leem os dois. Assim, o procedimento de uma fase é o mesmo para qualquer projeto: o que muda vem do perfil e do estado.

## 3. Anatomia do `state.yaml`

```yaml
uc: UC12
nome: Cadastrar Produto
documento: ../../planejamento/uc12-cadastrar-produto/uc-12.md   # opcional; se informado, deve existir
arquetipo: criar
epic: { issue: 1, estado: open }
fase_atual: B
fases:
  A:
    status: concluida
    relatorio: relatorios/A.md
    gate:
      - { item: "Epic e Sub-Issues criadas e reconciliadas", resultado: aprovado, por: evertonfoz }
  B: { status: em_andamento, ... }
fatias:
  - id: F01
    comportamento: "Cadastro com dados válidos"
    criterios: [CA01]
    issue: 8
    branch: feature/uc12-f01-cadastro-valido
    pr: 13
    status: integrada
    responsavel: evertonfoz
    revisor: evertonfoz
    evidencias: [evidencias/B/f01-red.txt, evidencias/B/f01-green.txt]
```

Quatro ideias a notar:
1. **Fatia** é a unidade de trabalho. Cada fatia tem um comportamento, os critérios de aceite que cobre, e *uma* issue, *uma* branch, *um* PR.
2. **Gate com `por`**: o resultado "aprovado" só vale com o nome de **quem validou** (pessoa ou CI). O agente não se aprova (regra 21).
3. **Evidências são caminhos de arquivos** que precisam existir. Afirmar sem arquivo não passa na validação.
4. **Fase concluída exige gate totalmente aprovado e relatório.**

## 4. O ciclo de vida de uma fatia

```
planejada ──► em_andamento ──► em_revisao ──► integrada
 (sem issue)   (issue + branch)  (PR aberto)    (PR integrado, revisor, evidências)
```

Cada seta exige campos novos. Por exemplo, uma fatia `em_revisao` sem número de PR é erro; uma `integrada` sem evidências também.

## 5. O validador

`method/scripts/check-state.sh docs/uc/<uc>/state.yaml` verifica, sem internet:
- campos obrigatórios e valores permitidos (arquétipo, status, resultado do gate);
- coerência: não se está na fase C se a B não terminou; Epic fechada só com todas as fases concluídas;
- unicidade: nenhuma issue ou PR atribuído a duas fatias;
- existência de todos os arquivos de relatório e evidência citados;
- gates aprovados com o nome de quem validou.

Com `--remote`, ele também consulta o GitHub (somente leitura, via `gh`):
- a Epic está aberta/fechada como o `state.yaml` diz?
- cada issue e cada PR existe? A fatia "integrada" tem PR realmente *merged*? A "em revisão" tem PR aberto e fora de Draft?
- a branch registrada é a branch do PR?

### 5.1. O validador também foi testado
`method/scripts/testes/rodar-testes.sh` executa 11 casos: o modelo oficial e um arquivo válido devem passar, e nove arquivos propositalmente quebrados devem ser **rejeitados com a mensagem esperada**. Foi assim que descobrimos uma regra faltando: no início da Fase A a Epic ainda não existe, então `epic.issue` pode ser `null`, mas só até a Fase A terminar. Um validador sem testes teria deixado esse erro passar.
O modo `--remote` foi exercitado contra o repositório real: detectou uma Epic fechada que o arquivo dizia aberta e uma issue inexistente, e aceitou a issue #8, o PR #13 e a branch corretos.

## 6. Por que um subconjunto de YAML?

Para o validador funcionar em qualquer máquina **sem instalar pacotes**, ele lê um subconjunto estrito do YAML: mapas, listas, escalares, `[a, b]` e `{k: v}`; sem tabulações, blocos multilinha ou âncoras. Quem quiser usar YAML completo pode trocar o leitor por uma biblioteca. A escolha é uma troca consciente entre **simplicidade de adoção** e **expressividade**, registrada aqui para que ninguém a descubra por acidente.

## 7. Como o modo solo aparece
Se uma só pessoa é autora e revisora, o validador **avisa** (não reprova) que a revisão não é independente. O método não finge equipe: nomeie os papéis honestamente.

## 8. Exercícios
1. Copie `method/templates/state.yaml`, preencha para um caso de uso seu e rode o validador. Que erros apareceram? Corrija-os.
2. Marque uma fatia como `integrada` sem preencher `evidencias`. Qual é a mensagem? Por que essa regra existe?
3. Rode com `--remote` depois de fechar (de propósito, em um repositório de teste) uma issue de fatia ainda `em_andamento`. O que o validador diz?
4. Em que situação `epic.issue: null` é válido? E por que deixa de ser?
5. Explique a diferença entre `project-profile.md` e `state.yaml` usando uma pergunta que cada um responde.

## 9. Referências
- `method/templates/state.yaml` · `method/templates/project-profile.md` · `method/templates/relatorio-de-fase.md` · `method/templates/adr.md`
- `method/scripts/check-state.mjs` · `method/scripts/testes/`
- `method/perfis/celilac-nest.md`

Próximo documento: **03 — Anatomia de um playbook** (Etapa 3).
