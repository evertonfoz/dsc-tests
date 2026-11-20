# ADR-002 — `state.yaml` por caso de uso, `docs/uc/<UC>/` e validador sem dependências

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável

## Contexto
A rastreabilidade (fase, issues, branches, PRs, evidências) estava dispersa e divergiu do GitHub no UC12. Ver didático 01 e 02.

## Decisão
1. Um `state.yaml` por UC em `docs/uc/<UC>/` (junto de `uc.md`, `relatorios/`, `evidencias/`) é a fonte da verdade da rastreabilidade.
2. Um `project-profile.md` na raiz concentra o que é do projeto (comandos, infraestrutura, proteções, convenções).
3. Campos de equipe no `state.yaml` limitados a `responsavel` e `revisor` por fatia; detalhes de papéis ficam no perfil.
4. O validador `method/scripts/check-state.mjs` lê um **subconjunto estrito de YAML**, sem dependências; `--remote` consulta o GitHub somente-leitura.
5. Gates "aprovados" exigem o nome de quem validou; o agente não se aprova.
6. Credenciais: o perfil recomenda `${VAR:?mensagem}` no Compose; a correção no repositório fica para a Etapa 4.

## Consequências
- (+) Um lugar só para responder "onde estamos?"; divergências detectáveis por máquina.
- (+) Funciona em qualquer máquina com Node, sem instalar pacotes.
- (−) Subconjunto de YAML limita a sintaxe (sem blocos multilinha, âncoras).
- (−) Exige atualizar o arquivo a cada fase e fatia.

## Alternativas descartadas
- **Adicionar `yaml` como devDependency:** altera o `package.json` do projeto e cria dependência de instalação para um artefato de método.
- **`state.json`:** parseável nativamente, mas pior de ler e comentar por estudantes.
