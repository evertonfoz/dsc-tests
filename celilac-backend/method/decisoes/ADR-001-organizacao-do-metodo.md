# ADR-001 — Organização do método em duas camadas, agnóstico de agente e de stack

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável (aprovação), com análise do UC12 / CeliLac

## Contexto
O UC12 foi executado por 13 materiais lineares. A análise mostrou planejamento desatualizado, sub-issues por camada, perda de rastreabilidade a partir do Material 10, referências quebradas, fundação misturada ao caso de uso, excesso de documentação e prompts presos ao exemplo CeliLac. Ver `method/didatico/01-por-que-um-metodo-em-duas-camadas.md`.

## Decisões
1. **Duas camadas:** Fundação (uma vez) e Ciclo do UC (fases A–F, repetível).
2. **Fatias** (comportamentos) como Sub-Issues — termo refinado na ADR-003, que substitui "fatias verticais"; RED, GREEN e REFACTOR no mesmo PR; sem stacked PR por padrão.
3. **`state.yaml` por UC** como fonte da verdade da rastreabilidade.
4. **Um relatório curto por fase**; evidências brutas em `evidencias/`; veredicto humano ou do CI.
5. **Playbooks curtos + `AGENTS.md` comum + perfil do projeto**; exemplos do CeliLac isolados em `method/exemplos/`.
6. **Agnóstico de agente** (Markdown + `AGENTS.md`) e **agnóstico de stack**, com perfis por stack; `celilac-nest` será o primeiro.
7. **Local:** pasta `method/` neste repositório. **Idioma:** português técnico-acadêmico.
8. **Condução:** uma fase por vez, com perguntas prévias e validação humana a cada gate.
9. **Cada etapa de construção do método gera um artefato didático** em `method/didatico/`.

## Consequências
- (+) Reuso entre casos de uso, estado consistente, PRs pequenos, `main` verde, menos documentação redundante.
- (+) Alunos com agentes ou stacks diferentes podem adotar o método.
- (−) Exige disciplina de atualizar `state.yaml` a cada fase.
- (−) Os materiais 01–13 existentes precisarão ser mapeados/reescritos (Etapas 5 e 6).

## Alternativas descartadas
- **Manter os materiais 01–13 como sequência linear:** preserva o problema da deriva e da repetição.
- **Sub-issues por camada com PRs empilhados:** separa o que o TDD pede para manter junto.
- **Prompt único gigante:** reproduz o acoplamento ao exemplo e o custo de contexto.
