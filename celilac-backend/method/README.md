# Método de Implementação de Casos de Uso

Método para levar **um caso de uso** da especificação até a integração e o encerramento, com rastreabilidade, evidência real e validação humana a cada fase. Funciona com qualquer agente de IA (ou sem ele), pois é baseado em Markdown e `AGENTS.md`.

## Estrutura

```
method/
├── AGENTS.md              regras permanentes (copiar para a raiz do repositório)
├── glossario.md           termos do método
├── didatico/              artefatos didáticos: o que foi feito, por quê, como replicar
├── decisoes/              ADRs do próprio método
├── playbooks/             guia de fatias, matriz de arquétipos e playbooks das fases A–F
├── templates/             project-profile, state.yaml, relatório de fase, ADR
├── perfis/                perfis de stack (celilac-nest)
├── scripts/               check-state e check-links (validadores) e seus testes
└── exemplos/              exemplos reais (UC12/CeliLac)        (Etapa 6)
```

## Duas camadas

- **Camada 0 — Fundação**, uma vez por repositório.
- **Camada 1 — Ciclo do caso de uso**, fases A–F, repetido a cada UC.

## Como o trabalho é conduzido

1. Você aponta o caso de uso.
2. O agente lê `AGENTS.md`, `project-profile.md` e `state.yaml`, diz em que fase está e pergunta o que falta.
3. O agente executa **uma fase**, registra evidências e atualiza o `state.yaml`.
4. O agente mostra o **gate de saída** e **aguarda sua validação**.
5. Só então a próxima fase começa.

## Trilha de leitura didática

| # | Documento | Assunto |
|---|---|---|
| 01 | `didatico/01-por-que-um-metodo-em-duas-camadas.md` | Diagnóstico do UC12 e as decisões de organização |
| 02 | `didatico/02-estado-como-fonte-da-verdade.md` | `state.yaml`, perfil do projeto e validador |
| 03 | `didatico/03-anatomia-de-um-playbook-e-fatias.md` | Playbooks, fatias e cobertura real |
| 04 | `didatico/04-fundacao-do-projeto.md` | Fundação: ambiente, CI, isolamento e falhas conhecidas |
| 05 | `didatico/05-as-seis-fases-e-seus-playbooks.md` | As fases A–F e seus playbooks |
| 06+ | *(serão adicionados a cada etapa)* | |

## Estado de implementação do método

| Etapa | Entrega | Situação |
|---|---|---|
| 1 | Estrutura-base, `AGENTS.md`, glossário, documento didático 01 | Concluída e aprovada |
| 2 | Perfil do projeto, `state.yaml`, templates e validador | Concluída, aguardando validação |
| 3 | Template de playbook, guia de fatias, matriz por arquétipo, template de issue de fatia | Concluída e aprovada |
| 4 | Fundação (Compose sem senhas padrão, E2E e integração contra banco de testes, migration `uuid-ossp`, CI, `verify.sh`, templates do GitHub, falhas conhecidas com ADR) | Concluída; PR #22 (Draft) aguardando revisão e merge humanos |
| 5 | Playbooks das fases A–F e documento didático 05 | Concluída, aguardando validação (branch `chore/playbooks-fases`, sem PR) |
| 6 | Piloto: reconciliação do UC12 | Pendente |
| 7 | Prompt orquestrador para os alunos | Pendente |

## Pendências registradas para a Etapa 6 (piloto UC12)
Decisões **do responsável pelo caso de uso**, a serem apresentadas com opções (o agente não decide):
1. **RN02/FA02 (preço):** nova fatia ou ADR de adiado/fora de escopo.
2. **FE01 (falha de persistência):** criar teste e tratamento, ou ADR de adiado.
3. **CA05:** corrigir o `12-10` ou, se legítimo, incluí-lo no `uc-12.md`.
