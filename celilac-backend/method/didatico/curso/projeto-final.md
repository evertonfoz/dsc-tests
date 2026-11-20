# Projeto final — Conduza um caso de uso seu, do início ao fim

> **Pré-requisito:** módulos 0 a 12 (e os apoios que você precisou). Duração sugerida: 4 a 6 semanas, em trabalho individual ou em dupla (estimativa do material, ainda não testada com turmas).
> **Você vai:** aplicar o método completo ao caso de uso que escolheu no início do curso, entregando **evidências**, e não apenas código.

---

## 0. Siglas e termos deste projeto
Todos já foram explicados nos módulos; aqui vão de novo, em uma linha cada:
- **PR** (*pull request*): proposta de mudança no GitHub, revisada antes de entrar na `main`.
- **HTTP** (*HyperText Transfer Protocol*): o protocolo pelo qual um cliente pede algo à API.
- **API** (*Application Programming Interface*): a interface pela qual outros programas usam o seu sistema.
- **DTO** (*Data Transfer Object*): classe que descreve e valida os dados que chegam pela API.
- **ADR** (*Architecture Decision Record*): documento curto que guarda uma decisão.
- **ORM** (*Object-Relational Mapping*): biblioteca que traduz objetos do código em linhas do banco.
- **RED/GREEN/REFACTOR**: escrever o teste que falha, fazer passar, melhorar o código.
- **Gate**: condição de saída de uma fase, registrada com quem a atestou.

---

## 1. O que o projeto é (e não é)
É **conduzir um caso de uso (UC, *Use Case*)** do seu domínio pelas fases A a F, com a IA (inteligência artificial) como assistente e **você** como responsável por cada decisão.

Não é: um sistema grande, uma interface bonita, nem um teste de quem escreve mais código. O que se avalia é se **cada afirmação sua tem evidência** e se **você decidiu o que era seu decidir**.

## 2. Antes de começar (a Fundação)
Confira o que o módulo 4 pediu; sem isto, o método não começa:
- [ ] repositório próprio com o código do seu domínio;
- [ ] `project-profile.md` preenchido, sem itens críticos `a confirmar`;
- [ ] banco de testes separado e com as travas do módulo 8;
- [ ] CI (integração contínua) rodando na branch principal e **verde**;
- [ ] `method/` copiado e o `AGENTS.md` na raiz (módulo 12);
- [ ] o documento do seu caso de uso no repositório.

**Limite declarado:** só o tipo de caso de uso "criar" (cadastrar algo) foi exercitado em um caso real (UC12, concluído). Se o seu for consultar, atualizar, excluir ou autenticar, os guias são **esboços**: avise o professor e registre isso no relatório.

## 3. O roteiro, fase a fase
Cada etapa tem uma **entrega** e um **gate** (módulo 12). Você valida cada gate; a IA não.

| Fase | O que fazer | Módulos de apoio | Entrega mínima |
|---|---|---|---|
| **A** Planejar e publicar | Ler o UC, listar requisitos e regras, decompor em **fatias** (comportamento observável), criar issues, publicar o plano | 0, 2, 3 | `state.yaml`, issues, tabela requisito → fatia |
| **B** Fatias no núcleo | Para cada fatia: teste que falha (RED), implementação (GREEN), refatoração, um PR | 3, 5, 7 | PRs integrados, evidência RED/GREEN, mutação em pelo menos 3 testes |
| **C** Adaptadores | Fronteira HTTP (DTO, filtro de erros) e persistência (migration, repositório, teste com banco real) | 6, 8 | PRs, teste de falha real do banco, prova de banco vazio |
| **D** Contrato | Inventário executando, decisões, `contrato.md`, testes de contrato e de não exposição | 9, 10 | inventário inicial e final, ADR das decisões |
| **E** Verificação | Coleção `.http`, script de verificação, controle negativo, durabilidade | 4, 11 | saídas guardadas, script no CI |
| **F** Auditoria | Cobertura real, auditoria arquitetural, consistência, pendências | 1, 12 | relatório F, tabela de cobertura, lista de pendências |

