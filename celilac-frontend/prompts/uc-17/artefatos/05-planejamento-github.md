# 05 — Planejamento no GitHub

> **Situação:** publicado em 2026-11-28, com autorização de `evertonfoz`: issue principal #171, F01 #172, F02 #173 e GitHub Project #7. Branch e PR ainda não existem. O texto abaixo é a proposta que originou a publicação; o conteúdo vigente é o das issues.
> Siglas: UC (caso de uso), PR (*Pull Request*, proposta de mudança no GitHub), CA (critério de aceite), RF (requisito funcional), ADR (*Architecture Decision Record*, registro de decisão arquitetural), CI (*Continuous Integration*, integração contínua).

## Inspeção prévia
Antes da publicação, não havia issue do UC17. Os rótulos `type:epic`, `type:feature`, `type:docs`, `layer:tests` e `priority:medium` já existem. Rótulos `uc17` e `module:frontend` precisavam ser criados.

## Issue principal (Epic)
**Título:** `[UC17] Autenticar usuário`
**Rótulos:** `type:epic`, `uc17`, `module:frontend`

**Objetivo:** permitir que a pessoa entre no sistema pelo navegador. Esta primeira entrega cria a base da interface.

**Critérios de aceite desta entrega:** CA01 a CA07 da especificação em `celilac-frontend/docs/planejamento/uc17-autenticar-usuario/uc-17.md`.

**Fora do escopo:** autenticação na API, proteção do dashboard e controle por perfil (RF06 a RF08, ADR-001); CI e contêineres (ADR-003).

## Sub-issue F01
**Título:** `[UC17][F01] Navegar pelas telas iniciais`
**Rótulos:** `type:feature`, `uc17`, `module:frontend`, `layer:tests`

**Comportamento:** a raiz leva ao login; dashboard e acesso negado abrem pelo endereço.
**Critérios:** CA01, CA03, CA04.
**Testes RED previstos:**
- `should redirect the root path to the login page (CA01)`
- `should show the dashboard page at /dashboard (CA03)`
- `should show the access denied page at /unauthorized (CA04)`

**Depende de:** base do projeto criada.

## Sub-issue F02
**Título:** `[UC17][F02] Formulário de login sem autenticação`
**Rótulos:** `type:feature`, `uc17`, `module:frontend`, `layer:tests`

**Comportamento:** o login mostra o formulário e o envio não faz requisição.
**Critérios:** CA02, CA07.
**Testes previstos:**
- `should show the e-mail and password fields and the submit button (CA02)`
- `should not send any request when the login form is submitted (CA07)` — tende a passar sem falhar antes; será tratado como caracterização e validado por mutação.

**Depende de:** F01.

## Project
Novo, com os estados `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`. Fatias começam em `Backlog` até a revisão humana.

## Pull request
Um único PR para F01 e F02, o que exige `pr_compartilhado: true` nas duas fatias (ADR-005 do método).
