# Gabarito do professor — Módulo 9

> Uso exclusivo do professor.

## Fatos verificados na preparação
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
- Não deixar o aluno "inventariar" lendo o código. Exigir arquivo de saída com data e commit.
- Prática 4: verificar que o teste de não exposição realmente falha ao se vazar algo (mutação do passo 6 ou equivalente).
- Distinguir correção de bug de comportamento novo: o segundo é fatia (módulo 10).
- As afirmações sobre "ruído de mensagem" e NUL são pendências **declaradas** no relatório D e em `contrato.md`, não problemas escondidos.

## Sinais de que o aluno não entendeu
- Preenche o inventário de memória ou pela IA.
- Corrige o status sem registrar decisão.
- Escreve testes que copiam a resposta atual sem confrontar com o contrato decidido.
