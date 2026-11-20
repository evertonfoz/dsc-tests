# Módulo 5 — Onde mora a regra de negócio?

> **Pré-requisito:** módulo 3 e apoio B. Duração sugerida: 2 aulas.
> **Você vai:** colocar uma regra de negócio no **núcleo** da aplicação, em vez de deixá-la só na entrada, e ver uma única linha de código evoluir por três fatias.

---

## 1. O problema
No caso de uso UC12 (UC, *Use Case*: caso de uso de cadastrar produto), a regra "o nome não pode ser vazio" existia **só na fronteira HTTP** (*HyperText Transfer Protocol*, o protocolo pelo qual um cliente fala com a API, *Application Programming Interface*, a interface pela qual outros programas usam o sistema). Mais precisamente, ela estava no **DTO** (*Data Transfer Object*, a classe que descreve e valida os dados que chegam).

O serviço que cadastra o produto, `createProduct`, **não validava nada**. Enquanto o único caminho para chegar a ele fosse uma requisição HTTP, tudo parecia correto.

## 2. Antes de ler a solução: descubra
No commit anterior às correções, adicione **temporariamente** este teste ao arquivo `products.service.spec.ts` e rode-o:

```bash
git checkout b71f5e1
```
```ts
it('descoberta: o serviço aceita nome vazio?', async () => {
  productsRepository.save.mockImplementation(async (p) => p);
  const resultado = await service.createProduct('');
  console.log('resultado:', resultado);
});
```
Responda:
1. O serviço lançou erro ou devolveu um produto?
2. Quem, além de uma requisição HTTP, poderia chamar `createProduct`? Cite três: por exemplo, outro módulo do sistema, uma tarefa agendada, um teste.
3. Se alguém chamasse por um desses caminhos, a regra do DTO ajudaria?

Descarte a alteração depois (`git checkout .`).

## 3. A tentativa ingênua
**"O DTO já valida; é suficiente."** Falha porque a regra protege **uma porta de entrada**, e não o sistema. Cada novo ponto de entrada precisa lembrar de repetir a validação, e um esquecimento grava dados inválidos sem que nada avise.

## 4. A solução: a regra mora no núcleo
O **núcleo** (também chamado domínio e serviço de aplicação) é a parte que **decide** o que é válido e **não conhece** HTTP nem banco de dados. As bordas (a fronteira HTTP, o banco) **chamam** o núcleo.

> A regra vale **no núcleo**, para qualquer chamador. A fronteira HTTP pode (e deve) barrar cedo, mas **não é a única defesa**.

Para o núcleo não conhecer o banco, ele fala com uma **porta**: uma interface (uma lista de operações, sem implementação) que descreve o que ele precisa. No CeliLac:

```ts
export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```
Quem implementa essa porta é um **adaptador**: um repositório em memória (para testes rápidos) ou um que fala com o PostgreSQL, o sistema de banco de dados relacional que o projeto usa (módulo 8). O serviço não sabe qual está usando.

### 4.1. Uma linha, três fatias
A regra do nome entrou em **três fatias**, uma por comportamento, cada uma em um PR (PR, *pull request*, a proposta de mudança no GitHub) com seu RED (o teste que falha) e seu GREEN (o mínimo de código para passar). A mesma linha do serviço evoluiu:

