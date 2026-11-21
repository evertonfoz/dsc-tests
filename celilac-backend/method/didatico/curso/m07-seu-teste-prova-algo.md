---
id: m07
tipo: modulo
titulo: 'Módulo 7 — Seu teste prova alguma coisa?'
ordem: 12
prerequisitos: [m05, m06, apoio-b]
duracao: '2 aulas'
gabarito: m07-gabarito
---

# Módulo 7 — Seu teste prova alguma coisa?

> **Pré-requisito:** módulos 5 e 6 e apoio B. Duração sugerida: 2 aulas.
> **Você vai:** aprender a **estragar o código de propósito** para descobrir se os seus testes percebem, e a registrar essa prova.

---

## 1. O problema
Todos os testes passam, o CI (integração contínua, o robô que roda as verificações) está verde. A pergunta que raramente se faz: **e se o código estivesse errado, o teste perceberia?**

No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), o teste que provoca uma **falha real do banco** (FE01, o fluxo de exceção "falha na persistência") **passou de primeira**, na primeira execução. Isso podia significar duas coisas muito diferentes:
- o comportamento já existia e o teste está correto; ou
- o teste não verifica nada e passaria de qualquer jeito.

Olhando só para o verde, **é impossível distinguir**.

## 2. Antes de ler a solução: tente enganar o teste
Considere esta função e este teste (qualquer linguagem; aqui em TypeScript):

```ts
function descontoDe(valor: number): number {
  if (valor >= 100) return valor * 0.1;
  return 0;
}

it('dá 10% de desconto para compras grandes', () => {
  expect(descontoDe(200)).toBe(20);
});
```
O teste passa. Em 15 minutos, escreva **pelo menos quatro versões erradas** de `descontoDe` que **continuam passando** nesse teste. (Dica: pense nos valores que o teste nunca usa.)

Depois, escreva os testes que **derrubariam** cada uma das suas versões erradas.

## 3. A tentativa ingênua
Três atalhos, todos insuficientes:

| Atalho | Por que não prova |
|---|---|
| "Passou, então está certo" | um teste que nunca falha também passa |
| "Tenho 90% de cobertura" | cobertura mede **linhas executadas**, e não se o resultado foi conferido; um teste sem `expect` cobre linhas |
| "Vi o teste falhar antes de implementar (RED)" | prova que ele falha **quando o comportamento falta**, mas não que ele percebe um erro **sutil** depois |

O RED (o teste que falha antes do código, apoio B) é necessário e insuficiente. Falta a outra metade.

## 4. A solução: a mutação
**Mutação** é alterar o código, **de propósito e por pouco**, de modo a introduzir um erro, e rodar os testes. O código alterado se chama **mutante**.
- Se algum teste **falha**, o mutante foi **morto**: bom, o teste percebe aquele erro.
- Se **todos passam**, o mutante **sobreviveu**: os testes não percebem aquele erro.

> RED prova que o teste falha quando o comportamento **não existe**. A mutação prova que ele falha quando o comportamento **existe e é estragado**. Os dois se complementam.

### 4.1. Os mutantes mais úteis
| O que estragar | Exemplo | O que você aprende |
|---|---|---|
| Inverter ou deslocar um comparador | `>` vira `>=` | se há teste **no limite** |
| Remover uma condição | apagar `name.trim() === ''` | se cada parte da regra tem teste próprio |
| Trocar uma constante | `120` vira `121` | se o valor exato importa |
| Remover uma chamada | apagar o `save(...)` | se o teste confere o efeito |
| Remover um tratamento de erro | apagar o `try/catch` | se o teste exercita o caminho de falha |
| Mudar o retorno | devolver outro valor | se o teste confere o resultado |

### 4.2. O procedimento (sempre o mesmo)
1. Escolha **um** trecho do código sob teste.
2. Faça **uma** alteração pequena e errada.
3. Rode **só** os testes daquela área e **guarde a saída**.
4. Anote: o teste falhou (mutante morto) ou passou (sobreviveu)?
5. **Desfaça** a alteração e confira com `git status` que o código voltou ao original.

Existem ferramentas que geram mutantes automaticamente (por exemplo, o StrykerJS, para JavaScript e TypeScript). Neste curso você faz **à mão**, para entender o que a ferramenta automatiza.

## 5. Quatro casos reais do UC12

### 5.1. O limite do tamanho do nome (módulo 5)
Trocar `>` por `>=` em `name.length > MAX_PRODUCT_NAME_LENGTH`: **só** o teste `should accept a product name with exactly 120 characters (RN01)` falhou (1 falha, 5 passando). Esse teste tinha **passado no RED de propósito**: sua função é proteger o limite exato. Sem a mutação, ninguém saberia que ele funciona. (RN01 é a primeira regra de negócio do caso de uso.)

### 5.2. A falha real do banco (FE01)
O teste do banco real passou de primeira. Mutação: **remover o `try/catch`** do serviço. Resultado, em `docs/uc/uc12/evidencias/C/c2-fe01-mutacao.txt`:
```
× should report an incomplete operation when the real database rejects the insert (FE01)
  → expected QueryFailedError: value too long for type… to match object { name: 'ProductPersistenceFailedException' }
```
Agora a dúvida da seção 1 está resolvida: o teste **percebe** a remoção do tratamento. E a saída ainda mostra o texto do banco que vazaria sem a proteção.

### 5.3. A mutação vence a validade do teste
Depois, a regra do limite do nome passou a ser barrada no núcleo (fatia F06). O teste da falha real do banco usava um nome de 121 caracteres, que **a partir dali nem chegava mais ao banco**: o serviço o rejeitava antes. O teste não deixou de existir, mas deixou de testar o que dizia.

