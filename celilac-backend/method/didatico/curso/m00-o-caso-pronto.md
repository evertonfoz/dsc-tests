---
id: m00
tipo: modulo
titulo: 'Módulo 0 — O que significa um caso de uso estar "pronto"?'
ordem: 1
prerequisitos: []
duracao: '60 a 90 minutos'
---

# Módulo 0 — O que significa um caso de uso estar "pronto"?

> **Antes de começar:** leia o `README.md` desta pasta. Duração sugerida: 60 a 90 minutos.
> **Você vai:** perceber a distância entre "parece pronto" e "está provado", conhecer o caso de referência e escolher o seu caso de uso.

---

## 1. O problema
Em novembro de 2026 o caso de uso (UC, do inglês *Use Case*) **UC12 — Cadastrar Produto** do projeto CeliLac parecia concluído:

- a API (a interface pela qual outros programas usam o sistema) respondia, o banco gravava, havia contêineres, testes e uma coleção de requisições;
- 13 materiais tinham sido executados em ordem;
- a *Epic* (a issue principal do caso de uso) e todas as sub-issues estavam fechadas;
- um relatório de consistência afirmava **100%** de cobertura de requisitos, regras e fluxos.

Por qualquer olhar rápido, estava pronto. O que ninguém tinha feito era **perguntar e provar** o que cada item prometia.

## 2. Antes de ler a solução: faça você mesmo
Sem abrir o código, responda por escrito, no seu caderno, para um cadastro de produto que **você imagina** existir:

1. O que acontece se o nome vier **vazio**? E se vier só com **espaços**?
2. O que acontece se o nome tiver **mil caracteres** e a coluna do banco aceitar 120?
3. O que o cliente da API recebe quando o **banco falha** no meio do cadastro?
4. Se a regra de nome só existir no controller, o que acontece quando outro módulo chamar o serviço diretamente?
5. Como **você saberia** a resposta a cada pergunta, sem confiar em quem escreveu o código?

Guarde as respostas. Você as revisará no fim do módulo.

## 3. A tentativa ingênua
A maioria das pessoas responde às cinco perguntas **pelo que acha que o código faz**, ou pelo que está escrito no relatório. É a tentativa ingênua: **confiar na descrição**.

Ela falha porque descrição e comportamento são coisas diferentes, e só a segunda é executável. O CeliLac mostra isso com fatos.

## 4. O que o caso real revelou
Ao executar o método sobre o UC12 (fases descritas no módulo 5 em diante), encontramos o seguinte. Os números e arquivos são do repositório; você pode conferir.

| O que o relatório ou o senso comum dizia | O que o repositório mostrava |
|---|---|
| "Regras de negócio 100% cobertas, incluindo preço positivo" | O código só tinha o campo `name`. **Não existia preço.** |
| "Fluxos de exceção contemplados" | A falha de persistência (FE01: o **F**luxo de **E**xceção número 1 do caso de uso) **não tinha teste**. |
| "Critérios de aceite (CA) CA01 a CA05 cumpridos" | O documento do caso de uso só define **CA01 a CA04**. "CA05" era um rótulo usado em dois sentidos. |
| "Nome vazio é rejeitado" | Só **na fronteira HTTP** (o protocolo pelo qual um cliente fala com a API); o serviço aceitava nome vazio. |
| "O contrato da API está estável" | Ao executar o app: nome só com espaços dava **201**; nome com 121 caracteres dava **500**; havia **dois formatos** de erro 400. |

Fontes: `docs/planejamento/uc12-cadastrar-produto/01/01-12-relatorio-consistencia-cobertura.md`, `docs/uc/uc12/evidencias/D/contrato-atual.txt` e `docs/uc/uc12/evidencias/F/cobertura.md`.

Nenhuma dessas falhas era má-fé. Eram **afirmações sem prova**, e a prova nunca tinha sido pedida.

## 5. A ideia central do curso
> Um caso de uso só está pronto quando **cada item** da sua especificação termina com **um teste que o prova** ou com **uma decisão registrada** de adiamento ou exclusão. Todo o resto é afirmação.

O método ensinado aqui é uma forma de **chegar a isso de forma repetível**. Em uma frase: dividir o caso de uso em comportamentos pequenos (fatias), implementar cada um com teste, guardar as evidências, deixar um robô (a integração contínua, CI, que roda testes a cada mudança no GitHub) conferir o que é objetivo e deixar uma pessoa decidir o que é julgamento.

## 6. Mapa do método em uma página
O método tem **duas camadas** e **seis fases**. Você as estudará uma a uma; por ora, só reconheça os nomes.

| Camada | O que é | Quando acontece |
|---|---|---|
| **0 — Fundação** | Ambiente, banco de testes, CI, convenções | uma vez por projeto |
| **1 — Ciclo do caso de uso** | As fases A a F | para cada caso de uso |

| Fase | Pergunta que ela responde |
|---|---|
| A — Planejar e publicar | O que exatamente vamos construir, em quais fatias? |
| B — Fatias no núcleo | A regra de negócio funciona e está testada? |
| C — Adaptadores | HTTP e banco funcionam de verdade? |
| D — Contrato de resposta | O que a API realmente devolve em cada situação? |
| E — Verificação reprodutível | Outra pessoa consegue repetir a prova? |
| F — Auditoria e encerramento | O que, de fato, ficou coberto? Quem decide o que sobrou? |

Dois arquivos ligam tudo: o `state.yaml` (o estado de cada caso de uso) e o `AGENTS.md` (as regras que o assistente de IA, inteligência artificial, deve seguir). Ambos são ensinados nos módulos 2 e 12.

## 7. Pratique no seu domínio
1. **Escolha** o seu caso de uso, conforme os critérios do `README.md` (cria algo, tem regra, grava em banco).
2. **Escreva** em meia página: o ator, o fluxo principal, **duas regras de negócio** e **um fluxo de falha**. Se o seu texto tiver "validar os dados" sem dizer quais, ainda está vago.
3. **Refaça as cinco perguntas** da seção 2 para o seu caso de uso, agora com os nomes reais.
4. **Anote**, para cada resposta, *como você provaria*: qual teste, qual comando.

## 8. Como saber que funcionou
- [ ] Meu caso de uso tem pelo menos duas regras e um fluxo de falha escritos.
- [ ] Para cada pergunta da seção 2, tenho uma frase dizendo como provar a resposta.
- [ ] Sei dizer, sem consultar, a diferença entre "o relatório diz" e "o teste prova".
- [ ] Consigo nomear as seis fases.

## 9. Armadilhas comuns
- **Escolher um caso de uso grande demais** ("sistema de pedidos"). Escolha um comportamento de cadastro com uma ou duas regras.
- **Escrever regras vagas** ("validar dados"). Regra sem exemplo de entrada recusada não é testável.
- **Pular a seção 2** por parecer óbvia. Se ela for óbvia para você, escreva as respostas mesmo assim; o curso vai testá-las.

## 10. Como lidar com a IA neste módulo
Peça à IA que **ajude a escrever as regras** do seu caso de uso, mas faça você a pergunta decisiva: "para cada regra, qual entrada **inválida** a violaria e qual resposta eu esperaria?". Se a IA responder com generalidades, a regra ainda não está pronta.

Não aceite um relatório de "tudo coberto" gerado por ela sem os nomes dos testes e um comando que os execute. Esse é o assunto do próximo módulo.

---
Próximo: `m01-cobertura-real.md`.
