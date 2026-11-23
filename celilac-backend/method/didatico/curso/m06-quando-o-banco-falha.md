---
id: m06
tipo: modulo
titulo: 'Módulo 6 — O que o cliente vê quando o banco falha?'
ordem: 11
prerequisitos: [m05, apoio-b]
duracao: '2 aulas'
gabarito: m06-gabarito
---

# Módulo 6 — O que o cliente vê quando o banco falha?

---

## 1. O problema
Um cadastro pode falhar por **dois motivos muito diferentes**:
- o **cliente** mandou algo inválido (nome vazio);
- o **sistema** falhou (o banco caiu, a coluna não aceitou o valor).

Para quem usa a API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), a diferença é decisiva: no primeiro caso ele **corrige a requisição**; no segundo, **tenta mais tarde** ou avisa o suporte. E há um risco no segundo caso: a mensagem de erro do banco costuma carregar **detalhes internos**, como o endereço do servidor, o nome da tabela ou da coluna.

No UC12 (UC, *Use Case*: caso de uso de cadastrar produto), o fluxo de exceção FE01 ("falha na persistência") **não tinha teste nem comportamento definido**.

## 2. Antes de ler a solução
Imagine que o banco recusou o cadastro com esta mensagem:

```
connection refused at 10.0.0.5:5432 (relation "products" does not exist)
```
1. O que essa mensagem revela a quem a lê? Cite pelo menos três informações.
2. Se ela chegasse ao cliente da API, quem poderia se beneficiar disso, e quem poderia ser prejudicado?
3. Qual código de resposta HTTP (*HyperText Transfer Protocol*, o protocolo da API) você devolveria? Por quê?

Escreva as respostas antes de continuar.

## 3. As tentativas ingênuas
Há dois atalhos, e cada um tem um custo diferente:

| Atalho | O que acontece | Custo |
|---|---|---|
| **Deixar o erro estourar** | O framework devolve um erro 500 genérico para qualquer exceção desconhecida. No CeliLac, antes da correção, até o nome vazio (erro do cliente) voltava como **500**. | O cliente não distingue "enviei errado" de "o sistema falhou" |
| **Repassar a mensagem do erro** (`response.message = error.message`) | O cliente recebe o texto bruto do banco. | **Vaza** endereço, tabela e coluna |

O primeiro é seguro, mas pouco útil. O segundo é útil para quem programa e perigoso para quem ataca.

## 4. A solução: duas camadas, cada uma com uma tarefa

### 4.1. O núcleo traduz a falha (fatia F04)
O serviço captura a falha do repositório e a **traduz** para uma exceção própria, com mensagem **genérica**, guardando o erro original em `cause` (o campo que acompanha uma exceção e carrega a causa):

```ts
try {
  return await this.productsRepository.save(product);
} catch (error) {
  throw new ProductPersistenceFailedException(error);
}
```
```ts
export class ProductPersistenceFailedException extends Error {
  constructor(cause?: unknown) {
    super('Product registration could not be completed.', { cause });
    this.name = 'ProductPersistenceFailedException';
  }
}
```
O teste (RED primeiro) usa um repositório simulado que rejeita com a mensagem do exemplo e afirma **duas coisas**: que a exceção é a esperada **e** que a mensagem não contém os detalhes:
```ts
await expect(result).rejects.toMatchObject({ name: 'ProductPersistenceFailedException' });
await expect(result).rejects.not.toThrow(/connection refused|10\.0\.0\.5|relation/);
```
Falha antes da implementação, e pelo motivo certo (`docs/uc/uc12/evidencias/B/f04-red.txt`): o erro bruto, "connection refused at 10.0.0.5:543…", saía do serviço sem tradução.

### 4.2. A fronteira HTTP traduz a exceção em resposta (fase C)
O núcleo **não conhece** códigos HTTP. Quem decide é a fronteira, por meio de um **filtro de exceções**: um trecho de código que intercepta as exceções lançadas e escolhe a resposta. No CeliLac ele é um mapa de exceção para status:

| Exceção | Status | Significado |
|---|---|---|
| `InvalidProductNameException` | **400** *Bad Request* | o cliente enviou algo inválido |
| `ProductPersistenceFailedException` | **500** *Internal Server Error* | o sistema não conseguiu concluir |

O corpo da resposta de falha tem sempre o mesmo formato e **nunca** inclui `cause`:
```json
{ "statusCode": 500, "message": "Product registration could not be completed.", "error": "ProductPersistenceFailedException" }
```
O RED desta fase (`docs/uc/uc12/evidencias/C/c1-red.txt`) mostra dois defeitos reais: o nome vazio voltava `500` em vez de `400`, e o corpo da falha de persistência não tinha o formato combinado.

### 4.3. O código de resposta é uma decisão, e se registra
O documento do caso de uso **não define** os códigos HTTP: ele diz apenas "rejeitar" e "informar que a operação não foi concluída". Alguém precisa decidir, e a decisão fica escrita em uma ADR (*Architecture Decision Record*, registro curto de uma decisão): a ADR-003 do projeto. Ela também registra o **custo** da escolha: 500 não distingue falha temporária de permanente; se o caso de uso passar a exigir nova tentativa, a decisão deve ser revista (503, *Service Unavailable*, serviço temporariamente indisponível).

