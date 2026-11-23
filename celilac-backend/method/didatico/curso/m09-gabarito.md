---
id: m09-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Módulo 9'
gabarito_de: [m09]
---

# Gabarito para autoestudo — Módulo 9

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Fatos registrados na preparação do material

Os itens abaixo descrevem evidências e observações do projeto de referência registradas quando este gabarito foi escrito. Não são resultados de uma execução sua nem desta revisão.

- `contrato-atual.txt` tem **13 cenários**; os dois que divergem do esperado e que o módulo cita são: nome só com espaços (201) e nome com 121 caracteres (500). O relatório D registra três divergências ("achou nome só com espaços aceito, nome acima de 120 virando 500 e dois formatos de erro 400"); o módulo cita só as duas visíveis na saída guardada.
- O inventário final (`contrato-final.txt`) e o `contrato.md` coincidem nos 13 cenários, segundo o relatório D (gates aprovados pelo CI).
- Divergências viraram F05, F06 (núcleo, fase B reaberta) e C1b (DTO e filtro, fase C reaberta).

## Exercícios
1. Porque a regra "não aceitar nome em branco" não existia no código e nenhum teste exercitava o caso; o relatório de consistência afirmava cobertura sem executar.
2. Inventário: retrato executado de uma data/commit. Testes de contrato: falham quando o comportamento muda. O inventário só afirma a quantidade de cenários.
3. Mudar contrato afeta clientes (irreversível para quem já consome); a pessoa responsável precisa decidir antes.
4. Resposta livre: mensagem do banco, pilha, host, campos internos, credenciais.
5. Aceitar quando o comportamento real é tolerável e mudar custa mais que o benefício (ex.: campos extras ignorados, mensagem extra na lista). Decide a pessoa responsável pelo contrato, registrando em ADR.

## Pontos de atenção
- Não faça inventário pela leitura do código: use um arquivo com saída executada, data e commit.
- Prática 4: verificar que o teste de não exposição realmente falha ao se vazar algo (mutação do passo 6 ou equivalente).
- Distinguir correção de bug de comportamento novo: o segundo é fatia (módulo 10).
- As afirmações sobre "ruído de mensagem" e NUL são pendências **declaradas** no relatório D e em `contrato.md`, não problemas escondidos.

## Reveja sua resposta se
- Preenche o inventário de memória ou pela IA.
- Corrige o status sem registrar decisão.
- Escreve testes que copiam a resposta atual sem confrontar com o contrato decidido.
