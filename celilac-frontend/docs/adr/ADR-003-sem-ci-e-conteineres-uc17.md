# ADR-003 — Sem integração contínua e sem contêineres nesta entrega

> Siglas: ADR (*Architecture Decision Record*, registro de decisão arquitetural), UC (caso de uso), CI (*Continuous Integration*, integração contínua), PR (*Pull Request*, proposta de mudança no GitHub).

- **Status:** Aceita
- **Data:** 2026-11-28
- **Decisores:** `evertonfoz` (aceita em 2026-11-28)
- **Caso de uso / fase:** UC17, fase A

## Contexto
A entrega aplica o curso até o apoio B. CI é assunto do apoio C, contêineres do apoio D e a Fundação do projeto, do módulo 4. O playbook da fase A exige, para começar, a Fundação concluída com CI verde.

## Decisão
Esta entrega não cria fluxo de CI nem contêineres. O planejamento (fase A) acontece **antes** de a base do projeto existir, em desacordo declarado com o gate de entrada do playbook. A verificação é local, com saídas guardadas como evidência.

## Condição para retomar
Estudo do apoio C (CI), do apoio D (contêineres) e do módulo 4 (Fundação).

## Consequências
- (+) A entrega respeita a sequência do curso.
- (−) O PR não terá verificação automática do frontend: a prova é a execução local.
- (−) O gate da fase B que pede CI verde **não poderá ser aprovado**.

## Alternativas consideradas
- Criar o CI agora — descartada: adianta conteúdo ainda não estudado.