### 4.4. A prova no banco real
Um teste com repositório simulado prova a tradução, mas não que **o banco de verdade** realmente falha e é traduzido. Por isso, na fase C, um teste usa o PostgreSQL de testes (o sistema de banco de dados relacional do projeto) e provoca uma falha real:
- primeiro, com um nome de 121 caracteres, que a coluna `varchar(120)` recusa;
- depois, quando o limite passou a ser barrado antes (módulo 5), com um **caractere NUL** (`\u0000`, o caractere de código zero, que o PostgreSQL não aceita em campos de texto).

E a **mutação**: removendo o tratamento do serviço, o teste falha mostrando o erro real do banco: `QueryFailedError: value too long for type…` (`docs/uc/uc12/evidencias/C/c2-fe01-mutacao.txt`). Esse é o texto que **teria chegado ao cliente** se a camada não existisse.

## 5. Um achado honesto: a causa não está sendo registrada
A ADR-003 diz que a causa original "fica apenas em `cause` e no log do servidor". Ao preparar este módulo, procurei no código: **não há nenhum registro (log) da falha de persistência**. O erro original fica guardado em `cause`, mas o filtro responde ao cliente e **não escreve nada** em lugar algum. Rodei o teste de mapeamento três vezes e a saída não contém o erro original.

Consequência: se o banco cair em produção, o cliente recebe a mensagem genérica **e a equipe não fica sabendo por quê**. A documentação prometia algo que o código não faz. Isto é um exercício do módulo (exercício 2) e um item para o professor decidir.

> **Lição:** uma afirmação num documento ("vai para o log") é uma hipótese até haver um teste ou um trecho de código que a sustente.

## 6. Pratique no seu domínio
1. **Fatia de falha (núcleo):** escreva o teste RED com um repositório simulado que rejeita com uma mensagem cheia de detalhes inventados (endereço, tabela). Ele deve afirmar a exceção esperada **e** a ausência desses detalhes. Veja falhar. Guarde a saída.
2. **GREEN:** o `try/catch` que traduz e guarda o `cause`.
3. **Fronteira HTTP:** crie o filtro (ou o mecanismo do seu framework) que mapeia suas exceções para status. Teste pela API: um erro de validação devolve 400; a falha de persistência devolve 500 **sem** os detalhes.
4. **Escreva a ADR** do mapeamento, com contexto, tabela de status e **uma consequência negativa**.
5. **Banco real:** provoque uma falha verdadeira no seu banco de testes e confirme a tradução. Faça a mutação (remova o `try/catch`) e guarde a saída que mostra o erro bruto.
6. **Registro:** acrescente o log da causa no ponto em que a exceção é tratada e **teste** que ele foi chamado (sem colocar o log na resposta).

## 7. Como saber que funcionou
- [ ] Erro do cliente devolve 4xx e falha do sistema devolve 5xx.
- [ ] Nenhuma resposta contém endereço, tabela, coluna ou pilha de erro.
- [ ] Os testes afirmam a **ausência** dos detalhes, e não só o status.
- [ ] Existe uma ADR com a tabela de status e o custo da escolha.
- [ ] A mutação mostrou o erro bruto que o cliente teria visto.
- [ ] A causa original chega a algum registro que a equipe consulte.

## 8. Armadilhas comuns
- **Testar só o status.** Um 500 com a mensagem do banco também é "500".
- **Capturar tudo e devolver 400.** Mascarar falhas do sistema como erro do cliente confunde quem tenta corrigir.
- **Mensagem igual para qualquer erro.** Uma mensagem útil diz o que o cliente pode fazer.
- **Logar demais.** O registro interno também não deve conter dados sensíveis (senhas, dados pessoais).

## 9. Exercícios
1. A mensagem de `ProductPersistenceFailedException` é a mesma para qualquer falha. Isso ajuda ou atrapalha o cliente? Proponha uma resposta que ajude **sem** vazar.
2. Onde o `cause` é registrado hoje no CeliLac? Escreva o teste que o protegeria e a correção mínima.
3. Quando o código correto seria 503 em vez de 500? O que mudaria no caso de uso?
4. Por que o núcleo não deve conhecer o código 500? O que aconteceria se uma tarefa agendada, e não uma API, chamasse o serviço?

## 10. Como lidar com a IA (inteligência artificial) neste módulo
- A IA tende a escrever `catch (e) { return res.status(500).json({ error: e.message }) }`. **Rejeite**: é exatamente o vazamento deste módulo.
- Peça os testes **antes**: "escreva um teste que falhe se a resposta contiver o endereço ou o nome da tabela".
- Quando ela afirmar que "o erro vai para o log", **peça o teste ou o trecho de código** que prova isso. No CeliLac, essa afirmação estava no documento e não no código.

Próximo: módulo 7, seu teste prova alguma coisa?
