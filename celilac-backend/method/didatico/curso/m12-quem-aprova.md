---
id: m12
tipo: modulo
titulo: 'Módulo 12 — Quem aprova, e o que a IA pode fazer?'
ordem: 17
prerequisitos: [m01, m02, m03, m07, m10, m11]
duracao: '2 aulas'
gabarito: m12-gabarito
pratica: m12-pratica
---

# Módulo 12 — Quem aprova, e o que a IA pode fazer?

> **Pré-requisito:** módulos 1, 2, 3, 7, 10 e 11. Duração sugerida: 2 aulas.
> **Você vai:** separar, com regras escritas, o que a IA (inteligência artificial) **pode fazer**, o que **só uma pessoa decide** e o que **só o CI** (integração contínua, o robô que roda as verificações, apoio C) pode atestar, e fazer uma **auditoria** do que o caso de uso realmente entregou.

---

## 1. O problema
Em todo o UC12 (UC, *Use Case*: caso de uso de cadastrar produto), uma IA fez a maior parte do trabalho: escreveu código, testes, relatórios e documentos. Isso levanta uma pergunta que nenhuma tecnologia responde sozinha: **quem diz que está pronto?**

Duas observações do caso real:
- A própria IA **esqueceu de conferir o código de saída** de um validador mais de uma vez (a verificação falhava e o comando seguinte seguia adiante). Quem pegou foi o CI.
- A ferramenta que valida o `state.yaml` (módulo 2) emitiu o aviso "**revisor igual ao responsável**": a mesma pessoa escreveu e revisou. Isso não é erro, é uma **limitação declarada**.

Sem regra explícita, a decisão de "aprovado" acaba tomada por quem tem mais conveniência: a pessoa com pressa, ou a IA que quer "concluir".

## 2. Antes de ler a solução: quem decide?
Para cada ação abaixo, marque quem **deveria** poder fazê-la sozinho: **P** (uma pessoa responsável), **C** (o CI), **A** (a IA, com a pessoa vendo depois) ou **N** (ninguém, sem autorização específica). Justifique em uma frase.

| # | Ação |
|---|---|
| 1 | Escrever o primeiro rascunho de um teste |
| 2 | Integrar (fazer *merge*, juntar a mudança à `main`) um PR (*pull request*) |
| 3 | Marcar um gate (a condição de saída de uma fase) como "aprovado" |
| 4 | Dizer que "todos os testes passam" |
| 5 | Fechar uma issue |
| 6 | Rodar `docker compose down -v` ou `DROP` |
| 7 | Decidir se espaços nas pontas do nome contam no limite |
| 8 | Preencher a saída de um comando que não conseguiu executar |
| 9 | Escrever o relatório de uma fase |
| 10 | Propor reabrir uma fase anterior |

## 3. A tentativa ingênua
| Atalho | Por que não basta |
|---|---|
| "A IA disse que está pronto" | a IA não tem responsabilidade nem conhece o que você não contou; o seu relatório de "pronto" é hipótese |
| "O CI está verde, logo está bom" | o CI atesta **o que foi codificado para verificar**; não atesta o que ninguém verificou (módulos 1 e 7) |
| "Eu revisei" (sendo o autor) | revisão do autor não é independente |
| "Mandei a IA revisar" | revisão por IA também não é independente e precisa ser **registrada como tal** |

## 4. A solução: regras escritas, evidência e etiquetas

### 4.1. O arquivo de regras
O método guarda as regras permanentes em `method/AGENTS.md`, lido por qualquer agente de IA (ou pessoa) que atue no repositório. As que mais importam neste módulo:

| Regra | O que diz |
|---|---|
| 1 | **Uma fase por vez, com validação humana.** Ao terminar, apresenta o gate e **espera** aprovação; nunca encadeia fases |
| 3 | **Nunca inventar evidência.** Saídas, logs, hashes e números só entram se foram **obtidos de fato**; senão, escreve `a confirmar` |
| 4 | **Classificar a afirmação** com uma etiqueta: `Documentado`, `Confirmado no código`, `Executado nesta fase`, `Aguardando evidência`, `Pendente de correção` |
| 8 | **Sem ação destrutiva ou irreversível** sem autorização explícita e específica (`down -v`, `DROP`, `TRUNCATE`, `push --force`, apagar branches, fechar issues, merge) |
| 9 | **Merge e fechamento de Epic são humanos.** O agente prepara; a pessoa decide ou autoriza cada comando. (*Epic* é a issue-mãe que agrupa as tarefas de um caso de uso) |
| 14 | **Fechar issue exige duas provas:** PR integrado e link para a evidência |
| 21 | **O agente não se autoavalia.** O relatório registra fatos e evidências; o veredito é da pessoa ou do CI |

