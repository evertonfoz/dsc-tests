---
id: m01
tipo: modulo
titulo: 'Módulo 1 — "100% coberto": quem prova?'
ordem: 2
prerequisitos: [m00]
prerequisitos_se_precisar: [apoio-b]
duracao: '2 aulas'
gabarito: m01-gabarito
---

# Módulo 1 — "100% coberto": quem prova?

> **Pré-requisito:** módulo 0 e o apoio B (testes automatizados), se você ainda não escreveu um teste com `it(...)`. Duração sugerida: 2 aulas.
> **Você vai:** transformar uma afirmação de cobertura em uma tabela que qualquer pessoa consegue conferir, e aprender a registrar o que **não** foi feito.

---

## 1. O problema
O relatório de consistência do UC12 (o caso de uso, UC, de cadastrar produto) trazia esta tabela (resumida):

| Elemento | Total | Cobertos | Cobertura |
|---|---|---|---|
| Requisitos funcionais, RF (o que o sistema deve fazer; RF01 a RF05) | 5 | 5 | 100% |
| Regras de negócio, RN (regras do domínio; RN01 a RN04) | 4 | 4 | 100% |
| Fluxos (principal, FA01 e FA02, os fluxos alternativos, e FE01, o fluxo de exceção) | 4 | 4 | 100% |
| Critérios de aceite, CA (condições para aceitar o caso de uso; CA01 a CA04) | 4 | 4 | 100% |

Na coluna de avaliação, a regra de negócio era descrita como "nome obrigatório, **preço positivo**, integridade e atomicidade garantidas". Fonte: `docs/planejamento/uc12-cadastrar-produto/01/01-12-relatorio-consistencia-cobertura.md`.

**Pergunta:** o que você faria para descobrir se esses 100% são verdade?

## 2. Antes de ler a solução: tente você
Use o repositório no estado em que ele estava **antes** das correções. Para isso, na raiz do repositório Git:

```bash
git checkout b71f5e1
```

Esse é o último commit antes de qualquer correção do piloto. (Para voltar ao presente: `git checkout main`.)

Em 20 a 30 minutos, tente provar **três** das afirmações da tabela acima, com o código:
1. A regra do **preço positivo** (RN02).
2. O fluxo de **falha de persistência** (FE01).
3. A regra de **nome obrigatório** (RN01): em que camada ela existe?

Registre, para cada uma: o arquivo que você abriu, o que encontrou e se achou um **teste** que a prove. Só depois siga adiante.

## 3. A tentativa ingênua
Há três atalhos comuns. Todos falham:

| Atalho | Por que falha |
|---|---|
| **Confiar no relatório** | Ele descreve intenção; não executa nada. Neste caso, o relatório afirmava cobertura que o código não sustentava. |
| **Procurar o nome do teste e achar que basta** | O teste pode não existir, não ser executado, ou passar sem provar nada. |
| **Olhar a porcentagem de cobertura de código** | Ela diz que linhas rodaram, não que cada **requisito** foi provado. Uma linha pode rodar sem que a regra seja verificada. |

## 4. O que você deveria ter encontrado
No commit `b71f5e1`:
- `Product` só tinha `productId` e `name`. **Não existia preço**, logo RN02 não podia estar coberta.
- O serviço `createProduct` não validava nada: bastava criar o produto e gravar. A regra do nome vazio existia **só no DTO** (*Data Transfer Object*, a classe que descreve e valida os dados que chegam) da fronteira HTTP (a entrada pela qual o cliente fala com a API).
- Havia **um** teste do serviço (o do caso feliz). Nenhum para falha de persistência.
- O documento do caso de uso define CA01 a CA04, mas o roteiro final citava "CA05".

Conclusão honesta: os "100%" eram uma afirmação sem prova.

> Atenção ao que **não** concluímos. O documento do UC12 diz que a validação de preço é "ilustrativa" e que seus valores não estão definidos. Não implementar o preço **pode ser uma decisão razoável**. O erro não foi a falta do preço: foi **declarar cobertura sem prova e sem decisão registrada**.

## 5. A solução: uma tabela de cobertura que se verifica
Refaça a tabela com **uma linha por item** da especificação, e **duas** colunas decisivas: o teste que prova e a situação.

Um trecho real do resultado final do UC12 (`docs/uc/uc12/evidencias/F/cobertura.md`):