Foi preciso trocar a entrada por uma que o núcleo ainda não barra e que o banco realmente recusa: um **caractere NUL** (`\u0000`, o caractere de código zero, que o PostgreSQL, o sistema de banco de dados do projeto, não aceita em texto). E **repetir a mutação** (`docs/uc/uc12/evidencias/C/c2-fe01-mutacao-pos-f06.txt`), que agora mostra `QueryFailedError: invalid byte sequence…`.

> **Lição:** a prova de um teste tem **prazo de validade**. Mudou a regra, mudou a entrada, refaça a mutação.

### 5.4. A mutação que falha pelo motivo errado (teste A7)
O teste "uma requisição rejeitada não deixa linha no banco" (`test/products/rejeicao-nao-grava.e2e-spec.ts`) afirma duas coisas: o **status 400** e a **contagem de linhas igual a zero**.

- **Mutante 1:** remover as barreiras de nome em branco. O teste falhou, mas pelo **status** (`expected 400, got 201`). A contagem de linhas **nem foi avaliada**.
- **Mutante 2:** fazer o serviço **gravar** o nome em branco e **depois** rejeitar com 400. O status continua 400, e o teste falhou pela contagem: `expected 2 to be 0`.

Sem o segundo mutante, ninguém saberia que a afirmação mais importante (a de não gravar) funcionava. Veja `docs/uc/uc12/evidencias/F/a7-mutacao.txt`.

> **Lição:** um mutante que mata o teste **por outro motivo** não prova a afirmação que você queria provar. Pense em **um mutante por afirmação**.

### 5.5. Cuidados do procedimento
- Rode mutações **somente no banco de testes** (módulo 4). No caso 5.4, o mutante 2 deixou linhas no banco; foi preciso removê-las.
- **Nunca** deixe o código mutado em um commit. Confira `git status` e o diff antes de tudo.
- Guarde a **saída** em um arquivo de evidência (`mutacao.txt`), e não só a frase "falhou".

## 6. Um mutante que sobrevive (de verdade) no CeliLac
Ao preparar este módulo, testei esta mutação no serviço atual:
```ts
// original
name.length > MAX_PRODUCT_NAME_LENGTH
// mutante
name.trim().length > MAX_PRODUCT_NAME_LENGTH
```
Resultado: **os 16 testes de `products` passaram**. O mutante sobreviveu.

O que isso significa? Que nenhum teste distingue "tamanho do texto" de "tamanho do texto sem os espaços das pontas". Um nome com 119 letras e 2 espaços no fim (121 no total) é aceito ou rejeitado? **O caso de uso não define.** Pode ser um mutante irrelevante (se a regra é indiferente) ou uma lacuna real (se a regra deveria ser clara). Quem decide é uma pessoa, e o resultado vira um teste ou uma decisão registrada, como no módulo 1.

## 7. Pratique no seu domínio
1. Escolha **três testes** que você escreveu nos módulos 5 e 6.
2. Para cada um, proponha **dois mutantes** de tipos diferentes (tabela 4.1).
3. Preencha esta tabela, guardando a saída de cada execução:

| Teste | Mutante | Esperado | Obtido | Morto ou sobreviveu |
|---|---|---|---|---|
| (nome do teste) | (o que estragou) | falha | (resultado) | |

4. Para cada **sobrevivente**, escolha: (a) escrever o teste que o mata; (b) declarar que o mutante é irrelevante e **explicar por quê**; (c) registrar uma pergunta para quem decide a regra.
5. Garanta que, ao final, `git status` está limpo e nenhuma mutação foi commitada.

## 8. Como saber que funcionou
- [ ] Cada mutante tem uma saída guardada.
- [ ] Cada teste foi morto por **pelo menos um** mutante pelo motivo que importa (a afirmação principal).
- [ ] Os sobreviventes têm destino registrado.
- [ ] O código está idêntico ao original.

## 9. Armadilhas comuns
- **Mutante que quebra a compilação.** Erro de sintaxe não conta: o teste precisa falhar por **assertiva**.
- **Alterar o teste em vez do código.**
- **Muitos mutantes de uma vez.** Um por vez, para saber qual foi morto.
- **Mutante equivalente.** Algumas alterações não mudam o comportamento (por exemplo, trocar a ordem de duas condições independentes); elas "sobrevivem" legitimamente. Reconhecê-las exige julgamento.
- **Não refazer depois de mudar o sistema** (caso 5.3).

## 10. Exercícios
1. Resolva o desafio da seção 2 e explique, para cada versão errada, qual valor de entrada faltava no teste.
2. No CeliLac, escreva o teste que mata o mutante da seção 6, **depois** de decidir (com o professor) o que o sistema deve fazer com espaços nas pontas.
3. Por que um teste sem nenhum `expect` aumenta a cobertura de linhas e não prova nada?
4. Dê um exemplo de mutante equivalente no seu domínio.

## 11. Como lidar com a IA (inteligência artificial) neste módulo
- A IA escreve testes que **passam**, e é bom desconfiar. Peça: "proponha cinco mutantes para este código e diga qual teste mataria cada um".
- **Rode você os mutantes.** Uma frase como "os testes detectariam isso" não é evidência.
- Se ela afirmar que "a mutação foi testada", exija o **arquivo de saída**.
- Cuidado com a IA que, ao ver um teste falhando por causa de um mutante, "conserta" o teste. O objetivo é o oposto: o teste **deve** falhar.

Próximo: módulo 8, como persistir de verdade.