### 4.2. O gate tem um "por quem"
No `state.yaml`, cada item do gate registra o resultado **e quem o atestou**:
```yaml
- { item: "CI verde na branch principal", resultado: aprovado, por: CI }
- { item: "Issues e Epic fechados",       resultado: aprovado, por: evertonfoz }
```
Itens objetivos (CI verde) podem ser atestados pelo CI. Itens que exigem julgamento (arquitetura em conformidade, decisão de contrato) são de **uma pessoa**. Nunca o `por:` é a IA.

### 4.3. Relatório de fatos, sem veredicto
Os relatórios de fase (por exemplo `docs/uc/uc12/relatorios/F.md`) abrem dizendo: *"Fatos e evidências, sem veredicto. O agente não aprovou gate, não fechou issue nem Epic."* Cada afirmação traz etiqueta e caminho da evidência.

### 4.4. A auditoria (fase F): o que foi **realmente** entregue
A última fase não "comemora": verifica. Em `docs/uc/uc12/evidencias/F/cobertura.md` cada item do caso de uso (RF, requisito funcional; RN, regra de negócio; CA, critério de aceite; FA e FE, fluxos alternativo e de exceção) recebe: **coberto**, **parcial**, **não implementado (com ADR)** ou **aguardando decisão**. Resultado do UC12: o requisito RF02 ficou **parcial** (só o nome) e RN02 e FA02 (preço) ficaram **não implementados**, por decisão registrada (ADR-002).

A auditoria arquitetural (`docs/uc/uc12/evidencias/F/auditoria.md`) lista **sete achados**, cada um com etiqueta e destino: dois tratados, um decidido, um deles com teste instável (#27) que **segue aberto e pode derrubar o CI por acaso**.

> Um encerramento honesto tem **pendências escritas**. Um UC "100% pronto, sem pendências" merece desconfiança (módulo 1).

### 4.5. O orquestrador: automatizar sem tirar a decisão
O arquivo `method/orquestrador/prompt-do-estudante.md` é um texto que você entrega à IA para que ela **conduza** o caso de uso: lê as regras, lê o `state.yaml`, diz em que fase estão, executa **uma fase por vez** e **para a cada gate** para você validar. Ele existe para que a IA **ajude a seguir o processo**, e não para que decida por você.

## 5. Os limites que o piloto admitiu
- Os gates foram validados pelo mesmo professor que conduziu: **sem revisão independente**.
- Algumas revisões foram feitas por IA e foram registradas como tal.
- Um teste instável (#27) permanece sem causa conhecida.
- A duração e o esforço do curso são **estimativas**, ainda não testadas com turmas.

Um método não elimina o erro; ele torna o erro **visível a tempo**.

## 6. Pratique no seu domínio

Faça a atividade passo a passo em [`m12-pratica.md`](./m12-pratica.md). Produza os artefatos no seu repositório e confira cada resultado no caminho e nos critérios indicados no arquivo de prática.

## 7. Como saber que funcionou
- [ ] Você tem regras escritas, e sabe dizer qual ação é de quem.
- [ ] `AGENTS.md` existe na raiz e aponta para o projeto e o caso de uso corretos; `method/AGENTS.md` permanece em `method/`.
- [ ] Nenhum gate seu foi "aprovado" por IA.
- [ ] Cada afirmação do relatório tem etiqueta e evidência.
- [ ] Há uma tabela de cobertura real e uma lista de pendências.
- [ ] Houve ao menos uma revisão feita por outra pessoa, ou a ausência dela está declarada.

## 8. Armadilhas comuns
- **Delegar o veredito** à IA porque ela escreve com segurança.
- **Marcar "aprovado" para fechar a fase.**
- **Esconder pendências** para o relatório parecer completo.
- **Confundir revisão por IA com revisão independente.**
- **Autorizar "tudo" de uma vez** em vez de ação por ação.
- **Tratar o CI como juiz do que ele não verifica.**

## 9. Exercícios
1. Por que a regra 21 proíbe que o agente se autoavalie?
2. Em que o `por: CI` difere de `por:` com o nome de uma pessoa?
3. Dê um exemplo de afirmação do tipo `Aguardando evidência` no seu caso de uso.
4. O que o aviso "revisor igual ao responsável" quer dizer, e por que é aviso e não erro?
5. Por que um relatório com pendências escritas inspira **mais** confiança?

## 10. Como lidar com a IA (inteligência artificial) neste módulo
- Peça sempre: "**o que você verificou de fato, e o que está presumindo?**".
- Se ela propuser "marcar o gate como aprovado" ou "fechar a issue", **recuse**: pode apenas apresentar os fatos.
- Ela pode ser convincente e estar errada. Confira por amostragem: se uma afirmação falhar, desconfie do conjunto (regra 3 do curso).
- Dê a ela o orquestrador e as regras, mas **mantenha as decisões e as autorizações por ação**.

Próximo: o projeto final, conduzir um caso de uso do seu domínio do início ao fim.
