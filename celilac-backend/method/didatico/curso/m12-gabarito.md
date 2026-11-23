---
id: m12-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 12'
gabarito_de: [m12]
---

# Gabarito para autoestudo — Módulo 12

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Seção 2 (tabela sugerida)
| # | Quem | Observação |
|---|---|---|
| 1 | A | rascunho; você confere (módulos 5 e 7) |
| 2 | P | merge é humano (regra 9); o CI verde é condição, não substituto |
| 3 | P ou C | objetivo (CI verde): CI; julgamento: pessoa; nunca a IA (regra 21) |
| 4 | C | só vale com saída de execução; a IA relatando "passam" é hipótese |
| 5 | P | com as duas provas (regra 14) |
| 6 | N | só com autorização explícita e específica (regra 8) |
| 7 | P | decisão de regra de negócio (módulo 7) |
| 8 | N | proibido inventar evidência; deve escrever `a confirmar` (regra 3) |
| 9 | A | com os fatos e etiquetas; sem veredicto |
| 10 | A propõe, P decide | ADR-004 do método (módulo 10) |
Aceitar variações justificadas, principalmente 3 e 4.

## Fatos registrados na preparação do material

Os itens abaixo descrevem evidências e observações do projeto de referência registradas quando este gabarito foi escrito. Não são resultados de uma execução sua nem desta revisão.

- `method/AGENTS.md`: regras 1, 3, 4, 8, 9, 14 e 21 conforme citadas.
- `docs/uc/uc12/relatorios/F.md` abre com "Fatos e evidências, sem veredicto" e lista cobertura (RF02 parcial; RN02 e FA02 não implementados por ADR-002).
- `docs/uc/uc12/evidencias/F/auditoria.md`: achados A1 a A7 (A2 e A7 tratados, A3 decidido, A6 é o #27 aberto).
- O relatório F registra o aviso do `check-state.sh` "revisor igual ao responsável".
- O prompt do orquestrador existe e diz que executa uma fase por vez e para a cada gate.
- A observação de que a IA esqueceu de conferir o código de saída de um validador mais de uma vez vem do README do curso (regra 6 do estudo com IA), registrada durante o piloto.

## Exercícios
1. Quem escreve o relatório não deve dar o veredito sobre o próprio trabalho; a IA pode estar convicta e errada.
2. `por: CI` atesta verificação objetiva automatizada; o nome de uma pessoa atesta julgamento e responsabilidade.
3. Resposta livre (ex.: "o limite do campo não foi confirmado com o cliente").
4. Quem escreveu e quem revisou é a mesma pessoa; é aviso porque às vezes é inevitável (trabalho solo), mas a limitação deve ficar visível.
5. Porque mostra que a verificação realmente procurou, em vez de esconder o que falta.

## Pontos de atenção
- Os limites da seção 5 são do piloto; a nota sobre estimativas de duração é minha (do material), não medida com alunos.
- A frase "um método não elimina o erro, torna visível a tempo" é opinião do material, não resultado medido.
- Prática 6 (revisor independente) pode ser inviável em trabalho solo; aceitar a declaração da ausência.

## Reveja sua resposta se
- Deixa a IA marcar o gate.
- Relatório sem pendências.
- Autoriza comandos destrutivos em bloco.
