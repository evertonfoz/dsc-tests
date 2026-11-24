# Por que um método, antes de começar

> **Público:** estudantes de Ciência da Computação com Git e GitHub em nível básico, que vão trabalhar um caso de uso do próprio domínio com ajuda de um assistente de IA (inteligência artificial).
> **Documento de apoio de:** [`uc-buscar.md`](./uc-buscar.md).
> **Você vai:** entender o problema que motiva o método e se preparar para o primeiro passo. **Nada aqui exige conhecimento além de Git e GitHub básicos.** Os termos técnicos do método aparecem depois, um de cada vez, no momento em que forem necessários.

---

## 1. O problema

Um **caso de uso** (UC, do inglês *use case*) é a descrição de um comportamento do sistema do ponto de vista de quem o usa: "cadastrar um produto", "buscar um produto pelo identificador".

Um jeito comum de trabalhar um caso de uso é este: ler o enunciado, escrever código, testar na mão duas ou três vezes e declarar que está pronto.

Esse jeito funciona até alguém perguntar:

- **o que exatamente** foi pedido, e quem confirmou?
- **o que acontece** quando algo dá errado?
- **como eu sei** que o que você diz que funciona de fato funciona, sem precisar confiar em você?

## 2. Um caso real

O curso nasceu de um caso de verdade. O UC12, "Cadastrar Produto", do projeto CeliLac, parecia concluído: o sistema respondia, os dados eram gravados, havia testes e um relatório afirmando **100%** de cobertura das regras.

Quando alguém conferiu item por item, apareceu isto:

| O relatório dizia | O que se encontrou |
|---|---|
| "Regras de negócio 100% cobertas, incluindo preço positivo" | O código **não tinha o campo preço**. |
| "Fluxos de falha contemplados" | A falha ao gravar no banco **não tinha teste**. |
| "Critérios de aceite CA01 a CA05 cumpridos" | O documento só definia **CA01 a CA04**. |

Ninguém mentiu. Eram **afirmações sem prova**, e a prova nunca tinha sido pedida. O relato completo, com as fontes, está no módulo 0 do curso.

## 3. Antes de ler adiante: tente você

Imagine que você precisa implementar "buscar um produto pelo identificador". Sem abrir nenhum material, escreva em cinco minutos:

1. As **decisões** que você teria de tomar antes de escrever a primeira linha (por exemplo: que informações devolver? o que responder se o produto não existir?).
2. **Quem** deveria tomar cada uma: você, o professor, a equipe ou o assistente de IA?
3. Como você **mostraria** a alguém que a busca está correta, sem que essa pessoa precise acreditar em você?

Guarde o papel. Você vai relê-lo no fim.

## 4. A tentativa ingênua

A tentativa mais comum, com ou sem IA, é **pedir o código direto**: "implemente a busca por identificador".

Ela falha por dois motivos simples:

- As decisões da pergunta 1 são **tomadas em silêncio**, por você ou pelo assistente. Quando alguém discorda, não há onde apontar para mostrar que aquilo foi combinado.
- O resultado é descrito em palavras ("funciona, testei"). Palavra não pode ser conferida por outra pessoa. Só algo que se pode **repetir e observar** pode.

## 5. A ideia central

> Um caso de uso só está pronto quando **cada item** da sua descrição termina em uma **prova** ou em uma **decisão registrada** de adiamento ou exclusão. Todo o resto é afirmação.

O método que o curso ensina é uma forma de chegar a isso **sempre do mesmo jeito**. Por enquanto, guarde só três ideias, que são o fundamento de tudo o que vem depois:

1. **Decidir antes de construir.** O que o caso de uso deve fazer fica **escrito e confirmado** antes de qualquer código.
2. **Provar, não descrever.** Cada afirmação importante deve poder ser verificada por outra pessoa.
3. **Uma pessoa responde pelo resultado.** Quem aprova é você (ou quem tem essa responsabilidade no seu grupo), não o assistente.

## 6. O que o método custa

Seria desonesto esconder o custo. O método exige mais perguntas e mais registro no começo do que "pedir o código". Ele **compensa** quando o trabalho será entregue, avaliado ou mantido por outra pessoa, porque o erro achado cedo é mais barato que o achado tarde. Para um exercício descartável, é excessivo.

## 7. Seu primeiro passo

O primeiro módulo do curso é o **módulo 0 — O que significa um caso de uso estar "pronto"?** Ele pede apenas que você prepare a **descrição** do seu caso de uso, sem programar:

1. Escolha **uma** entidade do seu domínio (por exemplo, produto, aluno, pedido) e o caso de uso "buscar um item dela pelo identificador".
2. Escreva, em meia página: quem usa, o que acontece no caso normal, **duas regras** e **uma situação em que algo dá errado** (por exemplo, o item não existe).
3. Para cada uma, escreva uma frase dizendo **como você mostraria** que está certo.

Aqui você ainda não precisa saber **como** provar tecnicamente: precisa apenas **dizer o que seria uma prova**. O resto vem nos módulos seguintes.

## 8. Como saber que funcionou

- [ ] Sei explicar com minhas palavras a diferença entre "o relatório diz" e "está provado".
- [ ] Reli o papel da seção 3 e marquei o que mudaria hoje.
- [ ] Tenho escolhida **uma** entidade e **um** caso de uso.
- [ ] Tenho duas regras e uma situação de erro escritas, cada uma com a frase "como eu mostraria".

## 9. Armadilhas comuns

- **Escolher algo grande demais** ("sistema de pedidos"). Escolha uma operação, em uma entidade.
- **Regra vaga** ("validar os dados"). Uma regra boa diz qual entrada seria recusada e qual resposta você esperaria.
- **Pular a seção 3** por parecer óbvia. Se for óbvia, escreva mesmo assim: você vai querer comparar depois.

## 10. Como lidar com a IA neste ponto

Você pode pedir ao assistente que **ajude a redigir** as regras do seu caso de uso. Mas:

1. **A decisão é sua.** Ele sugere; você escolhe e confirma.
2. **Faça a pergunta decisiva você mesmo:** "que entrada inválida violaria esta regra, e que resposta eu esperaria?". Se a resposta vier genérica, a regra ainda não está pronta.
3. **Não aceite "está tudo coberto"** sem que a afirmação venha com algo que você consiga conferir.

---

## Siglas usadas neste documento

| Sigla | Significado | Em uma frase |
|---|---|---|
| UC | *Use Case*, caso de uso | Comportamento do sistema do ponto de vista de quem o usa |
| IA | Inteligência Artificial | Aqui, o assistente de código usado no curso |
| CA | Critério de Aceite | Condição que o caso de uso precisa cumprir para ser aceito (CA01, CA02...) |

---

Próximo passo: o módulo 0 do curso (`method/didatico/curso/m00-o-caso-pronto.md`). Prompt de execução: [`uc-buscar.md`](./uc-buscar.md).
