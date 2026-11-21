# Módulo 9 — Alguém olhou o contrato real da API?

> **Pré-requisito:** módulos 3, 5, 6, 7 e 8. Duração sugerida: 2 aulas.
> **Sigla:** API (*Application Programming Interface*) é a interface pela qual outros programas usam o seu sistema.
> **Você vai:** descobrir o que a sua API **de fato responde** (e não o que você acha que responde), decidir o que fazer com cada diferença e fixar o resultado em um documento e em testes.

---

## 1. O problema
Ao chegar neste ponto do UC12 (UC, *Use Case*: caso de uso de cadastrar produto), havia um documento do caso de uso, testes passando e um relatório de consistência afirmando que as situações de erro estavam cobertas. Faltava alguém **perguntar à API em funcionamento** o que ela devolvia em cada situação.

Quando isso foi feito, o inventário achou diferenças entre o prometido e o real (arquivo `docs/uc/uc12/evidencias/D/contrato-atual.txt`):

| Situação | O que se esperava | O que a API devolvia |
|---|---|---|
| nome só com espaços (`"   "`) | rejeitar com erro 400 | **201**: o produto foi cadastrado com o nome em branco |
| nome com 121 caracteres | rejeitar com erro 400 | **500**: o banco recusou e a API respondeu "erro interno" |

Um **contrato** de API é o conjunto de promessas que ela faz a quem a usa: para cada pedido, qual **status** (o número da resposta HTTP, *HyperText Transfer Protocol*, o protocolo da web: 201 = criado, 400 = pedido inválido, 404 = não encontrado, 500 = erro do servidor) e qual **corpo** (o texto em JSON, *JavaScript Object Notation*, um formato de dados em texto, que acompanha a resposta). Quem consome a API (um aplicativo, outro sistema) passa a **depender** dessas respostas.

## 2. Antes de ler a solução: o que ela responde?
Pegue o caso de uso do seu domínio (módulo 5) e, **sem olhar o código**, preencha em 20 minutos uma tabela de **pelo menos oito situações** com o status e o corpo que você **espera**:

| Situação | Status esperado | Corpo esperado |
|---|---|---|
| dado válido | | |
| campo obrigatório vazio | | |
| campo ausente | | |
| campo com tipo errado | | |
| acima do limite | | |
| JSON quebrado | | |
| rota que não existe | | |
| o banco falha | | |

Guarde. Mais adiante você confronta com a realidade.

## 3. A tentativa ingênua
| Atalho | Por que não basta |
|---|---|
| "Está no documento do caso de uso" | o documento diz o que **deveria** ser; a API pode fazer outra coisa |
| "Li o código e vi o `if`" | a resposta final passa por validação, filtros e configuração do framework; o código que você leu não é o único a decidir |
| "Os testes passam" | eles testam o que alguém **pensou** em testar |
| "Pergunto à IA (inteligência artificial) o que a API devolve" | a IA responde com o que **parece provável**, e não com o que a execução produz |

## 4. A solução: inventariar, decidir, fixar

### 4.1. Passo 1 — Inventário executando
Sobe-se a aplicação completa (a mesma configuração de produção, com o banco de **testes**, módulo 4) e se faz, **uma por uma**, cada situação da sua tabela, guardando status e corpo reais. No UC12 foram **13 cenários** e o resultado ficou em `docs/uc/uc12/evidencias/D/contrato-atual.txt`. Um trecho:
```
nome vazio              -> 400 {"message":["name should not be empty"],...}
nome só com espaços     -> 201 {"productId":"<uuid>","name":"   "}
nome com 120 caracteres -> 201 ...
nome com 121 caracteres -> 500 {"statusCode":500,"message":"Product registration could not be completed.",...}
campo extra (price)     -> 201 {"productId":"<uuid>","name":"Com preço"}
rota inexistente        -> 404 {"message":"Cannot POST /produtos",...}
```
A evidência é a **saída da execução**, com data e commit no cabeçalho do arquivo. Ler o código não conta.

### 4.2. Passo 2 — Comparar e classificar cada diferença
Para cada linha em que a realidade difere da expectativa, **uma pessoa** escolhe:
| Escolha | Quando |
|---|---|
| **Corrigir** | o comportamento real está errado frente ao caso de uso |
| **Aceitar e registrar** | o comportamento real é aceitável; registra-se em uma ADR (*Architecture Decision Record*, documento curto que guarda **uma** decisão) |

No UC12 o professor decidiu: erros 400 em um formato único, nome em branco e nome acima de 120 **rejeitados**, campos extras **ignorados**. Isso virou a ADR-004 do projeto.