| Item | Teste que prova | Situação |
|---|---|---|
| CA01, RF01 | `should register and save a product when valid data is provided (CA01)` (serviço) e outros dois | Coberto |
| RN01 (nome válido) | `should reject a blank product name in the service without saving (RN01)` e outros | Coberto |
| FE01 (falha de persistência) | `should report an incomplete operation when persistence fails (FE01)` e outros dois | Coberto |
| RF02 (validar informações) | os testes de RN01 | **Parcial:** só o nome |
| RN02, FA02 (preço) | nenhum | **Não implementado**, decisão registrada na ADR-002 (*Architecture Decision Record*, registro de decisão de arquitetura) |

### 5.1. As regras da tabela
1. **Uma linha por item** da especificação (RF, RN, fluxos, critérios).
2. **O nome exato** do teste (o texto do `it(...)`), conferido no código.
3. **O teste foi executado agora**, e a saída ficou guardada (`testes.txt`). Nome que existe mas não passa não vale.
4. Item sem teste tem **uma de duas saídas**: ser implementado ou ter uma **ADR** (registro curto de decisão) de adiamento ou exclusão.
5. Item sem teste e sem ADR fica **"Aguardando decisão"**. Quem decide é uma pessoa, não o assistente.

### 5.2. Etiquetas para as afirmações
Ao escrever um relatório, marque a origem de cada afirmação:

| Etiqueta | Significa |
|---|---|
| *Documentado* | está escrito em um documento (issue, PR — *pull request*, a proposta de mudança no GitHub —, especificação) |
| *Confirmado no código* | você abriu o arquivo e viu |
| *Executado* | você rodou o comando agora e tem a saída |
| *Hipótese* | é uma suposição ainda sem prova |

Só *Executado* prova comportamento.

### 5.3. A ADR de adiamento
Quando um item não será implementado, registre. A ADR-002 do UC12 tem esta forma (resumida): **contexto** (o UC lista preço, mas diz que é ilustrativo e sem valores), **decisão** (preço fora do escopo; o item consta como "não implementado"), **condição para retomar** (quando a especificação definir o campo) e **consequências**. Veja `docs/adr/ADR-002-validacao-de-preco-adiada-uc12.md`.

## 6. Pratique no seu domínio
1. **Liste** todos os itens do seu caso de uso (fluxos, regras, requisitos, critérios) com identificadores.
2. **Monte** a tabela da seção 5 com as colunas *item*, *teste que prova*, *situação*. Neste ponto você ainda não tem testes: a maioria das linhas será **"Aguardando decisão"** ou "A implementar". Isso é o normal e é o ponto de partida.
3. **Procure** um item que você suspeita estar vago. Escreva o que decidiria: implementar, adiar com ADR ou excluir com ADR.
4. **Escreva uma ADR** curta (use `method/templates/adr.md`) para um item que você decidiu adiar.

## 7. Como saber que funcionou
- [ ] Cada item do meu caso de uso tem uma linha na tabela.
- [ ] Nenhuma linha diz "coberto" sem nome de teste.
- [ ] Os itens adiados têm uma ADR escrita.
- [ ] Uma colega, lendo só a tabela, sabe o que está pronto, o que não está e quem decidiu.

## 8. Armadilhas comuns
- **Copiar a tabela de um relatório anterior.** Refaça do zero, item a item.
- **Citar o nome de um teste sem rodá-lo.** Rode e guarde a saída.
- **Chamar de "coberto" um teste que usa um repositório simulado quando o requisito fala do banco real.** No UC12, o teste chamado "de integração" usava um repositório em memória; só outro teste, contra o PostgreSQL, provava a persistência de verdade.
- **Confundir porcentagem de linhas executadas com requisitos provados.**

## 9. Como lidar com a IA (inteligência artificial) neste módulo
Quando a IA disser "tudo coberto", **responda com uma tarefa**, não com um agradecimento:

> Liste cada requisito do documento, o nome exato do teste que o prova, o arquivo onde ele está e o comando para rodá-lo. Marque como "sem prova" o que não tiver teste.

Depois **rode** pelo menos três dos comandos que ela citar. Se algum não existir ou falhar, trate o relatório inteiro como hipótese. A IA pode redigir a tabela e a ADR; **quem decide** se um item é implementado, adiado ou excluído é você.

## 10. Resumo
- "100% coberto" é uma afirmação; **a tabela com testes executados** é a prova.
- Item sem teste termina em teste ou em ADR.
- O erro do UC12 não foi a ausência do preço, e sim declarar cobertura sem prova.

Próximo: módulo 2 (por que o plano e a realidade divergem).