Se aparecer comportamento novo depois da fase B, use a **reabertura** (módulo 10): nunca implemente "por baixo".

## 4. Como conduzir com o orquestrador
O arquivo `method/orquestrador/prompt-do-estudante.md` contém um prompt para entregar ao seu assistente de IA. Ele:
- lê as regras e o `state.yaml`, e diz em que fase você está;
- executa **uma fase por vez** e **para a cada gate**;
- pergunta só o que falta;
- **pede autorização** antes de publicar no GitHub, tocar banco ou rodar comandos destrutivos.

Para retomar uma sessão, abra um assistente novo e cole o mesmo prompt: o estado está **no repositório**, não na conversa.

## 5. Regras do projeto
1. **Você aprova.** Todo gate registrado com `por:` seu (ou do CI, nos objetivos). A IA não aprova, não faz merge, não fecha issue.
2. **Evidência real.** Saída que não veio de uma execução sua vira `a confirmar`.
3. **Registre a IA.** Marque em cada PR o que foi feito ou revisado por IA (módulo 12).
4. **Um PR por fatia**, `main` sempre verde, sem PRs encadeados.
5. **Nada destrutivo** fora do banco de testes e sem a sua autorização por comando.
6. **Pendências escritas.** Entregar "sem pendências" exige prova muito forte.
7. **Dupla:** quem escreveu não é quem revisa. Em trabalho individual, declare a ausência de revisão independente.

## 6. O que entregar
1. O repositório com o histórico (issues, PRs, commits RED/GREEN/REFACTOR).
2. `docs/uc/<seu-uc>/` com `state.yaml`, `contrato.md`, relatórios A a F e `evidencias/`.
3. **Tabela de cobertura real** (módulo 12): requisito, regra, critério, fluxo, teste que prova, classificação.
4. **Registro de uso da IA:** o que você delegou, o que conferiu, **um exemplo em que a IA errou ou foi imprecisa** e como você percebeu.
5. **Controle negativo** do script de verificação e **mutações** dos testes mais importantes, com saídas.
6. **Lista de pendências e riscos**, com etiqueta e destino de cada um.
7. Um **texto curto** (1 página) respondendo: o que o seu caso de uso **não** prova ainda?

## 7. Apresentação e verificação
Na apresentação, um colega (ou o professor) escolhe **três afirmações** do seu relatório e pede a evidência. Você mostra o arquivo de saída e **repete o comando** ao vivo, em ambiente que não é o seu.

## 8. Como saber que funcionou
- [ ] Todas as fases têm relatório de fatos e gate registrado por quem de direito.
- [ ] O CI da branch principal está verde e o script de verificação roda no CI.
- [ ] Alguém que não é você repetiu a verificação.
- [ ] Cada afirmação do relatório tem etiqueta e evidência.
- [ ] As pendências estão escritas.
- [ ] Não há comando destrutivo executado fora do banco de testes.

## 9. Armadilhas comuns
- Escolher um caso de uso **grande demais**. Prefira poucas fatias bem provadas.
- Deixar a documentação para o fim e reconstruí-la de memória.
- Entregar saídas copiadas de outro lugar ou geradas pela IA sem execução.
- Pular o controle negativo e as mutações "por falta de tempo".
- Fechar o UC escondendo o teste instável ou a dúvida de regra.

## 10. Como lidar com a IA (inteligência artificial) no projeto
- Entregue a ela o orquestrador e as regras, e **mantenha as decisões**: aprovar, integrar, fechar, destruir.
- Peça "o que você verificou de fato e o que está presumindo" ao fim de cada fase.
- Quando ela errar, **registre** (item 4 da entrega): esse registro é parte da avaliação, e não um demérito.
- Se ela insistir em atalhos (pular RED, afrouxar teste, ligar sincronização automática do ORM), **recuse** e anote.

Fim do curso. Os módulos, os apoios e os gabaritos estão no `README.md` desta pasta.