> **Atenção:** se a correção é um **comportamento novo** (rejeitar nome em branco não existia), ela é uma **fatia** (módulo 3) e vai pelo ciclo completo: teste primeiro, em um PR (*pull request*) próprio. O módulo 10 trata de onde isso entra no processo.

### 4.3. Passo 3 — Escrever o contrato (e esperar aprovação)
Um documento curto, `docs/uc/uc12/contrato.md`, com a tabela "situação, status, corpo" **já com as decisões**, e uma coluna para o que ainda **não** está implementado. O método manda apresentá-lo e **aguardar aprovação antes de mexer no código**.

### 4.4. Passo 4 — Fixar com testes e repetir o inventário
Cada linha do contrato precisa de um teste que **quebre se ela mudar**, inclusive o teste de **não exposição**: a resposta nunca pode trazer a mensagem do banco, o nome do servidor, a pilha de erro ou campos internos (módulo 6). Depois das correções, o inventário é **repetido** (`contrato-final.txt`) e **todos os 13 cenários coincidem** com o contrato.

> O inventário **registra**; quem **protege** contra regressão são os testes. O relatório da fase D diz isso expressamente.

## 5. O que sobrou (e foi dito)
Mesmo no fim, o contrato registra o que **não** foi resolvido:
- nome ausente, `null` ou não texto devolve, na lista de mensagens, **uma mensagem a mais** (de limite de tamanho): o status e o formato estão certos, a mensagem extra é ruído **aceito**;
- um nome com caractere NUL (`\u0000`) ainda dá **500**, e ficou como falha documentada, sem regra nova.

Um contrato honesto lista suas imperfeições.

## 6. Pratique no seu domínio
1. Faça o inventário **executando** o seu caso de uso, com **todas** as situações da sua tabela da seção 2. Guarde a saída em arquivo, com data e commit no topo.
2. Compare com o que você esperava. Para cada diferença, classifique: corrigir ou aceitar (e escreva a ADR curta de quem decidiu e por quê).
3. Escreva o `contrato.md` do seu caso de uso, com a coluna "implementado ou a implementar".
4. Para cada linha, escreva o teste que quebra se ela mudar, incluindo um que prove que **nada interno vaza**.
5. Repita o inventário e guarde o resultado final.
6. **Mutação** (módulo 7): mude o status de uma resposta de erro (por exemplo, 400 vira 422). Um teste deve falhar. Guarde a saída.

## 7. Como saber que funcionou
- [ ] Cada situação tem status e corpo **reais**, de uma execução, e não de leitura de código.
- [ ] Toda diferença tem destino registrado (corrigir ou ADR).
- [ ] O contrato foi aprovado por uma pessoa **antes** de o código mudar.
- [ ] Cada linha do contrato tem teste, e há teste de não exposição.
- [ ] O segundo inventário coincide com o contrato.

## 8. Armadilhas comuns
- **Inventário por leitura de código.**
- **Inventariar contra um banco ou configuração diferentes** dos reais (a validação costuma ser configurada em um arquivo de inicialização que os testes precisam repetir).
- **Corrigir sem decisão**: transformar 201 em 400 muda o que os clientes veem.
- **Esconder a imperfeição** em vez de registrá-la.
- **Confiar no inventário como teste**: ele é um retrato, não uma proteção.

## 9. Exercícios
1. Por que "nome só com espaços" voltou 201 e ninguém percebeu antes?
2. Qual a diferença entre o inventário e os testes de contrato?
3. Por que o método exige aprovação do contrato antes de alterar o código?
4. Dê um exemplo, no seu domínio, de uma resposta que **nunca** pode aparecer ao cliente.
5. Em que caso uma diferença deve ser **aceita** em vez de corrigida? Quem decide?

## 10. Como lidar com a IA (inteligência artificial) neste módulo
- Se a IA descreve o contrato **sem executar nada**, trate como hipótese. Peça o inventário **com a saída bruta**.
- Ela pode "corrigir" uma divergência por conta própria (mudar um status). Isso é decisão de contrato, e **sua**. Exija que ela apresente a diferença e espere a sua escolha.
- Peça que proponha **situações que você não listou** (JSON quebrado, rota errada, corpo vazio) e execute você mesmo.
- Cuidado: a IA tende a escrever o teste de contrato **copiando a resposta atual**, mesmo que esteja errada. Confira se o teste reflete o contrato **decidido**.

Próximo: módulo 10, e se uma fatia aparecer tarde demais?
