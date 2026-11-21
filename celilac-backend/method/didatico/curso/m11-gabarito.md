---
id: m11-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 11'
gabarito_de: [m11]
---

# Gabarito do professor — Módulo 11

> Uso exclusivo do professor.

## Fatos verificados na preparação
- `diagnostico.md`: sete linhas do contrato sem cenário nem asserção; as demais já cobertas.
- Controle negativo: `19 ok, 2 falha(s)`, com falhas em "nome só com espaços" (obtido 201) e "121 caracteres" (obtido 500).
- `run-checks.txt` final: 23 verificações OK e 0 falhas (conforme o relatório E; a saída completa está no arquivo).
- `durabilidade.txt`: reinício só do contêiner da API; registro permanece.
- O relatório E admite que a execução foi em banco de desenvolvimento já existente e que a coleção `.http` não é executada por ferramenta.

## Seção 2 (roteiro cruzado)
O que avaliar: comandos exatos; pré-requisitos declarados (Docker, portas); resultado esperado visível; critério de sucesso sem ler código; ausência de passos "óbvios" omitidos. O valor está nas **adivinhações anotadas** pelo colega.

## Exercícios
1. Porque mostra que o script distingue o erro específico; falhar em qualquer coisa pode ser falha de ambiente.
2. Reiniciar o banco pode perder dados e não prova que o dado estava no banco; reiniciar só a API prova que o estado não estava na memória dela.
3. "Ambiente limpo": o relatório diz que isso só é exercitado pelo job de smoke do CI.
4. Resposta livre.
5. O CI trata exit code ≠ 0 como falha do job; sem isso o script pode imprimir `[FALHA]` e o CI ficar verde.

## Pontos de atenção
- Pedir o arquivo da execução do controle negativo, com falhas **esperadas**; "falhou" sem especificar não vale.
- Um `[OK]` num script que nunca falha é a principal ilusão do módulo.
- O módulo cita 8 verificações acrescentadas (relatório E); o total do script final é 23.
- Prática 5 (troca com colega) é a mais valiosa e a mais pulada; cobrar.

## Sinais de que o aluno não entendeu
- Reinicia o banco para provar durabilidade.
- Cola saída sem execução.
- Cria um script novo em vez de ampliar o existente.
