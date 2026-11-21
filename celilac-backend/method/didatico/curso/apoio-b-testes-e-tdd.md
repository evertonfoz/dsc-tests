# Apoio B — Testes automatizados e TDD

> **Para quem:** quem já escreveu código, mas conhece pouco de testes automatizados. Duração sugerida: 1 aula.
> **Você vai:** escrever um teste que falha, fazê-lo passar e melhorar o código sem quebrar nada.

---

## 1. O problema
Você altera uma função e precisa saber se **ainda faz o que fazia**. Conferir à mão toda vez é lento e esquecível. Pior: você descobre que quebrou algo **depois** de entregar.

## 2. Antes de ler a solução
Escreva uma função `somar(a, b)`. Sem usar nenhuma ferramenta, liste em um papel cinco entradas e a saída esperada de cada uma. Isso já é um **teste**, só que ainda não executável.

## 3. A solução: teste automatizado
Um teste automatizado é um programa que chama o seu código com uma entrada conhecida e **confere** o resultado. Ele passa ou falha, sempre do mesmo jeito, em segundos.

Neste curso usamos o **Vitest**, uma ferramenta de testes para JavaScript e TypeScript. Um teste tem este formato:

```ts
it('should reject an empty product name in the service without saving (RN01)', async () => {
  await expect(service.createProduct('')).rejects.toThrow();
  expect(productsRepository.save).not.toHaveBeenCalled();
});
```
- `it('texto', função)` define **um** teste e o nomeia. O nome deve dizer o **comportamento**.
- `expect(...)` afirma o que deve ser verdade.
- RN01, no nome, é o identificador de uma regra de negócio (RN) do caso de uso.

### 3.1. Três níveis de teste
| Nível | O que testa | Velocidade | Exemplo |
|---|---|---|---|
| **Unitário** | uma peça isolada | muito rápido | o serviço, com o repositório substituído por um falso |
| **De integração** | peças trabalhando juntas | rápido a médio | a aplicação completa, com repositório em memória |
| **De ponta a ponta** (E2E, *end-to-end*) | o sistema como o usuário o usaria | mais lento | a API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema) com o banco de dados real de testes |

> Cuidado com o nome: um arquivo chamado "integração" pode, na prática, usar um repositório em memória. O que importa é **o que o teste usa**, não o nome do arquivo.

## 4. TDD: escrever o teste antes
TDD (*Test-Driven Development*, desenvolvimento guiado por testes) é um ciclo de três passos:

| Passo | Nome | O que fazer |
|---|---|---|
| 1 | **RED** (vermelho) | escreva um teste para o comportamento novo e **veja-o falhar** |
| 2 | **GREEN** (verde) | escreva o **mínimo** de código para ele passar |
| 3 | **REFACTOR** (refatorar) | melhore o código **sem mudar o comportamento**, com os testes ainda verdes |

Por que ver o teste **falhar** primeiro? Porque um teste que nunca falhou pode não estar provando nada. O vermelho prova que ele **consegue** acusar o erro, e que falha **pelo motivo certo**.

## 5. Pratique no seu domínio (qualquer linguagem)
1. Escolha uma regra simples do seu domínio (por exemplo, "o nome não pode ser vazio").
2. **RED:** escreva o teste, rode-o e leia a mensagem de falha. Ela diz o que você esperava? Guarde a saída.
3. **GREEN:** escreva o mínimo para passar. Rode e guarde a saída.
4. **REFACTOR:** melhore a legibilidade e rode de novo.
5. Troque o `expect` por algo errado de propósito e veja o teste falhar de novo.

## 6. Como saber que funcionou
- [ ] Vi o teste falhar antes de implementar.
- [ ] A mensagem de falha dizia por que falhou.
- [ ] O teste passa depois do mínimo de código.
- [ ] Consigo explicar a diferença entre unitário e de integração.

## 7. Armadilhas comuns
- Escrever o teste **depois** e vê-lo passar de primeira: ele pode não provar nada.
- Fazer o teste passar com código demais de uma vez.
- Testar a implementação (como o código faz) em vez do **comportamento** (o que ele entrega).

## 8. Como lidar com a IA (inteligência artificial) aqui
A IA escreve testes que passam com facilidade, e isso é um risco. **Peça o RED primeiro**: "escreva só o teste, mostre a saída da falha e pare". Depois, peça o mínimo para passar. Se ela entregar teste e código juntos, **tire o código, rode, e veja o teste falhar** antes de aceitar.

Próximo: módulo 3, `m03-fatia-e-main-verde.md`.