| Fatia | Comportamento | Linha no serviço depois do GREEN |
|---|---|---|
| **F03** (PR #26) | rejeita nome **vazio** (`''`) | `if (name === '')` |
| **F05** (PR #44) | rejeita nome **em branco** (só espaços) | `if (name.trim() === '')` |
| **F06** (PR #45) | rejeita nome com **mais de 120 caracteres** | `if (name.trim() === '' \|\| name.length > MAX_PRODUCT_NAME_LENGTH)` |

Em cada uma, o ciclo foi o do apoio B. Veja o RED da F03, guardado em `docs/uc/uc12/evidencias/B/f03-red.txt`:

```
× should reject an empty product name in the service without saving (RN01)
  → promise resolved "undefined" instead of rejecting
```
A mensagem diz que a chamada **terminou normalmente** quando devia ter sido rejeitada: é o motivo certo. (`RN01` é a primeira regra de negócio, RN, do caso de uso.)

E o teste, sem o ruído:
```ts
it('should reject an empty product name in the service without saving (RN01)', async () => {
  await expect(service.createProduct('')).rejects.toMatchObject({
    name: 'InvalidProductNameException',
  });
  expect(productsRepository.save).not.toHaveBeenCalled();
});
```
Duas afirmações, as duas importam: (1) **rejeitou** com o erro certo; (2) **não gravou** nada (`save` não foi chamado).

### 4.2. Por que um erro de domínio, e não `return null`
A regra lança uma exceção própria do domínio:
```ts
export class InvalidProductNameException extends Error {
  constructor() {
    super('Product name must not be empty.');
    this.name = 'InvalidProductNameException';
  }
}
```
Um retorno `null` ou `false` pode ser **ignorado** por quem chama. Uma exceção obriga a tratar. E o nome da classe diz **o que** aconteceu, o que será útil quando a fronteira HTTP precisar decidir o status da resposta (módulo 6).

### 4.3. O teste que passa no RED, de propósito
No RED da F06 aparecem 6 testes, e **só um** falha. Entre os que passam está `should accept a product name with exactly 120 characters (RN01)`. Ele passa de primeira porque o código **ainda aceita tudo**.

Para que serve, então? Para proteger o **limite exato**. Troque `>` por `>=` no serviço e rode:
```
× should accept a product name with exactly 120 characters (RN01)
Tests  1 failed | 5 passed (6)
```
Executei isso ao preparar este módulo: a troca de um único caractere faz **esse** teste falhar, enquanto os demais continuam verdes. Sem ele, o erro de "um a mais ou um a menos" passaria despercebido. Este é um **teste de valor-limite**.

> **Regra do método:** um teste que passa de primeira só prova algo depois de uma **mutação** (uma alteração proposital do código) que o faça falhar. Você acabou de fazer uma.

## 5. Pratique no seu domínio
Use o caso de uso e as fatias dos módulos anteriores. Cada item abaixo é **uma fatia**, em branch e PR próprios:
1. **Fatia 1 (regra mais simples):** o seu campo obrigatório não pode ser vazio.
   - RED: teste com o repositório simulado; veja falhar pelo motivo certo e guarde a saída.
   - GREEN: o mínimo.
2. **Fatia 2 (um caso que você não previu):** o mesmo campo só com espaços (ou o equivalente do seu domínio).
3. **Fatia 3 (limite):** um tamanho máximo. Escreva **dois** testes: um acima do limite (RED) e um **exatamente no limite** (deve passar).
4. **Mutação:** troque `>` por `>=` e confirme que o teste do limite falha. Guarde a saída. Desfaça.
5. Garanta que **nenhuma** das fatias importa nada de HTTP ou de banco dentro do serviço.

## 6. Como saber que funcionou
- [ ] Cada fatia tem RED antes de GREEN, em commits separados.
- [ ] Cada teste de rejeição afirma também que **nada foi gravado**.
- [ ] Há um teste no valor-limite, e a mutação o derruba.
- [ ] O serviço não importa HTTP nem banco.
- [ ] A regra continua válida mesmo chamando o serviço diretamente, sem passar pela fronteira HTTP.

## 7. Armadilhas comuns
- **Validar só na entrada.** É a armadilha deste módulo.
- **Validar nos dois lugares com números diferentes.** Se o limite for `120` no serviço e `100` no DTO, o comportamento depende de qual barreira dispara primeiro. No CeliLac, uma constante (`MAX_PRODUCT_NAME_LENGTH`) é **compartilhada** entre as duas barreiras.
- **Testar só a rejeição** e esquecer de afirmar que nada foi gravado.
- **Mensagem de erro que não descreve o problema.** Veja o exercício 1 abaixo.

## 8. Exercícios
1. No CeliLac, a mesma exceção, `InvalidProductNameException`, é lançada para nome vazio, em branco **e** longo demais, mas a mensagem diz "Product name must not be empty." Isso é um problema? Em que situação alguém veria essa mensagem? (Dica: leia o filtro de erros da fronteira HTTP e o módulo 6.) Proponha uma correção e **que teste a protegeria**.
2. Por que a F05 (nome em branco) **não** foi descoberta junto com a F03? O que no caso de uso permitiu esse "vazio" ser interpretado de dois jeitos? (Este ponto volta no módulo 10.)
3. Escreva o teste de valor-limite para o menor tamanho aceitável de um campo do seu domínio.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
- **Peça só o teste RED**, mostre a falha, e só depois peça o GREEN mínimo. Se ela entregar a regra "completa" com todas as validações de uma vez, você perde a prova de que cada uma é necessária.
- **Desconfie do teste de limite que "passa de primeira".** Faça você mesmo a mutação `>` por `>=`.
- **Confira se a IA colocou a regra no lugar certo.** É comum ela validar só no controller ou no DTO, porque é onde o exemplo da internet costuma estar.

Próximo: módulo 6, o que o cliente vê quando o banco falha.
