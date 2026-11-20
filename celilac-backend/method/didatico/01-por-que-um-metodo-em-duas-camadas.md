# 01 — Por que um método em duas camadas

> **Público:** estudantes de graduação que vão implementar casos de uso em seus próprios projetos.
> **Objetivo:** entender o que aprendemos ao executar o UC12 do CeliLac (Materiais 01 a 13) e por que o método foi reorganizado.
> **Pré-requisito:** conhecer Git, GitHub (Issues, PRs, Projects) e testes automatizados em nível básico.

---

## 1. O ponto de partida

O UC12 (Cadastrar Produto) foi implementado seguindo 13 materiais em sequência: planejamento, GitHub, equipe, TDD RED, GREEN, refatoração, HTTP, verificação integrada, PostgreSQL, Docker, contratos, auditoria e coleção `.http`.

O resultado técnico foi bom: API funcionando, persistência real, containers, testes e script de verificação. O diagnóstico a seguir trata de **como o trabalho foi organizado e registrado**, que é o que determina se o método se repete com outros casos de uso.

## 2. O que funcionou (e continua)

| Prática | Por que vale manter |
|---|---|
| Sequência planejar → testar → implementar → expor → persistir → containerizar → verificar | Reduz risco: cada passo apoia-se no anterior. |
| "Nunca invente evidência" | Um relatório sem prova real vira ficção. |
| Classificar afirmações (*Documentado*, *Confirmado no código*, *Executado*…) | Separa o que se sabe do que se supõe. |
| "Inspecione antes de criar" | Evita duplicar issues, branches, arquivos. |
| Proibir comandos destrutivos e merge automático | Protege dados e decisões humanas. |
| Definition of Ready e WIP | Impedem começar o que não está pronto e abrir frentes demais. |

## 3. O que o UC12 revelou (com evidências)

Cada item abaixo foi observado no repositório e no GitHub, não é opinião.

### 3.1. O planejamento envelheceu e ninguém o atualizou
O artefato `01-12` afirma **6 Sub-Issues**, com persistência como SUB-03 e testes como SUB-06. No GitHub existem **9**: persistência é SUB-04, testes é SUB-07, e SUB-08 e SUB-09 foram acrescentadas depois.
**Lição:** planejamento é um documento vivo. Sem um lugar único que diga "como está agora", os documentos passam a contar histórias diferentes.
**Resposta do método:** o `state.yaml` (ver Etapa 2).

### 3.2. Dividir por camada gerou trabalho acoplado
SUB-07 (testes) e SUB-05 (implementação) foram issues separadas. O resultado foram dois PRs empilhados: o PR #12 continha um teste que falhava; o PR #13 dependia dele. Um teste falhando integrado sozinho deixa a `main` vermelha.
**Lição:** quem separa "teste" e "código" em tarefas diferentes separa o que o TDD pede para manter junto.
**Resposta do método:** **fatia** (comportamento). Um comportamento (ex.: "rejeitar nome vazio") entra em **um PR**, com commits de RED, GREEN e REFACTOR. *(Nota: este documento falava em "fatia vertical"; o termo foi refinado na ADR-003.)*

### 3.3. A rastreabilidade se perdeu nos materiais finais
Os Materiais 11, 12 e 13 não têm issue própria. O PR #19 referencia issues de outros escopos (#10 e #9). O Material 13 usa a issue #11, já fechada. Todas as issues e a Epic foram fechadas em lote no mesmo dia.
**Lição:** o quadro do GitHub só ajuda se refletir o trabalho no momento em que ele acontece.
**Resposta do método:** toda fase com trabalho próprio tem issue; issue fechada não é reutilizada; fechar exige PR integrado e link da evidência.

### 3.4. Referências quebradas
Vários artefatos citam `prompts/uc-12.md`. O arquivo está em outro lugar.
**Lição:** caminho citado em documento é uma afirmação verificável.
**Resposta do método:** regra 19 do `AGENTS.md` e, mais adiante, uma verificação automática de links.

### 3.5. Fundação misturada com caso de uso
Docker/Compose (SUB-09) foi tratado como parte do UC12. Mas containerização, CI e estrutura de verificação HTTP servem a **todos** os casos de uso. No UC13 seriam refeitos ou esquecidos.
**Lição:** separe o que se faz uma vez do que se repete.
**Resposta do método:** **Camada 0 (Fundação)** e **Camada 1 (Ciclo do UC)**.

### 3.6. Documentação demais, prova de menos
Foram cerca de 100 arquivos e 720 KB de Markdown, com cabeçalhos e tabelas repetidos. Os "feedbacks" eram a própria IA atribuindo nota ("aprovado com excelência"). O que realmente prova o trabalho (testes, coleção `.http`, `run-checks.sh`) está no código.
**Lição:** documentação extensa não é sinônimo de evidência. A prova mais forte é automatizada e reexecutável.
**Resposta do método:** um relatório curto por fase, evidências brutas em `evidencias/`, CI como árbitro. Veredicto é humano ou do CI.

### 3.7. Prompts grandes e presos ao exemplo
Os prompts tinham 30 a 55 KB e traziam portas, nomes de container e números de issue do CeliLac. Mesmo com avisos de "não imponha", isso favorece que o exemplo vaze para o projeto do aluno. Também pediam colar "os oito Markdown anteriores" a cada etapa.
**Resposta do método:** regras comuns no `AGENTS.md`, procedimentos curtos nos playbooks, nomes reais no `project-profile.md`, exemplos isolados em `method/exemplos/`, estado lido do `state.yaml`.

## 4. A nova organização

```
Camada 0 — Fundação (uma vez por repositório)
  perfil do projeto · infraestrutura (Docker/Compose) · CI · estrutura de verificação HTTP · convenções

Camada 1 — Ciclo do caso de uso (a cada UC)
  A Planejar e publicar
  B Fatias (RED → GREEN → REFACTOR, um PR por fatia, no núcleo)
  C Adaptadores: fronteira HTTP e persistência real
  D Contrato de resposta
  E Verificação reprodutível
  F Auditoria e encerramento
```

Cada fase termina em um **gate de saída verificável** e em **validação humana** antes da seguinte.

## 5. Como esta mudança se conecta aos materiais 01–13

| Material anterior | Passa a ser |
|---|---|
| 01, 02, 03 | Fase A |
| 04, 05, 06 | Fase B (por fatia) |
| 07, 08, 09 | Fase C |
| 10 (Docker) | Camada 0 |
| 11 | Fase D |
| 13 | Camada 0 (estrutura) + Fase E (cenários do UC) |
| 12, 12C | Fase F |

## 6. Exercícios de verificação

1. Abra o seu repositório e liste as Sub-Issues do GitHub. O seu planejamento local diz o mesmo número? Qual dos dois vence, e por quê?
2. Explique com suas palavras por que um PR contendo só um teste falhando é um problema para a `main`.
3. Escolha um comportamento do seu caso de uso e descreva-o como **fatia**: qual regra e qual critério de aceite ele cobre? Qual é o teste RED, com o nome exato?
4. Dê um exemplo do seu projeto de algo que pertence à Camada 0 e algo que pertence à Camada 1.
5. Por que o relatório de uma fase não deve conter "aprovado com excelência" escrito pelo agente?

## 7. Para ir além

- Próximo documento: **02 — Estado como fonte da verdade** (será adicionado na Etapa 2).
- Registro formal das decisões desta etapa: `method/decisoes/ADR-001-organizacao-do-metodo.md`.
