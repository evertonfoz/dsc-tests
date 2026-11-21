---
id: m03
tipo: modulo
titulo: 'Módulo 3 — Por que a `main` ficou vermelha?'
ordem: 6
prerequisitos: [apoio-a, apoio-b, m02]
duracao: '2 aulas'
gabarito: m03-gabarito
---

# Módulo 3 — Por que a `main` ficou vermelha?

> **Pré-requisito:** apoios A e B, e o módulo 2. Duração sugerida: 2 aulas.
> **Você vai:** reproduzir um problema real, entender por que dividir o trabalho por camada o causa, e aprender a dividir por **comportamento**.

---

## 1. O problema
No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), duas tarefas foram abertas: uma para **escrever o teste** (SUB-07) e outra para **implementar o serviço** (SUB-05). Cada uma virou um pull request (PR, a proposta de mudança no GitHub): o PR #12 trouxe o teste, o PR #13 trouxe o código.

O PR #12 foi integrado primeiro. O resultado, no instante em que ele entrou na linha principal (`main`): **o projeto passou a ter um teste que falhava**.

## 2. Antes de ler a solução: reproduza
Na raiz do repositório Git, volte a esse instante:

```bash
git checkout 5081158
cd celillac-backend-prepare
pnpm install
pnpm exec vitest run src/modules/products/services
```
Leia a saída. Responda:
1. Qual teste falhou e com qual mensagem?
2. Abra `src/modules/products/services/products.service.ts`. O que o método `createProduct` faz?
3. Se alguém integrasse uma terceira mudança naquele momento, o robô que roda os testes (a integração contínua, CI; apoio C) a aceitaria?

Para voltar ao presente: `git checkout main`.

## 3. O que você deveria ter visto
O teste `should register and save a product when valid data is provided (CA01)` (CA01 é o primeiro critério de aceite, CA, do caso de uso) falha com `Error: Not implemented: createProduct`. O serviço, naquele ponto, só lançava esse erro. O teste estava **certo**; o código ainda não existia. Executei esse mesmo passo ao preparar o curso, e a falha aparece como descrito.

Aquela `main` estava **vermelha**: ninguém sabia se um novo erro era do trabalho novo ou do teste que sempre falhou.

## 4. A tentativa ingênua
Dividir o trabalho **pela camada técnica**: "uma tarefa para o teste, outra para o serviço, outra para o controller, outra para o banco". Parece organizado, porque cada tarefa é pequena.

Falha porque separa o que o TDD (desenvolvimento guiado por testes, apoio B) pede para manter **junto**: o teste que falha (RED) e o código mínimo que o faz passar (GREEN) de **um mesmo comportamento**. Quem integra a primeira metade deixa o projeto quebrado até a segunda chegar. Esse padrão, de um PR que depende de outro ainda não integrado, chama-se **PR empilhado** (*stacked PR*).

## 5. A solução: dividir por comportamento
Uma **fatia** é um **comportamento observável** do caso de uso, com uma regra, um critério de aceite e um teste RED que já tem nome. Exemplos: "cadastrar com dados válidos", "rejeitar nome vazio". Não são fatias: "criar o DTO" (*Data Transfer Object*, a classe que descreve e valida os dados que chegam), "implementar o controller", "escrever o teste".

> **Regra:** uma fatia = **uma** issue, **uma** branch, **um** PR. Dentro do PR, o ciclo RED, GREEN e REFACTOR vai em **commits separados**.

Exemplo real: a fatia F03, "o serviço rejeita nome vazio no núcleo", no PR #26. Os commits, na ordem:
1. `test(products): add failing test for empty name rejection in the service` (RED)
2. `feat(products): reject empty product name in the service (refs #24)` (GREEN)

A saída do RED, guardada como evidência, mostra por que falhou: `promise resolved "undefined" instead of rejecting` (`docs/uc/uc12/evidencias/B/f03-red.txt`). Depois do GREEN, os testes de products passam (`docs/uc/uc12/evidencias/B/f03-green.txt`).

O ponto principal: o PR só é integrado com o CI **verde**. Nunca existe um instante em que a `main` tenha um teste falhando por falta do código.

### 5.1. Como cortar um caso de uso em fatias
1. **Um comportamento por fatia.** Se a descrição precisa de "e" ligando dois comportamentos, são duas fatias.
2. **Todo critério de aceite** do caso de uso pertence a uma fatia (ou a uma decisão registrada, módulo 1).
3. **Cada fatia tem um teste RED nomeado** antes de começar.
4. **Ordem:** caminho feliz, validações de entrada, regras de negócio, falhas de infraestrutura.
5. **Tamanho:** o PR deve ser revisável de uma vez (referência: até cerca de 300 linhas de diferença).
6. **Trabalho de infraestrutura** (contêineres, CI) **não** é fatia: é a Fundação do projeto (módulo 4).
7. **Sem fatias artificiais.** Um caso pequeno pode ter duas ou três fatias legítimas.

### 5.2. O que a fatia **não** inclui ainda
No método, a fatia é entregue **no núcleo** (regra de negócio e serviço, com um repositório em memória). A fronteira HTTP (*HyperText Transfer Protocol*, o protocolo pelo qual o cliente fala com a API, *Application Programming Interface*, a interface pela qual outros programas usam o sistema) e o banco real entram depois, em PRs próprios (módulo 5 em diante). Isso mantém os PRs pequenos e a `main` verde.

## 6. Pratique no seu domínio
1. Pegue as duas fatias do `state.yaml` do módulo 2. Para cada uma, escreva em uma frase **o comportamento observável** ("dado X, quando Y, então Z").
2. Escreva o **nome do teste RED** de cada uma, no formato `should <fazer algo> when <condição> (<RN ou CA>)`.
3. Implemente a primeira fatia em uma branch própria: **commit RED** (teste falhando, com a saída guardada), **commit GREEN**, e, se houver, **commit REFACTOR**.
4. Abra **um PR** com `(refs #N)` e confira que **não** há outro PR esperando por este.

## 7. Como saber que funcionou
- [ ] Cada fatia descreve um comportamento, e não uma camada.
- [ ] O histórico do PR mostra RED antes de GREEN.
- [ ] A saída do RED prova que o teste falhou pelo motivo certo.
- [ ] Em nenhum instante a `main` tem um teste falhando por falta de código.

## 8. Armadilhas comuns
- **Fatia "só de teste" ou "só de DTO".** Não existe.
- **Fatia grande demais** ("validações"): corte por comportamento (nome vazio, nome longo).
- **Commitar teste e código juntos** e perder a prova de que o teste falhava.
- **Teste que passa no RED**: se isso acontecer, ele está testando outra coisa.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
Peça à IA, **uma fatia por vez**: "escreva apenas o teste RED desta fatia e a saída da falha; não implemente nada". Confira a mensagem de falha **antes** de pedir o GREEN. Quando ela sugerir "aproveitar para ajustar outras coisas", recuse: isso quebra a regra de **um comportamento por PR** e dificulta a revisão.

Próximo: apoio C (integração contínua) e módulo 4.
