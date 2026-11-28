# 00 — UC de referência e mapa de fontes (UC17 — Autenticar usuário)

> Origem das afirmações: **Confirmado no código** (leitura e buscas), **Confirmado pelo estudante** (respostas desta execução) ou **Pendente**.
> Siglas: UC (caso de uso), API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema), ADR (*Architecture Decision Record*, registro de decisão arquitetural), TDD (*Test-Driven Development*, desenvolvimento guiado por testes), PR (*Pull Request*, proposta de mudança no GitHub).

## Valores desta execução

| Variável | Valor | Origem |
|---|---|---|
| `REF` | UC16 — Remover Produto, como padrão de organização (apoio, prompt, resumo e `artefatos/`) | Confirmado pelo estudante |
| `ALVO` | UC17 — Autenticar usuário (arquétipo `autenticar`) | Recomendação do assistente, aceita pelo estudante |
| Pasta do projeto | `celilac-frontend/`, ao lado do backend | Recomendação aceita |
| Material de origem | "Criação do Projeto React e Estrutura Inicial do Frontend" (PDF, fora do repositório) | Confirmado pelo estudante |
| Curso aplicado | módulos 0 e 1, apoio A, módulo 2 e apoio B | Confirmado pelo estudante |
| Dependências de teste | Vitest, Testing Library e `jsdom` | Recomendação aceita |
| Versões | sempre a atual, consultada na instalação | Confirmado pelo estudante |
| Ritmo | uma etapa por vez, com validação antes da seguinte | Confirmado pelo estudante |
| Publicação no GitHub (issues #171 a #173 e Project #7) | autorizada e realizada em 2026-11-28 | Confirmado pelo estudante |

## Mapa de fontes

| Fonte esperada | Encontrada? | Caminho (no repositório do curso, pasta `celilac-backend/`) |
|---|---|---|
| Apoio do módulo 0 | sim | `prompts/uc-14/uc-buscar-por-que-este-metodo.md` <!-- links:ignore --> |
| Apoio do módulo 1 | sim | `prompts/uc-15/uc-alterar-cobertura-real.md` <!-- links:ignore --> |
| Apoio do módulo 2 | sim | `prompts/uc-16/uc-remover-estado-como-fonte.md` <!-- links:ignore --> |
| Apoio B do curso e prática | sim | `method/didatico/curso/apoio-b-testes-e-tdd.md` e `apoio-b-pratica.md` <!-- links:ignore --> |
| Documento de apoio próprio sobre o apoio B | **não existe** | a escrever nesta entrega |
| Método (playbooks, modelos, validadores) | sim | copiado para `method/` deste projeto, sem o curso |

## Estrutura de documentação

| Item | Situação |
|---|---|
| `docs/planejamento/uc17-autenticar-usuario/uc-17.md` | criado na etapa 1 |
| `docs/uc/uc17/` (estado, relatório da fase A e evidências) | criado na etapa 1 |
| `docs/adr/` | ADR-001 a ADR-003 aceitas por `evertonfoz` em 2026-11-28 |
| `prompts/uc-17/` (apoio, prompt, resumo, roteiro) | a escrever depois, com base no que for executado |

A especificação e a tabela de cobertura **não são repetidas** nesta pasta (no UC16 havia os artefatos 03 e 04): ficam só em `docs/`, para não existirem duas versões.
